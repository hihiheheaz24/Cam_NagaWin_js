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
var Baner =  cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    banerItem: cc.Prefab,

  },

  // LIFE-CYCLE CALLBACKS:
  onLoad(){
    this.node.setContentSize(cc.winSize);
  },

  init(data) {
    if (!data.isShowGameView || data.isShowGameView == null) {
      if (require("GameManager").getInstance().gameView != null) {
        UIManager.instance.removeBanerShowGame(this);
        UIManager.instance.indexCurrentDataBannerIO++;
        UIManager.instance.showBannerIO();
        this.node.destroy();
        return;
      }
    }
    let itemBaner = cc.instantiate(this.banerItem).getComponent("BanerItem");
    this.node.addChild(itemBaner.node);
    itemBaner.Baner = this;
    itemBaner.init(data);
    this.data = data;
    this.node.scale = 0.8;
    this.node.opacity = 200;
    let acScaleOut = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
    let acFadeOut = cc.fadeTo(0.1, 255);
    this.node.stopAllActions();
    this.node.runAction(cc.spawn(acScaleOut, acFadeOut));

  },
  onClose(isClick = false) {
    let acScaleOut = cc.scaleTo(0.1, 0.8).easing(cc.easeBackIn());
    let acFadeOut = cc.fadeTo(0.1, 120).easing(cc.easeCircleActionIn());
    this.node.stopAllActions();
    this.node.runAction(cc.sequence(cc.spawn(acScaleOut, acFadeOut), cc.callFunc(() => {
      if(!isClick)UIManager.instance.logEventSuggestBanner(1, this.data);
      UIManager.instance.nextBanner();
    }),
      cc.callFunc(() => {
        this.node.destroy();
      })));
  },

  // update (dt) {},
});
module.exports = Baner;
