// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbTime: cc.Label,
        lbInfo: cc.Label,
        Intervall: null,
        timer: null,
    },
    // 1 start time , 2 Bet time , 3 Change Time 
    setInfo(time, type) {
        if (type === 1) {
            this.lbInfo.string = require('GameManager').getInstance().getTextConfig('shan2_starttime');
        } else if (type === 2) {
            this.lbInfo.string = require('GameManager').getInstance().getTextConfig('shan2_bettime');
        } else {
            this.lbInfo.string = 'Change Time';
        }
        if(time > -1) this.lbTime.string = time;
        var timeVal = setInterval(() => {
            if (this.node == null || typeof this.node == 'undefined') {
                clearInterval(timeVal);
                return;
            }
            time -= require('GameManager').getInstance().time_out_game;
            time--;
            require('GameManager').getInstance().time_out_game = 0;
            if (time < 0 ) {
                this.node.stopAllActions();
                this.node.destroy();
                return;
            }
            if (require("GameManager").getInstance().curGameId === GAME_ID.BACCARAT && time < 1) {
                this.node.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(0, 1000)).easing(cc.easeBackIn()),
                    cc.callFunc(() => { this.node.destroy(); })));
            } 
            if(time > -1) this.lbTime.string = time;
        }, 1000)
    }
});