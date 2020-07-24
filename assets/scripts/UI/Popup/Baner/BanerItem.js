// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const UIManager = require("UIManager");
let Baner = require("Baner");
let ListBaner = require("ListBaner");
var sizeDefault = {
  width: 937,
  height: 652
}
cc.Class({
  extends: cc.Component,

  properties: {
    btnClose: cc.Button,
    bkg_black: cc.SpriteFrame,
    dataBanner: null
  },

  // LIFE-CYCLE CALLBACKS:


  init(data) {
    cc.log("Init banner");
    this.dataBanner = data;

    this.btnClose.node.active = data.isClose;
    var listBtn = [];
    var spriteBaner = this.getComponent(cc.Sprite);

    let urlCor = "https://cors-anywhere.herokuapp.com/";
    if (cc.sys.isNative) {
      urlCor = "";
    }
    for (let i = 0; i < this.dataBanner.arrButton.length; i++) {

      let isTypeUpdate = false;
      let dataBtn = this.dataBanner.arrButton[i];
      let btnView = UIManager.instance.createSprite(this.bkg_black);
      spriteBaner.node.addChild(btnView.node);
      btnView.node.addComponent(cc.Button);
      cc.loader.load(urlCor + dataBtn.urlBtn, (err, tex) => {
        if (err != null || this.node == null) return;
        btnView.spriteFrame = new cc.SpriteFrame(tex);
        btnView.type = cc.Sprite.Type.SIMPLE;
        btnView.sizeMode = cc.Sprite.SizeMode.TRIMMED;
      });
      listBtn.push(btnView.node);

      btnView.node.on(cc.Node.EventType.TOUCH_END, (evetn, data) => {
        cc.NGWlog("--------> Type Click Button 0:  ", dataBtn);
        cc.NGWlog("--------> Type Click Button 1:  ", this.dataBanner);

        if (this.Baner instanceof ListBaner) {
          if (!UIManager.instance.arrayIDBannerClickedInType7.includes(this.dataBanner.id)) {
            UIManager.instance.logEventSuggestBanner(2, this.dataBanner);
            UIManager.instance.arrayIDBannerClickedInType7.push(this.dataBanner.id);
          }
        } else {
          UIManager.instance.logEventSuggestBanner(2, this.dataBanner);
        }



        switch (dataBtn.type) {
          case 'openlink': {
            //cc.log("Chi chau open link====="+this.dataBanner.urlLink);
            cc.sys.openURL(dataBtn.urlLink);
            break;
          }
          case 'showwebview': {
            cc.NGWlog("sio: SHOWWEBVIEW urllink: " + dataBtn.urlLink);
            UIManager.instance.OpenWebviewNapTien(dataBtn.urlLink);
            break;
          }
          case 'ok': {//chi de thong bao
            // cc.sys.openURL(this.dataBanner.urlLink);
            this.Baner.onClose();
            break;
          }
          case 'pm': {//open shop
            require("GameManager").getInstance().typeShop = dataBtn.titlePM
            UIManager.instance.onShowShop();
            break;
          }
          case 'playnow': {//open shop
            cc.log("Game ID Banner=" + dataBtn.gameID);

            if (dataBtn.gameID == GAME_ID.TIENLEN) {
              require("GameManager").getInstance().isPlayNowBanner = true;
              Global.NodeGameListView.onClickChooseGame(true);
            }
            else if (dataBtn.gameID != 0) {
              require("GameManager").getInstance().isPlayNowBanner = true;
              Global.NodeGameListView.onClickGameFromBanner(dataBtn.gameID)
            }


            this.Baner.onClose();
            cc.log("cha baner no la=== " + (this.Baner instanceof Baner));
            cc.log("cha baner no la=== " + (this.Baner instanceof ListBaner));
            if (this.Baner instanceof Baner) {
              UIManager.instance.indexCurrentDataBannerIO = 99999;
            }
            break;
          }
          case 'force': {//buoc ra khoi cuoc doi bo
            cc.game.end();
            break;
          }
          case "update":
            cc.sys.openURL(dataBtn.urlLink);
            isTypeUpdate = true;
            break;
          case 'cashout': // open CO
            if (require("ConfigManager").getInstance().is_dt) {
              UIManager.instance.onShowCashOut();
            }
            break;
          case "topgame":
            UIManager.instance.onShowTopGame(dataBtn.gameID);
            break;
        }
        if (!isTypeUpdate && this.dataBanner.isClose) {
          cc.log("chay vao ham close banenr==");
          this.Baner.onClose(true);
          UIManager.instance.indexCurrentDataBannerIO = 99999;
        }
        if (this.Baner instanceof ListBaner) {
          this.Baner.onClose();
        }
      });
    }


    cc.loader.load(urlCor + this.dataBanner.urlImg, (err, tex) => {
      if (err != null) {
        console.log("loi la-- " + JSON.stringify(err));

        this.loadErr();
        return;
      }
      let sp = new cc.SpriteFrame(tex)
      if (sp == null) {
        this.loadErr();
        return;
      }

      spriteBaner.type = cc.Sprite.Type.SIMPLE;
      spriteBaner.sizeMode = cc.Sprite.SizeMode.TRIMMED;
      spriteBaner.spriteFrame = sp;

      let scale = 1.0;
      if (spriteBaner.node.width > sizeDefault.width) {
        scale = (sizeDefault.width / spriteBaner.node.width) - 0.1;
      }

      if (spriteBaner.node.height > sizeDefault.height) {
        scale = (sizeDefault.height / spriteBaner.node.height) - 0.1;
      }

      if (scale > 1.0) {
        scale = 1;
      }
      spriteBaner.node.scale = scale

      for (let j = 0; j < listBtn.length && j < this.dataBanner.arrButton.length; j++) {
        if (this.dataBanner.arrButton[j].pos.length >= 2)
          listBtn[j].position = cc.v2(spriteBaner.node.width * (this.dataBanner.arrButton[j].pos[0] - 0.5), spriteBaner.node.height * (this.dataBanner.arrButton[j].pos[1] - 0.5));
      }
    });
  },
  onClickClose() {
    cc.log("Banner Onclose")
    this.Baner.onClose();
  },
  onDisable(){
    cc.log("Banner Ondisable");
  },
  onDestroy(){
    cc.log("Banner Ondestroy");
  },
  loadErr() {
    if (this.Baner instanceof ListBaner) {
      this.node.destroy();
    } else {
      this.Baner.onClose();
    }
  }

  // update (dt) {},
});
