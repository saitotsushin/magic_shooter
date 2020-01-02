import Character from './Character';
import ActiveTime from './ActiveTime';
import Bullet from '../weapon/Bullet';
import Calcs from '../../helper/Calcs';


export default class Player extends Character{
  constructor(config) {
    super(config);

    this.status = {
      hp: 100,
      power: 1000,
      defense: 1,
      experience: 10,
      level: 1
    }
    this.hp.hp = this.status.hp;
    this.hp.hpMax = this.status.hp;
    this.type = "player";
    this.mode = "";

    this.activeTime = new ActiveTime({
      scene: config.scene,
      parent: this
    });
    

    this.attackVelocity = new Phaser.Math.Vector2();

    let _this = this;

    this.activeTime.depth = 1;


    this.calc = new Calcs();

    this.animsStatus = "playerBottom";



    /*==============================
    バリアー
    ==============================*/
    this.barrier = this.scene.add.sprite(this.x, this.y, 'bullet_player');
    this.barrier.radian;
    config.scene.physics.world.enable(this.barrier);
    config.scene.add.existing(this.barrier);

    this.barrier.setOrigin(0.5,0.5);
    this.barrier.setActive(true);
    this.barrier.setVisible(true);

    this.barrier.scaleX = 0;
    this.barrier.scaleY = 0;

    this.barrierDegree = 0;
    this.barrierRadius = 18;

    this.barrier.power = this.status.power;

  }
  update(keys, time, delta) {
    /*==============================
    プレイヤーの移動
    ==============================*/
    if(this.active === false){
      return;
    }
    if(!this.scene.stageActive){
      return;
    }

    this.setVelocityX(keys.DIRECTION.x*4);
    this.setVelocityY(keys.DIRECTION.y*4);
    if (this.active) {
      this.hp.move(this.x,this.y);

      var radian = Math.atan2(keys.VECTOR.x, keys.VECTOR.y);
      var degree = radian *  180 / Math.PI *-1;

    }  

    this.scene.physics.overlap(this.scene.enemyGroup,this.barrier,
      function(enemy,barrier){
        if(!barrier.active){
          return;
        }
        enemy.damage(this.status.power);
    },null,this);

    this.barrierDegree += 0.15;

    if(keys.DIRECTION.y > 0.2 && keys.DIRECTION.y !== 0){
      this.animsStatus = "playerBottom";
    }
    if(keys.DIRECTION.y < 0.2 && keys.DIRECTION.y !== 0){
      this.animsStatus = "playerTop";
    } 
    if(this.mode == "star"){
      if(this.animsStatus === "playerBottom"){
        this.animsStatus = "playerStarBottom";
      }
      if(this.animsStatus === "playerTop"){
        this.animsStatus = "playerStarTop";
      }
    }

    this.anims.play(this.animsStatus, true);


    if(keys.isTOUCH === true){

      this.barrier.setVisible(true);
      this.barrier.setActive(true);
      this.barrier.x = this.x + Math.cos(this.barrierDegree)*this.barrierRadius;
      this.barrier.y = this.y + Math.sin(this.barrierDegree)*this.barrierRadius;

      
      this.barrier.scaleX = this.activeTime.per;
      this.barrier.scaleY = this.activeTime.per;

      this.activeTime.pileUp();

    }else{
      this.barrier.scaleX = 0;
      this.barrier.scaleY = 0;
      this.barrier.setVisible(false);
      this.barrier.setActive(false);
    }

    if(keys.isRELEASE === true){

      if(this.activeTime.flg_max === true){
        this.attackVelocity = this.calc.returnMax1(
          this.barrier.x - this.x,
          this.barrier.y - this.y
        );
        this.attack();
      }
      this.activeTime.pileReset(); 
    } 

  }
  attack(){
    let bullet = {
      vx: 0,
      vy: 0
    };
    
    let vec = this.calc.returnMax1(
      this.barrier.x - this.x,
      this.barrier.y - this.y
    );
    let _vx = 0;
    let _vy = 0;

    if(this.status.level > 2){
      let degreeAdd = 30;
      let degreeBase = Math.atan2(this.attackVelocity.y, this.attackVelocity.x)* 180 / Math.PI;
      
      let degreeAfter = 0;
      let radiusAfter = 0;      

      for(var i = 0; i < 3; i++){
        degreeAfter = 0;
        radiusAfter = 0;
        if(i === 0){
          degreeAfter = degreeBase + degreeAdd;
          radiusAfter = degreeAfter * ( Math.PI / 180 ) ;
          bullet.vx = Math.cos(radiusAfter);
          bullet.vy = Math.sin(radiusAfter);    
        }
        if(i === 1){
          bullet.vx = vec.x;
          bullet.vy = vec.y;
          degreeAfter = degreeBase;
        }
        if(i === 2){
          degreeAfter = degreeBase - degreeAdd;
          radiusAfter = degreeAfter * ( Math.PI / 180 ) ;
          bullet.vx = Math.cos(radiusAfter);
          bullet.vy = Math.sin(radiusAfter);   
        }
        this.fromShotPool(bullet);
      }
    }else{
      bullet.vx = vec.x;
      bullet.vy = vec.y;
      this.fromShotPool(bullet);
    }
  }
  starMode(){
    this.invincible = true;
    this.starTimerEvent = this.scene.time.delayedCall(
      5000,
      function(){
        this.invincible = false;
        this.mode = "";
      },
      [],
      this);
  }
  createShot(object){    
    let bullet = new Bullet({
      scene: this.scene,
      x: this.x,
      y: this.y,
      key: "bullet_player"
    }); 
    this.scene.playerWeaponGroup.add(bullet);
  }
  fromShotPool(object){
    let bullet = this.scene.playerWeaponGroup.getFirst();
    if(!bullet){
      this.createShot();
      bullet = this.scene.playerWeaponGroup.get()
    }
    bullet.x = this.barrier.x;
    bullet.y = this.barrier.y;
    bullet.vx = object.vx;
    bullet.vy = object.vy;
    if(this.status.level > 4){
      bullet.scaleX = 2;
      bullet.scaleY = 2;
    }else{
      bullet.scaleX = 1;
      bullet.scaleY = 1;  
    }
    bullet.shot(this.status.power);
  }
}
