// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var BallController =  cc.Class({
    extends: cc.Component,
    properties: {
        _timeCounter:0,
        _speedBall:5,
        _distance:285,
        patherBall:cc.Node,
        _isPatherBallRotate:false,
        _isStopBall:false,
        _isSlowBall:false,
        _isChildBall:false,
        _deltaTime:0,
        _target:null,
    },

    // LIFE-CYCLE CALLBACKS:

   

    setInfo(target){
        this._target = target;
    },
    resetBall(){
        this._speedBall = 5;
        this._timeCounter = 0;
        this._distance = 285;
        this._deltaTime = 0;
        this._isPatherBallRotate = false;
        this._isStopBall=false;
        this._isChildBall=false;
        this._isSlowBall = true;
    },  
     update (dt) {
            this._timeCounter+= dt * this._speedBall;
            this.node.position = cc.v2(Math.cos(this._timeCounter) * this._distance , Math.sin(this._timeCounter) * this._distance);
            if(this._isSlowBall){
                this._distance -= dt * 50;
                this._deltaTime+= (dt/90);
                this._speedBall -= (dt+ this._deltaTime);
                if(this._distance <= 147){
                    this._isSlowBall = false;
                    this._isStopBall = true;
                    
                    this._isPatherBallRotate = true;
                    this._isChildBall = true;
                    this.patherBall.runAction(cc.repeatForever(cc.rotateBy(10,780)));
                    this.node.parent = this.patherBall,
                    this._target.onShowResult();
                    this.enabled = false;
                }
            }
            
    
     },
     
});
module.exports = BallController;