import * as THREE from 'three';

// 1. setup
export class World {
  scene;
  camera;
  renderer;
  constructor(
    canvas
  ) {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowWidth, windowHeight);
    this.renderer = renderer;

    const camera = new THREE.PerspectiveCamera(90, windowWidth / windowHeight, 0.1, 1000);
    scene.add(new THREE.GridHelper(250, 20)); // floor debug
    this.camera = camera;
    this.scene = scene;

    // const camControl = new OrbitControls(camera, renderer.domElement);

    this._addLight();

    this.updateSceneState();
    this.animate();

    window.addEventListener('resize', _ => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  }

  #WORLD_TIME_SPEED = 1000 / 60;
  updateSceneState() {
    setTimeout(_ => this.updateSceneState(), this.#WORLD_TIME_SPEED);

    const tasks = this._stateToUpdate;
    const len = tasks.length;
    for (let i = 0; i < len; ++i) {
      try {
        tasks[i]();
      } catch (err) {
        this._logError(err);
      }
    }
  }

  _logError_task_timeoutId = 0;
  _logError_task_BufferCount = 0;
  _logError(err) {
    clearTimeout(this._logError_task_timeoutId);
    if (++this._logError_task_BufferCount > 119) {
      console.error(err);
      this._logError_task_BufferCount = 0;
    }
    else {
      this._logError_task_timeoutId = setTimeout(() => {
        console.error(err);
      }, 200);
    }

  }

  _stateToUpdate = [];
  addSceneState(func) {
    this._stateToUpdate.push(func);
  }

  removeSceneState(func) {
    this._stateToUpdate = this._stateToUpdate.filter(task => task !== func);
  }

  _addLight() {
    const globalBrightness = 1.5;
    const globalLight = new THREE.AmbientLight(0xffffff, globalBrightness);
    this.scene.add(globalLight);

    // const lightBulb = new THREE.PointLight(0xffffff, 10, 0, .5);
    // lightBulb.position.set(5, 15, 5);
    // this.scene.add(lightBulb);
    // // debug light
    // this.scene.add(new THREE.PointLightHelper(lightBulb));
  }

  updateCamControl = function () { };
  animate() {
    // camControl.update();
    this.updateCamControl();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(_ => this.animate());
  }
}
