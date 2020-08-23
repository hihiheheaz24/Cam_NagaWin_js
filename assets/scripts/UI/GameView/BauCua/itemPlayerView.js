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
        lbChip: {
            default: null,
            type: cc.Label
        },
        info_player_view: {
            default:null,
            type: cc.Prefab
        },
        //Data item
        strName: {
            default: "",
            visible: false
        },
        chip: {
            default: 0,
            visible: false
        },
        avId: {
            default: 0,
            visible: false
        },
        id: {
            default: 0,
            visible: false
        },
        fid: {
            default: 0,
            visible: false
        },
        vip: {
            default: 0,
            visible: false
        },
        status:'...',
    },

    init(id, name, chip, vip, av, fid) {
        this.strName = name;
        this.avId = av;
        this.id = id;
        this.chip = require('GameManager').getInstance().formatNumber(chip);
        this.vip = vip;
        this.fid = fid;
        this.lbName.string = this.strName;
        if (this.lbName.string.length > 15) {
            this.lbName.string = this.lbName.string.substring(0, 12) + '...';
        }
        this.avatar.node.getComponent("AvatarItem").loadTexture(av,this.strName,fid,this.vip);
        this.lbChip.string = this.chip.toLocaleString(undefined, { maximumFractionDigits: 2 });
    },
    onClickItem() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickItem_%s", require('GameManager').getInstance().getCurrentSceneName()));
        // var popupPre = cc.instantiate(this.info_player_view).getComponent('FriendProfileView');
        // popupPre.init(this.id, this.strName, this.chip, this.vip, this.avId, this.status, this.fid);
        // require("GameManager").getInstance().gameView.node.addChild(popupPre.node, GAME_ZORDER.Z_MENU_VIEW + 1);
         require('NetworkManager').getInstance().sendSearchFriendRequest(this.id);
    
    }
});

