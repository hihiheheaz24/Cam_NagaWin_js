var ItemChatHistoryInGame = cc.Class({
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
        miniCardPlis:cc.SpriteAtlas,
        id_game: 0,
    },

    

    setDataChatText(str , isMe) {
        this.lb_chat_text.node.active = true;
        if(isMe){
            this.lb_chat_text.node.color = cc.Color.YELLOW;
        }else{
            this.lb_chat_text.node.color = cc.Color.WHITE;
        }
        
        this.lb_chat_text.string = str;
    },
    setDataChatItem(str, id ,isMe ) {
        cc.NGWlog('data item: ' + str);
        this.bg_chat.active = true;
        this.lb_chat_item.string = str;

        if(isMe){
            this.lb_chat_item.node.color = cc.Color.YELLOW;
        }
        else{
            this.lb_chat_item.node.color = cc.Color.WHITE;
        }

        this.ic_chat_item.skeletonData = Global.QuickChatCasino.listEmoAni[id - 1];
        this.ic_chat_item.animation = 'animation';
    },

    setDataChatCard(str, data , spAvartar = null) {
        cc.NGWlog('data card: ' + str + ", data: " + data);
        this.bg_card.active = true;
        this.lb_chat_card.string = str;
        for (var i = 0; i < data.length; i++) {
            this.list_card[i].node.active = true;
            var res = "chathistory/mini_card/" + this.getTextCard(data[i]);
            this.list_card[i].spriteFrame= this.miniCardPlis.getSpriteFrame(this.getTextCard(data[i]));
        }
    },
    getTextCard(id) {
        var S = (parseInt((id - 1) / 13) + 1); //>=1 <=4
        var N = (parseInt((id - 1) % 13) + 2); // >=2 , <=14
        if (require('GameManager').getInstance().curGameId === GAME_ID.BORK) N = (id - 1) % 13 + 1;
        return N + this.getName(S);
    },
    getName(s) {
        if(require('GameManager').getInstance().curGameId === GAME_ID.BOOGYI){
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
        }else{
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
    unuse(){
        this.bg_card.active = false;
        this.bg_chat.active = false;
        this.lb_chat_text.node.active = false;

        for (var i = 0; i < this.list_card.length; i++) {
            this.list_card[i].node.active = false;
        }
    }
});
module.exports  = ItemChatHistoryInGame;