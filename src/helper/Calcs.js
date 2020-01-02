export default class Calcs {
  constructor(config) {

  }
  returnMax1(_x,_y,_max){

    _max = _max ? _max : 1;//初期値の設定

    let arr = {
      x: _x,
      y: _y
    }

    let per = 0;
    let x = arr.x;
    let y = arr.y;
    let x_abs = Math.abs(arr.x);
    let y_abs = Math.abs(arr.y);

    if(x_abs >= y_abs){
      per = y_abs / x_abs;
      x = x >= 0 ? 1 : -1;
      y = y >= 0 ? 1 : -1;
      y = y*per;
    }else{
      per = x_abs / y_abs;
      x = x >= 0 ? 1 : -1;
      y = y >= 0 ? 1 : -1;
      x = x*per;
    }

    arr.x = x * _max;
    arr.y = y * _max;

    return arr;
  }
  createRandomPosition(min_x,max_x,min_y,max_y){
    var randNumX = Math.floor(Math.random()*(max_x-min_x)+min_x);
    var randNumY = Math.floor(Math.random()*(max_y-min_y)+min_y);
    var randPos = {
      x:randNumX,
      y:randNumY
    };
    return randPos;  
  }
  getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
  }
  getRandom(min, max) {
    if(min === -1 && max === 1){
      if(Math.random() < 0.6){
        return Math.random() * -1;

      }else{
        return Math.random();
      }
    }
    return Math.random() * (max - min + 1) + min;
  }
}
