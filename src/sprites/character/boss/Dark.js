import Enemy from '../Enemy';
import Calcs from '../../../helper/Calcs';
import Bullet from '../../weapon/Bullet';

export default class Dragon extends Enemy {

  constructor(config) {

    super(config);

    this.type = "boss";
    this.key = "dragon";
    this.depth = 1;
    this._scene = config.scene;

    this.base_y = this.y;

    this.status = {
      hp: 20,
      power: 5,
      defense: 4,
      experience: 10,
      walkSpeed: 12
    }

    let _this = this;

    this.calc = new Calcs();

    this.shotDegree = 0;
    this.shotRadius = 0;

    this.flgShot = false;

    this.shotStartTimerEvent;
    this.shotTimerEvent;

    this.shotCount = 0;
    this.shotMaxCount = 10;

    this.setBullet = false;

    this.dropShotObjectPool = [];
    this.dropShotMaxLength = 10;
    // for(var i = 0; i < this.dropShotMaxLength; i++){

    // }

  }
  update(keys, time, delta) {

    if (!this.active) {
      return;
    }

    let _this = this;
    let _time = time;


    if(!this.shotStartTimerEvent && this.active){
      this.shotStartTimerEvent = this.scene.time.delayedCall(
        2000,
        function(){
          this.attackSelect();
        },
        [],
        this
      );  
    }

    if(this.shotCount >= 10){
      this.shotCount = 0;
      this.shotStartTimerEvent.remove(false);
      this.shotStartTimerEvent = null;
      this.shotTimerEvent.remove(false);
      this.shotTimerEvent = null;
    }  

    if (this.active) {
      this.hp.move(this.x,this.y);
    }
  }
  attackSelect(){
    var rand = Math.floor( Math.random() * 100) ;
    if(rand <= 50){
      this.attack1();
    }else{
      this.attack2();
    }

  }
  attack1(){
    this.shotTimerEvent = this.scene.time.addEvent({
      delay: 200,
      duration: 500,
      startAt: 200,
      callback: function(){
        this.shotBullet();
      },
      callbackScope: this,
      repeat: this.shotMaxCount
    });  
  }
  attack2(){
    this.shotTimerEvent = this.scene.time.addEvent({
      delay: 1000,
      duration: 1000,
      callback: function(){
        this.dropShot();
      },
      callbackScope: this,
      repeat: this.shotMaxCount,
    });  
  }
  createDropShot(){
    let shadowSprite;
    shadowSprite = this.scene.add.graphics({ fillStyle: { color: 0x000000 } });
    shadowSprite.fillCircleShape(new Phaser.Geom.Circle(0, 0, 10));
    shadowSprite.alpha = 0.3;
    shadowSprite.setVisible(false);
    this.scene.physics.world.enable(shadowSprite);
    this.scene.add.existing(shadowSprite);

    let dropSprite = this.scene.add.sprite(0, 0, 'barrier');
    dropSprite.setVisible(false);
    dropSprite.power = 2;

    let dropGroup = {
      drop: dropSprite,
      shadow: shadowSprite,
      shotAnime: null,
      shadowAnime: null,
      shotRemoveAnime:null,
      active: false
    }
    return dropGroup;
  }
  toDropShotPool(object){
    this.dropShotObjectPool.unshift(object);
  }
  fromDropShotPool(object){
    if (this.dropShotObjectPool.length === 0) {
      // プールが空なら新規生成
      return this.createDropShot();
    } else {
      // プールにストックがあれば取り出す
      return this.dropShotObjectPool.pop();
    }
  }
  dropShot(){
    this.dropShotObjectPool
    let shotLength = this.calc.getRandomInt(1,6);
    this.shotCount += shotLength;
    let _this = this;
    if(this.shotCountMax > this.shotCount){
      let sa = this.shotCountMax - this.shotCount;
      shotLength -= sa;
    }
    for(var i = 0; i < shotLength; i++){
      let randomPos = this.createRandomPosition();
      let dropShotGroup = this.fromDropShotPool();
      let drop = dropShotGroup.drop;
      let shadow = dropShotGroup.shadow;
      shadow.x = randomPos.x;
      shadow.y = randomPos.y;
      shadow.setVisible(true);
      drop.x = randomPos.x;
      drop.y = randomPos.y - 40;
      drop.setVisible(true);
      drop.alpha = 0;
      shadow.alpha = 0;
      let damageArea = {
        radius: 30
      }
      dropShotGroup.shadowAnime = this.scene.tweens.add({
        targets: shadow,
        ease: 'liner',
        alpha: 0.4,
        duration: 400,
        repeat: 0,
        completeDelay: 400,
        onComplete: function () {
          shadow.alpha = 0;
        }
      });
      let _target = this.scene.player;
      dropShotGroup.shotAnime = this.scene.tweens.add({
        targets: drop,
        ease: 'liner',
        alpha: 1,
        y: randomPos.y,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        repeat: 0,
        delay: 600,
        // completeDelay: 800,
        onComplete: function () {
          shadow.x = 0;
          shadow.y = 0;
          shadow.setVisible(false);
          if(damageArea.radius*damageArea.radius >= (drop.x - _target.x)*(drop.x - _target.x) + (drop.y - _target.y)*(drop.y - _target.y)){
            // if(sprite.active){
              _target.damage(drop.power);
            // }
          }
        }
      });
      dropShotGroup.shotRemoveAnime = this.scene.tweens.add({
        targets: drop,
        completeDelay: 1400,
        onComplete: function () {
          drop.x = 0;
          drop.y = 0;
          drop.setVisible(false);
          _this.toDropShotPool(dropShotGroup);
        }
      });

    }

  }
  createRandomPosition(){
    let min_x = 2;
    let max_x = 10;
    let min_y = 2;
    let max_y = 14;
    var randNumX = Math.floor(Math.random()*(max_x-min_x)+min_x);
    var randNumY = Math.floor(Math.random()*(max_y-min_y)+min_y);
    var randPos = {
      x: randNumX*16,
      y: randNumY*16
    };
    return randPos;  
  }
  shotBullet(){
    this.shotDegree += 36;
    this.shotRadian = this.shotDegree * ( Math.PI / 180 ) ;

    let _vx = Math.cos(this.shotRadian);
    let _vy = Math.sin(this.shotRadian);

    let vec = this.calcs.returnMax1(_vx,_vy);
    let bullet = new Bullet({
      scene: this.scene,
      x: this.x+10,
      y: this.y+10,
      key: "bullet",
      vx: vec.x,
      vy: vec.y,
      target: this,
      power: 10,
      scale: 1,
      parent: "dragon"
    }); 
    this.scene.enemyWeaponGroup.add(bullet);
    this.shotCount++;
  }
}