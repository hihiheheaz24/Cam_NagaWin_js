
cc.Class({
    extends: cc.Component,

    properties: {
        lbPrice: {
            default: null,
            type: cc.Label
        },

        imgActive: {
            default: null,
            type: cc.Sprite
        },

        imgNotActive: {
            default: null,
            type: cc.Sprite
        },
        ag: "",
        m: "",
        isACtive: false,
        index: null,
    },

    updateItem(itemData,index) {
        this.lbPrice.string = itemData.m + "$";
        this.ag = itemData.ag;
        this.m = itemData.m;
        this.index = index;

        this.imgActive.node.active = false;

        if(index === 0) {
            this.imgActive.node.active = true;
            this.imgNotActive.node.active = false;
        }
        //this.imgNotActive.node.active = false;
        // if (require('GameManager').getInstance().user.ag >= itemData.ag) {
        //     this.imgActive.node.active = true;
        //     this.isACtive = true;
        // }
        // else {
        //     this.imgNotActive.node.active = true;
        //     this.isACtive = false;
        // }
    },

    onClickConfirm() {
        var list = Global.CashOutView.listViewCash.content;
        
        for (let i = 0; i < list.children.length; i++) {
            list.children[i].getComponent('ItemCashOut').imgActive.node.active = false;
            list.children[i].getComponent('ItemCashOut').imgNotActive.node.active = true;
            if (i === this.index) {
                list.children[i].getComponent('ItemCashOut').imgActive.node.active = true;
                list.children[i].getComponent('ItemCashOut').imgNotActive.node.active = false;
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ChooseCashOut_%s_%s", this.m, require('GameManager').getInstance().getCurrentSceneName()));
            }
        }
        Global.CashOutView.onChooseCashOut(parseInt(this.ag), parseFloat(this.m));
    }
});
