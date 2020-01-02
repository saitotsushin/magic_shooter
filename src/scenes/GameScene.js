import Keypad from '../helper/Keypad';
import CollisionCheck from '../helper/CollisionCheck';
import ParseObjectLayers from '../helper/ParseObjectLayers';
import CreateBoss from '../helper/CreateBoss';
import ComboCount from '../helper/ComboCount';
import ClearStage from '../helper/ClearStage';
import ClearGame from '../helper/ClearGame';
import DisplayStageNumber from '../helper/DisplayStageNumber';
import GameOver from '../helper/GameOver';
import ButtonStop from '../helper/ButtonStop';
import Animations from '../helper/Animations';
import PowerUpList from '../helper/PowerUpList';
import Menu from '../helper/Menu';
import Portion from '../sprites/item/Portion';
import Star from '../sprites/item/Star';
import Fire from '../sprites/item/Fire';
import Player from '../sprites/character/Player';
import Bullet from '../sprites/weapon/Bullet';

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });
  }
  create(){

    /*==============================
    ステージの表示
    ==============================*/

    this.stageNumber = this.registry.list.stage;
    // this.stageNumber = 5;
    this.map = this.make.tilemap({ key: 'map'+this.stageNumber,tileWidth: 16, tileHeight: 16});
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.groundLayer = this.map.createDynamicLayer('ground', this.tileset, 0, 0);

    this.groundLayer.setCollisionBetween(0, 1000);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.objectLayer = this.map.createDynamicLayer('object', this.tileset, 0, 0);
    this.objectLayer.setCollisionBetween(0, 1000);
    this.objectLayer.setCollisionByProperty({ collides: true });


    this.hasItemList = [
      // [Star,   "star",   "item"],//デバッグ用
      // [Portion,"portion","item"],//デバッグ用
      // [Fire,   "fire",   "item"]//デバッグ用
    ];
    if(this.registry.list.hasItemList){
      this.hasItemList = this.registry.list.hasItemList;
    }

    this.player = new Player({
      scene: this,
      x: this.scene.systems.game.config.width/2,
      // y: this.scene.systems.game.config.height*1.1,
      y: 1080,
      key: 'player'
    });

    /*ラスボス*/
    this.shadow;

    /*==============================
    ボスの生成
    ==============================*/
    this.createBoss = new CreateBoss({
      scene: this
    });

    /*==============================
    アニメーションの読み込み
    ==============================*/
    this.animations;
    if(!this.animations){
      this.animations = new Animations({
        scene: this
      });
  
    }

    /*==============================
    キー入力
    ==============================*/
      this.keypad = new Keypad({
        scene: this,
        key: 'keypad',
        input: this.input
      });            
    this.keypad.keys.isRELEASE = false;


    /*==============================
    UI | ステージ数の表示
    ==============================*/
    this.displayStageNumber = new DisplayStageNumber({
      scene: this
    });
    this.stageActive = false;


    /*==============================
    UI | POWER UP LIST
    ==============================*/
    this.powerUpList = new PowerUpList({
      scene: this
    });

    /*==============================
    UI | STOP BOTTON
    ==============================*/
    this.buttonStop = new ButtonStop({
      scene: this,
      x: 20,
      y: 20,
      key: 'button_stop'
    });

    /*==============================
    UI | メニュー
    ==============================*/
    this.menu = new Menu({
      scene: this
    });

    
    /*==============================
    UI | コンボカウンター
    ==============================*/
    this.combo = new ComboCount({
      scene: this,
      key: 'combo'
    });

    /*==============================
    UI | ステージクリア
    ==============================*/
    this.clearStageObj = new ClearStage({
      scene: this
    });

    /*==============================
    UI | ゲームクリア
    ==============================*/
    this.clearGameObj = new ClearGame({
      scene: this
    });    
    /*==============================
    UI | ゲームオーバー
    ==============================*/
    this.gameOverObj = new GameOver({
      scene: this
    });

    /*==============================
    GROUP管理
    ==============================*/
    this.playerWeaponGroup = this.add.group({ classType: Bullet, maxSize: 50, runChildUpdate: true });
    this.enemyWeaponGroup = this.add.group();
    this.enemyGroup = this.add.group();
    this.itemGroup = this.add.group();
    this.spellGroup = this.add.group();
    this.checkZoneGroup = this.add.group();

    this.objectLayers = new ParseObjectLayers({
      scene: this
    });
    this.objectLayers.addObject();
    this.objectLayers.addCheck();

    /*==============================
    衝突判定
    ==============================*/
    this.CollisionCheck = new CollisionCheck({
      scene: this
    });

    this.cameras.main.setBounds(
      0,
      this.scene.systems.game.config.height*-1,
      this.scene.systems.game.config.width,
      this.scene.systems.game.config.height*6
    );
    this.cameras.main.setScroll(this.player.x);
    this.cameras.main.setSize(this.scene.systems.game.config.width,this.scene.systems.game.config.height);
    this.cameras.main.startFollow(this.player,100,100,100,0,-20);
    /*==============================
    デバッグ
    ==============================*/
    // this.debugText = this.add.text(20, 20, '', { font: '8px Courier', fill: '#ff0000' });
    // this.debugText.depth = 100;
    // this.debugText.setScrollFactor(0,0);
  }
  update(time, delta) {


    if (this.physics.world.isPaused) {      
      return;
    }
    this.keypad.update(this.input);
    
    this.combo.update(time, delta);

    this.player.update(this.keypad.keys, time, delta);

    if(!this.stageActive){
      return;
    }

    this.playerWeaponGroup.children.entries.forEach(
      (sprite) => {
        sprite.update(time, delta);
      }
    );
    this.enemyWeaponGroup.children.entries.forEach(
      (sprite) => {
        sprite.update(time, delta);
      }
    ); 

    this.enemyGroup.children.entries.forEach(
      (sprite) => {
        sprite.update(time, delta);
      }
    );

    this.itemGroup.children.entries.forEach(
      (sprite) => {
        sprite.update(this.keypad.keys, time, delta);
      }
    );

  }
  titleGame(){
    this.scene.start('TitleScene');
  }
  refleshGame(){
    this.scene.start('GameScene');
  }
}

export default GameScene;