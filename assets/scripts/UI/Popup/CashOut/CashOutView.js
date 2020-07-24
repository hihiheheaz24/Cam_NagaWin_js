cc.Class({
    extends: cc.Component,

    properties: {
        nodeCash: {
            default: null,
            type: cc.Node
        },
        nodeAgency: {
            default: null,
            type: cc.Node
        },
        nodeHistory: {
            default: null,
            type: cc.Node
        },

        lbMyChipCash: {
            default: null,
            type: cc.Label
        },
        lbChangeCash: {
            default: null,
            type: cc.Label
        },

        listViewCash: {
            default: null,
            type: cc.ScrollView
        },
        itemListCash: {
            default: null,
            type: cc.Prefab
        },

        lbWarningChip: {
            default: null,
            type: cc.Label
        },

        lbWarningWingID: {
            default: null,
            type: cc.Label
        },

        lbWarningRetypeWing: {
            default: null,
            type: cc.Label
        },

        listViewAgency: {
            default: null,
            type: cc.ScrollView
        },
        itemListAgency: {
            default: null,
            type: cc.Prefab
        },

        listViewHistory: {
            default: null,
            type: cc.ScrollView
        },
        itemListHistory: {
            default: null,
            type: cc.Prefab
        },
        valueChip: null,
        chipExc: null,
        btn_confirm: {
            default: null,
            type: cc.Button
        },
        btn_history: cc.Button,
        edbList: [cc.EditBox],
        sprActive: cc.SpriteFrame,
        sprDeActive: cc.SpriteFrame,
        tab_btn_net: cc.ScrollView,
        btn_net: cc.Node,
        countErr: 0,
        cors_url: "https://cors-anywhere.herokuapp.com/",

    },
    onLoad() {
        Global.CashOutView = this;
        this.isFirstEventTouch = true;
    },
    onEnable() {
        require('LoadConfig').getInstance().getInfoDT()

    },
    setInfo() {
        this.nodeCash.active = false;
        this.nodeAgency.active = false;
        this.nodeHistory.active = false;
        this.tab_btn_net.node.active = false;
        this.dataCO = require("ConfigManager").getInstance().dataInfoExchange;
        this.updateChip();
        for (let i = 0; i < this.dataCO.length; i++) {
            if (this.dataCO[i].hasOwnProperty("type")) {
                if (this.dataCO[i].title !== "agency") {
                    this.btn_history.node.active = true;
                    this.genTabNet();
                    this.onClickTabNet(this.dataCO[i].title + "_" + i);
                    this.tab_btn_net.node.active = true;
                    break;
                }

            }
        }
        this.setInfoAgency();

    },
    genTabNet() {
        for (let i = 0; i < this.dataCO.length; i++) {
            let data = this.dataCO[i];
            if (data.title !== "agency") {
                let btn = this.tab_btn_net.content.children[i];
                if (btn.name) {
                    if (btn.name !== "btnAgency" && btn.name !== "btnHistory") {
                        cc.log("Chay vao day");
                        this.setInfoBtnNet(btn, this.dataCO[i], i);
                        btn.active = true;
                    }
                } else {
                    cc.log("Chay vao day");
                    btn = cc.instantiate(this.btn_net);
                    this.setInfoBtnNet(btn, this.dataCO[i], i);
                    this.tab_btn_net.content.addChild(btn);
                }
            }
        }
    },
    setInfoAgency() {
        this.tab_btn_net.content.getChildByName("btnAgency").active = false;
        for (let i = 0; i < this.dataCO.length; i++) {
            if (this.dataCO[i].title === "agency") { //chi co moi agency thoi
                this.dataAgency = this.dataCO[i];
                this.tab_btn_net.content.getChildByName("btnAgency").active = true;
                if (this.dataCO.length === 1) {
                    this.nodeAgency.active = true;
                    for (let i = 0; i < this.tab_btn_net.content.children.length; i++) {
                        let btn = this.tab_btn_net.content.children[i];
                        if (btn.name !== "btnAgency") btn.active = false;
                    }
                    this.tab_btn_net.node.active = true;
                    this.onClickAgency();
                }


            }
        }
    },
    setInfoBtnNet(btn, data, index) {
        btn.name = data.title + "_" + index;
        btn.getChildByName("lbNet").active = true;
        btn.getChildByName("lbNet").getComponent(cc.Label).string = data.type;
        let sprBtn = btn.getChildByName("iconNet").getComponent(cc.Sprite);
        this.loadBtnSpr(sprBtn, data.title_img);
        btn.on("touchend", () => {
            this.onClickTabNet(btn.name);
        });


    },
    onClickTabNet(type) {
        cc.log("On Click tabnet:" + type);
        this.nodeAgency.active = false;
        this.nodeHistory.active = false;
        this.nodeCash.active = true;
        for (let i = 0; i < this.dataCO.length; i++) {
            if (this.dataCO[i].title + "_" + i === type) {
                this.curDataCO = this.dataCO[i];
            }
        }
        for (let i = 0; i < this.curDataCO.textBox.length; i++) {
            this.edbList[i].placeholder = require("GameManager").getInstance().getTextConfig(this.curDataCO.textBox[i].key_placeHolder);
            this.edIDCash = this.edbList[0];
            this.edRetypeIDCash = this.edbList[1];
        }
        this.reloadListCashOut();
        this.setStateBtn(type);
    },
    setStateBtn(btnName) {
        let listBtn = this.tab_btn_net.content;
        for (let i = 0; i < listBtn.children.length; i++) {
            if (listBtn.children[i].name !== btnName) {
                listBtn.children[i].getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.sprDeActive;
            } else {
                listBtn.children[i].getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.sprActive;
            }
        }
    },
    reloadListCashOut() {
        //  this.resetField();
        for (let i = 0; i < this.listViewCash.content.children.length; i++) {
            this.listViewCash.content.children[i].destroy();
        }
        let len = this.curDataCO.items.length;
        for (let i = 0; i < len; i++) {

            let itemInfo = this.curDataCO.items[i];
            if (i === 0) {
                this.onChooseCashOut(itemInfo.ag, itemInfo.m);
            }
            let obj = cc.instantiate(this.itemListCash).getComponent('ItemCashOut');
            obj.updateItem(itemInfo, i);
            this.listViewCash.content.addChild(obj.node);
        }

    },

    onConfirmCashOut() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("onConfirmCashOut_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let wingId = this.edIDCash.string;
        let userId = require('GameManager').getInstance().user.id;
        let value = this.chipExc;
        this.countErr = 0;

        if (this.lbChangeCash.string === '') {
            this.lbWarningChip.node.active = true;
            this.lbWarningChip.string = require('GameManager').getInstance().getTextConfig('error_empty');
            this.countErr++;
            //require("UIManager").instance.onShowConfirmDialog(require('GameManager').getInstance().getTextConfig('error_empty'));
        }

        if (wingId === '') {
            this.lbWarningWingID.node.active = true;
            this.lbWarningWingID.string = require('GameManager').getInstance().getTextConfig('error_empty');
            this.countErr++;
        }

        if (this.edRetypeIDCash.string === '') {
            this.lbWarningRetypeWing.node.active = true;
            this.lbWarningRetypeWing.string = require('GameManager').getInstance().getTextConfig('error_empty');
            this.countErr++;
        }

        if (wingId !== this.edRetypeIDCash.string) {

            this.lbWarningWingID.string = require('GameManager').getInstance().getTextConfig('txt_WingnotSame');
            this.lbWarningRetypeWing.string = require('GameManager').getInstance().getTextConfig('txt_WingnotSame');
            this.lbWarningWingID.node.active = true;
            this.lbWarningRetypeWing.node.active = true;
            this.countErr++;
        }

        if (this.countErr > 0) return;

        require('NetworkManager').getInstance().sendCashOut(userId, value, wingId);
        this.lbWarningWingID.string = '';
        this.lbWarningRetypeWing.string = '';

        this.reloadListCashOut();
    },

    onChooseCashOut(value, m) {

        if (require('GameManager').getInstance().user.ag < value) {
            this.lbWarningChip.node.active = true;
            this.lbWarningChip.string = require('GameManager').getInstance().getTextConfig('txt_koduchip');
            this.btn_confirm.interactable = false;
        } else {
            this.btn_confirm.interactable = true;
            this.lbWarningChip.node.active = false;
        }

        this.chipExc = m;
        this.valueChip = value;
        this.lbChangeCash.string = require('GameManager').getInstance().formatNumber(value) + ' Chips = ' + m + '$';
    },

    start() {
    },



    loadBtnSpr(btn, url) {
        let urlCor = this.cors_url;
        if (cc.sys.isNative || IS_RUN_INSTANT_FACEBOOK) {
            urlCor = "";
        }
        if (url.indexOf(".png") === -1) {
            cc.loader.load({ url: urlCor + url, type: "png" }, (err, tex) => {
                if (err || btn === null || typeof (btn.spriteFrame) == "undefined") {
                    cc.NGWlog("loadTextureFromUrl FB error:" + err);
                    return;
                }
                btn.spriteFrame = new cc.SpriteFrame(tex);
                btn.node.parent.getChildByName("lbNet").active = false;
            });
        } else {
            cc.loader.load(urlCor + url, (err, tex) => {
                if (err || btn === null || typeof (btn.spriteFrame) === "undefined") {
                    cc.NGWlog('Error Load Image')
                    return;
                }
                btn.spriteFrame = new cc.SpriteFrame(tex);
                btn.node.parent.getChildByName("lbNet").active = false;
            });
        }
    },
    offEvenTouch() {
        let listBtn = this.tab_btn_net.content.children;
        for (let i = 0; i < listBtn.length; i++) {
            if (listBtn[i].name !== "btnAgency" && listBtn[i].name !== "btnHistory") {
                listBtn[i].off("touchend");
            }
        }
    },
    updateChip() {
        let ag = require('GameManager').getInstance().user.ag;
        this.lbMyChipCash.string = require('GameManager').getInstance().formatNumber(ag);
    },

    onClickAgency() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAgency_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.nodeAgency.active = true;
        this.nodeCash.active = false;
        this.nodeHistory.active = false;
        let listAgency = this.dataAgency.items;
        for (let i = 0; i < listAgency.length; i++) {
            let obj = this.listViewAgency.content.children[i];
            if (!obj) {
                obj = cc.instantiate(this.itemListAgency);
                this.listViewAgency.content.addChild(obj);
            }
            obj.active = true;
            obj = obj.getComponent('ItemAgency');
            obj.updateItem(listAgency[i]);
        }
        for (let i = listAgency.length; i < this.listViewAgency.content.children.length; i++) {
            this.listViewAgency.content.children[i].active = false;
        }
        this.setStateBtn("btnAgency");
    },

    onClickHistory() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickHistory_%s", require('GameManager').getInstance().getCurrentSceneName()));

        this.nodeHistory.active = true;
        this.nodeCash.active = false;
        this.nodeAgency.active = false;

        require('NetworkManager').getInstance().sendDTHistory(require('GameManager').getInstance().user.id);
        this.setStateBtn("btnHistory");
    },

    updateHistory(listItem) {
        cc.NGWlog('Update History Cash Out!' + listItem.length);

        for (let i = 0; i < this.listViewHistory.content.children.length; i++) {
            this.listViewHistory.content.children[i].destroy();
        }

        this.listViewHistory.content.removeAllChildren();

        for (let i = 0; i < listItem.length; i++) {
            let obj = cc.instantiate(this.itemListHistory).getComponent('ItemHistoryCashout');
            this.listViewHistory.content.addChild(obj.node);
            cc.log("data history==" + JSON.stringify(listItem[i]));
            obj.updateItem(listItem[i]);
        }
    },

    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },
    cashOutReturn(data) {

        if (data.status) {
            require('NetworkManager').getInstance().sendUAG();
            require("UIManager").instance.onShowConfirmDialog(data.data);
        } else {
            require("UIManager").instance.onShowConfirmDialog(data.data);
        }

    },
    resetField() {
        this.lbChangeCash.string = '';
        this.edIDCash.string = '';
        this.edRetypeIDCash.string = '';
        this.lbWarningChip.node.active = false;
        this.lbWarningRetypeWing.node.active = false;
        this.lbWarningWingID.node.active = false;
    },
});