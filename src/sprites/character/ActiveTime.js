export default class ActiveTime extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.frame,
      config.parent
    );


    this.pileUpSpeed = 0.5;
    this.flg_max = false;

    this.per = 0;
  }

  pileUp(){
    if(this.per < 1){
      this.per = this.per + this.pileUpSpeed;
      this.flg_max = false;
    }else{     
      this.per = 1;
      this.flg_max = true;
    }
  }
  pileReset(){
    this.per = 0;
    this.flg_max = false;
  }
}
