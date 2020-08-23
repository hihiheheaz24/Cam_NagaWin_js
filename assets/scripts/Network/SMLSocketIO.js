var EVENT = "event";
var REGINFO = "reginfo";
var LOGIN = "login";
var BEHAVIOR = "behavior";
var UPDATE = "update";

var handleEvent = function (data) {
  
  cc.NGWlog("---handleEvent--> SIO: data   ", JSON.stringify(data));

  if (cc.sys.isNative) {
    data = JSON.parse(data);
  }

  let evt = data.event;
  cc.NGWlog("===============> SIO: event la " + evt);
  switch (evt) {
    case 'filter': {
      SMLSocketIO.getInstance()._isFilter = true;
      cc.sys.localStorage.setItem("dataFilter", JSON.stringify(data));
      require('SMLSocketIO').getInstance().packetDetail = data.packetDetail;
      require('SMLSocketIO').getInstance().blackListBehaviorIgnore = data.behaviorI;
      require('SMLSocketIO').getInstance().whiteListOnlySendEvt = data.packet;

      require('SMLSocketIO').getInstance().isGetedListFillter = true;
      cc.NGWlog('-----> SIO: - ', require('SMLSocketIO').getInstance().packetDetail);
      cc.NGWlog('-----> SIO: -- ', require('SMLSocketIO').getInstance().blackListBehaviorIgnore);
      cc.NGWlog('-----> SIO: --- ', require('SMLSocketIO').getInstance().whiteListOnlySendEvt);
      let listDataResendForPacket = require('SMLSocketIO').getInstance().listDataResendForPacket;
      while (listDataResendForPacket.length > 0) {
        let resend = listDataResendForPacket[0];
        require('SMLSocketIO').getInstance().emitSIOWithValuePacket(resend.strData, resend.namePackage, resend.isSend, resend.isPacketDetai, resend.timestamp);
        listDataResendForPacket.shift();
      }
      break;
    }
    case 'banner': {
      cc.log("SML Banner ");
      let length = data.data.length;
      let arrOnlistFalse = [];
      let arrOnlistTrue = [];

      for (let i = 0; i < length; i++) {
        let item = data.data[i];
        if (item.urlImg != null && item.urlImg != "") {
          if (!item.isOnList) {
            arrOnlistFalse.push(item);
          } else {
            arrOnlistTrue.push(item)
          }
        }

      }
      require("UIManager").instance.preLoadBaner(data.data);
      require("UIManager").instance.handleBannerIO(arrOnlistFalse);
      require("UIManager").instance.arrBanerOnList = require("UIManager").instance.arrBanerOnList.concat(arrOnlistTrue);
      if (require("UIManager").instance.arrBanerOnList.length < 1) {
        Global.MainView.btn_newsBanner.active = false;
      } else {
        Global.MainView.btn_newsBanner.active = true;
      }

      break;
    }
    case 'getcf': {
      require("LoadingGame").instance.getConfig_0();//force get config
      break;
    }
  }
};

