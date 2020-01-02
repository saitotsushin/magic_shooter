export default class Keypad_PC extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {

    super(config.scene,config.key,config.input);

    this.range = 2;
    this.power = 2;
    this.rangeRadius = 16;
    this.rangeRadiusMin =  10;
    this.input = config.input;
    // this.input.addPointer(3);
    this.keys = {
      TOUCH_START:{
        x: 0,
        y: 0
      },
      TOUCH_MOVE:{
        x: 0,
        y: 0
      },
      DIRECTION:{
        x: 0,
        y: 0
      },
      POINTER:{
        x: 0,
        y: 0
      },
      VECTOR:{
        x: 0,
        y: 0
      },
      isTOUCH: false,
      isRELEASE: false,
      RADIAN: 0,
    };

    this.active = false;

    /*==============================
    コントローラー
    ==============================*/
    this.circle = new Phaser.Geom.Circle(0, 0, 10);//x,y.size
    this.pointer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
    this.pointer.fillCircleShape(this.circle);
    this.pointer.setVisible(false);
    this.pointer.setScrollFactor(0,0);

    this.circleCenter = new Phaser.Geom.Circle(0, 0, 16);//x,y.size
    this.pointerCenter = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
    this.pointerCenter.fillCircleShape(this.circleCenter);
    this.pointerCenter.setVisible(false);
    this.pointerCenter.alpha = .5;
    this.pointerCenter.setScrollFactor(0,0);

    config.input.on('pointerdown', function (pointer) {
      this.active = true;
      this.keys.isTOUCH = true;
      this.keys.isRELEASE = false;
      this.keys.TOUCH_START.x = pointer.x;
      this.keys.TOUCH_START.y = pointer.y;
      this.keys.POINTER.x = pointer.x;
      this.keys.POINTER.y = pointer.y;
    }, this);

    config.input.on('pointerup', function (pointer) {
      if(this.keys.isTOUCH){/*タッチ後に判定する */
        this.keys.isRELEASE = true;
      }
      this.keys.isTOUCH = false;
      
      this.keys.TOUCH_START.x = 0;
      this.keys.TOUCH_START.y = 0;
      this.keys.DIRECTION.x = 0;
      this.keys.DIRECTION.y = 0;
    }, this);


    config.input.on('pointermove', function (pointer) {

      this.keys.POINTER.x = pointer.x;
      this.keys.POINTER.y = pointer.y;

      this.keys.TOUCH_MOVE.x = pointer.x - this.keys.TOUCH_START.x;
      this.keys.TOUCH_MOVE.y = pointer.y - this.keys.TOUCH_START.y;

      let r = this.rangeRadius;
      let r_min = this.rangeRadiusMin;
      let x = this.keys.TOUCH_MOVE.x;
      let y = this.keys.TOUCH_MOVE.y;

      if((r * r) <= (x * x) + (y * y)){

        this.keys.RADIAN = Math.atan2(x, y);

        this.keys.VECTOR.x    = this.rangeRadius * Math.sin(this.keys.RADIAN);
        this.keys.VECTOR.y    = this.rangeRadius * Math.cos(this.keys.RADIAN);
  
        this.keys.DIRECTION.x = this.rangeRadius * Math.sin(this.keys.RADIAN);
        this.keys.DIRECTION.y = this.rangeRadius * Math.cos(this.keys.RADIAN);

        this.keys.POINTER.x   = this.keys.TOUCH_START.x + this.rangeRadius * Math.sin(this.keys.RADIAN);
        this.keys.POINTER.y   = this.keys.TOUCH_START.y + this.rangeRadius * Math.cos(this.keys.RADIAN);

      }else{

        if( (r_min * r_min) <= (x * x) + (y * y) ){

          this.keys.VECTOR.x    = this.keys.TOUCH_MOVE.x;
          this.keys.VECTOR.y    = this.keys.TOUCH_MOVE.y;
  
          this.keys.DIRECTION.x = this.keys.TOUCH_MOVE.x;
          this.keys.DIRECTION.y = this.keys.TOUCH_MOVE.y;

        }else{

          this.keys.DIRECTION.x = 0;
          this.keys.DIRECTION.y = 0;

        }
      }

    }, this);
    /*==============================
    デバッグ
    ==============================*/
    // this.text = this.scene.add.text(10, 10, 'Use up to 4 fingers at once', { fontSize: '8px', fill: '#FFF' });
    // this.text.setScrollFactor(0,0);
    // this.text.setStroke('#000', 4);

  }
  update(){

    /*==============================
    デバッグ
    ==============================*/
    // this.text.setText([
    //   'this.keys.isRELEASE:  ' + this.keys.isRELEASE,
    //   'this.keys.TOUCH_START:' + this.keys.TOUCH_START.x + "/" + this.keys.TOUCH_START.y,
    //   'this.keys.TOUCH_MOVE: ' + this.keys.TOUCH_MOVE.x  + "/" + this.keys.TOUCH_MOVE.y,
    //   'this.keys.DIRECTION:  ' + this.keys.DIRECTION.x  + "/" + this.keys.DIRECTION.y,
    //   'this.keys.POINTER:    ' + this.keys.POINTER.x  + "/" + this.keys.POINTER.y,
    //   'this.keys.VECTOR:     ' + this.keys.VECTOR.x  + "/" + this.keys.VECTOR.y,
    // ]);  

    if(this.keys.isTOUCH === true){

      this.pointer.setVisible(true);
      this.pointerCenter.setVisible(true);

      this.pointer.x = this.keys.POINTER.x;
      this.pointer.y = this.keys.POINTER.y;

      this.pointerCenter.x = this.keys.TOUCH_START.x;
      this.pointerCenter.y = this.keys.TOUCH_START.y;

    }else{
      this.pointer.setVisible(false);
      this.pointerCenter.setVisible(false);
      this.keys.DIRECTION.x = 0;
      this.keys.DIRECTION.y = 0;
    }    
  }
  reset(){
    this.keys.isTOUCH = false;
    this.keys.isRELEASE = false;
  }
  
}