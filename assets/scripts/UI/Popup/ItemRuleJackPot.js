cc.Class({
    extends: cc.Component,

    properties: {
        lbBet: cc.Label,
        lbChip: cc.Label,
        bkg_item: {
            default: null,
            type: cc.SpriteFrame
        },
        node_bkg: {
            default: null,
            type: cc.Sprite
        },
        count: 0
    },

    start() {

    },
    setInfo(bet, chip, count) {
        this.lbBet.string = require('GameManager').getInstance().formatNumber(bet) + '+';
        this.lbChip.string = require('GameManager').getInstance().formatNumber(chip);
        this.count = count;
        if (count % 2 == 0) {
            this.node_bkg.spriteFrame = this.bkg_item;
        } else this.node_bkg.enabled= false;
    },
});
