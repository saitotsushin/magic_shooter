export default class ButtonStop extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.key
    );

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.setScrollFactor(0);

    this.setInteractive();

    let _scene = config.scene;

    this.depth = 101;

    this.on('pointerdown', () => {
      this.sceneStop();
    },this);
  }
  sceneStop(){
    if(this.scene.physics.world.isPaused){
      this.scene.anims.resumeAll();
      this.scene.physics.world.resume();
      this.scene.menu.close();
      this.scene.keypad.reset();
    }else{
      this.scene.anims.pauseAll();
      this.scene.physics.world.pause();
      this.scene.menu.open();

    }    
  }
}
