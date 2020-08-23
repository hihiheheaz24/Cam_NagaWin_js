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
        listCheckToggle:[cc.Toggle],
        _lastbet:0,
        _curMoney:0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    setInfo(card1 , card2 , curMoney , lastBetMoney){
        
        this._lastbet = lastBetMoney;
        this._curMoney = curMoney;
        if(card1.N == card2.N ){
            this.listCheckToggle[1].interactable = true;
            cc.NGWlog('chay vào ham check=======================================================')
        }
        if(card1.N  > 9 && card2.N > 9){
            this.listCheckToggle[1].interactable = true;
            cc.NGWlog('chay vào ham check=======================================================')
        }
        
    },
    CheckToggleButton(){
        let length = this.listCheckToggle.length;
        for (let i = 0; i < length; i++) {
            let item = this.listCheckToggle[i];
            if (item.isChecked) {
                switch (i) {
                    case 0:
                        if(this._curMoney < this._lastbet){
                            require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'));
                        }else{
                            require('NetworkManager').getInstance().sendBlackjackActionPlay('double')
                        }
                        
                        break;
                    case 1:
                            if(this._curMoney < this._lastbet){
                                require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'));
                            }else{
                                require('NetworkManager').getInstance().sendBlackjackActionPlay('split')
                               // this.g
                            }
                        break;
                    case 2:
                        require('NetworkManager').getInstance().sendBlackjackActionPlay('hit')
                        break;
                    case 3:
                        require('NetworkManager').getInstance().sendBlackjackActionPlay('stand')
                        break;
                }
                item.isChecked = false;
                break;
            }
        }
        this.node.active = false;
    },
    onDisable(){
        this.listCheckToggle[1].interactable = false;
    },
    onClickToggle(event, data) {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_click);
        let num = parseInt(data);
        switch (num) {
            case 0:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDoubleToggle_%s", require('GameManager').getInstance().getCurrentSceneName()));
                break;
            case 1:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSplitToggle_%s", require('GameManager').getInstance().getCurrentSceneName()));
                break;
            case 2:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickHitToggle_%s", require('GameManager').getInstance().getCurrentSceneName()));
                break;
            case 3:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickStandToggle_%s", require('GameManager').getInstance().getCurrentSceneName()));
                break;
        }
    },

    // update (dt) {},
});
