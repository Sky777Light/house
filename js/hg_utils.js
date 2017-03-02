function DoorMgr(kernel) {
    this.kernel = kernel;
    var this_ = this;
    this.doors = [];
    this.front_doors = [];

    // fill list doors
    for (var obj_name in this.kernel.objects) {
        if (obj_name.substring(0, 18) === "front_door_object_") {
            var num = parseInt(obj_name.substring(19, 21));
            if (this.front_doors[num] === undefined) {
                this.front_doors[num] = this.kernel.objects[obj_name];
            }
        } else if (obj_name.substring(0, 12) === "door_object_") {
            var num = parseInt(obj_name.substring(13, 15));
            if (this.doors[num] === undefined) {
                var door_object = this.kernel.objects[obj_name];
                var door_frame = door_object.parent;
                this.doors[num] = {
                    door: door_object,
                    frame: door_frame,
                    angle: 0.0,
                    position: new THREE.Vector3()
                };
                this.doors[num].position.setFromMatrixPosition(door_frame.matrixWorld);
            }
        }
    }

    this.showFrontDoor = function(num) {
        num %= this.front_doors.length;
        for (var i = 0; i < this.front_doors.length; i++) {
            this.front_doors[i].visible = (num === i);
        }
    };

    this.getFrontDoorsCount = function() {
        return this.front_doors.length;
    };

    this.showFrontDoor(0);

    this.addDoor = function(door_name) {
        return undefined;
    };

    this.update = function() {
        var cam_pos = new THREE.Vector3();
        cam_pos.setFromMatrixPosition(this.kernel.camera.matrixWorld);
        for (var i = 0; i < this.doors.length; i++) {
            // chek distance to camera
            if (this.doors[i].position.distanceToSquared(cam_pos) < 2) {
                this.doors[i].door.rotation.y += 0.01;
                this.doors[i].door.rotation.y = Math.min(Math.PI / 2, this.doors[i].door.rotation.y);
            } else {
                this.doors[i].door.rotation.y -= 0.01;
                this.doors[i].door.rotation.y = Math.max(0.0, this.doors[i].door.rotation.y);
            }
        }
    };
}

function RoomMgr(kernel) {
    this.kernel = kernel;
    var this_ = this;
    this.rooms = [];

    //default indoor color
    this.colors = [new THREE.Color("rgb(255,255,255)"),
					new THREE.Color(0.7, 0.7, 0),
					new THREE.Color(0.7, 0, 0),
					new THREE.Color(0, 0.7, 0),
					new THREE.Color(0, 0, 0.7),
					new THREE.Color(0.7, 0, 0.7)];

    this.getRoom = function(idx) {
        if (this_.rooms[idx] === undefined) {
            this_.rooms[idx] = {};
            this_.rooms[idx].index = idx;
            this_.rooms[idx].wall_idx = 0;
            this_.rooms[idx].floor_idx = 0;
        }
        return this_.rooms[idx];
    };

    this.getRoomByWallMaterialName = function(mat_name) {
        if (mat_name.substring(0, 12) === "m_room_wall_") {
            var mat_num = parseInt(mat_name.substring(13, 15));
            return this.getRoom(mat_num);
        } else
            return undefined;
    };

    this.getRoomByFloorMaterialName = function(mat_name) {
        if (mat_name.substring(0, 13) === "m_room_floor_") {
            var mat_num = parseInt(mat_name.substring(14, 16));
            return this.getRoom(mat_num);
        } else
            return undefined;
    };

    //this.floor_tex_list = [this.kernel.textures["floor_000.jpg"],
	//						this.kernel.textures["floor_001.jpg"],
	//						this.kernel.textures["floor_002.jpg"]];
    for (var mat_name in this_.kernel.materials) {
        var mat = this_.kernel.materials[mat_name];
        var room;
        if ((room = this_.getRoomByWallMaterialName(mat_name)) !== undefined) {
            mat.map = this_.kernel.textures["alloy_sand_in.jpg"];
            mat.color = this_.colors[room.wall_idx];
            mat.combine = THREE.MixOperation;
            room.wall_material = mat;
        } else if ((room = this_.getRoomByFloorMaterialName(mat_name)) !== undefined) {
            mat.map = this_.kernel.textures["floor_000.jpg"];
            mat.combine = THREE.MixOperation;
            room.floor_material = mat;
        }
    }

    this.nextWallMaterial = function(room) {
        //room.wall_idx = ((room.wall_idx + 1) % this_.colors.length);
        //room.wall_material.color = this_.colors[room.wall_idx];
    };

    this.nextFloorMaterial = function(room) {
        //room.floor_idx = ((room.floor_idx + 1) % this_.floor_tex_list.length);
        //room.floor_material.map = this_.floor_tex_list[room.floor_idx];
    };
}

