export default class Explode extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.frame,
      config.target
    );

    config.scene.add.existing(this);

    
    this.on('animationcomplete', function() {
      config.target.explode();
    },this);

  }

  update(time, delta) {

  }
  explode(){
    
  }
  setPlay(){
    this.anims.play('explosionAnime_m', true);
  }
}