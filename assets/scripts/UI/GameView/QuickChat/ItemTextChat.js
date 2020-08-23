cc.Class({
    extends: cc.Component,

    properties: {
        lbChat: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    initItem(string) {
        this.lbChat.string = string;
    },
    
});
