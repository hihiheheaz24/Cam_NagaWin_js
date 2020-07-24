// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var SingleBet =  cc.Class({
    extends: cc.Component,

    properties: {
        spriteControll:null,
        imgControllOff:null,
        number:null,
        isActive:false,
        target:null,
        self:null,
        isSlect:false,
        totalChip:0,
        totalChipFinal:0,
        lastTotalChip:0,
        color:null,   // 0 red , 1 black , 3 green

      //  indexInList:null,
    },

    // LIFE-CYCLE CALLBACKS:

    
    setInfo(num , nodeSprite ,  target , imgControllOff){
        this.imgControllOff = imgControllOff;
        this.spriteControll =  nodeSprite;
        this.number = num;
        this.target = target;
        this.listChipCur = [];
        this.listChipTotal = [];
        this.listChipTheir = [];
    },
    callBack(){
        if(!this.isActive){
            this.spriteControll.active = true;
            this.isActive = true;
        }
    },
    finisheffect(pos , pos1){
        this.imgControllOff.active = true;
        this.imgControllOff.runAction(cc.sequence(cc.blink(4,4),cc.callFunc(()=>{this.turnOffEffect();}) ));
        setTimeout(()=>{
            let delay = 0;
            let length = this.listChipTotal.length;
            for(let i = 0 ; i  < length ; i++){
                let item = this.listChipTotal.pop();
                item.runAction(cc.sequence(cc.delayTime(delay) , cc.moveTo(0.4,pos),cc.callFunc(()=>{
                    this.target.effectScaleMoney();
                    item.destroy();
                }) ))
                delay+= 0.05
            }
            delay = 0;
            length = this.listChipTheir.length;
            for(let i = 0 ; i  < length ; i++){
                let item = this.listChipTheir.pop();
                item.runAction(cc.sequence(cc.delayTime(delay) , cc.moveTo(0.4,pos1),cc.callFunc(()=>{
                    this.target.effectScaleMoneyTheir();
                    item.destroy();
                }) ))
                delay+= 0.05
            }
        },5000);
    },
    chipLose(pos){
        setTimeout(()=>{
            let delay = 0;
            let length = this.listChipTotal.length;
            for(let i = 0 ; i  < length ; i++){
                let item = this.listChipTotal.pop();
                item.runAction(cc.sequence(cc.delayTime(delay) , cc.moveTo(0.4,pos),cc.callFunc(()=>{
                    this.target.effectScaleMoneyDealer();
                    item.destroy();
                }) ))
                delay+= 0.05
            }

            delay = 0;
            length = this.listChipTheir.length;
            for(let i = 0 ; i  < length ; i++){
                let item = this.listChipTheir.pop();
                item.runAction(cc.sequence(cc.delayTime(delay) , cc.moveTo(0.4,pos),cc.callFunc(()=>{
                    this.target.effectScaleMoneyDealer();
                    item.destroy();
                }) ))
                delay+= 0.05
            }
        },4000);
    },
    turnOffEffect(){
        if(this.number == 0) {
            this.imgControllOff.opacity = 170;
        }else{
            this.imgControllOff.opacity = 255;
        }
        
        this.imgControllOff.stopAllActions();
        this.imgControllOff.active = false;
    },
    callBackCancel(){
        if(this.isSlect) {
            this.isSlect = false;
            return;
        }
        if(this.isActive){
            this.spriteControll.active = false;
            this.isActive = false;
        }
    },
    callBackEnd(){
        // this.totalChip +=  this.target._curChipBet;
        // let chipbet = this.target._curChipBet;
        // let temp = this.target._totalMoneyCurentBet  + this.target._curChipBet;
        // if(this.totalChip > this.target._maxbet){
        //     require('UIManager').instance.showToast( require("GameManager").getInstance().getTextConfig('txt_maxBet').replace("%s", this.target._maxbet))  
        //     this.totalChip -= this.target._curChipBet;
        //     this.callBackCancel();
        //     return; 
        // }
          

        // if(this.target.thisPlayer.ag  < temp ){
        //     this.totalChip -= this.target._curChipBet;
        //     if(this.target.thisPlayer.ag > this.target._totalMoneyCurentBet){
        //         chipbet = this.target.thisPlayer.ag - this.target._totalMoneyCurentBet;
        //         this.totalChip += chipbet;
        //         this.target.BetSingle(this.number , this.node.position, chipbet,  this.totalChip ,this );
        //     }else{
        //         require('UIManager').instance.showToast( require("GameManager").getInstance().getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'))  
        //     }
        //     this.callBackCancel();
        //     return;
        // }
    

        if (!this.target.isOkBet) {
            if (this.target.thisPlayer.ag < this.target._maxbet) {
                require('UIManager').instance.showToast(require("GameManager").getInstance().getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'))
            } else {
                require('UIManager').instance.showToast(require("GameManager").getInstance().getTextConfig('txt_maxBet').replace("%s", this.target._maxbet))
            }
            cc.log("nhay vao bet fail========");
            this.callBackCancel();
            return;
        }

        this.totalChip  +=  this.target._curChipBet;
        let chipbet = this.target._curChipBet;
        let obj = {};
        obj.id = this.number;
        obj.pos = this.node.position;
        obj.chipBet = chipbet;
        obj.totalChip =  this.totalChip;
        obj.target = this;
        this.target.BetSingle(obj);
        this.callBackCancel();
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.snd_click);
    },
    callBackEndSpecial(chip){
        this.totalChip +=  chip;
        let obj = {};
        obj.id = this.number;
        obj.pos = this.node.position;
        obj.chipBet = chip;
        obj.totalChip =  this.totalChip;
        obj.target = this;
        this.target.BetSingle(obj);
        this.callBackCancel();
    },
    
    onDeal(){
        let length = this.listChipCur.length;
        for(let i = 0 ; i < length ; i++){
            this.listChipTotal.push(this.listChipCur.shift());
        }
    },
    onClear(){
        let length = this.listChipCur.length;
        for(let i = 0 ; i <length ; i++ ){
            let item = this.listChipCur[i];
            item.stopAllActions();
            item.runAction(cc.sequence(cc.spawn(cc.moveBy(0.5, cc.v2(0,20)).easing(cc.easeOut(2)),cc.sequence(cc.delayTime(0.3) ,cc.fadeTo(0.2 , 120).easing(cc.easeOut(2))), cc.scaleTo(0.5 , 0.7).easing(cc.easeOut(2))),
            cc.callFunc(()=>{
                item.destroy();
            }))) 
        };
        this.listChipCur.length = 0;
    },
    // clearAllNextGame(){
    //     // var length = this.listChipTotal.length;
    //     // for(let i = 0 ; i < length ; i++ ){
    //     //     this.listChipTotal[i].destroy();
    //     // }
    //     // length = this.listChipCur.length;
    //     // for(let i = 0 ; i <length ; i++ ){
    //     //     this.listChipCur[i].destroy();
    //     // };
    // },
    isCheckTheirBet(number){
        if(this.number == number)return true;
        return false;
    }
   

    // update (dt) {},
});
module.exports = SingleBet;
