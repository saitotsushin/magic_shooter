import EnemyChase from '../enemy/EnemyChase';

export default class Robot extends EnemyChase {

  constructor(config) {

    super(
      config
    );

    this.key = "robot_base";
    this.type = "boss";

    this._scene = config.scene;
    this.lazer_base = this.scene.add.sprite(this.x, this.y, 'lazer_base');
    this.lazer_long = this.scene.add.sprite(this.x, this.y, 'lazer_long');
    this.lazer_long.setVisible(false);
    this.lazer_long.setOrigin(0.5,0);
    this.lazer_long.power = 1;
    config.scene.physics.world.enable(this.lazer_long);
    config.scene.add.existing(this.lazer_long);

    this.lazer_base.setVisible(false);
    this.lazer_base.setFlipY(true);

    this.arm_l = this.scene.add.sprite(this.x-14, this.y+12, 'robot_arm_l');
    config.scene.physics.world.enable(this.arm_l);
    config.scene.add.existing(this.arm_l);
    this.arm_l.setVisible(false);

    this.arm_r = this.scene.add.sprite(this.x+14, this.y+12, 'robot_arm_r');
    config.scene.physics.world.enable(this.arm_r);
    config.scene.add.existing(this.arm_r);
    this.arm_r.setVisible(false);



    this.status = {
      hp: 10,
      power: 5,
      defense: 5,
      experience: 10,
      walkSpeed: 12
    }
    this.ATTACKING_DISTANCE = 80;
    this.CHASING_DISTANCE = 200;
    this.hp.hp = this.status.hp;
    this.hp.hpMax = this.status.hp;

    this.arm_r_Degree = 0;
    this.arm_r.power = 10;
    this.armRadius = 20;
    this.isArm_r_Attacking = false;

    this.mode = "";
  }
  update(keys, time, delta) {
    if (!this.active) {
      this.arm_l.setVisible(false);
      this.arm_r.setVisible(false);
      this.lazer_long.setVisible(false);
      this.lazer_base.setVisible(false);
      return;
    }
    if(this.appearFlg){
      this.arm_l.setVisible(true);
      this.arm_r.setVisible(true);
    }
    this.hp.move(this.x,this.y);
    this.handleChase();
    if(this.mode !== "attack"){
      this.arm_l.x = this.x-14;
      this.arm_l.y = this.y+12;
      this.arm_r.x = this.x+14;
      this.arm_r.y = this.y+12;
    }else{
      this.stopRunning();
    }

    this.scene.physics.overlap(this.scene.player,this.arm_r,
      function(player,arm_r){
        player.damage(arm_r.power);
    },null,this);

    this.scene.physics.overlap(this.scene.player,this.lazer_long,
      function(player,lazer_long){
        player.damage(lazer_long.power);
    },null,this);
  }

  attack(){
    if (!this.active) {
      return;
    }
    if(this.mode === ""){
      if(this.y + this.height/2 < this.scene.player.y){
        this.attackLezer();
      }else{
        this.attackArm();
      }
    }

  }
  attackLezer(){
    this.lazer_base.x = this.arm_l.x;
    this.lazer_base.y = this.arm_l.y + this.arm_l.height/2;
    this.lazer_base.setVisible(true);

    this.lazer_long.x = this.arm_l.x;
    this.lazer_long.y = this.arm_l.y + this.arm_l.height/2;
    this.lazer_long.setVisible(true);
    this.mode = 'attack';
    let _this = this;
    let _target_base = this.lazer_base;
    let _target = this.lazer_long;

    this.lazer_baseAttack = this.scene.tweens.timeline({
      targets: _target_base,
      tweens: [
      {
        scaleX: 1,
        scaleY: 1,
        duration: 500
      },
      {
        scaleX: 4,
        scaleY: 4,
        duration: 500
      },
      {
        scaleX: 4,
        scaleY: 4,
        duration: 2000
      },
      {
        scaleX: 1,
        scaleY: 1,
        duration: 500
      }
      ],
      ease: 'liner',
      duration: 400,
      repeat: 0
    }); 
    this.lazer_Attack = this.scene.tweens.timeline({
      targets: _target,
      tweens: [
      {
        scaleX: 0,
        scaleY: 0,
        duration: 500
      },
      {
        scaleX: 4,
        scaleY: 1,
        duration: 500
      },
      {
        scaleX: 4,
        scaleY: 20,
        duration: 2000
      },
      {
        scaleX: 4,
        scaleY: 0,
        duration: 500
      }
      ],
      ease: 'liner',
      duration: 400,
      repeat: 0,
      completeDelay: 400,
      onComplete: function () {
        _this.mode = "";
        _this.lazer_base.setVisible(false);
        _this.lazer_long.setVisible(false);
      }
    }); 
  }
  attackArm(){

    this.mode = 'attack';
    let _this = this;
    let _target = this.arm_r;
    let _target_x = this.arm_r.x;
    let _target_y = this.arm_r.y;
    let _player = this.scene.player;
    this.arm_R_Attack = this.scene.tweens.timeline({
      targets: _target,
      tweens: [
      {
        x: _target_x,
        y: _target_y,
      },
      {
        x: _target_x+4,
        y: _target_y+10,
      },
      {
        x: _player.x,
        y: _player.y,
      },
      {
        x: _target_x,
        y: _target_y,
        scaleX: 1,
        scaleY: 1
      },
      ],
      ease: 'liner',
      duration: 400,
      repeat: 0,
      completeDelay: 400,
      onComplete: function () {
        _this.mode = "";
      }
    });     
  }
}