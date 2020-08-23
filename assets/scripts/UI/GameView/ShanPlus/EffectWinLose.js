var EffectWinLose = cc.Class({
    extends: cc.Component,

    properties: {
        fontPlus: {
            default: null,
            type: cc.Font
        },

        fontSubtract: {
            default: null,
            type: cc.Font
        },
        labelMoney:cc.Label,
        aniWinText: {
            default: null,
            type: sp.Skeleton
        },

        aniDrawText: {
            default: null,
            type: sp.Skeleton
        },

        lose:cc.Node,
        labelPositionX : 0,
        labelPositionY: 0,
    },
    effectWinLose: function(money) {                      //Show animation win or lose
        this.labelMoney.string = "";
        if (money > 0) {
            this.aniWinText.node.active = true;
            this.aniWinText.setAnimation(0, "animation", false);
            this.labelMoney.font = this.fontPlus;
            this.labelMoney.string = "+" + require('GameManager').getInstance().formatMoney(money);
        } else if (money < 0) {
            this.labelMoney.font  = this.fontSubtract;
            this.lose.active = true;
            this.labelMoney.string = require('GameManager').getInstance().formatMoney(money);
        }
        else {
            this.aniDrawText.node.active = true;
            this.aniDrawText.setAnimation(0, "eng", true);
        }
    },
    textFly(isAction){
        if(this.labelPositionX == 0 && this.labelPositionY == 0){
            this.labelPositionX = this.labelMoney.node.x;
            this.labelPositionY = this.labelMoney.node.y;
        }
        this.labelMoney.node.active = true;
        if(isAction){
            this.labelMoney.node.runAction(cc.moveBy(1,cc.v2(0,15)));
        }
        this.scheduleOnce(()=>{
            this.labelMoney.node.active = false;
        }, 3)
        this.resetLabelPosition();
    },
    resetLabelPosition(){
        this.labelMoney.node.setPosition(this.labelPositionX,this.labelPositionY);
    },
    unuse(){
        this.aniWinText.node.active = false;
        this.lose.active = false;
        this.aniDrawText.node.active = false;
        this.labelMoney.node.active = false;
        this.labelMoney.node.opacity = 255;
        this.labelMoney.node.position = cc.v2(30,100);
    }
});
module.exports = EffectWinLose;