function SelMgr(kernel) {
    this.kernel = kernel;
    //this.m_room_wall = undefined;
    //this.m_room_floor = undefined;
    //this.room = -1;
    //this.sel_type = -1; // -1 - none, 0 - wall, 1 - floor
    //this.window_sill = undefined;
    //this.window_frame = undefined;

    this.clearSelection = function() {
        this.room = undefined;
        this.sel_type = -1; // -1 - none, 0 - wall, 1 - floor
        this.window_sill = undefined;
        this.window_frame = undefined;
    };

    this.clearSelection();

    this.window_sill_idx = 0;
    this.nextSill = function() {
        this.window_sill_idx = (this.window_sill_idx + 1) % 2;
        this.kernel.materials.m_marble_sill.map =
            (this.window_sill_idx === 0) ? this.kernel.textures["marbel_white.jpg"] : this.kernel.textures["marbel_black.jpg"];
    };

    this.window_frame_idx = 0;
    this.nextFrame = function() {
       // this.window_frame_idx = (this.window_frame_idx + 1) % 2;
       // this.kernel.materials.m_window_frame.color =
       //     (this.window_frame_idx === 0) ? new THREE.Color(0.14, 0.14, 0.14) : new THREE.Color(0.9, 0.9, 0.9);
    };

    this.chooseTexture = function() {
        /*$(this.kernel.container).prepend('<div id="hg_dialog" class="hg_dialog"></div>');
	    this.dialog = $('#hg_dialog').get(0);

	    $(this.dialog).append('<div id="hg_dialog_content" class="hg_dialog_content"></div>');
	    this.content = $('#hg_dialog_content').get(0);
	    $(this.dialog).append('<div id="hg_dialog_buttons" class="hg_dialog_buttons"></div>');
	    this.buttons = $('#hg_dialog_buttons').get(0);
	    $(this.buttons).append('<button id="bt_dialog_ok" class="hg_button">Ok</button>');
	    $(this.buttons).append('<button id="bt_dialog_cancel" class="hg_button">Cancel</button>');*/
    };
}

function RoofMgr(kernel) {
    this.kernel = kernel;
    this_ = this;
    this.current_roof_idx = 0;
    this.is_selected = false;
    this.roof_null = kernel.scene.getObjectByName("roof_null");
    this.roof_count = this.roof_null.children.length;
    this.texture_file_name = "red_wavy.jpg";
    for (var i = 0; i < this.roof_count; i++) {
        var roof = this.roof_null.children[i];
        roof.visible = (this.current_roof_idx === i);
    }

    this.nextRoof = function() {
        this_.current_roof_idx = (this_.current_roof_idx + 1) % this_.roof_count;
        for (var i = 0; i < this_.roof_count; i++)
            this_.roof_null.children[i].visible = (this_.current_roof_idx === i);
    };

    this.setRoof = function(roof_type) {
        this_.current_roof_idx = roof_type % this_.roof_count;
        for (var i = 0; i < this_.roof_count; i++)
            this_.roof_null.children[i].visible = (this_.current_roof_idx === i);
    };

    this.setRoofMaterial = function(mat_type) {
        this_.texture_file_name = mat_type + ".jpg";
        this_.kernel.materials.m_roof.map = this_.kernel.textures[this.texture_file_name];
       // if (mat_type.indexOf('wavy') != -1)
       //     this_.kernel.materials.m_roof.normalMap = this_.kernel.textures["roof_wavy_n.jpg"];
       // else
       //     this_.kernel.materials.m_roof.normalMap = this_.kernel.textures["roof_flat_n.jpg"];
       // this_.kernel.materials.m_roof.combine = THREE.MultiplyOperation;
    };
}

function Wall(wall, kernel) {
    this.wall = wall;
    //this.wall.castShadow = true;
    this.kernel = kernel;
    this.floor = wall.parent;
    this.normal = new THREE.Vector2(this.wall.position.x, this.wall.position.z);
    /*	this.material = this.kernel.materials.room_wall.clone();

    	var mat = this.wall.children[0].material;
    	if (mat.materials !== undefined)
    	{
    		for (var i = 0; i < mat.materials.length; i++)
    		{
    			var mat_name = mat.materials[i].name;
    			if (mat_name)
    				if (mat_name.substring(0, 12) === "m_room_wall_")
    				{
    					mat.materials[i] = this.material;
    				}
    		}
    	}
    */
    /*
					var face = obj.face;
		var mat_idx = face.materialIndex;
		var mat_name = face.daeMaterial;
		if (mat_name)
			if (mat_name.substring(0, 12) === "m_room_wall_")
			{
				obj.children[0].material;
				is_sel = true;
			}
			*/

    this.wall.visible = false;

    this.update = function() {
        var v_cam = new THREE.Vector2(this.kernel.camera.position.x, this.kernel.camera.position.z).sub(this.normal);
        var sc = v_cam.x * this.normal.x + v_cam.y * this.normal.y;
        this.wall.visible = (sc < 0 || (!this.kernel.pult.ch_X_ray.checked));
        //console.log(this.kernel.pult.ch_X_ray.checked);
    };
}

