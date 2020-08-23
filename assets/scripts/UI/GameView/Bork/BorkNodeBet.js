const GameManager = require('GameManager')
// const NetworkManager = require('NetworkManager')

cc.Class({
    extends: cc.Component,
    // name: 'ShanPlusBgBet',

    properties: {

        lb_bet: [cc.Label],
        _Chip_Bet: 0,
        _cur_chip_slider: 0,
        _total_chip: 0,
        _chip_table_t: 0,
        chip_table_t: {
            get() {
                return this._chip_table_t
            },
            set(value) {
                this._chip_table_t = value;
                this._maxBet = value * 200;
                let stringTemp = value.toString();


                if (stringTemp[0] == '2') {
                    let valueTemp = value / 2;
                    this._listChipBet = [valueTemp, valueTemp * 5, valueTemp * 10, valueTemp * 50, valueTemp * 100];
                } else if ((stringTemp[0] == '5')) {
                    this._listChipBet = [value, value * 2, value * 10, value * 20, value * 100];
                } else {
                    this._listChipBet = [value, value * 5, value * 10, value * 50, value * 100];
                }
                let length = this._listChipBet.length;
                for (let i = 0; i < length; i++) {
                    this.lb_bet[i].string = require("GameManager").getInstance().formatMoney(this._listChipBet[i]);
                }

            }
        },
        _listChipBet: [],
        _maxBet: 0
    },
    onHide() {
        this.node.active = false;
    },

    onBtnBetClick(event, data) {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let num = parseInt(data)

        this._Chip_Bet = this._listChipBet[num];
        let curMoney = this.gameView.thisPlayer.ag;
        if (this._Chip_Bet > curMoney) this._Chip_Bet = curMoney;
        require('NetworkManager').getInstance().sendRaise(this._Chip_Bet);
        this.onHide();
    },


    onBtnAllinClick() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAllIn_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this._Chip_Bet = this._maxBet;
        let curMoney = this.gameView.thisPlayer.ag;
        if (this._Chip_Bet > curMoney) this._Chip_Bet = curMoney;
        require('NetworkManager').getInstance().sendRaise(this._Chip_Bet);
        this.onHide();
    },

});
