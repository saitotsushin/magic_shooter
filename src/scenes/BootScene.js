class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    });
  }
  preload() {
    this.make.text({
      x: this.sys.game.config.width/2,
      y: 100,
      text: 'LOADING...',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
      }
    });
    let progressNumb = this.make.text({
      x: this.sys.game.config.width/2,
      y: 120,
      text: '',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
      }
    });
    this.progress = this.add.graphics();

    this.load.on('progress', (value) => {
      this.progress.clear();
      this.progress.fillStyle(0xffffff, 1);
      progressNumb.text = Math.round(value*100) + "%";
    });

    this.load.on('complete', () => {
      this.progress.destroy();
      this.scene.start('TitleScene');
    });
    /*bitmap
    midori_box
    https://www.pixiv.net/artworks/56487227
     */

    this.load.image('tiles', 'assets/tilemaps/tile.png');
    this.load.tilemapTiledJSON('map1', 'assets/tilemaps/tilemap.json');
    this.load.tilemapTiledJSON('map2', 'assets/tilemaps/tilemap2.json');
    this.load.tilemapTiledJSON('map3', 'assets/tilemaps/tilemap3.json');
    this.load.tilemapTiledJSON('map4', 'assets/tilemaps/tilemap4.json');
    this.load.tilemapTiledJSON('map5', 'assets/tilemaps/tilemap5.json');
    this.load.tilemapTiledJSON('map6', 'assets/tilemaps/tilemap6.json');
    
    this.load.spritesheet('player', 'assets/images/player.png', { frameWidth: 16, frameHeight: 16 });    
    this.load.spritesheet('enemy', 'assets/images/enemy.png', { frameWidth: 16, frameHeight: 16 });    
    this.load.spritesheet('bad', 'assets/images/bad.png', { frameWidth: 10, frameHeight: 10 });    
    this.load.image('brain', 'assets/images/brain.png');
    this.load.image('wizerd', 'assets/images/wizerd.png');
    this.load.image('wizerd2', 'assets/images/wizerd2.png');
    this.load.image('wizerd3', 'assets/images/wizerd3.png');
    this.load.image('stone', 'assets/images/stone.png');
    this.load.image('robot_base', 'assets/images/robot_base.png');
    this.load.image('robot_arm_l', 'assets/images/robot_arm_l.png');
    this.load.image('robot_arm_r', 'assets/images/robot_arm_r.png');
    this.load.image('smoke', 'assets/images/smoke.png');
    this.load.image('smoke_s', 'assets/images/smoke_s.png');
    this.load.image('sun', 'assets/images/sun.png');
    this.load.image('shadow', 'assets/images/shadow.png');
    this.load.image('shadow_shot', 'assets/images/shadow_shot.png');
    this.load.image('dragon', 'assets/images/dragon.png');

    this.load.spritesheet(
      'bullet_player',
      'assets/images/bullet_player.png',
      {
        frameWidth: 16,
        frameHeight: 16
      }
    );
    
    this.load.image('circle_mask_30x30', 'assets/images/circle_mask_30x30.png');

    /*UI*/
    this.load.image('title', 'assets/images/ui/title.png');
    this.load.image('title_start', 'assets/images/ui/title_start.png');

    this.load.image('hp_bar', 'assets/images/ui/hp_bar.png');
    this.load.image('hp_bar_bg', 'assets/images/ui/hp_bar_bg.png');
    this.load.image('hp_bar_s', 'assets/images/ui/hp_bar_s.png');
    this.load.image('active_bar', 'assets/images/ui/active_bar.png');
    this.load.image('ui_coin_icon', 'assets/images/ui/coin.png');
    this.load.image('ui_level_icon', 'assets/images/ui/level.png');
    this.load.image('cursor', 'assets/images/ui/cursor.png');
    this.load.image('button_stop', 'assets/images/ui/button_stop.png');
    this.load.image('button_next', 'assets/images/ui/button_next.png');
    this.load.image('button_continue', 'assets/images/ui/button_continue.png');
    this.load.image('button_start', 'assets/images/ui/button_start.png');
    this.load.image('button_ok', 'assets/images/ui/button_ok.png');
    this.load.image('button_title', 'assets/images/ui/button_title.png');
    this.load.image('powerUpList_1', 'assets/images/ui/powerUpList_1.png');
    this.load.image('powerUpList_2', 'assets/images/ui/powerUpList_2.png');
    this.load.image('powerUpList_3', 'assets/images/ui/powerUpList_3.png');
    this.load.image('powerUpList_4', 'assets/images/ui/powerUpList_4.png');
    this.load.image('powerUpList_5', 'assets/images/ui/powerUpList_5.png');

    this.load.image('bullet', 'assets/images/bullet.png');
    this.load.image('sword', 'assets/images/sword.png');
    this.load.image('lazer_long', 'assets/images/lazer_long.png');
    this.load.image('lazer_base', 'assets/images/lazer_base.png');


    this.load.bitmapFont('bitmapFont', 'assets/font/font.png', 'assets/font/font.xml');
    this.load.bitmapFont('bitmapFontYellow', 'assets/font/font_yellow.png', 'assets/font/font.xml');

    /*item*/
    this.load.image('heart', 'assets/images/items/heart.png');
    this.load.image('coin', 'assets/images/items/coin.png');
    this.load.image('fire', 'assets/images/items/fire.png');
    this.load.image('star', 'assets/images/items/star.png');
    this.load.image('portion', 'assets/images/items/portion.png');
    this.load.image('powerUp', 'assets/images/items/power_up.png');
    this.load.image('timer', 'assets/images/items/timer.png');

    this.load.image('fire_area', 'assets/images/items/fire_area.png');

    //spritesheetは画像のサイズを合わせないとframe errorになる...
    this.load.spritesheet('explosion_m', 'assets/images/explosion_m.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('explosion_s', 'assets/images/explosion_s.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('sword_anime', 'assets/images/sword_anime.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('sword_anime_l', 'assets/images/sword_anime_l.png', { frameWidth: 80, frameHeight: 80 });

  }

}

export default BootScene;
