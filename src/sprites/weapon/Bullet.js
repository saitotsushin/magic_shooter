import Calcs from '../../helper/Calcs';
import Explode from '../character/Explode';

export default class Bullet extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.frame
    );
    this.power = 1;
    this.active = false;
    this.key = "bullet";


    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setCircle(this.body.width/2);
    
    this.vx = 0;
    this.vy = 0;

    this.speed = 100;
    this.active = false;

    this.calcs = new Calcs();

    this.vector_max_1 = {
      x: 0,
      y: 0
    };
    
    this.body.setGravity(0,0);
    this.breakTime = 1000;
    this.breakCounter = this.breakTime;

    this.canShot = true;

    this.deadPoint = {
      x: 0,
      y: 0
    }

    this.deadRadius = 10;

  }

  update(time, delta) {



    if(!this.active){
      this.body.setVelocity(0,0);
      return;
    }
    if(!this.canShot){
      return;
    }
    if(this.canShot){
      this.breakCounter -= delta;
    }

    if(this.breakCounter < 0){
      this.explode();      
    }
    if(this.active){
      let getCenter = this.getCenter();
      if(this.deadRadius*this.deadRadius >= (this.deadPoint.x - getCenter.x)*(this.deadPoint.x - getCenter.x) + (this.deadPoint.y - getCenter.y)*(this.deadPoint.y - getCenter.y)){
        this.explode();
        return;
      }
      if(this.deadPoint.x == getCenter.x && this.deadPoint.y === getCenter.y){
      }
      this.body.setVelocity(
        this.vector_max_1.x*this.speed,
        this.vector_max_1.y*this.speed
      );
    }
  }
  shot(power){


    this.power = power ? power : this.power;

    if(!this.canShot){
      return;
    }
    this.canShot = true;
    
    this.setPosition(this.x,this.y);
    this.setActive(true);
    this.setVisible(true);
    this.breakCounter = this.breakTime;

    /*==============================
    受け取ったベクトルをMAXを1にしてvx*speedを均等にする。
    ==============================*/
    this.vector_max_1 = this.calcs.returnMax1(this.vx,this.vy);

  }



  explode() {

    this.setActive(false);
    this.setVisible(false);
 
    this.body.setVelocity(0,0);
    this.vx = 0;
    this.vy = 0;

  }

  bounce(){

    if(!this.active){
      this.body.setVelocity(0,0);
      return false;
    }

    if(this.body.blocked.up || this.body.blocked.down){
      this.vector_max_1.y = this.vector_max_1.y * -1;
    }
    if(this.body.blocked.left || this.body.blocked.right){
      this.vector_max_1.x = this.vector_max_1.x * -1;
    }

    this.body.setVelocity(this.vector_max_1.x*this.speed,this.vector_max_1.y*this.speed);
  }

}
