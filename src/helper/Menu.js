// import Star from '../sprites/item/Star';
// import Portion from '../sprites/item/Portion';
export default class Menu extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config.scene);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    let _this = this;

    /*==============================
    コンテナー
    ==============================*/    
    this.container = this.scene.add.container(0, 0);
    this.container.setVisible(false);
    this.container.setScrollFactor(0);
    this.container.depth = 100;
    
    /*==============================
    コンテナーアイテム用
    ==============================*/    
    this.containerItem = this.scene.add.container(0, 0);
    this.containerItem.setScrollFactor(0);

    /*==============================
    背景の表示
    ==============================*/    
    this.overlapArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );
    this.rect = new Phaser.Geom.Rectangle(0, 0, config.scene.game.config.width, config.scene.game.config.height);
    this.overlapArea.fillRectShape(this.rect);
    this.overlapArea.alpha = 0.75;
    this.overlapArea.setScrollFactor(0);




    /*==============================
    プレイヤー
    ==============================*/    
    this.player = config.scene.add.sprite(
      config.scene.game.config.width/2,
      50,
      'player'
    );
    this.player.setScrollFactor(0);
    this.player.scaleX = 2;
    this.player.scaleY = 2;

    /*==============================
    ステータス
    ==============================*/    
    this.statusText = this.scene.add.bitmapText(
      config.scene.game.config.width/2,
      110,
      'bitmapFont',
      '',
      24
    );

    this.statusText.setOrigin(0.5,0.5);

    /*==============================
    ステータスの更新
    ==============================*/       
    this.refreshMenu();

    /*==============================
    カーソル
    ==============================*/       
    this.cursor = this.scene.add.sprite(10, 170, 'cursor');
    this.cursor.visible = false;
    this.cursor.setScrollFactor(0);

    /*==============================
    決定ボタン
    ==============================*/   
    this.buttonOK = config.scene.add.sprite(
      config.scene.game.config.width/2,
      210,
      'button_ok'
    );    
    this.buttonOK.setScrollFactor(0);
    this.buttonOK.visible = false;
    this.buttonOK.setInteractive();
    this.buttonOK.setOrigin(0.5,0.5);
    
    this.selectItem;
    this.selectItemIndex;

    this.buttonOK.on('pointerdown', () => {
      let selectedItem = this.selectItem.item[0];
      let selectedItemIndex = this.selectItemIndex;
      this.containerItem.removeAll();
      let item_key = this.selectItem.item[1];
      let item = new selectedItem({
        scene: config.scene,
        key: item_key
      }); 
      config.scene.itemGroup.add(item);

      this.scene.hasItemList.splice(selectedItemIndex, 1 );
      this.displayItemList();
      this.cursor.visible = false;  
      this.buttonOK.visible = false;

      this.scene.buttonStop.sceneStop();

    },this);

    this.container.add([
      this.overlapArea,
      this.player,
      this.statusText,
      this.cursor,
      this.buttonOK,
      this.containerItem
    ]);
    this.displayItemList();

  }
  displayItemList(){

    for(var i = 0; i < this.scene.hasItemList.length; i++){
      let item = this.scene.hasItemList[i];
      let item_obj = item[0];
      let item_key = item[1];
      let sprite = this.scene.add.sprite(30*(i+1), 170, item_key);
      sprite.setInteractive();
      sprite.setScrollFactor(0);
      this.containerItem.add(sprite);
      sprite.index = i;
      sprite.item = item;
      sprite.on('pointerdown', () => {
        this.cursor.visible = true;
        this.cursor.x = sprite.x;
        this.cursor.y = sprite.y;
        this.selectItem = sprite;
        this.selectItemIndex = sprite.index;
        this.buttonOK.visible = true;
      },this);
    }    
  }
  open(){
    this.container.setVisible(true);
    this.refreshMenu();
  }
  close(){
    this.container.setVisible(false);
  }
  refreshMenu(){
    this.statusText.setText(
      [
        'LEVEL   :'+this.scene.player.status.level,
        'HP      :'+this.scene.player.status.hp,
        'POWER   :'+this.scene.player.status.power,
        'DEFENCE :'+this.scene.player.status.defense,
        // 'experience   :'+this.scene.registry.list.experience,
        '..............',
        ' ',
        ' ',
        'ITEM          '
      ],
    );
  }
}
  