const GameManager = require('GameManager');

cc.Class({
    extends: cc.Component,

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite
        },

        lbName: {
            default: null,
            type: cc.Label
        },
        icRank: {
            default: null,
            type: cc.Node
        },

        lbRank: {
            default: null,
            type: cc.Label
        },

        lbChip: {
            default: null,
            type: cc.Label
        },

        btnFriend: {
            default: null,
            type: cc.Button
        },

        iconUser: {
            default: null,
            type: cc.Sprite
        },

        bkg: {
            default: null,
            type: cc.Sprite
        },
        itemVip: {
            default: [],
            type: [cc.Sprite]
        },
        //Data item
        strName: {
            default: "",
            visible: false
        },

        avt: {
            default: 0,
            visible: false
        },

        chip: {
            default: 0,
            visible: false
        },

        vip: {
            default: 0,
            visible: false
        },

        id: {
            default: 0,
            visible: false
        },

        fId: {
            default: 0,
            visible: false
        },

        status: {
            default: "...",
            visible: false
        },
        info_friend_view: {
            default: null,
            type: cc.Prefab
        },
        listIconVip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        listIcon: {
            default: [],
            type: [cc.SpriteFrame]
        },
        listIconAddFriend: {
            default: [],
            type: [cc.SpriteFrame]
        },
        name_player: "",
        isInit: true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.scale = cc.v2(1, 0);
    },

    start() {
    },
    onEnable() {
        this.node.runAction(cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut()));
    },
    onDisable() {
        this.node.scale = cc.v2(1, 0);

    },
    // update (dt) {},

    init: function (data) {

        let indexRank = data.rank;
        let name = data.name;
        let av = data.Av;
        let chip = data.Chip;
        let vip = data.Vip;
        let id = data.Id;
        let Faid = data.fid;
        let status = "";
        let isFriend = data.isFriend

        this.name_player = name;
        this.strName = name;
        this.avt = av;
        this.chip = require('GameManager').getInstance().formatNumber(chip);
        this.vip = vip;
        this.id = id;
        this.fid = Faid;
        this.status = status;

        // this.rank
        if (indexRank <= 3) {
            if (this.lbRank != null)
                this.lbRank.node.active = false;
            this.icRank.active = true;
            let res = 'ico_top' + indexRank;
            if (indexRank != 2)
                this.icRank.getComponent(cc.Sprite).spriteFrame = this.listIcon[indexRank - 1];
            else
                this.icRank.getComponent(cc.Sprite).spriteFrame = this.listIcon[1];
            this.lbRank.node.active = false;
            if (indexRank === 1) {
                this.lbName.node.color = cc.Color.YELLOW;
                this.lbChip.node.color = cc.Color.YELLOW;
            }
        } else {
            if (this.icRank != null)
                this.icRank.active = false;
            this.lbRank.node.active = true;
            this.lbRank.string = indexRank;
        }
        this.lbName.string = this.strName;
        if (this.lbName.string.length > 15) this.lbName.string = this.lbName.string.substring(0, 12) + '...';
        if (this.id === GameManager.getInstance().user.id) this.avt = GameManager.getInstance().user.avtId;
        this.setAvatar(this.avt, this.name_player, this.fid);
        this.lbChip.string = this.chip.toLocaleString(undefined, { maximumFractionDigits: 2 });
        if (isFriend) {
            this.btnFriend.interactable = false;
            // this.iconUser.node.color = new cc.Color(167, 167, 167);
            this.iconUser.spriteFrame = this.listIconAddFriend[1];
        }
        else {
            this.btnFriend.interactable = true;
            // this.iconUser.node.color = new cc.Color(255, 255, 255);
            this.iconUser.spriteFrame = this.listIconAddFriend[0];
        }
        this.updateVip();
        this.isInit = false;
    },
    setAvatar(id, name, fid) {
        this.avatar.node.getComponent("AvatarItem").loadTexture(id, name, fid, this.vip);
    },
    //*Ref
    onClickItem: function () {
        // cc.NGWlog('Click top rick item');
    },

    onClickAddFriend: function () {
        cc.NGWlog('Click add friend');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAddFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.btnFriend.interactable = false;
        this.iconUser.spriteFrame = this.listIconAddFriend[1];
        // this.iconUser.node.color = new cc.Color(167, 167, 167);
        if (this.isInit) return;
        if (this.id > 0) {
            require('NetworkManager').getInstance().sendFollow(this.name_player, String(this.id));
            cc.NGWlog('Name1:' + this.name_player);
        }
        else {
            cc.NGWlog('Name2:' + this.name);
            require('NetworkManager').getInstance().sendFollowByName(this.name);
        }
    },

    onClickInfo: function () {
        // if (this.id === require('GameManager').getInstance().user.id) {
        //     return;
        // }
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowProfileFamous_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        cc.NGWlog('onClickInFo');
        require('NetworkManager').getInstance().sendSearchFriendRequest(this.id);
        Global.TopListView.fid = this.fid;
    },

    updateVip() {
        let vip = this.vip;
        if (vip >= 10) {
            vip = 10;
        }
        let vip1 = Math.floor(vip / 2);
        let vip2 = vip % 2;

        for (let i = 0; i < this.itemVip.length; i++) {
            if (i + 1 <= vip1) {
                this.itemVip[i].spriteFrame = this.listIconVip[2];
            } else if (vip2 != 0) {
                vip2 = 0;
                this.itemVip[i].spriteFrame = this.listIconVip[1];
            } else {
                this.itemVip[i].spriteFrame = this.listIconVip[0];
            }
        }
    },
});


