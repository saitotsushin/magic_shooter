export default class FireArea extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.frame
    );
    
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

  }
}