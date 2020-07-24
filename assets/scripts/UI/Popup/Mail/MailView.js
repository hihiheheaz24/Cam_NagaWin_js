
const GameManager = require('GameManager')
var MailData = require('MailData')
// const NetWorkManager = require('NetworkManager')

cc.Class({
    extends: require('PopupEffect'),

    properties: {
        node_mail: {
            default: null,
            type: cc.Sprite
        },

        btn_player: {
            default: null,
            type: cc.Toggle
        },

        btn_admin: {
            default: null,
            type: cc.Toggle
        },

        btn_new_mail: {
            default: null,
            type: cc.Button
        },

        btn_delete_mail: {
            default: null,
            type: cc.Button
        },

        list_mail: {
            default: null,
            type: cc.ScrollView
        },

        item_mail: {
            default: null,
            type: cc.Prefab
        },

        bg_mess_detail: {
            default: null,
            type: cc.Prefab
        },

        list_mail_select: {
            default: [],
            type: [cc.Integer]
        },
        searchFriendPop: cc.Prefab,

        tab_select: null,
        type_of_tab_player: 0,

        arr_mail_pl: {
            default: [],
            type: [require('MessData')]
        },

        // end feedback

        // popup send mess
        node_send_mess: {
            default: null,
            type: cc.Sprite
        },

        item_friend: {
            default: null,
            type: cc.Prefab
        },
        btn_CheckAll: cc.Toggle,
        isHaveMailNotRead: false,
        isShowTabAdminFirst: false,
        _isFirts: true,
        _ChooseTab: null,
        // end send mess
    },

    onRelease: function () {
        for (let i = 0; i < this.list_mail.content.children.length; i++) {
            let item = this.list_mail.content.children[i];
            item.stopAllActions();
            item.active = false;
        }
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        this._ChooseTab = null;
        this.checkShowRedDot();
    },

    onLoad: function () {
        this.effect_type = EFFECT_TYPE.MOVE_LEFT;
        this.oriPos = cc.v2(-cc.winSize.width, 0);
        this.node.position = cc.v2(0, 0);

    },

    start() {
        cc.NGWlog('MailView: Chay Vao Start!');
    },
    checkShowRedDot() {
        Global.MainView.redDotMail.active = false;
        cc.log("Size mail admin:=" + GameManager.getInstance().mail20.length);
        for (let i = 0; i < GameManager.getInstance().mail20.length; i++) {
            if (GameManager.getInstance().mail20[i].s > 0)
                Global.MainView.redDotMail.active = true;
        }
        cc.log("Size mail player:=" + GameManager.getInstance().mail21.length);
        for (let i = 0; i < GameManager.getInstance().mail21.length; i++) {
            if (GameManager.getInstance().mail21[i].s > 0)
                Global.MainView.redDotMail.active = true;
        }
        Global.MainView.redDotMail.getChildByName('lb_countmail')
        .getComponent(cc.Label).string = (require("GameManager").getInstance().numberMail + require("GameManager").getInstance().numberMailAdmin) < 9 ? 
        (require("GameManager").getInstance().numberMail + require("GameManager").getInstance().numberMailAdmin) : "+9";
    },
    handleDataMailAdmin(jsData) {
        GameManager.getInstance().mail20 = [];
        GameManager.getInstance().numberMailAdmin = 0;
        this.isShowTabAdminFirst = false;
        for (let i = 0; i < jsData.length; i++) {
            let _doc = jsData[i];
            let item = new MailData();
            if (_doc.DT)
                item.moneyType = _doc.DT;

            item.idMsg = _doc.Id;
            item.t = _doc.T;
            item.vip = _doc.Vip;
            item.from = _doc.From;
            item.to = _doc.To;
            item.gold = _doc.AG;
            item.i = _doc.I;
            item.msg = _doc.Msg;
            item.time = _doc.Time;
            item.s = _doc.S ? 0 : 1;
            item.d = _doc.D;

            if (item.from.toLowerCase().localeCompare("admin") == 0) {
                GameManager.getInstance().mail20.push(item);
            };
            if (item.s > 0 && this._ChooseTab == null) {
                this.isShowTabAdminFirst = true;
                GameManager.getInstance().numberMailAdmin++;
            }
        }
        if (GameManager.getInstance().numberMailAdmin > 0 && Global.MainView._checkMailFirtsTime) {
            Global.MainView._checkMailFirtsTime = false;
            GameManager.getInstance().onShowWarningDialog(
                GameManager.getInstance().getTextConfig("has_mail_show_system"),
                DIALOG_TYPE.TWO_BTN,
                GameManager.getInstance().getTextConfig("ok"),
                () => {
                    Global.MainView.onClickMail();
                },
                GameManager.getInstance().getTextConfig("label_cancel")
            );
        }

        GameManager.getInstance().mail20.sort(function (a, b) {
            if (a.s === b.s)
                return b.time - a.time;
            else
                return b.s - a.s;
        });
        this.reloadList();
        this.checkShowRedDot();

    },
    handleDataMailPlayer(jsData) {
        GameManager.getInstance().mail21 = [];
        GameManager.getInstance().numberMail = 0;
        for (let i = 0; i < jsData.length; i++) {
            let _doc = jsData[i];
            let item = new MailData();

            item.idMsg = _doc.id;
            item.from_id = _doc.fromid;
            item.to_id = _doc.toid;
            item.from = _doc.fromname;
            item.to = _doc.toname;

            if (item.from_id === GameManager.getInstance().user.id) {
                item.nameNotMe = item.to.toLowerCase();
            } else {
                item.nameNotMe = item.from.toLowerCase();
            }

            item.avatar_id = _doc.avatar;
            item.vip = _doc.vip;
            item.msg = _doc.title;
            item.time = _doc.msgtime;
            item.s = _doc.count <= 0 ? 0 : 1; //0=true 1=false
            item.fbid = _doc.fid;
            if (item.s > 0) {
                GameManager.getInstance().numberMail++;
            }
            GameManager.getInstance().mail21.push(item);
        }
        if (GameManager.getInstance().numberMail > 0 && Global.MainView._checkMailFirtsTime) {
            Global.MainView._checkMailFirtsTime = false;
            GameManager.getInstance().onShowWarningDialog(
                GameManager.getInstance().getTextConfig("has_mail_show_system"),
                DIALOG_TYPE.TWO_BTN,
                GameManager.getInstance().getTextConfig("ok"),
                () => {
                    Global.MainView.onClickMail();
                },
                GameManager.getInstance().getTextConfig("label_cancel")
            );
        }
        GameManager.getInstance().mail21.sort(function (a, b) {
            if (a.s === b.s)
                return b.time - a.time;
            else {
                return b.s - a.s;
            }
        });
        this.reloadList();
        this.checkShowRedDot();
    },
    setInfo() {
        this.onMoveUp();
        //require('GameManager').getInstance().setCurView(CURRENT_VIEW.MAIL);
        this.init();
        this.dataSize = 0;
    },
    init() {
        this.btn_player.isChecked = true;
        this.btn_admin.isChecked = false;
        this.btn_delete_mail.interactable = false;
        this.node_mail.node.active = true;
        this.tab_select = this._ChooseTab;
        if (this.tab_select == null)
            this.tab_select = 0;
        for (let i = 0; i < this.list_mail.content.children.length; i++) {
            let item = this.list_mail.content.children[i];
            item.active = false;
        }
        // this.scheduleOnce(() => {
        //     this.reloadList();
        // }, 0.5)
        this.btn_CheckAll.isChecked = false;
        this.btn_CheckAll.getComponentInChildren(cc.Label).string = GameManager.getInstance().getTextConfig('check_all');
        this.btn_player.getComponentInChildren(cc.Label).string = GameManager.getInstance().getTextConfig('txt_mail_player');
        if (this.isShowTabAdminFirst) {
            this.tab_select = 1;
            this.btn_admin.isChecked = true;
            this.btn_player.isChecked = false;
        }
        if (this.tab_select === 0)
            require("NetworkManager").getInstance().getMessList();
        else
            require("NetworkManager").getInstance().getMail(11);
    },

    onClickPlayer() {
        require("NetworkManager").getInstance().getMessList();
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabPlayer_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.tab_select = 0;
        this.btn_CheckAll.isChecked = false;
        this.list_mail_select = [];
        this.btn_delete_mail.interactable = false;
        this.reloadListMailPlayer();
    },

    onClickAdmin() {
        require("NetworkManager").getInstance().getMail(11);
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabAdmin_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.btn_CheckAll.isChecked = false;
        this.btn_delete_mail.interactable = false;
        this.tab_select = 1;
        this.list_mail_select = [];
        this.reloadListMailAdmin();
    },

    onClickNewMail() {
        require('SoundManager1').instance.playButton();
        if (this.tab_select === 0) {
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickNewMail_%s", require('GameManager').getInstance().getCurrentSceneName()));
            this.searchFrNode = cc.instantiate(this.searchFriendPop).getComponent("SearchFriendView");
            this.searchFrNode.curView = "mail";
            this.node.addChild(this.searchFrNode.node);
        }
        else if (this.tab_select === 1) {
            if (!require("ConfigManager").getInstance().is_bl_fb) {
                require("UIManager").instance.onShowFeedbackPopup();
            } else {
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    require("UIManager").instance.onShowContactAdmin();
                else if (cc.sys.os === cc.sys.OS_IOS)
                    cc.sys.openURL(require("GameManager").getInstance().u_chat_fb);
            }

            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFeedback_%s", require('GameManager').getInstance().getCurrentSceneName()));
        }
    },

    onClickCloseFeedback() {
        require('SoundManager1').instance.playButton();
        this.node_mail.node.active = true;
    },

    onClickCloseSendMess() {
        this.node_mail.node.active = true;
        this.list_mail_select = [];
        this.btn_CheckAll.isChecked = false;
    },

    onClickDeleteMail: function () {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDelMail_%s", require('GameManager').getInstance().getCurrentSceneName()));
        for (var i = 0; i < this.list_mail_select.length; i++) {
            if (this.tab_select == 0) {
                require('NetworkManager').getInstance().sendDeleteMailPlayer(this.list_mail_select[i]);
                for (var j = 0; j < GameManager.getInstance().mail21.length; j++) {
                    if (GameManager.getInstance().mail21[j].from_id == this.list_mail_select[i] ||
                        GameManager.getInstance().mail21[j].to_id == this.list_mail_select[i])
                        GameManager.getInstance().mail21.splice(j, 1);
                }
            }
            else if (this.tab_select == 1) {
                require('NetworkManager').getInstance().sendDeleteMailAdmin(this.list_mail_select[i]);
                for (var j = 0; j < GameManager.getInstance().mail20.length; j++) {
                    if (GameManager.getInstance().mail20[j].idMsg == this.list_mail_select[i])
                        GameManager.getInstance().mail20.splice(j, 1);
                }
            }
        }
        this.list_mail_select.clear;
        this.list_mail_select = [];
        this.btn_CheckAll.isChecked = false;
        this.btn_delete_mail.interactable = false;
        if (this.tab_select == 0)
            this.reloadListMailPlayer();
        if (this.tab_select == 1)
            this.reloadListMailAdmin();
    },
    reloadList() {
        cc.log("tab_select==" + this.tab_select);
        if (this.tab_select === 0) {
            this.btn_player.isChecked = true;
            this.btn_admin.isChecked = false;
            this.reloadListMailPlayer();
        } else {
            this.btn_player.isChecked = false;
            this.btn_admin.isChecked = true;
            this.reloadListMailAdmin();
        }
    },

    reloadListMailPlayer() {
        this.btn_new_mail.node.active = true;
        this.mailViewPool = require('UIManager').instance.mailViewPool;
        //  this.turnOffAllItem();
        this.unscheduleAllCallbacks();
        if (this.tab_select !== 0) return;
        let dataSize = GameManager.getInstance().mail21.length;
        this.dataSize = dataSize;
        cc.log("mail player size=" + dataSize);
        for (var i = 0; i < dataSize; i++) {
            let data = GameManager.getInstance().mail21[i];
            let item = this.list_mail.content.children[i];
            if (!item) {
                if (this.mailViewPool.size() < 1)
                    this.mailViewPool.put(cc.instantiate(this.item_mail));
                item = this.mailViewPool.get();
                this.scheduleOnce(() => {
                    this.list_mail.content.addChild(item);
                }, 0.13 * i);
            }
            item.getComponent("MailItem").setInfo(data, this.tab_select);
            this.scheduleOnce(() => {
                item.active = true;
            }, 0.13 * i);
            item.getComponent("MailItem").avtNode.active = true;
        }
        for (let i = dataSize; i < this.list_mail.content.children.length; i++) {
            this.list_mail.content.children[i].active = false;
        }

        this.btn_CheckAll.interactable = true;
        if (this.dataSize < 1 && this.tab_select == 0) this.btn_CheckAll.interactable = false;
    },

    reloadListMailAdmin() {
        this.btn_new_mail.node.active = true;
        this.mailViewPool = require('UIManager').instance.mailViewPool;
        if (this.tab_select !== 1) return;
        this.unscheduleAllCallbacks();
        let dataSize = GameManager.getInstance().mail20.length;
        this.dataSize = dataSize;
        for (var i = 0; i < dataSize; i++) {
            let data = GameManager.getInstance().mail20[i];
            let item = this.list_mail.content.children[i];
            if (!item) {
                if (this.mailViewPool.size() < 1)
                    this.mailViewPool.put(cc.instantiate(this.item_mail));
                item = this.mailViewPool.get();
                this.scheduleOnce(() => {
                    this.list_mail.content.addChild(item);
                }, 0.13 * i);
            }
            item.getComponent("MailItem").setInfo(data, this.tab_select); // (name, content, time, type, id_pl
            this.scheduleOnce(() => {
                item.active = true;
            }, 0.13 * i);
            item.getComponent("MailItem").avtNode.active = false;
        }
        for (let i = dataSize; i < this.list_mail.content.children.length; i++) {
            this.list_mail.content.children[i].active = false;
        }
        this.btn_CheckAll.interactable = true;
        if (dataSize < 1 && this.tab_select == 1) this.btn_CheckAll.interactable = false;
    },
    turnOffAllItem() {
        for (let i = 0; i < this.list_mail.content.children.length; i++) {
            this.list_mail.content.children[i].active = false;
        }
    },
    removeItemFromListCheck(id_list) {
        for (var i = 0; i < this.list_mail_select.length; i++)
            if (this.list_mail_select[i] == id_list)
                this.list_mail_select.splice(i, 1);
        this.dataSize === this.list_mail_select.length ? this.btn_CheckAll.isChecked = true : this.btn_CheckAll.isChecked = false;
        cc.NGWlog('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa datasize + list', this.dataSize, this.list_mail_select);
        if (this.list_mail_select.length > 0)
            this.btn_delete_mail.interactable = true;
        else
            this.btn_delete_mail.interactable = false;
    },

    addItemToListCheck(id_list) {
        this.list_mail_select.push(id_list);
        this.btn_delete_mail.interactable = true;
        cc.NGWlog("id mess = " + id_list);
        this.dataSize === this.list_mail_select.length ? this.btn_CheckAll.isChecked = true : this.btn_CheckAll.isChecked = false;
        cc.NGWlog('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa datasize + list', this.dataSize, this.list_mail_select);
    },

    onClickShowMessageDetail(id_fr, _name) {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        var node_mess_detail = cc.instantiate(this.bg_mess_detail);
        node_mess_detail.getComponent("MailViewMessage").initData(id_fr, _name);
        this.node.addChild(node_mess_detail);
    },

    showFullMessageDetail() {

    },

    onClickSearchList() {
        require('SoundManager1').instance.playButton();
        this.bg_list_fr.node.active = true;
        this.listview_fr.content.removeAllChildren();

        for (var i = 0; i < Global.FriendPopView._listFriends.length; i++) {
            var data = Global.FriendPopView._listFriends[i];
            var _name = data.nameLQ.length > 0 ? data.nameLQ : data.name;

            var item = cc.instantiate(this.item_friend).getComponent('ItemFriendSearchList');
            item.init(data.idAva, _name, data.vip, data.agFriend, data.idFriend, 'mail');
            this.listview_fr.content.addChild(item.node);
        }
    },
    onClickCheckAll() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCheckAll_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.tab_select == 0) {
            cc.log("Tab Seclecting=" + this.tab_select);
            this.isChecked = this.btn_CheckAll.isChecked;
            if (this.isChecked === false) {
                for (let i = 0; i < this.list_mail_select.length; i++) {
                    let item = this.list_mail.content.children[i].getComponent('MailItem');
                    item.ic_check.isChecked = this.btn_CheckAll.isChecked;
                }
                this.list_mail_select = [];
            }
            else {
                this.list_mail_select = [];
                for (let i = 0; i < this.dataSize; i++) {
                    let data = GameManager.getInstance().mail21[i];
                    var id_msg = data.from_id;
                    if (data.from_id === GameManager.getInstance().user.id) {
                        id_msg = data.to_id;
                    }
                    this.list_mail_select.push(id_msg);
                    let item = this.list_mail.content.children[i].getComponent('MailItem');
                    item.ic_check.isChecked = this.btn_CheckAll.isChecked;
                    cc.log("Check Mail");
                }
            }
        }
        if (this.tab_select == 1) {
            this.isChecked = this.btn_CheckAll.isChecked;
            if (this.isChecked === false) {
                for (var i = 0; i < this.list_mail_select.length; i++) {
                    let item = this.list_mail.content.children[i].getComponent('MailItem');
                    item.ic_check.isChecked = this.btn_CheckAll.isChecked;
                }
                this.list_mail_select = [];
            }
            else {
                this.list_mail_select = [];
                for (let i = 0; i < this.dataSize; i++) {
                    let data = GameManager.getInstance().mail20[i];
                    var id_msg = data.idMsg;
                    this.list_mail_select.push(id_msg);
                    let item = this.list_mail.content.children[i].getComponent('MailItem');
                    item.ic_check.isChecked = this.btn_CheckAll.isChecked;
                }
            }
        }
        if (this.list_mail_select.length > 0)
            this.btn_delete_mail.interactable = true;
        else
            this.btn_delete_mail.interactable = false;
    },

    onCloseSearchList() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseListFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.bg_list_fr.node.active = false;
    }
});