function Floor(floor, kernel) {
    this.floor = floor;
    this.kernel = kernel;
    this.walls = [];
    for (var i = 0; i < this.floor.children.length; i++) {
        var obj_name = this.floor.children[i].name;
        if (obj_name.substring(0, 5) === "wall_") {
            this.walls.push(new Wall(this.floor.children[i], this.kernel));
        }
    }

    this.setIsVisible = function(is_visible) {
        this.floor.visible = is_visible;
    };

    this.update = function() {
        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].update();
        }
    };
}

function FloorMgr(kernel) {
    this.kernel = kernel;
    this.floor_null = kernel.scene.getObjectByName("floor_null");
    this.floors = [];
    this.floors.push(new Floor(kernel.scene.getObjectByName("floor_000"), this.kernel));
    this.floors.push(new Floor(kernel.scene.getObjectByName("floor_001"), this.kernel));

    this.getCameraTargetPosition = function() {
        return new THREE.Vector3(0.0, 1.0, 0.0);
    };

    this.update = function() {
        for (var i = 0; i < this.floors.length; i++) {
            this.floors[i].update();
            this.floors[i].setIsVisible(this.kernel.pult.ch_floor[i].checked);
        }
        this.floor_null.visible = (!this.kernel.pult.ch_X_ray.checked);
    };
}

