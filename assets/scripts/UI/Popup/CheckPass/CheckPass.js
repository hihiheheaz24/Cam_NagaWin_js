var CheckPass = cc.Class({
    extends: require("PopupEffect"),

    properties: {
        EditBox: {
            default: null,
            type: cc.EditBox
        },
        lb_notification: {
            default: null,
            type: cc.Label
        },
    },
    onConfirm() {
        this.node.destroy();
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickConfirm_%s", require('GameManager').getInstance().getCurrentSceneName()));
         var pass = this.EditBox.string;
        let checkpass =  require('GameManager').getInstance().checkPassId;
         require('NetworkManager').getInstance().sendJoinTableWithPass( checkpass, pass );
        cc.NGWlog('aaaaaaaaaaaaaaaaaaaaaaaaaleaaaaa', pass);
        cc.NGWlog('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',checkpass);
        require('UIManager').instance.onHideView(this.node, true);
       
    },

    // onLoad () {},

    start() {
        this.onPopOn();
        cc.NGWlog('hide load CheckPass');
        require('UIManager').instance.onHideLoad();
       
    },
    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.onPopOff();
    }


    // update (dt) {},
});
module.exports = CheckPass;
