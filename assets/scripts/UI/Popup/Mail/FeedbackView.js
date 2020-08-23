
const MailView = require('MailView')
// const NetWorkManager = require('NetworkManager')

var FeedbackView = cc.Class({
    extends: require('PopupEffect'),

    // name: "FeedbackView",

    properties: {

        ed_box: {
            default: null,
            type: cc.EditBox
        },
    },

    setInfo() {
        this.ed_box.string = '';
      //  require('GameManager').getInstance().setCurView(CURRENT_VIEW.FEEDBACK_VIEW);
        this.onPopOn();
    },

    onClickClose() {
        let _this = this;
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        if (Global.MailView.node.getParent() !== null) {
            Global.MailView.onClickCloseFeedback();
            Global.MailView.reloadListMailAdmin();
        }
       
    },

    onClickSend() {
        require('SoundManager1').instance.playButton();
        let str = this.ed_box.string;
        if (str === '') {
            return;
        }
        if (Global.FeedBackView.node.getParent() != null) {
            Global.FeedBackView.onClickClose();
        }
        require('NetworkManager').getInstance().sendFeedback(str);
    }
});
module.exports = FeedbackView;
