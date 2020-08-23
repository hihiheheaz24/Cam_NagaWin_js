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
        listSprite:cc.SpriteAtlas,
        listButton:[cc.Sprite],
        imgChose:cc.Node,
        lbDeal:cc.Label,
        lbClear:cc.Label,
        _curChipBet:0,
        _isLastBet:0,
        _isMaxBet:0,
        _isMinBet:0,
        _curMonney:0,
        _chipFinishBet:0,
        _target:null,
        btnDeal:cc.Button,
        btnClear:cc.Button,
        btnMaxbet: cc.Button,
        btnRebet: cc.Button,
        chip2:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    setInfo (minBet,MaxBet , target , listCHipBet) {
        this._target = target;
        this._isMaxBet = parseInt(MaxBet) ;
        this._isMinBet = parseInt(minBet) ;
        cc.NGWlog('minbet la============= ' + this._isMinBet);
        cc.NGWlog('max bet la==================== + ' + this._isMaxBet)
        if(this.listChipBet == null) this.listChipBet = [];
        this.listChipBet =listCHipBet;
        var length = this.listButton.length;
        for(var i = 0 ; i < length ; i++){
            let name = require('GameManager').getInstance().formatMoneyChip(this.listChipBet[i]);
            if(name == 2){
                this.listButton[i].spriteFrame = this.chip2;
            }else{
                this.listButton[i].spriteFrame = this.listSprite.getSpriteFrame(name);
            }
        }
     //   this.onClickChip(null,0);

    },
    checkListChip(){
      //  if(this._curMonney)
        var length = this.listButton.length;
        for(var i = 0 ; i < length ; i++){
            if(this.listChipBet[i]  > this._curMonney   || this.listChipBet[i] + this._chipFinishBet + this._curChipBet > this._isMaxBet ){
                this.listButton[i].node.getComponent(cc.Button).interactable = false;
            }else{
                this.listButton[i].node.getComponent(cc.Button).interactable = true;
            }
        };
        if(this._curChipBet < 1){
            this.btnClear.interactable = false;
            this.btnDeal.interactable = false
        }else{
            this.btnClear.interactable = true;
            this.btnDeal.interactable = true;
        }
    },
    resetLabel(){
        cc.NGWlog('chay vao ham resetlabel')
        this.lbClear.string = '0';
        this.lbDeal.string = '0';
    },
    onClean(){
        this._curChipBet = 0;
        this.resetLabel();
        this._isLastBet =  this._chipFinishBet;
        this._chipFinishBet = 0;
    },
    onClickChip(event,data){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let num = parseInt(data);
        this.imgChose.active = true;
        switch(num){
            case 0:
            this._curChipBet += this.listChipBet[0];
            this._curMonney -= this.listChipBet[0];
            this.imgChose.position = this.listButton[0].node.position;
            break;
            case 1:
            this._curChipBet += this.listChipBet[1];
            this._curMonney -= this.listChipBet[1];
            this.imgChose.position = this.listButton[1].node.position;
            break;
            case 2:
            this._curChipBet += this.listChipBet[2];
            this._curMonney -= this.listChipBet[2];
            this.imgChose.position = this.listButton[2].node.position;
            
            break;
            case 3:

            this._curChipBet += this.listChipBet[3];
            this._curMonney -= this.listChipBet[3];
            this.imgChose.position = this.listButton[3].node.position;
            
            break;
            case 4:
            this._curChipBet += this.listChipBet[4];
            this._curMonney -= this.listChipBet[4];
            this.imgChose.position = this.listButton[4].node.position;
            
            break;
            default:
            cc.NGWlog('err chip===========================')
            break;
        }

        this.checkListChip();
        this.setlbChip();
    },
    onCliclMaxBet(){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("onCliclMaxBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if ((this._curMonney + this._chipFinishBet)  < this._isMaxBet) {
            this._curChipBet += this._curMonney;
        } else {
            this._curChipBet = this._isMaxBet - this._chipFinishBet;
        }
        //this._curMonney -= this._isMaxBet;
        this.checkListChip();
        this.setlbChip();
        this.onClickDeal();
        this.node.active = false;
     //   this.btnMaxbet.interactable = false;
    },
    onClickRebet(){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickRebet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this._curMonney <= this._isLastBet) {
            this._curChipBet += this._curMonney;
        } else {
            this._curChipBet = this._isLastBet;
        }

        this._curMonney -= this._curChipBet;
        if((this._chipFinishBet + this._curChipBet) > this._isMaxBet ) {
            cc.log("nhay vao ham click Maxbet ben rebet")
            this.onCliclMaxBet();
            return;
        }
        if( this._curChipBet >= this._isMaxBet) this.node.active = false;
        this.checkListChip();
        this.setlbChip();
        this.onClickDeal();
        
    },
    onClickDeal(event,data){
        if(data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDeal_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if(this._curChipBet == 0) return;
        this._chipFinishBet += this._curChipBet;
        cc.NGWlog('_chipFinishBet la', this._chipFinishBet);
        require('NetworkManager').getInstance().sendBlackjackBet( this._chipFinishBet);
        this._curChipBet = 0;
        this.resetLabel();
        this.btnClear.interactable = false;
        this.btnDeal.interactable = false;
        this.imgChose.active = false;
    },
    onClickClear(){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClear_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this._curMonney += this._curChipBet;
        this._curChipBet = 0;
        this.resetLabel();
        this.checkListChip();
        this.btnClear.interactable = false;
        this.btnDeal.interactable = false;
        this.imgChose.active = false;
    },

    setlbChip(){
        this.lbClear.string = require("GameManager").getInstance().formatMoney(this._curChipBet)  +'';
        this.lbDeal.string = require("GameManager").getInstance().formatMoney(this._curChipBet) +'';
    },
    onEnable(){
        
        if(this._isLastBet < 1){
            this.btnRebet.interactable = false;
        }else{
            cc.NGWlog('chay vao enable === ' + this._isLastBet);
            this.btnRebet.interactable = true;
        }
    },
    onDisable(){
        this.imgChose.active = false;
    }

    // update (dt) {},
});
