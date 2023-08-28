import * as THREE from "three";

import Experience from "../Experience";

export default class {
  lightParamaters = {
    ambientLight: {
      color: 0xffffff,
    },
    spotLight: {
      color: 0xffffff,
    },
  };

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setAmbientLight();
    // this.setSpotLight();
    this.setDirectionalLight();
  }

  setAmbientLight() {
    if (!this.scene) return;

    this.ambientLight = new THREE.AmbientLight(
      this.lightParamaters.ambientLight.color,
      0.5
    );
    this.scene.add(this.ambientLight);
  }

  setSpotLight() {
    if (!this.scene) return;

    this.spotLight = new THREE.SpotLight(
      this.lightParamaters.spotLight.color,
      1,
      0,
      Math.PI / 3,
      0.3
    );
    this.spotLight.position.set(0, 2, 2);
    this.spotLight.target.position.set(0, 0, 0);

    this.spotLight.castShadow = true;
    this.spotLight.shadow.near = 0.1;
    this.spotLight.shadow.camera.far = 9;
    this.spotLight.shadow.bias = 0.001;

    this.spotLight.shadow.mapSize.set(1024, 1024);

    this.scene.add(this.spotLight);
  }

  setDirectionalLight() {
    if (!this.scene) return;

    this.directionalLight = new THREE.DirectionalLight(
      this.lightParamaters.spotLight.color,
      1
    );

    this.directionalLight.position.set(0, 2, 2);
    this.directionalLight.target.position.set(0, 0, 0);

    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.near = 0.1;
    this.directionalLight.shadow.camera.far = 9;
    this.directionalLight.shadow.bias = 0.001;

    this.directionalLight.shadow.mapSize.set(1024, 1024);

    this.scene.add(this.directionalLight);
  }
}
