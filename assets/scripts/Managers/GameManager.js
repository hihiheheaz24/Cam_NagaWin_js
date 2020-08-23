const User = require("User");
const UIManager = require("UIManager");
const PromotionInfo = require("PromotionInfo");
const itemJackPotHistory = require('itemJackPotHistory')
var GameManager = cc.Class({
  name: "GameManager",
  ctor: function () {
    this.typeLogin = 1
  },
  properties: {
    instance: {
      default: null
    },
    user: {
      default: null,
      type: require("User"),
      serializable: false
    },

    user_name: "",
    user_pass: "",

    ArrServerIP: [],
    listIp: [],

    listAgency: {
      default: []
    },

    mail20: {
      default: [],
      type: [require("MailData")]
    },
    mail21: {
      default: [],
      type: [require("MailData")]
    },

    listGame: {
      default: [],
      type: [cc.Integer]
    },

    list_data_history_safe: {
      default: [],
      type: [require("HistorySafeData")]
    },

    list_data_jackpot_history: {
      default: [],
      type: [require("itemJackPotHistory")]
    },

    promotionInfo: {
      default: null,
      type: require("PromotionInfo"),
      serializable: false
    },
    isChangeTable: false,
    // vectorDelay: [],
    checkPassId: 0,


    ///////////////  CONFIG  /////////////
    // string
    fanpageID: "",
    groupID: "",
    urlLogGame: "",
    fanpageURL: "",
    avatar_link: "",
    avatarFb_link: null,
    groupURL: "",
    hashTagShareImage: "#NGW #Club #Game",
    url_payment_config: "",
    url_text_en: "",
    url_text_other: "",
    url_benefit_config: "",
    disId: "",
    versionGame: "1.09", //fix version
    bundleID: "cyt.kh.naga.club",
    publisher: "ngwjs_1_09_android", // //fix version
    os: "android_cocosjs",
    deviceId: "",
    signdata: "",
    signature: "",
    receipt: "",
    status: false,
    mode: 0,
    op1: "",
    op2: "",
    msg: "",
    link: "",
    number_verify: "",
    language: "",
    devicename: "web",
    //versionGame: "web",
    osversion: "web",
    brand: "web",
    binhJPListMark: [],
    binhJPListChip: [],



    // number
    avatar_count: 10,
    vip_rename: 2,
    ag_rename: 10000,
    ag_rename_min: 100,
    ag_rename_verify: 10000,
    ag_rename_verify_min: 20,
    agInvite: 0,
    numberMail: 0,
    numberMailAdmin: 0,
    agSauCacTL: 5,
    url_rule: '',
    agInvite: 0,
    agInviteFr: 0,
    agShareImg: 0,
    agContactAd: 0,
    agVerify: 0,
    agRename: 0,
    time_out_game: 0,
    mccsim1: 0,
    mccsim2: 0,
    u_chat_fb: "",
    curJackPotBinh: 0,
    curJackPotSlot: 0,

    // boolean
    ishaveSimCam: false,
    checkMobileNetwork: false,
    isVerifyMobile: false,
    isBn: false,
    allowPushOffline: false,
    isLoginSucces: false,
    is_dt: false,
    is_login_fb: true,
    ismaqt_save: false,
    ismaqt: false,
    ismaiv_save: false,
    ismaiv: false,
    state_net: true,
    is_login_guest: true,
    statePoay: false,
    card: false,
    isFirstClickGame: false,
    showPopConnect: true,
    isShowPermission: false,
    is_mission: false,
    is_bl_fb: false,
    versionA: null,
    versionB: null,
    ///////// END CONFIG ///////////////
    isLogOut: true,  // Check logOut

    list_alert: {
      default: [],
      type: [cc.String]
    },

    cors_url: "https://cors-anywhere.herokuapp.com/",

    docText: null,
    docTextOff: null,

    isReconnect: false,
    isLoginOnGame: false,
    isChooseGame: false,
    curGameId: 0,
    curGameViewId: 0,
    curServerIp: "",
    tableId: 0,
    table_mark: 0,

    is_click_receive_chip_onl: true,
    is_show_confirm_dialog_mail: false,

    is_on_background: false,

    gameView: null,
    userNameRegTempl: "",
    passRegTemple: "",
    passwordToBeChanged: "",
    invitePlayGame: true,
    startLogin: false,
    access_token: "",
    currentView: "",
    pathScreenShot: "",
    listVerGame: [],
    dataBetRouletteOffline: [], //roulette off
    totalBetRouletteOffline: 0,

    totalBetBaccaratOff: 0, //Baccarat off
    soLanDatCuocBaccaratOff: 0,
    dataBetBaccaratOff: [],
    dataHistoryBaccaratOff: [],
    bankerWinCountBaccaratOff: 0,
    playerWinCountBaccaratOff: 0,
    tieWinCountBaccaratOff: 0,
    bankerPairCountBaccaratOff: 0,
    playerPairCountBaccaratOff: 0,
    mcbBaccaratOff: 1,
    listCCFS: [],
    isPlayNowBanner: false,
    everyDayNoti: [],
    isGettingTopGameId: false,
  },
  statics: {
    getInstance: function () {
      if (this.instance == null) {
        this.instance = new GameManager();
        this.instance.user = new User();
        this.instance.promotionInfo = new PromotionInfo();
      }
      return this.instance;
    }
  },

  initConfigText() {
    var langLocal = cc.sys.localStorage.getItem("language_client");
    cc.log("Lang local======" + langLocal);
    var content = cc.sys.localStorage.getItem("config_text_EN");

    for (let i = 0; i < require('ConfigManager').getInstance().listTextConfig.length; i++) {
      let item = require('ConfigManager').getInstance().listTextConfig[i];
      if (item.language == langLocal) {
        cc.log("Lang local======22222" + langLocal);
        let strKey = "config_text_" + langLocal;
        content = cc.sys.localStorage.getItem(strKey);
        cc.log("Lang local==keyyy====" + strKey);
        break;
      }
    }

    if (this.docTextOff == null) {
      if (langLocal == LANGUAGE_TEXT_CONFIG.LANG_EN)
        this.docTextOff = require('UIManager').instance.text_Config[0].json.ConfigClient;
      else if (langLocal == LANGUAGE_TEXT_CONFIG.LANG_CAM)
        this.docTextOff = require('UIManager').instance.text_Config[1].json.ConfigClient;
    }

    cc.log("DOC TEXT OFF======" + this.docTextOff);

    if (!content) {
      cc.log("text NULL cmnr " + langLocal);
    }
    else {
      this.docText = JSON.parse(content).ConfigClient;
      cc.log("success text " + langLocal);
    }
  },

  getTextConfig(key) {
    if (!this.docText) {
      if (!this.docTextOff)
        return "Config key: " + key + " is Missing";
      else {
        if (this.docTextOff.hasOwnProperty(key))
          return this.docTextOff[key]
        else
          return "Config key1: " + key + " is Missing";
      }
    }
    else {
      if (this.docText.hasOwnProperty(key))
        return this.docText[key];
      else {
        if (!this.docTextOff)
          return "Config key2: " + key + " is Missing";
        else {
          if (this.docTextOff.hasOwnProperty(key))
            return this.docTextOff[key]
          else
            return "Config key3: " + key + " is Missing";
        }
      }
    }
  },
  getGameIdSeverIp() {
    this.curGameId = cc.sys.localStorage.getItem("curGameId");
    this.curServerIp = cc.sys.localStorage.getItem("curServerIp" + NAME_GAME);

    if(this.curGameId == null || this.curGameId == 'undefined')
      this.curGameId = 0;
    else
      this.curGameId = parseInt(this.curGameId);

  },

  setPromotionInfo(jsonData) {
    this.promotionInfo.notEnoughMoney = jsonData.P;
    this.promotionInfo.adminMoney = jsonData.A;
    this.promotionInfo.upVip = jsonData.UV;
    this.promotionInfo.online = jsonData.O;
    this.promotionInfo.video = jsonData.V;
    this.promotionInfo.giftCode = jsonData.C;
    this.promotionInfo.time = jsonData.T;
    this.promotionInfo.videoCurrent = jsonData.VC;
    this.promotionInfo.videoMax = jsonData.VM;
    this.promotionInfo.onlineCurrent = jsonData.OC;
    this.promotionInfo.onlineMax = jsonData.OM;
    this.promotionInfo.agViewVideo = jsonData.NV;
    this.promotionInfo.agOnline = jsonData.NO;
    this.promotionInfo.agInviteFriend = jsonData.NIV;
    this.promotionInfo.inviteMark = jsonData.InviteMark;
    this.promotionInfo.inviteNum = jsonData.InviteNum;

    //this.promotionInfo.numberP = jsonData.OnlinePolicy.numberP;
    if (jsonData.OnlinePolicy) {
      let OnlinePolicy = JSON.parse(jsonData.OnlinePolicy);
      this.promotionInfo.numberP = OnlinePolicy.numberP;
      this.promotionInfo.timeWaiting = OnlinePolicy.timeWaiting;
      this.promotionInfo.chipBonus = OnlinePolicy.chipBonus;
    }
  },
  initUser(jsonData) {

    var jsonValue = JSON.parse(jsonData.data);
    cc.log("data login tra ve== " + JSON.stringify(jsonValue));
    let objData = {};
    if (jsonData.hasOwnProperty('evt')) {
      objData.evt = jsonData.evt;
    }
    objData.data = JSON.stringify(jsonData);

    this.user.id = jsonValue.Userid;
    this.user.lq = jsonValue.LQ;
    this.user.ag = jsonValue.AG;
    // this.user.agSafe = jsonValue.Userid;
    this.user.lastGameID = jsonValue.gameid;
    this.user.onlineDay = jsonValue.OD;
    this.user.promotionDay = jsonValue.PD;
    this.user.listPromotionDay = [];
    // this.user.vipPoint = jsonValue.vippoint;
    this.user.mvip = jsonValue.MVip;
    this.user.vip = jsonValue.VIP;
    // this.user.level = jsonValue.Userid;
    this.user.avt = jsonValue.LQ;
    this.user.nm = jsonValue.NM % 100;
    this.user.nmAg = parseInt(jsonValue.NM / 100);
    this.user.avtId = jsonValue.A;
    if (IS_RUN_INSTANT_FACEBOOK) {
      this.user.userNameLQ = FBInstant.player.getName();
    } else this.user.userNameLQ = jsonValue.UsernameLQ;
    this.user.uname = jsonValue.Username;
    this.user.displayName = jsonValue.displayName;
    this.user.tinyURL = jsonValue.Tinyurl;
    // this.user.avatarUrl = jsonValue.Userid;
    // this.user.status = jsonValue.Userid;
    this.user.auth = jsonValue.auth;
    this.user_name = this.user.uname;
    this.user.co = parseFloat(jsonValue.CO);
    this.user.co0 = parseFloat(jsonValue.CO0);
    this.user.lqsms = parseFloat(jsonValue.LQSMS);
    this.user.lqiap = parseFloat(jsonValue.LQIAP);
    this.user.lqother = parseFloat(jsonValue.LQOther);
    this.user.blq1 = parseFloat(jsonValue.BLQ1);
    this.user.blq3 = parseFloat(jsonValue.BLQ3);
    this.user.blq5 = parseFloat(jsonValue.BLQ5);
    this.user.blq7 = parseFloat(jsonValue.BLQ7);
    this.user.avg7 = parseFloat(jsonValue.AVG7);
    this.user.group = parseInt(jsonValue.Group);

    // if(jsonValue.gameid != 0){
    //  Global.LobbyView.isReconnectGame = true;
    let gameId = GameManager.getInstance().curGameId;
    setTimeout(() => {
      require('NetworkManager').getInstance().sendSelectG2(gameId);
    }, 1500)


    // }else{
    //   Global.MainView._isClickGame = false;
    // }



    if (this.typeLogin === LOGIN_TYPE.NORMAL || this.typeLogin === LOGIN_TYPE.REG_ACC) {
      this.typeLogin = LOGIN_TYPE.NORMAL;
      cc.sys.localStorage.setItem(
        "user_name",
        this.user_name
      );
      cc.sys.localStorage.setItem(
        "password",
        this.user_pass
      );
    } else if (this.typeLogin === LOGIN_TYPE.PLAYNOW) {
      cc.sys.localStorage.setItem("USER_PLAYNOW", this.user_name);
      cc.sys.localStorage.setItem("PASS_PLAYNOW", this.user_pass);
    }

    if (typeof jsonValue.Mobile === "string") {
      this.number_verify = jsonValue.Mobile;
    }
    if (typeof jsonValue.ListDP === "string") {
      let listdp = jsonValue.ListDP;
      this.user.listPromotionDay = [];
      do {
        if (listdp.indexOf(";") !== -1) {
          let sub = listdp.substring(0, listdp.indexOf(";"));
          listdp = listdp.substring(listdp.indexOf(";") + 1, listdp.length);
          this.user.listPromotionDay.push(sub);
        } else {
          break;
        }
      } while (true);
    }

    if (cc.sys.isNative) {
      require("Util").sendTagOneSignal("deviceid", this.deviceId);
      require("Util").sendTagOneSignal("publisher", require('ConfigManager').getInstance().publisher);
      require("Util").sendTagOneSignal("username", this.user.uname);
      require("Util").sendTagOneSignal("uservip", this.user.vip.toString());
      require("Util").sendTagOneSignal("userid", this.user.id.toString());
      require("Util").sendTagOneSignal("usergold", this.user.ag.toString());
      require("Util").sendTagOneSignal("gameport", OPERATOR.toString());
      require("Util").sendTagOneSignal("pkgname", this.bundleID);
      require("Util").sendTagOneSignal("version", this.versionGame);
      require("Util").sendTagOneSignal("userlq", this.user.lq.toString());
      require("Util").sendTagOneSignal("co", this.user.co.toString());
      require("Util").sendTagOneSignal("co0", this.user.co0.toString());
      require("Util").sendTagOneSignal("lqsms", this.user.lqsms.toString());
      require("Util").sendTagOneSignal("lqiap", this.user.lqiap.toString());
      require("Util").sendTagOneSignal("lqother", this.user.lqother.toString());
      require("Util").sendTagOneSignal("blq1", this.user.blq1.toString());
      require("Util").sendTagOneSignal("blq3", this.user.blq3.toString());
      require("Util").sendTagOneSignal("blq5", this.user.blq5.toString());
      require("Util").sendTagOneSignal("blq7", this.user.blq7.toString());
      require("Util").sendTagOneSignal("avg7", this.user.avg7.toString());
      require("Util").sendTagOneSignal("group", this.user.group.toString());
      require("Util").sendTagOneSignal("displayName", this.user.displayName);
    }

    var data = {
      evt: "ref",
      data: require('ConfigManager').getInstance().publisher,
      email: "",
      version: this.versionGame
    };
    require("NetworkManager").getInstance().sendService(JSON.stringify(data));

    require('SMLSocketIO').getInstance().isSendFirst = true;
    require('SMLSocketIO').getInstance().emitLogin();
    require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "LoginPacket", false);

  },
  initIAP() {
    var key_iap = require("GameManager").getInstance().user.id.toString() + "_iap_count";
    var countIAP = cc.sys.localStorage.getItem(key_iap);
    if (countIAP === null || typeof (countIAP) === "undefined") {
      countIAP = 0;
    }
    cc.NGWlog("Tien su:   " + countIAP);
    if (countIAP > 0) {
      for (var i = 0; i < countIAP; i++) {

        if (cc.sys.os === cc.sys.OS_ANDROID) {
          var key_signdata = require("GameManager").getInstance().user.id.toString() + "_signdata_" + i;
          var key_signature = require("GameManager").getInstance().user.id.toString() + "_signature_" + i;
          var signdata = cc.sys.localStorage.getItem(key_signdata);
          var signature = cc.sys.localStorage.getItem(key_signature);
          if (signdata != "" && signature != "" && signdata != null && signature != null && typeof (signdata) !== "undefined" && signature !== "undefined") {
            countIAP--;
            cc.sys.localStorage.setItem(key_iap, countIAP);
            require("NetworkManager").getInstance().sendIAPResult(signdata, signature);
          }
        } else if (cc.sys.os === cc.sys.OS_IOS) {
          var key_receipt = require("GameManager").getInstance().user.id.toString() + "_receipt_" + i;
          var receipt = cc.sys.localStorage.getItem(key_receipt);
          if (receipt != "" && receipt != null && typeof (receipt) !== "undefined") {
            countIAP--;
            cc.sys.localStorage.setItem(key_receipt, countIAP);
            require("NetworkManager").getInstance().validateIAPReceipt(receipt);
          }
        }

      }
    }
  },

  onLoginFBInstant() {
    this.typeLogin = LOGIN_TYPE.FACEBOOK_INSTANT;
    if (this.access_token === "") {
      FBInstant.player.getSignedPlayerInfoAsync().then(function (result) {
        cc.NGWlog(result.getSignature());
        this.access_token = result.getSignature();
        require("NetworkManager")
          .getInstance()
          .onLogin("1", result.getSignature(), false);
      });
    } else {
      require("NetworkManager")
        .getInstance()
        .onLogin("1", this.access_token, false);
    }
  },

  onQuitGame() {
    cc.game.end();
    if (IS_RUN_INSTANT_FACEBOOK) FBInstant.quit();
  },


  onReconnect() {
    cc.NGWlog('chay vao ham reconnect game==============================')
    this.isReconnect = true;
    require("UIManager").instance.onLogout();
  },

  onShareFacebook() {
    if (IS_RUN_INSTANT_FACEBOOK) {
      cc.NGWlog("---------------------------> onShareFacebook");
      FBInstant.shareAsync({
        intent: "REQUEST",
        text: "Play game with me!!!"
      });
    } else {
      FB.ui(
        {
          method: 'share',
          hashtag: this.hashTagShareImage,
          //href: window.location.href
          href: 'https://sss.serveo.net/build/',
        },
        function (response) {
          cc.NGWlog("gia tri cua response la " + response);
          if (response == '') {
            require("NetworkManager").getInstance().sendShareImageFb();
          } else {
            this.onShowToast("cancel shared");
          }
        }
      );
    }
  },

  formatNumber(number, width = 3) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  },

  formatMoney(money) {
    // char k[] = { 'K', '\0'};
    // char m[] = { 'M', '\0'};
    // char b[] = { 'B', '\0'};
    // char u[] = { '\0'};
    let format = "";
    let mo = Math.abs(money);
    //int cha;
    if (mo >= 1000000000) {
      mo /= 1000000000;
      format = "B";
    } else if (mo >= 1000000) {
      mo /= 1000000;
      format = "M";
    } else {
      return this.formatNumber(money);
    }

    let str = money.toString() + "0";
    let str1 = mo.toString() + "a";

    let idex = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== str1[i]) {
        idex = i;
        break;
      }

    }

    return (money < 0 ? "-" : "") + Math.floor(mo) +((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : "," )+ ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : str.toString()[idex] )
    + (str.toString()[idex + 1] === '0' ? "" : str.toString()[idex + 1]) + format;
  },
  formatMoneyAg(money) {
    // char k[] = { 'K', '\0'};
    // char m[] = { 'M', '\0'};
    // char b[] = { 'B', '\0'};
    // char u[] = { '\0'};
    let format = "";
    let mo = Math.abs(money);
    //int cha;
    if (mo >= 1000000000) {
      mo /= 1000000000;
      format = "B";
    } else if (mo >= 1000000) {
      mo /= 1000000;
      format = "M"; // vidu money bang 20,000,000
    }
    else if (mo >= 1000) {
      mo /= 1000;
      format = "K";
    } 
    else {
      return this.formatNumber(money);
    }

    let str = money.toString() + "0"; // str length se la 200000000
    let str1 = mo.toString() + "a"; // str1 length se la  20a

    let idex = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== str1[i]) {
        idex = i;
        break;
      }

    }

    return (money < 0 ? "-" : "") + Math.floor(mo) +((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : "," )+ ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : str.toString()[idex] )
    + (str.toString()[idex + 1] === '0' ? "" : str.toString()[idex + 1]) + format;
  },
  formatMoneyChip(money) { // hoi duc va hien truoc khi su dung.thanks!
    let format = "";
    let mo = Math.abs(money);
    //int cha;
    if (mo >= 1000000000) {
      mo /= 1000000000;
      format = "b";
    } else if (mo >= 1000000) {
      mo /= 1000000;
      format = "m";
    } else if (mo >= 1000) {
      mo /= 1000;
      format = "k";
    } else {
      return this.formatNumber(money);
    }

    return money < 0 ? "-" + mo + format : mo + format;
  },
  cutString(string, maxLength) {
    if (string.length > maxLength) {
      if (maxLength > 3) {
        return string.substring(0, maxLength - 3) + "...";
      } else {
        return string.substring(0, maxLength);
      }
    }
    return string;
  },

  onShowHideWaiting(isShow, timeShow = 20) {
    if (UIManager.instance == null) return;
    if (isShow) {
      UIManager.instance.onShowLoad();
    } else {
      cc.NGWlog('hide load ben game Manager');
      UIManager.instance.onHideLoad();
    }
  },

  onShowToast(message) {
    if (UIManager.instance == null) return;
    UIManager.instance.showToast(message);
  },

  onShowConfirmDialog(message, func_1 = null) {
    if (UIManager.instance == null) return;
    return UIManager.instance.onShowConfirmDialog(message, func_1);
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
    if (UIManager.instance == null) return;
    return UIManager.instance.onShowWarningDialog(
      message,
      dialogType,
      nameBtn1,
      func_1,
      nameBtn2,
      func_2,
      nameBtn3,
      func_3
    );
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
    if (UIManager.instance == null) return;
    return UIManager.instance.onShowWarningDialogHasDelayTime(
      message,
      dialogType,
      nameBtn1,
      func_1,
      nameBtn2,
      func_2,
      nameBtn3,
      func_3,
      timeDelay,
      delayType
    );
  },

  loadTexture(sprite, res) {
    // cc.NGWlog( typeof sprite);
    cc.loader.loadRes(res, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        cc.NGWlog(err);
        return;
      }
      if (sprite.getComponent(cc.Sprite) !== null) {
        sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      }
    });
  },

  loadTextureFromUrl(sprite, url) {
    //let avtlink="https://graph.facebook.com/v2.4/100004625341827/picture?width=200&height=200&redirect=true";
    let urlCor = this.cors_url;
    if (cc.sys.isNative || IS_RUN_INSTANT_FACEBOOK) {
      urlCor = "";
    }
    if (url.indexOf(".png") === -1) {
      cc.loader.load({ url: urlCor + url, type: "png" }, (err, tex) => {
        if (err || sprite === null || typeof (sprite.spriteFrame) == "undefined") {
          cc.NGWlog("loadTextureFromUrl FB error:" + err);
          return;
        }
        sprite.spriteFrame = new cc.SpriteFrame(tex);
      });
    } else {
      cc.loader.load(urlCor + url, (err, tex) => {
        if (err || sprite === null || typeof (sprite.spriteFrame) === "undefined") {
          cc.NGWlog('Error Load Image')
          return;
        }
        sprite.spriteFrame = new cc.SpriteFrame(tex);
      });
    }
  },
  effRunNumber(lb, curValue, lastValue, timeRun) {
    lb.node.stopAllActions();
    if (curValue === lastValue) return;
    lb.string = curValue;
    let deltaNum = lastValue - curValue;
    let numPerTime = deltaNum / (timeRun * 20);
    let acPlus = cc.repeat(cc.sequence(cc.callFunc(() => {
      curValue += numPerTime;
      if (deltaNum > 0) {
        if (curValue >= lastValue) {
          curValue = lastValue;
          lb.node.stopActionByTag(0);
        }
      } else {
        if (curValue <= lastValue) {
          curValue = lastValue;
          lb.node.stopActionByTag(0);
        }
      }
      lb.string = require("GameManager").getInstance().formatNumber(Math.round(curValue));
    }), cc.delayTime(timeRun / 20)), 20 * timeRun);
    acPlus.setTag(0);
    let acScale1 = cc.scaleTo(timeRun * (2 / 3), 1.1).easing(cc.easeSineOut());
    let acScale2 = cc.scaleTo(timeRun * (1 / 3), 1.0).easing(cc.easeSineIn());
    let acScale = cc.sequence(acScale1, acScale2);
    //lb.node.runAction(cc.spawn(acPlus, acScale));
    lb.node.runAction(acPlus);
  },
  setCurView(curView) {
    cc.NGWlog("------> setCurView ", curView);
    this.currentView = curView.toString();
    if (this.isLoginSucces) {
      require('SMLSocketIO').getInstance().emitUpdateInfo();
    }
  },
  getCurrentSceneName() {
    var sceneName = "";
    if (this.currentView == this.curGameViewId.toString()) {
      sceneName = "GAMEVIEW_" + this.curGameId;
    }
    else {
      switch (this.currentView) {
        case CURRENT_VIEW.LOGIN_VIEW:
          sceneName = "LOGINVIEW";
          break;

        case CURRENT_VIEW.LOBBY:
          sceneName = "LOBBYVIEW";
          break;

        case CURRENT_VIEW.PAYMENT:
          sceneName = cc.js.formatStr("%s%s", "PA", "YMENTVIEW");
          break;

        case CURRENT_VIEW.MAIL:
          sceneName = "MAILVIEW";
          break;

        case CURRENT_VIEW.PERSONAL:
          sceneName = "PERSONALVIEW";
          break;

        case CURRENT_VIEW.CHAT_FRIEND:
          sceneName = "CHATFRIENDVIEW";
          break;

        case CURRENT_VIEW.RULE_VIEW:
          sceneName = "RULEVIEW";
          break;

        case CURRENT_VIEW.GAMELIST_VIEW:
          sceneName = "GAMELISTVIEW";
          break;

        case CURRENT_VIEW.FEEDBACK_VIEW:
          sceneName = "FEEDBACKVIEW";
          break;

        case CURRENT_VIEW.NEWS_VIEW:
          sceneName = "NEWSVIEW";
          break;

        case CURRENT_VIEW.SETTING_VIEW:
          sceneName = "SETTINGVIEW";
          break;

        case CURRENT_VIEW.JACKPOT_VIEW:
          sceneName = "JACKPOTVIEW";
          break;

        case CURRENT_VIEW.GUIDE_INGAME:
          sceneName = "GUIDEINGAMEVIEW";
          break;

        case CURRENT_VIEW.COUNTDOWN:
          sceneName = "COUNTDOWNVIEW";
          break;

        case CURRENT_VIEW.REGISTER_VIEW:
          sceneName = "REGISTERVIEW";
          break;

        case CURRENT_VIEW.RANK_VIEW:
          sceneName = "RANKVIEW";
          break;
        case CURRENT_VIEW.DT_VIEW:
          sceneName = "DT_VIEW";
          break;

        case CURRENT_VIEW.KET_VIEW:
          sceneName = "KETVIEW";
          break;

        case CURRENT_VIEW.CHATWORLD:
          sceneName = "CHATWORLDVIEW";
          break;

        case CURRENT_VIEW.TOP_VIEW:
          sceneName = "TOPVIEW";
          break;

        case CURRENT_VIEW.FRIEND_VIEW:
          sceneName = "FRIENDVIEW";
          break;

        case CURRENT_VIEW.CREATE_TABLE_GAME:
          sceneName = "CREATETABLEVIEW";
          break;

        case CURRENT_VIEW.GIFT_CODE_VIEW:
          sceneName = "GIFTCODEVIEW";
          break;

        case CURRENT_VIEW.MISSION_VIEW:
          sceneName = "MISSIONVIEW";
          break;

        case CURRENT_VIEW.TOPRICH_VIEW:
          sceneName = "TOPRICHVIEW";
          break;

        case CURRENT_VIEW.SEND_GIFT_VIEW:
          sceneName = "SENDGIFTVIEW";
          break;

        case CURRENT_VIEW.MAIL_CHIP_VIEW:
          sceneName = "MAILVIEW";
          break;

        case CURRENT_VIEW.FREECHIP_VIEW:
          sceneName = "FREECHIPVIEW";
          break;

        case CURRENT_VIEW.PROFILE_VIEW:
          sceneName = "PROFILEVIEW";
          break;
        case CURRENT_VIEW.INFO_FRIEND_VIEW:
          sceneName = "INFOFRIENDVIEW";
          break;

        default:
          break;
      }
    }
    cc.NGWlog("------> Return sceneName ", sceneName);
    return sceneName;
  },
  userChangePass() {
    this.onShowConfirmDialog(this.getTextConfig('change_pass_succes'), () => {
      UIManager.instance.onLogout();
    });

    if (this.user_name == cc.sys.localStorage.getItem("USER_PLAYNOW")) {
      cc.sys.localStorage.setItem("PASS_PLAYNOW", this.passwordToBeChanged);
    }

    if (this.user_name == cc.sys.localStorage.getItem("user_name")) {
      cc.sys.localStorage.setItem("password", this.passwordToBeChanged);
    }

    Global.RegisterPopup.onClose();
  },
  userUpVip(jsonData) {
    this.user.vip = 1;
    this.user.ag += jsonData.AG;

    Global.MainView.setInfo();
    Global.MainView.isUpVip = true;
    Global.ProfileView.updateVip();
    Global.InfoPlayerView.updateVip();
    this.user.vip = 1;
    this.onShowConfirmDialog(this.getTextConfig('archive_vip1'));

    if (this.gameView === null) {
      Global.MainView.isUpVip = false;
    } else {
      if (this.gameView.thisPlayer !== null && this.curGameId != GAME_ID.ROULETTE) {
        this.gameView.thisPlayer.vip = 1;
        if (this.gameView.thisPlayer._playerView !== null) {
          this.gameView.thisPlayer.updateVip();
        }
      }
    }

  },
  userChangename(jsonData) {
    this.user.uname = jsonData.U;
    this.user.displayName = jsonData.U;
    Global.MainView.updateName();
    Global.ProfileView.updateName();
    this.onShowWarningDialog(
      this.getTextConfig('change_name_success') + " " + jsonData.U,
      DIALOG_TYPE.ONE_BTN, this.getTextConfig('ok'),
      () => {
        this.onReconnect();
      }
    );
  },
  userRegister(jsonData) {
    if (jsonData.hasOwnProperty("data")) {
      this.onShowConfirmDialog(jsonData.data);
      Global.ProfileView.updateChip();
      require('SMLSocketIO').getInstance().emitUpdateInfo();
    }
    if (jsonData.status === true) {
      cc.sys.localStorage.setItem("isReg", 'false');

      cc.sys.localStorage.setItem("USER_PLAYNOW", this.userNameRegTempl);
      cc.sys.localStorage.setItem("PASS_PLAYNOW", this.passRegTemple);
      this.user.uname = this.userNameRegTempl;
      this.user_pass = this.passRegTemple;
      this.user_name = this.userNameRegTempl;

      this.onShowWarningDialog(
        this.getTextConfig('change_name_success'),
        DIALOG_TYPE.ONE_BTN, this.getTextConfig('ok'),
        () => {
          this.onReconnect();
        }
      );
    } else
      this.onShowConfirmDialog(jsonData.msg);
  },
  userHasNewMailAdmin() {
    require('NetworkManager').getInstance().getMail(12);
    let isInGame = false;
    if (require("GameManager").getInstance().gameView != null) isInGame = true;
    let typeBTN = isInGame ? DIALOG_TYPE.ONE_BTN : DIALOG_TYPE.TWO_BTN;
    let textShow = this.getTextConfig("has_mail_show_gold");
    if (isInGame) {
      textShow = textShow.split(",")[0];
    }
    this.onShowWarningDialog(
      textShow,
      typeBTN,
      this.getTextConfig("ok"),
      () => {
        if (!isInGame)
          Global.MainView.onClickFreechip();
      },
      this.getTextConfig("label_cancel")
    );
  },
  handleJackPot(jsonData) {
    if (this.gameView.node != null) {
      if (this.curGameId === GAME_ID.BINH)
        this.gameView.setJackPot(jsonData.G);
      if (this.curGameId === GAME_ID.SLOT_20_LINE_JP)
        this.gameView.setJackPot(jsonData.G);
    }
  },
  handleJackPotWin(jsonData) {
    let jackpot = jsonData.G;
    let name = jsonData.N;
    let jpwin = jsonData.M;

    if (this.gameView != null && this.gameView.node != null) {
      if (this.curGameId === GAME_ID.BINH) {
        this.gameView.setJackPot(jackpot);
        this.gameView.showJackpotWin(name, jpwin);
      }
      if (this.curGameId === GAME_ID.SLOT_20_LINE_JP) {
        this.gameView.handleJackpot(jackpot);
        this.gameView.handleJackPotWin(name, jpwin);
      }
    }
  },
  handleUpdateJackPot(jsonData) {
    if (jsonData.gameId === GAME_ID.BINH)
      this.curJackPotBinh = jsonData.M;
    if (jsonData.gameId === GAME_ID.SLOT_20_LINE_JP)
      this.curJackPotSlot = jsonData.M;
    if (this.gameView) {
      if (this.curGameId === GAME_ID.BINH) {
        this.gameView.setJackPot(jsonData.M);
      }
      if (this.curGameId === GAME_ID.SLOT_20_LINE_JP && this.gameView != null)
        this.gameView.handleJackpot(jsonData.M);
    }
    Global.MainView.onUpdateJackPot(jsonData.gameId);
  },
  handleJackPotHis(jsonData) {
    this.list_data_jackpot_history = [];
    if (!jsonData.data) return;
    var listwin = JSON.parse(jsonData.data);
    var data = listwin.lswin;
    for (var i = 0; i < data.length; i++) {
      var item = new itemJackPotHistory();
      item.timeWin = data[i].timeWin;
      item.userName = data[i].username;
      item.reward = data[i].markWin;
      item.chipBet = data[i].markUnit;
      item.userID = data[i].userid;
      this.list_data_jackpot_history.push(item);
    }
  },
  handlePromotion(jsonData) {
    var agPro = jsonData.NO;
    var timeO = jsonData.TO;
    var type = jsonData.T;
    // gift code

    if (type == 6)
      this.promotionInfo.giftCode = agPro;

    // 0            1           2           3           4              5
    // CHIP_MONEY, CHIP_ADMIN, CHIP_UPVIP, CHIP_ONLINE, CHIP_VIDEO, CHIP_GIFTCODE
    switch (type) {
      case 0:
        this.promotionInfo.notEnoughMoney = agPro;
        break;
      case 1:
        this.promotionInfo.adminMoney = agPro;
        break;
      case 2:
        this.promotionInfo.upVip = agPro;
        break;
      case 3:
        this.promotionInfo.agOnline = agPro;
        this.promotionInfo.time = timeO;
        break;
      case 4:
        this.promotionInfo.video = agPro;
        break;
      case 5:
        this.promotionInfo.giftCode = agPro;
        break;
    }
    if (type == 3) {
      Global.MainView.setTimeGetMoney();
      Global.MainView.MoneyBonusFly(agPro);
      require('NetworkManager').getInstance().sendPromotionInfo();
    }
    else {
      Global.MainView.updateChipAndSafe();
      require('NetworkManager').getInstance().sendPromotionInfo();
    }
    if (Global.FreeChipView.node.getParent() !== null)
      Global.FreeChipView.loadFreeChip();

    require('SMLSocketIO').getInstance().emitUpdateInfo();
  },
  userNapTienSuccess(jsonData) {
    if (jsonData != null) {
      this.onShowConfirmDialog(jsonData.msg);
    }
  }
});
module.exports = GameManager;
