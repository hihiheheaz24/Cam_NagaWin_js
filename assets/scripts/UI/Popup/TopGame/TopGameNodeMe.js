const GameManager = require('GameManager');

cc.Class({
    extends: cc.Component,

    properties: {
        // user properties
        avtNode: cc.Node,
        lbName: cc.Label,
        lbChip: cc.Label,
        vipLayout: cc.Node,
        listSpriteFrameVip: [cc.SpriteFrame],
        listIconVip: [cc.Sprite],
        lbRank: cc.Label,
        listSprRank: [cc.SpriteFrame],
        sprRank: cc.Sprite
    },
    onLoad() {

    },
    onEnable() {

    },
    onDisable() {

    },
    init(data) {
        this.lbName.string = data.N;
        if (this.lbName.string.length > 15)
            this.lbName.string = this.lbName.string.slice(0, 12) + "...";
        this.lbChip.string = require("GameManager").getInstance().formatMoney(data.M);
        this.updateVip(data.V);
        this.avtNode.getComponent("AvatarItem").loadTexture(data.Av, data.N, data.Faid, data.V);
        if (data.R < 4) {
            this.sprRank.node.active = true;
            this.lbRank.node.active = false;
            this.sprRank.spriteFrame = this.listSprRank[data.R-1];
        }
        else {
            this.sprRank.node.active = false;
            this.lbRank.node.active = true;
            this.lbRank.string = data.R;
        }
    },
    updateVip(vip) {
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
    },
    
});