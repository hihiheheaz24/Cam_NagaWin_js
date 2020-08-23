const GameManager = require('GameManager');
const ChatWorldData = require('ChatWorldData')
cc.Class({
    extends: require("PopupEffect"),
    // name: "ChatWorldView",

    properties: {
        btn_close: {
            default: null,
            type: cc.Button
        },

        list_chat: {
            default: null,
            type: cc.ScrollView
        },

        item_chat: {
            default: null,
            type: cc.Prefab
        },
        // item_chat: {
        //     default: null,
        //     type: cc.Node
        // },
        edbox: {
            default: null,
            type: cc.EditBox
        },

        btn_send: {
            default: null,
            type: cc.Button
        },
        btn_scrollToBot: cc.Button,
        isDestroy: false,
        listChildFalse: [],
        list_data_chat_world: [],
        _isScolling: false
    },
    receiveData(jsonData) {
        this.list_data_chat_world = [];
        var data = JSON.parse(jsonData.data);
        var start_index = 0;
        if (data.length > 25) {
            start_index = data.length - 25;
        }
        for (var i = start_index; i < data.length; i++) {
            var item = new ChatWorldData();
            item.name_player = data[i].Name;
            item.id_player = data[i].ID;
            item.content = data[i].Data;
            item.type = data[i].Type;
            item.vip_player = data[i].Vip;
            item.time = data[i].time;
            this.list_data_chat_world.push(item);
        }
        if (data.length > 0) { Global.MainView.addItemChatWorldMain(item); }
    },
    onEnable() {
        this.list_chat.scrollToBottom(0.2);
        this.btn_scrollToBot.node.position = this.btn_send.node.position;
    },

    moveUp() {
        this.onMoveUp();
        this.node.active = true;
        this.countScroll = 0;
        if (this.node.position.x != 0) this.node.position = cc.v2(0, 0);
        require("UIManager").instance.onHideView(Global.MainView.node);
        this.scheduleOnce(() => {
            this.init();
        }, 0.3);

        this.list_chat.scrollToBottom(0.8);
        // this.list_chat.scrollToPercentVertical(1.0, 0.1);
    },

    init() {
        require('SoundManager1').instance.playButton();
        this.scheduleOnce(() => {
            this.updateListChat();
        }, 0.3);
    },

    onClickClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('GameManager').getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
    },
    onDisable() {
        this.unscheduleAllCallbacks();
        let length = this.list_chat.content.childrenCount;
        for (let i = 0; i < length; i++) {
            this.list_chat.content.children[i].active = false;
        }
        this.list_chat.scrollEvents.length=[];
    },
    // onClickTabWorld() {
    //     require('SoundManager1').instance.playButton();
    //     this.updateListChat();
    // },
    handleChat(jsonData) {

        if (this.list_data_chat_world.length > 30) {
            this.list_data_chat_world.splice(0, 1);
        }
        var item = new ChatWorldData();
        item.name_player = jsonData.N.substring(0, jsonData.N.length - 3);
        item.id_player = jsonData.ID;
        item.content = jsonData.D;
        item.type = jsonData.T;
        item.vip_player = jsonData.V;
        item.time = jsonData.time;
        this.list_data_chat_world.push(item);
        this.updateChatItem(item);//,item.name_player, item.vip_player, item.id_player, item.content, item.type, item.time);
        cc.log("có thằng chat la== " + item.content);
        Global.MainView.addItemChatWorldMain(item);

    },
    updateListChat() {
        cc.log("chay vao update lít chat");
        let coutMax = this.list_data_chat_world.length;
        let countNode = this.list_chat.content.childrenCount;
        for (let i = 0; i < coutMax; i++) {
            let isAddChild = false;
            let data = this.list_data_chat_world[i];
            let item = null;
            if (i < countNode) {
                item = this.list_chat.content.children[i];
            } else {
                item = cc.instantiate(this.item_chat);
                isAddChild = true;
            }
            item.active = true;
            this.scheduleOnce(() => {
                if (isAddChild)
                    this.list_chat.content.addChild(item);
                item.getComponent('ItemChatWorldView').init(data);
            }, 0.06 * i);
        }

        this.listChildFalse = [];
        for (let i = coutMax; i < countNode; i++) {
            this.list_chat.content.children[i].active = false;
            this.listChildFalse.push(this.list_chat.content.children[i]);
        }
        setTimeout(() => {
            cc.log("Scroll To Bottom");
            this.list_chat.scrollToBottom(0.3);
            setTimeout(()=>{
                var scrollEventHandler = new cc.Component.EventHandler();
                scrollEventHandler.target = this.node; //This node is the node to which your event handler code component belongs
                scrollEventHandler.component = "ChatWorldView";//This is the code file name
                scrollEventHandler.handler = "scrollEvent";
                scrollEventHandler.customEventData = "";
                this.list_chat.scrollEvents.push(scrollEventHandler);
            },300)
        }, 60 * coutMax)


    },

    updateChatItem(data) {
        let item = null;
        if (this.listChildFalse.length > 0) {
            item = this.listChildFalse[0];
            this.listChildFalse.splice(0, 1);
        } else {
            item = cc.instantiate(this.item_chat);
            this.list_chat.content.addChild(item);
        }
        item.active = true;
        item.getComponent('ItemChatWorldView').init(data);
        if (data.id_player === require("GameManager").getInstance().user.id) {
            this.list_chat.scrollToBottom(0.3);
        }
        let offSet = this.list_chat.getScrollOffset();
        let maxOffSet = this.list_chat.getMaxScrollOffset();
        let lastItem = this.list_chat.content.children[this.list_chat.content.children.length - 1];
        if (offSet.y > maxOffSet.y - lastItem.height)
            this.list_chat.scrollToBottom(0.3);

    },
    scrollEvent() {
        let offSet = this.list_chat.getScrollOffset();
        let maxOffSet = this.list_chat.getMaxScrollOffset();
        let lastItem = this.list_chat.content.children[this.list_chat.content.children.length - 1];
        if (lastItem) {
            if (offSet.y >= maxOffSet.y - lastItem.height) {
                if (!this._isScolling) {
                    this._isScolling = true;
                    let acMove = cc.moveTo(0.1, this.btn_send.node.position.x, this.btn_send.node.position.y);
                    let acFade = cc.fadeTo(0.1, 0);
                    this.btn_scrollToBot.node.runAction(cc.sequence(cc.spawn(acMove, acFade),
                        cc.callFunc(() => {
                            this._isScolling = false;
                        })));
                }
            } else if (offSet.y < maxOffSet.y - lastItem.height) {
                if(!this._isScolling){
                    this._isScolling=true;
                    let acFade = cc.fadeTo(0.1, 255);
                    let acMove = cc.moveTo(0.1, this.btn_send.node.position.x, this.btn_send.node.position.y + 100)
                    this.btn_scrollToBot.node.runAction(cc.sequence(cc.spawn(acMove, acFade),
                    cc.callFunc(() => {
                        this._isScolling = false;
                    })));
                }
                   
               
            }
        }
    },
    scrollToBot() {
        this.list_chat.scrollToBottom(0.3);
    },
    editText() {
        if (this.edbox.string.length > 0) {
            if (!this.btn_send.interactable)
                this.btn_send.interactable = true;
        } else {
            if (this.btn_send.interactable)
                this.btn_send.interactable = false;
        }
    },
    onClickSend() {
        require('SoundManager1').instance.playButton();
        if (this.edbox.string.length > 0) {
            let str = this.edbox.string;
            str = str.trim();
            require('NetworkManager').getInstance().sendChatWorld(str);
        }
        this.edbox.string = "";
        this.btn_send.interactable = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSend_%s", require('GameManager').getInstance().getCurrentSceneName()));


    },

});

