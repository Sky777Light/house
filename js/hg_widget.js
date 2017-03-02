function GH_WIDGET(root_name) {
    this.root_name = root_name;
    this.root = $("#" + root_name)[0];
    $(this.root).append('<div id="web_gl_frame_' + root_name + '" style="width: 100%; height: 100%;"></div>');
    this.container = $("#web_gl_frame_" + root_name)[0];
    this.parts = {}; // parts of the scene for quick access
    this.materials = {}; // list of materials
    this.objects = {}; // list of objects
    this.textures = {}; // list of textures
    this.rooms = []; // array of the rooms
    this.out_textures = []; // array of the outdoor textures
    this.in_textures = []; // array of the indoor textures
    this.raycaster = new THREE.Raycaster();
    this.mouse_down = new THREE.Vector2();
    this.mouse = new THREE.Vector2();
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.is_fullscreen = false;
    this.iframe = 0;
    this.updateFlag = false;


    this.textures_path = "img/textures/";
    this.objects_path = "objects/";

    this.tex_names = ["cube", "floor_000.jpg", "floor_001.jpg", "floor_002.jpg", "floor_003.jpg", "floor_004.jpg",
        "ground.jpg", "alloy_sand_out.jpg", "alloy_sand_in.jpg", "grid.png",
        "planks.jpg", "planks_n.jpg", "marbel_white.jpg", "marbel_black.jpg", "grass01.png",
        "black_flat.jpg", "black_wavy.jpg", "red_flat.jpg", "red_wavy.jpg", "Wood16.jpg", "cloud10.png",
        "sidewalk_b.jpg", "sidewalk.jpg", "connector_b.jpg", "connector.jpg", "road.jpg", "ground_grid.jpg"
    ];

    var this_ = this;

    //this_.pult = new Pult(this_);

    this.onMouseDown = function(event) {
        this_.updateFlag = true;
        this_.mouse_down.x = event.clientX;
        this_.mouse_down.y = event.clientY;
    };

    this.onMouseUp = function(event) {
        this_.updateFlag = false;
        var mouse_up = new THREE.Vector2(event.clientX, event.clientY);
        if (mouse_up.distanceToSquared(this_.mouse_down) > 2.0) return;

        //if (this_.roof_mgr.is_selected)
        //    this_.roof_mgr.nextRoof();
        //else
        if (this_.track_mgr.selected_marker_idx !== -1) {
            this_.track_mgr.goToSelected();
        } else if (this_.sel_mgr.room !== undefined) {
            //if (this_.sel_mgr.sel_type === 0) {
            //    this_.room_mgr.nextWallMaterial(this_.sel_mgr.room);
            //} else
            if (this_.sel_mgr.sel_type === 1) {
                this_.room_mgr.nextFloorMaterial(this_.sel_mgr.room);
            }
        } else if (this_.sel_mgr.window_sill !== undefined) {
            this_.sel_mgr.nextSill();
        } else if (this_.sel_mgr.window_frame !== undefined) {
            this_.sel_mgr.nextFrame();
        }

    };

    this.onMouseMove = function(event) {
        var ax = (event.offsetX === undefined ? event.layerX : event.offsetX);
        var ay = (event.offsetY === undefined ? event.layerY : event.offsetY);
        this_.mouse.x = (ax / this_.renderer.domElement.clientWidth) * 2 - 1;
        this_.mouse.y = -(ay / this_.renderer.domElement.clientHeight) * 2 + 1;
        this_.raycaster.setFromCamera(this_.mouse, this_.camera);

        var intersects = this_.raycaster.intersectObjects(this_.scene.children, true);

        this_.track_mgr.selected_marker_idx = -1;
        this_.roof_mgr.is_selected = false;
        var is_sel = false;
        //for ( var i = 0; i < intersects.length; i++ )
        if (intersects.length > 0) {
            var obj = intersects[0].object.parent;
            //if (obj.name.substring(0, 5) === "roof_") {
            //    this_.roof_mgr.is_selected = true;
            //    is_sel = true;
            //} else
            if (obj.name.substring(0, 7) === "marker_") {
                this_.track_mgr.selected_marker_idx = parseInt(obj.name.substring(7, 10));
                is_sel = true;
            } else {
                var face = intersects[0].face;
                var mat_idx = face.materialIndex;
                var mat_name = face.daeMaterial;
                this_.sel_mgr.clearSelection();
                if (mat_name) {
                    var room;
                    //if ((room = this_.room_mgr.getRoomByWallMaterialName(mat_name)) !== undefined) {
                    //    this_.sel_mgr.room = room;
                    //    this_.sel_mgr.sel_type = 0;
                    //this_.sel_mgr.window_sill = undefined;
                    //this_.sel_mgr.window_frame = undefined;
                    //    is_sel = true;
                    //} else
                    if ((room = this_.room_mgr.getRoomByFloorMaterialName(mat_name)) !== undefined) {
                        this_.sel_mgr.room = room;
                        this_.sel_mgr.sel_type = 1;
                        //this_.sel_mgr.window_sill = undefined;
                        //this_.sel_mgr.window_frame = undefined;
                        is_sel = true;
                    } else if (mat_name.substring(0, 13) === "m_marble_sill") {
                        this_.sel_mgr.window_sill = obj.children[0].material;
                        //this_.sel_mgr.room = undefined;
                        //this_.sel_mgr.sel_type = -1;
                        is_sel = true;
                    } //else if (mat_name.substring(0, 14) === "m_window_frame") {
                    // this_.sel_mgr.window_frame = obj.children[0].material;
                    //this_.sel_mgr.room = undefined;
                    //this_.sel_mgr.sel_type = -1;
                    //is_sel = true;
                    // }
                }
                /*if (mat_name.substring(0, 12) === "m_room_wall_")
                {
                    this_.sel_mgr.m_room_wall = obj.children[0].material;
                    is_sel = true;
                }
                else if (mat_name.substring(0, 13) === "m_room_floor_")
                {
                    this_.sel_mgr.m_room_floor = obj.children[0].material;;
                    is_sel = true;
                }*/

                /*if (! is_sel)
                {
                    this_.sel_mgr.room = undefined;
                    this_.sel_mgr.sel_type = -1;
                    this_.sel_mgr.window_sill = undefined;
                    this_.sel_mgr.window_frame = undefined;

                }*/
            }
        }

        if (is_sel)
            this_.container.style.cursor = 'pointer';
        else
            this_.container.style.cursor = 'default';
    };


    this.load = function(scene_name, onLoaded, options) {
        // if (scene_name === this.scene_name) {
        //     console.log(onLoaded);
        //     return;
        // }
        this.scene_name = scene_name;
        this.onLoaded = onLoaded;
        this.progress_bar = new progressBar(this, options);

        this.parts = {};
        this.materials = {};
        this.objects = {};
        this.textures = {};
        this.rooms = [];
        this.out_textures = [];
        this.in_textures = [];
        this.floor_textures = [];

        this.loadTexture(0);
    };

    this.loadTexture = function(idx) {
        if (this.tex_names[idx] !== undefined) {
            // load cube texture
            var path,
                format,
                urls;
            if (this.tex_names[idx] === "cube") {
                path = this_.textures_path + "cube/";
                format = '.jpg';
                urls = [
                    path + 'posx' + format, path + 'negx' + format,
                    path + 'posy' + format, path + 'negy' + format,
                    path + 'posz' + format, path + 'negz' + format
                ];
                var textureLoader = new THREE.CubeTextureLoader();
                textureLoader.load(urls, function(texture) {
                    this_.textures.cube = texture;
                    this_.textures.cube.format = THREE.RGBFormat;
                    this_.materials.envCube = this_.textures.cube;
                    this_.progress_bar.refreshTexturesPos(idx + 1);
                    this_.loadTexture(idx + 1);
                });
            } else {
                var tex_loader = new THREE.TextureLoader();
                tex_loader.load(
                    this_.textures_path + this.tex_names[idx],
                    function(texture) {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        this_.textures[this_.tex_names[idx]] = texture;
                        this_.progress_bar.refreshTexturesPos(idx + 1);
                        this_.loadTexture(idx + 1);
                    }
                );
            }
        } else {
            this_.loadScene();
        }
    };

    this.loadScene = function() {
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load('./objects/' + this.scene_name, this_.onSceneLoaded, function(pos) {
            this_.progress_bar.refreshObjectPos(pos);
        });

    };

    this.setRoof = function(roof_type) {
        this_.roof_mgr.setRoof(roof_type);
    };

    this.setRoofMaterial = function(mat_type) {
        this_.roof_mgr.setRoofMaterial(mat_type);
    };

    this.getoutMat = function() {
        return this.out_textures;
    };

    this.getMaterial = function() {
        return this.materials;
    };

    this.getThis = function() {
        return this;
    };

    this.getDoorMgr = function() {
        return this.door_mgr;
    };

    this.setOutdoorWallMaterial = function(wall_idx, color, texture_idx) {
        var out_textures = this_.getoutMat();
        mat = this_.materials['m_out_wall_' + ("00" + wall_idx).slice(-3)];
        mat_plane = this_.materials['m_plane_wall_' + ("00" + wall_idx).slice(-3)];
        //texture_idx = texture_idx % this.out_textures.length;
        texture_idx = texture_idx % out_textures.length;

        if (mat !== undefined) {
          if (color !== undefined){
            mat.color = new THREE.Color(color);
          }
          if (texture_idx) {
            mat.map = out_textures[texture_idx];
          }
        }
        if (mat_plane !== undefined) {
            mat_plane.color = new THREE.Color(color);
        }
    };

    this.setPlateVisibility = function(isVisible) {
      if (isVisible[0] === 'false'){
        isVisible = false;
      } else {
        isVisible = true;
      }

      if (isVisible) {
        this_.setOutdoorWalls(['0 1 2 3 4 5 6 7 8 9 10 11 20 21', '#ffffff', 2]);
      } else {
        this_.setOutdoorWalls(['0 1 2 3 4 5 6 7 8 9 10 11 20 21', undefined, 1]);
      }

      for (var i = 0; i < this_.getOutdoorWallMaterialsCount(); i++) {
        this_.setPlaneVisibility(i,isVisible);
      }
    }

    this.setPlaneVisibility = function(wall_idx, is_visible) {
        /*var wall_plane = this.objects['plane_wall_' + ("00" + wall_idx).slice(-3)];
        if (wall_plane !== undefined)
            wall_plane.visible = is_visible;*/
        mat_plane = this_.materials['m_plane_wall_' + ("00" + wall_idx).slice(-3)];
        if (mat_plane !== undefined) {
            mat_plane.transparent = ! is_visible;
            mat_plane.opacity = 0;
        }
    };

    this.getOutdoorWallMaterialsCount = function() {
        return this_.outdoor_wall_materials_count;
    };

    this.setIndoorWallMaterial = function(room_idx, color, texture_idx) {
        mat = this_.materials['m_room_wall_' + ("00" + room_idx).slice(-3)];
        texture_idx = texture_idx % this.in_textures.length;
        if (mat !== undefined) {
            mat.color = new THREE.Color(color);
            if (texture_idx)
                mat.map = this.in_textures[texture_idx];
        }
    };

    this.setFloorMaterial = function(room_idx, texture_idx) {
        mat = this_.materials['m_room_floor_' + ("00" + room_idx).slice(-3)];
        texture_idx = texture_idx % this.floor_textures.length;
        if (mat !== undefined) {
            mat.map = this.floor_textures[texture_idx];
        }
    };

    this.setOutdoorWalls = function(walls, color, texture_idx) {
      if (walls) {
        if (walls.length > 2) {
          texture_idx = walls[2];
        }
        color = walls[1];
        walls = walls[0];
        walls = walls.split(" ");
        for (var i = 0; i < walls.length; i++) {
            this_.setOutdoorWallMaterial(walls[i], color, texture_idx);
        }
      }
    };

    this.setIndoorWalls = function(walls, color, texture_idx) {
      if (walls) {
        if (walls.length > 2) {
          texture_idx = walls[2];
        }
        color = walls[1];
        walls = walls[0];
        walls = walls.split(" ");
        for (var i = 0; i < walls.length; i++) {
            this_.setIndoorWallMaterial(walls[i], color, texture_idx);
        }
      }
    };

    this.setWindowFramesColor = function(color) {
      if (this.hg_widget){
        this.hg_widget.materials.m_window_frame.color = new THREE.Color(color.toString());
      }else{
        this.materials.m_window_frame.color = new THREE.Color(color.toString());
      }
    };

    this.setFrontDoorColor = function(color) {
      if (this.hg_widget){
        this.hg_widget.materials.m_front_door.color = new THREE.Color(color.toString());
      }else{
        this.materials.m_front_door.color = new THREE.Color(color.toString());
      }
    };

    this.setUnderRoofColor = function(color) {
      if (this.hg_widget){
        this.hg_widget.materials.m_under_roof.color = new THREE.Color(color.toString());
      }else{
        this.materials.m_under_roof.color = new THREE.Color(color.toString());
      }
    };

    this.showFrontDoor = function(num) {
        this_.getDoorMgr().showFrontDoor(num);
    };

    this.getFrontDoorsCount = function() {
        return this_.getDoorMgr().getFrontDoorsCount();
    };

    this.getJSONForOrder = function(icam_pos) {
        var wf_color = this.materials.m_window_frame.color;
        var out_walls_colors = [];
        for (var i = 0; i < this.getOutdoorWallMaterialsCount(); i++) {
            var wall_color = this_.materials['m_out_wall_' + ("00" + i).slice(-3)].color;
            out_walls_colors.push({
                color: {
                    r: wall_color.r,
                    g: wall_color.g,
                    b: wall_color.b
                }
            });
        }
        var prm = {
            house_type: this.scene_name.slice(0, -4),
            cam_pos: icam_pos,
            roof_type: this.roof_mgr.current_roof_idx,
            roof_texture: this.roof_mgr.texture_file_name,
            win_frame_color: {
                r: wf_color.r,
                g: wf_color.g,
                b: wf_color.b
            },
            out_walls: out_walls_colors
        };
        return JSON.stringify(prm);
    };

    this.onSceneLoaded = function(collada) {
        this_.createEnvironment(new THREE.Vector3(-10, 3, 11), collada.scene);
        this_.clock = new THREE.Clock();

        this_.fillMaterialsList();

        this_.parts.marker = this_.scene.getObjectByName("marker");

        this_.floor_mgr = new FloorMgr(this_);
        this_.track_mgr = new TrackMgr(this_);
        this_.roof_mgr = new RoofMgr(this_);
        this_.sel_mgr = new SelMgr(this_);
        this_.room_mgr = new RoomMgr(this_);
        this_.door_mgr = new DoorMgr(this_);

        this_.forEachObject(this_.scene, function(obj) {
            if (obj.name !== '' && (!(obj.name in this_.objects))) this_.objects[obj.name] = obj;
        });
        //console.log(this_.objects);


        //this_.generateGrass();

        if (this_.pult === undefined)
            this_.pult = new Pult(this_);

        // #### full screen button not needed now ####
        // $(this_.container).append('<div id="bt_size_' + this_.root_name + '" class="hg_bt_size"></div>');
        // this_.bt_size = $('#bt_size_' + this_.root_name).get(0);
        // this_.bt_size.style.background = "url(./img/full_size.svg) no-repeat";
        // $('#bt_size_' + this_.root_name).click(function() {
        //     if (this_.is_fullscreen)
        //         this_.exitFullScreen();
        //     else
        //         this_.enterFullscreen();
        // });

        this_.container.addEventListener('mousemove', this_.onMouseMove, false);
        this_.container.addEventListener('mousedown', this_.onMouseDown, false);
        this_.container.addEventListener('mouseup', this_.onMouseUp, false);

        if (this_.onLoaded)
            this_.onLoaded();

        this_.progress_bar.hide();
        this_.animate();
    };

    this.generateGrass = function() {
        var grass_points_geom = this_.objects.grass.children[0].geometry;
        var grass_new_geom = new THREE.Geometry();
        var grass_H = 0.4,
            grass_W = 0.6;
        for (var j = 0, i = 0; j < grass_points_geom.vertices.length; j++) {
            var v = new THREE.Vector3(grass_points_geom.vertices[j].x, // + drop * Math.random() - drop/2,
                grass_points_geom.vertices[j].y,
                grass_points_geom.vertices[j].z); // + drop * Math.random() - drop/2);
            var angle = Math.PI * 2 * Math.random();
            for (var k = 0; k < 2; k++, i++, angle += Math.PI / 2) {
                var angle_sin = grass_W * Math.sin(angle) / 2;
                var angle_cos = grass_W * Math.cos(angle) / 2;
                grass_new_geom.vertices.push(
                    new THREE.Vector3(v.x - angle_cos, v.y, v.z - angle_sin),
                    new THREE.Vector3(v.x - angle_cos, v.y + grass_H, v.z - angle_sin),
                    new THREE.Vector3(v.x + angle_cos, v.y + grass_H, v.z + angle_sin),
                    new THREE.Vector3(v.x + angle_cos, v.y, v.z + angle_sin)
                );

                grass_new_geom.faces.push(new THREE.Face3(i * 4, i * 4 + 1, i * 4 + 2));
                grass_new_geom.faces.push(new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 3));
                grass_new_geom.faces.push(new THREE.Face3(i * 4 + 2, i * 4 + 1, i * 4));
                grass_new_geom.faces.push(new THREE.Face3(i * 4 + 3, i * 4 + 2, i * 4));

                grass_new_geom.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);
                grass_new_geom.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)]);
                grass_new_geom.faceVertexUvs[0].push([new THREE.Vector2(1, 1), new THREE.Vector2(0, 1), new THREE.Vector2(0, 0)]);
                grass_new_geom.faceVertexUvs[0].push([new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 0)]);
            }
        }
        var material = new THREE.MeshPhongMaterial({
            map: this_.textures["grass01.png"],
            color: 'grey',
            //emissive  : 'darkgreen',
            alphaTest: 0.7,
            transparent: true
        });
        var mesh = new THREE.Mesh(grass_new_geom, material);

        this_.scene.add(mesh);
        mesh.position.setY(this_.objects.grass.position.y);
        mesh.parent = this_.objects.ground;
        this_.scene.remove(this_.objects.grass);
    };


    this.fillMaterialsList = function() {
        //this_.materials = new Object();
        //this_.materials = {};
        this_.forEachObject(this_.scene, function(obj) {
            if (obj.name !== '') this_.objects[obj.name] = obj;
            if (obj.children[0] === undefined || obj.children[0].material === undefined) return;
            var mat = obj.children[0].material;
            if (mat.materials === undefined) {
                if (mat.name === '') return;
                if (!(mat.name in this_.materials)) {
                    this_.materials[mat.name] = mat;
                }
            } else {
                for (var i = 0; i < mat.materials.length; i++) {
                    if (mat.materials[i].name === '') continue;
                    if (!(mat.materials[i].name in this_.materials))
                        this_.materials[mat.materials[i].name] = mat.materials[i];
                }
            }
        });

        this_.materials.marker_sel = new THREE.MeshPhongMaterial({
            color: 0xaf0000,
            specular: 0xffffff,
            blending: THREE.MultiplyBlending,
            transparent: true,
            shininess: 4,
            shading: THREE.FlatShading
        });
        this_.materials.marker_unsel = new THREE.MeshPhongMaterial({
            color: 0x00af00,
            specular: 0xffffff,
            blending: THREE.MultiplyBlending,
            transparent: true,
            shininess: 4,
            shading: THREE.FlatShading
        });

        if (this_.materials.m_glass) {
            this_.materials.m_glass.color = new THREE.Color(0.1, 0.1, 0.1);
            this_.materials.m_glass.reflectivity = 0.6;
            this_.materials.m_glass.opacity = 0.1;
            this_.materials.m_glass.shininess = 1;
            this_.materials.m_glass.blending = THREE.AdditiveBlending;
            this_.materials.m_glass.envMap = this_.materials.envCube;
            this_.materials.m_glass.combine = THREE.MixOperation;
            this_.materials.m_glass.transparent = true;
        }

        if (this_.materials.chrome) {
            this_.materials.chrome.envMap = this_.materials.envCube;
            this_.materials.chrome.combine = THREE.MixOperation;
            this_.materials.chrome.shininess = 10;
            this_.materials.chrome.reflectivity = 0.3;
        }

        if (this_.materials.m_gravel)
            this_.materials.m_gravel.bumpMap = this_.materials.m_gravel.map;

        if (this_.materials.m_sidewalk) {
            this_.materials.m_sidewalk.map = this_.textures["sidewalk.jpg"];
            this_.materials.m_sidewalk.bumpMap = this_.textures["sidewalk_b.jpg"];
            this_.materials.m_sidewalk.bumpScale = 0.07;
            this_.materials.m_sidewalk.shininess = 5;
        }

        if (this_.materials.m_road) {
            this_.materials.m_road.map = this_.textures["road.jpg"];
            //this_.materials.m_road.bumpMap = this_.textures["road.jpg"];
            //this_.materials.m_road.bumpScale = 0.07;
            this_.materials.m_road.shininess = 4;
        }

        if (this_.materials.grass) {
            this_.materials.grass.map = this_.textures["ground.jpg"];
            this_.materials.grass.bumpMap = this_.textures["ground.jpg"];
            this_.materials.grass.bumpScale = 0.01;
            this_.materials.grass.shininess = 4;
        }

        if (this_.materials.m_ground_grid) {
        	this_.materials.m_ground_grid.map = this_.textures["ground_grid.jpg"];
        	this_.materials.m_ground_grid.shininess = 4;
        }

        if (this_.materials.grid) {
            this_.materials.grid.map = this_.textures["grid.png"];
            this_.materials.grid.transparent = true;

            this_.materials.terrasa.map = this_.textures["planks.jpg"];
            this_.materials.terrasa.normalMap = this_.textures["planks_n.jpg"];
            this_.materials.terrasa.combine = THREE.MultiplyOperation;
            this_.materials.grass.shininess = 8;
        }

        if (this_.materials.m_metal_leaf) {
            this_.materials.m_metal_leaf.color = new THREE.Color("#aaaaaa");
            this_.materials.m_metal_leaf.map = this_.textures["connector.jpg"];
            this_.materials.m_metal_leaf.bumpMap = this_.textures["connector_b.jpg"];
            this_.materials.m_metal_leaf.bumpScale = -0.02;
            this_.materials.m_metal_leaf.shininess = 7;
        }

        this_.materials.m_marble_sill.map = this_.textures["marbel_white.jpg"];

        this_.materials.m_wall.color = new THREE.Color("rgb(255,255,255)");
        this_.materials.m_wall.map = this_.textures["alloy_sand_out.jpg"];
        this_.materials.m_wall.combine = THREE.MixOperation;

        // fill outdoor textures list
        this_.out_textures[0] = this_.textures["alloy_sand_out.jpg"];
        this_.out_textures[1] = this_.textures["alloy_sand_in.jpg"];
        this_.out_textures[2] = this_.textures["Wood16.jpg"];

        // fill indoor textures list
        this_.in_textures[0] = this_.textures["alloy_sand_in.jpg"];
        this_.in_textures[1] = this_.textures["alloy_sand_out.jpg"];

        // fill floor textures list
        this_.floor_textures[0] = this_.textures["floor_000.jpg"];
        this_.floor_textures[1] = this_.textures["floor_001.jpg"],
        this_.floor_textures[2] = this_.textures["floor_002.jpg"];
        this_.floor_textures[3] = this_.textures["floor_003.jpg"];
        this_.floor_textures[4] = this_.textures["floor_004.jpg"];

        this.outdoor_wall_materials_count = 0;
        for (mat in this_.materials) {
            if (mat.substring(0, 11) === "m_out_wall_") {
                this_.materials[mat].copy(this_.materials.m_wall);
                this_.materials[mat].name = mat;
                this_.outdoor_wall_materials_count++;
            }
        }
    };

    this.forEachObject = function(obj, func) {
        func(obj);
        for (var i = 0; i < obj.children.length; i++) {
            this_.forEachObject(obj.children[i], func);
        }
    };


    this.animate = function() {
        this_.iframe++;
        if((this_.iframe % 2 == 0 && this_.updateFlag) || this_.iframe % 10 == 0){
            this_.scene.updateMatrixWorld();
            this_.track_mgr.update();
            this_.floor_mgr.update();
            this_.door_mgr.update();
            //this_.env_mgr.update();
            this_.controls.update();
            THREE.AnimationHandler.update(this_.clock.getDelta());
            this_.renderer.render(this_.scene, this_.camera);
        }
        requestAnimationFrame(this_.animate);
    };


    this.isWebGLActive = function() {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    };

    this.makeWebGLSnapshot = function(scale = 1) {
        snap_renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        });
        snap_renderer.setSize(this_.container.clientWidth * scale, this_.container.clientHeight * scale);
        snap_renderer.setClearColor(0x000000, 1);
        snap_renderer.physicallyCorrectLights = true;
        snap_renderer.gammaInput = true;
        snap_renderer.gammaOutput = true;
        snap_renderer.render(this_.scene, this_.camera);

        window.open(snap_renderer.domElement.toDataURL("image/png"), "Snapshot");
    }

    this.setSize = function(width, height) {
        if (width === undefined) {
          width = 600;
        }

        if (height === undefined) {
          width = 600;
        }
        this_.width = width;
        this_.height = height;
        this_.root.style.width = width + "px";
        this_.root.style.height = height + "px";

        this_.camera.aspect = this_.width / this_.height;
        this_.camera.updateProjectionMatrix();
        this_.renderer.setSize(this_.width, this_.height);
    };

    this.exitFullScreen = function() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        this_.bt_size.style.background = "url(./img/full_size.svg) no-repeat";
    };

    this.enterFullscreen = function() {
        if (this_.root.requestFullScreen) {
            this_.root.requestFullScreen();
        } else if (this_.root.mozRequestFullScreen) {
            this_.root.mozRequestFullScreen();
        } else if (this_.root.webkitRequestFullScreen) {
            this_.root.webkitRequestFullScreen();
        }
        this_.bt_size.style.background = "url(./img/small_size.svg) no-repeat";
    };

    this.onFullScreenChange = function(e) {
        var fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;
        var fullscreenEnabled = document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled;
        this_.is_fullscreen = !this_.is_fullscreen;
        if (this_.is_fullscreen) {
            this_.camera.aspect = screen.width / screen.height;
            this_.camera.updateProjectionMatrix();
            this_.renderer.setSize(screen.width, screen.height);
        } else {
            this_.camera.aspect = this_.width / this_.height;
            this_.camera.updateProjectionMatrix();
            this_.renderer.setSize(this_.width, this_.height);
        }
    };

    this.createEnvironment = function(camera_position, dae) {
        this_.camera = new THREE.PerspectiveCamera(45,
            this_.container.clientWidth / this_.container.clientHeight, 0.01, 2000000);
        this_.camera.position.set(camera_position.x, camera_position.y, camera_position.z);

        this_.scene = new THREE.Scene();

        if (this_.env_mgr === undefined) {
            this_.renderer = Detector.webgl? new THREE.WebGLRenderer({ antialias: true }): new THREE.CanvasRenderer();

            //this_.renderer = new THREE.WebGLRenderer();
            this_.renderer.setSize(this_.container.clientWidth, this_.container.clientHeight);
            this_.renderer.setClearColor(0xffffff, 1);
            this_.renderer.physicallyCorrectLights = true;
            this_.renderer.gammaInput = true;
            this_.renderer.gammaOutput = true;

            this_.container.appendChild(this_.renderer.domElement);
        }

        this_.controls = new THREE.OrbitControls(this_.camera, this_.renderer.domElement);
        this_.controls.enableDamping = true;
        this_.controls.dampingFactor = 0.25;
        this_.controls.enableZoom = true;
        this_.controls.minPolarAngle = Math.PI * 10 / 180;
        this_.controls.maxPolarAngle = Math.PI / 2.0;
        this_.controls.enablePan = false;
        this_.controls.minDistance = 6.0;
        this_.controls.maxDistance = 20.0;



        this_.scene.add(dae);

        document.addEventListener("webkitfullscreenchange", this_.onFullScreenChange);
        document.addEventListener("mozfullscreenchange", this_.onFullScreenChange);
        document.addEventListener("fullscreenchange", this_.onFullScreenChange);

        this_.env_mgr = new EnvironmentMgr(this_);
        //skybox.position.y = 500;
    };


}
