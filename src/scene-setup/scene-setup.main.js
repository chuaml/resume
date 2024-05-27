import { World } from './_World.js';
import addDefaultObject from './_addDefaultObject.js';
import { control_as_FPS, control_as_Orbit } from './_defaultCameraControl.js';


const canvas = document.getElementById('screenThreeD');
const world = new World(canvas);
export default world;

let stateToUpdate;
stateToUpdate = addDefaultObject(
    world.scene,
);
world.addSceneState(stateToUpdate);
const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
if (isMobileDevice) {
    control_as_Orbit(world.camera, world.renderer.domElement);
}
else {
    stateToUpdate = control_as_FPS(world.camera, world.renderer.domElement);
    world.addSceneState(stateToUpdate);
}

