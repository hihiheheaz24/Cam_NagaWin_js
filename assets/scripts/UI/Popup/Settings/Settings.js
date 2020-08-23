
const GameManager = require('GameManager')
const UIManager = require("UIManager")
cc.Class({
    extends: require('PopupEffect'),

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite
        },
        lbName: {
            default: null,
            type: cc.Label
        },
        lbID: {
            default: null,
            type: cc.Label
        },
        lbDisID: {
            default: null,
            type: cc.Label
        },
        lbVersion: {
            default: null,
            type: cc.Label
        },
        lbCurLang: {
            default: null,
            type: cc.Label
        },
        groupLanguage: {
            default: null,
            type: cc.Node
        },
        layoutLanguage: cc.Node,

        spriteLanguage: {
            default: null,
            type: cc.SpriteFrame
        },

        spriteLanguage: {
            default: null,
            type: cc.SpriteFrame
        },

        btnMusic: {
            default: null,
            type: cc.Sprite
        },
        btnSound: {
            default: null,
            type: cc.Sprite
        },

        spriteOnOff: {
            default: [],
            type: [cc.SpriteFrame]
        },
        bkgPopup: {
            default: null,
            type: cc.Node
        },
        btn_group: cc.Button,
        btn_fanpage: cc.Button,

        // title: cc.Label,

    },

    onLoad() {
        // Initialize the keyboard input listening

    },

    setInfo() {
        this.lbName.string = GameManager.getInstance().user.displayName;
        this.lbID.string = GameManager.getInstance().user.id;
        var avt = GameManager.getInstance().user.avtId;
        let vip = GameManager.getInstance().user.vip;
        this.avatar.node.getComponent("AvatarItem").loadTexture(avt, GameManager.getInstance().user.tinyURL,null,vip);
        this.lbDisID.string = GameManager.getInstance().getTextConfig('txt_disid') + " " + require("ConfigManager").getInstance().disID;
        let strVersionA = "";
        if (require("GameManager").getInstance().versionA !== null) {
            strVersionA = " - " + require("GameManager").getInstance().versionA;
        }
        this.lbVersion.string = GameManager.getInstance().getTextConfig('txt_version') + " " + require("GameManager").getInstance().versionGame + strVersionA;//" - " + require('HotUpdate').instance.versionA;

        var languageSave = cc.sys.localStorage.getItem('language_client');
        cc.log("Language Client key==" + languageSave);
        var strLang = require('GameManager').getInstance().getTextConfig(languageSave);
        this.lbCurLang.string = strLang;

        let music = cc.sys.localStorage.getItem("music");
        if (music === "off") {
            this.btnMusic.spriteFrame = this.spriteOnOff[1];
        }
        else {
            this.btnMusic.spriteFrame = this.spriteOnOff[0];
        }
        let sound = cc.sys.localStorage.getItem("sound");
        if (sound === "off") {
            this.btnSound.spriteFrame = this.spriteOnOff[1];
        } else {
            this.btnSound.spriteFrame = this.spriteOnOff[0];
        }
        this.btn_group.node.active = require("ConfigManager").getInstance().is_bl_fb;
        this.btn_fanpage.node.active = require("ConfigManager").getInstance().is_bl_fb;


    },
    onMoveOut() {
        this.onPopOn();
        this.setInfo();
        if (this.groupLanguage.active)
            this.onClickHideGroupLanguage();
        // this.node.position = cc.v2(0, 0);
    },
    onClickQuit() {
        require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickQuitGame");
        require('SoundManager1').instance.playButton();
        GameManager.getInstance().onQuitGame();
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickQuitGame_%s", require('GameManager').getInstance().getCurrentSceneName()));


    },
    onClickLogout() {
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        cc.sys.localStorage.setItem('isLogOut', 'true');
        setTimeout(function () {
            require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickLogOut");
            require("UIManager").instance.onLogout();

            GameManager.getInstance().setCurView(CURRENT_VIEW.LOGIN_VIEW);
        }, 500)
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickLogOut_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickChangeLanguage() {
        require('SoundManager1').instance.playButton();
        this.groupLanguage.active = !this.groupLanguage.active;
        this.genListLangguage();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChangeLanguage_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },

    onClickHideGroupLanguage() {
        require('SoundManager1').instance.playButton();
        this.groupLanguage.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseChangeLanguage_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },

    genListLangguage() {
        cc.NGWlog('vao set text chua .......');
        this.layoutLanguage.removeAllChildren();

        for (let i = 0; i < require('ConfigManager').getInstance().listTextConfig.length; i++) {
            let dataText = require('ConfigManager').getInstance().listTextConfig[i];

            let nodeBtn = this.createSprite(this.spriteLanguage)
            let btnCom = nodeBtn.addComponent(cc.Button);
            btnCom.interactable = true
            btnCom.transition = cc.Button.Transition.NONE
            nodeBtn.setContentSize(cc.size(250, 70));

            let nodeLb = new cc.Node('Label');
            nodeBtn.addChild(nodeLb)
            let lbCom = nodeLb.addComponent(cc.Label);
            lbCom.string = require('GameManager').getInstance().getTextConfig(dataText.language);
            lbCom.fontSize = 30

            nodeBtn.language = dataText.language;

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "Settings";
            eventHandler.handler = "onClickChooseLanguage"
            nodeBtn.getComponent(cc.Button).clickEvents.push(eventHandler)

            this.layoutLanguage.addChild(nodeBtn);
        }
    },

    createSprite(_spriteFrame = null) {
        let nodeSprite = new cc.Node("Sprite");
        let spriteCom = nodeSprite.addComponent(cc.Sprite);
        if (_spriteFrame !== null)
            spriteCom.spriteFrame = _spriteFrame;

        spriteCom.sizeMode = cc.Sprite.SizeMode.CUSTOM;

        return nodeSprite;
    },

    onClickChooseLanguage(event) {
        var langSelected = event.target.language;
        var langCur = cc.sys.localStorage.getItem("language_client");

        require('SoundManager1').instance.playButton();

        this.groupLanguage.active = false;

        cc.NGWlog("IS LANGUAGE CURRENT: " + langCur);
        cc.NGWlog("IS LANGUAGE SELECT: " + langSelected);

        if (langSelected === langCur) {
            this.onClickHideGroupLanguage();
            return;
        }

        require('GameManager').getInstance().onShowConfirmDialog(require('GameManager').getInstance().getTextConfig('msg_change_language'), () => {
            cc.sys.localStorage.setItem('language_client', langSelected);
            require('GameManager').getInstance().onReconnect();
            require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickLogOut");
            this.onPopOff();
        });

        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseChangeLanguage_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },


    onClickMusic() {
        let music = cc.sys.localStorage.getItem("music");
        let state = '';
        if (music == "off") {
            state = 'on';
            require('SoundManager1').instance.playMusicBackground();
            this.btnMusic.spriteFrame = this.spriteOnOff[0];
        }
        else {
            state = 'off';
            require('SoundManager1').instance.stopMusic();
            this.btnMusic.spriteFrame = this.spriteOnOff[1];
        }
        cc.sys.localStorage.setItem("music", state);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickMusic_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },
    onClickSound() {
        var sound = cc.sys.localStorage.getItem("sound");
        if (sound === "off") {
            sound = "on";
            require('SoundManager1').instance.turnOnSFX();
            this.btnSound.spriteFrame = this.spriteOnOff[0];
        } else {
            sound = "off";
            require('SoundManager1').instance.playButton();
            require('SoundManager1').instance.turnOffSFX();
            this.btnSound.spriteFrame = this.spriteOnOff[1];
        }
        cc.sys.localStorage.setItem("sound", sound);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSound_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickFeedBack() {
        require('SoundManager1').instance.playButton();
        if (!require("ConfigManager").getInstance().is_bl_fb) {
            UIManager.instance.onShowFeedbackPopup();
        } else {
            if (cc.sys.os === cc.sys.OS_ANDROID)
                UIManager.instance.onShowContactAdmin();
            else if (cc.sys.os === cc.sys.OS_IOS)
                cc.sys.openURL('https://m.me/'+require("GameManager").getInstance().fanpageID);
        }
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowFeedback_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickClose: function (event, customEventData) {
        //*Effect
        // let _this = this;
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);

    },

    onClickOpenFanpage() {
        require('SoundManager1').instance.playButton();
        if (cc.sys.isBrowser) window.open(require("GameManager").getInstance().fanpageURL);
        require('Util').openFanpage();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFanpage_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickOpenGroup() {
        require('SoundManager1').instance.playButton();
        let link = require("ConfigManager").getInstance().groupLink;
        let groupID = require("ConfigManager").getInstance().groupID;
        let linkGroup = link + groupID;

        if (cc.sys.isBrowser)
            window.open(linkGroup);
        else
            require('Util').openGroup();

        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickGroup_%s", require('GameManager').getInstance().getCurrentSceneName()));
    }
});
