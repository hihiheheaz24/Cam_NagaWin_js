var ProcessLoad = cc.Class({
    extends: cc.Component,

    properties: {
        ic_load: {
            default: null,
            type: cc.Node
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.setContentSize(cc.winSize);
        this.ic_load.runAction(cc.repeatForever(cc.rotateBy(1.0, 360)));
    },
    onShow(string){
        this.unscheduleAllCallbacks();
        this.callBack = function(){this.node.active = false};
        this.scheduleOnce(  this.callBack,20);
    },
    onDisable(){
        this.unscheduleAllCallbacks();
    },



    // update (dt) {},


});

module.exports = ProcessLoad;