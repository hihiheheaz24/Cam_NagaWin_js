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
        lbTime:cc.Label,
        chipCuoc:null,
        chipUser:null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setInfo (time, chipCuoc, chipUser) {
        cc.NGWlog('time set dc la=== ' + time);
        let tempTime = time;
        this.chipCuoc = chipCuoc;
        this.chipUser = chipUser
        this.lbTime.string = tempTime;
        var Interval = setInterval(()=>{
            if(this.node == null || typeof this.node =='undefined'){
                clearInterval(Interval);
                return;
            }
            tempTime--;
            this.lbTime.string = tempTime;
            if(tempTime < 1){
                clearInterval(Interval);
                this.node.destroy();
            }
        },1000)
    },
    onClickYes(){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickYesBaoHiem_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.chipUser < (this.chipCuoc / 2)) {
            require('GameManager').getInstance().onShowConfirmDialog(require('GameManager').getInstance().getTextConfig('txt_koduchipmuabaohiem'));
        } else {
            require('NetworkManager').getInstance().sendBlackjackInsure();
        }
        this.node.destroy();
    },
    onClickNo(){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickNoBaoHiem_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.node.destroy();
    }

    // update (dt) {},
});
