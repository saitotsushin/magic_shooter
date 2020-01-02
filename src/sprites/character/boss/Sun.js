import Enemy from '../Enemy';
import Calcs from '../../../helper/Calcs';

export default class Sun extends Enemy {

  constructor(config) {

    super(config);

    this.type = "boss";
    this.key = "stone";
    this.depth = 1;

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

    /*======
    弾の準備
    ========*/    
    this.aroundBulletGroup = config.scene.add.group();
    let aroundBulletLength = 6;

    for(var i = 0; i < aroundBulletLength; i++){
      let aroundSprite = config.scene.add.sprite(this.x, this.y, 'barrier');
      config.scene.physics.world.enable(aroundSprite);
      config.scene.add.existing(aroundSprite);  
      aroundSprite.setOrigin(0.5,0.5);
      aroundSprite.setVisible(true);
      this.aroundBulletGroup.add(aroundSprite);
    }
    
    this.barrierDegree = 0;
    this.barrierRadius = 0;
    this.barrierRadiusMax = 30;

    this.flgShot = false;
    this.shotActive = true;

    this.shotDelayTimerEvent;
    this.shotSaveTimerEvent;

    this.TILE_WIDTH = 16;

    this.maxDistanceArea = {
      top   : config.scene.game.config.width + this.height,
      left  : this.TILE_WIDTH + this.width,
      right : config.scene.game.config.width - this.TILE_WIDTH*2 - this.width,
      bottom: config.scene.game.config.width*2  - this.height
    }


    /*======
    マスクの追加
    ========*/  
    this.mask = config.scene.make.image({
      x: this.x,
      y: this.y,
      key: 'circle_mask_30x30',
      add: false
    });
    this.mask.scaleX = 1;
    this.mask.scaleY = 1;
    this.maskImage = new Phaser.Display.Masks.BitmapMask(config.scene, this.mask);
    
    this.setMask(this.maskImage); 

  }
  update(keys, time, delta) {

    if (!this.active) {
      this.aroundBulletGroup.children.entries.forEach(
        (sprite,index) => {
          sprite.setVisible(false);
        }
      );
      return;
    }

    let _this = this;
    let _time = time;



    /*======
    0->30まで移動したら発射準備
    ========*/

    if(this.active && !this.flgShot && this.shotActive){
      if(this.barrierRadiusMax > this.barrierRadius){
        this.barrierRadius += _time/200;
      }else{
        this.barrierRadius = this.barrierRadiusMax;
        if(!this.shotDelayTimerEvent){
          this.shotDelayTimerEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: function(){
              this.flgShot = true;
            },
            callbackScope: this,
            repeat: 0
          });  
        }      
      }
    }

    /*======
    攻撃の時間になったら発射
    ========*/
    if(this.active && this.flgShot){
      _time = _time / 100;
      this.barrierRadius += 2;
    }

    /*======
    200以上移動したら0位置に戻して、4秒待機。
    ========*/
    if(this.active && this.flgShot && this.barrierRadius > 300){
      this.shotDelayTimerEvent = null;
      this.barrierRadius = 0;
      this.flgShot = false;
      this.shotActive = false;

      /*======
      攻撃後に移動するか
      ========*/
      if(!this.shotSaveTimerEvent){
        this.shotSaveTimerEvent = this.scene.time.addEvent({
          delay: 1000,
          callback: function(){
            this.shotSaveTimerEvent = null;
            this.alpha = 1;
            this.hideAnime();
          },
          callbackScope: this,
          repeat: 0
        });  
      }  
    }

    if(this.shotActive){
      this.aroundBulletGroup.children.entries.forEach(
        (sprite,index) => {

          _this.barrierDegree += _time/2000;
          sprite.x = _this.x + Math.cos(_this.barrierDegree + index)*_this.barrierRadius;
          sprite.y = _this.y + Math.sin(_this.barrierDegree + index)*_this.barrierRadius;  
  
        }
      );   
    }
    
 
    this.scene.physics.overlap(this.scene.player,this.aroundBulletGroup,
      function(player,aroundBullet){
        player.damage(this.status.power);
    },null,this);



    if (this.active) {
      this.hp.move(this.x,this.y);
    }
  }
  hideAnime(){
    let _this = this;
    this.appeared = false;
    this.invincible = true;
    this.hp.alpha = 0;
    let nextPostion;

    nextPostion = this.calc.createRandomPosition(
      this.maxDistanceArea.left,
      this.maxDistanceArea.right,
      this.maxDistanceArea.top,
      this.maxDistanceArea.bottom
    );
    _this.hp.hp_bar_bg.setVisible(false);
    _this.hp.hp_bar.setVisible(false);
    let hideAnime = this.scene.tweens.add({
      targets: _this.mask.bitmapMask,
      ease: 'liner',
      scaleX: 0,
      scaleY: 0,
      duration: 1000,
      repeat: 0,
      completeDelay: 4000,
      onComplete: function () {
        _this.x = nextPostion.x;
        _this.y = nextPostion.y;
        _this.mask.bitmapMask.x = _this.x;
        _this.mask.bitmapMask.y = _this.y;
        _this.appearAnime();
      },
    });
  }

  appearAnime(){
    let _this = this;
    let appearAnime = this.scene.tweens.add({
      targets: _this.mask.bitmapMask,
      ease: 'liner',
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      repeat: 0,
      onComplete: function () {
        _this.shotActive = true;
        _this.hp.hp_bar_bg.setVisible(true);
        _this.hp.hp_bar.setVisible(true);
        _this.invincible = false;
        _this.appeared = true;
      },
    });
  }
}