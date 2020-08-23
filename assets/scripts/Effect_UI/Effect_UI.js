// var EFFECT_TYPE = cc.Enum({
//     NONE: 0,
//     MOVE_LEFT: 1,
//     MOVE_RIGHT: 2,
//     MOVE_UP: 3,
//     MOVE_DOWN: 4,
//     SCALE: 5
// });

var Effect_UI = cc.Class({
    extends: cc.Component,

    properties: {
        startRun: {
            default: true,
        },

        effect_type: 0,

        delay: {
            default: 0,
            type: cc.Float
        },
        cascade: {
            default: false,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        this.actionIn = null;
        this.actionOut = null;
    },

    //*Action int
    start(func = null) {
        if (!this.startRun) return;
        if (this.actionIn == null) {
            this.actionIn = this.getStartEffect(func);
        }

        if (this.actionIn != null)
            this.node.runAction(this.actionIn);
    },

    getInDuration: function () {
        if (this.actionIn == null) {
            this.actionIn = this.getStartEffect();
        }

        if (this.actionIn != null) {
            return this.actionIn.getDuration();
        }
        return 0;
    },

    getStartEffect: function (func = null) {
        var siz = cc.view.getVisibleSize();
        var posCurrent = this.node.getPosition();
        var scaleCurrent = this.node.scale;

        // cc.NGWlog(posCurrent);
        let delay = cc.delayTime(this.delay);
        var move = cc.moveTo(.5, posCurrent).easing(cc.easeIn(.6));
        var scale = cc.scaleTo(.5, scaleCurrent).easing(cc.easeBackOut());
        var callFunc = cc.callFunc(() => {
            if (func !== null) func();
        });
        switch (this.effect_type) {
            case EFFECT_TYPE.MOVE_LEFT:
                this.node.x = -siz.width;
                return cc.sequence(delay, move, callFunc);
            case EFFECT_TYPE.MOVE_RIGHT:
                this.node.x = siz.width * 2.0;
                return cc.sequence(delay, move, callFunc);
            case EFFECT_TYPE.MOVE_UP:
                this.node.y = -siz.height;
                return cc.sequence(delay, move, callFunc);
            case EFFECT_TYPE.MOVE_DOWN:
                this.node.y = siz.height * 2.0;
                return cc.sequence(delay, move, callFunc);
            case EFFECT_TYPE.SCALE:
                this.node.setScale(0);
                return cc.sequence(delay, scale, callFunc);
            default:
                return null;
        }
    },

    //*Action out
    out: function (func = null) {
        if (this.actionOut == null) {
            this.actionOut = this.getOutEffect(func);
        }

        if (this.actionOut != null)
            this.node.runAction(this.actionOut);
    },

    getOutDuration: function () {
        if (this.actionOut == null) {
            this.actionOut = this.getOutEffect();
        }

        if (this.actionOut != null) {
            return this.actionOut.getDuration();
        }

        return 0;
    },

    getOutEffect: function (func = null) {
        var posCurrent = this.node.getPosition();

        var delay = cc.delayTime(this.delay);
        var callFunc = cc.callFunc(() => {
            if (func !== null) func();
        });
        switch (this.effect_type) {
            case EFFECT_TYPE.MOVE_LEFT:
                return cc.sequence(delay, cc.moveTo(.2, cc.v2(posCurrent.x + cc.WinSize.width, posCurrent.y)).easing(cc.easeIn(.6)), callFunc);
            case EFFECT_TYPE.MOVE_RIGHT:
                return cc.sequence(delay, cc.moveTo(.2, cc.v2(posCurrent.y - cc.WinSize.width, posCurrent.y)).easing(cc.easeIn(.6)), callFunc);
            case EFFECT_TYPE.MOVE_UP:
                return cc.sequence(delay, cc.moveTo(.2, cc.v2(posCurrent.y, posCurrent.y + cc.WinSize.height)).easing(cc.easeIn(.6)), callFunc);
            case EFFECT_TYPE.MOVE_DOWN:
                return cc.sequence(delay, cc.moveTo(.2, cc.v2(posCurrent.y, posCurrent.y - cc.WinSize.height)).easing(cc.easeIn(.6)), callFunc);
            case EFFECT_TYPE.SCALE:
                return cc.sequence(delay, cc.scaleTo(.3, 0, 0).easing(cc.easeBackIn()), callFunc);
            default:
                return null;
        }
    },

    getOutDuration: function () {
        if (this.actionOut == null) {
            this.actionOut = this.getOutEffect();
        }

        if (this.actionOut != null) {
            return this.actionOut.getDuration();
        }

        return 0;
    }
});

module.export = Effect_UI;