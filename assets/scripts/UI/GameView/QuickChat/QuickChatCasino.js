var QuickChatCasino = cc.Class({
    extends: cc.Component,

    properties: {
        listEmoAni: {
            default: [],
            type: [sp.SkeletonData]
        },

        listEmoAniThrow: {
            default: [],
            type: [sp.SkeletonData]
        },

        listEmoImg: {
            default: [],
            type: [cc.SpriteFrame]
        },

        listEmoThrowImg: {
            default: [],
            type: [cc.SpriteFrame]
        },
        mask: {
            default: null,
            type: cc.Sprite
        },
        listChatHistory: {
            default: null,
            type: cc.ScrollView
        },

        lbTextChat: {
            default: null,
            type: cc.EditBox
        },

        itemEmoAni: {
            default: null,
            type: cc.Prefab
        },

        itemText: {
            default: null,
            type: cc.Prefab
        },
        preItemAnimation:cc.Prefab,
        preBubbleText:cc.Prefab,
        itemChatHistory:cc.Prefab,
        itemQuickChatEmoL:cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.initItemChatPool();
    },
    initQuickChatEmo(){
        this.quickChatEmo = cc.instantiate(this.itemQuickChatEmoL).getComponent("QuickChatEmo");
        this.quickChatEmo.initEmo(this.listEmoAni);
    },
    initItemChatPool(){
        this.itemChatPool = new cc.NodePool('ItemChatHistoryInGame');
        for(let i = 0 ; i < 10 ; i++){
            this.itemChatPool.put(cc.instantiate(this.itemChatHistory));
        }
    },
    // update (dt) {},
    

    onIn() {
        var moveDistance = 100;
        var timeIn = 0.1;
        var oriPos = cc.v2(0,0);
        this.node.position = cc.v2(oriPos.x - moveDistance,oriPos.y);
        //*Mask
        //-Pre effect
        this.mask.node.opacity = 0;
        this.node.active = true;
        this.node.opacity = 0;
        var moveI = cc.moveTo(timeIn, cc.v2(oriPos)).easing(cc.easeBackOut());
        var fadeI = cc.fadeIn(timeIn).easing(cc.easeIn(0.1));
        var eff = cc.spawn(moveI,fadeI);
        this.node.runAction(eff);
        //-Effect
        this.mask.node.runAction(cc.fadeTo(timeIn*0.1,100));
    },

    onOut(){
        //Setup
        var timeOut = 0.1;
        var moveDistance = 100;
        var oriPos = this.node.position;
        var npos = cc.v2(oriPos.x - moveDistance,oriPos.y);

        //Mask
        this.mask.node.runAction(cc.fadeOut(timeOut));

        //Quick chat
        var moveO = cc.moveTo(timeOut,npos).easing(cc.easeBackIn());
        var fadeO = cc.fadeOut(timeOut).easing(cc.easeOut(0.7));
        var eff = cc.spawn(moveO,fadeO);
        var rmv = cc.callFunc(()=>{
            this.node.position = oriPos;
            this.quickChatEmo.node.removeFromParent();
            this.node.removeFromParent(false);
        });
        var act = cc.sequence(eff,rmv);
        this.node.runAction(act);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseQuickChat_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickEnterChat(event,data) {
        var textChat = this.lbTextChat.string;
        require('NetworkManager').getInstance().sendChat(require('GameManager').getInstance().user.uname, textChat);
        cc.NGWlog('Enter chat %s',textChat);
        this.lbTextChat.string = '';

        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSendQuickChat_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    addChatWithItem(str,id , isMe = false) {
        cc.NGWlog('add chat thanh cong o quickChat casino')
        if (this.listChatHistory.content.children.length > 20) {
            this.itemChatPool.put(this.listChatHistory.content.children[0]);
        }
        if(this.itemChatPool == null || typeof this.itemChatPool == 'undefined') this.initItemChatPool();
        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.itemChatHistory));};
        var item =  this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item.setDataChatItem(str, id  , isMe);
        this.listChatHistory.content.addChild(item.node);
        setTimeout(()=>{
            this.listChatHistory.scrollToBottom(0.1);
        },100)
        
    },

    addChatWithCard(str,data ) {
        if (this.listChatHistory.content.children.length > 20) {
            this.itemChatPool.put(this.listChatHistory.content.children[0]);
        }
        if(this.itemChatPool == null || typeof this.itemChatPool == 'undefined') this.initItemChatPool();
        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.itemChatHistory));};
        var item = this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item.setDataChatCard(str, data );
        this.listChatHistory.content.addChild(item.node);
        setTimeout(()=>{
            this.listChatHistory.scrollToBottom(0.1);
        },100)
        
    },

    addChatWithText(str , isMe = false) {
        if (this.listChatHistory.content.children.length > 20) {
            this.itemChatPool.put(this.listChatHistory.content.children[0]);
        }
        if(this.itemChatPool == null || typeof this.itemChatPool == 'undefined') this.initItemChatPool();
        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.itemChatHistory));};
        var item = this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item.setDataChatText(str , isMe);
        this.listChatHistory.content.addChild(item.node);
        setTimeout(()=>{
            this.listChatHistory.scrollToBottom(0.1);
        },100)
        
    },
    reset(){
        cc.NGWlog('chay vao ham reset chat==================================================')
        let contentChildren = this.listChatHistory.content.children
        let lengthContent = contentChildren.length
        for(let i = 0 ; i < lengthContent ; i++){
            this.itemChatPool.put(contentChildren[0]);
        };
        this.quickChatEmo.resetScrText();
        this.quickChatEmo.reset();
    },
    onClickEmoji(){
        this.quickChatEmo.node.parent = this.node;
        this.quickChatEmo.initText();
        this.quickChatEmo.onIn(false);
        
    }
});
module.export = QuickChatCasino;
