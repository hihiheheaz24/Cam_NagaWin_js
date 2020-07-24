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
        listSprite: cc.SpriteAtlas,
        listButton: [cc.Sprite],
        imgChose: cc.Node,
        lbDeal: cc.Label,
        lbClear: cc.Label,
        lbChip: cc.Label,
        _curChipBet: 0,
        _isLastBet: 0,
        _isMaxBet: 0,
        _isMinBet: 0,
        _curMonney: 0,
        _chipEffect: null,
        target: null,
        oldIndex: null,
        btn_Rebet: cc.Button,
        btn_Double: cc.Button,
        btn_Deal: cc.Button,
        btn_Clear: cc.Button,
        nodeTop: cc.Node,
        nodeBot: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    setInfo(minBet, MaxBet, target) {
        cc.NGWlog('chay vao set info')
        this.target = target
        this._isMaxBet = MaxBet;
        this._isMinBet = minBet;
        if (this.listChipBet == null) this.listChipBet = [];
        let lengthString = minBet.toString();
        if (lengthString[0] == '1') {
            this.listChipBet = [minBet, minBet * 5, minBet * 10, minBet * 50, minBet * 100];
        } else {
            this.listChipBet = [minBet, minBet * 2, minBet * 10, minBet * 20, minBet * 100];
        }
        var length = this.listButton.length;
        for (var i = 0; i < length; i++) {
            let name = require('GameManager').getInstance().formatMoneyChip(this.listChipBet[i]);
            this.listButton[i].spriteFrame = this.listSprite.getSpriteFrame(name);
        }
        this.onClickChip(null, 0, true);
    },
    moveOn() {
        this.nodeTop.y -= 300;
        this.nodeBot.y -= 300;
        this.nodeTop.runAction(cc.moveBy(0.3, cc.v2(0, 300)).easing(cc.easeBackOut()));
        this.scheduleOnce(() => { this.nodeBot.runAction(cc.moveBy(0.3, cc.v2(0, 300)).easing(cc.easeBackOut())); }, 0.2)
    },


    checkListChip(moneyBox) {
        var length = this.listButton.length;
        let money ;
        if(this._curMonney >= this.target._maxbet){
            money = this.target._maxbet;
        }else{
            money =this._curMonney;
        }
        let TienConLai = money - moneyBox;


        cc.NGWlog( money +  ' tien con lai la== ' + TienConLai);
        cc.NGWlog("=== " + this.target._totalMoneyCurentBet);
        for(var i = length -1 ; i >= 0 ; i--){
            if(this.listChipBet[i]  > TienConLai   ){
                this.listButton[i].node.getComponent(cc.Button).interactable = false;
                if(i > 0  ){
                    if(this.oldIndex >= i)
                    this.onClickChip(null,i-1);
                }else{
                    this.target.isOkBet = false;
                }
            }else{
                this.listButton[i].node.getComponent(cc.Button).interactable = true;
                this.target.isOkBet = true;
            }
        }



        
        // if((this.target._totalMoneyCurentBet + this.target._totalMoneyBet) >= this.target._maxbet ) {
        //     this.target.isOkBet = false;
        // }else{
        //     this.target.isOkBet = true;
        // }



        if (this.target._totalMoneyCurentBet < 1) {
            this.btn_Deal.interactable = false;
            this.btn_Clear.interactable = false
        } else {
            this.btn_Deal.interactable = true;
            this.btn_Clear.interactable = true;
        }

        if (this.target._isLastTotalMoneyBet < 1) {
            this.btn_Rebet.interactable = false;
        } else {
            this.btn_Rebet.interactable = true;
        }

        if (this.target._isLastTotalMoneyBet < 1 && this.target._totalMoneyBet < 1 && this.target._totalMoneyCurentBet < 1) {
            this.btn_Double.interactable = false;
        } else {
            this.btn_Double.interactable = true;
        }

    },
    resetLabel() {
        this.lbClear.string = '0';
        this.lbDeal.string = '0';
    },
    onClean() {
        this.resetLabel();
    },
    onClickChip(event, data, firstInit = false) {
        //if(!this.target.isBetTime);
        if (!firstInit) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        let num = parseInt(data);
        switch (num) {
            case 0:
                if (this.oldIndex == 0) return;
                this._chipEffect = this.listButton[0].node;
                this.target._curChipBet = this.listChipBet[0];
                this.choseChip(0);
                break;
            case 1:
                if (this.oldIndex == 1) return;
                this._chipEffect = this.listButton[1].node;
                this.target._curChipBet = this.listChipBet[1];
                this.choseChip(1);

                break;
            case 2:
                if (this.oldIndex == 2) return;
                this._chipEffect = this.listButton[2].node;
                this.target._curChipBet = this.listChipBet[2];
                this.choseChip(2);

                break;
            case 3:
                if (this.oldIndex == 3) return;
                this._chipEffect = this.listButton[3].node;
                this.target._curChipBet = this.listChipBet[3];
                this.choseChip(3);

                break;
            case 4:
                if (this.oldIndex == 4) return;
                this._chipEffect = this.listButton[4].node;
                this.target._curChipBet = this.listChipBet[4];
                this.choseChip(4);

                break;
            default:
                cc.NGWlog('err chip===========================')
                break;
        }
    },
    choseChip(index) {
        this.listButton[index].node.scale = 1.2;
        //   this.imgChose.position = cc.v2(this.listButton[index].node.position.x , this.listButton[index].node.position.y -7.6 );
        this.imgChose.parent = this.listButton[index].node;
        if (this.oldIndex != null) {
            this.listButton[this.oldIndex].node.scale = 1;
        }
        this.oldIndex = index;
    },


    onClickDeal() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDeal_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (!this.target.isBetTime) return;
        require('SoundManager1').instance.playButton();
        //require('NetworkManager').getInstance().sendBetRoulette(this.target.listBet);
        
        this.resetLabel();
        this.target.sendBetServer();

    },
    onClickClear() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClear_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (!this.target.isBetTime) return;
        require('SoundManager1').instance.playButton();
        this.target.onClearbet();
        this.resetLabel();
        this.lbChip.string = require('GameManager').getInstance().formatMoney(this.target._totalMoneyBet);
    },

    resetLabel() {
        this.lbClear.string = '0';
        this.lbDeal.string = '0';
    },
    setlbChip() {
        this.lbClear.string = require('GameManager').getInstance().formatMoney(this.target._totalMoneyCurentBet);
        this.lbDeal.string = this.lbClear.string;
        this.lbChip.string = require('GameManager').getInstance().formatMoney(this.target._totalMoneyCurentBet + this.target._totalMoneyBet)
    },
    clearAllNextGame() {
        this.lbClear.string = '0';
        this.lbDeal.string = '0';
        this.lbChip.string = '0';

    },
    onClickRebet() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickRebet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (!this.target.isBetTime) return;
        require('SoundManager1').instance.playButton();
        // cc.NGWlog('tien con lai cua player la   ' +  (this.target.thisPlayer.ag - (this.target._totalMoneyCurentBet + this.target._totalMoneyBet)) + "=== ");

        // cc.NGWlog('tien con lai cua player la   ' + this.target._isLastTotalMoneyBet );
        // cc.NGWlog('tien con lai cua player la   ' +  this.target.thisPlayer.ag );
        // cc.NGWlog('tien con lai cua player la   ' + this.target._totalMoneyCurentBet );
        //   cc.NGWlog('tien con lai cua player la   ' + this.target._isLastTotalMoneyBet );
        if (this.target._totalMoneyCurentBet >= this.target.thisPlayer.ag) {
            require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'));
            return;
        }
        if((this.target._isLastTotalMoneyBet  + this.target._totalMoneyCurentBet + this.target._totalMoneyBet ) > this._isMaxBet ){
            require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('txt_maxBet').replace("%s", this._isMaxBet))  
            return;
        }
        this.btn_Rebet.interactable = false;
        this.target.onClickRebet();
    },
    onClickDouble() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDouble_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (!this.target.isBetTime) return;
        require('SoundManager1').instance.playButton();
        //  this.btn_Double.interactable = false;
        //  this.target.isDouble = true;
        this.target.onClickDouble();
    }

    // update (dt) {},
});