cc.Class({
    extends: cc.Component,

    properties: {
        btn_Double: cc.Button,
        btn_Rebet: cc.Button,
        btn_Clear: cc.Button,
        btn_Deal: cc.Button,
        listBtnBetChip: [cc.Button],
        lbChip_Deal: cc.Label,
        lbChip_Clear: cc.Label,
        sprListChip: cc.SpriteAtlas,
        dataChipClick: 0,
        indexBet:0,
    },
    onLoad() {
        this.baccaratGameView = require("GameManager").getInstance().gameView;
        this.setSprChipBet();
    },
    onEnable() {
        this.node.opacity = 0;
        for (let i = 0; i < this.listBtnBetChip.length; i++) {
            this.listBtnBetChip[i].node.active = false;
        }
        this.node.runAction(cc.sequence(cc.fadeTo(0.5, 255), cc.callFunc(() => {
            for (let i = 0; i < this.listBtnBetChip.length; i++) {
                this.listBtnBetChip[i].node.active = false;
                this.node.runAction(cc.sequence(cc.delayTime(i * 0.05),
                    cc.callFunc(() => {
                        this.listBtnBetChip[i].node.active = true;
                        this.listBtnBetChip[i].node.runAction(cc.sequence(
                            cc.callFunc(() => {
                                this.listBtnBetChip[i].interactable=true;
                                this.listBtnBetChip[i].node.getChildByName("border").active = true;
                                this.listBtnBetChip[i].node.runAction(cc.scaleTo(0.05, 1.2));
                            }), cc.delayTime(0.05),
                            cc.callFunc(() => {
                                this.listBtnBetChip[i].node.getChildByName("border").active = false;
                                this.listBtnBetChip[i].node.runAction(cc.scaleTo(0.05, 1.0));
                            })
                        ))
                    })));
            }
        }), cc.delayTime(0.6), cc.callFunc(() => {
            this.onClickChip(null, this.baccaratGameView.chipDealLastMatch.toString());
        })));
        this.btn_Double.interactable = false;
        if (this.baccaratGameView.matchCount === 0) {
            this.btn_Rebet.interactable = false;
        } else {
            this.btn_Rebet.interactable = true;
        }
    },
    onDisable() {
        this.node.runAction(cc.fadeTo(0.5, 0));
    },
    start() {
        this.lbChip_Clear.string = "0";
        this.lbChip_Deal.string = "0"
        this.btn_Clear.interactable = false;
        this.btn_Deal.interactable = false;
    },
    onClickDouble() {
        this.baccaratGameView.onClickDouble();
    },
    onClickRebet() {
        this.baccaratGameView.onClickRebet();
    },
    onClickClear() {
        this.baccaratGameView.chipDeal = 0;
        this.baccaratGameView.onClickClear();
        this.setStateButton();
    },
    onClickDeal() {
        this.baccaratGameView.onClickDeal();
        this.lbChip_Clear.string = "0";
        this.lbChip_Deal.string = "0";
        this.node.active = false;
    },
    onClickChip(event, data) {
        cc.NGWlog("Baccarat====onClickChip");
        let size= this.listBtnBetChip.length;
        for(let i =0;i<size;i++){
            this.listBtnBetChip[i].node.getChildByName("border").active=false;
        }
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_click);
        data = parseInt(data);
        if (data > 0) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.baccaratGameView.setValueBtnBet(data);
        this.setStateButton();
        this.setStateButtonChip(this.baccaratGameView.thisPlayer.ag);
    },
    setSprChipBet() {
        let minBet = this.baccaratGameView.agTable;
        this.listValue = [];
        let value = minBet;
        this.listValue.push(value, value * 5, value * 10, value * 50, value * 100);
        let length = this.listValue.length;
        for (let i = 0; i < length; i++) {
            let name = require("GameManager").getInstance().formatMoneyChip(this.listValue[i]);
            this.listBtnBetChip[i].node.getComponent(cc.Sprite).spriteFrame = this.sprListChip.getSpriteFrame(name);

        }
    },
    setStateButton() {
        if (this.baccaratGameView.chipDeal === 0) {
            this.lbChip_Clear.string = 0;
            this.lbChip_Deal.string = 0;
            this.btn_Clear.interactable = false;
            this.btn_Deal.interactable = false
        }
    },
    setStateButtonChip(agPlayer) {
        let size = this.listBtnBetChip.length;
        for (let i = 0; i < size; i++) {
            if (agPlayer < this.listValue[i]) {
                this.listBtnBetChip[i].interactable = false;
            }
            else {
                this.listBtnBetChip[i].interactable = true;
            }
        }
        let index = this.baccaratGameView.chipDealLastMatch-1;
        if (index < 1)
            index = 0;
        this.listBtnBetChip[index].node.getChildByName("border").active = true;
    },
    hideButtonDoubleAndRebet() {
        this.node.runAction(cc.fadeTo(0.5, 0));
    }
});