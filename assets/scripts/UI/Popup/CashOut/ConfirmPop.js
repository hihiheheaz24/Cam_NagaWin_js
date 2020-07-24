
cc.Class({
    extends: require('PopupEffect'),
    properties: {
        value: 0,
        lbError: cc.Label,
        btn_Confirm: cc.Button,
        edb_WingId: cc.EditBox,
        edb_reWingId: cc.EditBox,
        popEdit: cc.Node,
        value:0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.onPopOn();
    },
    onConfirmCashOut() {
        let wingId = this.edb_WingId.string;
        let reWingId = this.edb_reWingId.string;
        let userId = require('Gamemanager').getInstance().user.id;
        if (wingId === reWingId && wingId!=="") {
            require('NetworkManager').instance.sendCashOut(userId, this.value, wingId);
        } 
        this.onPopOff(true);
    },
    onShow(value,text="not_enought_gold") {
        this.onPopOn();
        this.value=value;
        if (require('GameManager').getInstance().user.ag < value || value ===null) {
            this.popEdit.active = false;
            this.lbError.node.active = true;
            this.lbError.node.position = cc.v2(0, 0);
            this.lbError.color = cc.Color.WHITE;
            this.lbError.string = require('GameManager').getInstance().getTextConfig(text);
            this.lbError.fontSize = 40;
           this.btn_Confirm.interactable=true;
        }
        else {
            this.popEdit.active = true;
            this.lbError.node.active = false;
            this.lbError.node.position = cc.v2(this.edb_WingId.node.x - 140, this.edb_WingId.node.y + 60);
            this.lbError.color = cc.Color.RED;
            this.lbError.string = require('GameManager').getInstance().getTextConfig("txt_reID");
            this.lbError.fontSize = 25;
        }
    },
    checkEdb() {
        cc.NGWlog('Editing....');
        if (this.edb_WingId.string === this.edb_reWingId.string) {
            this.btn_Confirm.interactable = true;
            this.lbError.node.active = false;
        } else {
            this.btn_Confirm.interactable = false;
            // this.lbError.node.position = cc.v2(this.edb_WingId.node.x - 140, this.edb_WingId.node.y + 60);
            // this.lbError.string = require('GameManager').getInstance().getTextConfig("txt_reID");
            this.lbError.node.active = true;
        }
    },
   
});
