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
        // card:cc.Prefab,
        // cardNode:cc.Node,
        // lbString:cc.Label,
        // clip1: {
        //     default:null,
        //     type: cc.AudioClip,
        // },
        // clip2: {
        //     default:null,
        //     type: cc.AudioClip,
        // },
        // audioSource:cc.AudioSource,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        // this.node.addChild(cc.instantiate(this.card));
     },

    start () {
        cc.director.loadScene("main");
    },
    onClick(){
       
    },    
   

    // update (dt) {},
});
