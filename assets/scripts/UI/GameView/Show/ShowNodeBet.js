var GameManager = require('GameManager');
var ShowNodeBet =  cc.Class({
    extends: cc.Component,

    properties: {
      btn_Fold:{
        default: null,
        type: cc.Node
      },
      textBtn_Fold:{
          default:null,
          type: cc.Label
      },

      btn_Raise:{
        default: null,
        type: cc.Node
      },
      textBtn_Raise:{
        default:null,
        type: cc.Label
      },
      btn_Call:{
        default: null,
        type: cc.Node
      },
      textBtn_Call:{
        default:null,
        type: cc.Label
      },
      
    handleSlider:{
        default: null,
        type : cc.Slider
    },
    textBet:{
        default:null,
        type: cc.Label
    },
    thanhKeo:cc.Sprite,
    btn_Allin_Call:{
        default: null,
        type: cc.Node
      },
    
    valueBet:0,
    valueTableAg:500,
    valueThisPlayer:500,
    valuePot:0,
    timeCountDow:0,
    isClickRaise:false,
    isCountDow:false
    },
    //add Update and Reset Slider Function
    // resetSlider(_playerAg){
    //     this.handleSlider.progress = 0.02;
    //     this.valueThisPlayer = _playerAg; 
    // },
    update_slider(value){
        cc.NGWlog('Gia tri cua AllIn la', value);
        this.valueThisPlayer = value;
    },
    onLoad(){
        this.handleSlider.node.on('slide' ,this.CallBackSilder , this  );
        this.node.setContentSize(cc.winSize);
    },
    CallBackSilder(event){
        cc.NGWlog('chay vao ham thay doi slider');
        let valueMoney = 0;
        let _progress = this.handleSlider.progress;
        //cc.NGWlog('_progress la ', this.handleSlider.progress);
        this.thanhKeo.fillRange = _progress;
        if(_progress<= 0.7){
            valueMoney = Math.floor((_progress * this.valueThisPlayer /2 ) * (1/0.7) );
             if(_progress <= this.valueTableAg / this.valueThisPlayer / 0.7){
                 this.handleSlider.progress = this.valueTableAg / this.valueThisPlayer / 0.7;
             }
        }else{  
            valueMoney =  Math.floor(this.valueThisPlayer /2+ ((_progress-0.7)  *  this.valueThisPlayer /2 * (1/0.3)));
            if(_progress >=0.99){
                this.handleSlider.progress = 1;
            }
        }

        if(valueMoney <= this.valueTableAg){
            valueMoney = this.valueTableAg;
            this.textBet.string = require('GameManager').getInstance().formatMoney(this.valueTableAg);
        }else if(valueMoney <this.valueThisPlayer){
            this.textBet.string = require('GameManager').getInstance().formatMoney(valueMoney);
        }
        else{
            this.textBet.string =  GameManager.getInstance().getTextConfig('show_lb_allin')
            valueMoney = this.valueThisPlayer
        }
        
        this.valueBet =  valueMoney
        
    },
    setValueInfo(valueagPlayer , valueTableAg , valuePot){
        
        this.valueThisPlayer  = valueagPlayer;
        this.valueTableAg  = valueTableAg;
        this.valuePot = valuePot
        this.valueBet = valueTableAg;
        this.textBet.string = require('GameManager').getInstance().formatMoney(this.valueTableAg);
        if(valueagPlayer <=0){
            this.btn_Allin_Call.active = true;
            this.btn_Raise.active = false;
            this.btn_Call.active = false;
        }else{
            this.btn_Raise.active = true;
            this.btn_Call.active = true;
            this.btn_Allin_Call.active = false;
        }
        
    },
    setInfoBtn(btn_1 , btn_2, btn_3,amount = 0){
        if(btn_3 == 'Bet'){
            this.textBtn_Raise.string = GameManager.getInstance().getTextConfig('show_lb_bet')
        }else{
            this.textBtn_Raise.string = GameManager.getInstance().getTextConfig('show_lb_raise')
        }
        if(btn_2 == 'Call'){
            if(amount >0){
                cc.NGWlog('voa truog hop xet duoc text call======================================');
                let str = require('GameManager').getInstance().formatMoney(parseInt(amount));
                this.textBtn_Call.string = GameManager.getInstance().getTextConfig('show_lb_call')+ '(' + str +')'
            }else{
                this.textBtn_Call.string = GameManager.getInstance().getTextConfig('show_lb_call')
            }
            
        }else{
            this.textBtn_Call.string = GameManager.getInstance().getTextConfig('show_lb_check')     
        }

    },
    onClickRaise(){
        this.btn_Raise.active = false;
        this.isClickRaise = true;
        this.handleSlider.node.getParent().active = true;
        this.resetSlider();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickComfirm(){
        if(this.valueBet == this.valueThisPlayer){
            require('NetworkManager').getInstance().sendMakeBetShow('pAllin');
        } else{
            require('NetworkManager').getInstance().sendMakeBetShow('pRaise',parseInt(this.valueBet)  );
        }
        this.btn_Raise.active = true;
        this.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickConfirm_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickFold(){
        require('NetworkManager').getInstance().sendMakeBetShow('pFold');
        this.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFold_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickCall(){
        if(this.textBtn_Call.string == GameManager.getInstance().getTextConfig('show_lb_check')){
            require('NetworkManager').getInstance().sendMakeBetShow('pCheck');
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCheck_%s", require('GameManager').getInstance().getCurrentSceneName()));
        }else{
            require('NetworkManager').getInstance().sendMakeBetShow('pCall');
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCall_%s", require('GameManager').getInstance().getCurrentSceneName()));
        }
        
        this.node.active = false;
        
    },
    on1per2Click(){

        var cBet = parseInt(this.valuePot / 2);

        if (cBet < this.valueTableAg) {
            cBet = this.valueTableAg;
        }

        this.btn_Raise.active = true;
        if(this.valueThisPlayer > cBet){
            require('NetworkManager').getInstance().sendMakeBetShow('pRaise',cBet);
        }else{
            require('NetworkManager').getInstance().sendMakeBetShow('pAllin');
        }
        this.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBet1Per2_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    on1per4Click() {

        var cBet = parseInt(this.valuePot / 4);

        if (cBet < this.valueTableAg) {
            cBet = this.valueTableAg;
        }

        this.btn_Raise.active = true;
        if (this.valueThisPlayer > cBet) {
            require('NetworkManager').getInstance().sendMakeBetShow('pRaise', cBet);
        } else {
            require('NetworkManager').getInstance().sendMakeBetShow('pAllin');
        }
        this.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBet1Per4_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    on1per8Click() {
        var cBet = parseInt(this.valuePot / 8);
       
        if (cBet < this.valueTableAg) {
            cBet = this.valueTableAg;
        }
        this.btn_Raise.active = true;
        if (this.valueThisPlayer > cBet) {
            require('NetworkManager').getInstance().sendMakeBetShow('pRaise', cBet);
        } else {
            require('NetworkManager').getInstance().sendMakeBetShow('pAllin');
        }
        this.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBet1Per8_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onDisable(){
        this.handleSlider.node.getParent().active = false;
    },
    onClickBtnAllIn(){
        this.btn_Raise.active = true;
        require('NetworkManager').getInstance().sendMakeBetShow('pAllin');
        this.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBetAllin_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    resetSlider(){
        this.handleSlider.progress = 0.02;//this.valueTableAg/this.valueThisPlayer / 0.7;
        this.thanhKeo.fillRange = 0.02;
        this.textBet.string = require('GameManager').getInstance().formatMoney(this.valueTableAg);
    },
    onClickBtnAllinForCall(){
        require('NetworkManager').getInstance().sendMakeBetShow('pCall');
        this.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCall_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    AutoBetIfClickRaise(time){
        this.timeCountDow = time;
        this.isCountDow = true;
    },

    SetFalseIsCountDown(){
        this.timeCountDow = 0;
        this.isCountDow = false;
        this.isClickRaise = false;
    },
    onSliderEvent(sender, eventType) {
    
    },
    update(dt) {
        if (this.isCountDow) {
            this.timeCountDow -= dt;
            if(this.timeCountDow <0.5 && this.isClickRaise){
                this.btn_Raise.active = true;
                require('NetworkManager').getInstance().sendMakeBetShow('pRaise',parseInt(this.valueTableAg));
                this.isCountDow = false;
                this.isClickRaise = false;
                this.node.active = false;
            }
        }
    },

});
module.exports = ShowNodeBet;