# HouseGen widget #

## Description  ##

## Rules for deployment ##

1) Include the following list of scripts into your WebApp:

* jquery-3.0.0.js (2.2.3 already included) 
* three.js (npm install three --save)
* AnimationHandler.js (npm install three-animation-handler --save)
* ColladaLoader.js (npm install three-collada-loader --save)
* OrbitControls.js (npm install orbit-controls --save)
* dat.js (npm install dat-gui --save)
* Detector.js (npm install detector --save)
* shaders/ShaderLib.js
* hg_widget.js
* hg_utils.js
* hg_controls.js
* hg_environment.js

2) Create parrent <div> with the parameters:

```
#!html

<div id="div_id" style="height: 500px; width: 800px;"></div>
```

where:
**id** - unique *id* for div;
**style** - style with *width* and *height*.
This <div> will be the parent for the widget.

3) Create instance of widget in your JS:
```
#!javascript

var hg_widget = new GH_WIDGET("div_id");
```
*hg_widget* - object with our widget. It will be used for control parameters of the widget.
4) Change next parameters of the widget to the right values:

```
#!javascript

hg_widget.textures_path = "./img/textures/"; // path to directory with textures. Default "img/textures/";
hg_widget.objects_path = "./objects/"; // path to directory with prepared scenes. Default "objects/";
```

... this list will be supplemented ...

5) Load the 3D scene. Scene must be created in 3D editor and exported into Collada format (scene_name.dae). It must be located in *hg_widget.objects_path* directory:

```
#!javascript

hg_widget.load("scene_name.dae");
```

## Methods ##
```
#!javascript

.setSize(width, height)
```
Set new size of the widget

```
#!javascript

.load(fname, onLoaded, options);
```
Load collada (.dae) scene in widget. This file must be in '.objects_path'. Function onLoaded() will be called after full scene loaded. Parameter 'options' setups the custom captions and background image for the loader. This parameter is a collection: 
{ progress: "Caption Progress", textures: "Caption textures: ", object: "object: ", bg_url: "url(./img/background_image.jpg)" }. Standart loader will be created if parameter 'options' missed.


```
#!javascript

.setRoof(roof_type);
```
Set roof type by number: *roof_type = [0 - roof_count-1]*

```
#!javascript

.setRoofMaterial(mat_type);
```
Set roof material by texture name. The *mat_type* is one of: *["black_flat", "black_wavy", "red_flat", "red_wavy"]*

```
#!javascript

.setOutdoorWallMaterial(wall_idx, color, texture_idx)
```
Set material with "color" and "texture_idx" for outdoor wall with "wall_idx" [0 - .getOutdoorWallMaterialsCount()-1]. "texture_idx" is an index of ".out_textures" array.

```
#!javascript

.setPlaneVisibility(wall_idx, is_visible)
```
Set visibility of panel for outdoor wall with "wall_idx" [0 - .getOutdoorWallMaterialsCount()-1].

```
#!javascript

.getOutdoorWallMaterialsCount()
```
This method return count of the outdoor materials.

```
#!javascript
.setIndoorWallMaterial(room_idx, color, texture_idx)
```
Set material with "color" and "texture_idx" for indoor wall with "room_idx" [0 - rooms_count-1]. "texture_idx" is an index of ".in_textures" array.

```
#!javascript
.setFloorMaterial(room_idx, texture_idx)
```
Set material with "texture_idx" for floor in room with "room_idx" [0 - rooms_count-1]. "texture_idx" is an index of ".floor_textures" array.

```
#!javascript
.setWindowFramesColor(color)
```
Set color for frames of all windows.

```
#!javascript
.setFrontDoorColor(color)
```
Set color of the front door.

```
#!javascript
.getFrontDoorsCount()
```
Method return count of the front doors. Front doors are objects named "front_door_object_XXX".

```
#!javascript
.showFrontDoor(num)
```
Method hides all front doors and show door with number *num*.

```
#!javascript
.setUnderRoofColor(color)
```
Set color for constructions under the roof.

```
#!javascript
.makeWebGLSnapshot(scale)
```
This method will create a scaled snapshot from the current position of the camera to new window.

## 3D Scenes rules ##

The 'XXX' in this section means number of three digits with leading zeros [0, N-1]. Where N - count of the same objects or materials.

Example: *m_out_wall_002* means material for outdoor wall with number 2.

### Materials ###
Names:

