import Enemy from '../Enemy';

export default class Stone extends Enemy {

  constructor(config) {

    super(config);

    this.type = "boss";
    this.key = "stone";

    this.base_y = this.y;

    this.status = {
      hp: 20,
      power: 5,
      defense: 6,
      experience: 20,
      walkSpeed: 12
    }

    this.TILE_WIDTH = 16;

    this.maxDistanceArea = {
      top: this.y + 20,
      left: this.width/2 + this.TILE_WIDTH,
      right: config.scene.game.config.width - this.width/2 - this.TILE_WIDTH,
      bottom: this.y + 140
    }
    this.moveDirection = {
      x: 1,
      y: 10
    }
    this.attackTimerEvent;

    this.runMode = "run";
    this.bossAttackBefore = this.scene.tweens.createTimeline();
    this.bossAttackMove = this.scene.tweens.createTimeline();
  }
  update(){
    if (!this.active) {
      return;
    }
    if (this.active) {
      this.hp.move(this.x,this.y);
      if(this.runMode === "run"){
        this.invincible = true;
        this.checkDistance("run");
      }
      if(this.runMode === "attack"){
        this.invincible = false;
        this.checkDistance("attack");
      }      
      

      if(!this.attackTimerEvent){
        this.attack();
      }

    }
    if (!this.active) {
      this.attackTimerEvent.remove(false);
      this.bossAttackBefore.stop();
      this.bossAttackBefore.destroy();
      this.bossAttackMove.stop()
      this.bossAttackMove.destroy();
    }
    if(this.explodeAnime){
      this.explodeAnime.update(time, delta);
    }
  }
  attack(){
    this.attackTimerEvent = this.scene.time.addEvent({
      delay: 6000,
      callback: this.attackAnimation,
      callbackScope: this,
      repeat: -1,
    });    
  }
  attackAnimation(){
    if(!this.active){
      return;
    }
    this.runMode = "attack";
    let _target = this;
    this.body.setVelocity(0,0);
    let _target_y = _target.y;
    
    this.bossAttackBefore = this.scene.tweens.timeline({
      targets: _target,
      tweens: [{
        y: _target_y,
      },
      {
        y: _target_y+5,
      }],
      ease: 'liner',
      duration: 100,
      repeat: 4,
      completeDelay: 400,
      onComplete: function () {
        _target.attackMove();
      }
    });    
  }
  attackMove(){
    if(!this.active){
      return;
    }
    let _target = this;
    let _target_y = this.base_y;
    this.bossAttackMove = this.scene.tweens.timeline({
      targets: _target,
      tweens: [{
        x: _target.x,
        y: _target_y,
      },
      {
        x: _target.x,
        y: _target.maxDistanceArea.bottom
      },
      {
        x: _target.x,
        y: _target_y,
      },
      ],
      ease: 'liner',
      duration: 600,
      repeat: 0,
      completeDelay: 400,
      onComplete: function () {
        _target.runMode = "run";
      }
    });     
  }
  checkDistance(_mode){

    if(_mode === "attack"){
      this.body.setVelocity(0,0);
      return;
    }

    if(_mode === "run"){
      if(this.x <= this.maxDistanceArea.left ){
        this.moveDirection.x = 1;
      }
      if(this.x >= this.maxDistanceArea.right ){
        this.moveDirection.x = -1;
      }
  
      this.body.setVelocity(
        this.moveDirection.x*this.status.walkSpeed,
        0
      );   
    }
  }

}