
const MailView = require('MailView')
// const NetworkManager = require('NetworkManager')

var SearchFriendView = cc.Class({
    extends: require('PopupEffect'),

    // name: 'SearchFriendView',

    properties: {
        ed_box: {
            default: null,
            type: cc.EditBox
        },

        btn_search: {
            default: null,
            type: cc.Button
        },
        btn_listFriend: cc.Button,
        listFriendPr: cc.Prefab,
        curView: "",

    },

    start() {
        this.onPopOn();
        let lb = this.btn_search.node.getChildByName('label').getComponent(cc.Label);
        let str = require('GameManager').getInstance().getTextConfig('txt_search_id_friend').replace(' Friend...', '');
        lb.string = str;
    },
    onclickSearch(event, data) {
        if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSearchFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        if (this.ed_box.string === "") return;
        require('NetworkManager').getInstance().sendSearchFriendRequest(parseInt(this.ed_box.string));
        this.ed_box.string = "";
        this.onClickClose();
    },
    onClickListFriend() {
        let listFr = cc.instantiate(this.listFriendPr).getComponent("FriendSearchList");
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowListFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        listFr.curView = this.curView;
        this.node.addChild(listFr.node);
    },
    onClickClose(event, data) {
        require('SoundManager1').instance.playButton();
        if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseFindFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        // if (Global.MailView.node.getParent() !== null) {
        //     Global.MailView.onClickCloseSendMess();
        // }
        //else {
        this.onPopOff();


        // }
    }
});
module.exports = SearchFriendView;