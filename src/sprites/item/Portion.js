import Item from './Item';

export default class Portion extends Item {
  constructor(config) {
    super(config);
    this.recoveryPoint = 5;
    config.scene.player.hp.calc(this.recoveryPoint,config.scene.player);
    this.destroy();  
  }
}