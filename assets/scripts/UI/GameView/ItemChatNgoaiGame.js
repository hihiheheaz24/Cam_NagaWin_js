var ItemChatNgoaiGame = cc.Class({
    extends: cc.Component,

    properties: {
        bg_card: {
            default: null,
            type: cc.Node,
        },

        bg_chat: {
            default: null,
            type: cc.Node,
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

        list_card: {
            default: [],
            type: [cc.Sprite]
        },

        lb_chat_card: {
            default: null,
            type: cc.Label
        },
        miniCardPlis: cc.SpriteAtlas,
        id_game: 0,
    },
    onLoad(){
        this.ic_chat_item.node.scale = 0.35;
    },
    setDataChatText(str) {
        this.unuse();
        cc.NGWlog('STR', str);
        this.lb_chat_text.node.active = true;
        this.lb_chat_text.string = str;
    },

    setDataChatItem(str, id, spAvartar = null) {
        this.unuse();
        this.bg_chat.active = true;
        this.ic_chat_item.node.active = true;
        this.lb_chat_item.string = str;
        this.ic_chat_item.skeletonData = Global.QuickChatCasino.listEmoAni[id - 1];
        this.ic_chat_item.animation = 'animation';
        this.ic_chat_item.premultipliedAlpha = false;
    },
    setDataChatCard(str, data, spAvartar = null) {
        this.unuse();
        this.bg_card.active = true;
        this.lb_chat_card.string = str;
        if (this.list_card.length > data.length) {
            this.list_card[2].node.active = false;
        }
        for (var i = 0; i < data.length; i++) {
            this.list_card[i].node.active = true;
            var res = "chathistory/mini_card/" + this.getTextCard(data[i]);
            this.list_card[i].spriteFrame = this.miniCardPlis.getSpriteFrame(this.getTextCard(data[i]));
        }

    },
    getTextCard(id) {
        var S = (parseInt((id - 1) / 13) + 1); //>=1 <=4
        var N = (parseInt((id - 1) % 13) + 2); // >=2 , <=14
        if (require('GameManager').getInstance().curGameId === GAME_ID.BORK) N = (id - 1) % 13 + 1;

        return N + this.getName(S);
    },
    getName(s) {
        if (require('GameManager').getInstance().curGameId === GAME_ID.BOOGYI) {
            switch (s) {
                case 1:
                    return 'tep';
                case 2:
                    return 'ro';
                case 3:
                    return 'co';
                case 4:
                    return 'bich';
                default:
                    return 'joker';
            }
        } else {
            switch (s) {
                case 1:
                    return 'bich';
                case 2:
                    return 'tep';
                case 3:
                    return 'ro';
                case 4:
                    return 'co';
                default:
                    return 'joker';
            }
        }

    },
    unuse() {
        this.bg_card.active = false;
        this.bg_chat.active = false;
        this.lb_chat_text.node.active = false;

    }
});
module.exports = ItemChatNgoaiGame;