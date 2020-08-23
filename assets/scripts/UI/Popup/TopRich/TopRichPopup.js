
const TopData = require('TopData')
cc.Class({
    extends: require("PopupEffect"),

    properties: {

        btnRich: {
            default: null,
            type: cc.Sprite,
            displayName: "Tab Rich"
        },

        btnVip: {
            default: null,
            type: cc.Sprite,
            displayName: "Tab Vip"
        },

        btnFriend: {
            default: null,
            type: cc.Sprite,
            displayName: "Tab Friend"
        },

        listSpriteFrameTab: {
            default: [],
            type: [cc.SpriteFrame]
        },

        listTopRich: {
            default: null,
            type: cc.ScrollView,
        },

        topRichItem: {
            default: null,
            type: cc.Prefab
        },

        arrRich: {
            default: [],
            type: [require('TopData')]
        },

        arrVip: {
            default: [],
            type: [require('TopData')]
        },

        arrFollow: {
            default: [],
            type: [require('TopData')]
        },
        bgTitle: cc.Node,
        arrItem: {
            default: [],
            type: [require('TopRichItem')]
        },
        loadingNode: cc.Node,
        itemPool: null,
        tabCurrent: 0,
        _isFirt: true,
        btnClose: cc.Node,
    },
    receviceData(dat) {
        cc.log("nhan data====== " + JSON.stringify(dat)  );
        this.arrRich = [];
        this._isFirt = false;
        for (let i = 0; i < dat.length; i++) {
            const itemDat = dat[i];
            let topData = new TopData();
            let strName = itemDat.NLQ;
            if (strName === "" || typeof strName === 'undefined')
                strName = itemDat.N;
            topData.name = strName;
            topData.chip = itemDat.M;
            topData.av = itemDat.Av;
            topData.vip = itemDat.V;
            topData.id = itemDat.Id;
            topData.fid = itemDat.Faid;
            topData.status = itemDat.status;
            if (topData.status === "" || typeof topData.status == 'undefined') {
                topData.status = "...";
            }
            this.arrRich.push(topData);
        }
        this.scheduleOnce(() => {
            this.loadingNode.active = false;
            this.updateList();
        }, 0.5)

    },
    receviceDataFolowList(dat) {
        this.arrFollow = [];
        for (let i = 0; i < dat.length; i++) {
            const itemDat = dat[i];
            let topData = new TopData();
            topData.name = itemDat.friendname;
            topData.chip = itemDat.currentgold;
            topData.av = itemDat.avatar;
            topData.vip = itemDat.vip;
            topData.id = itemDat.friendid;
            topData.fId = itemDat.fid;
            topData.status = itemDat.status;
            if (topData.status === "" || typeof topData.status === 'undefined') {
                topData.status = "...";
            }
            this.arrFollow.push(topData);
        }
    },
    receviceDataFolow(jsonData) {
        var itemDat = JSON.parse(jsonData.data);
        Global.FriendPopView.addFriend(itemDat);
        Global.FriendProfilePop.updateState(true);
        if (this.node.getParent() !== null) {
            if (this.arrFollow.length !== 0) {
                let followData = new TopData();
                followData.name = itemDat.friendname;
                followData.chip = itemDat.currentgold;
                followData.av = itemDat.avatar;
                followData.vip = itemDat.vip;
                followData.id = itemDat.friendid;
                followData.fId = itemDat.fid;
                followData.status = itemDat.status;
                if (followData.status === "" || typeof followData.status == 'undefined') {
                    followData.status = "...";
                }
                this.arrFollow.push(followData);
            }
        }
    },


    onRelease: function () {
        // TopRichPopup.instance = null;
        //  console.clear();
    },
    onClose() {
        this.unscheduleAllCallbacks();
        require('SoundManager1').instance.playButton();
        this.listTopRich.scrollToTop();
        this.onPopOff();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        let length = this.listTopRich.content.childrenCount;
        for (let i = 0; i < length; i++) {
            this.listTopRich.content.children[i].active = false;
        }
    },
    onIn() {
        this.onPopOn();
    },
    resetOnLogOut() {
        this._isFirt = true;
        this.unscheduleAllCallbacks();
        let length = this.listTopRich.content.childrenCount;
        for (let i = 0; i < length; i++) {
            this.listTopRich.content.children[i].active = false;
        }
    },
    // LIFE-CYCLE CALLBACKS:


    onEnable() {
        if (this._isFirt) {
            this.loadingNode.active = true;
            require('NetworkManager').getInstance().sendTopRichRequest();
        } else {
            this.scheduleOnce(() => {
                let length = this.listTopRich.content.childrenCount;
                for (let i = 0; i < length; i++) {
                    this.scheduleOnce(() => {
                        this.listTopRich.content.children[i].active = true;
                    }, 0.13 * i)
                }
                this.btnClose.active = true;

            }, 0.5)

        }
        this.tabCurrent = 0;

    },

    // update (dt) {},

    //**Method
    updateList: function () {
        cc.NGWlog('Start update list');
        this.btnClose.active = false;
        if (this.listTopRich === null) return;
        var arrUpdate = [];
        if (this.tabCurrent === 0) {
            arrUpdate = this.arrRich;
        } else if (this.tabCurrent === 1) {
            arrUpdate = this.arrVip;
            arrUpdate.sort(function (a, b) { return b.vip - a.vip; });
        } else {
            arrUpdate = this.arrFollow;
            arrUpdate.sort(function (a, b) { return b.chip - a.chip; });
        }
        cc.NGWlog('arrSize=' + arrUpdate.length);

        if (this.itemPool == null) {
            this.itemPool = require('UIManager').instance.topRichPool
        }
        let length = 10;
        this.curListData = arrUpdate;
        let scrViewct = this.listTopRich.content;
        let scrViewctChildren = scrViewct.children;
        if (this.curListData.length < 10) {
            length = this.curListData.length;
        }
        var i, j;
        for (i = 0; i < length; i++) {
            const itemData = arrUpdate[i];
            let item = scrViewctChildren[i];
            if (typeof item === 'undefined' || item === null) {
                if (this.itemPool.size() < 1) this.itemPool.put(cc.instantiate(this.topRichItem));
                item = this.itemPool.get();
                this.scheduleOnce(() => {
                    scrViewct.addChild(item);

                }, 0.13 * i);
            }
            this.scheduleOnce(() => {
                item.active = true;
            }, 0.13 * i);
            let itemCompoment = item.getComponent('TopRichItem');
            let data = {};
            data.rank = i + 1;
            data.name = itemData.name;
            data.Av = itemData.av
            data.Chip = itemData.chip;
            data.Vip = itemData.vip;
            data.Id = itemData.id;
            data.fid = itemData.fid;
            data.status = "";
            data.isFriend = this.checkFollowed(itemData.name);
            itemCompoment.init(data);
        }

        let lengtScrView = scrViewctChildren.length;
        for (j = length; j < lengtScrView; j++) {
            scrViewctChildren[j].active = false;
        }

        this.scheduleOnce(() => {
            this.btnClose.active = true; // truong` hop mat mang.
        }, 1.3)
        //   this.listTopRich.scrollToTop(0.01);
    },


    checkFollowed: function (name) {
        if (name === '' || typeof name != 'string') return;
        let length = Global.FriendPopView._listFriends.length
        for (let i = 0; i < length; i++) {
            if (Global.FriendPopView._listFriends[i].name === name) {
                return true;
            }
        }
        return false;
    },

    outFunction: function () {
        this.onRelease();
    },

    //**Ref
    onClickRich: function () {
        require('SoundManager1').instance.playButton();
        this.tabCurrent = 0;
        this.btnRich.spriteFrame = this.listSpriteFrameTab[0];
        this.btnVip.spriteFrame = null;
        this.btnFriend.spriteFrame = null;

        this.updateList();
        this.listTopRich.scrollToTop();
        //    this.scollEvent();
    },

    onClickVip: function () {
        require('SoundManager1').instance.playButton();
        this.tabCurrent = 1;
        this.btnRich.spriteFrame = null;
        this.btnVip.spriteFrame = this.listSpriteFrameTab[0];
        this.btnFriend.spriteFrame = null;

        //*List

        this.updateList();
        this.listTopRich.scrollToTop();
        //  this.scollEvent();
    },

    onClickFriend: function () {
        require('SoundManager1').instance.playButton();
        this.tabCurrent = 2;
        this.btnRich.spriteFrame = null;
        this.btnVip.spriteFrame = null;
        this.btnFriend.spriteFrame = this.listSpriteFrameTab[0];
        this.updateList();
        this.listTopRich.scrollToTop();
        //    this.scollEvent();
    },
    onPutBackPool() {
        for (let i = 0; i < this.listTopRich.content.children.length; i++) {
            require('UIManager').instance.topRichPool.put(this.listTopRich.content.children[i]);
        }
    },
    onDeleteFriend(id_fr) {
        if (this.tabCurrent !== 2) return;
        for (let i = 0; i < this.listTopRich.content.children.length; i++) {
            let item = this.listTopRich.content.children[i].getComponent('TopRichItem');
            if (item.id === id_fr) {
                item.node.removeFromParent();
                item.node.destroy();
            }
            for (let i = 0; i < this.arrFollow.length; i++) {
                if (this.arrFollow[i].id === id_fr) this.arrFollow.splice(i, 1);
            }
        }
        this.updateList();
    },
    scollEvent() {
        for (let i = 0; i < this.curListSize; i++) {
            this.listTopRich.content.children[i].active = true;
        }
       // this.listTopRich.content.getComponent(cc.Widget).enable = false;
    }

});
