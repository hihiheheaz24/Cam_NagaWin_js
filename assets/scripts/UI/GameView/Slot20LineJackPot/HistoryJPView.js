

cc.Class({
    extends: cc.Component,

    properties: {
        listContent: cc.ScrollView,
        itemHistory: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataHisJP = [];
    },

    start() {

    },
    initItem() {
        this.dataHisJP = require("GameManager").getInstance().list_data_jackpot_history;
        let acInit = cc.callFunc(() => {
            for (let i = 0; i < this.dataHisJP.length; i++) {
                let item = cc.instantiate(this.itemHistory);
                this.listContent.content.addChild(item);
                item.getComponent("ItemHisJP").init(this.dataHisJP[i]);
            }
            this.node.getComponent("PopupEffect").onPopOn();
        });
        if (this.dataHisJP.length !== 0) {
            this.node.runAction(acInit);
        } else {
            this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(()=>{
                this.initItem();
            })));
        }

    },
    onClose(){
        this.node.getComponent("PopupEffect").onPopOff(true);
    }

    // update (dt) {},
});
