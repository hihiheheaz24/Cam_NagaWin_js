var Player = cc.Class({
    properties: {
        _playerView: null,
        // position_on_sv: 0,
        id: 0,
        fid: 0,
        pname: "",

        ag: {
            get() {
                return this._ag;
            },
            set(value) {
                this._ag = value;
                this.updateMoney();
            }
        },
        vip: 0,
        avatar_id: 0,
        avatar_url: "",
        is_ready: false,
        ip: "",
        is_turn: false,
        is_host: false,
        is_dealer: false,

        // TienLen
        point: 0,
        typeWin: -1,
        numberCard: 0,

        //Binh
        mauBinhSoBai: false,
        isSapLang: false,
        mauBinh_BL: false,
        mauBinh_M: 0,
        mauBinh_MB: 0,
        timeSwapCard: 0,
        totalPoint: 0,
        scoreChi1: 0,
        scoreChi2: 0,
        scoreChi3: 0,
        bonusChi1: 0,
        bonusChi2: 0,
        bonusChi3: 0,
        vectorChi1: {
            default: [],
            type: [require('Card')]
        },
        vectorChi2: {
            default: [],
            type: [require('Card')]
        },
        vectorChi3: {
            default: [],
            type: [require('Card')]
        },
        ////Binh//////

        vectorCard: {
            default: [],
            type: [require('Card')]
        },

        vectorCardD: {
            default: [],
            type: [require('Card')]
        },

        vectorCardP1: {
            default: [],
            type: [require('Card')]
        },
        vectorCardP2: {
            default: [],
            type: [require('Card')]
        },
        vectorCardP3: {
            default: [],
            type: [require('Card')]
        },
        isFold: false,
        _indexDynamic: null,
        _displayName: null,
        displayName: {
            get() {
                if (this._displayName == null) return this.pname;
                return this._displayName
            },
            set(value) {
                if (value != null && typeof value != 'undefined')
                    this._displayName = value;
            }
        },
    },
    updatePlayerView() {
        this.updateData();
        this.updateName();
        this.updateMoney();
        this.updateVip();
        this.updateAvatar();
        //  this.setReady();
        if (require('GameManager').getInstance().curGameId === GAME_ID.SIKUTHAI) {
            this.setReady(false);
        }
        // if (require('GameManager').getInstance().curGameId !== GAME_ID.SHAN2) {
        //     cc.NGWlog(' khong phai shan koe mee');
        //     this.setReady();
        // }
        //Huy: Auto update view for player view
        this._playerView.updatePlayerView();
    },
    updateData() {
        if (this._playerView != null)
            this._playerView.setData(this.id, this.pname, this.vip, this.ag, this.avatar_id, this.fid, this.displayName);
    },

    updateName() {
        // this._playerView.setName(this.pname);\

        if (this._playerView != null)
            this._playerView.setName(this.displayName);

    },
    updateMoney() {
        if (this._playerView != null)
            this._playerView.setAg(this.ag);
    },
    updateVip() {
        if (this._playerView != null)
            this._playerView.setVip(this.vip);
    },
    updateAvatar() {
        if (this._playerView != null)
            this._playerView.setAvatar(this.avatar_id, this.pname, this.fid);
    },

    setHost(isH) {
        this.is_host = isH;
        this._playerView.setHost(this.is_host);

        if (this.is_host)
            this.setReady(this.is_host);
    },

    setReady(isR) { // sao ko thêm biến vào như thế này luôn mà lại phải set is_ready bên ngoài
        if (this.is_host) {
            this.is_ready = true;
        }

        this.is_ready = isR; // Lộc mới thêm

        this._playerView.setReady(this.is_ready);

    },

    setDealer(isD, isRight) {
        this.is_dealer = isD;
    },
    setTurn(isTurn, timeTurn = 20, isEffect = false) {
        this.is_turn = isTurn;
        this._playerView.setTurn(this.is_turn, timeTurn, isEffect);
    },

    clearAllCard() {
        let poolCard = require('GameManager').getInstance().gameView.cardPool;

        for (let i = 0; i < this.vectorCard.length; i++) {
            poolCard.put(this.vectorCard[i].node);
        }
        this.vectorCard = [];
        for (let i = 0; i < this.vectorChi1.length; i++) {
            poolCard.put(this.vectorChi1[i].node);
        }
        this.vectorChi1 = [];

        for (let i = 0; i < this.vectorChi2.length; i++) {
            poolCard.put(this.vectorChi2[i].node);
        }
        this.vectorChi2 = [];

        for (let i = 0; i < this.vectorChi3.length; i++) {
            poolCard.put(this.vectorChi3[i].node);
        }
        this.vectorChi3 = [];

        for (let i = 0; i < this.vectorCardP1.length; i++) {
            poolCard.put(this.vectorCardP1[i].node);
        }
        this.vectorCardP1 = [];
        for (let i = 0; i < this.vectorCardP2.length; i++) {
            poolCard.put(this.vectorCardP2[i].node);
        }
        this.vectorCardP2 = [];
        for (let i = 0; i < this.vectorCardP3.length; i++) {
            poolCard.put(this.vectorCardP3[i].node);
        }
        this.vectorCardP3 = [];

        for (let i = 0; i < this.vectorCardD.length; i++) {
            poolCard.put(this.vectorCardD[i].node);
        }
        this.vectorCardD = [];

    },

    effectChangeMoney(moneyChange) {
        if (this._playerView !== null)
            this._playerView.effectChangeMoney(moneyChange);
    },
    numberEffect(numberChange) {
        this._playerView.numberEffect(this.ag, numberChange);
    },

    clearState() {
        this.typeWin = -1;
        this.point = 0;
        this.numberCard = 0;

        this.mauBinh_MB = 0;
        this.mauBinhSoBai = false;
        this.isSapLang = false;
        this.timeSwapCard = 0;

        this.clearAllCard();
    },

    clearVectorCardD() {
        let poolCard = require('GameManager').getInstance().gameView.cardPool;
        for (let i = 0; i < this.vectorCardD.length; i++) {
            poolCard.put(this.vectorCardD[i].node);
        }
        this.vectorCardD = [];
    },

});
module.exports = Player;