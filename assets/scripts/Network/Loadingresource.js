// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        ske:sp.Skeleton,
        lbLoadign:cc.Label,

    },
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    // update (dt) {},

updateAni(){
    this.lbLoadign.node.active = true;
    this.ske.setAnimation(0,"loading",true);
},
setPercent(getPercent){
    if (isNaN(getPercent)) return;
    if(getPercent > 1.0) getPercent = 1; 
    this.lbLoadign.string = Math.floor(getPercent * 100) + "%"
}

});
