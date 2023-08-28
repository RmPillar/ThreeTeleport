import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";
import Model from "./Model";
// import Cubes from "./Cubes";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.progress = { value: 0 };

    this.resources.on("ready", () => {
      this.enviroment = new Environment();
      this.initWorld();
    });
  }

  initWorld() {
    this.model = new Model();
    this.floor = new Floor();
    // this.cubes = new Cubes();

    this.experience.camera.instance.lookAt(0, 1, 0);
  }

  update() {
    if (this.model) this.model.update();
  }
}
