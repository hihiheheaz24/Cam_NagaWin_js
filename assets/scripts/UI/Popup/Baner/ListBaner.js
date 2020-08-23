// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const UIManager = require("UIManager");
var ListBaner= cc.Class({
    extends: require("PopupEffect"),

    properties: {
        pageView:cc.PageView,
        banerItem:{
            default:null,
            type:cc.Prefab
        },
        bkg_black:cc.Node,
        btn_next:cc.Node,
        btn_pre:cc.Node,
        listArrIdViewed:[],
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.node.setContentSize(cc.winSize);
        this.bkg_black.setContentSize(cc.winSize);
        this.bkg.setContentSize(cc.winSize);
        // this.node.scale = 0.8;
        // this.node.opacity = 200;
        // let acScaleOut = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
        // let acFadeOut = cc.fadeTo(0.1, 255);
        // this.node.stopAllActions();
        // this.node.runAction(cc.spawn(acScaleOut, acFadeOut));
        this.onPopOn(180);
     },

    addBanerToList(data){
        let itemBaner = cc.instantiate(this.banerItem).getComponent("BanerItem");
        this.pageView.addPage(itemBaner.node);
        cc.log("Banner item size-"+itemBaner.node.getContentSize());
        data.isClose = false;
        itemBaner.Baner = this;
        itemBaner.init(data);
        this.emitLogEvent(0);
    },
    init(arrBaner){
        for(let i = 0 ; i< arrBaner.length ; i++){
            this.addBanerToList(arrBaner[i]);
        }
        if(arrBaner.length<2){
            this.btn_next.active=false;
            this.btn_pre.active=false;
        }else{
            this.btn_next.active=true;
            this.btn_pre.active=true;
        }
    },
    onClickBtnLeft(){
        let curIndexPage = this.pageView.getCurrentPageIndex();
        let maxIndex =  this.pageView.getPages().length - 1;
        if(curIndexPage == 0){
            this.pageView.scrollToPage(maxIndex);
        }else{
            this.pageView.scrollToPage(curIndexPage - 1);
        }
        
    },
    onClickBtnRight(){
        let curIndexPage = this.pageView.getCurrentPageIndex();
        let maxIndex =  this.pageView.getPages().length - 1;
        if(curIndexPage == maxIndex){
            this.pageView.scrollToPage(0);
        }else{
            this.pageView.scrollToPage(curIndexPage + 1);
        }
        
    },
    onClose(){
        // let acScaleOut = cc.scaleTo(0.1, 0.8).easing(cc.easeBackIn());
        // let acFadeOut = cc.fadeTo(0.1, 120).easing(cc.easeCircleActionIn());
        // this.node.stopAllActions();
        // this.node.runAction(cc.sequence(cc.spawn(acScaleOut, acFadeOut),cc.callFunc(()=>{
        //     this.node.destroy();
        // })))
        this.onPopOff(true);
    },
    eventPageTurning(){
        cc.log("gia tri index hien tai la======= " + this.pageView.getCurrentPageIndex());
        this.emitLogEvent(this.pageView.getCurrentPageIndex());
    },
    emitLogEvent(index){
        let cp =  this.pageView.getPages()[index].getComponent("BanerItem");
        if(cp == null) return;
        let id = cp.dataBanner.id;
        if(!UIManager.instance.listIdBannerViewed.includes(id)){
            UIManager.instance.logEventSuggestBanner(3,cp.dataBanner);
            UIManager.instance.listIdBannerViewed.push(id);
        }
        
    }

    // update (dt) {},
});
module.exports = ListBaner;
