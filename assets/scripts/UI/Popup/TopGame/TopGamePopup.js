const GameManager = require('GameManager')
var LISTSPRBTN = {
    9009: 0,
    8802: 1,
    8808: 2,
    8804: 3
}
cc.Class({
    extends: require("PopupEffect"),
    // name: TopGamePopup
    properties: {
        lbTitle: {
            default: null,
            type: cc.Label
        },

        listTopGame: {
            default: null,
            type: cc.ScrollView,
        },

        itemGame: {
            default: null,
            type: cc.Prefab
        },
        lbTimerEnd: {
            default: null,
            type: cc.Label
        },
        _rank_list: [],
        _show_list: [],
        itemPool: null,
        _countTopGame: 0,
        listSprBtnTop: [cc.SpriteFrame],
        btnScroll: cc.ScrollView,
        nodeLoad: cc.Node,
        nodeMe: cc.Node,
        myItem: null,
    },
    onLoad() {
        this.nextTopGame = 0;
        this.curIndex = 0;
        this.isUpdatingList = false;
        this.genListBtnTop();
    },
    receiveData(data) {

    },
    onEnable() {
        this.node.stopAllActions();
    },
    onDisable() {
        this.node.stopAllActions();
        this.isUpdatingList = false;
    },
    onMoveIn(gameid = 0) {
        this.onMoveUp();
        this.nodeMe.active = false;
        let listRankGame = require("ConfigManager").getInstance().listRankGame;
        this.nodeLoad.active = true;
        setTimeout(() => {
            if (this.nodeLoad.active === true) {
                this.nodeLoad.active = false;
            }
        }, 10000);
        if (listRankGame.length > 0) {
            if(gameid === 0){
                setTimeout(() => {
                    this.onClickTop(listRankGame[0].gameid);
                }, 500);
            }
            else{
                setTimeout(() => {
                    this.onClickTop(gameid);
                }, 500);
            }
           
        }
        this.listTopGame.scrollToTop(0.1);
    },
    updateList(list) {
        let i = 0;
        let size = list.length;
        for (i; i < 20; i++) {
            let item = this.listTopGame.content.children[i];
            if (!item) {
                item = cc.instantiate(this.itemGame);
                this.listTopGame.content.addChild(item);
            }
            item = item.getComponent("TopGameItem");
            item.init(list[i]);
            if (list[i].Id === require("GameManager").getInstance().user.id) {
                this.myItem = item;
            }
            if (i === 19) {
                setTimeout(() => {
                    this.isUpdatingList = false;
                    this.nodeLoad.active = false;
                }, 1500);
            }
        }
        let dataMe = list.slice().pop();
        this.nodeMe.getComponent("TopGameNodeMe").init(dataMe);
        this.nodeMe.active = true;
    },
    resetOnLogOut() {
        this.listTopGame.content.destroyAllChildren();
    },
    onBack() {
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('GameManager').getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        let length = this.listTopGame.content.childrenCount;
        for (let i = 0; i < length; i++) {
            this.listTopGame.content.children[i].active = false;
        }
        this.curIndex = 0;
        this.isUpdatingList = false;
        require("GameManager").getInstance().isGettingTopGameId = false;
        this.listTopGame.content.destroyAllChildren();
    },
    genListBtnTop() {
        let listRankGame = require("ConfigManager").getInstance().listRankGame;
        for (let i = 0; i < listRankGame.length; i++) {
            let btnNode = new cc.Node(listRankGame[i].gameid.toString());
            let sprBtn = btnNode.addComponent(cc.Sprite);
            sprBtn.trim = false;
            let indexSpr = LISTSPRBTN[listRankGame[i].gameid];
            let lbName = new cc.Node("lbName").addComponent(cc.Label);
            lbName.string = require('GameManager').getInstance().getTextConfig(listRankGame[i].gameid.toString());
            lbName.fontSize = 25;
            lbName.node.y = -10;
            btnNode.addChild(lbName.node);
            if (typeof indexSpr === "undefined")
                indexSpr = 3;
            sprBtn.spriteFrame = this.listSprBtnTop[indexSpr];
            this.btnScroll.content.addChild(btnNode);
            btnNode.on("touchend", () => { this.onClickTop(listRankGame[i].gameid) });
        }
    },
    onClickTop(gameId) {
        if (this.isUpdatingList) return;
        this.isUpdatingList = true;
        this.listTopGame.scrollToTop(0.3);
        require('NetworkManager').getInstance().getTopGameNew(gameId, 0);
        this.nodeLoad.active = true;
        setTimeout(() => {
            if (this.nodeLoad.active === true) {
                this.nodeLoad.active = false;
            }
        }, 10000);
        for (let i = 0; i < this.btnScroll.content.childrenCount; i++) {
            this.btnScroll.content.children[i].scale = 1.0;
            this.btnScroll.content.children[i].color = cc.Color.GRAY;
            if (this.btnScroll.content.children[i].name === gameId.toString()) {
                this.btnScroll.content.children[i].scale = 1.1;
                this.btnScroll.content.children[i].color = cc.Color.WHITE;
            }
        }
    },
    scrollEvent(scrollview, eventType, customEventData) {
        if (!this.myItem) return;

        let mypos = this.myItem.node.position;
        mypos = this.listTopGame.content.convertToWorldSpaceAR(mypos);
        mypos = this.node.getChildByName("node_topgame").convertToNodeSpaceAR(mypos);

        if (mypos.y < 250 && mypos.y > -226) {
            this.nodeMe.active = false;
        } else
            this.nodeMe.active = true;

    },
    // update (dt) {},
});
