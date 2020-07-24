cc.Class({
    extends: require("PopupEffect"),

    properties: {
        listOnline: {
            default: null,
            type: cc.ScrollView
        },
        itemChipOnline: {
            default: null,
            type: cc.Prefab
        },
    },
    setInfo() {
        this.listItemData = require('GameManager').getInstance().promotionInfo.numberP;
        this.onlineCurrent = require('GameManager').getInstance().promotionInfo.onlineCurrent;
        cc.NGWlog('chay vao Countdown');
        this.listOnline.content.removeAllChildren();
        this.getData();
    },
    onIn() {
        this.onPopOn();
    },
    onClose() {
        let _this = this;
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },
    getData() {
        for (let i = 0; i < this.listItemData; i++) {
            let agBonus = require('GameManager').getInstance().promotionInfo.chipBonus[i];
            let lb_times = i;
            //Set received
            let received = false;
            if (i < this.onlineCurrent) {
                received = true;
            }
            //Set active
            let activeData = false;
            if (i === this.onlineCurrent) {
                activeData = true;
            }
            let item = cc.instantiate(this.itemChipOnline).getComponent('ChipOnlineItem');
            item.initItem(agBonus, lb_times, received, activeData);
            this.listOnline.content.addChild(item.node);
        }
    }
});
