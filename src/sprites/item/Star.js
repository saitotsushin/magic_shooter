import Item from './Item';

export default class Star extends Item {
  constructor(config) {
    super(config);
    this.key = "star";
    this.frame = "star";
    config.scene.player.mode = "star";
    config.scene.player.starMode();
    this.destroy();
  }
}