var SMLSocketIO = cc.Class({
  ctor: function () {
    cc.NGWlog('---- SIO: init');
  },
  properties: {
    isConnected: false,
    isConnecting: false,
    isDisconnect: false,
    isErr: false,
    isSendFirst: false,
    _socketIO: null,
    _intervalRec: null,
    packetDetail: [],//evt nào có trong array này thì bắn đủ data (bắn lên "packetDetail")
    blackListBehaviorIgnore: [],//behaviorI: (behavior Ignore) evt nào có trong đây thì ko bắn lên  (bắn lên "behavior")
    whiteListOnlySendEvt: [],//packet: evt nào có trong array này thì bắn evt, isSend, timestamp.. (bắn lên "packet")
    listResend: [],
    listDataResendForPacket: [],
    isGetedListFillter: false,
    isEmitReginfo: false,
    _isFilter: false,
    DATAEVT0: null,
    isDaLogin: false,
  },

  statics: {
    _instance: null,

    getInstance() {
      if (this._instance == null) {
        this._instance = new SMLSocketIO();
      }
      return this._instance;
    },
  },


  intiSml() {
    let blackList = cc.sys.localStorage.getItem("dataFilter");
    blackList = JSON.parse(blackList);
    if (blackList) {
      this.packetDetail = blackList.packetDetail;
      this.blackListBehaviorIgnore = blackList.behaviorI;
      this.whiteListOnlySendEvt = blackList.packet;
    }
  },
  startSIO() {
    let url = require('ConfigManager').getInstance().u_SIO;
    if (url == '' || url == null) url = '';
    // url = "https://sio.ngwcasino.com/ngwjs";//hien cmt;
    cc.NGWlog("=======>SML 1 startSIO2: =======================url " + url);
    if (this.isConnecting ) {
      return;
    }
    require("UIManager").instance.arrBanerOnList.length = 0;
    if (Global.MainView != null)
      Global.MainView.btn_newsBanner.active = false;
    cc.NGWlog("=======>1 startSIO: =======================connecting... ");
    this.isConnecting = true;
    this.isConnected = false;
    if (cc.sys.isNative) {
      window.io = SocketIO.connect;
    }
    this._socketIO = io(url,
      {
        reconnection: false, //tren web ko de option ko connect dc a duc ạ.
      },
      Global.CApem);

    this._socketIO.on("connect", () => {
      require("UIManager").instance.listIdBannerViewed.length = 0;
      require("UIManager").instance.arrayIDBannerShowed.length = 0;
      require("UIManager").instance.arrayIDBannerClickedInType7.length = 0
      cc.NGWlog("=======> SML MSG startSIO:  Connected");
      // require("TrackingManager").sioFireEvenConnectHandle();
      this.listResend = [];
      this.isConnecting = false;
      this.isConnected = true;
      if (!this.isEmitReginfo) {
        this.emitReginfo();
        this.isEmitReginfo = true;
      }
      if (this.isSendFirst) {
        if (require("GameManager").getInstance().isLoginSucces) {
          cc.NGWlog("SIO: Send emitlogin SML");
          this.emitLogin();
        }
      }
      if (this.DATAEVT0 != null) {
        if (require("GameManager").getInstance().isLoginSucces === true) {
          this.emitSIOWithValue(this.DATAEVT0, "LoginPacket", false);
        }
      }
      this.listResend = [];
    });
    this._socketIO.on('error', (msg) => {
      if (this.isErr ) return;
      this.isEmitReginfo=false;
      this.isErr = true;
      this.isConnecting = false;
      this.stopSIO();
      cc.NGWlog("=======> SML startSIO:  error.Message=== ", msg);
      setTimeout(() => {
        this.startSIO();
      }, 1000)

    });
    this._socketIO.on('disconnect', (msg) => {
      this.isSendFirst = true;
      this.isConnecting = false;
      this.isEmitReginfo=false;
      this.stopSIO();
      cc.NGWlog("=======> SML startSIO:  disconnect.Message=== ", msg);
      this._socketIO.__nativeRefs = null;
      setTimeout(() => {
        this.startSIO();
      }, 1000)

    });
    this._socketIO.on("event", handleEvent);
  },
  stopSIO() {
    cc.log("SML Stop SIO");
  
    if (this._socketIO != null) {
      this._socketIO.__nativeRefs = null;
      this._socketIO.disconnect();
    }
  },
  testBanner() {
    let str = '{\"event\":\"banner\",\"data\":[{\"arrButton\":[{\"type\":\"openlink\",\"urlBtn\":\"https://storage.googleapis.com/cdn.lengbear.com/Banner/lq0/1011/btn_recharge.png\",\"pos\":[0.5,0.5],\"urlLink\":\"http://kenh14.vn/\"}],\"_id\":\"5dcba97af89e24167aee37f1\",\"id\":\"5dc3edacdda6164a2693f86e\",\"title\":\"test chọn game\",\"isClose\":true,\"urlImg\":\"https://storage.googleapis.com/cdn.ngwcasino.com/Test/1.jpg\",\"isOnList\":false,\"showByActionType\":6,\"priority\":1},{\"arrButton\":[{\"type\":\"openlink\",\"urlBtn\":\"https://storage.googleapis.com/cdn.lengbear.com/Banner/lq0/1011/btn_recharge.png\",\"pos\":[0.5,0.2],\"urlLink\":\"https://vnexpress.net/\"}],\"_id\":\"5dcba97af89e24167aee37f2\",\"id\":\"5dca5cb01442f41a4c8f2242\",\"title\":\"test chọn game\",\"isClose\":true,\"urlImg\":\"https://storage.googleapis.com/cdn.ngwcasino.com/Test/3.jpg\",\"isOnList\":false,\"showByActionType\":6,\"priority\":2}]}';
    handleEvent(str);
  },
  emitSIO(eventName, strData) {
 
    
    if (this._socketIO != null && this.isConnected) {
      this._socketIO.emit("event", strData);
    } else {
      this.listResend.push([eventName, strData]);
    }
  },

  emitSIOWithMapData(evtName, mapData) {
    
    let objectVL = {};
    mapData.forEach((valu, key) => {
      cc.NGWlog(`SIO: Key ${key} is ${valu}`);
      objectVL[key] = valu;
    });
    objectVL.event = evtName;
    objectVL.timestamp = new Date().getTime();
    cc.NGWlog("====> SIO: DATA ====>", JSON.stringify(objectVL));
    this.emitSIO(evtName, JSON.stringify(objectVL));
  },

  emitSIOWithValue(objectVL, namePackage, isSend) {
    
    //packetDetail: evt nào có trong array này thì bắn đủ data (bắn lên "packetDetail")
    this.emitSIOWithValuePacket(objectVL, namePackage, isSend, true);

    //packet: evt nào có trong array này thì bắn evt, isSend, timestamp.. (bắn lên "packet")
    this.emitSIOWithValuePacket(objectVL, namePackage, isSend, false);
  },

  emitSIOCCC(strData) {
  },

  emitSIOCCCNew(strData) {
    if (this.blackListBehaviorIgnore.includes(strData) || this.blackListBehaviorIgnore.includes('all_sio')) {
      return;
    }

    // return;
    let mapDM = new Map();
    mapDM.set(BEHAVIOR, strData);
    this.emitSIOWithMapData(BEHAVIOR, mapDM);
  },

  emitSIOWithValuePacket(packetValue, namePackage, isSend, isPacketDetai, timeStamp = 0) {
   
    let timestamp = new Date().getTime();
    let objectVV = Object.assign({}, packetValue);//packetValue.slice();

    if (!this.isConnected || !this.isGetedListFillter) {
      let objSave = {};
      objSave.strData = packetValue;
      objSave.isSend = isSend;
      objSave.isPacketDetai = isPacketDetai;
      objSave.namePackage = namePackage;
      objSave.timestamp = timestamp;

      this.listDataResendForPacket.push(objSave);
      return;
    }
    let evtt = "";

    if (objectVV.hasOwnProperty("evt")) {
      evtt = objectVV.evt;
    } else if (objectVV.hasOwnProperty("idevt")) {
      evtt = objectVV.idevt + '';
    } else {
      evtt = namePackage;
      objectVV.evt = evtt;

    }
    if (isPacketDetai) {
      if (this.packetDetail.includes(evtt) || this.packetDetail.includes('all_sio')) {
        objectVV.event = "packetDetail";
        if (packetValue.evt === "0") this.DATAEVT0 = Object.assign({}, packetValue);
      } else {
        //cc.NGWlog("SIO: EVT NAY THUOC DIEN CHINH SACH KO DUOC GUI DI :( -  evt: " + evtt);
        return;
      }
    } else {
      if (this.whiteListOnlySendEvt.includes(evtt) || this.whiteListOnlySendEvt.includes('all_sio')) {
        objectVV = {};
        objectVV.evt = evtt;
        objectVV.event = "packet";
      } else {
        //cc.NGWlog("SIO: =-=-=-=-==== CHIM CUT");
        return;
      }
    }
    objectVV.packetData = namePackage;
    objectVV.isSendData = isSend;
    objectVV.timestamp = (timeStamp == 0 ? timestamp : timeStamp);
    this.emitSIO(EVENT, JSON.stringify(objectVV));
  },

  //Gui sau' khi connect success --> gui thong tin device
  emitReginfo() {
    
   
    let objectVL = {};
    objectVL.event = REGINFO;
    let osName = "web";
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      osName = "Android";
    }
    else if (cc.sys.os === cc.sys.OS_IOS) {
      osName = "iOS";
    }

    objectVL.location = "WHERE";
    objectVL.pkgname = require('GameManager').getInstance().bundleID;
    objectVL.versionCode = require('GameManager').getInstance().versionGame;
    // objectVL.versionName = require('GameManager').getInstance().osversion;
    objectVL.versionDevice = require('GameManager').getInstance().osversion;
    objectVL.os = osName;
    if (cc.sys.isBrowser) {
      let curLang = cc.sys.localStorage.getItem("language_save_2");
      if (curLang === null) curLang = 0;
      if (curLang === 0) curLang = "en-us";
      else curLang = "cam";
      require('GameManager').getInstance().language = curLang;
    }
    objectVL.language = require('GameManager').getInstance().language;
    objectVL.model = require('GameManager').getInstance().devicename; //kieu may
    objectVL.brand = require('GameManager').getInstance().brand; //dong may:oppo, samsung ...

    objectVL.resolution = [parseInt(cc.winSize.width), parseInt(cc.winSize.height)];
    objectVL.time_start = Global.TimeOpenApp;
    //neu chi co 1 sim
    // objectVL.carrier = require('GameManager').getInstance().p1Provider;
    //else
    //    objectVL.carrier = "";//StringUtils::format("%s, %s", GCManager->p1Provider.c_str(), GCManager->p1Provider.c_str()); //[String],
    objectVL.devID = cc.sys.localStorage.getItem("GEN_DEVICEID");
    objectVL.operatorID = OPERATOR;
    this.emitSIO(REGINFO, JSON.stringify(objectVL));
    cc.log("dang ky sml========= reginfo===="+JSON.stringify(objectVL));
  },

  emitLogin() {
   
    cc.log("dang ky sml========= login");
    // this.isSendFirst = false;
    //tracking io khi login success
    let mapDataLogin = new Map();
    mapDataLogin.set("event", LOGIN);
    let ip = cc.sys.localStorage.getItem("curServerIp" + NAME_GAME) || "app-001.ngwcasino.com";
    let verHotupdate = cc.sys.localStorage.getItem("verHotUpdate") || require('GameManager').getInstance().versionGame;

    mapDataLogin.set("gameIP", ip);
    mapDataLogin.set("verHotUpdate",verHotupdate);
    mapDataLogin.set("id", require('GameManager').getInstance().user.id);
    mapDataLogin.set("name", require('GameManager').getInstance().user.uname);
    mapDataLogin.set("ag", require('GameManager').getInstance().user.ag);
    mapDataLogin.set("vip", require('GameManager').getInstance().user.vip);
    mapDataLogin.set("lq", require('GameManager').getInstance().user.lq);
    mapDataLogin.set("curView", require('GameManager').getInstance().currentView);
    mapDataLogin.set("gameID", require('GameManager').getInstance().curGameId);
    mapDataLogin.set("disID", require('GameManager').getInstance().disId);
    cc.NGWlog('-> SIO: emitLogin', mapDataLogin);
    this.emitSIOWithMapData(LOGIN, mapDataLogin);
  },

  emitUpdateInfo() {
    
    //tracking io khi có sự thay đổi thông tin

    // return;

    let mapData = new Map();
    mapData.set("id", require('GameManager').getInstance().user.id);
    mapData.set("name", require('GameManager').getInstance().user.uname);
    mapData.set("ag", require('GameManager').getInstance().user.ag);
    mapData.set("vip", require('GameManager').getInstance().user.vip);
    mapData.set("lq", require('GameManager').getInstance().user.lq);
    mapData.set("curView", require('GameManager').getInstance().getCurrentSceneName());
    mapData.set("gameID", require('GameManager').getInstance().curGameId);

    this.emitSIOWithMapData(UPDATE, mapData);
  }
});

module.export = SMLSocketIO;
