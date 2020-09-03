//var GameManager =  require('GameManager');
const ProcessLoad = require("ProcessLoad");
var UIManager = cc.Class({
  extends: cc.Component,

  // name: "UIManager",

  properties: {


    process_load: {
      default: null,
      type: ProcessLoad
    },
    loadingBar: require('LoadingBar'),

    listFrameCard: {
      default: null,
      type: cc.SpriteAtlas
    },

    instantiate_parent: {
      default: null,
      type: cc.Node
    },

    bkg_black: {
      default: null,
      type: cc.SpriteFrame
    },
    btn_close: {
      default: null,
      type: cc.SpriteFrame
    },
    btn_normal: {
      default: null,
      type: cc.SpriteFrame
    },

    time_enter_background: -1,
    fontAdd: {
      default: null,
      type: cc.BitmapFont
    },
    fontSub: {
      default: null,
      type: cc.BitmapFont
    },
    cameraRender: {
      default: null,
      type: require("textureRender")
    },
    isShowLobbyView: false,
    text_Config: {
      default: [],
      type: [cc.JsonAsset]
    },
    arrayDataBanner: [],
    indexCurrentDataBanner: 0,
    isLoadedMain: false,
    avatarList: cc.SpriteAtlas,
    Pr_ChipOnline: cc.Prefab,
    sp_ChipOnline: sp.SkeletonData,
    webViewPr: cc.Prefab,
    dialog_util: cc.Prefab,
    _curentLoad: 0,
    alertView: require("AlertView"),
    arrayDataBannerIO: [],
    indexCurrentDataBannerIO: 0,
    arrayIDBannerShowed: [],
    arrayIDBannerClickedInType7: [],
    arrBannerNotShowGame: [],
    arrBanerOnList: [],
    listIdBannerViewed: [],
    CAfile: {
      type: cc.Asset,
      default: null
    },
  },
  statics: {
    instance: null
  },
  onLoad() {
    //cc.sys.localStorage.clear();
    // cc.game.setFrameRate(50);
    if (require("ConfigManager").getInstance().isShowLog)
      cc.NGWlog = console.log
    else
      cc.NGWlog = cc.log;
    UIManager.instance = this;
    this.node.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
    if (cc.sys.isBrowser) {
      require('LoadConfig').getInstance().getConfigInfo();
    }
    require('Util').getVersionId();
    require('Util').getGetDeviceId();
    let langLocal = cc.sys.localStorage.getItem("language_client");

    if (!langLocal)
      cc.sys.localStorage.setItem("language_client", LANGUAGE_TEXT_CONFIG.LANG_EN);

    require("GameManager").getInstance().initConfigText();
    require("GameManager").getInstance().getGameIdSeverIp();

    Global.CApem = this.CAfile.nativeUrl;
    if (cc.loader.md5Pipe) {
      Global.CApem = cc.loader.md5Pipe.transformURL(url);
    }

    if (!cc.sys.isNative) {
      this.nextStep();
    }
    require("Util").getCarrierName();
  },
  onDestroy() {
    cc.NGWlog("==== bi destroy==");
  },
  creatPoolItem() {
    this.lobbyItemPool = new cc.NodePool();
    this.topRichPool = new cc.NodePool();
    this.topGamePool = new cc.NodePool();
    this.friendViewPool = new cc.NodePool();
    this.avtPool = new cc.NodePool();
    //pool nay add o onload mainview nhe!
    this.mailViewPool = new cc.NodePool();
    this.freeChipPool = new cc.NodePool();
    this.dailyPool = new cc.NodePool('DailyBonusItem');
    this.playerViewPool = new cc.NodePool('PlayerViewCasino');
    this.historyGiftPool = new cc.NodePool('HistoryGiftPool');
    this.historyJackPotPool = new cc.NodePool('HistoryJackPotPool');
  },
  initPrefab() {
    var _this = this;
    this.loadingBar.is_load_update = false;
    this.loadingBar.setProgress(0);
    cc.NGWlog("chay vao loaddong");
    cc.loader.loadResDir('prefabsPopup', (cpCount, totalCount) => {
      let temp = cpCount / totalCount;
      if (temp > this._curentLoad) {
        // cc.NGWlog("====== cpocunt: " + (cpCount / totalCount));
        this._curentLoad = temp;
        this.loadingBar.setProgress(temp);
      }
    }, (err, _prefab) => {
      if (err) {
        cc.NGWlog("Load faile cmnr!!!");
        console.error(err);
      }
      cc.NGWlog("load xong===========" + _prefab.length);
      cc.loader.loadRes('prefabsPopup/AvatarItem', (er, prefab) => {
        Global.Avatar = cc.instantiate(prefab).getComponent('AvatarItem');
      })
      cc.loader.loadRes('prefabsPopup/Card', (er, prefab) => {
        Global.Card = cc.instantiate(prefab).getComponent("Card");
      })
      cc.loader.loadRes('prefabsPopup/CashOutView', (er, prefab) => {
        Global.CashOutView = cc.instantiate(prefab).getComponent('CashOutView');
      })
      cc.loader.loadRes('prefabsPopup/ChangeNamePopup', (er, prefab) => {
        Global.RegisterPopup = cc.instantiate(prefab).getComponent('RenamePopup');
      })
      cc.loader.loadRes('prefabsPopup/ChatWorldView', (er, prefab) => {
        Global.ChatWorldView = cc.instantiate(prefab).getComponent('ChatWorldView');
      })
      cc.loader.loadRes('prefabsPopup/ChipOnline', (er, prefab) => {
        Global.ChipOnline = cc.instantiate(prefab).getComponent('ChipOnline');
      })
      cc.loader.loadRes('prefabsPopup/DailyBonusItemCam', (er, prefab) => {
        Global.ItemDaily = cc.instantiate(prefab).getComponent("DailyBonusItem");
      })
      cc.loader.loadRes('prefabsPopup/DailyBonus', (er, prefab) => {
        Global.DailyBonusView = cc.instantiate(prefab).getComponent("DailyBonus");
      })
      cc.loader.loadRes('prefabsPopup/FeedbackPopup', (er, prefab) => {
        Global.FeedBackView = cc.instantiate(prefab).getComponent('FeedbackView');
      })
      cc.loader.loadRes('prefabsPopup/FreeChipItem', (er, prefab) => {
        Global.ItemFreeChip = cc.instantiate(prefab).getComponent('FreeChipItem');
      })
      cc.loader.loadRes('prefabsPopup/FreeChip', (er, prefab) => {
        Global.FreeChipView = cc.instantiate(prefab).getComponent('FreeChipView');
      })
      cc.loader.loadRes('prefabsPopup/FriendView', (er, prefab) => {
        Global.FriendPopView = cc.instantiate(prefab).getComponent('FriendView');
      })
      cc.loader.loadRes('prefabsPopup/GiftView', (er, prefab) => {
        Global.GiftView = cc.instantiate(prefab).getComponent('GiftView');
      })
      cc.loader.loadRes('prefabsPopup/GiftcodePopup', (er, prefab) => {
        Global.GiftCodePop = cc.instantiate(prefab).getComponent('Giftcode');
      })
      cc.loader.loadRes('prefabsPopup/GroupOptionInGame', (er, prefab) => {
        Global.GroupOptionInGame = cc.instantiate(prefab).getComponent('GroupOptionInGameViewCasino');
      })
      cc.loader.loadRes('prefabsPopup/InfoFriendView', (er, prefab) => {
        Global.FriendProfilePop = cc.instantiate(prefab).getComponent('FriendProfileView');
      })
      cc.loader.loadRes('prefabsPopup/InfoPlayerView', (er, prefab) => {
        Global.InfoPlayerView = cc.instantiate(prefab).getComponent('InfoPlayerView');
      })
      cc.loader.loadRes('prefabsPopup/ItemBetRoom', (er, prefab) => {
        Global.ItemLobby = cc.instantiate(prefab).getComponent('ItemBetRoomView');
      })
      cc.loader.loadRes('prefabsPopup/ItemFriendView', (er, prefab) => {
        Global.ItemFriend = cc.instantiate(prefab).getComponent('ItemFriendView');
      })
      cc.loader.loadRes('prefabsPopup/ItemHistoryJackPot', (er, prefab) => {
        Global.ItemHistoryJackPot = cc.instantiate(prefab).getComponent('ItemHistoryJackPot');
      })
      cc.loader.loadRes('prefabsPopup/ItemTopRich', (er, prefab) => {
        Global.ItemRich = cc.instantiate(prefab).getComponent('TopRichItem');
      })
      cc.loader.loadRes('prefabsPopup/LobbyView', (er, prefab) => {
        Global.LobbyView = cc.instantiate(prefab).getComponent('LobbyView');
      })
      cc.loader.loadRes('prefabsPopup/MailItem', (er, prefab) => {
        Global.ItemMail = cc.instantiate(prefab).getComponent('MailItem');
      })
      cc.loader.loadRes('prefabsPopup/MailPopup', (er, prefab) => {
        Global.MailView = cc.instantiate(prefab).getComponent('MailView');
      })
      cc.loader.loadRes('prefabsPopup/PlayerViewBlackJack', (er, prefab) => {
        Global.PlayerView = cc.instantiate(prefab).getComponent("PlayerViewCasino");
      })
      cc.loader.loadRes('prefabsPopup/ProfilePopup', (er, prefab) => {
        Global.ProfileView = cc.instantiate(prefab).getComponent('ProfilePopup');
      })
      cc.loader.loadRes('prefabsPopup/QuickChatCasino', (er, prefab) => {
        Global.QuickChatCasino = cc.instantiate(prefab).getComponent('QuickChatCasino');
        Global.QuickChatCasino.initQuickChatEmo();
      })
      cc.loader.loadRes('prefabsPopup/Setting', (er, prefab) => {
        Global.SettingPopView = cc.instantiate(prefab).getComponent('Settings');
      })
      cc.loader.loadRes('prefabsPopup/ShopView2', (er, prefab) => {
        Global.ShopView = cc.instantiate(prefab).getComponent('ShopView2');
      })
      cc.loader.loadRes('prefabsPopup/TopGameItem', (er, prefab) => {
        Global.TopGameItem = cc.instantiate(prefab).getComponent('TopGameItem');
      })
      cc.loader.loadRes('prefabsPopup/TopGamePopup', (er, prefab) => {
        Global.TopGameView = cc.instantiate(prefab).getComponent('TopGamePopup');
      })
      cc.loader.loadRes('prefabsPopup/TopRichPopup', (er, prefab) => {
        Global.TopRichView = cc.instantiate(prefab).getComponent('TopRichPopup');
      })
      cc.loader.loadRes('prefabsPopup/itemHistoryGift', (er, prefab) => {
        Global.ItemHisGift = cc.instantiate(prefab).getComponent('ItemHistoryGift');
      })
      cc.loader.loadRes('prefabsPopup/Baner', (er, prefab) => {
        Global.NodeBaner = cc.instantiate(prefab);
      })
      cc.loader.loadRes('prefabsPopup/LuckyNumber', (er, prefab) => {
        Global.LuckyNumberView = cc.instantiate(prefab).getComponent('LuckyNumberView');
      })
      cc.loader.loadRes('prefabsPopup/HistoryLoto', (er, prefab) => {
        Global.HistoryLoto = cc.instantiate(prefab).getComponent('HistoryLoto');
      })
      cc.loader.loadRes('prefabsPopup/ListBaner', (er, prefab) => {
        Global.ListBaner = cc.instantiate(prefab);
      })


      cc.loader.loadRes('game/default_avatar_1', cc.SpriteFrame, (er, spr) => {
        this.avt_default = spr;
      })
      cc.director.loadScene("main");
      //   this.node.addChild(cc.instantiate(prefab[7]) );
      if (cc.sys.os === cc.sys.OS_IOS && require("GameManager").getInstance().statePoay == false) return;

    })
  },
  nextStep() {
    if (require("HotUpdate").instance != null) {
      require("HotUpdate").instance.node.destroy();
    }

    if (cc.sys.isNative) require("Util").getInfoDeviceSML();
    if (Global.TimeOpenApp == null) {
      Global.TimeOpenApp = Date.now();
    }
    this.isSendEmitLogin = true;
    cc.game.addPersistRootNode(this.node);

    this.bau_cua_game_view = null;
    this.myanmar_13_poker = null;
    this.blackJackGameViewPf = null;
    this.Bork_GameView = null;
    this.show_game_view = null;
    this.Slot_100Line = null;
    this.Slot_50Line = null;
    this.Slot_machine = null;
    this.TienLen_GamView = null;
    this.initPrefab();
    var _this = this;
    cc.game.on(cc.game.EVENT_HIDE, function () {
      cc.NGWlog("EVENT HIDE!");
      _this.time_enter_background = Math.round(Date.now() / 1000);
      cc.NGWlog("time hide = " + _this.time_enter_background);
      require("GameManager").getInstance().is_on_background = true;

      _this.pushLocalNotiOff();
    });
    // For event when the app entering foreground
    cc.game.on(cc.game.EVENT_SHOW, function () {
      if (_this.time_enter_background > 0) {
        cc.NGWlog("EVENT SHOW!");
        var _time = Math.round(Date.now() / 1000);
        cc.NGWlog("time hide = " + _time);
        var time_out_bg = _time - _this.time_enter_background;
        _this.time_enter_background = 0;
        require("GameManager").getInstance().time_out_game = time_out_bg;
        cc.NGWlog('onShow=============================')
        let listGame = [GAME_ID.TIENLEN, GAME_ID.BINH];
        if (require("GameManager").getInstance().gameView && (listGame.includes(require("GameManager").getInstance().curGameId))) {
          require("GameManager").getInstance().onReconnect();
        }
        else if ((require("GameManager").getInstance().curGameId == GAME_ID.BAUCUA && time_out_bg > 10 && require("GameManager").getInstance().gameView !== null)
          || (require("GameManager").getInstance().curGameId == GAME_ID.BACCARAT && time_out_bg > 10 && require("GameManager").getInstance().gameView !== null)
          || (require("GameManager").getInstance().curGameId == GAME_ID.SESKU && time_out_bg > 10 && require("GameManager").getInstance().gameView !== null)
          || time_out_bg > 60) {
          require("GameManager").getInstance().onReconnect();
        }
        else if ((require("GameManager").getInstance().gameView !== null && time_out_bg > 20) || time_out_bg > 60) {
          cc.NGWlog('may bi bay ra roi`=========================================================');
          require("GameManager").getInstance().onReconnect();
        }
      }
      // if (require("GameManager").getInstance().gameView != null)
      //   require("GameManager").getInstance().onReconnect();
    });


    // var dle = new require("DelayEvt");
    // dle.timeDelay = 0;
    // dle.vectorGTP = [];
    // require("GameManager").getInstance().vectorDelay.push(dle);
    // this.schedule(() => {
    //   require("GameManager").getInstance().scheduleUpdateTime(0.1)
    // }, 0.1);

    //======Create Item Chat World Pool=========/
    this.listDialog = [{}, {}, {}];
    this.creatPoolItem();
    this.instantiate_parent.on("child-added", () => {
      this.alertView.setPosAlert();
    });
    this.instantiate_parent.on("child-removed", () => {
      this.alertView.setPosAlert();
    })
    this.onLoadCardPlist();
  },
  onShowMainView() {
    cc.NGWlog("Chay vao on show mainview");
    Global.MainView.lbMoney.string = require('GameManager').getInstance().formatNumber(
      require('GameManager').getInstance().user.ag
    );
    require('NetworkManager').getInstance().sendPromotionInfo();
    cc.director.getScene().getChildByName('Canvas').insertChild(Global.MainView.node, 1);
    Global.MainView.node.active = true;

    require('UIManager').instance.alertView.setPosAlert();
    let smlSIO = require("SMLSocketIO").getInstance();
   
  },
  onLogout() {
    this.node.stopActionByTag(1);
    this.arrBanerOnList.length = 0;
    Global.MainView.btn_newsBanner.active = false;
    if (require("GameManager").getInstance().currentView == CURRENT_VIEW.LOGIN_VIEW) { cc.NGWlog("ko chay logout== "); return; }
    this.resetDataUser();
    require("UIManager").instance.onHideView(Global.MainView.node);
    this.instantiate_parent.removeAllChildren(false);
    this.removeAllBanner();
    this.listIdBannerViewed.length = 0;
    require("NetworkManager").getInstance().onLogout();
    Global.LoginView.node.active = true;
  },
  resetDataUser() {
    if (require("GameManager").getInstance().gameView != null) {
      if (require("GameManager").getInstance().gameView.node != null) {
        require("GameManager").getInstance().gameView.cleanGame();
        require("GameManager").getInstance().gameView.node.destroy();
        require('GameManager').getInstance().gameView = null;
        cc.NGWlog('chay vao hamlogout ben manager');
      }
    }

    Global.TopGameView.resetOnLogOut();
    Global.TopRichView.resetOnLogOut();
    require('HandleGamePacket').listEvt.length = 0;
    require('NetworkManager').getInstance().listEvtGame.length = 0;
  },


  onShowGame() {
    Global.MainView.game_list_prefeb.isChoosingGame = false;
    Global.LobbyView.isReconnectGame = false;
    this.removeAllPopup();
    this.removeAllBanner();
    if (require("GameManager").getInstance().gameView != null) return;
    require("GameManager").getInstance().gameView = {};
    let curGame = parseInt(require("GameManager").getInstance().curGameId);
    require("GameManager").getInstance().curGameViewId = curGame
    require("GameManager").getInstance().setCurView(curGame);
    // console.log("gia tri game la=== " + );
    if (typeof GAME_INFO[curGame] == "undefined") {
      require("GameManager").getInstance().onShowConfirmDialog("Erro Join Game. Please try again ");
      this.onHideLoad();
      this.onShowLobbyView();
      this.onShowMainView();
      return;
    }
    cc.loader.loadRes(GAME_INFO[curGame].urlAssets, (err, prefab) => {
      let item = cc.instantiate(prefab).getComponent(GAME_INFO[curGame].component);
      require("GameManager").getInstance().gameView = item
      this.instantiate_parent.addChild(item.node);
      this.removeAllBanerShowGame();
      this.onHideView(Global.MainView.node);
      this.onHideView(Global.LobbyView.node);
      require('NetworkManager').getInstance().playGame();
      this.onHideLoad();
    })
  },
  removeAllPopup() {
    let length = this.instantiate_parent.childrenCount;
    for (let i = 0; i < length; i++) {
      let child = this.instantiate_parent.children[i];
      if (child && child.getTag() == TAG.POPUP) {
        this.instantiate_parent.removeChild(child, true);
        i--;
      }
    }
  },
  removeAllBanner() {
    //  return;//cai nay hoi hien
    let length = this.node.childrenCount;
    for (let i = 0; i < length; i++) {
      let child = this.node.children[i];
      if (child && child.getTag() == TAG.BANNER) {
        this.node.removeChild(child, true);
        child.destroy();
        i--;
      }
    }
  },
  onShowLoad(string = "Connecting") {
    this.process_load.node.active = true;
    this.process_load.onShow(string);
  },
  onHideLoad() {
    this.process_load.node.active = false;
  },
  onLoadCardPlist() {
    try {
      cc.loader.loadRes(ResDefine.card_plist, cc.SpriteAtlas, function (
        err,
        data
      ) {
        if (err !== null) {
          cc.NGWlog("======>onLoadCardPlist " + error);
          return;
        }
        UIManager.instance.listFrameCard = data;
        // cc.NGWlog('=======>onLoadCardPlist Done');
        // cc.NGWlog(UIManager.instance.listFrameCard);
      });
    } catch (err) {
      cc.NGWlog("=======>onLoadCardPlist " + err);
    }
  },

  showToast(message) {
    if (message === "") return;
    var _this = this;
    cc.NGWlog("-------------------------");
    var siz = cc.view.getVisibleSize();
    var toast = new cc.Node("Sprite");
    toast.setContentSize(siz.width * 0.6, 60);
    _this.instantiate_parent.addChild(toast, 1000);
    var sp = toast.addComponent(cc.Sprite);
    sp.type = cc.Sprite.Type.SLICED;
    sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    require("GameManager")
      .getInstance()
      .loadTexture(sp, ResDefine.bkg_black);

    var nnoLa = new cc.Node("Label");
    var lb = nnoLa.addComponent(cc.Label);
    lb.fontSize = 30;
    lb.lineHeight = 30;
    lb.isSystemFontUsed = true;
    lb.string = message;
    toast.addChild(lb.node);

    //   toast.cascadeOpacity = true;
    toast.opacity = 0;
    toast.runAction(
      cc.sequence(
        cc.fadeIn(0.5),
        cc.delayTime(1.0) /*, cc.fadeOut(.5)*/,
        cc.callFunc(() => {
          toast.destroy();
        })
      )
    );
  },
  onShowConfirmDialog(message, func_1 = null) {
    var dialogPre = cc.instantiate(this.dialog_util, cc.macro.MAX_ZINDEX - 10);
    var dialog = dialogPre.getComponent("DialogUtil");
    dialog.setContent(message);
    dialog.setNameButton(
      require("GameManager")
        .getInstance()
        .getTextConfig("ok")
    );
    dialog.setFunctionCallBack(func_1, null, null);
    this.node.addChild(dialogPre);
    // dialog.onPopOn();
    cc.log("onShowConfirmDialog===message=" + message);
    return dialog;
  },
  updateChipUser() {
    Global.MainView.updateChipAndSafe();
    if (Global.LobbyView.node.getParent() != null) {
      Global.LobbyView.updateChip();
    }
    if (Global.ProfileView.node.getParent() != null) {
      Global.ProfileView.updateChip();
    }
    if (Global.ShopView.node.getParent() != null) {
      Global.ShopView.updateChip();
    }
    if (Global.CashOutView.node.getParent() != null) {
      Global.CashOutView.updateChip();
    }
    let CurGameView = require('GameManager').getInstance().gameView;
    if (CurGameView !== null) {
      CurGameView.thisPlayer.ag = require('GameManager').getInstance().user.ag;
      CurGameView.thisPlayer.updateMoney();
    }
  },
  /**
   *
   * message - Noi dung
   * dialogType - Kieu dialog: 1 Nut, 2 Nut, 3 Nut
   * nameBtn1 - Nhan~ Nut 1
   * func_1 - function callback Nut 1
   * nameBtn2 = '' - Nhan~ Nut 2
   * func_2 = null - function callback Nut 2
   * nameBtn3 = '' - Nhan~ Nut 3
   * func_3 = null - function callback Nut 3
   *
   */
  onShowWarningDialog(
    message,
    dialogType,
    nameBtn1,
    func_1,
    nameBtn2 = "",
    func_2 = null,
    nameBtn3 = "",
    func_3 = null
  ) {
    var dialogPre = cc.instantiate(this.dialog_util);
    var dialog = dialogPre.getComponent("DialogUtil");

    this.instantiate_parent.addChild(dialogPre);
    //  dialog.onPopOn();
    dialog.setType(dialogType);
    dialog.setContent(message);
    dialog.setNameButton(nameBtn1, nameBtn2, nameBtn3);
    dialog.setFunctionCallBack(func_1, func_2, func_3);
    return dialog;
  },
  onShowWarningDialogDelayFunc(message, time, func, isdelay) {
    var dialogPre = cc.instantiate(this.dialog_util);
    var dialog = dialogPre.getComponent("DialogUtil");
    this.instantiate_parent.addChild(dialogPre);
    dialog.setType(DIALOG_TYPE.NO_BTN);
    dialog.setContent(message);
    dialog.setFunctionDelay(time, func, isdelay);
  },
  /**
   *
   * message - Noi dung
   * dialogType - Kieu dialog: 1 Nut, 2 Nut, 3 Nut
   * nameBtn1 - Nhan~ Nut 1
   * func_1 - function callback Nut 1
   * nameBtn2 = '' - Nhan~ Nut 2
   * func_2 = null - function callback Nut 2
   * nameBtn3 = '' - Nhan~ Nut 3
   * func_3 = null - function callback Nut 3
   * timeDelay = -1 - Thoi gian delay dialog, < 0 la ko lam gi
   * delayType = 0 - Het thoi gian de lay se goi function: 1, 2, 3, = 0 la close
   *
   */
  onShowWarningDialogHasDelayTime(
    message,
    dialogType,
    nameBtn1,
    func_1,
    nameBtn2 = "",
    func_2 = null,
    nameBtn3 = "",
    func_3 = null,
    timeDelay = 0,
    delayType = 0
  ) {
    var dialogPre = cc.instantiate(this.dialog_util, cc.macro.MAX_ZINDEX - 10);
    this.node.addChild(dialogPre);
    var dialog = dialogPre.getComponent("DialogUtil");
    //  dialog.onPopOn();
    dialog.setType(dialogType);
    dialog.setContent(message);
    dialog.setNameButton(nameBtn1, nameBtn2, nameBtn3);
    dialog.setFunctionCallBack(func_1, func_2, func_3);
    dialog.setDelayTime(timeDelay, delayType);
    return dialog;
  },

  onHideView(node, isShowMainView = false) {
    if (node.parent != null) {
      node.removeFromParent(false);
      cc.NGWlog('tat main view===========================================');
    }

    if (isShowMainView) {
      cc.NGWlog("===============hihihi onHideView UIMA");
      this.onShowMainView();
    }
  },
  initPrefabGameView(index, prefab) {
    // _this.Bork_GameView = itemPrefab.Bork_GameView
    // _this.Slot_machine = itemPrefab.Slot_machine
    // _this.Slot_100Line = itemPrefab.Slot_100Line
    // _this.bau_cua_game_view = itemPrefab.bau_cua_game_view
    // _this.myanmar_13_poker = itemPrefab.myanmar_13_poker
    // _this.TienLen_GamView = itemPrefab.TienLen_GamView
    // _this.show_game_view = itemPrefab.show_game_view
    // _this.blackJackGameViewPf = itemPrefab.blackJackGameViewPf
    switch (index) {
      case 0:
        this.bau_cua_game_view = prefab;
        break;
      case 1:
        this.myanmar_13_poker = prefab;
        break;
      case 2:
        this.blackJackGameViewPf = prefab;
        break;
      case 3:
        this.Bork_GameView = prefab;
        break;
      case 4:
        this.show_game_view = prefab;
        break;
      case 5:
        this.Slot_100Line = prefab;
        break;
      case 6:
        this.Slot_machine = prefab;
        break;
      case 7:
        this.TienLen_GamView = prefab;
        break;
      case 8:
        this.Slot_50Line = prefab;
        break;
      // case 8:
      //     this.bau_cua_game_view = prefab;
      // break;
      // case 9:
      // break;

    }
  },
  onShowLobbyView() {
    cc.NGWlog('==============lobby uimanager ');
    //  require('GameManager').getInstance().isChooseGame = true;
    let nodeGuide = require('UIManager').instance.instantiate_parent.getChildByName('guideGame');
    if (nodeGuide) {
      nodeGuide.getComponent('SetGuide').onClickClose();
    }
    var curid = require('GameManager').getInstance().curGameId;
    if (require('GameManager').getInstance().isChangeTable) {
      if (GAME_INFO[curid].isPlayNow) {
        require('NetworkManager').getInstance().sendPlayNow(curid);
      }
      else {
        require('NetworkManager').getInstance().sendChangeTable(require('GameManager').getInstance().table_mark, require('GameManager').getInstance().tableId);
      }
      require('GameManager').getInstance().isChangeTable = false;
    }
    if (GAME_INFO[curid].isPlayNow || require('GameManager').getInstance().user.vip < 1) {
      if (require("GameManager").getInstance().user.ag <= 0) {
        if (require("GameManager").getInstance().currentView !== CURRENT_VIEW.GAMELIST_VIEW) // tu trong game back ra thi show.
          Global.LobbyView.showPopupWhenLostChip(true);
      }
      this.onShowMainView();
      cc.NGWlog('onShowGameMain');
      return;
    };
    // if (Global.LobbyView.ltv_data_list.length < 1) return;
    this.onHideView(Global.MainView.node);
    Global.LobbyView.node.parent = this.instantiate_parent
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.LOBBY);
    require('UIManager').instance.alertView.setPosAlert();
  },
  //--------------------------Popup--------------------------//
  onShowTopRich: function () {
    if (Global.TopRichView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.TopRichView.node);
    Global.TopRichView.onIn();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.TOPRICH_VIEW);
  },

  onShowSetting() {
    if (Global.SettingPopView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.SettingPopView.node);
    Global.SettingPopView.onMoveOut();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.SETTING_VIEW);
  },
  onShowLuckyNumber() {
    if (Global.LuckyNumberView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.LuckyNumberView.node);
      Global.LuckyNumberView.setInfo();
  },
  onShowFindProfile(data) {
    cc.log("data friend la== " + JSON.stringify(data));
    var _name = data.nameLQ.length > 0 ? data.nameLQ : data.name;
    data._name = _name;
    this.instantiate_parent.addChild(Global.FriendProfilePop.node);
    Global.FriendProfilePop.init(data);
  },
  onShowSafe() {
    if (Global.SafeView.node.getParent() === null) {
      this.instantiate_parent.addChild(Global.SafeView.node);
    }
    Global.SafeView.onPopOut();
  },

  onShowFreeChip() {
    if (Global.FreeChipView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.FreeChipView.node);
    Global.FreeChipView.setInfo();
    Global.FreeChipView.onMoveOut();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.FREECHIP_VIEW);
  },

  onShowProfile() {
    if (Global.ProfileView.node.getParent() === null) {
      this.instantiate_parent.addChild(Global.ProfileView.node);
    }
    Global.ProfileView.setInfo();
    Global.ProfileView.onMoveOut();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.PROFILE_VIEW);
  },

  onshowRegister() {
    if (Global.RegisterPopup.node.getParent() === null) {
      this.instantiate_parent.addChild(Global.RegisterPopup.node);
    }
    Global.RegisterPopup.setInfo();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.REGISTER_VIEW);
  },

  onShowMail() {
    this.onHideView(Global.MainView.node);
    if (Global.MailView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.MailView.node);
    Global.MailView.setInfo();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.MAIL);
  },


  onShowChatWorld() {
    if (Global.ChatWorldView.node.getParent() === null) this.instantiate_parent.addChild(Global.ChatWorldView.node);
    Global.ChatWorldView.moveUp();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.CHATWORLD);
  },
  onShowGiftcode() {
    var popupPre = cc.instantiate(Global.GiftCodePop.node);
    this.instantiate_parent.addChild(popupPre);
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.GIFT_CODE_VIEW);
  },
  onShowChipOnline() {
    if (Global.ChipOnline.node.getParent() === null) {
      this.instantiate_parent.addChild(Global.ChipOnline.node);
    }
    Global.ChipOnline.setInfo();
    Global.ChipOnline.onIn();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.COUNTDOWN);
  },
  onShowFriendView() {
    if (Global.FriendPopView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.FriendPopView.node);
    Global.FriendPopView.setInfo();
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.FRIEND_VIEW);
  },

  onShowUserInfo(data) {
    if (Global.InfoPlayerView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.InfoPlayerView.node);
    //  require("GameManager").getInstance().gameView.node.addChild(Global.InfoPlayerView.node,999);
    Global.InfoPlayerView.init(data);
  },

  onShowFriendInfo() {
    var popupPre = cc.instantiate(Global.InfoPlayerView);
    this.instantiate_parent.addChild(popupPre);
  },

  // onShowRecieveChip(message) {
  //   var popupPre = cc.instantiate(this.Recieve_chip_popup);
  //   popupPre.getComponent("RecieveChipPopup").lb_notification.string = message;
  //   this.instantiate_parent.addChild(popupPre);
  // },

  // onShowRankPopup() {
  //   if (require("RankPopup").instance === null) {
  //     var node = require("RankPopup").instance.node;
  //     if (node !== null) {
  //       require("RankPopup").instance.node.destroy();
  //     }
  //   }
  //   require("RankPopup").instance = null;

  //   var popup = cc.instantiate(this.rankPopup);
  //   this.instantiate_parent.addChild(popup);
  // },

  onShowShop() {
    cc.NGWlog('ShopView: Co ShopView Roi!');

    this.onHideView(Global.MainView.node);
    if (!Global.ShopView.node.parent)
      this.instantiate_parent.addChild(Global.ShopView.node);
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.PAYMENT);
  },

  onShowDailyBonus() {
    let item = cc.instantiate(Global.DailyBonusView.node);
    item.parent = this.instantiate_parent;
  },
  onShowMission() {
    this.onHideView(Global.MainView.node);
    this.instantiate_parent.addChild(Global.MissionView.node);
    Global.MissionView.setInfo()
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.MISSION_VIEW);
  },
  onShowHelpVip() {
    this.onHideView(Global.MainView.node);
    this.instantiate_parent.addChild(Global.HelpVipView.node);
  },
  onShowFeedbackPopup() {
    cc.NGWlog('show feed back');
    this.instantiate_parent.addChild(Global.FeedBackView.node);
    Global.FeedBackView.setInfo();
  },
  onShowContactAdmin() {
    Global.MissionView.contactAdmin();
  },
  onShowCashOut() {
    if (Global.CashOutView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.CashOutView.node);
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.DT_VIEW);
  },
  onShowGift() {
    require('SoundManager1').instance.playButton();
    if (Global.GiftView.node.getParent() === null) {
      this.instantiate_parent.addChild(Global.GiftView.node);
    }
    Global.GiftView.setInfo();

  },
  onShowTopGame(gameid = 0) {
    require('SoundManager1').instance.playButton();
    this.onHideView(Global.MainView.node);
    if (Global.TopGameView.node.getParent() === null)
      this.instantiate_parent.addChild(Global.TopGameView.node);
    Global.TopGameView.onMoveIn(gameid);
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.RANK_VIEW);
  },
  onShowTopGameId(gameId) {
    cc.log("Show top game id==" + gameId);
    let listTopGameCfg = require("ConfigManager").getInstance().listRankGame;
    let isHaveTopGame = false;
    for (let i = 0; i < listTopGameCfg.length; i++) {
      if (listTopGameCfg[i].gameid === gameId) {
        isHaveTopGame = true;
        cc.log("listTopGameCfg[i].gameid==" + listTopGameCfg[i].gameid);
        break;
      }

    }
    if (!isHaveTopGame) {
      this.onShowTopGame();
      return;
    }
    let listGameId = require("ConfigManager").getInstance().listGameId;
    if (listGameId.includes(gameId)) {
      require('NetworkManager').getInstance().getTopGameNew(gameId, 0);

    } else {
      this.onShowTopGame();
    }
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.TOP_VIEW);

  },

  onTakeScreenShot() {
    this.cameraRender.takeScreenShot();
  },

  handleBanner(arrayData) {
    this.arrayDataBanner = arrayData;
    if (this.arrayDataBanner.length > 0) {
      this.indexCurrentDataBanner = 0;
      this.showBanner();
    }
  },

  handleBannerIO(arrayData) {
    cc.NGWlog('-----------------handleBannerIO');
    cc.NGWlog(arrayData);
    this.arrayDataBannerIO = arrayData;
    cc.log("Banner ===arrayDataBannerIO==" + this.arrayDataBannerIO.length)
    if (this.arrayDataBannerIO.length > 0) {
      this.indexCurrentDataBannerIO = 0;
      this.showBannerIO();
    }
  },

  showAnimChipOnline(chip) {
    let anim = cc.instantiate(this.Pr_ChipOnline).getComponent("ItemAnimation");
    this.node.addChild(anim.node);

    anim.initAnimation(this.sp_ChipOnline);
    anim.playAnimation("animation");
    setTimeout(() => {
      anim.node.destroy();
    }, 2000);

  },

  setTime(timeEnd) {
    var ret = new Date();
    ret.setDate(ret.getDate() + (3 - 1 - ret.getDay() + 7) % 7 + 1);
    ret.setHours(0, 0, 0, 0);
    this.node.runAction(
      cc.repeatForever(
        cc.sequence(
          cc.delayTime(1.0),
          cc.callFunc(() => {
            this.countDownTime(timeEnd);
          })
        )
      )
    );
  },

  countDownTime(timeEnd) {
    let curTime = new Date();
    curTime = curTime.getTime();
    var t = timeEnd - curTime;
    var seconds = Math.floor((t / 1000) % 60) + "";
    var minutes = Math.floor((t / 1000 / 60) % 60) + "";
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24) + "";
    var days = Math.floor(t / (1000 * 60 * 60 * 24)) + "";

    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;
    if (seconds.length < 2) seconds = "0" + seconds;

    let time_ = days + ' days ' + hours + ' : ' + minutes + ' : ' + seconds;

    if (Global.TopGameView.node.getParent() !== null) {
      Global.TopGameView.lbTimerEnd.string = time_;
    }
  },


  showBanner() {
    var _this = this;
    cc.NGWlog("-------> showBanner");
    if (
      this.indexCurrentDataBanner < 0 ||
      this.indexCurrentDataBanner >= this.arrayDataBanner.length
    )
      return;

    cc.NGWlog("------->2 showBanner");
    let dataNoti = this.arrayDataBanner[this.indexCurrentDataBanner];
    if (
      !dataNoti.hasOwnProperty("type") ||
      !dataNoti.hasOwnProperty("arrButton")
    )
      return;
    if (dataNoti.type != 20) return;
    let idPack = "";
    let allowClose = false;
    let urlBkg = "";
    let posButtonClose = [];
    let arrButton = [];

    if (dataNoti.hasOwnProperty("_id")) idPack = dataNoti._id;
    if (dataNoti.hasOwnProperty("allowClose")) allowClose = dataNoti.allowClose;
    if (dataNoti.hasOwnProperty("url")) urlBkg = dataNoti.url;
    if (dataNoti.hasOwnProperty("posButtonClose"))
      posButtonClose = dataNoti.posButtonClose;

    let siz = cc.view.getVisibleSize();
    let close = false;


    //End Close

    if (dataNoti.hasOwnProperty("arrButton")) arrButton = dataNoti.arrButton;
    let urlCor = "https://cors-anywhere.herokuapp.com/";
    if (cc.sys.isNative) {
      urlCor = "";
    }
    if (urlBkg.indexOf(".png") === -1) {
      cc.loader.load(urlCor + urlBkg, (err, tex) => {

        cc.NGWlog("onShowbaner=========================================== ");
        if (err) {
          cc.NGWlog(err);
          return;
        }

        let nodeBanner = new cc.Node("Banner");
        //   cc.director.getScene().addChild(nodeBanner, cc.macro.MAX_ZINDEX - 10);
        // nodeBanner.parent = this.node;
        this.node.addChild(nodeBanner);
        nodeBanner.zIndex = 1;
        // _this.instantiate_parent.addChild(nodeBanner, cc.macro.MAX_ZINDEX - 10);

        //  nodeBanner.position = cc.v2(siz.width / 2, siz.height / 2);
        let spMask = nodeBanner.addComponent(cc.Sprite);
        nodeBanner.addComponent(cc.Button);
        spMask.type = cc.Sprite.Type.SLICED;
        spMask.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        spMask.spriteFrame = this.bkg_black;
        nodeBanner.setContentSize(siz.width, siz.height);

        // let btnMask = nodeBanner.addComponent(cc.Button);
        // btnMask.target = nodeBanner;
        // btnMask.transition = cc.Button.Transition.NONE;


        let nodeBkg = new cc.Node("Bkg");
        nodeBanner.addChild(nodeBkg);

        let imgBkg = nodeBkg.addComponent(cc.Sprite);

        //Button Close
        let nodeClose = new cc.Node("Close");
        nodeBkg.addChild(nodeClose);
        nodeClose.position = cc.v2(siz.width * 0.45, siz.height * 0.45);

        let imgClose = nodeClose.addComponent(cc.Sprite);
        imgClose.spriteFrame = this.btn_close;

        let btnClose = nodeClose.addComponent(cc.Button);
        //  btnClose.target = nodeClose;


        nodeClose.on(cc.Node.EventType.TOUCH_END, function (event) {
          nodeBanner.destroy();
          UIManager.instance.indexCurrentDataBanner++;
          UIManager.instance.showBanner();
          close = true;
        });
        imgBkg.spriteFrame = new cc.SpriteFrame(tex);
        nodeClose.position = cc.v2(
          nodeBkg.width * 0.5 - nodeClose.width * 0.25,
          nodeBkg.height * 0.5 - nodeClose.height * 0.25
        );



        for (let i = 0; i < arrButton.length; i++) {
          let data = arrButton[i];

          let type = "";
          if (data.hasOwnProperty("type")) {
            type = data.type;
          }

          // if (type === 'sms') continue;
          let pos = [];
          if (data.hasOwnProperty("pos")) {
            pos = data.pos;
          }

          let size = [];
          if (data.hasOwnProperty("size")) {
            size = data.size;
          }

          let urlBtn = "";
          if (data.hasOwnProperty("btn")) {
            urlBtn = data.btn;
          }

          let nodeBtn = new cc.Node("Btn");
          nodeBkg.addChild(nodeBtn);

          let imgBtn = nodeBtn.addComponent(cc.Sprite);



          imgBtn.type = cc.Sprite.Type.SLICED;
          imgBtn.sizeMode = cc.Sprite.SizeMode.CUSTOM;
          imgBtn.spriteFrame = this.btn_normal;
          nodeBtn.setContentSize(200, 70);
          if (urlBtn !== "") {
            cc.NGWlog("-----> URL BTN: ", urlBtn);
            cc.loader.load(urlCor + urlBtn, (err, tex) => {

              if (err != null || close) return;
              imgBtn.spriteFrame = new cc.SpriteFrame(tex);
              cc.NGWlog("load dc button ve============================= ")
            });
          }
          cc.NGWlog("------> size  ", size);
          if (size.length > 1) {
            // nodeBtn.setContentSize(size[0], size[1]);
          }
          if (pos.length > 1) {
            nodeBtn.position = cc.v2(
              nodeBkg.width * pos[0],
              nodeBkg.height * pos[1]
            );
          }

          let btnTemp = nodeBtn.addComponent(cc.Button);
          // btnTemp.target = nodeBtn;
          btnTemp.transition = cc.Button.Transition.COLOR;

          let urllink = "";
          if (data.hasOwnProperty("urllink")) {
            urllink = data.urllink;
          }

          let urlPopupSms = "";
          if (data.hasOwnProperty("urlPopupSms")) {
            urlPopupSms = data.urlPopupSms;
          }

          let styleButton = -1;
          if (data.hasOwnProperty("styleButton")) {
            styleButton = data.styleButton;
          }

          let isFull = false;
          if (data.hasOwnProperty("isFull")) {
            isFull = data.isFull;
          }

          let isClose = false;
          if (data.hasOwnProperty("isClose")) {
            isClose = data.isClose;
          }

          let itemID = "";
          if (data.hasOwnProperty("itemID")) {
            itemID = data.itemID;
          }

          let ccost = 0;
          if (data.hasOwnProperty("ccost")) {
            ccost = data.ccost;
          }
          let value = 0;
          if (data.hasOwnProperty("value")) {
            value = data.value;
          }

          let amount;
          if (data.hasOwnProperty("amount")) {
            amount = data.amount;
          }

          let bonus = "";
          if (data.hasOwnProperty("bonus")) {
            bonus = data.bonus;
          }
          let suggestBet = 0;
          if (data.hasOwnProperty("suggestBet")) {
            suggestBet = data.suggestBet;
          }


          nodeBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.NGWlog("--------> Type Click Button:  ", type.toUpperCase());
            switch (type.toUpperCase()) {
              case "SMS":
              case "CARD":
              case "OK":
              case "": {
                //Open Shop
                UIManager.instance.onShowShop();
                break;
              }
              case "OPENLINK": {
                // urllink/
                urllink = urllink.replace("%userid%", require('GameManager').getInstance().user.id);
                urllink = urllink.replace("%uid%", require('GameManager').getInstance().user.id);
                cc.NGWlog("sio: OPENLINK urllink: " + urllink);
                // if (urllink.indexOf("%userid%") != -1 || urllink.indexOf("%uid%") != -1){
                cc.sys.openURL(urllink);
                // }


                break;
              }
              case "SHOWWEBVIEW": {
                // let webView = cc.instantiate(_this.webViewPr).getComponent("Webview");
                // urllink = urllink.replace("%userid%", require('GameManager').getInstance().user.id);
                // urllink = urllink.replace("%uid%", require('GameManager').getInstance().user.id);
                cc.NGWlog("sio: SHOWWEBVIEW urllink: " + urllink);
                // // if (urllink.indexOf("%userid%") != -1 || urllink.indexOf("%uid%") != -1){
                // webView.setUrl(urllink);
                // //   _this.instantiate_parent.addChild(webView.node,cc.macro.MAX_ZINDEX - 9);
                // cc.director.getScene().addChild(webView.node, cc.macro.MAX_ZINDEX - 9);
                // webView.node.position = cc.v2(siz.width / 2, siz.height / 2);
                // }
                _this.OpenWebviewNapTien(urllink)
                break;
              }
              case "SHARE": {
                break;
              }
              case "BONGDA": {
                break;
              }
              case "UPDATE": {
                break;
              }
              case "AGGIFT": {
                break;
              }
              case "AGDAILY": {
                break;
              }
              case "CAPSA":
              case "SUGGESTBET": {
                break;
              }
              case "IAP": {
                Util.onBuyIap("itemID");
                break;
              }
              case "VIDEO": {
                break;
              }
            }

            //dong banner lai
            nodeBanner.destroy();
            UIManager.instance.indexCurrentDataBanner++;
            UIManager.instance.showBanner();
            close = true;
          });

          let showTextButton = false;
          if (data.hasOwnProperty("showTextButton")) {
            showTextButton = data.showTextButton;
          }
          if (!showTextButton) {
            continue;
          }

          // let nodeLabel = new cc.Node('Label');
          // nodeBtn.addChild(nodeLabel);

          // let lbBtn = nodeLabel.addComponent(cc.Label);
          // lbBtn.string = "";
          // lb.fontSize = 30;
          // lb.lineHeight = 30;
          // lb.isSystemFontUsed = true;
        }

      });
    }
    // else {
    //   cc.loader.load(urlCor + urlBkg, (err, tex) => {
    //     cc.NGWlog("loadTextureFromUrl ===2:" + urlCor + urlBkg);
    //     if (err || sprite === null || typeof (sprite.spriteFrame) === "undefined") {
    //       cc.NGWlog('Error Load Image')
    //       return;
    //     }
    //     //sprite.spriteFrame = new cc.SpriteFrame(tex);
    //   });
    // }

    cc.loader.load(urlCor + urlBkg, (err, tex) => {

    });
  },
  onShowListBaner() {
    if (this.arrBanerOnList.length <= 0) return;
    let item = cc.instantiate(Global.ListBaner).getComponent("ListBaner");
    item.node.setTag(TAG.BANNER);
    this.node.addChild(item.node);
    item.init(this.arrBanerOnList);
  },
  preLoadBaner(data) {
    let length = data.length;
    let urlCor = "https://cors-anywhere.herokuapp.com/";
    if (cc.sys.isNative) {
      urlCor = "";
    }
    for (let i = 0; i < length; i++) {
      cc.log("url tai la=== " + data[i].urlImg);
      if (data[i].urlImg != null && data[i].urlImg != "") {
        cc.loader.load(urlCor + data[i].urlImg, (err, res) => { })
      }

    }
  },
  //onShowMail() {
  //    var popupPre = cc.instantiate(this.mail_popup);
  //    this.instantiate_parent.addChild(popupPre);
  //},

  pushLocalNotiOff() {
    let timeLeft = require("GameManager").getInstance().promotionInfo.time;
    // let contentStr = " 🎁 Your free chips are ready! Get them now! 🎁 ";
    // if (cc.sys.OS === cc.sys.OS_ANDROID)
    //   contentStr = Global.encode(" 🎁 Your free chips are ready! Get them now! 🎁 ");
    var noti = {
      title: "FREE CHIP",
      time: timeLeft,
      content: Global.encode(" 🎁 Your free chips are ready! Get them now! 🎁 "),
      category: "",
      identifier: "",
      data: "",
      isLoop: false
    };
    if (cc.sys.os === cc.sys.OS_IOS) {
      noti = {
        title: "FREE CHIP",
        time: timeLeft,
        content: " 🎁 Your free chips are ready! Get them now! 🎁 ",
        category: "",
        identifier: "",
        data: "",
        isLoop: false
      };
    }
    if (require("GameManager").getInstance().isLoginSucces == true && require("GameManager").getInstance().allowPushOffline == true) {
      cc.NGWlog("Call Native: Push Noti OffLine");
      require("Util").pushNotiOffline(JSON.stringify(noti));
    }
  },
  pushLocalNotiEveryDay() {
    let listNoti = require("GameManager").getInstance().everyDayNoti;
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    let time = hour * 3600 + min * 60;
    for (let i = 0; i < listNoti.length; i++) {
      let timeLeft = time;
      let content = listNoti[i].text;
      let title = listNoti[i].title;
      let data = listNoti[i].data;
      var noti = {
        title: title,
        time: timeLeft,
        content: Global.encode(content),
        category: "",
        identifier: "",
        data: data,
        isLoop: true
      };
      require("Util").pushNotiOffline(JSON.stringify(noti));
    }
    //if (require("GameManager").getInstance().isLoginSucces == true && require("GameManager").getInstance().allowPushOffline == true) {
    // cc.NGWlog("Call Native: Push Noti OffLine");

    // }
  },
  showBannerIO() {
    if (this.indexCurrentDataBannerIO < 0 || this.indexCurrentDataBannerIO >= this.arrayDataBannerIO.length) {
      return;
    }

    let dataBanner = this.arrayDataBannerIO[this.indexCurrentDataBannerIO];
    let urlCor = "https://cors-anywhere.herokuapp.com/";
    if (cc.sys.isNative) {
      urlCor = "";
    }
    //-------------

    if (dataBanner.urlImg == null || dataBanner.urlImg == "") {
      this.indexCurrentDataBannerIO++;
      this.nextBanner();
      return;
    }
    cc.NGWlog("-------> SIO: showBannerIO");
    cc.loader.load(urlCor + dataBanner.urlImg, (err, res) => {
      if (err) {
        cc.NGWlog("-------> SIO: showBannerIO erro" + err);
        this.nextBanner();
        return;
      }
      if (require("GameManager").getInstance().currentView == CURRENT_VIEW.LOGIN_VIEW) {
        cc.NGWlog("-------> SIO: showBannerIO  CURRENT_VIEW.LOGIN_VIEW==return");
        return;
      }
      let nodeBanner = cc.instantiate(Global.NodeBaner).getComponent("Baner");

      cc.log("push vao banner ko show game");
      if (!dataBanner.isShowGameView || dataBanner.isShowGameView == null) {
        this.arrBannerNotShowGame.push(nodeBanner);
      }

      nodeBanner.node.setTag(TAG.BANNER);
      this.node.addChild(nodeBanner.node, 1);
      cc.log("dataBanner====" + dataBanner);
      nodeBanner.init(dataBanner);
    });
  },
  nextBanner() {
    this.indexCurrentDataBannerIO++;
    this.showBannerIO();
  },
  removeAllBanerShowGame() {
    let length = this.arrBannerNotShowGame.length;
    cc.log("push vao banner ko show game length " + length);
    for (let i = 0; i < length; i++) {
      let item = this.arrBannerNotShowGame[i];
      if (item.node != null) item.node.destroy();
    }
    this.arrBannerNotShowGame.length = 0;
  },

  removeBanerShowGame(banner) {
    let indexOf = this.arrBannerNotShowGame.indexOf(banner);
    if (indexOf != -1) this.arrBannerNotShowGame.splice(indexOf, 1);
  },


  createSprite(spriteFrame) {
    let nodeButton = new cc.Node("Sprite");

    let imgButton = nodeButton.addComponent(cc.Sprite);
    imgButton.spriteFrame = spriteFrame;

    return imgButton;
  },
  OpenWebviewNapTien(url, otps) {
    let urllink = url;
    urllink = urllink.replace("%userid%", require('GameManager').getInstance().user.id);
    urllink = urllink.replace("%uid%", require('GameManager').getInstance().user.id);
    otps = otps || {};
    if (otps.isPrice) {
      urllink = urllink.replace("%price%", otps.isPrice);
    }

    if (otps.isPayType) {
      urllink = urllink.replace("%paytype%", otps.isPayType);
    }
    cc.log("LINK OPEN WEBVIEW=" + urllink);
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      require("Util").onCallWebView(urllink);
    } else {
      if (cc.sys.os === cc.sys.OS_IOS) {
        //this.openWebviewCocos(urllink);
        require("Util").onCallWebView(urllink);
      } else
        cc.sys.openURL(urllink);
    }

  },
  openWebviewCocos(urllink) {
    let siz = cc.view.getVisibleSize();
    let webView = cc.instantiate(this.webViewPr).getComponent("Webview");
    webView.setUrl(urllink);
    cc.director.getScene().addChild(webView.node, cc.macro.MAX_ZINDEX - 9);
    webView.node.position = cc.v2(siz.width / 2, siz.height / 2);
  },
  logEventSuggestBanner(type, dataItem) {
    let dataMap = new Map();
    if (type == 1) {
      dataMap.set("action", "close");
    } else if (type == 2) {
      dataMap.set("action", "click");
    } else if (type == 3) {
      dataMap.set("action", "view");
    }
    dataMap.set("id", dataItem.id);
    dataMap.set("urlImg", dataItem.urlImg);

    if (!this.arrayIDBannerShowed.includes(dataItem.id))
      this.arrayIDBannerShowed.push(dataItem.id);


    require('SMLSocketIO').getInstance().emitSIOWithMapData("actionBanner", dataMap);

    if (type === 2) {
      for (let i = 0; i < this.arrayDataBannerIO.length; i++) {
        if (dataItem.id === this.arrayDataBannerIO[i].id) {
        } else {
          if (this.arrayIDBannerShowed.includes(this.arrayDataBannerIO[i].id)) continue;
          let dataNo = new Map();

          dataNo.set("action", "notshow");
          dataNo.set("id", this.arrayDataBannerIO[i].id);
          dataNo.set("urlImg", this.arrayDataBannerIO[i].urlImg);
          require('SMLSocketIO').getInstance().emitSIOWithMapData("actionBanner", dataNo);
        }
      }
    }
  },
  loadTextureAvatar(sprite, avtId) {
    let avatarList = this.avatarList;
    sprite.spriteFrame = avatarList.getSpriteFrame(avtId);
  },
  requestConfigUser(_data0) {
    if (require('ConfigManager').getInstance().infoUser !== '') {
      require('LoadConfig').getInstance().getInfoUser(_data0);
    }
    else {
      var callFunc = cc.callFunc(() => {
        this.requestConfigUser(_data0)
      });
      this.node.runAction(cc.sequence(cc.delayTime(0.5), callFunc));
    }
  },

  refreshButtonConfig() {
    cc.log("Refresh BUTTON CONFIG");
    this.MainUI = Global.MainView;
    this.MainUI.loadGameList();

    this.MainUI.btn_cashOut.node.active = require("ConfigManager").getInstance().is_dt;

    this.MainUI.btn_sendGift.node.active = require("ConfigManager").getInstance().ketT;
    this.MainUI.btn_giftCode.node.active = require("ConfigManager").getInstance().ismaqt;
    this.MainUI.btn_xoso.active = require("ConfigManager").getInstance().isXoSo;
    // this.MainUI.btn_support.node.active = require("ConfigManager").getInstance().is_bl_fb;

  },

  updateConfigUmode() {
    let cfManager = require('ConfigManager').getInstance();
    // let umode = cfManager.umode;
    let umode = 0; //fix cung
    switch (umode) {
      case 0: // mode == 0, vao thang ko can hoi
        cc.NGWlog('umode0: show login');
        break;
      case 1: // mode == 1, hoi update, 2 lua chon
        cc.NGWlog('umode1');
        require("GameManager").getInstance().onShowWarningDialog(
          cfManager.msg,
          DIALOG_TYPE.TWO_BTN,
          cfManager.uop1,
          () => {
            cc.sys.openURL(cfManager.utar);
            require("GameManager").getInstance().onQuitGame();
          },
          cfManager.uop2
        );
        break;
      case 2: // mode == 2, hoi update, khong lua chon
        cc.NGWlog('umode2');
        require("GameManager").getInstance().onShowWarningDialog(
          cfManager.umsg,
          DIALOG_TYPE.ONE_BTN,
          cfManager.uop1,
          () => {
            cc.sys.openURL(cfManager.utar);
            require("GameManager").getInstance().onQuitGame();
          }
        );
        break;
      case 3: // mode == 3, thong bao, 1 lua chon OK va vao game
        cc.NGWlog('umode3');
        this.onShowConfirmDialog(cfManager.umsg);
        break;
      case 4:// mode == 4, thong bao, 1 lua chon OK va finish
        cc.NGWlog('umode4');
        require("GameManager").getInstance().onShowWarningDialog(
          cfManager.umsg,
          DIALOG_TYPE.ONE_BTN,
          cfManager.uop1,
          () => {
            require("GameManager").getInstance().onQuitGame();
          }
        );
        break;
    }
  },
});

module.exports = UIManager;
