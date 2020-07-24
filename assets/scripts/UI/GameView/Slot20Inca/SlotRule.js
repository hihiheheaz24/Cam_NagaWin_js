
var BKG_RULE_WILD_9008 = 0;
var BKG_RULE_WILD_1010 = 1;
var BKG_RULE_ITEM_9008 = 0;
var BKG_RULE_ITEM_1010 = 1;
var BKG_RULE_PAYLINE_9008 = 1;
var BKG_RULE_PAYLINE_1010 = 0;


cc.Class({
    extends: cc.Component,

    properties: {
        spr_Rule: cc.Sprite,
        list_Spr_Rule: [cc.SpriteFrame],
        list_Bkg: [cc.SpriteFrame],
        list_Btn_Next: [cc.SpriteFrame],
        list_Bkg_Rule_Wild: [cc.SpriteFrame],
        list_Bkg_Rule_Item: [cc.SpriteFrame],
        list_Bkg_Payline: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.spr_Index = 0;
    },

    start() {
        this.initRule();
    },
    initRule() {
        let idGame = require("GameManager").getInstance().curGameId;
        this.list_Spr_Rule = [];
        switch (idGame) {
            case GAME_ID.SLOT50LINE:
                this.list_Spr_Rule.push(this.list_Bkg_Rule_Wild[BKG_RULE_WILD_9008], this.list_Bkg_Rule_Item[BKG_RULE_ITEM_9008], this.list_Bkg_Payline[BKG_RULE_PAYLINE_9008]);
                break;
            case GAME_ID.SLOT_20_LINE_JP:
                this.list_Spr_Rule.push(this.list_Bkg_Rule_Wild[BKG_RULE_WILD_1010], this.list_Bkg_Rule_Item[BKG_RULE_ITEM_1010], this.list_Bkg_Payline[BKG_RULE_PAYLINE_1010]);
                break;
        }
        this.spr_Index=-1;
        this.onClickNext();
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GUIDE_INGAME);
    },
    onClickNext(event,data) {
        if(data == 1)
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTurnRight_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.spr_Index++;
        if (this.spr_Index >= this.list_Spr_Rule.length) this.spr_Index = 0;
        this.spr_Rule.spriteFrame = this.list_Spr_Rule[this.spr_Index];
    },
    onClickPrevious() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTurnLeft_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.spr_Index--;
        if (this.spr_Index < 0) this.spr_Index = this.list_Spr_Rule.length - 1;
        this.spr_Rule.spriteFrame = this.list_Spr_Rule[this.spr_Index];
    },
    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseGuide_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.node.getComponent("PopupEffect").onPopOff(true);
        require("GameManager").getInstance().curGameViewId = parseInt(require("GameManager").getInstance().curGameId);
        require("GameManager").getInstance().setCurView(require("GameManager").getInstance().curGameViewId);
    }
    // update (dt) {},
});
