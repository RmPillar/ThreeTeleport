import * as THREE from "three";

import Experience from "../Experience";

export default class Cubes {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.cubeCount = 50;

    this.initCubes();
  }

  initCubes() {
    this.cubes = [];

    for (let i = 0; i < this.cubeCount; i++) {
      const randomPositionX = (Math.random() - 0.5) * 50;
      const randomPositionZ = (Math.random() - 0.5) * 50;

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.3,
          metalness: 0.3,
        })
      );

      cube.position.x = randomPositionX;
      cube.position.z = randomPositionZ;
      cube.position.y = 1;

      cube.castShadow = true;

      this.cubes.push(cube);

      this.scene.add(cube);
    }
  }
}
