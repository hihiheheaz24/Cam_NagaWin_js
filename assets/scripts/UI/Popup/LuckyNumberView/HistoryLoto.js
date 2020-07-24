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
    extends: require('PopupEffect'),

    properties: {
        scr_history : {
            default : null,
            type : cc.ScrollView
        },
        item_his :{
            default : null,
            type : cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },
    setInfo(){
        this.onPopOn();
    },

    start () {

    },
    onCloseHis(){
        this.onPopOff();
    },
    loadListHistory(dataa){
        require('UIManager').instance.onHideLoad();
        let data = JSON.parse(dataa);
        //this.scr_history.content.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            const objData = data[i];
            let item = cc.instantiate(this.item_his).getComponent('ItemHistoryLoto');
        //    this.scr_history.content.addChild(item.node);
            item.init(objData);
            // setTimeout(() => {
            //     this.scr_history.content.addChild(item.node);
            // }, 100);

            this.scheduleOnce(()=>{
                this.scr_history.content.addChild(item.node);
            },0.04 * i)
            
        }
    },

    // update (dt) {},
});
