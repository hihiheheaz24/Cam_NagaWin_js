
var PotShow= cc.Class({
    extends: cc.Component,

    properties: {
        listNum:{
            default:[],
            type:[cc.Label]
        },
        value:0,
        valueChange:0,
        
    },

    
    start () {
        for(let i = 0 ; i < this.listNum.length ; i++){
            this.listNum[i].string = '0';
        }
    },
    setValue(value , delayTime = 0){
        this.valueChange = value-this.value;
        this.node.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(()=>{
            this.EffectMoneyPotChange(this.valueChange);
            this.value = value;
        })))
    },
    getValue(){
        return this.value;
    },
    getValueChange(){
        return this.valueChange;
    },
    EffectMoneyPotChange(amountChange){
        let value = this.value ;
        let tempNUm = parseInt (amountChange/30);
        let temp_Du = amountChange % 30;
        let Actemp = cc.callFunc(()=>{
            value += tempNUm;
            let valueString = value.toString();
            let temp = this.listNum.length -1;
            let temp2 = valueString.length -1;
            let numChangeEffect =  this.NumberValueChange(value - tempNUm, value);
            for(let i = 0 ; i < numChangeEffect; i++ ){
                if(temp2 <0 || temp2 >= valueString.length ){
                    this.listNum[temp].string = '0'
                }else{
                    this.listNum[temp].string = valueString[temp2];
                }
                
                if(i<numChangeEffect){
                    this.listNum[temp].node.stopAllActions();
                    this.listNum[temp].node.runAction(cc.sequence(cc.scaleTo(0.1,1.4),cc.scaleTo(0.1,1)));
                }
                temp --;
                temp2--;
            }
        });
        
        let seQuenTemp = cc.sequence( Actemp , cc.delayTime(0.003) );
        let actempRepeat = cc.repeat(seQuenTemp , 30).easing(cc.easeOut(15));
        let seQuenFinal = cc.sequence( actempRepeat  , cc.callFunc(()=>{ 
            if(temp_Du ==0) return;
            value += temp_Du;
            let valueString = value.toString();
            let temp = this.listNum.length -1;
            let temp2 = valueString.length -1;
            let numChangeEffect =  this.NumberValueChange(value - temp_Du, value);
            for(let i = 0 ; i <numChangeEffect ; i++ ){
                if(temp2 <0 || temp2 >= valueString.length ){
                    this.listNum[temp].string = '0'
                }else{
                    this.listNum[temp].string = valueString[temp2];
                }
                
                if(i< numChangeEffect){
                    this.listNum[temp].node.stopAllActions();
                    this.listNum[temp].node.runAction(cc.sequence(cc.scaleTo(0.1,1.4),cc.scaleTo(0.1,1)));
                }
                
                temp --;
                temp2--;
            }
              
        }) );
        this.node.stopAllActions();
        this.node.runAction(seQuenFinal)
        
    },
    resetPot(){
        
    },
    NumberValueChange(thisVallue,lastValue){
        let numValueString = thisVallue.toString();
        let numLastValueString = lastValue.toString();
        if(numLastValueString.length > numValueString.length){
            return numLastValueString.length;
        }else if(numLastValueString.length < numValueString.length){
            return numValueString.length;
        }
        else
        {
            for(let i = 0; i < numLastValueString.length ; i++){
                if(numLastValueString[i] !== numValueString[i] ){
                    return numLastValueString.length-i;
                }
            }
            return 0;
        }
        
    }

});
module.export = PotShow;
