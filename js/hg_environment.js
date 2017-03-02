
/*
function Clouds(kernel) {
    this.kernel = kernel;
    var this_ = this;

    this.steamRadius = 2000;
    this.particlesCount = 280;
    var uniforms = {
            color:     { type: "c", value: new THREE.Color( 0xffff44 ) },
            texture:   { type: "t", value: this.kernel.textures['cloud10.png'] }
    };

    this.shaderMaterial = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   document.getElementById( 'vs' ).textContent,
            fragmentShader: document.getElementById( 'fs' ).textContent,

            blending:       THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            alphaTest: true,
            opacity: 1,
            transparent:    true
    });

    //this.lifes = new Float32Array( this.particlesCount );
    this.velocitys = new Float32Array( this.particlesCount );
    this.positions = new Float32Array( this.particlesCount * 3 );
    this.colors = new Float32Array( this.particlesCount * 3 );
    this.sizes = new Float32Array( this.particlesCount );
    this.alphas = new Float32Array( this.particlesCount );

    // reset parameters of one particle
    this.setParticle = function(i)
    {
            var i3 = i * 3;
            var alpha = Math.random()*Math.PI;
            var beta = Math.random()*Math.PI;
            var r_radius = this.steamRadius + Math.random() * 20;

            this.positions[i3] = 2 * r_radius * Math.sin(alpha) * Math.cos(beta);
            this.positions[i3+1] = r_radius * Math.sin(alpha) * Math.sin(beta);
            this.positions[i3+2] = 2 * r_radius * Math.cos(alpha);

            this.colors[ i3 + 0 ] = 1;
            this.colors[ i3 + 1 ] = 1;
            this.colors[ i3 + 2 ] = 1;

            this.sizes[ i ] = this.steamRadius*2 + Math.random() * this.steamRadius * 4;

            this.alphas[ i ] = 0.1;
    };

    for ( var i = 0; i < this.particlesCount; i++)
    {
            this.setParticle(i);
            //this.velocitys[i] = Math.random()*0.01+0.01;
            //this.lifes[i] = Math.random()+5;
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
    this.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
    this.geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );
    this.geometry.addAttribute( 'alpha', new THREE.BufferAttribute( this.alphas, 1 ) );
    this.particleSystem = new THREE.Points( this.geometry, this.shaderMaterial );
    this.particleSystem.sortParticles = true;

    this.kernel.scene.add( this.particleSystem );
}
*/
function EnvironmentMgr(kernel) {
    this.kernel = kernel;

    var this_ = this;
    this.kernel.scene.updateMatrixWorld();

    //this.kernel.renderer.shadowMapEnabled = true;

    this.pointLight = new THREE.PointLight(0xfff6e4, 0.7, 0, 2);
    this.kernel.scene.add(this.pointLight);


    // this.pointLight = new THREE.DirectionalLight( 0x555555, 0.2 );
    //  this.pointLight.position.set( 1, 1, 1 ).normalize();
    //  this.kernel.scene.add( this.pointLight );
    //var light2 = new THREE.DirectionalLight( 0xffffff );
    //light2.position.set( -1, -1, -1 ).normalize();
    //this.kernel.scene.add( light2 );

    this.pointLight.parent = this.kernel.camera;

    //  this.ambientLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.9 );
    //              this.ambientLight.color.setHSL( 0.9, 0.9, 0.9 );
    //              this.ambientLight.groundColor.setHSL( 0.6, 0.8, 0.8 );
    //              this.ambientLight.position.set( 0, 50, 0 );
    //              this.kernel.scene.add( this.ambientLight );


    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.kernel.scene.add(this.ambientLight);

    // scaning for the lights
    this.lights = [];
    this.floor_null_children = this.kernel.scene.getObjectByName("floor_null").children;
    for (var i = 0; i < this.floor_null_children.length; i++) {
        if (this.floor_null_children[i].name.substring(0, 6) === "light_") {
            var light = new THREE.PointLight(0xfffbbb, 0.7, 10, 2);
            //light.castShadow = true;
            this.kernel.scene.add(light);
            var w_lt_pos = new THREE.Vector3();
            w_lt_pos.setFromMatrixPosition(this.floor_null_children[i].matrixWorld);

            light.position.set(w_lt_pos.x, w_lt_pos.y, w_lt_pos.z);
            this.lights.push(light);
        }
    }


    //this.clouds = new Clouds(this.kernel);
    //parts.steam.particleSystem.parent = scene.getObjectByName("steam");
/*
    var geometry = new THREE.SphereGeometry(3000, 60, 40);
    var uniforms = {
      texture: { type: 't', value: THREE.ImageUtils.loadTexture(this.kernel.textures_path + "cube/145-hdri-skies_night.jpg") }
    };

    var material = new THREE.ShaderMaterial( {
      uniforms:       uniforms,
      vertexShader:   document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-fragment').textContent
    });

    skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 1000.0;
    this.kernel.scene.add(skyBox);
*/

    // init sky options
  /*  this.sky = new THREE.Sky();
    this.kernel.scene.add( this.sky.mesh );
    var uniforms = this.sky.uniforms;
    uniforms.turbidity.value = 10;
    uniforms.reileigh.value = 2.5;
    uniforms.luminance.value = 2;
    //uniforms.luminance.value = 0.6;
    uniforms.mieCoefficient.value = 0.04;
    uniforms.mieDirectionalG.value = 0.8;
*/
    this.state = 1;
    this.states = [
        {
            caption: "noon",
            intensity: 3,
            sceneColor: 0xffffff,
            //inclination: 0.2,
            inclination: 0,
            azimuth: 0.2
        },
        {
            caption: "night",
            intensity: 0.1,
            sceneColor: 0x96989b,
            inclination: 0.50,
            azimuth: 0.65
        }
                 ];
    this.getState = function() {
        return this_.states[this_.state];
    };
    this.nextState = function() {
        this_.state = (++this.state) % 2;
        this_.ambientLight.intensity = this_.getState().intensity;
        this_.kernel.renderer.setClearColor(this_.getState().sceneColor);
        // calculate sun position
      /*  var theta = Math.PI * ( this_.getState().inclination - 0.5 );
        var phi = 2 * Math.PI * ( this_.getState().azimuth - 0.5 );
        var uniforms = this.sky.uniforms;
        var sunPosition = new THREE.Vector3(0.0, -700000, 0.0);
        var distance = 400000;
        sunPosition.x = distance * Math.cos( phi );
        sunPosition.y = distance * Math.sin( phi ) * Math.sin( theta );
        sunPosition.z = distance * Math.sin( phi ) * Math.cos( theta );

        this_.sky.uniforms.sunPosition.value.copy( sunPosition );
*/
        for (var i = 0; i < this.lights.length; i++)
            this_.lights[i].intensity = (this.state === 1) ? 3.0 : 0.0;
    };
    
    this.nextState();

}
