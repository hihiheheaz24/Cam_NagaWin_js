
var Chip = cc.Class({
    extends: cc.Component,

    properties: {
        listSpriteFrame: {
            default: [],
            type: [cc.SpriteFrame]
        },
        bkgChip: {
            default: null,
            type: cc.Sprite
        },

        valueChip: 0,
        valueChipTem: 0
    },

    setValue(valueC, valueCT, allIn = false) {
        this.valueChip = valueC;
        this.valueChipTem = valueCT
        try {
            if (this.valueChip === 1) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[0];
            } else if (this.valueChip === 5) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[1];
            } else if (this.valueChip === 10) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[2];
            } else if (this.valueChip === 50) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[3];
            } else if (this.valueChip === 100) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[4];
            } else if (this.valueChip === 500) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[5];
            } else if (this.valueChip === 1000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[6];
            } else if (this.valueChip === 5000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[7];
            } else if (this.valueChip === 10000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[8];
            } else if (this.valueChip === 50000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[9];
            } else if (this.valueChip === 100000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[10];
            } else if (this.valueChip === 500000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[11];
            } else if (this.valueChip === 1000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[12];
            } else if (this.valueChip === 5000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[13];
            } else if (this.valueChip === 10000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[14];
            } else if (this.valueChip === 50000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[15];
            } else if (this.valueChip === 100000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[16];
            } else if (this.valueChip === 500000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[17];
            } else if (this.valueChip === 1000000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[18];
            } else if (this.valueChip === 5000000000) {
                this.bkgChip.spriteFrame = this.listSpriteFrame[19];
            } else {
                this.bkgChip.spriteFrame = this.listSpriteFrame[21];
            }

            if(allIn){
                this.bkgChip.spriteFrame = this.listSpriteFrame[20];
            }

        } catch (err) {
            cc.NGWlog("=======Set value Chip:   " + err);
        }
    },
    getValue() {
        return this.valueChip;
    }
});

module.export = Chip;