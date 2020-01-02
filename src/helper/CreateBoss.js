import Stone from '../sprites/character/boss/Stone';
import Robot from '../sprites/character/boss/Robot';
import Sun from '../sprites/character/boss/Sun';
import Smoke from '../sprites/character/boss/Smoke';
import Dragon from '../sprites/character/boss/Dragon';
import Shadow from '../sprites/character/boss/Shadow';

export default class CreateBoss  extends Phaser.Time.TimerEvent{
  constructor(config) {

    super(
      config.scene,
    );

    this._scene = config.scene;

    this.stageNumber = config.scene.stageNumber;

    this.stageList = [
      {
        stage: 5,
        boss: {
          object: Dragon,
          x: config.scene.game.config.width/2,
          y: config.scene.game.config.height*0.8,
          key: 'dragon'
        }
      },
      {
        stage: 6,
        boss: {
          object: Shadow,
          x: config.scene.game.config.width/2,
          y: config.scene.game.config.height*0.8,
          key: 'shadow'
        }
      },
      {
        stage: 1,
        boss: {
          object: Stone,
          x: config.scene.game.config.width/2,
          y: config.scene.game.config.height*0.7,
          key: 'stone'
        }
      },
      {
        stage: 2,
        boss: {
          object: Sun,
          x: config.scene.game.config.width/2,
          y: config.scene.game.config.height*0.7,
          key: 'sun'
        }
      },
      {
        stage: 3,
        boss: {
          object: Smoke,
          x: config.scene.game.config.width/2,
          y: config.scene.game.config.height*0.7,
          key: 'smoke'
        }
      },
      {
        stage: 4,
        boss: {
          object: Robot,
          x: config.scene.game.config.width/2,
          y: config.scene.game.config.height*0.7,
          key: 'robot_base'
        }
      }
    ];

    this.active = false;
  }


  createBoss(){
    this.active = true;
    let _stageNumber = this.stageNumber;
    let bossObj = this.stageList.filter(function(item, index){
      if (item.stage == _stageNumber){
        return true;
      }
    });

    let _x = bossObj[0].boss.x;
    let _y = bossObj[0].boss.y;

    let boss = new bossObj[0].boss.object({
      scene: this._scene,
      x: _x,
      y: _y,
      key: bossObj[0].boss.key
    });

    this._scene.enemyGroup.add(boss);
  }
  clearStageDisplay(){
    this.clearStageObj.container.visible = true;
  }


}
