const GameManager = require('GameManager')
cc.Class({
    extends: cc.Component,
    // name: "LobbyView",

    properties: {
        btn_back: {
            default: null,
            type: cc.Button
        },

        btn_tab_rich: {
            default: null,
            type: cc.Sprite
        },
        btn_tab_player: {
            default: null,
            type: cc.Sprite
        },
        listFrameBtnTab: {
            default: [],
            type: [cc.SpriteFrame]
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },

        listViewPlayer: {
            default: null,
            type: cc.ScrollView
        },

        btn_rank: {
            default: null,
            type: cc.Button
        },

        btn_setting: {
            default: null,
            type: cc.Button
        },

        btn_create: {
            default: null,
            type: cc.Button
        },

        btn_play_now: {
            default: null,
            type: cc.Button
        },

        edt_box: {
            default: null,
            type: cc.EditBox
        },

        // btn_search_table: {
        //     default: null,
        //     type: cc.Button
        // },

        item_create_prefab: {
            default: null,
            type: cc.Prefab
        },
        item_checkpass_prefab: {
            default: null,
            type: cc.Prefab
        },
        lb_GameName: {
            default: null,
            type: cc.Label
        },
        vip_create_table: 11,
        mark_room_rich: 0,
        chip_room_vip: 0,
        cur_tab: 0,
        isShowBest: false,
        itemBetPool: null,
        dialogIVP: null,
        isFirt: true,
        ltv_data_list: [],
        room_vip_list: [],
        isReconnectGame: false,
    },
    recivceData(jsonData) {
        let key = cc.js.formatStr("ltv_%d", require('GameManager').getInstance().curGameId);
        cc.sys.localStorage.setItem(key, jsonData.data);
        let data = JSON.parse(jsonData.data);
        this.ltv_data_list = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].mark) {
                let item = {
                    name: "ltvData"
                };
                item.maxAgCon = data[i].maxAgCon;
                item.mark = data[i].mark;
                item.chip_require = data[i].minAgCon;
                item.cur_user = data[i].currplay;
                item.ag = data[i].ag;
                this.ltv_data_list.push(item);
            }
        }
        if (require('GameManager').getInstance().currentView == CURRENT_VIEW.LOBBY) {
            require("UIManager").instance.onHideLoad();
        }
        this.reuse();
        require('NetworkManager').getInstance().sendPromotionInfo();
    },
    recivceDataRoomVip(jsonData) {
        let keyJS = cc.js.formatStr("roomVip_%d", GameManager.getInstance().curGameId);
        cc.sys.localStorage.setItem(keyJS, jsonData.data);
        let roomVipData = JSON.parse(jsonData.data);
        this.room_vip_list = [];
        for (let i = 0; i < roomVipData.length; i++) {
            // var item = new LtvData();
            let itemVip = {
                name: "RoomVipData"
            };

            itemVip.mark = roomVipData[i].mark;
            itemVip.player = roomVipData[i].player;
            itemVip.chip_require = roomVipData[i].minAgCon;
            itemVip.table_id = roomVipData[i].id;
            itemVip.isPrivate = roomVipData[i].isPrivate;
            this.room_vip_list.push(itemVip);
        }
        //Global.LobbyView.cur_tab = 0;
        this.loadDataListView();
    },
    onLoad() {
        this.curMarkVip = 0;
        this.indexSprVip = 0;
    },
    // onStart(){
    // },
    onEnable() {
        Global.MainView._isClickGame = false;
        cc.log("nmAg=" + GameManager.getInstance().user.nmAg + "==countMailAg===" + Global.FreeChipView.countMailAg);
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.showPopupWhenLostChip();
        }, 500);
    },
    onDisable() {

    },
    setInfo() {
        this.updateChip();
        this.btn_create.getComponentInChildren(cc.Label).string = GameManager.getInstance().getTextConfig('txt_create_table');
        this.lb_GameName.string = GameManager.getInstance().getTextConfig(GameManager.getInstance().curGameId);
        let length = require('ConfigManager').getInstance().listGameIp.length;

        cc.log('================>>> curGameid ======  ' + GameManager.getInstance().curGameId)
        for (var i = 0; i < length; i++) {
            var svip = require('ConfigManager').getInstance().listGameIp[i];
            if (svip.gameid === GameManager.getInstance().curGameId) {
                this.vip_create_table = svip.vip
                this.chip_room_vip = svip.agSvipMin
                break;
            }
        }


        if (GameManager.getInstance().user.ag < this.chip_room_vip) {
            cc.log('dmmmmm vafo dday ko');
            this.cur_tab = 1;
            this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[1];
            this.btn_tab_player.spriteFrame = this.listFrameBtnTab[0];
            this.loadDataListView();
        }
        else {
            cc.log('dmmmmm vafo dday ko 2');
            this.cur_tab = 0;
            this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[0];
            this.btn_tab_player.spriteFrame = this.listFrameBtnTab[1];
            require('NetworkManager').getInstance().sendRomVip();
            this.loadDataListView();
        }

        if (GameManager.getInstance().user.vip < this.vip_create_table)
            this.btn_create.interactable = false;
        else
            this.btn_create.interactable = true;

        // get edit box text
        var textFind = GameManager.getInstance().getTextConfig('txt_FindRoom').replace('...', '');
        this.edt_box.placeholder = textFind;
    },

    showPopupWhenLostChip(isBackFromGame = false, isChooseGame = false) {
        cc.log("LOBBYVIEW:SHOW POPUP LOST CHIP");
        if (require("GameManager").getInstance().currentView == CURRENT_VIEW.LOGIN_VIEW) return;
        let money = GameManager.getInstance().user.ag;
        if (money <= 0) {
            let isInGame = false;
            if (require("GameManager").getInstance().gameView != null && !isBackFromGame) isInGame = true;
            let typeBTN = isInGame ? DIALOG_TYPE.ONE_BTN : DIALOG_TYPE.TWO_BTN;
            let textShow = GameManager.getInstance().getTextConfig("has_mail_show_gold");
            let textBtn1 = GameManager.getInstance().getTextConfig("txt_free_chip");
            let textBtn2 = GameManager.getInstance().getTextConfig("shop");
            let textBtn3 = GameManager.getInstance().getTextConfig("label_cancel");
            if (isInGame) {
                textShow = textShow.split(",")[0];
                textBtn1 = textBtn3;
                textBtn2 = textBtn3;
            }
            if (isChooseGame) textShow = GameManager.getInstance().getTextConfig("txt_not_enough_money_gl");
            if (GameManager.getInstance().user.nmAg > 0 || Global.FreeChipView.countMailAg > 0 || GameManager.getInstance().promotionInfo.adminMoney > 0 || GameManager.getInstance().promotionInfo.online > 0) {
                GameManager.getInstance().onShowWarningDialog(
                    textShow,
                    typeBTN,
                    textBtn1,
                    () => {
                        if (!isInGame)
                            require('UIManager').instance.onShowFreeChip();
                    },
                    textBtn2,
                    () => {
                        if (!isInGame)
                            require('UIManager').instance.onShowShop();
                    },
                );
            } else {
                textShow = GameManager.getInstance().getTextConfig("txt_not_enough_money_gl");
                require('GameManager').getInstance().onShowWarningDialog(
                    textShow,
                    typeBTN,
                    textBtn2,
                    () => {
                        if (!isInGame) {
                            require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
                            require('UIManager').instance.onShowShop();
                        }
                    },
                    textBtn3
                );
            }
        }
    },
    updateChip() {
        cc.NGWlog('chay vao day nao e oi');
        let money = GameManager.getInstance().user.ag
        this.lb_chip.string = GameManager.getInstance().formatNumber(money);
        this.loadDataListView();
    },

    loadDataListView() {
        if (this.listViewPlayer === null) return;
        let indexBet = 0;
        let arrListRoom = [];
        let count = 0;
        let lisLTV = this.ltv_data_list;
        let listVip = this.room_vip_list;
        if (this.itemBetPool === null) {
            this.itemBetPool = require('UIManager').instance.lobbyItemPool
        }
        let agPLayer = GameManager.getInstance().user.ag;
        let scrollView = this.listViewPlayer;
        let parent = scrollView.content;
        var viewChidlren = parent.children;
        if (this.cur_tab === 1) {
            arrListRoom = lisLTV;
        };
        if (this.cur_tab === 0) {
            arrListRoom = listVip;
        };
        let lengt = arrListRoom.length;
        for (var i = 0; i < lengt; i++) {
            var ltv_data = arrListRoom[i];

            let item = viewChidlren[i];
            if (item == null || typeof item == 'undefined') {
                // if (this.itemBetPool < 1) this.itemBetPool.put(cc.instantiate(Global.ItemLobby.node));
                item = cc.instantiate(Global.ItemLobby.node)
                parent.addChild(item);
            }
            item.active = true;
            let itemCompoment = item.getComponent('ItemBetRoomView');
            if (typeof ltv_data.chip_require == 'undefined') ltv_data.chip_require = 0;
            var isSelect = agPLayer >= ltv_data.chip_require ? true : false;
            var isBest = false;
            if (agPLayer >= ltv_data.chip_require) {
                if (i < lengt - 1 && agPLayer < arrListRoom[i + 1].chip_require) {
                    isBest = true;
                    isBest = indexBet;
                }
            }

            if (agPLayer > arrListRoom[lengt - 1].chip_require && i == lengt - 1) {
                isBest = true;
                indexBet = i;
            }

            if (this.cur_tab === 0) {
                if (this.curMarkVip === 0) this.curMarkVip = ltv_data.mark;
                if (ltv_data.mark !== this.curMarkVip && this.curMarkVip !== 0) {
                    this.curMarkVip = ltv_data.mark;
                    this.indexSprVip++;
                    if (this.indexSprVip > 2) this.indexSprVip = 0;
                }
                itemCompoment.isVip(this.indexSprVip);
                if (this.curMarkVip)
                    itemCompoment.setInfoVip(ltv_data.mark, ltv_data.player, isSelect, ltv_data.table_id, count, ltv_data.isPrivate);
            } if (this.cur_tab === 1) {
                itemCompoment.isnomal();
                itemCompoment.setInfo(ltv_data.mark, ltv_data.chip_require, ltv_data.cur_user, isSelect, isBest, count, ltv_data.maxAgCon, ltv_data.ag);
            }
            count++;
        }

        let lengtPlayer = parent.children.length;
        for (let i = lengt; i < lengtPlayer; i++) {
            parent.children[i].active = false;
        }
        let percent = indexBet / lengtPlayer * 100;
        if (percent > 80) percent = 100;
        if (this.cur_tab == 1) {
            scrollView.scrollToPercentHorizontal(percent, 0.2);
        } else {
            scrollView.scrollToLeft(0);
        }
    },

    showInvite(N, ag, tid, agu) {
        if (this.dialogIVP !== null) {
            this.dialogIVP.node.destroy();
            this.dialogIVP = null;
        }
        let msg = cc.js.formatStr(GameManager.getInstance().getTextConfig("invite_join_game"), N, GameManager.getInstance().formatNumber(ag), GameManager.getInstance().formatNumber(agu));
        let lb1 = GameManager.getInstance().getTextConfig("ok");
        let lb2 = GameManager.getInstance().getTextConfig("refuse");
        let lb3 = GameManager.getInstance().getTextConfig("refuse_all");

        this.dialogIVP = GameManager.getInstance().onShowWarningDialog(msg, DIALOG_TYPE.THREE_BTN, lb1, () => {
            // SocketSend:: sendJoinTable(GPManager -> tableIDInvite);
            // cc.NGWlog('--------> e vao ban day:   ' + tid);
            // GameManager.getInstance().onShowHideWaiting(true);
            //require('NetworkManager').getInstance().sendJoinTable(tid);
            require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayInvite_%d", require('GameManager').getInstance().curGameId));
            require('NetworkManager').getInstance().sendCheckPass(tid);

            this.dialogIVP = null;
        }, lb2, () => {
            // cc.NGWlog('--------> e ko vao ban dau:   ' + tid);
            this.dialogIVP = null;
        }, lb3, () => {
            GameManager.getInstance().invitePlayGame = false;
            // cc.NGWlog('--------> e ko bao gio vao ban dau:   ' + tid);
            this.dialogIVP = null;
        });
    },

    onClickBack() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        require('SoundManager1').instance.playButton()
        require('UIManager').instance.onHideView(this.node, true);
    },
    onClickTabRich() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabRoom_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.cur_tab = 0;
        this.btn_tab_player.spriteFrame = this.listFrameBtnTab[1];
        this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[0];
        require('NetworkManager').getInstance().sendRomVip();
        this.loadDataListView();
    },

    onClickTabPlayer() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabRoom_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.cur_tab = 1;
        this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[1];
        this.btn_tab_player.spriteFrame = this.listFrameBtnTab[0];
        this.isDataPlayer = true;
        this.loadDataListView();
    },

    onClickRank() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowRankGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onShowTopRich();

    },

    onClickShop() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require("UIManager").instance.onShowShop();
    },

    onCreateTable() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCreateTable_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        var item = cc.instantiate(this.item_create_prefab).getComponent("CreateTableView");
        item.init();
        this.node.addChild(item.node);
    },

    onClickPlayNow() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickPlayNow_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayNow_%d", require('GameManager').getInstance().curGameId));
        this.btn_play_now.interactable = false;
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.btn_play_now.interactable = true;
        }, 1500);
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onShowLoad();
        require('NetworkManager').getInstance().sendPlayNow(GameManager.getInstance().curGameId);

    },

    onClickSearch() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFindTable_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayJoin_%d", require('GameManager').getInstance().curGameId));
        require('SoundManager1').instance.playButton();
        var tableId = this.edt_box.string;
        if (tableId.length > 0) {
            // require('NetworkManager').getInstance().sendJoinTable(tableId);
            require('NetworkManager').getInstance().sendCheckPass(tableId);
        }
        this.edt_box.string = "";
    },

    onShowCheckPass() {
        var item = cc.instantiate(this.item_checkpass_prefab).getComponent("CheckPass");
        //item.init();
        this.node.addChild(item.node);
    },
    reuse: function () {
        this.isDataPlayer = false;
        this.isDataVip = false
        this.setInfo();
    }
});