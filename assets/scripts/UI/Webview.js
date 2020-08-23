

cc.Class({
    extends: cc.Component,

    properties: {
      webView:cc.WebView,
      bkg_bar:cc.Node,
      btn_Close2:cc.Node,
    },
    onLoad(){
        if(cc.sys.os==cc.sys.OS_IOS){
            this.bkg_bar.active=false;
            this.webView.getComponent(cc.Widget).enabled=false;
            let sizeNode=cc.size(cc.winSize.width/1.26,cc.winSize.height/1.28);
            this.webView.node.setContentSize(sizeNode);
            let posNode=cc.v2(cc.winSize.width/9.92,-cc.winSize.height/10.90)
            this.webView.node.position=posNode;
           
            this.btn_Close2.active=true;
        }
    },
    start () {

    },
    onClose(){
        require("NetworkManager").getInstance().sendUAG();
        this.node.destroy();
    },
    setUrl(url){
        this.webView.url=url;
    }

    // update (dt) {},
});
