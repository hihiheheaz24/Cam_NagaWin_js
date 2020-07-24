
var EffectIcon = cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.oriPos = this.node.position;
    },
    moveInScreen(posTo,timedel=0.1) {
        this.node.runAction(cc.sequence(cc.delayTime(timedel), cc.moveTo(0.4, posTo).easing(cc.easeBackOut(1))));
    },
    moveOutOfScreen(time=0.3,pos=this.oriPos) {
        this.node.runAction(cc.moveTo(time, pos));
    }
    // update (dt) {},
});
module.export = EffectIcon
