
const FriendSearchList = require('FriendSearchList')
cc.Class({
    extends: cc.Component,

    properties: {
        sp_avatar: {
            default: null,
            type: cc.Sprite
        },
        lb_vip: {
            default: null,
            type: cc.Label
        },
        lb_name: {
            default: null,
            type: cc.Label
        },
        lb_chip: {
            default: null,
            type: cc.Label
        },
        node_GiftView: {
            default: null,
            type: cc.Prefab
        },
        id_fr: 0,
        str_type: "",
        name_fr: "",
        listIconVip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        itemVip: {
            default: [],
            type: [cc.Sprite]
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init: function (avaId, name, vip, chip, id_friend, _type, fid) {
        this.name_fr = name;
        this.str_type = _type;
        if (name.length > 12) name = name.substring(0, 12) + "..";
        this.lb_name.string = name;
        cc.log("Name fr:", name);
        // this.lb_vip.string = vip;
        this.lb_chip.string = chip;
        this.id_fr = id_friend;
        this.sp_avatar.node.getComponent("AvatarItem").loadTexture(avaId, this.name_fr, fid, vip);
        this.vip = vip;
        this.updateVip();

    },
    onClickFriend() {
        if (this.str_type === 'mail') {
            Global.MailView.onClickShowMessageDetail(this.id_fr, this.name_fr);
        }
        else {
            if (Global.GiftView.node.getParent() === null)
                require('UIManager').instance.onShowGift();
            Global.GiftView.init(this.id_fr);
            FriendSearchList.instance.onClose();
        }
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

    // update (dt) {},
});