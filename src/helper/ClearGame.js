

export default class ClearGame extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {

    super(config.scene);

    this.visible = false;

    this.container = this.scene.add.container(0, 0);
    this.container.depth = 100;
    this.container.setScrollFactor(0);

    this.overlapArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );    
    this.rect = new Phaser.Geom.Rectangle(0, 0, config.scene.game.config.width, config.scene.game.config.height);
    this.overlapArea.fillRectShape(this.rect);
    this.overlapArea.alpha = 0.15;
    this.overlapArea.setScrollFactor(0);


    this.gameClearTxt = this.scene.add.bitmapText(
      config.scene.game.config.width/2,
      70,
      'bitmapFontYellow',
      'GAME CLEAR',
      30
    );
    this.gameClearTxt.setOrigin(0.5,0.5);
    this.gameClearTxt.setScrollFactor(0);

    this.scoreTxt = this.scene.add.bitmapText(
      config.scene.game.config.width/2,
      120,
      'bitmapFont',
      'SCORE : '+this.scene.registry.list.experience,
      30
    );
    this.scoreTxt.setOrigin(0.5,0.5);
    this.scoreTxt.setScrollFactor(0);

    this.buttonTitle = config.scene.add.sprite(
      config.scene.game.config.width/2,
      200,
      'button_title'
    );
    this.buttonTitle.setScrollFactor(0);
    this.buttonTitle.setOrigin(0.5,0.5);
    this.buttonTitle.setInteractive();
    config.scene.physics.world.enable(this.buttonTitle);
    config.scene.add.existing(this.buttonTitle);    

    this.container.add([
      this.overlapArea,
      this.gameClearTxt,
      this.scoreTxt,
      this.buttonTitle
    ]);
    
    this.container.visible = false;

    this.buttonTitle.on('pointerdown', () => {
      this.scene.titleGame();
    });    


  }
  open(){
    this.container.visible = true;
    this.scoreTxt.setText(
      [
        'SCORE   :'+this.scene.registry.list.experience
      ]
    );
  }
}
