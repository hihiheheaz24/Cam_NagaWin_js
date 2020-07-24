
var W_DEFAULT = 'w_default'
var W_REPLACE = 'w_replace'
var U_DEFAULT = 'u_default'
var U_REPLACE = 'u_replace'
var IAP = 'iap'
cc.Class({
    extends: cc.Component,

    properties: {
        listBtnTabR: cc.Node,
        listBtnTabL: cc.ScrollView,
        listItemShop: cc.ScrollView,
        nodeBtnTabL: cc.Node,
        nodeBtnTabR: cc.Node,
        itemShop: cc.Node,
        listSprBkgTabL: [cc.SpriteFrame],
        listSprBkgTabR: [cc.SpriteFrame],
        listEdb: [cc.EditBox],
        nodeInput: cc.Node,
        lb_chip: cc.Label,
        bnt_support: cc.Button

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.ShopView = this;
        this.dataPMfake = [
            {
                type: "w_default",
                title: "dcb",
                title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/DCB.png",
                child: [
                    {
                        title: "Smart",
                        title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/smart.png"
                    },
                    {
                        type: "w_replace",
                        title: "Cellcard",
                        title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/cellcard.png",
                        items: [
                            {
                                url: "https://pm.ngwcasino.com/fortumo/?userid=%userid%&price=1&msisdn=%phone%",
                                txtPromo: "1$ = 99,000 Chips",
                                txtChip: "18,000 Chips",
                                txtBuy: "$0.5",
                                txtBonus: "0%"
                            }
                        ],
                        textBox: [
                            {
                                placeHolder: "PhoneNumber",
                                key: "%phone%"
                            },
                            {
                                placeHolder: "Wing Id",
                                key: "%userid%"
                            },

                        ]
                    }
                ],
                items: [
                    {
                        url: "https://pm.ngwcasino.com/coda/?userid=1911523&price=0.5&paytype=1",
                        txtPromo: "1$ = 36,000 Chips",
                        txtChip: "18,000 Chips",
                        txtBuy: "$0.5",
                        txtBonus: "0%"
                    },
                    {
                        url: "https://pm.ngwcasino.com/coda/?userid=1911523&price=1&paytype=1",
                        txtPromo: "1$ = 44,000 Chips", "txtChip": "44,000 Chips",
                        txtBuy: "$1",
                        txtBonus: "22%"
                    },
                    {
                        url: "https://pm.ngwcasino.com/coda/?userid=1911523&price=2&paytype=1",
                        txtPromo: "1$ = 42,000 Chips",
                        txtChip: "84,000 Chips",
                        txtBuy: "$2",
                        txtBonus: "17%"
                    }, {
                        url: "https://pm.ngwcasino.com/coda/?userid=1911523&price=5&paytype=1",
                        txtPromo: "1$ = 44,000 Chips",
                        txtChip: "220,000 Chips",
                        txtBuy: "$5",
                        txtBonus: "22%"
                    }]
            },
            {
                type: "w_replace",
                title: "wing",
                title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/WING.png",
                items: [
                    {
                        url: "https://pm.ngwcasino.com/fortumo/?userid=850211&price=100&msisdn=%phone%",
                        txtPromo: "1$=94,000Chips",
                        txtChip: "9,400,000Chips",
                        txtBuy: "$100",
                        txtBonus: "161%"
                    },
                    {
                        url: "https://pm.ngwcasino.com/fortumo/?userid=850211&price=200&msisdn=%phone%",
                        txtPromo: "1$=98,000Chips",
                        txtChip: "19,600,000Chips",
                        txtBuy: "$200",
                        txtBonus: "172%"
                    }
                ],
                child: [
                    {
                        title: "Cellcard",
                        title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/cellcard.png"
                    },
                    {
                        title: "Cellcard",
                        title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/cellcard.png"
                    }
                ],
                textBox: [
                    {
                        placeHolder: "PhoneNumber",
                        key: "%phone%"
                    }
                ]
            },
            {
                type: "u_replace",
                title: "wing",
                title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/WING.png",
                items: [
                    {
                        url: "https://pm.ngwcasino.com/fortumo/?userid=850211&price=1&msisdn=%phone%",
                        txtPromo: "1$=80,000Chips",
                        txtChip: "80,000Chips",
                        txtBuy: "$1",
                        txtBonus: "122%"
                    },
                    {
                        url: "https://pm.ngwcasino.com/fortumo/?userid=850211&price=2&msisdn=%phone%",
                        txtPromo: "1$=80,000Chips",
                        txtChip: "160,000Chips",
                        txtBuy: "$2",
                        txtBonus: "122%"
                    },
                ],
                textBox: [
                    {
                        placeHolder: "PhoneNumber",
                        key: "%phone%"
                    }
                ]
            },
            {
                type: "iap",
                title: "iap",
                title_img: "https://storage.googleapis.com/s.ngwcasino.com/test/IAPCAM.png",
                items: [
                    {
                        url: "khmer.ngw.card.slot.1",
                        txtPromo: "1USD = 60,606 Chips",
                        txtChip: "60,000 Chips", "txtBuy": "0.99 USD",
                        txtBonus: "67%",
                        cost: 1
                    },
                    {
                        url: "khmer.ngw.card.slot.2",
                        txtPromo: "1USD = 64,322 Chips",
                        txtChip: "128,000 Chips",
                        txtBuy: "1.99 USD", "txtBonus": "78%",
                        cost: 2
                    },
                    {
                        url: "khmer.ngw.card.slot.5",
                        txtPromo: "1USD = 70,140 Chips",
                        txtChip: "350,000 Chips",
                        txtBuy: "4.99 USD",
                        txtBonus: "94%",
                        cost: 5
                    },
                    {
                        url: "khmer.ngw.card.slot.20",
                        txtPromo: "1USD = 64,032 Chips",
                        txtChip: "1,280,000 Chips",
                        txtBuy: "19.99 USD",
                        txtBonus: "78%",
                        cost: 20
                    },
                    {
                        url: "khmer.ngw.card.slot.50",
                        txtPromo: "1USD = 64,013 Chips",
                        txtChip: "3,200,000 Chips",
                        txtBuy: "49.99 USD",
                        txtBonus: "78%",
                        cost: 50
                    },
                    {
                        url: "khmer.ngw.card.slot.100",
                        txtPromo: "1USD = 70,007 Chips",
                        txtChip: "7,000,000 Chips",
                        txtBuy: "99.99 USD",
                        txtBonus: "94%",
                        cost: 100
                    }
                ]
            },

        ];
        this.cors_url = "https://cors-anywhere.herokuapp.com/";

        this.curDataPM = null;
        this.curChildPM = [];
        this.curChildItem = null;
        this.curListDataItem = [];
    },
    onEnable() {
        this.listBtnTabR.active = false;
        this.listBtnTabL.node.active = false;
        require('LoadConfig').getInstance().getInfoChip();
        this.listItemShop.node.active = false;
        //this.bnt_support.node.active = require("ConfigManager").getInstance().is_bl_fb;
    },
    setInfo() {
        this.dataPM = require("ConfigManager").getInstance().dataInfoChip;
        if (this.dataPM[0] != null) {
            this.listBtnTabL.node.active = true;
            this.listBtnTabR.active = true;
            this.listItemShop.node.active = true;
            this.genTabLeft();
            let typeShop = require("GameManager").getInstance().typeShop;
            if (typeShop !== "") {
                for (let i = 0; i < this.dataPM.length; i++) {
                    cc.log("Type PM==" + this.dataPM[i].title);
                    if (this.dataPM[i].title === typeShop) {
                        cc.log("Type typeShop==" + typeShop);
                        this.onClickTabL(typeShop + "_" + i)
                        break;
                    }
                    else
                        this.onClickTabL(this.dataPM[0].title + "_" + 0);
                }
            } else
                this.onClickTabL(this.dataPM[0].title + "_" + 0);
        }
        else {
            this.listBtnTabL.node.active = false;
            this.listBtnTabR.active = false;
            this.listItemShop.node.active = false;
        }
        this.updateChip();
    },
    start() {

    },
    genTabLeft() {
        for (let i = 0; i < this.dataPM.length; i++) {
            let btnTabL = this.listBtnTabL.content.children[i];
            if (!btnTabL) {
                btnTabL = cc.instantiate(this.nodeBtnTabL);
                this.listBtnTabL.content.addChild(btnTabL);
            }
            btnTabL.active = true;
            this.setInfoTabLeft(btnTabL, this.dataPM[i], i);
        }
    },
    setInfoTabLeft(btn, data, index) {
        btn.name = data.title + "_" + index;
        btn.getChildByName("lbNet").getComponent(cc.Label).string = data.title;
        let sprBtn = btn.getChildByName("IconNet").getComponent(cc.Sprite);
        this.loadBtnSpr(sprBtn, data.title_img);
        btn.on("touchend", () => {
            this.onClickTabL(btn.name);
        });
    },
    onClickTabL(type) {
        for (let i = 0; i < this.dataPM.length; i++) {
            let titleData = this.dataPM[i].title + "_" + i;
            if (type === titleData) {
                this.curDataPM = this.dataPM[i];
                this.curListDataItem = this.curDataPM.items;
                if (this.curDataPM.hasOwnProperty("child")) {
                    this.listBtnTabR.active = true;
                    this.curChildPM = this.curDataPM.child;
                    this.genTabR();
                    this.onClickTabR(this.curChildPM[0].title + "_" + 0); //click thang child dau tien luon.
                    this.listItemShop.getComponent(cc.Widget).top = 163;
                    //   this.listItemShop.getComponent(cc.Widget).updateAlignment();
                    this.listItemShop.content.y = this.listItemShop.node.getChildByName("view").height / 2 - 45;
                } else {
                    this.listBtnTabR.active = false;
                    this.curChildPM = [];
                    this.curChildItem = null;
                    this.reloadListItem();
                    this.listItemShop.getComponent(cc.Widget).top = 163;
                    //this.listItemShop.getComponent(cc.Widget).updateAlignment();
                    this.listItemShop.content.y = this.listItemShop.node.getChildByName("view").height / 2;
                }

            }
        }
        for (let i = 0; i < this.listBtnTabL.content.children.length; i++) {
            let btn = this.listBtnTabL.content.children[i];
            if (btn.name === type) {
                btn.getComponent(cc.Sprite).spriteFrame = this.listSprBkgTabL[0];
            } else
                btn.getComponent(cc.Sprite).spriteFrame = this.listSprBkgTabL[1];
        }

    },
    onClickTabR(type) {
        cc.log("Cur data PM==" + JSON.stringify(this.curDataPM));
        for (let i = 0; i < this.curChildPM.length; i++) {
            if (type === this.curChildPM[i].title + "_" + i) {
                this.curChildItem = this.curChildPM[i];
                if (this.curChildPM[i].hasOwnProperty("items")) {
                    this.curListDataItem = this.curChildPM[i].items;
                } else this.curListDataItem = this.curDataPM.items;
            }
        }
        for (let i = 0; i < this.listBtnTabR.children.length; i++) {
            if (this.listBtnTabR.children[i].name === type) {
                this.listBtnTabR.children[i].getComponent(cc.Sprite).enabled = true;
                this.listBtnTabR.children[i].getComponent(cc.Sprite).spriteFrame = this.listSprBkgTabR[0];
            } else {
                // this.listBtnTabR.children[i].getComponent(cc.Sprite).spriteFrame = this.listSprBkgTabR[1];
                this.listBtnTabR.children[i].getComponent(cc.Sprite).enabled = false;
            }

        }
        this.reloadListItem();
    },
    genTabR() {
        for (let i = 0; i < this.curChildPM.length; i++) {
            let btnTabR = this.listBtnTabR.children[i];
            if (!btnTabR) {
                btnTabR = cc.instantiate(this.nodeBtnTabR);
                this.listBtnTabR.addChild(btnTabR);
            }
            btnTabR.active = true;
            this.setInfoTabR(btnTabR, this.curChildPM[i], i);
        }
    },
    setInfoTabR(btn, data, index) {
        btn.name = data.title + "_" + index;
        btn.getChildByName("lbNet").getComponent(cc.Label).string = data.title;
        let sprBtn = btn.getChildByName("IconNet").getComponent(cc.Sprite);
        this.loadBtnSpr(sprBtn, data.title_img);
        btn.on("touchend", () => {
            this.onClickTabR(btn.name);
        })
    },
    reloadListItem() {
        for (let i = 0; i < this.listItemShop.content.children.length; i++) {
            this.listItemShop.content.children[i].active = false;
        }
        for (let i = 0; i < this.curListDataItem.length; i++) {
            let item = this.listItemShop.content.children[i];
            if (!item) {
                item = cc.instantiate(this.itemShop);
                this.listItemShop.content.addChild(item);
            }
            item.setScale(0, 1);
            item.skewY = -15;
            item.active = true;
            item.stopAllActions();
            item.interactable = false;
            item.runAction(
                cc.sequence(
                    cc.delayTime(i * 0.1),
                    cc.spawn(
                        cc.scaleTo(0.2, 1.0).easing(cc.easeCubicActionOut()),
                        cc.skewTo(0.2, 0, 0),
                    ),
                    cc.callFunc(() => {
                        item.interactable = true;
                    }))
            );
            let dataItem = Object.assign({}, this.curListDataItem[i]);
            dataItem.index = i;
            dataItem.partner = this.curDataPM.title;
            dataItem.type = this.curDataPM.type;
            if (this.curDataPM.hasOwnProperty("textBox")) {
                dataItem.textBox = this.curDataPM.textBox;
            }
            if (this.curChildItem !== null) {
                if (this.curChildItem.hasOwnProperty("type"))
                    dataItem.type = this.curChildItem.type;
                if (this.curChildItem.hasOwnProperty("textBox"))
                    dataItem.textBox = this.curChildItem.textBox;
            }
            item = item.getComponent("ItemShop");
            item.init(dataItem);
        }

        this.listItemShop.scrollToTop(0.1);
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
    turnOffEvenBtn() {
        for (let i = 0; i < this.listBtnTabR.children.length; i++) {
            this.listBtnTabR.children[i].off("touchend");
            this.listBtnTabR.children[i].active = false;

        }
        cc.log("Turn Off Btn Tab left i===" + this.listBtnTabL.content.children.length);
        for (let i = 0; i < this.listBtnTabL.content.children.length; i++) {
            this.listBtnTabL.content.children[i].off("touchend");
            this.listBtnTabL.content.children[i].active = false;

        }
    },
    onCloseNodeInput() {
        this.nodeInput.getComponent("PopupEffect").onPopOff(false, true);
    },
    onClickItemShop(data) {
        cc.log("ShopView: Data Item= " + JSON.stringify(data));
        data.url = data.url.replace('%uid%', require("GameManager").getInstance().user.id.toString());

        switch (data.type) {
            case W_DEFAULT: {//open webview
                require("Util").onCallWebView(data.url);
                break;
            }
            case W_REPLACE: {//show input, replace in textbox, open webview
                this.onShowInput(data);
                break;
            }
            case U_DEFAULT: {
                cc.sys.openURL(data.url)
                break;
            }
            case U_REPLACE: {////show input, replace in textbox open url
                this.onShowInput(data)
                break;
            }
            case IAP: {
                require("Util").onBuyIap(data.url);
                break;
            }
        }
    },
    onShowInput(data) {
        this.nodeInput.active = true;
        this.nodeInput.getComponent("PopupEffect").onPopOn();
        let url = data.url;
        for (let i = 0; i < this.listEdb.length; i++) {
            this.listEdb[i].node.parent.active = false;
            this.listEdb[i].placeholder = "";
        }
        for (let i = 0; i < data.textBox.length; i++) {
            this.listEdb[i].node.parent.active = true;
            this.listEdb[i].placeholder = data.textBox[i].placeHolder;
        }
        let btnConfirm = this.nodeInput.getChildByName("Bkg").getChildByName("btn_Confirm");
        btnConfirm.on("touchend", () => {
            let canSend = true;
            for (let i = 0; i < data.textBox.length; i++) {
                let str = this.listEdb[i].string;
                let key = data.textBox[i].key;
                url = url.replace(key, str);
                if (str === "") canSend = false;
            }
            if (canSend) {
                require("Util").onCallWebView(url);
                cc.log("URL====" + url);
                this.nodeInput.getComponent("PopupEffect").onPopOff(false, true);
            }
        });
    },
    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClose_%s", require("GameManager").getInstance().getCurrentSceneName()));
        cc.NGWlog('ShopView:On Close!');
        require('SoundManager1').instance.playButton();
        if (require("GameManager").getInstance().gameView === null)
            require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        else if (require("GameManager").getInstance().gameView !== null)
            require("GameManager").getInstance().setCurView(require("GameManager").getInstance().curGameViewId);

        require('NetworkManager').getInstance().sendUAG();
        require('UIManager').instance.onHideView(this.node, true);
        this.turnOffEvenBtn();
        require("GameManager").getInstance().typeShop = "";
    },
    updateChip() {
        this.lb_chip.string = require("GameManager").getInstance().formatNumber(require("GameManager").getInstance().user.ag);
    },
    contactAdmin() {
        cc.NGWlog('Contact admin!!!!');
        if (!require("ConfigManager").getInstance().is_bl_fb) {
            require("UIManager").instance.onShowFeedbackPopup();
        } else {
            if (this.dataPM.length === 1 && this.dataPM[0].title === "iap") {
                require("UIManager").instance.onShowFeedbackPopup();
            } else {
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    Global.MainView.onClickCallAdmin();
                else if (cc.sys.os === cc.sys.OS_IOS)
                    cc.sys.openURL(require("GameManager").getInstance().u_chat_fb);
            }

        }
        //   require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowMessageFacebook_%s", require("GameManager").getInstance().getCurrentSceneName()));
    }
    // update (dt) {},
});
