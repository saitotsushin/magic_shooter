
import Fire from '../sprites/item/Fire';
import Star from '../sprites/item/Star';
import Portion from '../sprites/item/Portion';

export default class ClearStage extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {

    super(config.scene);

    this.cursor = this.scene.add.sprite(10, 170, 'cursor');
    this.cursor.setScrollFactor(0);
    this.cursor.visible = false;
    this.cursor.depth = 110;
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
    this.overlapArea.alpha = 0.75;
    this.overlapArea.setScrollFactor(0);


    this.stageClearTxt = this.scene.add.bitmapText(
      config.scene.game.config.width/2,
      70,
      'bitmapFontYellow',
      'STAGE CLEAR',
      30
    );
    this.stageClearTxt.setOrigin(0.5,0.5);
    config.scene.physics.world.enable(this.stageClearTxt);
    config.scene.add.existing(this.stageClearTxt);
    this.stageClearTxt.setScrollFactor(0);

    this.getItemText = this.scene.add.bitmapText(
      config.scene.game.config.width/2,
      100,
      'bitmapFont',
      'GET ITEM',
      24
    );
    this.getItemText.setOrigin(0.5,0.5);
    config.scene.physics.world.enable(this.getItemText);
    config.scene.add.existing(this.getItemText);
    this.getItemText.setScrollFactor(0);


    this.buttonNext = config.scene.add.sprite(
      config.scene.game.config.width/2,
      200,
      'button_next'
    );
    this.buttonNext.setScrollFactor(0);
    this.buttonNext.setOrigin(0.5,0.5);
    this.buttonNext.setInteractive();
    config.scene.physics.world.enable(this.buttonNext);
    config.scene.add.existing(this.buttonNext);

    this.dropItemList = [
      [Fire, "fire","item"],
      [Portion, "portion","item"],
      [Star, "star","item"]
    ];

    this.container.add([
      this.overlapArea,
      this.stageClearTxt,
      this.getItemText,
      this.buttonNext
    ]);
    
    this.container.visible = false;

    this.getItem;

    this.dropItem();

  }
  getRandomObjName(arr){
    let random = Math.floor(Math.random() * arr.length);
    let randomName = arr[random];
    this.dropItemList.splice(random, 1);
    return randomName;
  }
  dropItem(){
    for(var i = 0; i < 3;i++){
      let dropItemName = this.getRandomObjName(this.dropItemList);
      let type = dropItemName[2];
      let sprite = this.scene.add.sprite(30*(i+1)+40, 140, dropItemName[1]);
      sprite.setScrollFactor(0);
      sprite.depth = 10;
      sprite.setInteractive();
      this.container.add(sprite);
      sprite.itemList = dropItemName;
      sprite.on('pointerdown', () => {
        this.cursor.visible = true;
        this.cursor.x = sprite.x;
        this.cursor.y = sprite.y;
        this.getItem = sprite.itemList;

      },this);
    }

    this.buttonNext.on('pointerdown', () => {
      this.scene.registry.list.stage++;
      this.scene.registry.set('stage', this.scene.registry.list.stage);
      this.scene.registry.set('coin', this.scene.coin_count);
      if(this.getItem){
        if(this.getItem[2] == "weapon"){
          this.scene.registry.set('weapon', this.getItem[1]);
        }else{
          this.scene.hasItemList.push(this.getItem)
        }
  
      }
      this.scene.registry.set('hasItemList', this.scene.hasItemList);
      this.scene.refleshGame();
    });


  } 
  clearStageDisplay(){
    this.container.visible = true;
  }
}
