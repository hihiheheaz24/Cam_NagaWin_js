var ItemChatHistoryInGame = cc.Class({
    extends: cc.Component,

    properties: {
        bg_chat: {
            default: null,
            type: cc.Sprite,
        },

        lb_chat_item: {
            default: null,
            type: cc.Label
        },

        ic_chat_item: {
            default: null,
            type: sp.Skeleton
        },

        lb_chat_text: {
            default: null,
            type: cc.Label
        },
        id_game: 0,
    },

    start() {
    },

    setDataChatText(str) {
        this.bg_chat.node.active = false;
        this.lb_chat_text.node.active = true;
        this.lb_chat_text.string = str;
        cc.NGWlog(('data text:' + str));
        if (str.length < 16) {
            this.node.setContentSize(cc.size(160, 25));
        }
        else if(str.length >= 16 && str.length <= 32) {
            this.node.setContentSize(cc.size(160, 50));
        }
        else if (str.length >= 45) {
            this.node.setContentSize(cc.size(160, 110));
        }
        else if (str.length > 30)
            this.node.setContentSize(cc.size(165, 70));
    },

    setDataChatItem(str, id) {
        cc.NGWlog('data item: ' + str);
        this.bg_chat.node.active = true;
        this.lb_chat_text.node.active = false;
        this.lb_chat_item.string = str;
        this.ic_chat_item.skeletonData = Global.QuickChatCasino.listEmoAni[id-1];
        this.ic_chat_item.animation = 'animation';
        this.node.setContentSize(cc.size(165, 110));
    }
});
module.exports  = ItemChatHistoryInGame;