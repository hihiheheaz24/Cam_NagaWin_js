
const MailView = require('MailView')
// const NetWorkManager = require('NetworkManager')
const GameManager = require('GameManager')

var MailAdminView = cc.Class({
    extends: require('BasePopup'),

    // name: "MailAdminView",

    properties: {
        btn_reply: {
            default: null,
            type: cc.Button
        },

        scroll_view: {
            default: null,
            type: cc.ScrollView
        },

        lb_content: {
            default: null,
            type: cc.Label
        },
    },

    start() {
    },

    onClickClose() {
        MailView.instance.onClickCloseFeedback();
        MailView.instance.reloadListMailAdmin();
        this.node.destroy();
    },

    onClickReply() {
        MailView.instance.node_mail.active = true;
        MailView.instance.onClickNewMail();
        this.node.destroy();
    },

    initData: function (id, content) {
        this.lb_content.string = content;

        for (let i = 0; i < GameManager.getInstance().mail20.length; i++) {

            if (GameManager.getInstance().mail20[i].idMsg == id) {
                require('NetworkManager').getInstance().sendReadMail(id);
                GameManager.getInstance().mail20[i].s = true;
                break;
            }
        }

        GameManager.getInstance().mail20.sort(function (a, b) {
            if (a.s === b.s)
                return a.time > b.time;
            else
                return a.s > b.s;
        });

        cc.NGWlog("id this mail admin = " + id);

    }
});
module.exports = MailAdminView;
