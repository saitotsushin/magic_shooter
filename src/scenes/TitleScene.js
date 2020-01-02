class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({
        key: 'TitleScene'
    });
    
  }
  create() {

    let config = {
      key: 'title',
      frames: [{
          frame: 'title',
      }]
    };

    this.title = this.add.sprite(
      this.scene.systems.game.config.width/2,
      60,
      'title'
    );
    this.title.setOrigin(0.5,0.5);
    this.title.setInteractive();

    this.buttonStart = this.add.sprite(
      this.scene.systems.game.config.width/2,
      140,
      'button_start'
    );
    this.buttonStart.setOrigin(0.5,0.5);
    this.buttonStart.setInteractive();

    this.buttonStart.on('pointerdown', () => {
      this.startGame();
    });  
    this.copyright = this.add.bitmapText(
      this.game.config.width/2,
      this.game.config.height - 20,
      'bitmapFont',
      '(C)SAITO TSUSHIN',
      20
    );
    this.copyright.setOrigin(0.5,0.5);

    this.registry.set('stage', "1");
    this.registry.set('experience', 0);

  }
  startGame() {
    this.scene.start('GameScene');
  }
}

export default TitleScene;
