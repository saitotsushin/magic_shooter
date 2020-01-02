import Item from './Item';
import FireArea from './FireArea';
import Calcs from '../../helper/Calcs';

export default class Fire extends Item {
  constructor(config) {
    super(config);
    this._scene = config.scene;
    this.throwed = false;
    this.speed = 80;
    this.hitCount = 0;
    this.count = 0;

    this.active = true;
    this.visible = true;    
    this.areaTimer;
    this.depth = 10;
    this.calc = new Calcs();

    this.attack_once = false;
    config.scene.physics.add.collider(this,config.scene.enemyGroup,this.checkCollision,null, this);
    config.scene.physics.add.collider(this,config.scene.objectLayer,this.checkCollision,null, this);

    this.vec;

  }

  update(keys, time, delta){

    
    if(!this.throwed){
      this.x = this._scene.player.x + 10;
      this.y = this._scene.player.y - 10;  
    }else{
      this.body.setVelocity(
        this.vec.x*this.speed,
        this.vec.y*this.speed
      );
  
    }
    if(keys.isRELEASE === true && !this.throwed){
      this.throwItem();
    }
  }
  hit(player,obj){
    if(this.hitCount > 0){
      return;
    }
    this.hitCount++;
    if(this._scene.player.attached){
      return;
    }else{
      this._scene.player.attached = true;      
      this._scene.player.attach = this;
    }
  }
  throwItem(){
    this.throwed = true;

    this.vec = this.calc.returnMax1(
      this._scene.player.barrier.x - this._scene.player.x,
      this._scene.player.barrier.y - this._scene.player.y
    );
    this.x = this._scene.player.x;
    this.y = this._scene.player.y;  

  }
  checkCollision(item,obj){

    if(this.attack_once){
      return;
    }

    let target = {
      x: 0,
      y: 0
    }

    if(this.throwed === true){
      if(obj.type === "enemy"){
        target.x = obj.x;
        target.y = obj.y;
      }else{
        target.x = item.x;
        target.y = item.y;
      }
      let radius = 46;

      this._scene.enemyGroup.children.entries.forEach(
        (sprite) => {
          if(radius*radius >= (sprite.x - target.x)*(sprite.x - target.x) + (sprite.y - target.y)*(sprite.y - target.y)){
            if(sprite.active){
              sprite.damage(item.power);
            }
          }
        }
      );
      let area = new FireArea({
        scene: this._scene,
        x: target.x,
        y: target.y,
        key: 'fire_area'
      });
      area.depth = 2;
      this.scene.spellGroup.add(area);


      let areaTimer2 = this._scene.time.delayedCall(
        1000,
        function(){
          this._scene.spellGroup.children.entries.forEach(
            (sprite) => {
              sprite.destroy();
          });
          this._scene.itemGroup.children.entries.forEach(
            (sprite) => {
              sprite.hitCount = 0;
          });
          this._scene.combo.combo_count = 0;
          this.destroy();
        },
        [],
        this
      ); 

      this.attack_once = true;
      this.visible = false;

    }else{
      return;
    }
  }
  area_x_enemy_Collision(area,enemy){
    enemy.alpha = 0.4;
  }

}