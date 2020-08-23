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
        listControll:[],
        imgControll:null,
        imgControllOff:null,
        target:null,
        type:null,
        isSlect :false,
        id:null,
        totalChip:0,
        totalChipFinal:0,
        lastTotalChip:0,
        indexInList:null,
        _isChoose:false

    },
    // LIFE-CYCLE CALLBACKS:

     
    setInfo( id  , target , indexInList, imgControll = null , imgControllOff = null){
        this.indexInList = indexInList
        this.target = target;
        this.id = id;
        this.imgControll = imgControll;
        this.imgControllOff = imgControllOff;
        this.listChipCur = [];
        this.listChipTotal = [];
        this.listChipTheir = [];
    },
    callBack(){
        if( this.imgControll != null) this.imgControll.active = true;
            let length = this.listControll.length;
            for(let i = 0 ; i < length ; i++ ){
                this.listControll[i].isSlect = true
                this.listControll[i].callBack()
            }
        
    },
    callBackCancel(){
        
            let length = this.listControll.length;
            for(let i = 0 ; i < length ; i++ ){
                this.listControll[i].callBackCancel()
            }
            
    },
    callBackSingleCancel(){
        if(this.isSlect) {
            this.isSlect = false;
            return;
        }
        if( this.imgControll != null) this.imgControll.active = false;
    },

    finisheffect(pos , pos1){
        if( this.imgControllOff != null){
            this.imgControllOff.active = true;
            cc.NGWlog('chay voa ham effect ben multil =====================')
        this.imgControllOff.runAction(cc.sequence(cc.blink(4,4),cc.callFunc(()=>{this.turnOffEffect()}) ));
        }
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
              //  this.listChipTotal[i].stopAllActions();
              let item = this.listChipTotal.pop()
              item.runAction(cc.sequence(cc.delayTime(delay) , cc.moveTo(0.4,pos),cc.callFunc(()=>{
                    this.target.effectScaleMoneyDealer();
                    item.destroy();
                }) ))
                delay+= 0.05
            }


            delay = 0;
            length = this.listChipTheir.length;
            for(let i = 0 ; i  < length ; i++){
              //  this.listChipTotal[i].stopAllActions();
              let item = this.listChipTheir.pop()
              item.runAction(cc.sequence(cc.delayTime(delay) , cc.moveTo(0.4,pos),cc.callFunc(()=>{
                    this.target.effectScaleMoneyDealer();
                    item.destroy();
                }) ))
                delay+= 0.05
            }
           // this.listChipTotal.length = 0;
        },4000);
    },
    turnOffEffect(){
        if( this.imgControllOff != null){
            this.imgControllOff.opacity = 255;
            this.imgControllOff.stopAllActions();
            this.imgControllOff.active = false;
        }
    },
    callBackEnd(){
        
        if (!this.target.isOkBet) {
            if (this.target.thisPlayer.ag < this.target._maxbet) {
                require('UIManager').instance.showToast(require("GameManager").getInstance().getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'))
            } else {
                require('UIManager').instance.showToast(require("GameManager").getInstance().getTextConfig('txt_maxBet').replace("%s", this.target._maxbet))
            }
            cc.log("nhay vao bet fail========");
            this.callBackSingleCancel()
            this.callBackCancel();
            return;
        }

        this.totalChip  +=  this.target._curChipBet;
        let chipbet = this.target._curChipBet;
        let obj = {};
        obj.pos = this.node.position;
        obj.chipBet = chipbet;
        obj.totalChip =  this.totalChip;
        obj.indexListbet = this.indexInList;
        obj.target = this;

        this.target.BetMutil(obj);
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.snd_click);
        this.callBackSingleCancel()
        this.callBackCancel();
    },
    callBackEndSpecial(chip){
        this.totalChip +=chip   //this.totalChip  + this.target._curChipBet;
        let obj = {};
        obj.pos = this.node.position;
        obj.chipBet = chip;
        obj.totalChip =  this.totalChip;
        obj.indexListbet = this.indexInList;
        obj.target = this;
        this.target.BetMutil( obj);
        this.callBackSingleCancel()
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
            item.runAction(cc.sequence(cc.spawn(cc.moveBy(0.5, cc.v2(0,20)).easing(cc.easeOut(2)),cc.sequence(cc.delayTime(0.3) ,cc.fadeTo(0.2 , 120).easing(cc.easeOut(2))), cc.scaleTo(0.5 , 0.7).easing(cc.easeOut(2)))
            ,cc.callFunc(()=>{
                item.destroy();
            })))
            
        };
        this.listChipCur.length = 0;
    },
    // clearAllNextGame(){
    //   //   var length = this.listChipTotal.length;
    //     // for(let i = 0 ; i < length ; i++ ){
    //     //     this.listChipTotal[i].destroy();
    //     // }
    //     this.isRunActionChip = true;
    //     this.listChipTotal.length = 0;
    //     // length = this.listChipCur.length;
    //     // for(let i = 0 ; i <length ; i++ ){
    //     //     this.listChipCur[i].destroy();
    //     // };
    //     // this.listChipCur.length = 0;
    // },

    isCheckResult(result){
            if(this.listControll.includes(result)){
                //cc.NGWlog('====== true');
                this._isChoose = true;
                return true;
            }
            this._isChoose = false;
        return false;
    },
    isCheckTheirBet(type , number , number2 = null){
        let isType;
        let lengthTemp = this.listControll.length;
        let length = lengthTemp;
        if(lengthTemp < 5){
            lengthTemp -=1;
        }else{
            switch(lengthTemp){
                case 6 : 
                lengthTemp = 4;
                break;
                case 12 : 
                lengthTemp = 5;
                break;
                case 18 : 
                lengthTemp = 6;
                break;
            }
        }
        let numberOne = this.listControll[0].number;
        let numberTwo = this.listControll[length- 1].number
        if(lengthTemp == type){
            if(numberOne == number && numberTwo == number2)return true;
            return false;
            
        }else{
            return false;
        }

    }
   

    // update (dt) {},
});
