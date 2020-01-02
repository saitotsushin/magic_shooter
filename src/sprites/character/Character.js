import Calcs from '../../helper/Calcs';
import Hp from './Hp';
import Explode from './Explode';

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this._scene = config.scene;

    /*==============================
    ヘルパー関数群を呼び出し
    ==============================*/    
    this.calcs = new Calcs();

    this.status = {
      hp: 10,
      power: 5,
      defense: 1,
      experience: 10
    }
    this.active = true;
    this.invincible = false;
    this.appeared = true;
    this.type;
    
    this.hp = new Hp({
      scene: config.scene,
      key: 'hp',
      target: this,
      hp: this.status.hp
    });
    this.hp.active = true;

    this.damage_text = 0;
    this.damageText = this.scene.add.bitmapText(
      this.x,
      this.y,
      'bitmapFont',
      this.damage_text,
      30
    );
    this.damageText.depth = 10;

    this.damageText.setVisible(false);    

    this.isDamege = false;

    this.explodeSprite;

  }
  update(keys, time, delta) {
    if(!this.active){
      return;
    }
    if (this.active) {
      this.hp.move(this.x,this.y);
    }    
  }

  damage(num){

    if(this.invincible){
      return;
    }

    if(this.isDamege === true){
      return;
    }

    if(this.type !== "player"){
      this.scene.combo.hit();  
    }
    
    if(this.type === "player"){
      this.scene.powerUpList.addStep(-1);
    }
        
    let damage = num - this.status.defense;

    if(damage <= 0){
      damage = 1;
    }

    if(this.hp.active){
      this.hp.calc(damage*-1,this);
    }

    this.damageText.text = damage;
    this.damageText.x = this.x - this.body.halfWidth;
    this.damageText.y = this.y - this.height * 1.8;
    this.damageText.setVisible(true);

    var _damageText = this.damageText;
    var _damageText_x = this.damageText.x;
    var _damageText_y = this.y - this.height * 1.4;

    var damageTween = this.scene.tweens.add({
        targets: _damageText,
        y: _damageText_y,
        ease: 'liner',
        duration: 100,
        repeat: 0,
        completeDelay: 400,
        onComplete: function () {
          _damageText.setVisible(false);
        },
    });

    this.isDamege = true;

    var enemy = this;
    var enemyDamageTween = this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 200,
      loop: 10,
    });
    var stop = function(){
      enemyDamageTween.stop();
      enemy.alpha = 1;
      enemy.isDamege = false;
    }
    setTimeout(stop, 600);

    if (!this.hp.active) {
      this.hp.explode();
    }

    if (!this.active) {
      this.visible = false;
      this.explodeSprite = new Explode({
        scene: this.scene,
        key: "explosionAnime_m",
        x: this.x,
        y: this.y,
        target: this 
      });
      this.explodeSprite.setPlay();
    }
  }
  explode(){


    this.active = false;  
    this.explodeSprite.destroy();
    if(this.key === "dragon"){
      this.getExperience(this.status.experience);
      this.nextBoss();
      return;
    }
    if(this.key === "shadow"){
      this.getExperience(this.status.experience);
      this.scene.cameras.main.shake(1000, 0.01, 0.01) //Duration, intensity, force
      let _scene = this._scene;
      setTimeout(
        function(){
          _scene.clearGameObj.open();
        }
      , 3000);
      this.destroy();
      return;
    }
    if(this.type === "enemy"){
      this.getExperience(this.status.experience);
      this.dropItem();
    }
    

    if(this.type === "player"){
      let _scene = this._scene;
      setTimeout(
        function(){
          _scene.gameOverObj.gameOverDisplay();
        }
      , 1000);
    }    
    if(this.type === "boss"){
      this.getExperience(this.status.experience);
      let _scene = this._scene;
      setTimeout(
        function(){
          _scene.clearStageObj.clearStageDisplay();
        }
      , 1000);
    }
    this.destroy();
  }
  getExperience(experience){


    let setExperience = this.scene.registry.list.experience + experience;

    this.scene.registry.set('experience', setExperience);

  }
}
