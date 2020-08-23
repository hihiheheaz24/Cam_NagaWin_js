
cc.Class({

    extends: cc.Component,

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite
        },

        lb_name: {
            default: null,
            type: cc.Label
        },

        lb_vip: {
            default: null,
            type: cc.Label
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },
        bkg: {
            default: null,
            type: cc.Node
        },
        vipLayout: {
            default: null,
            type: cc.Node
        },
        listIconVip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        _isRemove: false,
        btn_check: cc.Toggle,
        id: 0,
        id_fr: 0,
        name_fr: "",
        avatarid: "",
        isFirstInit: true,
        btn_sendGift: cc.Button
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
    start() {
    },

    init: function (id, avaId, name, vip, chip, id_friend, Faid) {
        this.btn_sendGift.node.active = require('ConfigManager').getInstance().ketT;
        this.name_fr = name;
        if (name.length > 12) name = name.substring(0, 12) + "..";
        this.id = id;
        this.id_fr = id_friend;
        this.lb_name.string = name;
        this.lb_vip.string = "V" + vip;
        this.lb_chip.string = require('GameManager').getInstance().formatNumber(chip);
        this.avatarid = avaId;
        this.avatar.node.getComponent('AvatarItem').loadTexture(avaId, this.name_fr, Faid, vip);
        this.btn_check.isChecked = false;
        this.isFirstInit = false;

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
    },
    onClickSendMail() {
        Global.FriendPopView.showMess(this.id_fr, this.name_fr);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChat_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.CHAT_FRIEND);
    },

    onClickDelete() {
        require('NetworkManager').getInstance().sendUnfollow(this.id_fr);
        this.node.active = false;
    },
    onClickFriendInfo() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFriendInfo_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('NetworkManager').getInstance().sendSearchFriendRequest(this.id_fr);
    },
    onClickSendGift() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowGift_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        Global.FriendPopView.showGiftpop(this.id_fr);
    },
    onClickCheckbox() {
        cc.NGWlog("on click ic_check, status = " + this.btn_check.isChecked);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCheckBox_%s", require('GameManager').getInstance().getCurrentSceneName()));
        // this.isChecked = this.btn_check.isChecked;
        // if (this.isFirstInit) return;
        // if (this.isChecked === false) {
        //     Global.FriendPopView.removeItemFromListCheck(this.id_fr);
        // }
        // else {
        //     Global.FriendPopView.addItemToListCheck(this.id_fr);
        // }
        this._isRemove = !this._isRemove;
        Global.FriendPopView.updateStateBtnDel();
    },
    onRemove() {
        if (this._isRemove == true) {
            require('NetworkManager').getInstance().sendUnfollow(this.id_fr);
            //  Global.FriendPopView.friendViewPool.put(this.node);
            this.node.removeFromParent();
            this.node.destroy();
            this._isRemove = false;
            return true;
        }
        return false;
    }
});

