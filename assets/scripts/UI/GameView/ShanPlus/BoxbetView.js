const GameManager = require('GameManager')

var BoxbetView = cc.Class({
    extends: cc.Component,
    // name: 'BoxbetView',

    properties: {
        lb_chipbet: {
            default: null,
            type: cc.Label
        },
        lbchipbet: {
            default: null,
            type: cc.Label
        },
        iconChip: {
            default: null,
            type: cc.Node
        },
        currentValue: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        value:0,
        valueChange:0
    },

    setValue: function(value) {
        this.lb_chipbet.string = GameManager.getInstance().formatMoney(value);
        this.node.active = true;
        cc.NGWlog('gia tri tien khi set la=======' + value);
    },

    onHide() {
        this.lb_chipbet.node.active = false;
        this.node.active = false;
    },
    onShow(index) {
        this.lb_chipbet.node.active = true;
        this.node.active = true;

        let pos = this.node.position;
        let startPos = this.getStartPosition(index);
        this.node.position = startPos;
        // this.lb_chipbet.node.opacity = 0;
        this.node.opacity = 0;
        this.node.runAction(
            cc.spawn(
                cc.moveTo(0.4,pos).easing(cc.easeCubicActionOut()),
                cc.fadeIn(0.4),
                cc.sequence(
                    cc.scaleTo(0.2,1.2).easing(cc.easeCubicActionOut()),
                    cc.scaleTo(0.2,1).easing(cc.easeCubicActionIn()),
                )
            )
        )
    },
    //------BOHN---------/

    setValueBohn(value) {
        cc.NGWlog('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      ', value);
        this.currentValue = this.currentValue + value;
        this.lb_chipbet.string = GameManager.getInstance().formatMoney(this.currentValue);
        this.node.active = true;
    },
    resetValueBohn() {
        this.currentValue = 0;
        this.lb_chipbet.string = GameManager.getInstance().formatMoney(0);
    },

    //=======BOOGYI========//
    setValueBoogyi(value , delayTime = 0){
        this.value = value;
        cc.NGWlog('value la========== ' + this.value );
        this.lb_chipbet.string = GameManager.getInstance().formatMoney(this.value);
    },
    getValueBoogyi(){
        return this.value;
    },
    getValueChangeBoogyi(){
        return this.valueChange;
    },
    SetTextBoogyi(value){
        
        let tempNUm = parseInt (value/100);
        let temp_Du = value%100;

        let tempNUmber = 0;
        let Actemp = cc.callFunc(()=>{
            tempNUmber += tempNUm;
            this.lb_chipbet.string = require('GameManager').getInstance().formatMoney(tempNUmber);;   
        });
        
        let seQuenTemp = cc.sequence( Actemp , cc.delayTime(0.01) );
        let actempRepeat = cc.repeat(seQuenTemp , 100)
        let seQuenFinal = cc.sequence( actempRepeat  , cc.callFunc(()=>{  
            tempNUmber+= temp_Du;
            this.lb_chipbet.string = require('GameManager').getInstance().formatMoney(tempNUmber);
        }) ).easing(cc.easeOut(20));
        this.node.runAction(seQuenFinal);
    },
    EffectMoneyChange(amountChange ,_valueSet , label ,format = false, speed = 1 , duration = 1){
        let a = duration*100;
        let b = parseFloat(speed/100) ;
        
        let tempNUm = parseInt (amountChange/a);
        let temp_Du = amountChange % a;
        let Actemp = cc.callFunc(()=>{
            
            _valueSet += tempNUm;
            if(!format){
                label.string = require('GameManager').getInstance().formatNumber(_valueSet);
            }else{
                label.string = require('GameManager').getInstance().formatMoney(_valueSet);
            }
              
        });
        
        let seQuenTemp = cc.sequence( Actemp , cc.delayTime(b) );
        let actempRepeat = cc.repeat(seQuenTemp , a).easing(cc.easeOut(20*duration));
        let seQuenFinal = cc.sequence( actempRepeat  , cc.callFunc(()=>{  
            _valueSet += temp_Du;
            if(!format){
                label.string = require('GameManager').getInstance().formatNumber(_valueSet);
            }else{
                label.string = require('GameManager').getInstance().formatMoney(_valueSet);
            }
            
        }) );
        this.node.stopAllActions();
        this.node.runAction(seQuenFinal)
        
    },
    // start() {
    //     if (GameManager.getInstance().curGameId == GAME_ID.SHAN2||GameManager.getInstance().curGameId == GAME_ID.SHAN_PLUS ) return;
    //     this.lb_chipbet.string = require('GameManager').getInstance().formatMoney(0);
    // },

    getStartPosition (index){
        switch (index){
            case 0:
                return cc.v2(-115,-173);
            case 1:
                return cc.v2(-420,-173);
            case 2:
                return cc.v2(-513,39);
            case 3:
                return cc.v2(-314,255);
            case 4:
                return cc.v2(315,255);
            case 5:
                return cc.v2(546,39);
            case 6:
                return cc.v2(428,-173);
            case 7:
                return cc.v2(-3,223);
        }
    }
});
module.exports = BoxbetView;