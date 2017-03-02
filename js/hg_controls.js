function Pult(kernel) {
    this.kernel = kernel;

    $(this.kernel.container).append('<div id="hg_pult_' + this.kernel.root_name + '" class="hg_pult"></div>');
    this.pult = $('#hg_pult_' + this.kernel.root_name).get(0);
    this.state = 0;
    this.eg = false;
    this.ch_X_ray = {};
    this.ch_floor = new Array(2);
    var this_ = this;

    $(this.pult).append('<button id="bt_floor_plan" class="hg_button_pult">Ansicht</button>');

    this_.ch_X_ray.checked = false;
    this_.ch_floor[0] = {};
    this_.ch_floor[1] = {};
    this_.ch_floor[0].checked = true;
    this_.ch_floor[1].checked = true;

    this.kernel.container.ch_X_ray = this.ch_X_ray;

    $('#bt_floor_plan').click(function(e) {
      if (this_.ch_X_ray.checked){
        if (this_.eg) {
          this_.ch_X_ray.checked = false;
          this_.eg = false;
          $(e.target).text("Grundriss EG");
        }else{
          $(e.target).text("Ansicht");
          this_.eg = true;
        }
        this_.ch_floor[1].checked = true;
      }
      else {
        this_.ch_X_ray.checked = true;
        this_.ch_floor[1].checked = false;
        $(e.target).text("Grundriss OG");
      }
    });

    /* not used for now

    // X-ray checker
    $(this.pult).append('<input id="ch_X_ray" type="checkbox">');
    $(this.pult).append('<label class="hg_ch_box">X-ray</label>');
    this.ch_X_ray = $('#hg_pult_' + this.kernel.root_name + ' #ch_X_ray').get(0);

    // floor checker
    this.ch_floor = new Array(2);
    $(this.pult).append('<input id="ch_floor_1" type="checkbox" checked>');
    $(this.pult).append('<label class="hg_ch_box">fl: 2</label>');
    $('#hg_pult_' + this_.kernel.root_name + ' #ch_floor_1').click(function() {
        if ((!this_.ch_floor[1].checked) && (!this_.ch_floor[0].checked))
            this_.ch_floor[0].checked = true;
    });
    this.ch_floor[1] = $('#hg_pult_' + this_.kernel.root_name + ' #ch_floor_1').get(0);

    $(this.pult).append('<input id="ch_floor_0" type="checkbox" checked>');
    $(this.pult).append('<label class="hg_ch_box">fl: 1</label>');
    $('#hg_pult_' + this_.kernel.root_name + ' #ch_floor_0').click(function() {
        if ((!this_.ch_floor[1].checked) && (!this_.ch_floor[0].checked))
            this_.ch_floor[1].checked = true;
    });
    this.ch_floor[0] = $('#hg_pult_' + this_.kernel.root_name + ' #ch_floor_0').get(0);

    // in/out switcher
    $(this.pult).append('<button id="bt_in_out" class="hg_button">In</button>');
    $('#hg_pult_' + this_.kernel.root_name + ' #bt_in_out').click(function(e) {
        if (this_.state === 0) {
            this_.kernel.track_mgr.goInside();
            //$('#bt_in_out').text("Out");
            $(e.target).text("Out");
            this_.kernel.pult.state = 1;
        } else if (this_.state === 1) {
            this_.kernel.track_mgr.goOutside();
            //$('#bt_in_out').text("In");
            $(e.target).text("In");
            this_.kernel.pult.state = 0;
        }
    });

    not used for now */

    // light switcher
   /* $(this.pult).append('<button id="bt_day_light" class="hg_button">' +
        this_.kernel.env_mgr.getState().caption + '</button>');

    $('#hg_pult_' + this_.kernel.root_name + ' #bt_day_light').click(function(e) {
        this_.kernel.env_mgr.nextState();
        $(e.target).text(this_.kernel.env_mgr.getState().caption);
    });*/
    $(this.kernel.container).append('<div id="bt_light_' + this.kernel.root_name + '" class="hg_bt_light"></div>');
    this.hg_bt_light = $('#bt_light_' + this.kernel.root_name).get(0);
    this.hg_bt_light.style.background = "url(./img/moon_light.svg) no-repeat";
    $('#bt_light_' + this_.kernel.root_name).click(function(e) {
        this_.kernel.env_mgr.nextState();
        if (this_.kernel.env_mgr.state === 0)
            this_.hg_bt_light.style.background = "url(./img/moon_light.svg) no-repeat";
        else
            this_.hg_bt_light.style.background = "url(./img/sun_light.svg) no-repeat";
        //$(e.target).text(this_.kernel.env_mgr.getState().caption);
    });


}

function progressBar(kernel, options) {
    this.kernel = kernel;
    $(this.kernel.container).append('<div id="hg_progress_' + this.kernel.root_name + '" class="hg_gl_progress_frame"></div>');
    this.options = options;
    if (this.options === undefined)
        this.options = {
            progress: "<p><b>Progress</b></p>",
            textures: "textures: ",
            object: "object: ",
            bg_url: undefined
        };
    this.frame = $('#hg_progress_' + this.kernel.root_name)[0];
    if (this.options.bg_url !== undefined)
        $('#hg_progress_' + this.kernel.root_name).css('background', this.options.bg_url);

    var title = document.createElement('p');
    title.innerHTML = this.options["progress"];
    this.frame.appendChild(title);
    this.textures_num = document.createElement('p');
    //this.frame.appendChild(this.textures_num);
    this.loading_image = document.createElement('img');
    this.loading_image.src =  "/img/house2.gif";
    this.loading_image.style =  "width: 60px;";
    this.loading_image.class =  "loading-image";
    this.loading_image.width =  "60";
    this.frame.appendChild(this.loading_image);
    this.object_pos = document.createElement('p');
    this.frame.appendChild(this.object_pos);


    this.refreshTexturesPos = function(idx) {
        this.textures_num.innerHTML = this.options["textures"] + idx + "/" + this.kernel.tex_names.length;
    };
    this.refreshObjectPos = function(pos) {
        this.object_pos.innerHTML = this.options["object"] + Math.round(pos.loaded / pos.total * 100) + "%";
    };
    this.hide = function() {
        this.frame.remove();
    };
}
