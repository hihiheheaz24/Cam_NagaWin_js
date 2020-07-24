var Dice = cc.Class({
    extends: cc.Component,

    properties: {
        bgDice: {
            default: null,
            type: cc.Sprite
        },

        spValue: {
            default: null,
            type: cc.Sprite
        },

        fraValue: {
            default: [],
            type: cc.SpriteFrame
        },

        number: {
            default: 1,
            visibale: false,
            type: cc.Integer
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setValue(num) {
        if(num > 6 || num <= 0) return;
        this.number = num;
        this.spValue.getComponent(cc.Sprite).spriteFrame = this.fraValue[this.number - 1];
    },
});

module.export = Dice;