* *m_glass* - transparent material for windows
* *m_window_frame* - interactive material for frames of the windows
* *m_marble_sill* - interactive material for sills
* *m_out_wall_XXX* - material for outdoor walls (it can be changed with method .setOutdoorWallMaterial)
* *m_plane_wall_XXX* - material for panels on outdoor walls (it can be changed with method .setOutdoorWallMaterial)
* *m_room_wall_XXX* - material for indoor walls (it can be changed with method .setIndoorWallMaterial). XXX is number of the room
* *chrome* - material with reflection
* *m_gravel* - material like a gravel
* *grass* - material for the ground. It uses *ground.jpg* texture
* *grid* - material for the grid. It uses *grid.png* texture
* *terrasa* - material with wooden planks effect. It uses *planks.jpg* and *planks_n.jpg* (for norml map) textures
* *m_room_floor_XXX* - materials for the floor in every room. XXX is number of the room
* *m_front_door* - material for the front door
* *m_sidewalk* - material for the sidewalk. It uses *sidewalk.jpg* and *sidewalk_b.jpg* (for the bumpmap) textures
* *m_under_roof* - material for construction uder the roof
* *m_metal_leaf* - material for the flat roofs. It uses *connector.jpg* and *connector_b.jpg* (for the bumpmap) textures
### Objects ###
Names:

* *floor_000* - object with floor for the  first floor. It's parent object for all objects and walls at the first floor.
* *floor_001* - object with floor for the  second floor. It's parent object for all objects and walls at the second floor.
* *floor_null* - parent object for the general objects. Must be situated in the center of coordinates
* *marker* - this object will be cloned as mesh for each control point (ctrl_point_XXX object).
* *ground* - this object is parent for objects *grass* and *ctrl_points*. Must be situated in the center of coordinates.
* *grass* - this object contains only vertices. The grass will be generated in each vertex.
* *ctrl_points* - parent for all control points inside the building.
* *ctrl_point_XXX* - controll points. Camera will be moved between this points in walking mode.
* *light_XXX* - we will see the light in the night in the center of each object with this name.
* *roof_null* - parent for all roofs.
* *roof_XXX* - object with mesh of the roof. This object can be seeable/hiden with all his children when we call method *.setRoof*.
* *wall_XXX* - object with outdoor wall. All children of this object will be hiden in X-ray mode with this wall.
* *plane_wall_XXX* - panels on the outdoor walls.
* *door_frame_XXX* - frame for the door. It's parent object for the door with the same number XXX. Center of this object is used for calculating distance to the camera. When camera is situated near the frame the door start opening.
* *door_object_XXX* - it's triggered object with the door mesh. It will be opened near the camera.
* *front_door_object_XXX* - it's front doors.

## Object hierarchy ##

### / ###
![pic_00.jpg](https://bitbucket.org/repo/9BKBRe/images/2563900675-pic_00.jpg)

There are four objects *floor_000*, *floor_001*, *floor_null*, *marker* in the root of the scene.

### /floor_XXX ###
![pic_01.jpg](https://bitbucket.org/repo/9BKBRe/images/2679932100-pic_01.jpg)

### /floor_XXX/door_frame_XXX ###
![pic_02.jpg](https://bitbucket.org/repo/9BKBRe/images/2618834553-pic_02.jpg)

### /floor_XXX/wall_XXX ###
![pic_03.jpg](https://bitbucket.org/repo/9BKBRe/images/3316691657-pic_03.jpg)

### /floor_null ###
![pic_04.jpg](https://bitbucket.org/repo/9BKBRe/images/483513183-pic_04.jpg)

### /floor_null/ground ###
![pic_05.jpg](https://bitbucket.org/repo/9BKBRe/images/3445533969-pic_05.jpg)

### /floor_null/ground/ctrl_points ###
![pic_06.jpg](https://bitbucket.org/repo/9BKBRe/images/2030566364-pic_06.jpg)

### /floor_null/roof_null ###
![pic_07.jpg](https://bitbucket.org/repo/9BKBRe/images/1350200734-pic_07.jpg)

## Object center (orign) ##

There are few types of objects with strong rules for the position of the object center. In Blender the object center is named *orign*. I will use this name in the next topics.

* *floor_null*, *ground*, *ctrl_points* are objects with orign in the center of the coordinates (0, 0, 0)

* *floor_XXX* orign must be at the center of the each *floor_XXX* object.
* *wall_XXX* orign must be at the center of the bottom side of the *wall_XXX* object.

Last two rules need for hiding the walls in X-ray mode. In the Blender it looks that:
![pic_08.jpg](https://bitbucket.org/repo/9BKBRe/images/3754171962-pic_08.jpg)

* *door_frame_XXX* the best place for orign is the center of the bottom side ofthe each *door_frame_XXX* object.
* *door_object_XXX* orign is a center of the door rotation.

This rules need for opening the door near the camera. In Blender it looks as this screenshot:
![pic_09.jpg](https://bitbucket.org/repo/9BKBRe/images/3448712704-pic_09.jpg)