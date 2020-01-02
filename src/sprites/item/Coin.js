import Item from './Item';

export default class Coin extends Item {
  constructor(config) {
    super(config);
    this.coinPoint = 1;


  }

  hit(){
    this.scene.coin_count = this.scene.coin_count + this.coinPoint;

    this.scene.player.status.power += this.coinPoint;
    this.destroy();
  }
}