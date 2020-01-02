import Item from './Item';

export default class PowerUp extends Item {
  constructor(config) {
    super(config);

    this.count = config.count ? config.count : 1;
  }
  hit(){
    this.scene.powerUpList.addStep(this.count);
    this.destroy();
  }
}