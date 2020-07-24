
const MailView = require('MailView')
// const NetWorkManager = require('NetworkManager')
const GameManager = require('GameManager')

var MailViewMessage = cc.Class({
    extends: require('PopupEffect'),
    // name: "MailViewMessage",

    properties: {
        btn_send: {
            default: null,
            type: cc.Button
        },
        btn_reply: cc.Button,
        ed_box: {
            default: null,
            type: cc.EditBox
        },
        bkgEdb: cc.Node,
        lb_name: {
            default: null,
            type: cc.Label
        },

        item_mess_left: {
            default: null,
            type: cc.Prefab
        },

        item_mess_right: {
            default: null,
            type: cc.Prefab
        },

        list_mess: {
            default: [],
            type: [require('MessData')]
        },

        scroll_view: {
            default: null,
            type: cc.ScrollView
        },
        lastMessId: 0,
        id_friend: 0,
        name_friend: "",
        _isAdmin: false,

    },

    statics: {
        instance: null,
    },
    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.onMoveUp();
    },
    onKeyDown(event) {
        // switch (event.keyCode) {
        //     case cc.macro.KEY.enter:
        //         this.onClickSend();
        //         break;
        // }
    },
    onRelease: function () {
        MailViewMessage.instance = null;
        if (Global.MailView.node.getParent() !== null)
            Global.MailView.setInfo();
        this.node.destroy();



    },

    start() {
        MailViewMessage.instance = this;
    },

    onClickClose() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClose_%s", require('GameManager').getInstance().getCurrentSceneName()));
        Global.MailView.onClickCloseSendMess();

        require("GameManager").getInstance().setCurView(CURRENT_VIEW.INFO_FRIEND_VIEW);
        if (Global.MailView.node.getParent() !== null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.MAIL);
        }
        if (Global.FriendPopView.node.getParent() !== null && Global.FriendProfilePop.node.getParent() === null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.FRIEND_VIEW);
        }
        if (Global.TopListView.node.getParent() !== null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.INFO_FRIEND_VIEW);
        }
        if (this.lastMessId !== require("GameManager").getInstance().user.id && this.lastMessId !== 0) {
            require('NetworkManager').getInstance().sendReadMessage(this.lastMessId);
        }
        require("NetworkManager").getInstance().getMessList();
        this.onRelease();
    },

    onClickSend() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSendMess_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (!this._isAdmin) {
            let str = this.ed_box.string;
            str = str.trim();
            require('NetworkManager').getInstance().sendMessageToFriend(this.id_friend, this.name_friend, str);
            this.ed_box.string = "";
        } else {
            if (!require("ConfigManager").getInstance().is_bl_fb) {
                require("UIManager").instance.onShowFeedbackPopup();
            } else {
                cc.log("Open URL");
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    Global.MainView.onClickCallAdmin();
                else if (cc.sys.os === cc.sys.OS_IOS)
                    cc.sys.openURL(require("GameManager").getInstance().u_chat_fb);
            }
        }

    },

    initData: function (id_mess, name_fr) {
        setTimeout(() => {
            // require("NetworkManager").getInstance().getMessList();
        }, 500);
        this._isAdmin = false;
        this.id_friend = id_mess;
        this.name_friend = name_fr;
        this.name_fr = name_fr;
        this.lb_name.string = this.name_fr;
        if (this.lb_name.string.length > 15) {
            this.lb_name.string = this.lb_name.string.substring(0, 12) + '...';
        }
        require('NetworkManager').getInstance().sendReadMessage(this.id_friend);
        let i = 0;
        let dataMess = GameManager.getInstance().mail21;
        for (let i = 0; i < dataMess.length; i++) {
            if (dataMess[i].from_id === this.id_friend || dataMess[i].to_id === this.id_friend) {
                dataMess[i].s = true;
                break;
            }
        }
        dataMess.sort(function (a, b) {
            if (a.s === b.s)
                return a.time > b.time;
            else
                return a.s > b.s;
        });
        this.btn_reply.node.active = false;
        this.btn_send.node.active = true;
        Global.MailView._ChooseTab = 0;
    },
    initDataAdmin: function (id_mess, name_fr) {
        setTimeout(() => {
            require("NetworkManager").getInstance().getMail(11);
        }, 500);
        this._isAdmin = true;
        this.id_friend = id_mess;
        this.name_friend = name_fr;
        this.name_fr = name_fr;
        this.lb_name.string = this.name_fr;
        if (this.lb_name.string.length > 15) {
            this.lb_name.string = this.lb_name.string.substring(0, 15) + '...';
        }
        require('NetworkManager').getInstance().sendReadMail(this.id_friend);
        this.list_mess = [];
        this.list_mess = GameManager.getInstance().mail20;
        this.list_mess.sort(function (a, b) {
            if (a.s === b.s)
                return a.time > b.time;
            else
                return a.s > b.s;
        });
        this.showConversation(true);
        this.bkgEdb.active = false;
        this.btn_reply.node.active = true;
        this.btn_send.node.active = false;
        Global.MailView._ChooseTab = 1;
    },

    showConversation(isAdmin = false) {
        for (let i = 0; i < this.list_mess.length; i++) {
            if (!isAdmin) {
                this.addNewMessToList(this.list_mess[i]);
            }
            else {
                if (this.id_friend === this.list_mess[i].idMsg) {
                    let data = {};
                    data.time = this.list_mess[i].time;
                    data.mess = this.list_mess[i].msg;
                    data.nameSend = this.list_mess[i].from;
                    data.from_id = this.list_mess[i].idMsg;
                    this.addNewMessToList(data);
                }
            }
        }
    },

    checkMess(data) {
        if (data.from_id === this.id_friend || data.to_id === this.id_friend) {
            this.addNewMessToList(data);
            this.lastMessId = data.from_id;
        }
    },

    addNewMessToList(data) {
        // if (data.nameSend.toLowerCase() === GameManager.getInstance().user.uname.toLowerCase()) { // 

        if (data.from_id === GameManager.getInstance().user.id) {
            let item = cc.instantiate(this.item_mess_right);
            this.scroll_view.content.addChild(item);
            item.getComponent("MessItem").initData(data.time, data.mess, data.nameSend);

        }
        else {
            let item = cc.instantiate(this.item_mess_left);
            this.scroll_view.content.addChild(item);
            item.getComponent("MessItem").initData(data.time, data.mess, data.nameSend);

        }
        this.scroll_view.scrollToBottom(0.1, true);
    },

});
module.exports = MailViewMessage;
