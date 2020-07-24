const BasePopup = require('BasePopup')
var Giftcode = cc.Class({
    extends: require("PopupEffect"),

    properties: {
        giftcodeEditBox: {
            default: null,
            type: cc.EditBox
        },
        lb_notification: {
            default: null,
            type: cc.Label
        }
    },
    onConfirm() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickConfirm_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        var giftcode = this.giftcodeEditBox.string;
        // cc.NGWlog('-------------------------------------------------> CODE:  ' + giftcode);
        if (giftcode === '') return;
        require('NetworkManager').getInstance().sendGiftCode(giftcode);
        
    },

    // onLoad () {},

    start() {
        this.onPopOn();
    },
    onClose() {
        let _this = this;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickCloseGiftcode_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.onPopOff(true);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    }


    // update (dt) {},
});
module.exports = Giftcode
