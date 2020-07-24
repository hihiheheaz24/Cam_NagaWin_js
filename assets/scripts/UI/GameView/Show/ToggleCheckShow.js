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
        listToggle:[cc.Toggle],
       textToggleFold:cc.Label,
       textToggleCall:cc.Label,
       textToggleCallAny:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setInfo(chipForCall ,chipBoxBet , ChipPlayer ) {
        let temp = chipBoxBet;
        if(temp == null || typeof temp == 'undefined') temp = 0;
        if (chipForCall <= 0 || chipForCall == temp) {
            this.textToggleFold.string = 'Fold/Check';
            this.textToggleCall.string = 'Check';
        } else {
            cc.NGWlog('chip can phai ghi la====================' + (chipForCall - temp));
            this.textToggleFold.string = 'Fold';
            this.textToggleCall.string = 'Call(' +  require('GameManager').getInstance().formatMoney(chipForCall - temp) + ')';
        };
        this.textToggleCallAny.string = 'Call Any';
        if (chipForCall >= ChipPlayer + temp) {
            this.listToggle[1].node.active = false;
            this.textToggleCallAny.string = 'All In'
        }else{
            this.listToggle[1].node.active = true;
        }
    },
    readInfoToggle(){
        for (let i = 0; i < this.listToggle.length; i++) {
            if (this.listToggle[i].isChecked) {
                if (i == 0) {
                    if (this.textToggleFold.string == 'Fold/Check') { 
                        require('NetworkManager').getInstance().sendMakeBetShow('pCheck');
                    } else {
                        require('NetworkManager').getInstance().sendMakeBetShow('pFold');
                    }
                } else {
                    cc.NGWlog('auto gui calll=========================================')
                    require('NetworkManager').getInstance().sendMakeBetShow('pCall');
                }

                this.listToggle[i].isChecked = false;
                this.node.active = false;
                return true;
            }
        }
        this.node.active = false;
        return false;
    },
    onClickToggleFold() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickToggleFold_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickToggleCall() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickToggleCall%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickToggleCallAny() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickToggleCallAny%s", require('GameManager').getInstance().getCurrentSceneName()));
    }
    // update (dt) {},
});
