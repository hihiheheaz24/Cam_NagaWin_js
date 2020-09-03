const FriendData = require("FriendData");
var InvitePlayerInTable = cc.Class({
    extends: require("PopupEffect"),

    properties: {
        listView: {
            default: null,
            type: cc.ScrollView
        },

        item_invite: {
            default: null,
            type: cc.Prefab
        },

        data_list: {
            default: [],
            type: [FriendData]
            
        },
        bg_mask: cc.Node,

        ag_table: 0
    },

    statics: {
        instance: null
    },
    
    receiveData(data){
        this.data_list = [];

        for (var i = 0; i < data.length; i++) {
            var item = new FriendData();
            item.name = data[i].N;
            item.idFriend = data[i].Id;
            item.idAva = data[i].Avatar;
            item.agFriend = data[i].AG;
            item.vip = data[i].V;
            this.data_list.push(item);
        }
        this.reloadList();
    },
    onLoad() {
        this.node.zIndex=200;
    },
    setInfo() {
        this.onPopOn();
        InvitePlayerInTable.instance = this;
        this.node.setContentSize(cc.winSize);
        //this.bg_mask.setContentSize(cc.winSize);
    },

    onClose() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickCloseInvite_%s", require('GameManager').getInstance().getCurrentSceneName()));
        InvitePlayerInTable.instance = null;
        this.onPopOff(false);
        require("GameManager").getInstance().curGameViewId = parseInt(require("GameManager").getInstance().curGameId);
        require("GameManager").getInstance().setCurView(require("GameManager").getInstance().curGameViewId);
        // setTimeout(() => {
        //     this.node.destroy();
        // }, 0.3);
    },

    onClickRefresh(event, data) {
        require('SoundManager1').instance.playButton();
        if(data == 1)
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickRefresh_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('NetworkManager').getInstance().getInviteTableList(this.ag_table);
        this.reloadList();
    },

    delItem(index) {
        require('SoundManager1').instance.playButton();
        if (this.listView.content.children.length > index) {
            this.listView.content.children[index].active = false;
        }
    },

    onClickInviteAll() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickInviteAll_%s", require('GameManager').getInstance().getCurrentSceneName()));
        for (var i = 0; i < this.data_list.length; i++) {
            require('NetworkManager').getInstance().sendInviteTable(this.data_list[i].idFriend, this.ag_table);
            this.delItem(i);
        }
    },

    init (chip) {
        this.ag_table = require('GameManager').getInstance().table_mark;
        this.onClickRefresh();
    },

    reloadList() {
        let item;
        let data = this.data_list;
        let contentList = this.listView.content.children;
        for (var i = 0; i < data.length; i++) {
            cc.NGWlog("datalist1=" + data.length);
            item = contentList[i];
            if (!item) {
                item = cc.instantiate(this.item_invite).getComponent('ItemInviteInTable');
                this.listView.content.addChild(item.node);
            } else item.active = true;

            item.getComponent("ItemInviteInTable").init(i, this.ag_table, data[i]);
        }
        for (let i = data.length; i < contentList.length; i++) {
            cc.NGWlog("datalist2=" + data.length);
            contentList[i].active = false;
        }

    },

});
module.exports = InvitePlayerInTable;