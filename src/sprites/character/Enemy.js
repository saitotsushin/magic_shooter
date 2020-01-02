import Character from './Character';
import Coin from '../item/Coin';
import Heart from '../item/Heart';
import PowerUp from '../item/PowerUp';

export default class Enemy extends Character {

  constructor(config) {

    super(config);
    this._scene = config.scene;
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.setImmovable(true);/*ぶつかっても影響を受けない*/

    this.type = "enemy";

    this.active = true;

    this.appearFlg = false;

    this.status = {
      hp: 10,
      power: 5,
      defense: 1,
      experience: 10
    }
    this.dropItemList = [
      {
        "class": Coin,
        "key": "coin"  
      },
      {
        "class": Heart,
        "key": "heart"  
      },
      {
        "class": PowerUp,
        "key": "powerUp"  
      }
    ];
    /*==============================
    表示までOFF
    ==============================*/
    this.active = false;
    this.damageText.visible = false;
    this.visible = false;
    this.delayActiveTimerEvent;
    this.hp.hp_bar.setVisible(false);
    this.hp.hp_bar_bg.setVisible(false);

    /*==============================
    表示までのアニメーション
    ==============================*/
    this.circle = new Phaser.Geom.Circle(this.x, this.y, 10);//x,y.size
    this.appearCircle = this.scene.add.graphics({ fillStyle: { color: 0xFF0000 } });
    this.appearCircle.fillCircleShape(this.circle);
    this.appearCircle.alpha = 0;

    let _this = this;
    let apperTween = this.scene.tweens.add({
      targets: _this.appearCircle,
      ease: 'liner',
      alpha: 1,
      duration: 600,
      repeat: 0,
      completeDelay: 100,
      onComplete: function () {
        _this.appear();
      },
    });
  }

  update(keys, time, delta) {

  }
  appear(){
    this.active = true;
    this.visible = true; 
    this.appearCircle.destroy();
    this.hp.hp_bar.setVisible(true);
    this.hp.hp_bar_bg.setVisible(true);
    this.appearEnemyAfter();
    this.appearFlg = true;
  }
  appearEnemyAfter(){

  }

  getRandomObjName(arr){
    let random = arr[Math.floor(Math.random() * arr.length)];
    return random;
  }
  dropItem(){

    let item = this.getRandomObjName(this.dropItemList);

    let itemObject = new item.class({
      scene: this._scene,
      x: this.x,
      y: this.y,
      key: item.key
    });
    this.scene.itemGroup.add(itemObject);

  }
}