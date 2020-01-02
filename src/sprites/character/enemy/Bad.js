import EnemyChase from './EnemyChase';

export default class Bad extends EnemyChase {

  constructor(config) {

    super(config);

    this._scene = config.scene;

    this.status = {
      hp: 2,
      power: 1,
      defense: 0,
      experience: 10,
      walkSpeed: 12
    }
    this.hp.hp = this.status.hp;
    this.hp.hpMax = this.status.hp;
    this.anims.play('badAnime', true);
  }
  update(keys, time, delta) {
    if (!this.active) {
      return;
    }
    this.handleChase();
    this.hp.move(this.x,this.y);

  }

}