//------------------------------------------------------------------
function TrackMgr(kernel) {
    this.kernel = kernel;
    this.selected_marker_idx = -1;
    this.current_in_idx = 0; // індекс поточної контрольної точки
    this.jump = {};
    this.jump.t = 1.0; // об'єкт стрибку камери: t - позиція [0-1],
    this.jump.cam_p0 = new THREE.Vector3(kernel.camera.position.x, kernel.camera.position.y, kernel.camera.position.z); // cam_p0, cam_p1 к-ти початку та кінця шляху камери,
    this.jump.cam_p1 = new THREE.Vector3(kernel.camera.position.x, kernel.camera.position.y, kernel.camera.position.z);
    var target_pos = kernel.floor_mgr.getCameraTargetPosition();
    this.jump.tgt_p0 = new THREE.Vector3(target_pos.x, target_pos.y, target_pos.z); // tgt_p0, tgt_p1 к-ти початку та кінця цілі
    this.jump.tgt_p1 = new THREE.Vector3(target_pos.x, target_pos.y, target_pos.z);

    this.ctrl_points_children = this.kernel.scene.getObjectByName("ground").getObjectByName("ctrl_points").children;
    this.ctrl_points = [];
    for (var idx = 0; idx < this.ctrl_points_children.length; idx++) {
        var obj_name = this.ctrl_points_children[idx].name;
        if (obj_name.substring(0, 11) === "ctrl_point_") {
            //this.ctrl_points.push(new Marker(this.ctrl_points_children[idx], this.ctrl_points));
            var obj_num = parseInt(obj_name.substring(11, 14));
            this.ctrl_points[obj_num] = new Marker(this.ctrl_points_children[idx], this.ctrl_points, this.kernel);
            //if (this.ctrl_points_children[idx].name === "ctrl_point_000")
            //this.current_in_idx = idx;
        }
    }

    this.current_out_pos = new THREE.Vector3(kernel.camera.position.x, kernel.camera.position.y, kernel.camera.position.z); // позиція камери назовні

    this.goInside = function() {
        this.current_out_pos.set(this.kernel.camera.position.x, this.kernel.camera.position.y, this.kernel.camera.position.z);

        if (this.selected_marker_idx === -1) this.selected_marker_idx = 0;

        this.jump.cam_p0 = this.kernel.camera.position.clone();
        var target_pos = this.ctrl_points[this.selected_marker_idx].ctrl_point.position;
        this.jump.cam_p1 = new THREE.Vector3(target_pos.x, target_pos.y + 0.9, target_pos.z);
        this.jump.tgt_p0 = this.kernel.controls.target.clone();

        var dir = this.jump.cam_p1.clone();
        dir.subVectors(this.jump.cam_p1, this.jump.cam_p0).normalize().multiplyScalar(0.05);
        this.jump.tgt_p1.addVectors(this.jump.cam_p1, dir); //new THREE.Vector3(this.jump.cam_p1.x + dir.x, 0.85, this.jump.cam_p1.z + dir.z);

        this.kernel.controls.enableZoom = false;
        this.kernel.controls.maxPolarAngle = Math.PI;
        this.kernel.controls.minDistance = 0.0;
        for (var i = 0; i < this.ctrl_points.length; i++)
            this.ctrl_points[i].marker.visible = true;

        this.jump.t = 0.0;
        this.state = 0;
    };

    this.setNewTargets = function(icam_pos, icam_tgt) {
        this.jump.cam_p0 = this.jump.cam_p1;
        this.jump.tgt_p0 = this.jump.tgt_p1;
        this.jump.cam_p1 = icam_pos;
        this.jump.tgt_p1 = icam_tgt;
        this.jump.t = 0.0;
    };

    this.goOutside = function() {
        var target_pos = this.kernel.floor_mgr.getCameraTargetPosition();
        this.kernel.controls.target.set(target_pos.x, target_pos.y, target_pos.z);
        this.kernel.controls.enableZoom = true;
        this.kernel.controls.maxPolarAngle = Math.PI / 2.0;
        this.kernel.controls.minDistance = 6.0;
        var ctrl_pos = this.current_out_pos;
        kernel.camera.position.set(this.current_out_pos.x, this.current_out_pos.y, this.current_out_pos.z);
        for (var i = 0; i < this.ctrl_points.length; i++)
            this.ctrl_points[i].marker.visible = false;
        this.state = 1;
    };

    this.goToSelected = function() {
        if (this.state !== 0) return;
        if (this.current_in_idx === this.selected_marker_idx) return;

        this.jump.cam_p0 = this.kernel.camera.position.clone();
        var target_pos = this.ctrl_points[this.selected_marker_idx].ctrl_point.position;
        this.jump.cam_p1 = new THREE.Vector3(target_pos.x, target_pos.y + 0.9, target_pos.z);
        this.jump.tgt_p0 = this.kernel.controls.target.clone();

        var dir = this.jump.cam_p1.clone();
        dir.subVectors(this.jump.cam_p1, this.jump.cam_p0).normalize().multiplyScalar(0.05);
        this.jump.tgt_p1.addVectors(this.jump.cam_p1, dir); //new THREE.Vector3(this.jump.cam_p1.x + dir.x, 0.85, this.jump.cam_p1.z + dir.z);

        /*		this.current_in_idx = this.selected_marker_idx;
        		var target_pos = this.ctrl_points[this.current_in_idx].ctrl_point.position;
        		controls.target.set(target_pos.x, 0.85, target_pos.z);
        		camera.position.set(target_pos.x-0.25, 0.9, target_pos.z);*/

        this.kernel.controls.enableZoom = false;

        this.jump.t = 0.0;
    };

    this.calcPosition = function(p0, p1, t) {
        var p = p1.clone();
        p.sub(p0).multiplyScalar(t).add(p0);
        return p;
    };

    this.update = function() {
        if (this.jump.t < 1.0) {
            var tgt_pos = this.calcPosition(this.jump.tgt_p0, this.jump.tgt_p1, this.jump.t);
            this.kernel.controls.target.set(tgt_pos.x, tgt_pos.y, tgt_pos.z);
            var cam_pos = this.calcPosition(this.jump.cam_p0, this.jump.cam_p1, this.jump.t);
            this.kernel.camera.position.set(cam_pos.x, cam_pos.y, cam_pos.z);
            this.jump.t += 0.02;
            if (this.jump.t >= 1.0)
                this.current_in_idx = this.selected_marker_idx;
        }

        for (var idx = 0; idx < this.ctrl_points.length; idx++) {
            this.ctrl_points[idx].update();
        }
    };

    this.goOutside();
}


//------------------------------------------------------------------
function Marker(ctrl_point, ctrl_points, kernel) {
    this.kernel = kernel;
    this.ctrl_point = ctrl_point;
    if (ctrl_points.length === 0) {
        this.marker = this.kernel.parts.marker;
    } else {
        this.marker = this.kernel.parts.marker.clone();
        this.kernel.scene.add(this.marker);
    }
    this.marker.parent = this.ctrl_point;
    var num_str = ctrl_point.name.substring(11, 14);
    this.idx = parseInt(num_str);
    this.marker.name = "marker_" + num_str;
    this.marker.material = this.kernel.materials.marker_unsel;

    this.update = function() {
        if (this.kernel.track_mgr.selected_marker_idx === this.idx)
            this.marker.children[0].material = this.kernel.materials.marker_sel;
        else
            this.marker.children[0].material = this.kernel.materials.marker_unsel;
    };
}
