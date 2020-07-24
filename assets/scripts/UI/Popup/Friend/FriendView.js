const GameManager = require('GameManager')
const FriendData = require('FriendData')
cc.Class({
    extends: require('PopupEffect'),

    properties: {
        list_view: {
            default: null,
            type: cc.ScrollView
        },
        item_search: {
            default: null,
            type: cc.Prefab
        },

        item_mess: {
            default: null,
            type: cc.Prefab
        },

        item_info_fr: {
            default: null,
            type: cc.Prefab
        },
        gift_view: {
            default: null,
            type: cc.Prefab
        },
        _listFriends: [],
        isChecked: false,
        btn_del_friend: cc.Button,
        btn_CheckAll: cc.Button,
        btn_shareCode: cc.Button,
        lb_share_code: cc.Label,
        nodeSearch: cc.Node,

    },
    receviceData(dat) {
        this._listFriends = [];
        for (let i = 0; i < dat.length; i++) {
            const itemDat = dat[i];
            this.addFriend(itemDat);
        }
    },
    addFriend(itemDat) {
        let fData = new FriendData();
        fData.id = itemDat.id;
        fData.name = itemDat.friendname;
        fData.vip = itemDat.vip;
        fData.idFriend = itemDat.friendid;
        fData.isOnline = itemDat.isonline;
        fData.agFriend = itemDat.currentgold;
        fData.idAva = itemDat.avatar;
        fData.idTable = itemDat.tableid;
        fData.status = itemDat.status;
        fData.fid = itemDat.fid;
        fData.gameid = itemDat.gameid;
        this._listFriends.push(fData);
    },

    resetStateBtnCheckAll() {
        this.isChecked = false;
        this.btn_CheckAll.node.getChildByName("icCheck").active = false;
    },
    setInfo() {
        this.btn_shareCode.node.active = require("GameManager").getInstance().ismaiv;
        this.lb_share_code.node.active = require("GameManager").getInstance().ismaiv;
        this.btn_del_friend.interactable = false;
        this.unscheduleAllCallbacks();
        this.list_view.content.removeAllChildren();
        setTimeout(() => {
            this.init();
        }, 500);
        this.onPopOn();

    },
    init() {
        cc.NGWlog('chay vao init!');
        this.btn_CheckAll.getComponentInChildren(cc.Label).string = GameManager.getInstance().getTextConfig('check_all');
        //  this.friendViewPool = require('UIManager').instance.friendViewPool;
        let listData = this._listFriends;
        this.dataSize = listData.length;
        let parent = this.list_view.content;
        for (let i = 0; i < this.dataSize; i++) {
            let item = parent.children[i];
            let isAddChild = false;
            if (!item) {
                // if (this.friendViewPool.size() < 1) {
                //     this.friendViewPool.put(cc.instantiate(Global.ItemFriend.node));
                // }
                // item = this.friendViewPool.get();
                item = cc.instantiate(Global.ItemFriend.node);
                item.active = false;
                isAddChild = true;
            }
            this.scheduleOnce(() => {
                if (isAddChild)
                    parent.addChild(item);
                item.active = true;
            }, 0.13 * i)
            let data = listData[i];
            var _name = data.nameLQ.length > 0 ? data.nameLQ : data.name;
            item.getComponent('ItemFriendView').init(i, data.idAva, _name, data.vip, data.agFriend, data.idFriend, data.fid);
            item.getComponent('ItemFriendView').btn_check.isChecked = false;
            item.getComponent('ItemFriendView')._isRemove = false;
        }
        for (let i = this.dataSize; i < parent.children.length; i++) {
            parent.children[i].active = false;
            //this.friendViewPool.put(parent.children[i]);
        }
        this.btn_CheckAll.isChecked = false;
        this.resetStateBtnCheckAll();
        if (this.dataSize < 1) this.btn_CheckAll.interactable = false;
    },
    onDeleteItem() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDelItem_%s", require('GameManager').getInstance().getCurrentSceneName()));
        for (let j = 0; j < this.list_view.content.childrenCount; j++) {
            let item = this.list_view.content.children[j].getComponent('ItemFriendView');
            if (item.onRemove()) {
                j--;
            }

        }
        this.updateStateBtnDel();
        this.resetStateBtnCheckAll();
        this.list_view.scrollToTop();
    },
    onClose() {
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        let length = this.list_view.content.childrenCount;
        for (let i = 0; i < length; i++) {
            this.list_view.content.children[i].active = false;
        }
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },

    onClickAdd() {
        require('SoundManager1').instance.playButton();
        var item = cc.instantiate(this.item_search).getComponent('SearchFriendView');
        this.node.addChild(item.node);
        item.btn_listFriend.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAdd_%s", require('GameManager').getInstance().getCurrentSceneName()));


    },

    showMess(id, name) {
        require('SoundManager1').instance.playButton();
        var item = cc.instantiate(this.item_mess).getComponent('MailViewMessage');
        item.initData(id, name);
        this.node.addChild(item.node, 101);
    },
    showGiftpop(id) {
        if (Global.GiftView.node.getParent() !== null) {
            var item = cc.instantiate(this.gift_view);
        }
        else {
            var item = Global.GiftView.node;
        }
        this.node.addChild(item);
        item.getComponent('GiftView').init(id);
        item.getComponent('GiftView').setInfo();
    },

    onClickCheckAll() {
        this.isChecked = !this.isChecked
        this.btn_CheckAll.node.getChildByName("icCheck").active = this.isChecked;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCheckAll_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let length = this.list_view.content.childrenCount;
        cc.log("chay vao checkall")
        for (let j = 0; j < length; j++) {
            let item = this.list_view.content.children[j].getComponent('ItemFriendView');
            if (item._isRemove == !this.isChecked) {
                // item.btn_check.toggle();
                if (this.isChecked) {
                    item.btn_check.check();
                } else item.btn_check.uncheck();
            }
        }
        this.updateStateBtnDel();

    },
    updateStateBtnDel() {
        let length = this.list_view.content.childrenCount;
        for (let j = 0; j < length; j++) {
            let item = this.list_view.content.children[j].getComponent('ItemFriendView');
            if (item._isRemove == true) {
                this.btn_del_friend.interactable = true;
                return;
            }
        }
        this.btn_del_friend.interactable = false;
    },
    onClickShare() {
        // onTakeScreenShot
        // require('Util').shareCodeMessage(require('GameManager').getInstance().user.id);
        require('Util').shareCodeMessage(require('GameManager').getInstance().getTextConfig('txt_sharesms') + require('GameManager').getInstance().user.id);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShareCodeSms_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

});
