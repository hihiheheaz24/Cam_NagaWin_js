const GameManager = require('GameManager')
// const NetWorkManager = require('NetworkManager')
const UIManager = require('UIManager')
var GiftView = cc.Class({
    extends: require('PopupEffect'),
    properties: {
        edb_idFriend: {
            default: null,
            type: cc.EditBox
        },
        edb_chip: {
            default: null,
            type: cc.EditBox
        },

        list_friend_view: {
            default: null,
            type: cc.Prefab
        },
        lbFee: cc.RichText,
        historyList: cc.ScrollView,
        tab_Gift: cc.Node,
        tab_History: cc.Node,
        toggle_his: cc.Toggle,
        toggle_gif: cc.Toggle,
        moneyTotal: "0",
        itemHistory: cc.Prefab,

    },
    start() {
    },
    setInfo() {
        this.onPopOn();
        this.toggle_gif.check();
        let fee = require("ConfigManager").getInstance().ketPhe;
        this.lbFee.string = 'Transfering\n<color=#ECF514>  Fee:' + fee + '%</color>'
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.SEND_GIFT_VIEW);
    },
    init(id) {
        this.edb_idFriend.string = id;
    },
    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let _this = this;
        _this.edb_idFriend.string = '';
        _this.edb_chip.string = '';
        this.toggle_gif.isChecked = true;
        this.toggle_his.isChecked = false;
        this.onPopOff();
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },
    onClickSearchFriend() {
        var popupPre = cc.instantiate(this.list_friend_view);
        UIManager.instance.instantiate_parent.addChild(popupPre);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.SEND_GIFT_VIEW);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSearchFriendList_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickSearchId() {
        require('SoundManager1').instance.playButton();
        if (this.edb_idFriend.string !== '') {
            require('NetworkManager').getInstance().sendSearchFriendRequest(this.edb_idFriend.string);
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSearchFriendId_%s", require('GameManager').getInstance().getCurrentSceneName()));
        }
    },
    onClickSendGift() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSendGift_%s", require('GameManager').getInstance().getCurrentSceneName()));
        var toid = this.edb_idFriend.string;
        //var money = '' + this.moneyTotal;
        var money = this.edb_chip.string;
        if (toid == '' || money == '0' || money == '') return;
        require('NetworkManager').getInstance().sendGiftToID(toid, "", money);
        this.edb_chip.string = '';
        this.moneyTotal = 0;
    },
    reloadHistory() {
        let data = require("GameManager").getInstance().list_data_history_safe;
        let item;
        let itemPool = require("UIManager").instance.historyGiftPool;
        for (let i = 0; i < this.historyList.content.children.length; i++) {
            this.historyList.content.children[i].active = false;
        }
        for (let i = 0; i < data.length; i++) {
            let dat = data[i];
            item = this.historyList.content.children[i];
            if (!item) {
                if (itemPool.size() < 1)
                    itemPool.put(cc.instantiate(this.itemHistory));
                item = itemPool.get();
                this.historyList.content.addChild(item);
            }
            item.active = true;
            item.getComponent("ItemHistoryGift").initData(dat.timeday, dat.timehour, dat.content, dat.chipchange)
        }
    },
    onShowNotification(message) {
        require('GameManager').getInstance().onShowConfirmDialog(message);
    },
    onClickTabGift() {
        for (let i = 0; i < this.historyList.content.children.length; i++) {
            this.historyList.content.children[i].active = false;
        }
        cc.NGWlog("Click Tab Gift");
        this.tab_Gift.active = true;
        this.tab_History.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabGift_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickTabHis() {
        cc.NGWlog("Click Tab History");
        require("NetworkManager").instance.onGetHistorySafe();
        this.tab_History.active = true;
        this.tab_Gift.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabHis_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    editBoxTextChanged: function (sender, text) {
        // let strTemp = "";
        // for (let i = 0; i < text.string.length; i++) {
        //     if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
        //         strTemp += text.string.charAt(i)
        //     }
        // }
        // if (strTemp == "") return;
        // this.moneyTotal = parseFloat(strTemp);

        // if (this.moneyTotal >= GameManager.getInstance().user.ag) {
        //     this.moneyTotal = GameManager.getInstance().user.ag;
        // }
        // this.edb_chip.string = require('GameManager').getInstance().formatNumber(this.moneyTotal, 3);
    },
});
module.exports = GiftView;
