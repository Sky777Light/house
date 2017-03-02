"use strict";

function SLIDES_2D_VIEWER(img_prefix, root_name, frames_count = 25) {
  this.root_name = root_name;
  this.root = $("#" + root_name)[0];
  this.img_prefix = img_prefix; //"h_0002_";
  this.frames_count = frames_count;
  this.img_list = [this.frames_count];
  this.current_frame = 0;
  this.loaded_frames_count = 0; // count of really loaded frames
  //this.arrows = undefined;
  this.auto_rotate = true; // on/off autorotation
  this.width = this.root.clientWidth;
  this.height = this.root.clientHeight;
  $("#" + this.root_name).append('<canvas id="' + this.root_name + '_canvas" width="' +
    this.width + 'px" height="' + this.height + 'px"></canvas>');
  this.hv_canvas = $('#' + this.root_name + '_canvas').get(0);
  this.hv_context = this.hv_canvas.getContext("2d");
  this.mouse = {
    x: 0,
    y: 0,
    prew_x: 0,
    prew_y: 0,
    pos_x: 0,
    btn_pushed: false
  };

  var this_ = this;
  this.getNewPos = function() {
    var new_pos = Math.floor(this_.mouse.pos_x);
    if (new_pos < 0)
      new_pos = this_.frames_count - Math.floor((-new_pos) % this_.frames_count);
    return new_pos % this_.frames_count;
  };

  this.onMouseDown = function(event) {
    this_.mouse.x = this_.mouse.prew_x = event.clientX;
    this_.mouse.y = this_.mouse.prew_y = event.clientY;
    this_.mouse.btn_pushed = true;
    this_.auto_rotate = false;
  };

  this.onMouseUp = function(event) {
    var mouse_up = {
      x: event.clientX,
      y: event.clientY
    };
    this_.mouse.x = event.clientX;
    this_.mouse.y = event.clientY;
    this_.mouse.btn_pushed = false;
    this_.current_frame = this_.getNewPos();
  };

  this.onMouseMove = function(event) {
    this_.mouse.x = event.clientX;
    this_.mouse.y = event.clientY;
    if (this_.mouse.btn_pushed) {
      this_.mouse.pos_x += (this_.mouse.x - this_.mouse.prew_x) / 10;
      var new_pos = this_.getNewPos();
      //this_.arrows = undefined;
      this_.render();
    }
    this_.mouse.prew_x = this_.mouse.x;
    this_.mouse.prew_y = this_.mouse.y;
  };

  this.render = function() {
    this_.hv_context.drawImage(this_.img_list[this_.getNewPos()], 0, 0, this.width, (600 / 1000) * this.width);
    //if (this_.arrows !== undefined)
    //  this_.hv_context.drawImage(this_.arrows, (this_.width - this_.arrows.width) / 2,
    //    (this_.height - this_.arrows.height));
    if (this_.loaded_frames_count < this_.frames_count) {
      var w = 3,
        h = 7;
      var x = 5,
        y = 4;
      for (var i = 0; i < this_.frames_count; i++) {
        this_.hv_context.fillStyle = (i <= this_.loaded_frames_count) ? "#ff0000" : "#cccccc";
        this_.hv_context.fillRect(x, y, w, h);
        x += w + 2;
      }
    }
  };

  this.animate = function() {
    if (this_.auto_rotate) {
      requestAnimationFrame(this_.animate);
      this_.mouse.pos_x += 0.05;
      this_.render();
    }
  }

  this.img_list[0] = new Image();
  this.img_list[0].onload = function() {

    //this_.arrows = new Image();
    //this_.arrows.onload = function() {
    //  this_.render();
    //}
    //this_.arrows.src = "./img/arrows.svg";
    this_.loaded_frames_count++;
    this_.render();
  }
  this.img_list[0].src = this.img_prefix + "00.jpg";


  var i = 1, j = this.frames_count - 1;
  while (i <= j) {
    this.img_list[i] = new Image();
    this.img_list[i].onload = function() {
      this_.loaded_frames_count++;
      this_.render();
    }

    this.img_list[i].src = this.img_prefix + ("0" + i).slice(-2) + ".jpg";


    if (i === j)
      break;

    this.img_list[j] = new Image();
    this.img_list[j].onload = function() {
      this_.loaded_frames_count++;
      this_.render();
    }
    this.img_list[j].src = this.img_prefix + ("0" + j).slice(-2) + ".jpg";

    ++i;
    --j;
  }


  this.hv_canvas.addEventListener("mousemove", this.onMouseMove, false);
  this.hv_canvas.addEventListener("mousedown", this.onMouseDown, false);
  this.hv_canvas.addEventListener("mouseup", this.onMouseUp, false);

  this.animate();
};
