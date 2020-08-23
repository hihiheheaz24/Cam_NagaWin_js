// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

//ICBZb3VyIGZyZWUgY2hpcHMgYXJlIHJlYWR5ISBHZXQgdGhlbSBub3chIA==
cc.Class({
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
    },



    onLoad() {

        Global.TimeOpenApp = Date.now();
        if (!cc.sys.isNative && cc.sys.os == cc.sys.OS_OSX) {
            cc.director.loadScene("loadRes");
            return;
        }

        setTimeout(() => {
            cc.loader.downloader.loadSubpackage('Game', function (err) {

                if (err) {
                    return console.error(err);
                }
                cc.NGWlog('load successfully.');
                cc.director.loadScene("loadRes");
               require("Util").hideSplash(); 
            });
        }, 100)
        this.node.getChildByName("bg_screen_loading").setContentSize(cc.winSize);
    },

    start() {
    }
    // update (dt) {},
});
