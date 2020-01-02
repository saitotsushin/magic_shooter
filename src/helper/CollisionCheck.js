export default class CollisionCheck{
  constructor(config) {

    var _this = config.scene;
    this.scene = 
    this._scene = config.scene;
    _this.physics.add.collider(_this.player,_this.objectLayer);
    _this.physics.add.collider(_this.player,_this.groundLayer);
    _this.physics.add.collider(_this.enemyGroup,_this.groundLayer);
    _this.physics.add.collider(_this.enemyGroup,_this.objectLayer);

    _this.physics.add.overlap(_this.player,_this.enemyGroup,this.player_x_Enemy_Collision);
    _this.physics.add.overlap(_this.player,_this.enemyWeaponGroup,this.player_x_enemyWeapon_Collision);

    _this.physics.add.overlap(_this.enemyGroup,_this.playerWeaponGroup,this.enemy_x_playerWeapon_Collision);
    _this.physics.add.overlap(_this.player,_this.itemGroup,this.player_x_item_Collision);

   

    _this.physics.add.collider(_this.playerWeaponGroup,_this.objectLayer,this.bulletBounceCollision,null, this);
    _this.physics.add.collider(_this.enemyWeaponGroup,_this.objectLayer,this.bulletCollision,null, this);

  }
  player_x_Enemy_Collision(player,enemy){
    if(!enemy.active){
      return;
    }
    if(!enemy.appeared){
      return;
    }
    player.damage(enemy.status.power);
 
  }
  player_x_enemyWeapon_Collision(player,obj){
    if(!obj.active){
      return;
    }
    player.damage(obj.power);
    
    obj.explode();
  }
  enemy_x_playerWeapon_Collision(enemy,obj){
    if(!enemy.active){
      return;
    }
    if(!enemy.appeared){
      return;
    }
    if(!obj.active){
      return;
    }
    enemy.damage(obj.power);
    if(enemy.active){
      obj.explode();
    }
    
  }
  player_x_item_Collision(player,obj){
    if(!obj.active){
      return;
    }
    obj.hit(player,obj);
  }

  item_x_ground_Collision(item,obj){
  }
  item_x_objectGround_Collision(item,obj){
    item.checkCollision(item,obj);
  }
  item_x_enemy_Collision(item,enemy){
    if(!enemy.active){
      return;
    }
    item.checkCollision(item,enemy);
  }
  bulletBounceCollision(bullet,ground){
    if(this.scene.player.status.level > 1){
      bullet.bounce(); 
    }else{
      bullet.explode();
    }
  }
  bulletCollision(bullet,ground){
    bullet.explode();
  }
}
