const GameManager = require("GameManager");
cc.Class({
  extends: cc.Component,

  properties: {
    freechipIcon: {
      default: null,
      type: cc.Sprite
    },

    lbMessage: {
      default: null,
      type: cc.Label
    },

    lbChip: {
      default: null,
      type: cc.Label
    },

    btnReceive: {
      default: null,
      type: cc.Button
    },

    lb_time: {
      default: null,
      type: cc.Label
    },
    // listSp:[cc.Sprite];
    type: 0,
    type_receive: 0,
    index_arr: 0,
    chip: 0
  },

  onLoad() {
    this.countDownTime1();
  },

  onDestroy() {
    // super.onDestroy();
    this.node.stopAllActions();
    this.node.destroy();
  },

  init: function (type, message, numChip, receiveType, index) {
    this.type = type;
    this.type_receive = receiveType;
    this.index_arr = index;
    this.chip = numChip;

    //cc.NGWlog(type, message, numChip, receiveType, index);

    var path = "popup/freechip/" + type;
    require("GameManager")
      .getInstance()
      .loadTexture(this.freechipIcon, path);
    // this.freechipIcon.spriteFrame= this.iconPlist.getSpriteFrame(type);
    this.lbMessage.string = message;
    this.lbChip.string = GameManager.getInstance().formatNumber(numChip);

    if (receiveType === 69 && type === 3) {
      this.btnReceive.node.active = false;
      this.lb_time.node.active = true;

      this.node.runAction(
        cc.repeatForever(
          cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
              this.countDownTime1();
            })
          )
        )
      );
    } else {
      this.btnReceive.node.active = true;
      this.lb_time.node.active = false;
    }
    if (this.lbMessage.node.on('size-changed', () => {
      cc.NGWlog('change size');
      this.lbMessage.fontSize = 25;
    }));
  },

  countDownTime1() {
    if (require("GameManager").getInstance().promotionInfo.time <= 0) {
      this.node.stopAllActions();
      return;
    }

    var ho =
      Math.floor(
        (require("GameManager").getInstance().promotionInfo.time / 3600) % 24
      ) + "";
    var mi =
      Math.floor(
        (require("GameManager").getInstance().promotionInfo.time / 60) % 60
      ) + "";
    var se =
      Math.floor(require("GameManager").getInstance().promotionInfo.time % 60) +
      "";

    if (ho.length < 2) ho = "0" + ho;
    if (mi.length < 2) mi = "0" + mi;
    if (se.length < 2) se = "0" + se;

    var _time = ho + ":" + mi + ":" + se;
    this.lb_time.string = _time;
  },

  onClickReceive() {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickReceive_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    this.node.destroy();

    if (this.type < 6) {
      require("NetworkManager")
        .getInstance()
        .sendPromotinGold(this.type_receive, this.chip);
      if (Global.FreeChipView.node.getParent() !== null) {
        Global.FreeChipView.dataFreeChip.splice(this.index_arr, 1);
      }
    } else if (this.type === 7 || this.type === 8) {
      var data = [this.type_receive];
      require("NetworkManager").getInstance().getArrGold(data);
      GameManager.getInstance().user.nmAg--;
      cc.log("nmAg=="+GameManager.getInstance().user.nmAg)  
      if (Global.FreeChipView.node.getParent() !== null) {
        Global.FreeChipView.dataFreeChipAdmin.splice(
          this.index_arr,
          1
        );
      }
    }
    let msg = GameManager.getInstance().getTextConfig('nhan_ag_tu_ngan_hang');
    GameManager.getInstance().onShowConfirmDialog(msg.replace('%s', this.chip));
    require("NetworkManager").getInstance().sendUAG();
  }
});
