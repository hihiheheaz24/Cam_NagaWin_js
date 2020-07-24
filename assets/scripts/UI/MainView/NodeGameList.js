const GameManager = require('GameManager')
var countFail = 0;
var NodeGameList = cc.Class({
  extends: cc.Component,
  // name: "NodeGameList",
  properties: {
    btn_big_game: {
      default: null,
      type: cc.Button
    },

    // btn_small_game: {
    //     default: null,
    //     type: cc.Button
    // },

    listView: {
      default: null,
      type: cc.ScrollView
    },

    item_game: {
      default: null,
      type: cc.Prefab
    },
    isChoosingGame: false,
    // viewContent: cc.Node


    isHaveUpdate: false,
    ForcedUpdate: true,
    aniUpdate: require("Loadingresource"),
    isInitAssets: true,
    manifest: null,
    isFromBanner: false,


  },
  onLoad() {
    Global.NodeGameListView = this;
  },
  init: function () {
    let listGameId = require("ConfigManager").getInstance().listGameId;
    //hien cmt de tam
    let listGameLoc = [1111, 9500, 9501];
    for (let i = 0; i < listGameLoc.length; i++) {
      if (listGameId.includes(listGameLoc[i])) {
        listGameId.splice(listGameId.indexOf(listGameLoc[i], 1));
      }
    }
    //de tam
    if (!listGameId.includes(GAME_ID.TIENLEN)) {
      this.node.getComponent(cc.Layout).enabled = false;
      this.btn_big_game.node.active = false;
      let length = listGameId.length;
      if (length >= 9) {
        this.listView.getComponent(cc.Widget).left = 0;
        this.listView.getComponent(cc.Widget).right = 80;
      } else if (length < 9 && length > 6) {
        this.listView.getComponent(cc.Widget).left = 100;
      } else if (length <= 6) {
        this.listView.getComponent(cc.Widget).left = 250;
      } else {
        this.listView.getComponent(cc.Widget).left = 400;
      }
    } else {
      this.node.getComponent(cc.Layout).enabled = false;
      this.btn_big_game.node.active = true;
      this.listView.getComponent(cc.Widget).left = 330;
      this.listView.getComponent(cc.Widget).right = 80;

    }
    this.listView.getComponent(cc.Widget).updateAlignment();
    this.listView.scrollToLeft(0.1);
    let scrViewct = this.listView.content;
    scrViewct.removeAllChildren(true);

    // for (let i = 0; i < listGameId.length; i++) {
    //   if (listGameId[i] === GAME_ID.TIENLEN) {
    //     let btn_gameTo = cc.instantiate(this.item_game).getComponent("ItemGameList");
    //     scrViewct.addChild(btn_gameTo.node);
    //     btn_gameTo.setInfo(GAME_ID.TIENLEN);
    //     break;
    //   }
    // }

    for (let i = 0; i < listGameId.length; i++) {
      if (listGameId[i] === GAME_ID.TIENLEN)
        continue

      let btn_gameComponent = cc.instantiate(this.item_game).getComponent("ItemGameList");
      scrViewct.addChild(btn_gameComponent.node);
      btn_gameComponent.setInfo(listGameId[i]);
    }

    if (cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS) {
      let isHaveUd = cc.sys.localStorage.getItem("updateResource" + GAME_ID.TIENLEN);
      if (isHaveUd != null && typeof isHaveUd != "undefined") {

        if (isHaveUd == true) {
          //  this.HaveUpdate();
        } else {
          this.ForcedUpdate = false;
        }
      } else {
        cc.NGWlog(" ko co nhung gia tri la " + isHaveUd);
        //  this.HaveUpdate();
      }
    } else {
      this.ForcedUpdate = false
    }
  },

  onClickChooseGame(isFromBanner = false) {
    if (Global.MainView._isClickGame) return;
    this.isFromBanner = isFromBanner;
    // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSelectGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
    if (this.isInitAssets && cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS) {
      cc.NGWlog("init assets============")
      this.initAsset();
      this.getManifest();
      this.isInitAssets = false;
    }
    // this.ForcedUpdate = false;//hien cmt test
    if (!this.ForcedUpdate) { // vao game luon,k tai resource 
      cc.NGWlog('------------ onClickChooseGame');
      if (require("GameManager").getInstance().user.ag <= 0) {
        Global.LobbyView.showPopupWhenLostChip(false, true);
        return;
      }
      Global.MainView._isClickGame = true;

      require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSelectGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
      require('UIManager').instance.onShowLoad();
      require('NetworkManager').getInstance().sendSelectGame(GAME_ID.TIENLEN);
      require('UIManager').instance.onShowLobbyView();
      setTimeout(() => {
        Global.MainView._isClickGame = false;
      }, 2000);
    } else {
      this.btn_big_game.interactable = false;
      this.aniUpdate.node.active = true;
      this.aniUpdate.updateAni();
    }
  },
  setJackPot(gameId, isRun) {
    for (let i = 0; i < this.listView.content.children.length; i++) {
      let item = this.listView.content.children[i].getComponent("ItemGameList");
      if (item.gameId == gameId) {
        item.setJackPot(isRun);
        break;
      }

    }
  },

  onClickGameFromBanner(gameId) {
    let i = 0;
    let size = this.listView.content.children.length;
    for (i; i < size; i++) {
      let item = this.listView.content.children[i].getComponent("ItemGameList");
      if (item.gameId === gameId) {
        item.onClickChooseGame(true);
      }
    }
  },


  initAsset() {
    if (!cc.sys.isNative) {
      return;
    }
    this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "AllGame/" + GAME_ID.TIENLEN;
    cc.NGWlog('thu muc luu la===' + this._storagePath);
    this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
    this._am.setVerifyCallback(function (path, asset) {

      var compressed = asset.compressed;

      var expectedMD5 = asset.md5;

      var relativePath = asset.path;

      var size = asset.size;
      if (compressed) {
        cc.NGWlog("Verification passed : " + relativePath);
        return true;
      } else {
        cc.NGWlog("Verification passed : " + relativePath + " (" + expectedMD5 + ")");
        return true;
      }
    });
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      this._am.setMaxConcurrentTask(2);
    }

  },

  onDestroy() {
    if (this._checkListener) {
      cc.eventManager.removeListener(this._checkListener);
      this._checkListener = null;
    }

    if (this._updateListener) {
      cc.eventManager.removeListener(this._updateListener);
      this._updateListener = null;
    }

    if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
      this._am.release();
    }
  },
  hotUpdate() {
    if (this._am && !this._updating) {
      if (this.isFromBanner == true) {
        require("UIManager").instance.loadingBar.node.active = true;
        require("UIManager").instance.loadingBar.is_load_update = false;
        require("UIManager").instance.loadingBar.setProgress(0);
      }

      this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
      cc.eventManager.addListener(this._updateListener, 1);

      if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
        var url = this.manifest.nativeUrl;
        if (cc.loader.md5Pipe) {
          url = cc.loader.md5Pipe.transformURL(url);
        }
        this._am.loadLocalManifest(url);
      }

      this._failCount = 0;
      this._am.update();

      this._updating = true;
    } else {
      let _this = this;
      this.scheduleOnce(function () {
        _this.hotUpdate();
      }, 0.5)
    }
  },
  checkUpdate() {
    cc.NGWlog("Check Update");
    if (this._updating) {
      cc.NGWlog("Checking or updating ...");
      return;
    }
    if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
      // Resolve md5 url
      var url = this.manifest.nativeUrl;
      if (cc.loader.md5Pipe) {
        url = cc.loader.md5Pipe.transformURL(url);
      }
      this._am.loadLocalManifest(url);
    }

    if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
      cc.NGWlog("Failed to load local manifest ...");
      return;
    }
    this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
    cc.eventManager.addListener(this._checkListener, 1);
    this._am.checkUpdate();
    this._updating = true;
  },
  getManifest() {
    cc.loader.loadRes("resourceManifest/" + GAME_ID.TIENLEN, cc.Asset, (err, manifest) => {
      this.manifest = manifest;
      this.checkUpdate();
    })
  },
  updateCb: function (event) {
    var needRestart = false;
    var failed = false;
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_PROGRESSION:
        if (this.isFromBanner == true) require("UIManager").instance.loadingBar.setProgress(event.getPercent());
        this.aniUpdate.setPercent(event.getPercent());
        var msg = event.getMessage();
        if (msg) {
          cc.NGWlog("Updated file: " + msg);
        }
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        cc.NGWlog("lo down load == bo qua");

        this.isInitAssets = true;
        failed = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        cc.NGWlog("phien ban moi nhat");
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FINISHED:
        cc.NGWlog("Update finished. " + event.getMessage());
        needRestart = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FAILED:
        cc.NGWlog("Update failed. " + event.getMessage());

        countFail++;
        if (countFail < 5) {
          this._am.downloadFailedAssets();
          this._updating = false;
          this._canRetry = true;
        } else {
          jsb.fileUtils.removeDirectory(this._storagePath);
          this.isInitAssets = true;
          failed = true;
          countFail = 0;
        }

        break;
      case jsb.EventAssetsManager.ERROR_UPDATING:
        cc.NGWlog(
          "Asset update error: " +
          event.getAssetId() +
          ", " +
          event.getMessage()
        );
        break;
      case jsb.EventAssetsManager.ERROR_DECOMPRESS:
        console.log("loi la==>" + event.getMessage());
        this.isInitAssets = true;
        failed = true;
        break;
      default:
        break;
    }

    if (failed) {
      if (this._updateListener) {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;
      }
      // this._am.setEventCallback(null);
      this._updateListener = null;
      this._updating = false;
      this.aniUpdate.node.active = false;
      this.btn_big_game.interactable = true;
      if (this.isFromBanner == true) require("UIManager").instance.loadingBar.node.active = false;
    }
    if (needRestart) {
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var newPaths = this._am.getLocalManifest().getSearchPaths();
      Array.prototype.unshift.apply(searchPaths, newPaths);
      cc.sys.localStorage.setItem(
        "HotUpdateSearchPaths",
        JSON.stringify(searchPaths)
      );
      this.btn_big_game.interactable = true;
      let str = "updateResource" + GAME_ID.TIENLEN;
      this.ForcedUpdate = false;
      cc.sys.localStorage.setItem(str, false);
      this.isHaveUpdate = false;
      this.aniUpdate.node.active = false;
      jsb.fileUtils.setSearchPaths(searchPaths);
      if (this._updateListener) {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;
      }

      if (this.isFromBanner == true) {
        require("UIManager").instance.loadingBar.node.active = false;
        this.onClickChooseGame();
        this.isFromBanner = false;
      }
    }
  },
  checkCb: function (event) {
    let str = "updateResource" + GAME_ID.TIENLEN;
    cc.NGWlog("Code: " + event.getEventCode());
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        cc.NGWlog("ko tim thay mainfest file");

        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        cc.NGWlog("loi download mainFest");
        // this.aniUpdate.HaveUpdate();
        this.btn_big_game.interactable = true;
        this.aniUpdate.node.active = false;
        this.isInitAssets = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        cc.NGWlog("Phien ban moi nhat");
        cc.sys.localStorage.setItem(str, false);
        break;
      case jsb.EventAssetsManager.NEW_VERSION_FOUND:
        cc.NGWlog("bat dau hotupdate");
        if (this.ForcedUpdate) {
          this.aniUpdate.node.active = true;
          this.aniUpdate.updateAni();
          this.hotUpdate();
        }
        else {
          cc.sys.localStorage.setItem(str, true);
          this.aniUpdate.node.active = false;
        }
        break;
      default:
        return;
    }
    // this._am.setEventCallback(null);
    if (this._checkListener) {
      cc.eventManager.removeListener(this._checkListener);
      this._checkListener = null;
    }

    this._checkListener = null;
    this._updating = false;
  },


});
module.exports = NodeGameList;
