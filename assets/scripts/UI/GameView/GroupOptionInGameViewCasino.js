var GameManager = require('GameManager')
cc.Class({
    extends: cc.Component,
    properties: {
        mask: {
            default: null,
            type: cc.Sprite
        },

        bg_option: {
            default: null,
            type: cc.Sprite
        },
        

        NodeGuidePf: cc.Prefab,
        imgOn: cc.SpriteFrame,
        imgOff: cc.SpriteFrame,

        imgMusic: cc.Sprite,
        imgSound: cc.Sprite,

        game_state: 0,
        game_id: 0,
        table_mark: 0,
        table_id: 0,
        is_change_table: false,
    },
    init: function() {
        let music = cc.sys.localStorage.getItem("music");
        let sound = cc.sys.localStorage.getItem("sound");
        cc.NGWlog('-=-=-=-=> music1', music);
       
    },

    setPlaySound() {
        cc.NGWlog('chay vao ham click music');
        var music = cc.sys.localStorage.getItem("music");
        if (music === null || music === "off") {
            cc.sys.localStorage.setItem("music", "off");
            require('SoundManager1').instance.stopMusic();
        } else {
            cc.sys.localStorage.setItem("music", "on");
            require('SoundManager1').instance.playMusicBackground();
        }
        var sound = cc.sys.localStorage.getItem("sound");
        if (sound === null || sound === "off") {
            cc.sys.localStorage.setItem("sound", "off");
            require('SoundManager1').instance.turnOffSFX();
        } else{
            cc.sys.localStorage.setItem("sound", "on");
            require('SoundManager1').instance.turnOnSFX();
        } 
        this.imgMusic.spriteFrame = (music === "on") ? this.imgOn : this.imgOff;
        this.imgSound.spriteFrame = (sound === "on") ? this.imgOn : this.imgOff;
    },
    onHideItem(index) {
        this.bg_option.node.children[index].active = false;
    },
    onShowAllItem() {
        for (let i = 0; i < this.bg_option.node.children.length; i++) {
            this.bg_option.node.children[i].active = true;
        }
    },
    hide(event,data) {
        if(data == 1)
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickHideGroupMenu_%s", require('GameManager').getInstance().getCurrentSceneName()));
        cc.NGWlog("----------->     HIDE");
        this.bg_option.node.stopAllActions();
        this.bg_option.node.runAction(cc.sequence(cc.callFunc(() => {
            cc.NGWlog('log ======== action hide')
        }), cc.scaleTo(.2, 0).easing(cc.easeBackIn())));
        setTimeout(() => {
            this.bg_option.node.stopAllActions();
            this.node.removeFromParent(false);
        }, 200)
        require("GameManager").getInstance().curGameViewId = parseInt(require("GameManager").getInstance().curGameId);
    
    },

    show() {
        this.node.active = true;
        this.mask.node.active = true;
        this.bg_option.node.active = true;
        this.bg_option.node.scale = 0;
        this.bg_option.node.stopAllActions();
        this.bg_option.node.runAction(cc.sequence(cc.scaleTo(.2, 1.0).easing(cc.easeBackOut()), cc.callFunc(() => { cc.NGWlog('chay vai gan effect') })));
        let curGameId=require('GameManager').getInstance().curGameId;
        if (require('GameManager').getInstance().gameView !== null) {
            this.updateState(require('GameManager').getInstance().gameView.stateGame);
        }

        let music = cc.sys.localStorage.getItem("music");
        let sound = cc.sys.localStorage.getItem("sound");
        cc.NGWlog('-=-=-=-=> music1', music);
        this.imgMusic.spriteFrame = (music === "on") ? this.imgOn : this.imgOff;
        this.imgSound.spriteFrame = (sound === "on") ? this.imgOn : this.imgOff;
    },

    updateState(state) {
        this.game_state = state;
    },

    onClickBack() {
       // require('SoundManager1').instance.playButton();

       if (this.game_state !== STATE_GAME.PLAYING || require('GameManager').getInstance().curGameId === GAME_ID.BLACKJACK)
       {
        cc.log("chay vao send auto exit game ========================");
        require('NetworkManager').getInstance().sendExitGame();
       }
        
       else {
        cc.log("chay vao send auto exit game ========================2");
        let str = '';
            if (cc.sys.localStorage.getItem("isBack") == 'false') {
                str = GameManager.getInstance().getTextConfig('wait_game_end_to_leave');
                if(require('GameManager').getInstance().curGameId !== GAME_ID.SLOT50LINE
                && require('GameManager').getInstance().curGameId !== GAME_ID.SLOT_20_LINE_JP){
                    if(this.gameView.thisPlayer._playerView !== null)
                        this.gameView.thisPlayer._playerView.icBack.node.active = true;
                }
                        cc.sys.localStorage.setItem("isBack", "true");
            } 
            else {
                str = GameManager.getInstance().getTextConfig('minidice_unsign_leave_table');
                if(require('GameManager').getInstance().curGameId !== GAME_ID.SLOT50LINE
                && require('GameManager').getInstance().curGameId !== GAME_ID.SLOT_20_LINE_JP){
                    if(this.gameView.thisPlayer._playerView !== null)
                    this.gameView.thisPlayer._playerView.icBack.node.active = false;
                }
                     cc.sys.localStorage.setItem("isBack", "false");
            }
            require("GameManager").getInstance().onShowToast(str);
       }
        
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBackGame_%s", require('GameManager').getInstance().getCurrentSceneName()));

        // if (require('GameManager').getInstance().curGameId === GAME_ID.BAUCUA || require('GameManager').getInstance().curGameId === GAME_ID.SESKU) {
        //     if (this.game_state === STATE_GAME.PLAYING) {
        //         require("GameManager").getInstance().onShowToast('You will exit after game ends');
        //     }
        // }

        this.mask.node.active = false;
        this.bg_option.node.active = false;
        this.hide();
    },
    onClickInvite() {
       // return;
        // require('SoundManager1').instance.playButton();
        // // var item = cc.instantiate(this.item_invite).getComponent('InvitePlayerInTable');
        // // item.init(require('GameManager').getInstance().table_mark);
        // // require('UIManager').instance.instantiate_parent.addChild(item.node);
        
        // if (Global.InviteFriendInTable === null) {
        //     cc.loader.loadRes("InviteInTable" ,(err,prefab)=>{
        //         if(err) return
        //         Global.InviteFriendInTable = cc.instantiate(prefab).getComponent('InvitePlayerInTable');
        //         if (Global.InviteFriendInTable.node.getParent() === null) {
        //             this.gameView.node.addChild(Global.InviteFriendInTable.node);
        //             Global.InviteFriendInTable.node.zIndex = GAME_ZORDER.Z_MENU_VIEW;
        //         }
        //         Global.InviteFriendInTable.setInfo();
        //         Global.InviteFriendInTable.init(require('GameManager').getInstance().table_mark);
        //     })
           
        // }else{
        //     if (Global.InviteFriendInTable.node.getParent() === null) {
        //         this.gameView.node.addChild(Global.InviteFriendInTable.node);
        //         Global.InviteFriendInTable.node.zIndex = GAME_ZORDER.Z_MENU_VIEW;
        //     }
        //     Global.InviteFriendInTable.setInfo();
        //     Global.InviteFriendInTable.init(require('GameManager').getInstance().table_mark);
        // }
        this.hide();
        
        this.gameView.onClickInvite();
    },

    onClickChangeTable() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChangeTable_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.game_state === STATE_GAME.PLAYING) {
            cc.NGWlog('vao day la dang choi k cho ra dau');
            this.mask.node.active = false;
            this.bg_option.node.active = false;
            require("UIManager").instance.onShowConfirmDialog(require('GameManager').getInstance().getTextConfig('txt_intable'));
        } else {
            require('SoundManager1').instance.playButton();
            Global.MainView._isClickGame = true;
            setTimeout(() => {
                Global.MainView._isClickGame = false;
              }, 2000)
            GameManager.getInstance().isChangeTable = true;
            this.onClickBack();
        }
        this.hide();
    },
    onClickMusic() {
        require('SoundManager1').instance.playButton();
        var music = cc.sys.localStorage.getItem("music");
        if (music === "off") music = "on";
        else music = "off";
        this.imgMusic.spriteFrame = (music === "on") ? this.imgOn : this.imgOff;
       cc.sys.localStorage.setItem("music", music);
        this.setPlaySound();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickMusic_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickSound() {
        require('SoundManager1').instance.playButton();
        var sound = cc.sys.localStorage.getItem("sound");
        if (sound === "off") sound = "on";
        else sound = "off";
        this.imgSound.spriteFrame = (sound === "on") ? this.imgOn : this.imgOff;
       cc.sys.localStorage.setItem("sound", sound);
        this.setPlaySound();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSound_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickGuide() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowGuide_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.hide();
        let curGameId =require('GameManager').getInstance().curGameId;
        if (curGameId === GAME_ID.SLOT100LINE || curGameId === GAME_ID.SLOT50LINE || curGameId === GAME_ID.SLOT_20_LINE ||curGameId === GAME_ID.SLOT_20_LINE_JP ) {
            require('GameManager').getInstance().gameView.onClickRule();
        } else {
            let guideGame = cc.instantiate(this.NodeGuidePf);
            guideGame.name = 'guideGame';
            require('UIManager').instance.instantiate_parent.addChild(guideGame);
        }
    },
    onDisable() {
        this.bg_option.node.stopAllActions();
    }
});