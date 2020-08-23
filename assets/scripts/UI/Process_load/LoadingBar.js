
var LoadingBar = cc.Class({
  extends: cc.Component,

  properties: {
    timeDelay: 0,
    timeMax: 300,

    bgnen: {
      default: null,
      type: cc.Sprite
    },

    listFrameBg: {
      default: [],
      type: [cc.SpriteFrame]
    },
    lb_loading: {
      default: null,
      type: cc.Label
    },
    lb_loading2: {
      default: null,
      type: cc.Label
    },
    loading_on: {
      default: null,
      type: cc.Sprite
    },
    lb_per: {
      default: null,
      type: cc.Label
    },
    is_load_update: false,

    is_Loading: false,
  },

  onLoad() {
    this.stt_text = this.generateRandomNumber(0, 10);
    this.stt_bg = this.generateRandomNumber(0, 4);
    this.node.setContentSize(cc.winSize);
    this.lb_loading2.string = require('GameManager').getInstance().getTextConfig("txt_loading_default");
  },

  start() {
    cc.NGWlog('chay vao loadingBar');
    this.changeinfo();
    this.schedule(() => {
      this.changeinfo();
      this.stt_text++;
      this.stt_bg++;
      if (this.stt_text > 9) this.stt_text = 0;
      if (this.stt_bg > 4) this.stt_bg = 0;
    }, 5);
  },
  onEnable() {
    this.loading_on.fillRange = 0;
    this.stt_text = this.generateRandomNumber(0, 10);
    this.stt_bg = this.generateRandomNumber(0, 4);
    this.lb_per.string = "Loading: " + 0 + "%"
  },

  changeinfo() {
    cc.NGWlog("stt_bg" + this.stt_bg);
    if (this.is_load_update) this.stt_bg = 5;
    this.bgnen.spriteFrame = this.listFrameBg[this.stt_bg];
    let textConfig = require('GameManager').getInstance().getTextConfig("loading_text");
    let textEdit = textConfig.replace('%d', this.stt_text);
    if (this.is_load_update) textEdit = textConfig.replace('%d', 11);
    let textAdd = require('GameManager').getInstance().getTextConfig(textEdit);
    this.lb_loading.string = textAdd;
  },

  generateRandomNumber(min_value, max_value) {
    let random_number = Math.random() * (max_value - min_value) + min_value;
    return Math.floor(random_number);
  },
  setProgress(num) {
    if (isNaN(num))
      num = 0;
    this.loading_on.fillRange = num;
    this.lb_per.string = "Loading: " + Math.floor(num * 100) + "%";
  },


  update: function (dt) {
    // if (this.is_Loading) {
    //   this.loading_on.fillRange += 0.006;
    //   this.lb_per.string = Math.floor(this.loading_on.fillRange * 100) + "%"
    // }
  },
  onClickMsg() {
    //  cc.sys.openURL(require("GameManager").getInstance().u_chat_fb);
    // cc.sys.openURL('https://xem.vn/');
  }

});
module.exports = LoadingBar;

