var ItemInviteInTable = cc.Class({
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

        id_player: 0,
        ag_table: 0,
        index: 0,
    },

    start() {},

    init (index, chip, strData) {
        if (strData) {
            cc.NGWlog('-=-=-=-=>');
            cc.NGWlog(strData);
            var data = strData;
            this.ag_table = require('GameManager').getInstance().table_mark;
            this.id_player = data.idFriend;
            this.index = index;

            this.lb_name.string = data.name;
            this.lb_vip.string = "Vip " + data.vip;
            this.lb_chip.string = require('GameManager').getInstance().formatNumber(data.agFriend);

            this.avatar.node.getComponent("AvatarItem").loadTexture(data.idAva, data.name, data.fbid,data.vip);

        }
    },

    onClickInvite() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickInvite_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('NetworkManager').getInstance().sendInviteTable(this.id_player, this.ag_table);

        if (require('InvitePlayerInTable').instance !== null) {
            require('InvitePlayerInTable').instance.delItem(this.index);
        }

        this.node.destroy();
    }
});
module.exports = ItemInviteInTable;