

cc.Class({

    extends: cc.Component,

    properties: {
        ic_check: {
            default: null,
            type: cc.Toggle
        },

        btn_del: {
            default: null,
            type: cc.Button
        },

        btn_bg: {
            default: null,
            type: cc.Button
        },

        lb_name: {
            default: null,
            type: cc.Label
        },

        lb_content: {
            default: null,
            type: cc.Label
        },

        lb_time: {
            default: null,
            type: cc.Label
        },

        bg_item: {
            default: null,
            type: cc.Sprite
        },

        sp_line: {
            default: null,
            type: cc.Sprite
        },

        bg_mess_detail: {
            default: null,
            type: cc.Prefab
        },

        bg_mail_admin: {
            default: null,
            type: cc.Prefab
        },
        redDot: cc.Node,
        vipLayout: {
            default: null,
            type: cc.Node
        },

        listIconVip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        listSpriteFrameRead: {
            default: [],
            type: [cc.SpriteFrame]
        },
        avatar: cc.Sprite,
        avtNode: cc.Node,
        name_player: "",
        id_player: 0,
        id_in_list: 0,
        type: 0,
        str_content: "",
        isInit: true,
    },
    onLoad() {
        this.node.scale = cc.v2(1, 0);
    },
    onEnable() {
        this.node.runAction(cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut()));
    },
    onDisable() {
        this.node.scale = cc.v2(1, 0);
    },
    setInfo(data, type) {
        var time_ = new Date(data.time);
        let min = time_.getMinutes();
        let hou = time_.getHours();
        let _time1 = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min);
        var _time = time_.getDate() + "/" + (time_.getMonth() + 1) + "  " + _time1;

        var name_show = data.nameNotMe;
        var is_read = data.s > 0 ? false : true;
        if (is_read) {
            this.onRead();
        } else {
            this.onUnRead();
        }

        var id_msg = data.from_id;
        if (data.from_id === require("GameManager").getInstance().user.id) {
            id_msg = data.to_id;
        }
        if (type === 1) {
            id_msg = data.idMsg;
            name_show = data.from;
        }
        var vip = data.vip
        //cc.NGWlog('----> Mail From:    ' + namep);
        this.isInit = true;
        this.idMess = data.idMsg;
        this.name_player = name_show;
        this.str_content = data.msg;
        if (name_show.length > 12)
            name_show = name_show.substring(0, 12) + "...";
        this.lb_name.string = name_show;
        if (this.str_content.length > 25)
            this.str_content = this.str_content.substring(0, 25) + "...";
        let indexEnter = -1;

        indexEnter = this.str_content.indexOf('\n');
        if (indexEnter != -1) {
            this.str_content = this.str_content.substring(0, indexEnter) + "...";

        }

        this.lb_content.string = this.str_content;
        this.lb_time.string = _time;
        this.id_player = id_msg;
        this.type = type;

        this.ic_check.isChecked = false;

        this.bg_item.node.active = true;

        this.vipLayout.removeAllChildren();
        if (vip === 0) {
            let node = new cc.Node;
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.listIconVip[0];
            this.vipLayout.addChild(node);
        } else {
            let iconVip = parseInt(vip / 2);
            for (let i = 0; i < iconVip; i++) {
                let node = new cc.Node;
                let sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = this.listIconVip[2];
                this.vipLayout.addChild(node);
            }
            if (vip % 2 !== 0) {
                let node = new cc.Node;
                let sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = this.listIconVip[1];
                this.vipLayout.addChild(node);
            }
        }
        this.avatar.node.getComponent("AvatarItem").loadTexture(data.avatar_id, this.name_player, data.fbid, vip);
        this.isInit = false;
    },
    onClickItem() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickReadMail_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.type === 0) {
            if (Global.MailView.node.getChildByName("node_mess_detail") == null) {
                var node_mess_detail = cc.instantiate(this.bg_mess_detail);
                node_mess_detail.name = "node_mess_detail";
                node_mess_detail.getComponent("MailViewMessage").initData(this.id_player, this.name_player);
                Global.MailView.node.addChild(node_mess_detail);
            }


        }
        else if (this.type === 1) {
            var node_mail_admin = cc.instantiate(this.bg_mess_detail);
            Global.MailView.node.addChild(node_mail_admin);
            require("GameManager").getInstance().numberMailAdmin--;
            node_mail_admin.getComponent("MailViewMessage").initDataAdmin(this.id_player, this.name_player);
        }
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.CHAT_FRIEND);

    },

    onClickCheckbox() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCheckBox_%s", require('GameManager').getInstance().getCurrentSceneName()));
        cc.NGWlog("on click ic_check, status = " + this.ic_check.isChecked);
        this.isChecked = this.ic_check.isChecked;
        if (this.isInit) return;
        if (this.isChecked === false) {
            Global.MailView.removeItemFromListCheck(this.id_player);
        }
        else {
            Global.MailView.addItemToListCheck(this.id_player);
        }
    },

    onRead() {
        // cc.NGWlog("onRead");
        //   this.bg_item.spriteFrame = this.listSpriteFrameRead[0];
        this.redDot.active = false;
    },

    onUnRead() {
        this.redDot.active = true;
        //  cc.NGWlog("onUnRead");
        //  this.bg_item.spriteFrame = this.listSpriteFrameRead[1];
    },

    onClickDelete() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDelete_%s", require('GameManager').getInstance().getCurrentSceneName()));
        Global.MailView.list_mail_select.push(this.id_player);
        Global.MailView.onClickDeleteMail();
    }
});

