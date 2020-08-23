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
        lbChat: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    // update (dt) {},

    initItem(string) {
        this.lbChat.node.on("size-changed",this.changeSize,this);
        this.lbChat.string = string;
    },
    changeSize(){
        let sizeWidth = this.lbChat.node.getContentSize().width;
        this.node.setContentSize(cc.size(sizeWidth + 100 , 60 ));
    },
    onClick(){
        require('NetworkManager').getInstance().sendChat(require('GameManager').getInstance().user.uname, this.lbChat.string);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChatQuick_%s", require('GameManager').getInstance().getCurrentSceneName()));
        Global.QuickChatCasino.quickChatEmo.onOut();
    }

    // update (dt) {},
});
