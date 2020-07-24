cc.Class({
    extends: cc.Component,

    properties: {
        dice1: {
            default: null,
            type: cc.Sprite
        },

        dice2: {
            default: null,
            type: cc.Sprite
        },

        dice3: {
            default: null,
            type: cc.Sprite
        },

        diceFrame: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    init(val1, val2, val3) {
        this.dice1.getComponent(cc.Sprite).spriteFrame = this.diceFrame[val1 - 1];
        this.dice2.getComponent(cc.Sprite).spriteFrame = this.diceFrame[val2 - 1];
        this.dice3.getComponent(cc.Sprite).spriteFrame = this.diceFrame[val3 - 1];
    }
});
