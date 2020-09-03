const GameManager = require("GameManager");
const UIManager = require("UIManager");

cc.Class({
  extends: cc.Component,

  properties: {
    lbName: {
      default: null,
      type: cc.Label
    },
    lbMoney: {
      default: null,
      type: cc.Label
    },

    lbId: cc.Label,

    lbTimeOnline: {
      default: null,
      type: cc.Label
    },
    avatar: {
      default: null,
      type: cc.Sprite
    },

    game_list_prefeb: require('NodeGameList'),

    skeFreeChip: {
      default: null,
      type: sp.Skeleton
    },
    btn_online: {
      default: null,
      type: cc.Button
    },
    // btn_ChatWorld: {
    //   default: null,
    //   type: cc.Button
    // },
    btn_cashOut: cc.Button,
    btn_sendGift: cc.Button,
    btn_giftCode: cc.Button,
    btn_newsBanner: cc.Node,
    btn_xoso : cc.Node,
    // _schedu: null,
    isUpVip: false,
    listJoin: {
      default: []
    },
    lbInfoChatWorld: cc.Label,
    lbContentChatWorld: cc.Label,
    bkgTop: {
      default: null,
      type: cc.Node
    },

    bkgBot: {
      default: null,
      type: cc.Node
    },


    // camera: {
    //   default: null,
    //   type: cc.Camera
    // },
    _isClickGame: true,
    _isShowFirstBanner: false,
    _checkMailFirtsTime: true,
    redDotMail: cc.Node,
    redDotFriend: cc.Node,
    isShowReddotMail: false,
  },

  onEnable() {
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    this.game_list_prefeb.setJackPot(GAME_ID.SLOT_20_LINE_JP, false);
    this.game_list_prefeb.setJackPot(GAME_ID.BINH, false);
    this.sendUpdateJackPot();

  },
  onDisable() {
    this.unscheduleAllCallbacks();
    cc.NGWlog("vao disable ");
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    this.initPosLb = this.lbName.node.position;
  },

  getInfoGame() {
    require('NetworkManager').getInstance().getPromotionInfo();
    // require('NetworkManager').getInstance().sendTopVipRequest();
    require('NetworkManager').getInstance().sendListFollowRequest();
    require('NetworkManager').getInstance().getChatWorld();
    //  require('NetworkManager').getInstance().getChatWorldVip();
    //   require('NetworkManager').getInstance().getInfoSafe();
    require('NetworkManager').getInstance().getMessList();
    require('NetworkManager').getInstance().getMail(11);
  },
  onClickTest() {
    require("NetworkManager").getInstance().onLogout();

  },
  startGame() {
    cc.NGWlog('chay vao gham StartGame');
    this.loadGameList();
    setTimeout(() => {
      this._isClickGame = false;
    }, 2500)
    this.setInfo();
    this.getInfoGame();
    this.scheduleOnce(() => {
      if (
        require("GameManager").getInstance().user.promotionDay > 0 &&
        require("GameManager").getInstance().user.listPromotionDay.length > 0
      ) {
        UIManager.instance.onShowDailyBonus();
      }
      let condi0 = require("GameManager").getInstance().user.vip === 0;
      let condi1 = (require("GameManager").getInstance().user.vip >= require("GameManager").getInstance().vip_rename);
      let condi2 = (require("GameManager").getInstance().user.vip == 1 && require("GameManager").getInstance().user.ag > require("GameManager").getInstance().ag_rename);
      let condi3 = (require("GameManager").getInstance().user.vip == 1 && require("GameManager").getInstance().user.ag < require("GameManager").getInstance().ag_rename_min);
      let condi4 = (require("GameManager").getInstance().user.uname.indexOf("fb.") != -1 || GameManager.getInstance().user.uname.indexOf("te.") != -1);
      if ((condi0 || condi1 || condi2 || condi3) && condi4) {
        cc.log("Mo register len cho tao.user name cua tao la:" + GameManager.getInstance().user.uname);
        UIManager.instance.onshowRegister();
      }



    }, 2)
    let music = cc.sys.localStorage.getItem("music");
    // cc.NGWlog('------> onShowMainView ', music);
    if (music === "on" || music === null) {
      cc.sys.localStorage.setItem("music", "on");
      require('SoundManager1').instance.playMusicBackground();
    } else {
      require('SoundManager1').instance.stopMusic();
    }
    var sound = cc.sys.localStorage.getItem("sound");
    if (sound === "on" || sound === null) {
      cc.sys.localStorage.setItem("sound", "on");
      require('SoundManager1').instance.turnOffSFX();
    } else require('SoundManager1').instance.turnOnSFX();
  },
  setInitBtn() {
    this.btn_giftCode.node.active = require('ConfigManager').getInstance().ismaqt;
    this.btn_sendGift.node.active = require('ConfigManager').getInstance().ketT;
    this.btn_cashOut.node.active = require('ConfigManager').getInstance().is_dt;
    this.btn_xoso.active = require('ConfigManager').getInstance().isXoSo;
  },
  testCase(even, data) {
    switch (data) {
      case "topgame":
        require("UIManager").instance.onShowTopGameId(8808);
        break;
      case "PM":
        require("GameManager").getInstance().typeShop = "wing"
        require("UIManager").instance.onShowShop();
        break;
    }

  },
  setInfo() {
    this.updateName();
    if (GameManager.getInstance().user.ag < 0) GameManager.getInstance().user.ag = 0;
    this.lbMoney.string = GameManager.getInstance().formatNumber(
      GameManager.getInstance().user.ag
    );

    cc.NGWlog('chay vao ham setInfo============================')
    this.setAvatar();
    this.lbId.string = 'ID: ' + GameManager.getInstance().user.id;
    this.scheduleOnce(() => {
      if (GameManager.getInstance().user.nmAg > 0 || Global.FreeChipView.countMailAg > 0) {
        require('GameManager').getInstance().onShowWarningDialog(
          require('GameManager').getInstance().getTextConfig('has_mail_show_gold'),
          DIALOG_TYPE.TWO_BTN,
          require('GameManager').getInstance().getTextConfig('txt_free_chip'),
          () => {
            require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickFreeChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
            require('UIManager').instance.onShowFreeChip();
          },
          GameManager.getInstance().getTextConfig("label_cancel")
        );
      }
    }, 1.0)
  },

  updateName() {
    //this.lbName.string = GameManager.getInstance().user.uname;
    this.lbName.string = GameManager.getInstance().user.displayName;
    this.lbName.node.stopAllActions();
    this.lbName.node.position = this.initPosLb;
    if (this.lbName.node.width > 170) {


      let offset = this.lbName.node.width - 160;

      let timer = offset / 60;

      let acMove1 = cc.moveTo(timer, -offset, 0);
      let acMove2 = cc.moveTo(timer, 0, 0);
      this.lbName.node.runAction(cc.repeatForever(cc.sequence(acMove1, acMove2, cc.delayTime(1.0))));
    }
  },
  addItemChatWorldMain(data) {
    let name = data.name_player;
    if (name.length > 10) {
      name = name.substring(0, 9) + "...";
    }
    this.lbInfoChatWorld.string = '[V' + data.vip_player + ']' + ' ' + name + ':';
    let content = data.content;
    if (content.length > 20) {
      content = content.substring(0, 18) + "...";
    }
    this.lbContentChatWorld.string = content;
  },
  updateChipAndSafe() {
    try {
      this.lbMoney.string = GameManager.getInstance().formatNumber(
        GameManager.getInstance().user.ag
      );
      // this.lbMoneySafe.string = GameManager.getInstance().formatNumber(
      //   GameManager.getInstance().user.agSafe
      // );
      // LobbyView.instance
      // if (Global.LobbyView !== null) {
      //   Global.LobbyView.updateChip();
      // }
    } catch (err) {
      cc.NGWlog("---------------DMMMMM  setTimeGetMone  " + err);
    }
  },
  onShowSendGift() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowGift_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowGift();
  },
  onShowTopGame() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowTopGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowTopGame();
  },
  loadGameList() {
    this.game_list_prefeb.init();
  },
  sendUpdateJackPot() {
    require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.BINH);
    require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.SLOT_20_LINE_JP);
    this.schedule(() => {
      if (!Global.LoginView.node.active) {
        require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.BINH);
        require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.SLOT_20_LINE_JP);
      }
    }, 10);
  },
  setAvatar() {
    let avtId = GameManager.getInstance().user.avtId;
    // let myName = require("GameManager").getInstance().user.uname;
    let myName = GameManager.getInstance().user.tinyURL;
    let vip = GameManager.getInstance().user.vip;
    this.avatar.node.getComponent("AvatarItem").loadTexture(avtId, myName, null, vip);
  },
  // đóng lại sử dụng chung vs chiponline
  // showFreeChipEffect() {
  //   this.skeFreeChip.node.active = true;
  //   this.skeFreeChip.setAnimation(0, "animation", false);
  //   this.skeFreeChip.setEndListener(() => {
  //     this.skeFreeChip.node.active = false;
  //   });
  // },

  setTimeGetMoney() {
    try {
      if (require("GameManager").getInstance().promotionInfo.time <= 0) {
        if (
          require("GameManager").getInstance().promotionInfo.online === 0 &&
          require("GameManager").getInstance().promotionInfo.agOnline > 0
        ) {
          require("NetworkManager").getInstance().sendPromotinOline();
          require("GameManager").getInstance().is_click_receive_chip_onl = false;
        } else if (
          require("GameManager").getInstance().promotionInfo.online > 0 &&
          require("GameManager").getInstance().promotionInfo.agOnline > 0) {
          require("NetworkManager").getInstance().sendPromotinOline();
          require("GameManager").getInstance().is_click_receive_chip_onl = false;
        }

        this.lbTimeOnline.node.color = new cc.color(255, 255, 25);
      }
      else {

        if (require("GameManager").getInstance().promotionInfo.time > 0) {
          this.lbTimeOnline.node.runAction(
            cc.repeatForever(
              cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(() => {
                  this.countDownTime();
                })
              )
            )
          );
          this.lbTimeOnline.node.color = new cc.color(255, 255, 255);
          require("GameManager").getInstance().is_click_receive_chip_onl = true;
        }

      }
    } catch (err) {
      cc.NGWlog("---------------DMMMMM  setTimeGetMoney  " + err);
    }
  },

  countDownTime() {
    try {
      if (require("GameManager").getInstance().promotionInfo.time <= 0) {
        require("NetworkManager").getInstance().sendPromotionInfo();
        this.lbTimeOnline.node.stopAllActions();
      } else {
        require("GameManager").getInstance().promotionInfo.time -= 1;

        var ho =
          Math.floor(
            (require("GameManager").getInstance().promotionInfo.time / 3600) %
            24
          ) + "";
        var mi =
          Math.floor(
            (require("GameManager").getInstance().promotionInfo.time / 60) % 60
          ) + "";
        var se =
          Math.floor(
            require("GameManager").getInstance().promotionInfo.time % 60
          ) + "";

        if (ho.length < 2) ho = "0" + ho;
        if (mi.length < 2) mi = "0" + mi;
        if (se.length < 2) se = "0" + se;

        var _time = ho + ":" + mi + ":" + se;
        if (this.lbTimeOnline !== null) {
          if (GameManager.getInstance().promotionInfo.onlineCurrent > GameManager.getInstance().promotionInfo.numberP - 1) {
            this.lbTimeOnline.string = 'Tomorow';
            this.lbTimeOnline.node.color = new cc.color(255, 255, 25);
          } else {
            this.lbTimeOnline.string = _time;
          }
        }

      }
    } catch (err) {
      cc.NGWlog("---------------DMMMMM  countDownTime  " + err);
      // clearInterval(MainView.instance._schedu);
    }
  },

  // update (dt) {},

  onClickAvatar() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowProfile_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowProfile();
    require('SoundManager1').instance.playButton();
    //  this.onClickSetting();
  },
  onClickSetting() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowSetting_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowSetting();
    require('SoundManager1').instance.playButton();
  },
  onClickLuckyNumber() {
    UIManager.instance.onShowLuckyNumber();
    require('SoundManager1').instance.playButton();
  },
  onClickSafe() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowKet_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowSafe();
    require('SoundManager1').instance.playButton();
  },
  onClickRank() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowRankGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowRankPopup();
    require('SoundManager1').instance.playButton();
  },
  onClickFeedBack() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowFeedback_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowFeedbackPopup();
    require('SoundManager1').instance.playButton();
  },
  onClickCallAdmin() {
    if (!require("ConfigManager").getInstance().is_bl_fb) {
      UIManager.instance.onShowFeedbackPopup();
    } else {
      if (cc.sys.os === cc.sys.OS_ANDROID)
        this.onClickChatAdmin();
      else if (cc.sys.os === cc.sys.OS_IOS)
        cc.sys.openURL('https://m.me/'+require("GameManager").getInstance().fanpageID);
    }
    require('SoundManager1').instance.playButton();
  },
  onClickTopRich() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowTopRich_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    UIManager.instance.onShowTopRich();
  },
  onClickMail() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowMail_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    UIManager.instance.onShowMail();
  },
  onClickFriend() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowFriendList_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    UIManager.instance.onShowFriendView();
  },
  onClickShop() {
    // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowShop();
    require('SoundManager1').instance.playButton();
  },
  onClickFreechip() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowFreeChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowFreeChip();
    require('SoundManager1').instance.playButton();
  },
  onClickGiftCode() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowGiftCode_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    UIManager.instance.onShowGiftcode();
  },
  onClickTimeOnline() {
    require('SoundManager1').instance.playButton();
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTimeOnline_%s", require('GameManager').getInstance().getCurrentSceneName()));
    if (GameManager.getInstance().is_click_receive_chip_onl === true) {
      if (GameManager.getInstance().promotionInfo.numberP === 0) return;
      UIManager.instance.onShowChipOnline();
    } else {
      require("NetworkManager").getInstance().sendPromotinGold(3, require("GameManager").getInstance().promotionInfo.online);
    }
  },
  onClickCashOut() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowExchange_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    UIManager.instance.onShowCashOut();
  },
  onClickChatWorld() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowChatWorld_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowChatWorld();
  },

  onClickPlaynow() {
    // GameManager.getInstance().curGameId = GAME_ID.BURMESE_POKER;
    // GameManager.getInstance().curGameId = GAME_ID.SHAN_PLUS;
    // require("NetworkManager")
    //   .getInstance()
    //   .sendSelectGame(GameManager.getInstance().curGameId);
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickPlayNow_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    require("NetworkManager")
      .getInstance()
      .sendPlayNow(GameManager.getInstance().curGameId);
  },
  onClickJoinTable() {
    // GameManager.getInstance().curGameId = GAME_ID.BURMESE_POKER;
    require('SoundManager1').instance.playButton();
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickJoinTable_%s", require('GameManager').getInstance().getCurrentSceneName()));
    GameManager.getInstance().curGameId = GAME_ID.SHAN_PLUS;
    require("NetworkManager")
      .getInstance()
      .sendCreateTable(2000);
  },
  MoneyBonusFly(data) {
    this.lbTimeOnline.string = "";
    let money = cc.instantiate(this.lbTimeOnline.node).getComponent(cc.Label);
    money.string = GameManager.getInstance().formatNumber(data);
    UIManager.instance.showAnimChipOnline(GameManager.getInstance().formatNumber(data));
    require('GameManager').getInstance().user.ag = require('GameManager').getInstance().user.ag + data;

    this.btn_online.node.addChild(money.node);
    let pos = this.lbMoney.node.convertToWorldSpaceAR(this.lbMoney.node.position);
    pos = this.btn_online.node.convertToNodeSpace(pos);
    money.node.runAction(
      cc.sequence(cc.moveTo(0.6, cc.v2(pos.x, -60)), cc.callFunc(() => {
        this.lbMoney.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1.0)), cc.callFunc(() => {
          // si cmt tam (tai sao no k chay vao day?)
          //this.updateChipAndSafe(); 
        }));
      }), cc.removeSelf())
    );

    this.lbMoney.node.runAction(cc.sequence(cc.delayTime(0.7), cc.callFunc(() => {
      this.lbMoney.string = GameManager.getInstance().formatNumber(GameManager.getInstance().user.ag);
    })))
  },
  onClickShowVip() {
    // var item = cc.instantiate(this.item_helpvip).getComponent("HelpVipView");
    //this.node.addChild(item.node);
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowVip_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    UIManager.instance.onShowHelpVip();
  },
  onClickShowMission() {
    require('SoundManager1').instance.playButton();
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowMission_%s", require('GameManager').getInstance().getCurrentSceneName()));
    UIManager.instance.onShowMission();
  },
  onClickVerifySDT() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickVerify_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    require("Util").onVeryPhone();
  },
  onClickChatAdmin() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowMessageFacebook_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    // if (cc.sys.os === cc.sys.OS_ANDROID)
    //   require("Util").onChatAdmin();
    // else if (cc.sys.os === cc.sys.OS_IOS)
    //   cc.sys.openURL(require("GameManager").getInstance().u_chat_fb);
    cc.sys.openURL('https://m.me/' + require("ConfigManager").getInstance().fanpageID);
  },
  onclickMask() {
    cc.NGWlog('clicked');
  },
  onUpdateJackPot(gameId) {
    this.game_list_prefeb.setJackPot(gameId);
  },
  showListBanner() {
    require("UIManager").instance.onShowListBaner();
  }
});
