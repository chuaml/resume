import * as THREE from 'three';
import { PointerLockControls } from '/src/PointerLockControls_v2.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function map_Name_Element(meshName) {
    if(meshName === 'resume') {
        return document.getElementById('body-content');
    } else if(meshName === 'sudoku') {
        return document.getElementById('body-sudoku');
    } else {
        return null;
    }
}

export function control_as_FPS(
    scene,
    camera,
    canvas,
) {
    camera.position.setZ(18);
    camera.position.setY(2);

    const camControl = new PointerLockControls(camera, canvas);
    camControl.pointerSpeed = localStorage['config.setting-mouse-sensitivity'] || 1;
    camControl._onMouseMove = null;

    // setup menu settings
    const settingsModal = document.getElementById('settingsModal');
    settingsModal.addEventListener('keyup', function (e) {
        if (e.code === 'Escape')
            this.close();
    });

    const divResume = document.getElementById('body-content');
    camControl.addEventListener('lock', e => {
        settingsModal.close();
        document.getElementById('overlay-popup').style['display'] = 'none';
    });

    let doShowMenu = true;
    camControl.addEventListener('unlock', e => {
        if(doShowMenu) {
            settingsModal.showModal();
        }
        else {
            doShowMenu = true;
        }
        document.getElementById('overlay-popup').style.removeProperty('display');
    });


    settingsModal.addEventListener('click', e => { // close when clicking outside
        if (e.target.matches('dialog[open] > *, dialog[open]')) {
            settingsModal.close();
        }
    });

    const inputMouseSensitivity = document.getElementById('setting-mouse-sensitivity');
    inputMouseSensitivity.value = localStorage['config.setting-mouse-sensitivity'] || 1;
    inputMouseSensitivity.closest('.setting').querySelector('.value').innerText = inputMouseSensitivity.value;
    inputMouseSensitivity.addEventListener('input', e => {
        camControl.pointerSpeed = e.target.value;
        e.target.closest('.setting').querySelector('.value').innerText = e.target.value;
        localStorage['config.setting-mouse-sensitivity'] = e.target.value;
    });
    document.getElementById('btnClose').addEventListener('click', function (e) {
        settingsModal.close();
    });


    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let doJump = false;
    const updateMovement = function (keyCode, toIsMoving) {
        switch (keyCode) {
            case 'KeyW':
            case 'ArrowUp':
                moveForward = toIsMoving;
                break;
            case 'KeyS':
            case 'ArrowDown':
                moveBackward = toIsMoving;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                moveLeft = toIsMoving;
                break;
            case 'KeyD':
            case 'ArrowRight':
                moveRight = toIsMoving;
                break;
            case 'Space':
                doJump = toIsMoving;
                break;
        }
    };
    document.addEventListener('keydown', function (e) {
        if (camControl.isLocked === false) return;
        updateMovement(e.code, true);
    });
    document.addEventListener('keyup', function (e) {
        if (camControl.isLocked === false) return;
        updateMovement(e.code, false);
    });

    { //overlay show pop up
        // Function to get objects within the camera's view and a certain distance
        function getNearestObjectInView(camera, objects) {
            const frustum = new THREE.Frustum();
            const cameraViewProjectionMatrix = new THREE.Matrix4();
            cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
    
            const len = objects.length;
            const maxDistance = 25;
            let previousObjectDistance = maxDistance;
            let nearestObject = null;
            for (let i = 0; i < len; ++i) {
                const o = objects[i];
                // Ensure the object has geometry to check (like bounding box)
                if (o.geometry) {
                    // Compute bounding box if not already computed
                    o.geometry.computeBoundingBox();
    
                    // Transform the bounding box to world coordinates
                    const boundingBox = o.geometry.boundingBox.clone();
                    boundingBox.applyMatrix4(o.matrixWorld);
    
                    // Check if the object intersects with the frustum
                    if (frustum.intersectsBox(boundingBox)) {
                        // Optionally, check distance
                        const distance = camera.position.distanceTo(o.position);
                        if (distance < previousObjectDistance) {
                            nearestObject = o;
                            previousObjectDistance = distance;
                        }
                    }
                }
            }
    
            return nearestObject;
        }
    


        function picker_showPopup() {
            if (camControl.isLocked === false) return;
            const objects = [];
            scene.traverse((child) => {
                if (child.isMesh) objects.push(child);
            });
            const nearestObject = getNearestObjectInView(camera, objects);
            console.log("nearest obj: ", nearestObject);
            if(nearestObject === null) return;
    
            document.querySelectorAll('#overlay-popup > *').forEach(x => {
                x.classList.add('hidden');
            });
            const div = map_Name_Element(nearestObject.name);
            div.classList.remove('hidden');
            doShowMenu = false;
            camControl.unlock();
        }

        document.addEventListener('keydown', function (e) {
            if (e.isTrusted === false) return;
            if (e.code === 'KeyE') {
                picker_showPopup();
            }
            else if(e.code === 'Escape') {
                setTimeout(_=>{
                    camControl.lock();
                }, 200);
            }
        }, { passive: true });

        document.addEventListener('click', e => {
            if (camControl.isLocked === false) return;
            if (e.isTrusted === false) return;
            picker_showPopup();
        }, { passive: true });
    }

    canvas.addEventListener('click', function (e) {
        camControl.lock();
    });
    document.addEventListener('keydown', function (e) {
        if (e.code === 'Backquote') camControl.unlock();
    });

    const mass = 10;
    const movementScale = 200;
    const jumpPower = 40;
    const friction = 8;
    const camHeight = 1.8;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    let canJump = false;
    let previousTime = performance.now();
    return function updateCamControl() {
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        const currentTime = performance.now();
        const delta = (currentTime - previousTime) / 1000;
        velocity.x -= velocity.x * friction * delta;
        velocity.z -= velocity.z * friction * delta;
        if (moveForward || moveBackward) velocity.z -= direction.z * movementScale * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * movementScale * delta;

        camControl.moveForward(- velocity.z * delta);
        camControl.moveRight(- velocity.x * delta);
        // console.log(velocity);

        const camControlObject = camControl.getObject();
        if (doJump && canJump) {
            velocity.y += jumpPower;
            camControlObject.position.y += (velocity.y * delta);
            doJump = false;
        }

        // gravity
        velocity.y -= 9.8 * mass * delta; // 100.0 = mas.reduce(function (cfx, x) { return cfx + x; })
        if (camControlObject.position.y > camHeight) {
            camControlObject.position.y += (velocity.y * delta);
            canJump = false;
        }
        else {
            velocity.y = 0;
            canJump = true;
        }

        previousTime = currentTime;
    };
}




export function control_as_Orbit(
    scene,
    camera,
    canvas,
) {
    camera.position.setZ(25);
    camera.position.setY(6);


    // click to show/hide resume
    document.body.addEventListener('click', e => {
        if (e.target.matches('section, section > *, canvas') === false) return;
        const divResume = document.getElementById('body-content');
        if (divResume.classList.contains('show')) {
            divResume.classList.remove('show');
        }
        else {
            divResume.classList.add('show');
        }
    });

    // movement
    document.body.addEventListener('keydown', function (e) {
        if (e.code === 'KeyW') {
            camera.position.z -= 1;
        }
        else if (e.code === 'KeyS') {
            camera.position.z += 1;
        }
        else if (e.code === 'KeyA') {
            camera.position.x -= 1;
        }
        else if (e.code === 'KeyD') {
            camera.position.x += 1;
        }
    });

    const camControl = new OrbitControls(camera, canvas);

    function updateCamera() {
        camControl.update();
    }
    requestAnimationFrame(updateCamera);
}
