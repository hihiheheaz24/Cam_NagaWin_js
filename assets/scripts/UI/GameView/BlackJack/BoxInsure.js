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
        lbString:cc.Label,
        chipIcon:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setInfo(money){
        this.lbString.node.opacity = 0;
        this.chipIcon.node.opacity = 0;
        this.chipIcon.node.setScale(2);
        this.chipIcon.node.runAction(
            cc.spawn(
                cc.fadeIn(0.6).easing(cc.easeCubicActionOut()),
                cc.scaleTo(0.5,1).easing(cc.easeCubicActionIn()),
            )
        )
        this.lbString.node.runAction(cc.fadeIn(0.4).easing(cc.easeCubicActionOut()));
        this.lbString.string = require('GameManager').getInstance().formatMoney(money);
    },

    // update (dt) {},
});
