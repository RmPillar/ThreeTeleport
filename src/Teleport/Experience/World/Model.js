import * as THREE from "three";

import Experience from "../Experience";
import { extendMaterial } from "../Utils/extend";

import gsap from "gsap";

export default class Model {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.man;
    this.mixer;
    this.action;

    this.progress = { value: 0 };

    this.initModel();
    this.initAnimation();

    this.initEventListeners();
  }

  initModel() {
    this.man = this.resources.items.man;

    this.man.scene.children[0].children[0] = this.createMesh(
      this.man.scene.children[0].children[0]
    );

    this.man.scene.children[0].children[1] = this.createMesh(
      this.man.scene.children[0].children[1]
    );

    this.scene.add(this.man.scene);
  }

  initAnimation() {
    this.mixer = new THREE.AnimationMixer(this.man.scene);
    this.action = this.mixer.clipAction(this.man.animations[0]);

    this.action.play();
  }

  initEventListeners() {
    console.log(this.experience.camera.controls.target);
    window.addEventListener("keyup", (e) => {
      if (e.code !== "Space") return;

      const newPosition = new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        0,
        (Math.random() - 0.5) * 50
      );

      this.experience.camera.controls.enabled = false;

      gsap
        .timeline()
        .to(this.progress, { value: 1, duration: 5, ease: "power2.inOut" })
        .call(() => {
          this.man.scene.position.x = newPosition.x;
          this.man.scene.position.z = newPosition.z;
        })
        .to(this.experience.camera.instance.position, {
          x: newPosition.x,
          z: newPosition.z + 7,
          duration: 3,
          ease: "power2.inOut",
        })
        // .call(() => {
        //   this.experience.camera.instance.lookAt(
        //     newPosition.x,
        //     1,
        //     newPosition.z
        //   );
        // })
        .to(this.progress, { value: 0, duration: 3, ease: "power2.out" })
        .call(() => {
          this.experience.camera.controls.enabled = true;
          this.experience.camera.instance.lookAt(
            new THREE.Vector3(
              this.man.scene.position.x,
              1,
              this.man.scene.position.z
            )
          );
          this.experience.camera.controls.target = new THREE.Vector3(
            this.man.scene.position.x,
            1,
            this.man.scene.position.z
          );

          this.experience.camera.controls.update();
          console.log(this.experience.camera.controls.target);
        });
    });
  }

  createExtendedMaterial() {
    return extendMaterial(THREE.MeshStandardMaterial, {
      class: THREE.CustomMaterial, // In this case ShaderMaterial would be fine too, just for some features such as envMap this is required
      vertexHeader: `
        attribute vec3 aRandom;
        attribute vec3 aCenter;
        uniform float uProgress;
        uniform vec3 uPosition;
      `,
      vertex: {
        transformEnd: `
          // float prog = (position.z + 0.2) / 2.0;
          // float locProg = clamp((uProgress - 2.5 * prog) / 0.5, 0.0, 1.0);

          transformed -= aCenter + uPosition;
          
          transformed *= (1.0 - uProgress);
          transformed += uProgress * aRandom;
          transformed += aCenter + (aRandom * uProgress) + uPosition;
        `,
      },
      uniforms: {
        uProgress: {
          value: 0,
          mixed: true,
          linked: true,
        },
        uPosition: {
          value: new THREE.Vector3(0, 0, 0),
          mixed: true,
          linked: true,
        },
      },
    });
  }

  createMesh(model) {
    const material = this.createExtendedMaterial();

    material.uniforms.diffuse.value = model.material.color;
    material.skinning = true;
    material.morphTargets = true;

    const newModel = model.clone();
    newModel.geometry = newModel.geometry.toNonIndexed();

    console.log(newModel);
    const { randoms, centers } = this.getAttributes(newModel);

    newModel.geometry.setAttribute("aRandom", randoms);
    newModel.geometry.setAttribute("aCenter", centers);

    newModel.customDepthMaterial = extendMaterial(THREE.MeshDepthMaterial, {
      template: material,
    });

    newModel.material = material;

    newModel.castShadow = true;

    newModel.frustumCulled = false;

    return newModel;
  }

  getAttributes(model) {
    const newModel = model.clone();
    newModel.geometry = newModel.geometry.toNonIndexed();

    const count = newModel.geometry.attributes.position.count;

    const randoms = new Float32Array(count * 3);
    const centers = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 3) {
      const randomX = Math.random() - 0.5;
      const randomY = Math.random() - 0.5;
      const randomZ = Math.random() - 0.5;

      const random = new THREE.Vector3(randomX, randomY, randomZ);

      randoms.set([random.x, random.y, random.z], i * 3);
      randoms.set([random.x, random.y, random.z], (i + 1) * 3);
      randoms.set([random.x, random.y, random.z], (i + 2) * 3);

      const x = newModel.geometry.attributes.position.array[i * 3];
      const y = newModel.geometry.attributes.position.array[i * 3 + 1];
      const z = newModel.geometry.attributes.position.array[i * 3 + 2];

      const x2 = newModel.geometry.attributes.position.array[i * 3 + 3];
      const y2 = newModel.geometry.attributes.position.array[i * 3 + 4];
      const z2 = newModel.geometry.attributes.position.array[i * 3 + 5];

      const x3 = newModel.geometry.attributes.position.array[i * 3 + 6];
      const y3 = newModel.geometry.attributes.position.array[i * 3 + 7];
      const z3 = newModel.geometry.attributes.position.array[i * 3 + 8];

      const center = new THREE.Vector3(x, y, z)
        .add(new THREE.Vector3(x2, y2, z2))
        .add(new THREE.Vector3(x3, y3, z3))
        .divideScalar(3);

      centers.set([center.x, center.y, center.z], i * 3);
      centers.set([center.x, center.y, center.z], (i + 1) * 3);
      centers.set([center.x, center.y, center.z], (i + 2) * 3);
    }

    return {
      randoms: new THREE.BufferAttribute(randoms, 3),
      centers: new THREE.BufferAttribute(centers, 3),
    };
  }

  initDebug() {
    if (!this.debug?.ui || !this.debug?.active) return;

    this.debug.ui
      .add(this.progress, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uProgress")
      .onChange(() => {
        // console.log(this.man.scene.children[0].children[0]);
        this.man.scene.children[0].children[0].material.uniforms.uProgress.value =
          this.progress.value;
        this.man.scene.children[0].children[1].material.uniforms.uProgress.value =
          this.progress.value;
      });
  }

  update() {
    if (this.mixer) {
      this.mixer.update(this.time.delta * 0.001);
    }

    const model = this.man?.scene?.children?.[0]?.children;

    if (model && model?.[0] && model?.[1]) {
      model[0].material.uniforms.uProgress.value = this.progress.value;
      model[0].material.uniforms.uPosition.value = this.man?.scene?.position;

      model[1].material.uniforms.uProgress.value = this.progress.value;
      model[1].material.uniforms.uPosition.value = this.man?.scene?.position;
    }
  }
}
