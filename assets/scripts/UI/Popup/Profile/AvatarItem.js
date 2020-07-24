const GameManager = require('GameManager')

cc.Class({
  extends: cc.Component,

  properties: {
    avatar: {
      default: null,
      type: cc.Sprite
    },

    btn_select: {
      default: null,
      type: cc.Button
    },
    isFirstLoad: true,
    curId: 0,
    cors_url: "https://cors-anywhere.herokuapp.com/",
    isClick: true,
    listAvtBorder: cc.SpriteAtlas,
    avtBorder: cc.Sprite,
    vip: 0
  },

  onLoad() {

  },
  start() {

  },
  loadTexture: function (id, namePlayer, fbId, vip = 0) {
    let sprBorder;
    if (vip > 3) sprBorder = this.listAvtBorder.getSpriteFrame("v5");
    else {
      sprBorder = this.listAvtBorder.getSpriteFrame("v" + (vip + 1));
    }
    this.avtBorder.spriteFrame = sprBorder;

    this.avatar.spriteFrame = require("UIManager").instance.avt_default;
    this.curId = id;
    if (id > 0 && id < 999) {
      require("UIManager").instance.loadTextureAvatar(this.avatar, id);
    } else {
      let avtLink = require('ConfigManager').getInstance().avatar_fb;
      let url_avaFb = avtLink || "https://graph.facebook.com/v4.0/%fbID%/picture?width=200&height=200&redirect=true";
      if (namePlayer.indexOf("fb.") !== -1) {
        let idFb = namePlayer.substring(3, namePlayer.length);
        url_avaFb = url_avaFb.replace("%fbID%", idFb);
      } else if (fbId !== null) {
        url_avaFb = url_avaFb.replace("%fbID%", fbId);
      }
      this.loadTextureFromUrl(this.avatar, url_avaFb);

    }
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
  onClickAvatar: function () {
    //check first
    if (this.curId === GameManager.getInstance().user.avtId) return;
    if (!this.isClick) return;
    var _this = this;
    require('SoundManager1').instance.playButton();
    require('NetworkManager').getInstance().sendChangeAvatar(_this.curId);
    GameManager.getInstance().user.avtId = _this.curId;
  }
});