var HotUpdate = cc.Class({
  extends: cc.Component,

  properties: {
    loadingBar: {
      default: null,
      type: require("LoadingBar")
    },
    manifestUrl: {
      type: cc.Asset,
      default: null
    },
    _updating: false,
    _canRetry: false,
    _storagePath: "",
  },
  statics: {
    instance: null
  },

  checkCb: function (event) {
    this.unscheduleAllCallbacks();
    console.log("Code: " + event.getEventCode());
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        console.log("ko tim thay mainfest file");
        require("UIManager").instance.nextStep();
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        console.log("loi download mainFest");
        require("UIManager").instance.nextStep();
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        console.log("Phien ban moi nhat");
        require("UIManager").instance.nextStep();
        break;
      case jsb.EventAssetsManager.NEW_VERSION_FOUND:
        console.log("Co phien ban moi! Co muon update ko?");
        // let text = require("GameManager").getInstance().getTextConfig("txt_have_new_version_game");
        // require("UIManager").instance.onShowWarningDialogDelayFunc(text, 5, () => {
        //   this.hotUpdate();
        // }, true);
        // this.hotUpdate();
        this.hotUpdate();
        break;
      default:
      console.log("case default hotupdate");
      //  require("UIManager").instance.nextStep();
        return;
    }
    
    if (this._checkListener != null) {
      cc.eventManager.removeListener(this._checkListener);
      this._checkListener = null;
    }

    this._updating = false;
  },

  updateCb: function (event) {
    var needRestart = false;
    var failed = false;
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        console.log("ko tim thay mainfest file");
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_PROGRESSION:
        console.log("so phan tram dc tai la===" + event.getPercent());
        this.loadingBar.is_load_update = true;
        this.loadingBar.changeinfo();
        this.loadingBar.setProgress(event.getPercent());
        var msg = event.getMessage();
        if (msg) {
          console.log("Updated file: " + msg);
        }
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        console.log("lo down load == bo qua");
        failed = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        console.log("phien ban moi nhat");

        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FINISHED:
        console.log("Update finished. " + event.getMessage());
        needRestart = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FAILED:
        console.log("Update failed. " + event.getMessage());
        this._am.downloadFailedAssets();
        this._updating = false;
        this._canRetry = true;
        break;
      case jsb.EventAssetsManager.ERROR_UPDATING:
        console.log(
          "Asset update error: " +
          event.getAssetId() +
          ", " +
          event.getMessage()
        );
        break;
      case jsb.EventAssetsManager.ERROR_DECOMPRESS:
        console.log("loi la==>" + event.getMessage());
        break;
      default:
        break;
    }

    if (failed) {
      if (this._updateListener) {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;
      }
      this._updating = false;
      this.loadingBar.node.active = false;
      require("UIManager").instance.nextStep();
    }
    if (needRestart) {
      if (this._updateListener) {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;
      }
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var newPaths = this._am.getLocalManifest().getSearchPaths();

      console.log(JSON.stringify(newPaths));

      Array.prototype.unshift.apply(searchPaths, newPaths);
      cc.sys.localStorage.setItem(
        "HotUpdateSearchPaths",
        JSON.stringify(searchPaths)
      );
      jsb.fileUtils.setSearchPaths(searchPaths);
      cc.audioEngine.stopAll();
      cc.game.restart();
      // let text = require("GameManager").getInstance().getTextConfig("txt_NeedRestartGame");
      // text = text.replace("%s", this.versionB);
      // require("UIManager").instance.onShowWarningDialogDelayFunc(text, 3, () => {
      //   cc.game.restart();
      // }, false);
      //   
    }
  },

  checkUpdate() {
    console.log("Check Update");
    if (this._updating) {
      console.log("Checking or updating ...");
      return;
    }
    if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
      // Resolve md5 url
      var url = this.manifestUrl.nativeUrl;
      if (cc.loader.md5Pipe) {
        url = cc.loader.md5Pipe.transformURL(url);
      }
      console.log("gia tri url la===" + url);
      this._am.loadLocalManifest(url);
    }

    if (
      !this._am.getLocalManifest() ||
      !this._am.getLocalManifest().isLoaded()
    ) {
      console.log("Failed to load local manifest ...");
      return;
    }
    // this._am.setEventCallback(this.checkCb.bind(this));
    this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
    cc.eventManager.addListener(this._checkListener, 1);
    this._am.checkUpdate();
    this._updating = true;
    this.scheduleOnce(() => {
        require("UIManager").instance.nextStep();
    }, 5)
  },

  hotUpdate() {
    if (this._am && !this._updating) {
      console.log("Chay vao hotUpdate");
      this.loadingBar.node.active = true;
      // this._am.setEventCallback(this.updateCb.bind(this));
      this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
      cc.eventManager.addListener(this._updateListener, 1);
      if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
        var url = this.manifestUrl.nativeUrl;
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

  show: function () { },

  // use this for initialization
  onLoad() {
    HotUpdate.instance = this;
    this.versionA = null;
    this.versionB = null;
    let _this = this;
    if (!cc.sys.isNative) {
      return;
    }
    this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
    console.log('thu muc luu la===' + this._storagePath);
    this.versionCompareHandle = function (versionA, versionB) {
      console.log(
        "JS Custom Version Compare: version A is " +
        versionA +
        ", version B is " +
        versionB
      );
      var vA = versionA.split(".");
      var vB = versionB.split(".");
      _this.versionA = versionA;
      _this.versionB = versionB;
      require("GameManager").getInstance().versionA = versionA;
      require("GameManager").getInstance().versionB = versionB;
        cc.sys.localStorage.setItem("verHotUpdate" , versionA);
      for (var i = 0; i < vA.length; ++i) {
        var a = parseInt(vA[i]);
        var b = parseInt(vB[i] || 0);
        if (a === b) {
          continue;
        } else {
          return a - b;
        }
      }
      if (vB.length > vA.length) {
        return -1;
      } else {
        return 0;
      }
    };

    this._am = new jsb.AssetsManager(
      "",
      this._storagePath,
      this.versionCompareHandle
    );


    this._am.setVerifyCallback(function (path, asset) {

      var compressed = asset.compressed;

      var expectedMD5 = asset.md5;

      var relativePath = asset.path;

      var size = asset.size;
      if (compressed) {
        console.log("Verification passed : " + relativePath);
        return true;
      } else {
        console.log(
          "Verification passed : " + relativePath + " (" + expectedMD5 + ")"
        );
        return true;
      }
    });



    if (cc.sys.os === cc.sys.OS_ANDROID) {
      this._am.setMaxConcurrentTask(2);
    }
    console.log('bat dau check update');
    this.checkUpdate();
  },
  onDestroy: function () {
    if (this._updateListener != null) {
      cc.eventManager.removeListener(this._updateListener);
      this._updateListener = null;
    }

    if (this._checkListener != null) {
      cc.eventManager.removeListener(this._checkListener);
      this._checkListener = null;
    }
    if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
      this._am.release();
    }
    HotUpdate.instance = null;
  }
});
module.exports = HotUpdate;
