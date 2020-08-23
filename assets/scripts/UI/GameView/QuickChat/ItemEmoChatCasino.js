// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        aniEmo: {
            default: null,
            type: require('ItemAnimation')
        },
        id:null,
    },

    init(skeData,id) {
        this.id = id;
        this.aniEmo.initAnimation(skeData);
        this.showPreView()
    },
    showPreView() {
        this.aniEmo.playAnimation('animation',true,true,true);
    },
    onClickEmo() {
        require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, "", "*e" + this.id);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChatEmo_%s", require('GameManager').getInstance().getCurrentSceneName()));
        Global.QuickChatCasino.quickChatEmo.onOut();
    },
});
