
const GameManager = require("GameManager");
cc.Class({
  extends: require('PopupEffect'),

  properties: {


    avatar: {
      default: null,
      type: cc.Sprite
    },

    lb_id: {
      default: null,
      type: cc.Label
    },

    lb_name: {
      default: null,
      type: cc.Label
    },

    lb_chip: {
      default: null,
      type: cc.Label
    },

    lb_safe: {
      default: null,
      type: cc.Label
    },

    list_ava: {
      default: null,
      type: cc.ScrollView
    },

    btn_change_name: {
      default: null,
      type: cc.Button
    },
    btn_sendGift: cc.Button,
    btn_help_vip: {
      default: null,
      type: cc.Button
    },

    ava_item: {
      default: null,
      type: cc.Prefab
    },
    change_Satus: {
      default: null,
      type: cc.Prefab
    },
    changename_popup: {
      default: null,
      type: cc.Prefab
    },
    lbChangePass: cc.Label,
    listIconVip: {
      default: [],
      type: [cc.Sprite]
    },

    listSpriteFrameVip: {
      default: [],
      type: [cc.SpriteFrame]
    },
    listAvtBoder: cc.SpriteAtlas,
    avtBorder: cc.Sprite,
  },

  onLoad: function () {
    // Initialize the keyboard input listening
    this.avtPool = require('UIManager').instance.avtPool;
    this.btn_sendGift.node.active = require("ConfigManager").getInstance().ketT;
    this.lbChangePass.node.on("size-changed", () => {
      if (this.lbChangePass.node.width > 230)
        this.btn_change_name.node.setContentSize(cc.size(this.lbChangePass.node.width + 20, this.btn_change_name.node.height));
    })
  },

  onMoveOut() {
    this.onPopOn();
  },
  setInfo() {
    this.updateName();

    this.lb_id.string = "ID: " + GameManager.getInstance().user.id;

    this.updateChip();
    this.setAvatar();
    this.updateVip();

    this.list_ava.content.removeAllChildren();
    let avtCount = require("ConfigManager").getInstance().avatar_count;
    for (var i = 0; i < avtCount; i++) {
      let itemAvt = cc.instantiate(Global.Avatar.node);
      //put avatafb
      cc.NGWlog('put avatafb');
      let vip = require("GameManager").getInstance().user.vip;
      if (require("GameManager").getInstance().typeLogin == LOGIN_TYPE.FACEBOOK && i === avtCount - 1) {
        cc.NGWlog('vao get avafb');

        itemAvt.getComponent("AvatarItem").loadTexture(999, require("GameManager").getInstance().user.tinyURL, null, vip);
      } else {
        itemAvt.getComponent('AvatarItem').loadTexture(i + 1, null, null, vip);
      }

      let item;
      item = this.list_ava.content.children[i];
      if (!item) {
        item = itemAvt;
        //item.getComponent("AvatarItem").loadTexture(i + 1); 
        this.list_ava.content.addChild(item);
      }

      // let item;
      // item = this.list_ava.content.children[i];
      // if (!item) {
      //   if (this.avtPool.size() < 1) this.avtPool.put(cc.instantiate(this.ava_item));
      //   item = this.avtPool.get();
      //   //item.getComponent("AvatarItem").loadTexture(i + 1); 
      //   this.list_ava.content.addChild(item);
      // }
    }
    this.btn_change_name.node.active = true;
    if (require('GameManager').getInstance().typeLogin === LOGIN_TYPE.NORMAL) {
      this.lbChangePass.string = require('GameManager').getInstance().getTextConfig('txt_change_pass');
    }
    else if (require('GameManager').getInstance().typeLogin === LOGIN_TYPE.PLAYNOW) {
      if (cc.sys.localStorage.getItem("isReg") === 'true') {
        this.lbChangePass.string = require('GameManager').getInstance().getTextConfig('register');
      } else {
        this.lbChangePass.string = require('GameManager').getInstance().getTextConfig('txt_change_pass');
      }
    } else if (require('GameManager').getInstance().typeLogin === LOGIN_TYPE.FACEBOOK) {
      this.lbChangePass.string = require('GameManager').getInstance().getTextConfig('change_name');
      if (GameManager.getInstance().user.uname.indexOf("fb.") == -1) {
        this.btn_change_name.node.active = false;
      }
      // this.lbChangePass.string = 'Change Name';

    }
    this.btn_sendGift.node.active = require("ConfigManager").getInstance().ketT;
  },

  updateVip() {
    let vip = GameManager.getInstance().user.vip;
    // let sprBorder;
    // if (vip > 5) sprBorder = this.listAvtBoder.getSpriteFrame("v5");
    // else {
    //   sprBorder = this.listAvtBoder.getSpriteFrame("v" + (vip + 1));
    // }
    // this.avtBorder.spriteFrame = sprBorder;
    if (vip >= 10) {
      vip = 10;
    }
    let vip1 = Math.floor(vip / 2);
    let vip2 = vip % 2;

    for (let i = 0; i < this.listIconVip.length; i++) {
      if (i + 1 <= vip1) {
        this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[2];
      } else if (vip2 != 0) {
        vip2 = 0;
        this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[1];
      } else {
        this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[0];
      }
    }
  },

  updateName() {
    // let lbName = GameManager.getInstance().user.uname;
    let lbName = GameManager.getInstance().user.displayName;
    if (lbName.length > 12) {
      lbName = lbName.substring(0, 12) + '...';
    }
    this.lb_name.string = lbName;
  },

  setAvatar() {
    let myId = GameManager.getInstance().user.avtId;
    // let myName = GameManager.getInstance().user.uname;
    let myName = GameManager.getInstance().user.tinyURL;
    let vip = GameManager.getInstance().user.vip;
    this.avatar.node.getComponent("AvatarItem").loadTexture(myId, myName, null, vip);
  },

  updateChip() {
    this.lb_chip.string = GameManager.getInstance().formatNumber(
      GameManager.getInstance().user.ag
    );

  },

  onClickChangeName: function () {
    if (require('GameManager').getInstance().typeLogin === LOGIN_TYPE.NORMAL) {
      require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChangePass_%s", require('GameManager').getInstance().getCurrentSceneName()));
    }
    else if (require('GameManager').getInstance().typeLogin === LOGIN_TYPE.PLAYNOW) {
      if (cc.sys.localStorage.getItem("isReg") === 'true') {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickRegister_%s", require('GameManager').getInstance().getCurrentSceneName()));
      } else {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChangePass_%s", require('GameManager').getInstance().getCurrentSceneName()));
      }
    } else if (require('GameManager').getInstance().typeLogin === LOGIN_TYPE.FACEBOOK) {
      require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickRename_%s", require('GameManager').getInstance().getCurrentSceneName()));
    }
    require('SoundManager1').instance.playButton();
    require("UIManager").instance.onshowRegister();
    // require('UIManager').instance.instantiate_parent.addChild(Global.RegisterPopup.node);
    // Global.RegisterPopup.setInfo();
  },

  onClickSendGift: function () {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowGift_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('UIManager').instance.onShowGift();
  },

  onClickChangeStatus: function () {
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChangeStatus_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require('SoundManager1').instance.playButton();
    Global.StatusPopup.edb_status.string = "";
    require('UIManager').instance.instantiate_parent.addChild(Global.StatusPopup.node);
  },
  updatelb_Status() {
    require('SoundManager1').instance.playButton();
    this.lb_Status.string = GameManager.getInstance().user.status;
  },
  scollEvent() {
    this.list_ava.content.getComponent(cc.Widget).enable = false;
  },
  onOut() {
    let _this = this;
    require('SoundManager1').instance.playButton();
    this.onPopOff();
    require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
    require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
  },
  scollEvent() {
    let offSet = this.list_ava.getScrollOffset();
    for (let i = 0; i < this.list_ava.content.children.length; i++) {
      let avt = this.list_ava.content.children[i];
      if (avt.position.x - 20 > this.list_ava.node.getChildByName('view').width - offSet.x || avt.position.x < -offSet.x) {
        avt.getComponent("AvatarItem").isClick = false;
      } else {
        avt.getComponent("AvatarItem").isClick = true;
      }
    }
  },
});
