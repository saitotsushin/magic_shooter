import EnemyChase from './EnemyChase';

export default class Wizerd extends EnemyChase {

  constructor(config) {

    super(config);

    this.status = {
      hp: 10,
      power: 5,
      defense: 1,
      experience: 10
    }
    this.hp.hp = this.status.hp;
    this.hp.hpMax = this.status.hp;
    let _this = this;

    this.ATTACKING_DISTANCE = 30;
    this.CHASING_DISTANCE = 100;
    this.barrier = this.scene.add.sprite(this.x, this.y, 'barrier');
    this.barrier.radian;
    this.barrier.depth = 11;
    config.scene.physics.world.enable(this.barrier);
    config.scene.add.existing(this.barrier);
    config.scene.physics.add.overlap(this.scene.player,this.barrier,
      function(player,barrier){
        if(!_this.active){
          return;
        }
        player.damage(_this.status.power);

    });
    this.barrier.setOrigin(0.5,0.5);
    this.barrier.setVisible(true);
    
    this.attackingMoveTimerEvent;
    this.attackMoveTween = this.scene.tweens.createTimeline();
    this.isAttacking = false;

    this.barrierDegree = 0;
    this.barrierRadius = 20;

    

  }

  update(keys, time, delta) {

    if(this.hp <= 0){
      this.barrier.destroy();
    }
    if (!this.active) {
      this.barrier.setVisible(false);
      return;
    }

    this.handleChase();
    this.hp.move(this.x,this.y);

    if (this.shouldChase() ) {
      this.barrierDegree += time/100;
      this.barrier.setVisible(true);
      this.barrier.x = this.x + Math.cos(this.barrierDegree)*this.barrierRadius;
      this.barrier.y = this.y + Math.sin(this.barrierDegree)*this.barrierRadius;     
    }else{
      this.barrierDegree = 0;
      this.barrier.setVisible(false);
      this.barrier.x = this.x;
      this.barrier.y = this.y;
    }


  }
  attack(){

  }
  attackStop(){
    this.isAttacking = false;
    this.barrier.setVisible(false);
  }
}