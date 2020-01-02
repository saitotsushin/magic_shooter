import Enemy from '../Enemy';
import Calcs from '../../../helper/Calcs';
import Bullet from '../../weapon/Bullet';

export default class Shadow extends Enemy {

  constructor(config) {

    super(config);

    this.type = "boss";
    this.key = "shadow";
    this.depth = 1;

    this.base_y = this.y;

    this.status = {
      hp: 30,
      power: 5,
      defense: 10,
      experience: 50,
      walkSpeed: 12
    }

    let _this = this;

    this.attackDegree = 0;

    this.calc = new Calcs();

    this.canAttack = false;

    this.shadowAttack = config.scene.add.group({
      runChildUpdate: true 
    });
    this.attackDirection = ["left", "right", "bottom"];

    this.shotMaxCount = 10;
    this.shotCount = 0;
    this.shotTimerEvent;

    config.scene.physics.add.overlap(this.shadowAttack,config.scene.player,this.bullet_x_player_Collision);
    config.scene.physics.add.overlap(this.shadowAttack,config.scene.playerWeaponGroup,this.bullet_x_playerWeapon_Collision);

    this.scene.time.addEvent({ delay: 10, callback: function(){this.canAttack = true;}, callbackScope: this });

    this.shotAllTimerEvent;

    this.attackMode = "";

    this.playerPosition;

  }
  bullet_x_player_Collision(bullet,player){
    if(!bullet.active){
      return;
    }
    player.damage(bullet.power);
    bullet.explode();

  }
  bullet_x_playerWeapon_Collision(bullet,playerWeapon){
    if(!playerWeapon.visible){
      return;
    }
    bullet.explode();
  }
  update(keys, time, delta) {


    if (!this.active) {
      return;
    }

    if (this.active) {
      this.hp.move(this.x,this.y);
    }
    

    if(this.canAttack){
      this.canAttack = false;
      this.scene.time.addEvent({ delay: 5000, callback: this.hideAttack, callbackScope: this });

      this.attackSelect();
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
    this.attackMode = "attack1";
    if(!this.active){
      return;
    }
    let direction = this.attackDirection[Math.floor(Math.random() * this.attackDirection.length)];
    this.shotTimerEvent = this.scene.time.addEvent({
      delay: 200,
      duration: 100,
      startAt: 200,
      callback: function(){
        this.shotBullet(direction);
        this.shotCount++;
      },
      callbackScope: this,
      repeat: this.shotMaxCount - 1
    });
  }
  hideAttack(){
    this.canAttack = true;
    this.shotCount = 0;
    this.attackDegree = 0;
    if(this.shotStartTimerEvent){
      this.shotStartTimerEvent = null;
      this.shotTimerEvent.remove(false);  
    }
  }
  attack2(){
    this.attackMode = "attack2";

    this.playerPosition = {
      x: this.scene.player.x + this.scene.player.width/2,
      y: this.scene.player.y + this.scene.player.height/2
    }

    this.shotTimerEvent = this.scene.time.addEvent({
      delay: 100,
      duration: 100,
      startAt: 100,
      callback: function(){

        this.arroundBullet(this.playerPosition);
        this.shotCount++;
      },
      callbackScope: this,
      repeat: this.shotMaxCount - 1
    });
  }
  arroundBullet(playerPosition){
    this.attackDegree += 32;
    let degree = this.attackDegree * ( Math.PI / 180 );
    let radius = 50;
    let add_x = radius * Math.sin(degree);
    let add_y = radius * Math.cos(degree);
    let playerPoint2 = this.scene.player.getCenter();
    let playerPoint = playerPosition;

    let bulletPoint = {
      x: playerPosition.x + add_x,
      y: playerPosition.y + add_y
    }

    var vecter = {
      x: playerPosition.x - bulletPoint.x,
      y: playerPosition.y - bulletPoint.y
    }


    var rangeRadius = 1;
    var radian = Math.atan2(vecter.x, vecter.y);
    let _vx = Math.sin(radian);
    let _vy = Math.cos(radian);

    let bullet = {
      x: playerPosition.x + add_x,
      y: playerPosition.y + add_y,
      vx: _vx,
      vy: _vy,
      deadPoint: playerPosition
    }
    this.fromShotPool(bullet);


  }
  shotBullet(direction){
    let bullet;
    if(direction === "bottom"){
      bullet = {
        x: this.shotCount * 16,
        y: this.y + this.height/2,
        vx: 0,
        vy: 5
      }  
    }
    if(direction === "left"){
      bullet = {
        x: 16,
        y: this.y + this.height/2 + this.shotCount * 16,
        vx: 5,
        vy: 0
      }  
    }
    if(direction === "right"){
      bullet = {
        x: this.scene.game.config.width - 16,
        y: this.y + this.height/2 + this.shotCount * 16,
        vx: -5,
        vy: 0
      }  
    }

    this.fromShotPool(bullet);
  }
  createShot(object){    
    let bullet = new Bullet({
      scene: this.scene,
      x: this.x,
      y: this.y,
      key: "shadow_shot"
    }); 
    this.shadowAttack.add(bullet);
  }
  fromShotPool(object){
    let bullet = this.shadowAttack.getFirst();
    if(!bullet){
      this.createShot();
      bullet = this.shadowAttack.get()
    }

    bullet.x = object.x;
    bullet.y = object.y;
    bullet.vx = object.vx;
    bullet.vy = object.vy;

    if(this.attackMode === "attack1"){
      bullet.shot(this.status.power);
    }
    if(this.attackMode === "attack2"){
      bullet.deadPoint = object.deadPoint;
      bullet.canShot = false;
      bullet.active = true;
      bullet.setActive(true);
      bullet.setVisible(true);
      this.scene.time.delayedCall(
        (this.shotMaxCount - this.shotCount + 8) * 100,
        function(){
          if(!bullet.active){
            bullet.vx = 0;
            bullet.vy = 0;
            return;
          }
          bullet.canShot = true;
          bullet.shot(this.status.power);
        },
        [],
        this
      );  
    }
  }
}