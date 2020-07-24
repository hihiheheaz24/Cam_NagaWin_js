const FriendData = require("FriendData");
cc.Class({
    extends: require("PopupEffect"),

    properties: {
        lb_name: {
            default: null,
            type: cc.Label
        },
        lb_id: {
            default: null,
            type: cc.Label
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },
        lb_status: {
            default: null,
            type: cc.Label
        },
        listIconVip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        avatar: {
            default: null,
            type: cc.Sprite
        },

        btn_add: {
            default: null,
            type: cc.Button
        },

        btn_del: {
            default: null,
            type: cc.Button
        },

        btn_sendgift: {
            default: null,
            type: cc.Button
        },
        btn_message: {
            default: null,
            type: cc.Button
        },
        sp_deactive: {
            default: null,
            type: cc.Sprite
        },

        item_mess: {
            default: null,
            type: cc.Prefab
        },

        gift_view: {
            default: null,
            type: cc.Prefab
        },
        listIconVip: {
            default: [],
            type: [cc.Sprite]
        },
        listSpriteFrameVip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        id_fr: "",
        name_fr: "",
        vip: 0,
        dataSave: require("FriendData"),

    },

    statics: {

    },
    recivceData(jsonData) {

        var jsData = JSON.parse(jsonData.data);
        var item = new FriendData();

        if (jsData) {
            item.name = jsData.name;
            item.nameLQ = "";
            if (jsData.namelq)
                item.nameLQ = jsData.namelq;

            item.idFriend = jsData.uid;

            item.idAva = jsData.avatar;
            item.agFriend = jsData.ag;
            item.vip = jsData.vip;
            item.isOnline = jsData.online !== 0 ? true : false;
            item.idTable = jsData.idtable;
            item.status = jsData.status;
            item.fid = jsData.fid;
            require("UIManager").instance.onShowFindProfile(item);
        }
    },
    start() {

    },
    onLoad() {
    },
    init: function (item) {
        let id = item.idFriend;
        let name = item._name;
        let chip = item.agFriend;
        let vip = item.vip;
        let avaId = item.idAva;
        let status = item.status;
        let fid = item.fid;
        cc.log("id avartar fb la======================= " + fid)
        this.turnOnBtn(true);
        this.id_fr = id;
        this.name_fr = name;
        if (name.length > 15)
            name = name.substring(0, 15) + '...';
        this.lb_name.string = name;
        this.lb_id.string = "ID: " + id;
        this.lb_status.string = status
        if (typeof chip === "string") {
            this.lb_chip.string = chip;
        } else if (typeof chip === "number")
            this.lb_chip.string = require('GameManager').getInstance().formatNumber(chip);

        this.setAvatar(avaId, this.name_fr, fid,vip);
        var is_add = false;
        for (var i = 0; i < Global.FriendPopView._listFriends.length; i++) {
            var data = Global.FriendPopView._listFriends[i];
            var str_id = id + "";
            var str_frid = data.idFriend + "";

            if (str_id.indexOf(str_frid) != -1 || str_frid.indexOf(str_id) != -1 || this.name_fr.toUpperCase() === data.name.toUpperCase()) {
                is_add = true;
                break;
            }
        }

        require("GameManager").getInstance().setCurView(CURRENT_VIEW.INFO_FRIEND_VIEW);
        cc.NGWlog("name fr: " + this.name_fr + ", is_follow:" + is_add);

        this.updateState(is_add);
        this.btn_sendgift.node.active = require("ConfigManager").getInstance().ketT;

        if (vip >= 10) {
            vip = 10;
        }
        let vip1 = Math.floor(vip / 2);
        let vip2 = vip % 2;
        for (let i = 0; i < this.listIconVip.length; i++) {
            if (i + 1 <= vip1) {
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[2];
            } else if (vip2 != 0) {
                vip2 = 0;
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[1];
            } else {
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[0];
            }
        }
        // Check if open my own tiny profile
        if (id === require('GameManager').getInstance().user.id) {
            this.btn_add.node.active = false;
            this.btn_del.node.active = false;
            this.btn_message.node.active = false;
            this.btn_sendgift.node.active = false;
            this.bkg.height = 370;
        } else this.bkg.height = 500;
        if (require('GameManager').getInstance().getCurrentSceneName == CURRENT_VIEW.DT_VIEW)
            this.btn_sendgift.node.active = false;
        if (Global.GiftView.node.parent != null) {
            this.turnOnBtn(false);
        }
        this.onPopOn();
    },
    setAvatar(id, name, fid,vip) {
        this.avatar.node.getComponent("AvatarItem").loadTexture(id, name, fid,vip);
    },
    turnOnBtn(state) {
        this.btn_add.node.active = state;
        this.btn_del.node.active = state;
        this.btn_message.node.active = state;
        this.btn_del.node.active = state;
    },
    onClose() {
        this.onPopOff();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        Global.MainView.updateChipAndSafe();
        if (Global.FriendPopView.node.getParent() !== null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.FRIEND_VIEW);
        }
        else if (Global.TopListView.node.getParent() !== null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.TOP_VIEW);
        }
        else if (Global.TopRichView.node.getParent() !== null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.TOPRICH_VIEW);
        }
        else if (Global.ChatWorldView.node.getParent() !== null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.CHATWORLD);
        }
        else if (Global.GiftView.node.getParent() !== null) {
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.SEND_GIFT_VIEW);
        }
    },

    onClickAdd() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAddFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('NetworkManager').getInstance().sendFollow(this.name_fr, this.id_fr);
        this.updateState(true);
    },

    onClickDel() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickUnFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('NetworkManager').getInstance().sendUnfollow(this.id_fr);
        this.updateState(false);
        require('GameManager').getInstance().onShowToast(require('GameManager').getInstance().getTextConfig('friend_remove_success'));

        Global.FriendPopView.onDeleteItem(this.id_fr);
        if (Global.FriendPopView.node.getParent() !== null) {
            this.onClose();
        }
        if (Global.TopRichView.node.getParent() !== null) {
            Global.TopRichView.onDeleteFriend(this.id_fr);
        }

    },

    onClickSendGift() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSendGift_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        if (this.sp_deactive.node.active) return;
        if (Global.GiftView.node.getParent() === null) {
            this.node.addChild(Global.GiftView.node);
        } else {
            this.onClose();
            return;
        }
        Global.GiftView.setInfo();
        Global.GiftView.init(this.id_fr);
    },
    onClickMess() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChat_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        var item = cc.instantiate(this.item_mess).getComponent("MailViewMessage");
        item.initData(this.id_fr, this.name_fr);
        this.node.addChild(item.node);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.CHAT_FRIEND);
    },

    updateState(is_add) {
        if (is_add === true) {
            this.btn_add.node.active = false;
            this.btn_del.node.active = true;
        }
        else {
            this.btn_add.node.active = true;
            this.btn_del.node.active = false;
        }
    }

});