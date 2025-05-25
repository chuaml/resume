import * as THREE from 'three';

export default function (
    scene,
) {

    const sun = new THREE.Mesh(
        new THREE.SphereGeometry(10),
        new THREE.MeshBasicMaterial({ color: 0xffaf4d })
    );
    sun.position.set(0, 10, 60);

    const sunOrbit = new THREE.Mesh(
        new THREE.SphereGeometry(0),
        new THREE.MeshBasicMaterial(),
    );
    const sunLight = new THREE.PointLight(0xffffff, 15, 0, 0.5);
    sun.add(sunLight);
    scene.add(new THREE.PointLightHelper(sunLight));

    sunOrbit.add(sun);
    scene.add(sunOrbit);


    const texture = new THREE.TextureLoader().load('img/resume.webp');
    // texture.offset = new THREE.Vector2(0, 0.4);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        // normalMap: texture,
        // metalness: 0.6,
        roughness: 0.8,
    });
    const resumeRatio = 1.59;
    const resumeSize = 10;
    const geometry = new THREE.BoxGeometry(resumeSize * resumeRatio, resumeSize, .1);
    const resume = new THREE.Mesh(geometry, material);
    resume.translateY(1);
    resume.name = 'resume';
    scene.add(resume);

    const sudoku = (function(){ // sudoku
        const texture = new THREE.TextureLoader().load('img/sudoku.webp');
        // texture.offset = new THREE.Vector2(0, 0.4);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            normalMap: texture,
            metalness: 0.6,
            roughness: .2,
        });
        const geometry = new THREE.BoxGeometry(10, 10, .1);
        const sudoku = new THREE.Mesh(geometry, material);
        sudoku.translateY(1);
        sudoku.translateZ(-25);
        sudoku.rotation.y = 1;
        sudoku.name = 'sudoku';
        scene.add(sudoku);
        return sudoku;
    })();

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(1),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
    );
    moon.position.set(0, 30, 0);
    const moonOrbit = new THREE.Mesh(
        new THREE.SphereGeometry(0),
        new THREE.MeshBasicMaterial(),
    );
    moonOrbit.add(moon);
    scene.add(moonOrbit);


    const skyOrbit = new THREE.Mesh(
        new THREE.SphereGeometry(0),
        new THREE.MeshBasicMaterial(),
    );
    const starGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const starCount = 500;
    const starStd_distance = 50;
    for (let i = 0; i < starCount; ++i) {
        const star = new THREE.Mesh(
            starGeo,
            starMat,
        );
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const minmumDistance = Math.random() * starStd_distance + 150;

        star.position.set(
            (Math.sin(theta) * Math.cos(phi) * minmumDistance),
            (Math.sin(theta) * Math.sin(phi) * minmumDistance),
            (Math.cos(theta) * minmumDistance)
        );
        star.rotateY(Math.random());
        star.rotateX(Math.random());
        skyOrbit.add(star);
    }
    scene.add(skyOrbit);



    let speed_multiplier = 1;
    document.body.addEventListener('mousedown', function (e) {
        if (e.button === 0) {  // mouse1
            speed_multiplier = 0.2;
        }
        else {
            speed_multiplier = 3;
        }
    });

    document.body.addEventListener('mouseup', function (e) {
        speed_multiplier = 1;
    });

    let x = 0;
    return (function () {
        // resume.rotation.x += 0.02 * r_mutiplier;
        // resume.rotation.z += 0.01 * r_mutiplier;
        resume.rotation.y += 0.02 * speed_multiplier;
        resume.translateY((Math.sin(++x / 16) * .05) * speed_multiplier);

        sudoku.rotation.y -= 0.02 * speed_multiplier;
        sudoku.translateY((Math.sin(++x / 16) * .05) * speed_multiplier);

        moonOrbit.rotation.x -= 0.0005 * speed_multiplier;
        moonOrbit.rotation.z += 0.01 * speed_multiplier;

        sunOrbit.rotation.y -= 0.01 * speed_multiplier;

        skyOrbit.rotation.x += 0.0005 * speed_multiplier;
    });
}