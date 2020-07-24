
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad (){
        this.node.opacity = 0;
        this.node.runAction(cc.fadeTo(0.4,220));
        this.node.zIndex = 999;
    },
});
