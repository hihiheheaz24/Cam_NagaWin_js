const GameManager = require('GameManager');

cc.Class({
    extends: require("PopupEffect"),

    properties: {
        spReward: {
            default: null,
            type: cc.Sprite
        },

        listView: {
            default: null,
            type: cc.ScrollView
        },

        lbTitle: {
            default: null,
            type: cc.Label
        },

        bg_user: {
            default: null,
            type: cc.Node
        },

        userAvatar: {
            default: null,
            type: cc.Sprite
        },

        userLbMoney: {
            default: null,
            type: cc.Label
        },

        userLbName: {
            default: null,
            type: cc.Label
        },

        userLbRank: {
            default: null,
            type: cc.Label
        },

        itemVip: {
            default: [],
            type: [cc.Sprite],
        },

        listIconVip: {
            default: [],
            type: [cc.SpriteFrame]
        },

        listData: {
            default: null,
            visible: false
        },
        topRichItem: {
            default: null,
            type: cc.Prefab
        },
        itemPool: {
            default: null,
            visible: false
        },
        myItem: {
            default: null,
            visible: false
        },
        lbTimerEnd: {
            default: null,
            type: cc.Label
        },
        remain_times: {
            default: null,
            visible: false
        },

        fId: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    onEnable() {

    },
    start() {

    },

    init(data) {
        this.onMoveUp();
        if (!data || data === undefined) return;
        this.listData = data;
        if (this.listData.name)
            this.lbTitle.string = this.listData.name;
        else
            this.lbTitle.string = require('GameManager').getInstance().getTextConfig(this.listData[0].Gameid)
        this.updateList();
        cc.NGWlog('TOP DATA', data);
        var scrollViewEventHandler = new cc.Component.EventHandler();
        scrollViewEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
        scrollViewEventHandler.component = "TopListPopup"; // This is the code file name
        scrollViewEventHandler.handler = "scrollEvent";
        scrollViewEventHandler.customEventData = null;

        var scrollview = this.listView;
        scrollview.scrollEvents.push(scrollViewEventHandler);
        var listTopGamerData = require("ConfigManager").getInstance().listRankGame;
        // cc.NGWlog('URL LINK', listTopGamerData[0].url_img_js);
        for (let i = 0; i < listTopGamerData.length; i++) {
            if (listTopGamerData[i].gameid === this.listData[0].Gameid) {
                GameManager.getInstance().loadTextureFromUrl(this.spReward, listTopGamerData[i].url_img);
                this.spReward.node.width = 392;
                this.spReward.node.height = 650;
            }
        }
    },

    scrollEvent(scrollview, eventType, customEventData) {
        if (!this.myItem) return;

        let mypos = this.myItem.position;
        mypos = this.listView.content.convertToWorldSpaceAR(mypos);
        mypos = Global.TopListView.node.convertToNodeSpaceAR(mypos);

        if (mypos.y < 240 && mypos.y > -250) {
            this.bg_user.active = false;
        } else
            this.bg_user.active = true;

    },

    updateList() {
        let listContent = this.listView.content;
        this.listView.scrollToTop(0.1);
        if (this.itemPool == null) {
            this.itemPool = require('UIManager').instance.topRichPool;
        }
        // cc.NGWlog('LIST DATA LENGTH', this.listData.length);
        for (let index = 0; index < this.listData.length; index++) {
            let itemRich = listContent.children[index];
            if (!itemRich) {
                if (this.itemPool.size() < 1) this.itemPool.put(cc.instantiate(this.topRichItem));
                itemRich = this.itemPool.get();
                this.scheduleOnce(() => {
                    listContent.addChild(itemRich);
                }, 0.13 * index);
                itemRich.width = this.listView.node.width;
            }
            if (!itemRich.active) {
                this.scheduleOnce(() => {
                    itemRich.active = true;
                }, 0.13 * index);
            }
            let itemComponent = itemRich.getComponent('TopRichItem');
            itemComponent.btnFriend.node.active = false;
            let data = {};
            data.rank = this.listData[index].R;
            data.name = this.listData[index].N;
            data.Av = this.listData[index].Av;
            data.Chip = this.listData[index].M;
            data.Vip = this.listData[index].V;
            data.Id = this.listData[index].Id;
            data.fid = this.listData[index].Faid;
            data.isFriend = false;
            //itemComponent.init(this.listData[index].R, this.listData[index].N, this.listData[index].Av, this.listData[index].M, this.listData[index].V, this.listData[index].Id, this.listData[index].Faid, '');
            itemComponent.init(data);
            if (this.listData[index].Id === GameManager.getInstance().user.id && !this.setPlayer) {
                this.myItem = itemRich;
                this.setUserData(this.listData[index]);
            } else if (this.listData[index].Id === GameManager.getInstance().user.id && this.setPlayer) {
                itemRich.active = false;
            }
        }
        let length = this.listData.length;
        let listLength = listContent.children.length;
        for (let j = length; j < listLength; j++) {
            listContent.children[j].active = false;
        }
    },

    setUserData(playerData) {
        this.setPlayer = true;
        //User data
        //-Avatar
        let avtId = GameManager.getInstance().user.avtId;
        let vip = GameManager.getInstance().user.vip;
        this.userAvatar.node.getComponent("AvatarItem").loadTexture(avtId, playerData.N, playerData.Faid,vip);
        let name = playerData.N;
        if (name.length > 12) {
            name = name.substring(0, 12) + '...';
        }
        this.userLbName.string = name;
        //-Money
        this.userLbMoney.string = GameManager.getInstance().formatNumber(playerData.M);
        //-Rank
        this.userLbRank.string = playerData.R;
        if (playerData.R === 1) {
            this.userLbName.node.color = cc.Color.YELLOW;
            this.userLbMoney.node.color = cc.Color.YELLOW;
        }
        //-Vip
        this.updateVip(playerData.V);
    },

    updateVip(Vipuser) {
        let vip = Vipuser;
        if (vip >= 10) {
            vip = 10;
        }
        let vip1 = Math.floor(vip / 2);
        let vip2 = vip % 2;

        for (let i = 0; i < this.itemVip.length; i++) {
            if (i + 1 <= vip1) {
                this.itemVip[i].spriteFrame = this.listIconVip[2];
            } else if (vip2 != 0) {
                vip2 = 0;
                this.itemVip[i].spriteFrame = this.listIconVip[1];
            } else {
                this.itemVip[i].spriteFrame = this.listIconVip[0];
            }
        }
    },

    onBack() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, false);
        if (!require("GameManager").getInstance().isGettingTopGameId) {
            require('UIManager').instance.onShowTopGame();
        }
        require("GameManager").getInstance().isGettingTopGameId = false;
        let length = this.listView.content.childrenCount;
        for (let i = 0; i < length; i++) {
            this.listView.content.children[i].active = false;
        }
    },

    // update (dt) {},
});