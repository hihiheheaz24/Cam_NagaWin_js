

cc.Class({
    extends: cc.Component,

    properties: {
        webView: cc.WebView,
    },
    onLoad() {
        this.node.setContentSize(cc.winSize);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GUIDE_INGAME);
    },
    start() {
        var urlRule = require('ConfigManager').getInstance().url_rule.replace("%gameid%", require('GameManager').getInstance().curGameId);
        //var urlRule = 'http://192.168.1.7:8000'
        // var urlRule = 'http://192.168.1.228:2000?gameid=' + require('GameManager').getInstance().curGameId +  '&show=false';
        this.webView.url = urlRule;
    },
    onClickClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.node.destroy();
        require("GameManager").getInstance().curGameViewId = parseInt(require("GameManager").getInstance().curGameId);
        require("GameManager").getInstance().setCurView(require("GameManager").getInstance().curGameViewId);
    }

    // update (dt) {},
});