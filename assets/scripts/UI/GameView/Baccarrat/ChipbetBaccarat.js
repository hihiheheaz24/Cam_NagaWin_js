var ChipbetBaccarat = cc.Class({
    extends: cc.Component,

    properties: {
        listChip: [cc.Sprite],
        sprListChip: cc.SpriteAtlas,
        listDataChip: [],
        chipDeal: 0,
        posChip: cc.Vec2(0, 0),
        pid: 0,
        chipCount: 0,
        isBeted: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (let i = 1; i < this.listChip.length; i++) {
            this.listChip[i].node.active = false;
            this.listChip[i].node.position = cc.v2(0, 0);
        }
        this.typeBet = "";
        this.countEff = 0;
        this.BaccaratView = require("GameManager").getInstance().gameView;
    },

    start() {
        this.BaccaratView = require("GameManager").getInstance().gameView;
        this.node.zIndex = 20;
    },
    setChip(value, agTable, typeBet) {
        this.countEff = 0;
        if (this.typeBet === "" || typeof this.typeBet === "undefined")
            this.typeBet = typeBet;
        for (let i = 1; i < this.listChip.length; i++) {
            this.listChip[i].node.position = cc.v2(0, 0);
            this.listChip[i].node.active = false;
        }
        this.chipDeal += value;
        let nameChipDeal = require("GameManager").getInstance().formatMoneyChip(this.chipDeal);
        let sprChip = this.sprListChip.getSpriteFrame(nameChipDeal);
        if (sprChip !== null) {
            this.listChip[0].node.active = true;
            this.listChip[0].spriteFrame = sprChip;
            this.listChip[0].node.position = this.posChip;
            this.countEff++;
        } else {
            this.listDataChip = [];
            this.getNameChip(this.chipDeal, agTable);
            let size = this.listDataChip.length;
            for (let i = 0; i < size; i++) {
                let data = this.listDataChip[i];
                for (let j = 0; j < data.num; j++) {
                    let spr = this.sprListChip.getSpriteFrame(require("GameManager").getInstance().formatMoneyChip(data.value));
                    this.listChip[this.chipCount].spriteFrame = spr;
                    this.chipCount++;
                    this.countEff++;
                }
            }
            for (let i = 0; i < this.chipCount; i++) {
                let deltaX = 0;
                let deltaY = i * 6;
                if (this.chipCount > 7) {
                    if (i > parseInt(this.chipCount / 2)) {
                        deltaX = 45;
                        deltaY = (i - parseInt(this.chipCount / 2)) * 6;
                    }
                }
                this.listChip[i].node.active = true;
                this.listChip[i].node.position = cc.v2(this.posChip.x + deltaX, this.posChip.y + deltaY);
            }
        }
        this.chipCount = 0;

    },
    getNameChip(value, agTable) {
        let listValue = [];
        let count = 0;
        listValue.push(1);
        for (let i = 0; i < 18; i++) {
            if (i % 2 !== 0)
                listValue.push(listValue[count] * 2);
            if (i % 2 == 0) {
                listValue.push(listValue[count] * 5);
            }
            count++;
        }
        let soNguyen = 0;
        let soDu = 0;
        let NearVal = 0;
        for (let i = 0; i < listValue.length; i++) {
            if (listValue[i] > value) {
                NearVal = listValue[i - 1];
                break;
            }
        }
        soNguyen = Math.floor(value / NearVal);
        soDu = value % NearVal;
        value = soDu;
        let dataChip = {
            value: NearVal,
            num: soNguyen
        }
        this.listDataChip.push(dataChip);
        if (soDu > 0) {
            this.getNameChip(value, agTable);
        }
    },
    resetChip() {
        this.chipCount = 0;
        this.chipDeal = 0;
        for (let i = 0; i < this.listChip.length; i++) {
            this.listChip[i].node.active = false;
            this.listChip[i].node.position = cc.v2(0, 0);
        }
    },
    onSideLose() { // thu chip thang lose.
        let posThuChip = this.BaccaratView.node.getChildByName("chip_Table").position;
        let i = 0;
        let size = this.listChip.length;
        for (i = size - 1; i >= 0; i--) {
            let chip = this.listChip[i];
            let indexRun = (size - 1 - i) * 0.08;
            let acRun = cc.sequence(cc.delayTime(indexRun),
                cc.moveTo(0.4, posThuChip),
                cc.callFunc(() => { chip.node.active = false; })
            );
            chip.node.stopAllActions();
            chip.node.runAction(acRun);
        }
    },
    onSideWin(posSide) { // tra chip thang win
        let i = 0;
        let size = this.listChip.length;
        for (i = 0; i < size; i++) {
            let chip = this.listChip[i];
            let posOld = this.BaccaratView.layoutChipWin.convertToWorldSpaceAR(chip.node.position);
            chip.node.removeFromParent();
            this.node.addChild(chip.node);
            let posNew = this.node.convertToNodeSpaceAR(posOld);
            chip.node.position = posNew;
        }
        for (i = 0; i < size; i++) {
            let chip = this.listChip[i];
            chip.node.runAction(cc.sequence(cc.delayTime(i * 0.05),
                cc.callFunc(() => {
                    chip.node.opacity = 255;
                })));
        }
        //Move to Side Win
        let randPosSide = cc.v2(0, 0);
        randPosSide.x = posSide.x + 40;
        randPosSide.y = posSide.y;
        setTimeout(() => {
            if (this.node) {
                this.chipMoveTo(randPosSide);
            }
        }, 1000);
    },
    chipMoveTo(pos, isActive = true) {
        let i = 0;
        let size = this.listChip.length;
        for (i = 0; i < size; i++) {
            let chip = this.listChip[i];
            let indexRun = i * 0.08;
            let deltaX = 0;
            let deltaY = i * 6;
            if (this.countEff > 7) {
                if (i > parseInt(this.countEff / 2)) {
                    deltaX = 45;
                    deltaY = ((i - parseInt(this.countEff / 2)) * 6);
                    indexRun = (i - parseInt(this.countEff / 2)) * 0.08;
                }
            }
            let acRun = cc.sequence(cc.delayTime(indexRun),
                cc.moveTo(0.4, cc.v2(pos.x + deltaX, pos.y + deltaY)),
                cc.callFunc(() => {
                    chip.node.active = isActive;
                })
            );
            chip.node.stopAllActions();
            chip.node.runAction(acRun);
        }
    },
    effectAppear() {
        for (let i = 0; i < this.listChip.length; i++) {
            this.listChip[i].node.active = false;
        }
        this.node.active = true;
        let count = this.countEff > 0 ? this.countEff : 0;
        for (let i = 0; i < count; i++) {
            // let delta = i;
            // let chip = this.listChip[i];
            // if (i > parseInt(count / 2) && count > 7) {
            //     delta = i - parseInt(count / 2);
            // }
            // this.node.runAction(cc.sequence(cc.delayTime(0.1 * delta), cc.callFunc(() => {
            //     chip.node.active = true;
            // })));
            let delta = i;
            let chip = this.listChip[i];
            if (i > parseInt(count / 2) && count > 7) {
                delta = i - parseInt(count / 2);
            }
            this.node.runAction(cc.sequence(cc.delayTime(0.1 * delta), cc.callFunc(() => {
                chip.node.active = true;
                chip.node.removeFromParent();
                this.BaccaratView.layoutChipWin.addChild(chip.node);
                chip.node.opacity = 0;
            })));

        }
    },
    generateRandomNumber(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },
    // update (dt) {},
});
module.exports = ChipbetBaccarat;