const FreeChipData = require("FreeChipData");

cc.Class({
  extends: require('PopupEffect'),

  properties: {
    lb_tit: {
      default: null,
      type: cc.Label
    },
    dataFreeChip: {
      default: [],
      type: [require("FreeChipData")]
    },

    dataFreeChipAdmin: {
      default: [],
      type: [require("FreeChipData")]
    },

    item_free: {
      default: null,
      type: cc.Prefab
    },

    list_view: {
      default: null,
      type: cc.ScrollView
    },
    countMailAg:0
  },
  setInfo() {
    this.lb_tit.string = require("GameManager").getInstance().getTextConfig("txt_free_chip");
    require("NetworkManager").getInstance().getMail(12);
    this.dataFreeChip.length = 0;
  },
  onClose() {
    this.onPopOff();
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
  },
  onMoveOut() {
    this.onPopOn();
  },
  loadFreeChip() {
    this.dataFreeChip.length = 0;
    this.countMailAg = 0;

    if (require("GameManager").getInstance().promotionInfo.adminMoney > 0) {
      var free = new FreeChipData();
      free.type = 0;
      free.message = require("GameManager").getInstance().getTextConfig("txt_chip_receive") + require("GameManager").getInstance().formatNumber(require("GameManager").getInstance().promotionInfo.adminMoney);
      free.chips = require("GameManager").getInstance().promotionInfo.adminMoney;
      free.receiveType = 1;
      this.dataFreeChip.push(free);
      this.countMailAg++;
    }

    if (require("GameManager").getInstance().promotionInfo.online > 0) {
      var free = new FreeChipData();
      free.type = 3;
      free.message =
        require("GameManager")
          .getInstance()
          .getTextConfig("txt_chip_login_receive") +
        require("GameManager")
          .getInstance()
          .formatNumber(
            require("GameManager").getInstance().promotionInfo.online
          );
      free.chips = require("GameManager").getInstance().promotionInfo.online;
      free.receiveType = 3;

      this.dataFreeChip.push(free);
      this.countMailAg++;
    } else if (
      require("GameManager").getInstance().promotionInfo.online === 0 &&
      require("GameManager").getInstance().promotionInfo.time > 0
    ) {
      if (require("GameManager").getInstance().promotionInfo.onlineCurrent < require("GameManager").getInstance().promotionInfo.numberP) {
        var free = new FreeChipData();
        free.type = 3;
        free.message =
          require("GameManager")
            .getInstance()
            .getTextConfig("txt_chip_not_enough_money") +
          require("GameManager")
            .getInstance()
            .formatNumber(
              require("GameManager").getInstance().promotionInfo.agOnline
            );
        free.chips = require("GameManager").getInstance().promotionInfo.agOnline;
        free.receiveType = 69;

        this.dataFreeChip.push(free);
      }
    }

    if (require("GameManager").getInstance().promotionInfo.upVip > 0) {
      var free = new FreeChipData();
      free.type = 2;
      free.message =
        require("GameManager")
          .getInstance()
          .getTextConfig("txt_chip_up_vip") +
        require("GameManager")
          .getInstance()
          .formatNumber(
            require("GameManager").getInstance().promotionInfo.upVip
          );
      free.chips = require("GameManager").getInstance().promotionInfo.upVip;
      free.receiveType = 2;
      this.dataFreeChip.push(free);
      this.countMailAg++;
    }
    if (require("GameManager").getInstance().promotionInfo.notEnoughMoney > 0) {
      var free = new FreeChipData();
      free.type = 1;
      free.message =
        require("GameManager")
          .getInstance()
          .getTextConfig("txt_chip_not_enough_money") +
        require("GameManager")
          .getInstance()
          .formatNumber(
            require("GameManager").getInstance().promotionInfo.notEnoughMoney
          );
      free.chips = require("GameManager").getInstance().promotionInfo.notEnoughMoney;
      free.receiveType = 0;

      this.dataFreeChip.push(free);
      this.countMailAg++;
    }

    if (require("GameManager").getInstance().promotionInfo.video > 0) {
      var free = new FreeChipData();
      free.type = 4;
      free.message =
        require("GameManager")
          .getInstance()
          .getTextConfig("txt_chip_view_video") +
        require("GameManager")
          .getInstance()
          .formatNumber(
            require("GameManager").getInstance().promotionInfo.video
          );
      free.chips = require("GameManager").getInstance().promotionInfo.video;
      free.receiveType = 5;

      this.dataFreeChip.push(free);
      this.countMailAg++;
    }

    if (require("GameManager").getInstance().promotionInfo.giftCode > 0) {
      var free = new FreeChipData();
      free.type = 5;
      free.message =
        require("GameManager")
          .getInstance()
          .getTextConfig("txt_chip_gift_code") +
        require("GameManager")
          .getInstance()
          .formatNumber(
            require("GameManager").getInstance().promotionInfo.giftCode
          );
      free.chips = require("GameManager").getInstance().promotionInfo.giftCode;
      free.receiveType = 6;

      this.dataFreeChip.push(free);
      this.countMailAg++;
    }
    this.reloadList();
  },

  pushMailAdmin(type, mess, chip, rec_type) {
    var free = new FreeChipData();
    free.type = type;
    free.message = mess;
    free.chips = chip;
    free.receiveType = rec_type;
    this.dataFreeChipAdmin.push(free);
  },

  reloadList() {
    this.freeChipPool = require('UIManager').instance.freeChipPool;
    //this.list_view.content.removeAllChildren(true);
    let ctLen = this.list_view.content.children.length;
    for (let i = 0; i < ctLen; i++) {
      this.list_view.content.children[i].active = false;
    }
    let dataSize = this.dataFreeChip.length;

    let index = 0;

    for (var i = 0; i < dataSize; i++) {
      let item;
      let ScrCtItem = this.list_view.content.children[i];
      if (ScrCtItem) item = ScrCtItem.getComponent("FreeChipItem");
      else {
        if (this.freeChipPool.size() < 1) this.freeChipPool.put(cc.instantiate(this.item_free));
        item = this.freeChipPool.get().getComponent("FreeChipItem");
        this.list_view.content.addChild(item.node);
      }
      item.node.active = true;
      item.init(
        this.dataFreeChip[i].type,
        this.dataFreeChip[i].message,
        this.dataFreeChip[i].chips,
        this.dataFreeChip[i].receiveType,
        i
      );

      index++;
    }

    dataSize = this.dataFreeChipAdmin.length;
    for (var i = 0; i < dataSize; i++) {
      let item;
      let ScrCtItem = this.list_view.content.children[i + index];
      if (ScrCtItem) item = ScrCtItem.getComponent("FreeChipItem");
      else {
        if (this.freeChipPool.size() < 1) this.freeChipPool.put(cc.instantiate(this.item_free));
        item = this.freeChipPool.get().getComponent("FreeChipItem");
        this.list_view.content.addChild(item.node);
      }
      item.node.active = true;
      item.init(
        this.dataFreeChipAdmin[i].type,
        this.dataFreeChipAdmin[i].message,
        this.dataFreeChipAdmin[i].chips,
        this.dataFreeChipAdmin[i].receiveType
      );

    }
  }
});
