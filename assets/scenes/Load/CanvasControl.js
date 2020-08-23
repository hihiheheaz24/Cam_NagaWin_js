cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        let tile = cc.winSize.width / cc.winSize.height
        if (tile >= (16/9)){
           cc.Canvas.instance.fitHeight = true;
           cc.Canvas.instance.fitWidth = false;
        } else{
           cc.Canvas.instance.fitHeight = false;
           cc.Canvas.instance.fitWidth = true;
        }
        cc.NGWlog = console.log;
        //if(cc.sys.isBrowser) cc.NGWlog= cc.NGWlog;
    },
});
