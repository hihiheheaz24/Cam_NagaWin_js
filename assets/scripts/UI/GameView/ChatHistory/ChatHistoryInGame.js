var ChatHistoryInGame = cc.Class({
    extends: cc.Component,

    properties: {
        bg_zin: {
            default: null,
            type: cc.Sprite
        },
        
        bg_zout: {
            default: null,
            type: cc.Sprite
        },
        
        list_view_zin: {
            default: null,
            type: cc.ScrollView
        },
        
        list_view_zout: {
            default: null,
            type: cc.ScrollView
        },

        item_chathis: {
            default: null,
            type: cc.Prefab
        },

        mask: {
            default: null,
            type: cc.Button
        },
        
    },
    start () {
        this.init();
    },

    onLoad() {
        this.pos_in = cc.v2(-500, -87);
        this.pos_out = cc.v2(-500, -537);
        this.itemChatPool = new cc.NodePool('ItemChatHistoryInGame');
        for(let i = 0 ; i < 10 ; i++){
            this.itemChatPool.put(cc.instantiate(this.item_chathis));
        }
    },

    init() {
        this.bg_zin.node.active = false;
        this.bg_zout.node.active = true;
        this.mask.node.active = false;
    },

    onClickZin() {
        this.bg_zin.node.position = this.pos_out;
        this.bg_zin.node.active = true;
        this.bg_zout.node.active = false;
        this.mask.node.active = true;
        this.bg_zin.node.runAction(cc.moveTo(0.3, this.pos_in));
    },

    onClickZout() {
        this.bg_zin.node.runAction(cc.sequence(cc.moveTo(0.2, this.pos_out), cc.callFunc(()=> {
            this.bg_zin.node.active = false;
            this.bg_zout.node.active = true;
            this.mask.node.active = false;
        })));
    },

    addChatWithItem(str, id) {
        if (this.list_view_zin.content.children.length > 20) {
            this.list_view_zin.content.children[0].destroy();
            this.list_view_zout.content.children[0].destroy();
        }
        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.item_chathis));};
        var item =  this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item.setDataChatItem(str, id);
        if(this.list_view_zout.content.children.length > 20){
            this.itemChatPool.put(this.list_view_zout.content.children[0]);
        }
        this.list_view_zout.content.addChild(item.node);

        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.item_chathis));};
        var item2 = this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item2.setDataChatItem(str, id);

        if(this.list_view_zin.content.children.length > 20){
            this.itemChatPool.put(this.list_view_zin.content.children[0]);
        }
        this.list_view_zin.content.addChild(item2.node);
        this.scroll();
    },

    addChatWithCard(str, data) {
        if (this.list_view_zin.content.children.length > 20) {
            this.list_view_zin.content.children[0].destroy();
            this.list_view_zout.content.children[0].destroy();
        }
        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.item_chathis));};
        var item = this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item.setDataChatCard(str, data);
        if(this.list_view_zout.content.children.length > 20){
            this.itemChatPool.put(this.list_view_zout.content.children[0]);
        }
        this.list_view_zout.content.addChild(item.node);
        
        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.item_chathis));};
        var item2 = this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item2.setDataChatCard(str, data);
        if(this.list_view_zin.content.children.length > 20){
            this.itemChatPool.put(this.list_view_zin.content.children[0]);
        }
        this.list_view_zin.content.addChild(item2.node);
        this.scroll();
    },

    addChatWithText(str) {
        if (this.list_view_zin.content.children.length > 20) {
            this.list_view_zin.content.children[0].destroy();
            this.list_view_zout.content.children[0].destroy();
        }

        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.item_chathis));};
        var item = this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item.setDataChatText(str);
        if(this.list_view_zout.content.children.length > 20){
            this.itemChatPool.put(this.list_view_zout.content.children[0]);
        }
        this.list_view_zout.content.addChild(item.node);
        
        if(this.itemChatPool.size() <1){ this.itemChatPool.put(cc.instantiate(this.item_chathis));};
        var item2 = this.itemChatPool.get().getComponent('ItemChatHistoryInGame');
        item2.setDataChatText(str);
        if(this.list_view_zin.content.children.length > 20){
            this.itemChatPool.put(this.list_view_zin.content.children[0]);
        }
        this.list_view_zin.content.addChild(item2.node);
        this.scroll();
    },

    scroll() {
        this.list_view_zin.scrollToBottom(0.3, true);
        this.list_view_zout.scrollToBottom(0.3, true);
    },
    updateView(){
            let parent = this.list_view_zout.content.children;
            let length = parent.length
         for(let i = 0 ; i < length ; i++){
             let pos = this.getPostionInOtherNode(this.node,parent[i]);
            if( pos.y < -200 && pos.y > -429 ){
                parent[i].group = 'default';
            }else{
                parent[i].active = 'hide';
            }
         }
    },
    getPostionInOtherNode(spaceNode, targetNode) {
        if (targetNode.parent == null) {
          return null;
        }
        let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.getPosition());
        return spaceNode.convertToNodeSpaceAR(pos);
      }
});
module.exports = ChatHistoryInGame;