import Enemy from '../Enemy';
import Calcs from '../../../helper/Calcs';

export default class Smoke extends Enemy {

  constructor(config) {

    super(config);

    this._scene = config.scene;

    this.type = "boss";
    this.key = "stone";

    this.base_y = this.y;

    this.status = {
      hp: 20,
      power: 5,
      defense: 6,
      experience: 10,
      walkSpeed: 12
    }
    this.MONSTER_SPEED = 20;

    this.isAttacking = false;

    this.smakeChildStatus = {
      power: 10
    };

    /*======
    弾の準備
    ========*/    
    this.smokeChildGroup = config.scene.add.group();
    let smokeChildLength = 7;

    for(var i = 0; i < smokeChildLength; i++){
      let smoleChildSprite = config.scene.add.sprite(this.x, this.y, 'smoke_s');
      smoleChildSprite.power = this.smakeChildStatus.power;
      config.scene.physics.world.enable(smoleChildSprite);
      config.scene.add.existing(smoleChildSprite);  
      smoleChildSprite.setOrigin(0.5,0.5);
      smoleChildSprite.setVisible(false);
      this.smokeChildGroup.add(smoleChildSprite);
    }
    this.attackStartTimerEvent;
    this.attackAppearTimerEvent;
    this.idleTimerEvent;

    this.moveAttackStart = null;
    
  }
  update(){
    if (!this.active) {
      if(this.moveAttackStart){
        this.moveAttackStart.stop();
        this.attackAppearTimerEvent.remove(false);
        this.idleTimerEvent.remove(false);
      }
      return;
    }
    if (this.active) {
      this.hp.move(this.x,this.y);
    }
    if(!this.idleTimerEvent){
      this.idleTimerEvent = this.scene.time.addEvent({
        startAt: 3000,
        delay: 3000,
        callback: this.run,
        callbackScope: this,
        loop: true
      });
    }
    if(!this.attackAppearTimerEvent){
      let _this = this;
      this.attackAppearTimerEvent = this.scene.time.delayedCall(
        6000,
        function(){
          this.isAttacking = true;
          this.stopRun();
          this.moveAttackStartAnime();
        },
        [],
        this
      );  
    }
    this.scene.physics.overlap(this.scene.player,this.smokeChildGroup,
      function(player,smokeChild){
        if(smokeChild.visible === false){
          return;
        }
        player.damage(smokeChild.power);
    },null,this);

    this.scene.physics.overlap(this.scene.player.barrier,this.smokeChildGroup,
      function(barrier,smokeChild){
        if(barrier.visible === false && smokeChild.visible === false){
          return;
        }
        smokeChild.setVisible(false);
    },null,this);

    this.scene.physics.overlap(this.scene.playerWeaponGroup,this.smokeChildGroup,
      function(playerWeapon,smokeChild){
        smokeChild.setVisible(false);
    },null,this);
  }
  attack(){
  }
  run(){
    if(!this.active){
      return;
    }
    if(this.isAttacking === true){
      return;
    }
    let random = {
      x: this.calcs.getRandom(-1,1),
      y: this.calcs.getRandom(-1,1)
    };

    let random_vec = this.calcs.returnMax1(random.x,random.y);

    this.setVelocityX(random_vec.x * this.MONSTER_SPEED);
    this.setVelocityY(random_vec.y * this.MONSTER_SPEED);

  }
  stopRun(){
    if(!this.active){
      return;      
    }
    this.setVelocityX(0);
    this.setVelocityY(0);    
    this.idleTimerEvent.paused = true;
  }
  moveAttackStartAnime(){
    if(!this.active){
      return;
    }
    let _this = this;
    this.moveAttackStart = this.scene.tweens.add({
      targets: this,
      ease: 'liner',
      x: this._scene.game.config.width/2,
      y: this._scene.game.config.width + this.height,
      duration: 1000,
      repeat: 0,
      onComplete: function () {
        _this.appearChildAnime();
        
      },
    }); 
  }
  appearChildAnime(sprite){
    let _this = this;
    let _delay = 400;
    let _start_pos_x = 40;
    let _start_pos_y = this._scene.game.config.width + this.height + 40;
    let _padding_side = 20;
    let _distance_height = this._scene.game.config.width + this.height + 200;
    let _pos_x = 0;
    let _pos_y = 0;

    this.smokeChildGroup.children.entries.forEach(
      (sprite,index) => {

        _pos_x = _start_pos_x + _padding_side * index;
        if(index % 2 === 0){
          _pos_y = _start_pos_y
        }else{
          _pos_y = _distance_height;
        }

        sprite.x = _pos_x;
        sprite.y = _pos_y - 20;
        sprite.opacity = 0;
        sprite.scaleX = 0;
        sprite.scaleY = 0;
        sprite.setVisible(true);

        let appearAnime = _this.scene.tweens.add({
          targets: sprite,
          ease: 'liner',
          x: _pos_x,
          y: _pos_y,
          scaleX: 1,
          scaleY: 1,
          duration: 400,
          delay: index * _delay,
          repeat: 0,
          onComplete: function () {
            if(index === 6){
              _this.attackStartTimerEvent = _this.scene.time.delayedCall(
                1000,
                function(){
                  _this.appearChild();
                },
                [],
                _this
              );              
            }
          },
        }); 
      }
    );
  }
  appearChild(){
    let _this = this;
    let _top = -100;
    let _bottom = 500;
    let _pos_y = 0;
    this.smokeChildGroup.children.entries.forEach(
      (sprite,index) => {
        if(index % 2 === 0){
          _pos_y = _bottom;
        }else{
          _pos_y = _top;
        }
        let appearAttackAnime = _this.scene.tweens.add({
          targets: sprite,
          ease: 'liner',
          y: _pos_y,
          scaleX: 1,
          scaleY: 1,
          duration: 3000,
          repeat: 0,
          completeDelay: 0,
          onComplete: function () {
            sprite.x = _this.x;
            sprite.y = _this.y;
            setTimeout(function(){
              _this.attackAppearTimerEvent = null;
            }, 1000);
            
            sprite.setVisible(false);
            _this.isAttacking = false;
            _this.idleTimerEvent.paused = false;
          },
        }); 
      }
    );
  }
  move1(time){


  }

}