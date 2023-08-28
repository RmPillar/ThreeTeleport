import * as THREE from "three";

import Experience from "../Experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.initFloor();
    this.initFloorGrid();
  }

  initFloor() {
    this.floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );

    this.floor.rotation.x = -Math.PI / 2;

    this.floor.receiveShadow = true;

    this.scene.add(this.floor);
  }

  initFloorGrid() {
    this.floorGrid = new THREE.GridHelper(100, 100, 0x000000, 0x000000);
    this.floorGrid.material.opacity = 0.2;
    this.floorGrid.material.transparent = true;

    this.scene.add(this.floorGrid);
  }
}
