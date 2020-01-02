import Item from './Item';

export default class Heart extends Item {
  constructor(config) {
    super(config);
    this._scene = config.scene;
    this.recoveryPoint = 1;
  }
  hit(){
    this.scene.player.hp.calc(this.recoveryPoint,this.scene.player);
    this.destroy();
  }
}