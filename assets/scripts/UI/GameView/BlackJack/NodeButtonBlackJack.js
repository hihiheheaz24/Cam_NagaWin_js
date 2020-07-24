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
        btnSplit: cc.Button,
        btnDouble:cc.Button,
        chipCuoc: null,
        chipUser: null

    },
    setInfo(chipCuoc, chipUser) {
        this.chipCuoc = chipCuoc;
        this.chipUser = chipUser;
        this.btnDouble.interactable = true;
    },
    onClick(event ,data){
        cc.NGWlog('nhay vao onClick');
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_click);
        let num = parseInt(data);
        switch(num){
            case 0:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDouble_%s", require('GameManager').getInstance().getCurrentSceneName()));
                if (this.chipUser < this.chipCuoc) {
                    require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('txt_koduchipx2'))
                    return;
                }
                cc.NGWlog('nhay vao double tat no ')
                this.btnDouble.interactable = false;
                require('NetworkManager').getInstance().sendBlackjackActionPlay('double');
                break;
            case 1:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSplit_%s", require('GameManager').getInstance().getCurrentSceneName()));
                if (this.chipUser < this.chipCuoc) {
                    require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('txt_koduchiptachbai'))
                    return;
                }
                require('NetworkManager').getInstance().sendBlackjackActionPlay('split');
                
            break;
            case 2:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickHit_%s", require('GameManager').getInstance().getCurrentSceneName()));
                require('NetworkManager').getInstance().sendBlackjackActionPlay('hit');
                this.btnDouble.interactable = false;
                break;
            case 3:
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickStand_%s", require('GameManager').getInstance().getCurrentSceneName()));
                require('NetworkManager').getInstance().sendBlackjackActionPlay('stand');
                break;      
        }
        this.node.active = false;
        
    },
    setStatus(card1 , card2){
        if(card1.N == card2.N  || (card1.N  > 9 && card2.N > 9) ){
            cc.NGWlog('chay va 2 la bai bang nhau')
            this.btnSplit.interactable = true;
        }else{
            this.btnSplit.interactable = false;
        }
       
    },
    
    // update (dt) {},
});
