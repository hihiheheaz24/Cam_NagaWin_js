var GameView = require('GameView2')
var GameManager = require('GameManager').getInstance()
var LogicManager = require('LogicManager')
var Player = require('Player')

var SCALE_CARD = 0.85
var SCALE_CARD_OTHER = 0.6
var SCALE_CARD_DANH = 0.5
var DIS_CARD = 0.55

var TienLenGameView = cc.Class({
    extends: GameView,

    properties: {
        listPosCard: {
            default: [],
            type: [cc.Vec2]
        },

        listPosCardDanh: {
            default: [],
            type: [cc.Vec2]
        },

        btnMenu: {
            default: null,
            type: cc.Button
        },

        btnScreenShot: {
            default: null,
            type: cc.Button
        },

        btnQuickChat: {
            default: null,
            type: cc.Button
        },

        btnPass: {
            default: null,
            type: cc.Button
        },

        btnDiscard: {
            default: null,
            type: cc.Button
        },

        lbDiscard: {
            default: null,
            type: cc.Label
        },

        btnSort: {
            default: null,
            type: cc.Button
        },

        bgStartTime: {
            default: null,
            type: cc.Sprite
        },

        lbTimeStart: {
            default: null,
            type: cc.Label
        },

        lbNumberCard: {
            default: [],
            type: [cc.Label]
        },

        listSpritePass: {
            default: [],
            type: [cc.Sprite]
        },

        listBgScore: {
            default: [],
            type: [cc.Sprite]
        },

        listLbScore: {
            default: [],
            type: [cc.Label]
        },

        bgHint: {
            default: null,
            type: cc.Sprite
        },

        lbHint: {
            default: null,
            type: cc.Label
        },

        vtChipFinish: {
            default: [],
            visible: false,
            type: [cc.Node]
        },

        vtChipDenLang: {
            default: [],
            visible: false,
            type: [cc.Node]
        },

        listDataPlayerResult: {
            default: [],
            visible: false
        },

        cardSelect: {
            default: null,
            visible: false,
            type: require('Card')
        },

        listCardSuggest: {
            default: [],
            visible: false,
            type: [require('Card')]
        },

        numCardSelect: {
            default: 0,
            visible: false,
        },

        posDefaultCard: {
            default: cc.v2(0, 0),
            visible: false,
        },

        posTouchBegan: {
            default: cc.v2(0, 0),
            visible: false,
        },

        zOrderCard: {
            default: 0,
            visible: false,
        },

        sizeCardW: {
            default: 0,
            visible: false,
        },

        zIndexCardD: {
            default: 0,
            visible: false,
        },

        touched: {
            default: false,
            visible: false,
        },

        dangPhatBai: {
            default: false,
            visible: false,
        },

        turnNameCurrent: {
            default: "",
            visible: false,
        },

        lastTurnName: {
            default: "",
            visible: false,
        },

        timeToStart: {
            default: 0,
            visible: false
        },

        timeTurn: {
            default: 0,
            visible: false
        },

        typeSort: {
            default: 0,
            visible: false
        },

        playerSpecail: {
            default: null,
            visible: false,
            type: Player,
            serializable: false
        },

        aniCardSpecial: {
            default: null,
            type: sp.Skeleton
        },

        aniWinSpecial: {
            default: null,
            type: sp.Skeleton
        },

        aniStartGame: {
            default: null,
            type: sp.Skeleton
        },

        aniFinish: {
            default: null,
            type: sp.Skeleton
        },

        aniChayBai: {
            default: [],
            type: [sp.Skeleton]
        },

        lbNameWin: {
            default: null,
            type: cc.Label
        },

        avtSpecial: {
            default: null,
            type: cc.Sprite
        },

        black_cover: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad() { //// 
        this._super();
        var POS_CARD = this.listPosCard[0];
        let cardC = this.getCard();
        this.sizeCardW = cardC.node.getContentSize().width;

        this.isFinish = false;

        for (let i = 0; i < 4; i++) {
            this.lbNumberCard[i].node.zIndex = GAME_ZORDER.Z_CARD + 20;
            this.lbNumberCard[i].node.active = false;
            this.listSpritePass[i].node.active = false;
            this.listBgScore[i].node.active = false;
            this.aniChayBai[i].node.active = false;
            this.aniChayBai[i].node.zIndex = GAME_ZORDER.Z_EMO;
        }

        this.btnSort.node.active = false;
        this.btnPass.node.active = false;
        this.btnDiscard.node.active = false;

        this.bgStartTime.node.active = false;
        this.bgHint.node.active = false;

        this.aniCardSpecial.node.active = false;
        this.aniCardSpecial.node.zIndex = GAME_ZORDER.Z_EMO;
        this.aniWinSpecial.node.active = false;
        this.aniWinSpecial.node.zIndex = GAME_ZORDER.Z_EMO;
        this.aniFinish.node.active = false;
        this.aniFinish.node.zIndex = GAME_ZORDER.Z_EMO;
        this.aniStartGame.node.active = false;
        this.aniStartGame.node.zIndex = GAME_ZORDER.Z_EMO;

        this.typeSort = 2;

        this.fullScreen();

        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            cc.NGWlog("ON TOUCH BEGAN");
            if (this.touched || this.isFinish || this.dangPhatBai || !this.thisPlayer || this.stateGame !== STATE_GAME.PLAYING)
                return;

            this.posTouchBegan = cc.v2(touch.getLocation());

            for (let i = this.thisPlayer.vectorCard.length - 1; i >= 0; i--) {
                let card = this.thisPlayer.vectorCard[i];

                if (card.node.getBoundingBoxToWorld().contains(this.posTouchBegan) && card.isTouch) {
                    this.cardSelect = card;
                    this.posDefaultCard = card.node.position;
                    this.zOrderCard = card.node.zIndex;
                    this.touched = true;
                    let pos = card.node.position;
                    card.node.runAction(
                        cc.sequence(
                            cc.delayTime(0.2),
                            cc.spawn(
                                cc.scaleTo(0.2,1.1).easing(cc.easeCubicActionOut()),
                                cc.moveTo(0.2,cc.v2(pos.x,-260)),
                            )
                        )
                    );

                    cc.NGWlog("=======click card thứ %d ", this.zOrderCard - GAME_ZORDER.Z_CARD);
                    for(let j = i - 2; j <= i + 2; j++){
                        if(j >= 0 && j < this.thisPlayer.vectorCard.length && i != j){
                            if(j == i - 1 || j == i + 1){
                                let subCard = this.thisPlayer.vectorCard[j];
                                subCard.node.runAction(
                                    cc.sequence(
                                        cc.delayTime(0.2),
                                        cc.scaleTo(0.2,1.08).easing(cc.easeCubicActionOut()),
                                    )
                                )
                            }else{
                                let subCard = this.thisPlayer.vectorCard[j];
                                subCard.node.runAction(
                                    cc.sequence(
                                        cc.delayTime(0.2),
                                        cc.scaleTo(0.2,1).easing(cc.easeCubicActionOut()),
                                    )
                                )
                            }
                        }
                    }
                    
                    return;
                    
                }
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            if (!this.touched || this.isFinish || !this.thisPlayer || this.stateGame !== STATE_GAME.PLAYING) {
                this.cardSelect = null;
                return;
            }

            var indexC = this.thisPlayer.vectorCard.length / 2;
            var touchPos = cc.v2(touch.getLocation());

            var indexTemp = 0;
            for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
                if (this.thisPlayer.vectorCard[i] === this.cardSelect) {
                    indexTemp = i;
                    break;
                }
            }

            var disCard = this.sizeCardW * SCALE_CARD * DIS_CARD;

            if (this.thisPlayer.vectorCard.length % 2 == 0)
                var posXMin = POS_CARD.x - (disCard * (indexC + 1));
            else
                var posXMin = POS_CARD.x - (disCard * indexC);

            var posXMax = POS_CARD.x + (disCard * indexC);

            var posX = this.posDefaultCard.x + touchPos.x - this.posTouchBegan.x;
            var posY = POS_CARD.y;

            if (posX > posXMax)
                posX = posXMax;
            if (posX < posXMin)
                posX = posXMin;

            // this.cardSelect.node.stopAllActions();
            // this.cardSelect.node.runAction(cc.moveTo(0.2,cc.v2(posX, posY)).easing(cc.easeCubicActionOut()));
            // this.cardSelect.node.setPosition(cc.v2(posX, posY));
            this.cardSelect.node.x = posX;
            if (this.posTouchBegan.sub(touchPos).mag() >= this.sizeCardW * .25) {

                var index1Temp = indexTemp + 1;
                if (index1Temp < this.thisPlayer.vectorCard.length) {
                    var cardTemp = this.thisPlayer.vectorCard[index1Temp];
                    if (cardTemp.node.position.x < posX) {
                        this.cardSelect.node.zIndex = cardTemp.node.zIndex;
                        var posNew = cardTemp.node.position.x - disCard;
                        // cardTemp.node.stopAllActions();
                        cardTemp.node.runAction(cc.moveTo(0.2,cc.v2(posNew, posY)).easing(cc.easeCubicActionOut()));
                        
                        // cardTemp.node.setPosition(cc.v2(posNew, posY));
                        cardTemp.node.zIndex = this.cardSelect.node.zIndex - 1;

                        var tt = this.thisPlayer.vectorCard[indexTemp];
                        this.thisPlayer.vectorCard[indexTemp] = this.thisPlayer.vectorCard[index1Temp];
                        this.thisPlayer.vectorCard[index1Temp] = tt;
                        indexTemp++;
                        this.macBookCard(indexTemp);
                    }
                }

                var index2Temp = indexTemp - 1;
                if (index2Temp >= 0) {
                    var cardTemp = this.thisPlayer.vectorCard[index2Temp];

                    if (cardTemp.node.position.x > posX) {
                        this.cardSelect.node.zIndex = cardTemp.node.zIndex;
                        var posNew = cardTemp.node.position.x + disCard;
                        // cardTemp.node.stopAllActions();
                        cardTemp.node.runAction(cc.moveTo(0.2,cc.v2(posNew, posY)).easing(cc.easeCubicActionOut()));
                        
                        // cardTemp.node.setPosition(cc.v2(posNew, posY));
                        cardTemp.node.zIndex = this.cardSelect.node.zIndex + 1;

                        var tt = this.thisPlayer.vectorCard[indexTemp];
                        this.thisPlayer.vectorCard[indexTemp] = this.thisPlayer.vectorCard[index2Temp];
                        this.thisPlayer.vectorCard[index2Temp] = tt;
                        indexTemp--
                        this.macBookCard(indexTemp);
                    }
                }

                for (let j = 0; j < this.thisPlayer.vectorCard.length; j++) {
                    let tempCard = this.thisPlayer.vectorCard[j];
                    // tempCard.node.stopAllActions();
                    // tempCard.node.runAction(cc.scaleTo(0.2,SCALE_CARD).easing(cc.easeCubicActionOut()))
                    // tempCard.node.setScale(SCALE_CARD);
                }
                let scale = 1;
                // for (let j = indexTemp - 3; j <= indexTemp + 3; j++) {
                // // for (let j = 0; j < this.thisPlayer.vectorCard.length; j++) {
                //     if (j < 0 || j > this.thisPlayer.vectorCard.length - 1)
                //         continue;
                //     // let scale = 1;
                //     if (j < indexTemp)
                //         scale += 0.05;
                //     else if (j > indexTemp)
                //         scale -= 0.05;
                //     if (j === indexTemp)
                //         scale = 1.1;

                //     // if(j == indexTemp - 1 || j == indexTemp + 1){
                //     //     scale = 1.13;
                //     // }else if (j == indexTemp - 2 || j == indexTemp + 2){
                //     //     scale = 1.06;
                //     // }else if(j == indexTemp){
                //     //     scale = 1.2;
                //     // }else{
                //     //  scale = 0.8;   
                //     // }

                //     let tempCard = this.thisPlayer.vectorCard[j];
                //     // tempCard.node.stopAllActions();
                //     // tempCard.node.runAction(cc.scaleTo(0.2,scale).easing(cc.easeCubicActionOut()));
                //     // tempCard.node.setScale(SCALE_CARD * scale);
                //     // tempCard.node.setScale(scale);
                // }
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {

            cc.NGWlog("ON TOUCH ENDED");
            if (!this.touched || this.isFinish || !this.thisPlayer || this.stateGame !== STATE_GAME.PLAYING) {
                this.cardSelect = null;
                return;
            }

            this.touched = false;
            let touchPos = cc.v2(touch.getLocation());

            if (this.posTouchBegan.sub(touchPos).mag() <= this.sizeCardW * 0.2) {
                if (this.numCardSelect === 0 && this.lastTurnName !== "") {
                    this.suggestOnTouch(this.cardSelect, this.lastTurnName);

                    for (let i = 0; i < this.listCardSuggest.length; i++) {
                        for (let j = 0; j < this.thisPlayer.vectorCard.length; j++) {
                            var card = this.thisPlayer.vectorCard[j];

                            if (this.listCardSuggest[i] === card) {
                                var posX = card.node.position.x;
                                // card.node.stopAllActions();
                                card.node.runAction(cc.scaleTo(0.4,SCALE_CARD).easing(cc.easeCubicActionOut()));
                                card.node.runAction(cc.moveTo(0.2, cc.v2(posX, POS_CARD.y + 30)).easing(cc.easeCubicActionOut()));
                                card.isSelect = true;

                                this.numCardSelect++;
                                if (this.numCardSelect > this.thisPlayer.vectorCard.length)
                                    this.numCardSelect = this.thisPlayer.vectorCard.length;
                            }
                        }
                    }
                }
                else {
                    var posX = this.posDefaultCard.x;
                    if (this.cardSelect.isSelect) {
                        // this.cardSelect.node.stopAllActions();
                        this.cardSelect.node.runAction(cc.scaleTo(0.4,SCALE_CARD).easing(cc.easeCubicActionOut()));
                        this.cardSelect.node.runAction(cc.moveTo(0.2, cc.v2(posX, POS_CARD.y)).easing(cc.easeCubicActionOut()));
                        this.cardSelect.isSelect = false;

                        this.numCardSelect--;
                        if (this.numCardSelect <= 0)
                            this.numCardSelect = 0;
                    }
                    else {
                        // this.cardSelect.node.stopAllActions();
                        this.cardSelect.node.runAction(cc.scaleTo(0.4,SCALE_CARD).easing(cc.easeCubicActionOut()));
                        this.cardSelect.node.runAction(cc.moveTo(0.2, cc.v2(posX, POS_CARD.y + 30)).easing(cc.easeCubicActionOut()));
                        this.cardSelect.isSelect = true;

                        this.numCardSelect++;
                        if (this.numCardSelect > this.thisPlayer.vectorCard.length)
                            this.numCardSelect = this.thisPlayer.vectorCard.length;
                    }
                }

                cc.NGWlog("-=-=-=--==-=-==--==-=> Tienlen numCardSelect", this.numCardSelect);

                this.sortCardSelect();
                return;
            }

            // this.cardSelect.node.opacity = 255;
            this.cardSelect = null;
            this.windowCard();
            this.sortCardView();

        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            cc.NGWlog("ON TOUCH CANCEL");
            if (!this.touched || this.isFinish || !this.thisPlayer || this.stateGame !== STATE_GAME.PLAYING) {
                this.cardSelect = null;
                return;
            }

            this.touched = false;
            var touchPos = cc.v2(touch.getLocation());

            if (this.posTouchBegan.sub(touchPos).mag() <= this.sizeCardW * .25) {
                if (this.numCardSelect === 0 && this.lastTurnName !== "") {
                    this.suggestOnTouch(this.cardSelect, this.lastTurnName);

                    for (let i = 0; i < this.listCardSuggest.length; i++) {
                        for (let j = 0; j < this.thisPlayer.vectorCard.length; j++) {
                            let card = this.thisPlayer.vectorCard[j];

                            if (this.listCardSuggest[i] === card) {
                                let posX = card.node.position.x;
                                // card.node.stopAllActions();
                                card.node.runAction(cc.scaleTo(0.4,SCALE_CARD).easing(cc.easeCubicActionOut()));
                                card.node.runAction(cc.moveTo(0.2, cc.v2(posX, POS_CARD.y + 30)).easing(cc.easeCubicActionOut()));
                                card.isSelect = true;

                                this.numCardSelect++;
                                if (this.numCardSelect > this.thisPlayer.vectorCard.length)
                                    this.numCardSelect = this.thisPlayer.vectorCard.length;
                            }
                        }
                    }
                }
                else {
                    var posX = this.posDefaultCard.x;
                    if (this.cardSelect.isSelect) {
                        // this.cardSelect.node.stopAllActions();
                        this.cardSelect.node.runAction(cc.scaleTo(0.4,SCALE_CARD).easing(cc.easeCubicActionOut()));
                        this.cardSelect.node.runAction(cc.moveTo(0.2, cc.v2(posX, POS_CARD.y)).easing(cc.easeCubicActionOut()));
                        this.cardSelect.isSelect = false;

                        this.numCardSelect--;
                        if (this.numCardSelect <= 0)
                            this.numCardSelect = 0;
                    }
                    else {
                        // this.cardSelect.node.stopAllActions();
                        this.cardSelect.node.runAction(cc.scaleTo(0.4,SCALE_CARD).easing(cc.easeCubicActionOut()));
                        this.cardSelect.node.runAction(cc.moveTo(0.2, cc.v2(posX, POS_CARD.y + 30)).easing(cc.easeCubicActionOut()));
                        this.cardSelect.isSelect = true;

                        this.numCardSelect++;
                        if (this.numCardSelect > this.thisPlayer.vectorCard.length)
                            this.numCardSelect = this.thisPlayer.vectorCard.length;
                    }
                }

                cc.NGWlog("-=-=-=--==-=-==--==-=> Tienlen numCardSelect", this.numCardSelect);

                this.sortCardSelect();
                return;
            }

            // this.cardSelect.node.opacity = 255;
            this.cardSelect = null;
            this.sortCardView();
            this.windowCard();
        }, this);
    },

    macBookCard (index){
        for(let i = 0; i <= this.thisPlayer.vectorCard.length; i++){
            let scale = SCALE_CARD;
            let card = this.thisPlayer.vectorCard[i];
            if(i == index - 1 || i == index + 1){
                scale = 1.08;
            }
            if(i == index - 2 || i == index + 2){
                scale = 1;
            }
            if(card != null && i != index){
                card.node.runAction(cc.scaleTo(0.2,scale).easing(cc.easeCubicActionOut()));
            }
            if(i == index){
                card.node.setScale(1.1);
            }
        }
    },

    windowCard (){
        for(let i = 0; i < this.thisPlayer.vectorCard.length; i++){
            let card = this.thisPlayer.vectorCard[i];
            if(card != null){
                card.node.runAction(cc.scaleTo(0.2,SCALE_CARD).easing(cc.easeCubicActionOut()));
            }
        }
    },

    start() {

    },

    fullScreen() {
        this.node.setContentSize(cc.winSize);
    },

    suggestOnTouch(card, lastTurnName) {
        //    các case người phía trước đánh các bộ sau thì khi chọn bàn sẽ suggest:
        //    1. người phía trước đánh đôi, xám (không phải đôi 2)
        //    2. người phía trước đánh sảnh (bất kể sảnh gì nếu có sảnh bắt được thì bật gợi ý)

        var player = this.getPlayer(lastTurnName);

        this.listCardSuggest = [];

        if (!player)
            return;

        var vtCard = player.vectorCardD;
        var siC = vtCard.length;
        var typeCard = this.getTypeCard(vtCard);
        var targetCard = vtCard[siC - 1];

        switch (typeCard) {
            case TYPE_CARD_TIEN_LEN.TL_DOI:
            case TYPE_CARD_TIEN_LEN.TL_XAM:
                this.listCardSuggest = this.getlistDoiXam(card, typeCard, targetCard);
                break;
            case TYPE_CARD_TIEN_LEN.TL_SANH:
            case TYPE_CARD_TIEN_LEN.TL_TPS:
                this.listCardSuggest = this.getlistSanh(card, typeCard, siC, targetCard);
                break;
            case TYPE_CARD_TIEN_LEN.TL_NONE:
                this.listCardSuggest.push(card);
                break;
        }
    },

    getTypeCard(vtCard) {
        if (LogicManager.checkDoiTL(vtCard))
            return TYPE_CARD_TIEN_LEN.TL_DOI;
        else if (LogicManager.checkXamTL(vtCard))
            return TYPE_CARD_TIEN_LEN.TL_XAM;
        else if (LogicManager.ckeckThungPhaSanhTL(vtCard))
            return TYPE_CARD_TIEN_LEN.TL_TPS;
        else if (LogicManager.checkSanhTL(vtCard))
            return TYPE_CARD_TIEN_LEN.TL_SANH;
        else
            return TYPE_CARD_TIEN_LEN.TL_NONE;
    },

    getlistDoiXam(card, typeCard, targetCard) {
        let list = this.thisPlayer.vectorCard.slice();

        list.sort((x, y) => {
            var kq = x.S - y.S;
            if (kq === 0)
                kq = x.N - y.N;

            return kq;
        })

        var listSuggest = [];
        var index = 1;
        var dcown = 0

        listSuggest.push(card);

        if (card.N < targetCard.N && card.N !== 2)
            return listSuggest;

        if (card.N > targetCard.N && targetCard.N === 2)
            return listSuggest;

        for (let i = 0; i < list.length; i++) {
            if (list[i].N === card.N && list[i].code !== card.code) {
                listSuggest.push(list[i]);
                index++;
            }

            if (typeCard === TYPE_CARD_TIEN_LEN.TL_DOI && index === 2) {
                if (card.N == targetCard.N && targetCard.N > 5) {
                    for (let i = 0; i < listSuggest.length; i++) {
                        if (listSuggest[i].S < targetCard.S)
                            dcown++;
                    }
                }

                break;
            }
            else if (typeCard === TYPE_CARD_TIEN_LEN.TL_XAM && index === 3)
                break;
        }

        if ((typeCard === TYPE_CARD_TIEN_LEN.TL_DOI && index < 2) || (typeCard === TYPE_CARD_TIEN_LEN.TL_XAM && index < 3) || dcown === 2) {
            listSuggest = [];
            listSuggest.push(card);
        }

        return listSuggest;
    },

    getlistSanh(card, typeCard, size, targetCard) {
        let list = this.thisPlayer.vectorCard.slice();

        list.sort((x, y) => {
            var kq = x.N - y.N;
            if (kq === 0)
                kq = x.S - y.S;

            return kq;
        })

        var listSuggest = [];
        var indexAdd = 1;
        var indexSub = 1;
        var tempCard = null;

        listSuggest.push(card);

        for (let i = 0; i < list.length; i++) {
            if (list[i].S === card.S && list[i].N === card.N + indexAdd) {
                listSuggest.push(list[i]);
                indexAdd++;
            }

            if (indexAdd === size)
                break;
        }

        if (indexAdd !== size) {
            list.sort((x, y) => {
                var kq = y.N - x.N;
                if (kq === 0)
                    kq = x.S - y.S;

                return kq;
            })

            for (let i = 0; i < list.length; i++) {
                if (list[i].N === card.N - indexSub && list[i].S === card.S) {
                    listSuggest.push(list[i]);
                    indexSub++;
                }

                if (indexSub + indexAdd - 1 === size) {
                    listSuggest.sort((x, y) => {
                        return x.N - y.N;
                    })

                    break;
                }
            }
        }

        if (typeCard === TYPE_CARD_TIEN_LEN.TL_SANH) {
            if (listSuggest.length !== size || ((listSuggest[size - 1].N < targetCard.N) || (listSuggest[size - 1].N === targetCard.N && listSuggest[size - 1].S < targetCard.S && targetCard.N > 5))) {
                listSuggest = [];
                listSuggest.push(card);

                var indexAdd = 1;
                var indexSub = 1;
                var tempCard = null;

                list.sort((x, y) => {
                    var kq = x.N - y.N;
                    if (kq === 0)
                        kq = x.S - y.S;

                    return kq;
                })

                for (let i = 0; i < list.length; i++) {
                    if (list[i].N === card.N + indexAdd) {
                        listSuggest.push(list[i]);
                        indexAdd++;
                    }

                    if (indexAdd === size) {
                        tempCard = list[i];
                        for (let j = i + 1; j < list.length; j++) {
                            if (list[j].N === tempCard.N && list[j].S > tempCard.S) {
                                tempCard = list[j];
                                listSuggest.pop();
                                listSuggest.push(tempCard);
                            }
                        }

                        break;
                    }
                }

                if (indexAdd !== size) {
                    list.sort((x, y) => {
                        var kq = y.N - x.N;
                        if (kq === 0)
                            kq = x.S - y.S;

                        return kq;
                    })

                    for (let i = 0; i < list.length; i++) {
                        if (list[i].N === card.N - indexSub) {
                            listSuggest.push(list[i]);
                            indexSub++;
                        }

                        if (indexSub + indexAdd - 1 === size)
                            break;
                    }
                }

                if (listSuggest.length === size) {
                    listSuggest.sort((x, y) => {
                        return x.N - y.N;
                    })

                    tempCard = listSuggest[size - 1];
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].N === tempCard.N && list[i].S > tempCard.S) {
                            tempCard = list[i];
                            listSuggest.pop();
                            listSuggest.push(tempCard);
                        }
                    }
                }
            }
        }

        if (listSuggest.length !== size) {
            listSuggest = [];
            listSuggest.push(card);
        }
        else {
            listSuggest.sort((x, y) => {
                return x.N - y.N;
            })

            if ((listSuggest[size - 1].N < targetCard.N) || (listSuggest[size - 1].N === targetCard.N && listSuggest[size - 1].S < targetCard.S && targetCard.N > 5)) {
                listSuggest = [];
                listSuggest.push(card);
            }
        }

        return listSuggest;
    },

    handleSTable(strData, time) {
        this._super(strData);

        this.countDownTimeToStart(time);
    },

    handleVTable(strData) {
        this._super(strData);

        this.connectGame(strData);
    },

    handleRJTable(strData) {
        this._super(strData);

        this.connectGame(strData);
    },

    connectGame(strData) {
        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;

        for (let i = 0; i < listPlayer.length; i++) {
            var player = this.getPlayer(listPlayer[i].N);

            for (let j = 0; j < listPlayer[i].Arr.length; j++) {
                let card = this.getCard();
                card.decodeCard(listPlayer[i].Arr[j]);
                player.vectorCard.push(card);
            }
        }

        this.turnNameCurrent = data.CN;
        this.lastTurnName = data.lp;
        this.timeTurn = data.T;
        var player = this.getPlayer(data.lp);
        if (player) {
            for (let i = 0; i < data.CardsInTurn.length; i++) {
                let card = this.getCard();
                card.decodeCard(data.CardsInTurn[i]);
                player.vectorCardD.push(card);
            }
        }

        this.initPlayerCard();
        this.setTurn(this.turnNameCurrent, data.CT);
    },

    handleJTable(strData, time) {
        this._super(strData);

        this.countDownTimeToStart(time);
    },

    handleLTable(data) {
        this._super(data);

        if (this.players.length <= 1)
            this.countDownTimeToStart(0);
    },

    onClickBoLuot() {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBoLuot_%s", require('GameManager').getInstance().getCurrentSceneName()));
        cc.NGWlog("=---=-=-=-=-=-==-=-=-=-=-=-==-=-> Tienlen pass");
        require('NetworkManager').getInstance().sendBoLuotTienLen();
    },

    onClickDanhBai() {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDanhBai_%s", require('GameManager').getInstance().getCurrentSceneName()));
        var vtCard = [];
        for (var i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            if (this.thisPlayer.vectorCard[i].isSelect) {
                cc.NGWlog("-=-==--=-=-=-=-=-==---=-=-=->>>>>>>>> Tienlen: " + this.thisPlayer.vectorCard[i].nameCard);
                vtCard.push(this.thisPlayer.vectorCard[i].code);
            }
        }

        cc.NGWlog("-=-==--=-=-=-=-=-==---=-=-=->>>>>>>>> Tienlen size: " + vtCard.length);

        require('NetworkManager').getInstance().sendDanhBaiTienLen(vtCard);
    },

    onClickSortCard(e, data) {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
        if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSortCard_%s", require('GameManager').getInstance().getCurrentSceneName()));
        cc.NGWlog("=---=-=-=-=-=-==-=-=-=-=-=-==-=-> Tienlen sort");
        this.typeSort = (this.typeSort + 1) % 3;

        if (this.typeSort === 0) {
            this.thisPlayer.vectorCard.sort((x, y) => {
                var kq = x.N - y.N;
                if (kq === 0)
                    kq = x.S - y.S;

                return kq;
            });
        }
        else if (this.typeSort === 1) {
            this.thisPlayer.vectorCard.sort((x, y) => {
                var kq = y.N - x.N;
                if (kq === 0)
                    kq = x.S - y.S;

                return kq;
            });
        }
        else {
            this.thisPlayer.vectorCard.sort((x, y) => {
                var kq = x.S - y.S;
                if (kq === 0)
                    kq = x.N - y.N;

                return kq;
            });
        }
        this.sortCard();

        this.node.runAction(cc.sequence(cc.callFunc(() => {
            this.btnSort.interactable = false;
        }), cc.delayTime(0.3), cc.callFunc(() => {
            this.btnSort.interactable = true;
        })));
    },

    initPlayerCard() {
        if (this.stateGame === STATE_GAME.PLAYING) {
            cc.NGWlog("--=-=-==-=--=-=-=-=-=-=-=>>>>>>> Tienlen vào đây chưa em ơi");
            this.btnSort.node.active = true;
            this.btnSort.enable = true;
            this.btnSort.interactable = true;

            cc.NGWlog("--=-=-==-=--=-=-=-=-=-=-=>>>>>>> Tienlen ten palyer cu ->>>" + this.turnNameCurrent);
            if (this.turnNameCurrent === this.thisPlayer.pname) {
                this.btnPass.node.active = true;
                this.btnDiscard.node.active = true;

                this.btnPass.enable = true;
                this.btnDiscard.enable = true;
                this.btnPass.interactable = true;
                this.btnDiscard.interactable = true;
            }
        }

        var index = parseInt(this.thisPlayer.vectorCard.length / 2 * -1);
        cc.NGWlog("=-=-=-=-=--=-=-=-=-==--=-=-=-=-=-=-==> Tienlen index : " + index);

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            var siC = player.vectorCard.length;
            var siD = player.vectorCardD.length;
            player.numberCard = siC;

            var idexPos = this.getDynamicIndex(this.getIndexOf(player));
            var posC = this.listPosCard[idexPos];
            var posCardD = this.listPosCardDanh[idexPos];

            if (idexPos === 0 || idexPos === 2)
                posCardD = posCardD.sub(cc.v2(this.sizeCardW * SCALE_CARD_DANH * DIS_CARD * siD / 2, 0));
            else if (idexPos === 1)
                posCardD = posCardD.sub(cc.v2(this.sizeCardW * SCALE_CARD_DANH * DIS_CARD * siD, 0));

            for (let j = 0; j < siC; j++) {
                var card = player.vectorCard[j];
                card.node.active = true;
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD + j);
                card.setTextureWithCode(card.code);

                if (player === this.thisPlayer) {
                    cc.NGWlog("==----------------=============>>> Tienlen abc " + this.sizeCardW * SCALE_CARD * DIS_CARD * index);
                    var posCard = this.listPosCard[0].add(cc.v2(this.sizeCardW * SCALE_CARD * DIS_CARD * index, 0));
                    card.node.setScale(SCALE_CARD);
                    card.node.setPosition(posCard.x, posCard.y);
                    cc.NGWlog("--=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=>>>>>>> Tienlen poscard: " + posCard);
                    index++;
                    cc.NGWlog("=-=-=-=-=--=-=-=-=-==--=-=-=-=-=-=-==> Tienlen index : " + index);
                }
                else {
                    card.node.setScale(SCALE_CARD_OTHER);
                    card.node.setPosition(posC.x, posC.y);
                }
            }

            if (player !== this.thisPlayer) {
                this.lbNumberCard[idexPos].string = player.numberCard.toString();
                if (require('ConfigManager').getInstance().agSauCacTL >= this.agTable)
                    this.lbNumberCard[idexPos].node.active = true;
            }

            for (let j = 0; j < player.vectorCardD.length; j++) {
                var card = player.vectorCardD[j];
                posCardD = posCardD.add(cc.v2(this.sizeCardW * SCALE_CARD_DANH * 0.45, 0));

                card.node.active = true;
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD + j);
                card.setTextureWithCode(card.code);
                card.node.setScale(SCALE_CARD_DANH);
                card.node.setPosition(posCardD.x, posCardD.y);
            }
        }

        if (this.stateGame === STATE_GAME.PLAYING) {
            this.onClickSortCard();
        }
    },

    countDownTimeToStart(time) {
        this.timeToStart = parseInt(time);

        if (this.timeToStart <= 0 || this.players.length <= 1) {
            this.lbTimeStart.node.stopAllActions();
            this.bgStartTime.node.active = false;
            return;
        }
        else {
            this.bgStartTime.node.active = true;
            this.lbTimeStart.string = this.timeToStart.toString();

            if (this.timeToStart > 0) {
                this.bgStartTime.node.active = true;
                this.lbTimeStart.node.stopAllActions();

                let sq = cc.sequence(cc.delayTime(1), cc.callFunc(() => {
                    this.timeToStart--;
                    this.lbTimeStart.string = this.timeToStart.toString();
                    if (this.timeToStart <= 0) {
                        this.lbTimeStart.node.stopAllActions();
                        this.bgStartTime.node.active = false;
                        return;
                    }
                }));

                let rp = cc.repeat(sq, this.timeToStart);

                this.lbTimeStart.node.runAction(rp);
            }
        }
    },

    beforeStartGame() {
        this.sendTrackingGame();
        this.stateGame = STATE_GAME.PLAYING;
        this.typeSort = 2;
        this.turnNameCurrent = "";
        this.lastTurnName = "";
        this.playerSpecail = null;
        this.listCardSuggest = [];
        this.isFinish = false;

        this.zIndexCardD = GAME_ZORDER.Z_CARD + 10;

        for (let i = 0; i < this.players.length; i++)
            this.players[i].clearState();

        this.updatePositionPlayerView();
    },

    startGame(data) {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/start_game');
        this.beforeStartGame();

        this.aniStartGame.node.active = true;
        this.aniStartGame.setAnimation(0, "animation", false);

        this.bgStartTime.node.active = false;
        var arr = data.arr;

        this.timeTurn = data.T;
        this.turnNameCurrent = data.nameturn;
        var firtRound = data.firstRound;

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            player.vectorCard = [];

            for (let j = 0; j < arr.length; j++) {
                let card = this.getCard();
                card.node.setScale(SCALE_CARD_OTHER);
                card.setTextureWithCode(0);
                card.node.active = false;
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD - j);
                card.node.setPosition(0, 0);

                if (player === this.thisPlayer)
                    card.decodeCard(arr[j]);

                player.vectorCard.push(card);
            }

            if (player === this.thisPlayer)
                player.numberCard = 13;
            else
                player.numberCard = 0;
        }

        var action = cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            this.chiaBai();
        }), cc.delayTime(2.8), cc.callFunc(() => {

            require('HandleGamePacket').NextEvt();
            this.dangPhatBai = false;

            this.onClickSortCard();
            this.setTurn(this.turnNameCurrent, this.timeTurn);

            if (this.turnNameCurrent === this.thisPlayer.pname && firtRound) {
                this.bgHint.node.active = true;

                var scale = cc.scaleTo(0.25, 1.1);
                var scale1 = cc.scaleTo(0.25, 0.9);
                var sq = cc.sequence(scale, scale1);
                var rp = cc.repeat(sq, 6);

                this.bgHint.node.runAction(cc.sequence(rp, cc.callFunc(() => {
                    this.bgHint.node.active = false;
                })));
            }

            if (this.turnNameCurrent === this.thisPlayer.pname) {
                this.btnDiscard.node.active = true;
                this.btnDiscard.enable = true;
                this.btnDiscard.interactable = true;

                this.btnDiscard.node.position = cc.v2(0, this.btnDiscard.node.position.y);
                this.lbDiscard.string = require('GameManager').getInstance().getTextConfig('siku_discard');
            }

            this.btnSort.node.active = true;
            this.btnSort.enable = true;
            this.btnSort.interactable = true;
        }));

        this.node.runAction(action);
    },

    chiaBai() {
        this.aniStartGame.node.active = false;
        this.dangPhatBai = true;
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            let idex = this.getDynamicIndex(this.getIndexOf(player));
            var posCard = this.listPosCard[idex];

            var timedelay = 0;
            var index = -6;

            for (let id = 0; id < player.vectorCard.length; id++) {
                let card = player.vectorCard[id];
                card.node.active = true;
                card.node.rotation = -90;
                if (player === this.thisPlayer) {
                    posCard = this.listPosCard[0].add(cc.v2(this.sizeCardW * SCALE_CARD * DIS_CARD * index, 0));

                    let move = cc.moveTo(0.4, posCard).easing(cc.easeCubicActionOut());
                    let scale = cc.scaleTo(0.4, SCALE_CARD);
                    let rota = cc.rotateTo(0.3, 0);
                    // let rota = cc.rotateBy(0.3, 360);
                    let ac = cc.callFunc(() => {
                        card.node.zIndex = GAME_ZORDER.Z_CARD + id;
                    });

                    let spawn = cc.spawn(move, ac, scale, rota);
                    let scale1 = cc.spawn(
                        cc.scaleTo(0.15, 0, SCALE_CARD),
                        cc.skewTo(0.15,0,-20),
                    );
                    let scale2 = cc.spawn(
                        cc.scaleTo(0.15, SCALE_CARD, SCALE_CARD),
                        cc.skewTo(0.15,0,0)
                    );

                    card.node.runAction(cc.sequence(cc.delayTime(timedelay), spawn, scale1, cc.callFunc(() => {
                        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/deal_onecard');
                        card.setTextureWithCode(card.code);
                        card.node.skewY = 20;
                    }), scale2));

                    index++;
                }
                else {
                    let move = cc.moveTo(0.2, posCard).easing(cc.easeCubicActionInOut());
                    let ac = cc.callFunc(() => {
                        card.node.zIndex = GAME_ZORDER.Z_CARD + id;
                    });
                    // let rota = cc.rotateBy(0.3, 360);
                    let rota = cc.rotateTo(0.3, 0);
                    let spawn = cc.spawn(move, ac, rota);
                    card.node.runAction(cc.sequence(cc.delayTime(timedelay), spawn, cc.callFunc(() => {
                        player.numberCard++;
                        this.lbNumberCard[idex].string = player.numberCard.toString();
                        if (require('ConfigManager').getInstance().agSauCacTL >= this.agTable)
                            this.lbNumberCard[idex].node.active = true;
                    })));
                }

                timedelay += 0.15;
            }
        }
    },

    danhBai(turnName, nextTurn, vtCard, newTurn) {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/deal_onecard');
        var player = this.getPlayer(turnName);
        this.turnNameCurrent = nextTurn;
        this.lastTurnName = turnName;

        if (this.turnNameCurrent === this.thisPlayer.pname)
            this.dangPhatBai = true;

        this.aniCardSpecial.node.active = false;
        this.aniCardSpecial.node.zIndex = 1001;

        for (let i = 0; i < this.players.length; i++)
            this.players[i].clearVectorCardD();

        if (player === this.thisPlayer) {
            this.btnPass.node.active = false;
            this.btnDiscard.node.active = false;
        }

        if (player === this.thisPlayer) {
            for (let i = 0; i < vtCard.length; i++) {
                for (let j = 0; j < this.thisPlayer.vectorCard.length; j++) {
                    if (this.thisPlayer.vectorCard[j].code === vtCard[i]) {
                        let card = this.thisPlayer.vectorCard[j];
                        card.isTouch = false;
                        player.vectorCardD.push(card);
                        player.vectorCard.splice(j, 1);
                        break;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < vtCard.length; i++) {
                let card = player.vectorCard[0];
                card.decodeCard(vtCard[i]);
                card.setTextureWithCode(card.code);

                player.vectorCardD.push(card);
                player.vectorCard.splice(0, 1);
            }
        }

        player.numberCard -= vtCard.length;

        var timedelay = 0;
        var indexPos = this.getDynamicIndex(this.getIndexOf(player));
        var posCardD = this.listPosCardDanh[indexPos];

        if (indexPos === 0 || indexPos === 2)
            posCardD = posCardD.sub(cc.v2(this.sizeCardW * SCALE_CARD_DANH * (DIS_CARD / 2) * (vtCard.length - 1), 0));
        else if (indexPos === 1)
            posCardD = posCardD.sub(cc.v2(this.sizeCardW * SCALE_CARD_DANH * DIS_CARD * vtCard.length, 0));


        if (LogicManager.check3DoiThong(player.vectorCardD)
            || LogicManager.check4DoiThong(player.vectorCardD)
            || LogicManager.checkTuQuy(player.vectorCardD)
            || LogicManager.checkSetOfTwos(player.vectorCardD)) {
            var posC = cc.v2(0, -20);
            posC = posC.sub(cc.v2(this.sizeCardW * (DIS_CARD / 2) * (vtCard.length - 1), 0));
           // this.showBlackCover();
            for (let i = 0; i < player.vectorCardD.length; i++) {
                let card = player.vectorCardD[i];
                let code = card.code;
                card.setTextureWithCode(0);
                card.node.zIndex = 1000;
                // card.node.zIndex = this.zIndexCardD;
                card.isTouch = false;
                
                this.zIndexCardD++;
                let move1 = cc.moveTo(0.5, posC).easing(cc.easeCubicActionOut());
                // let scale = cc.scaleTo(0.15, 1);
                // let spawn = cc.spawn(scale, move1);

                card.node.runAction(cc.sequence(cc.delayTime(timedelay), move1));
                this.showSpecialCard(card.node,code,timedelay);
                timedelay += 0.05;
                posC = posC.add(cc.v2(this.sizeCardW * DIS_CARD, 0));
            }
            this.setTimeout(() => {
                this.hideBlackCover();
            }, timedelay + 2000);

            this.node.runAction(cc.sequence(cc.delayTime(timedelay + 0.1), cc.callFunc(() => {
                this.dangPhatBai = false;
                if (LogicManager.check3DoiThong(player.vectorCardD)) {
                    this.aniCardSpecial.node.active = true;
                    this.aniCardSpecial.setAnimation(0, "3 consecutive pairs", true);
                }
                else if (LogicManager.check4DoiThong(player.vectorCardD)) {
                    this.aniCardSpecial.node.active = true;
                    this.aniCardSpecial.setAnimation(0, "4 consecutive pairs", true);
                }
                else if (LogicManager.checkTuQuy(player.vectorCardD)) {
                    this.aniCardSpecial.node.active = true;
                    this.aniCardSpecial.setAnimation(0, "4 of a kind", true);
                }
                else if (LogicManager.checkSetOfTwos(player.vectorCardD)) {
                    this.aniCardSpecial.node.active = true;
                    this.aniCardSpecial.setAnimation(0, "set of twos", true);
                }

                if (player === this.thisPlayer)
                    this.sortCardView();
                else {
                    this.lbNumberCard[indexPos].string = player.numberCard.toString();
                    if (player.numberCard === 0)
                        this.lbNumberCard[indexPos].node.active = false;
                }

            }), cc.delayTime(2), cc.callFunc(() => {
                for (let i = 0; i < player.vectorCardD.length; i++) {
                    let card = player.vectorCardD[i];
                    card.node.zIndex = this.zIndexCardD;

                    this.zIndexCardD++;

                    let move1 = cc.moveTo(0.2, posCardD).easing(cc.easeCubicActionInOut());
                    let scale = cc.scaleTo(0.15, SCALE_CARD_DANH);
                    let spawn = cc.spawn(scale, move1);

                    card.node.runAction(spawn);
                    posCardD = posCardD.add(cc.v2(this.sizeCardW * SCALE_CARD_DANH * DIS_CARD, 0));
                }

                this.setTurn(this.turnNameCurrent, this.timeTurn - 2);
                if (this.turnNameCurrent === this.thisPlayer.pname) {
                    this.btnPass.node.active = true;
                    this.btnDiscard.node.active = true;

                    this.btnPass.enable = true;
                    this.btnDiscard.enable = true;
                    this.btnPass.interactable = true;
                    this.btnDiscard.interactable = true;

                    this.btnDiscard.node.position = cc.v2(140, this.btnDiscard.node.position.y);
                    this.lbDiscard.string = require('GameManager').getInstance().getTextConfig('txt_beat');
                    this.sortCardSelect();
                }
                this.aniCardSpecial.node.active = false;
            }), cc.delayTime(0.2), cc.callFunc(() => {
                require('HandleGamePacket').NextEvt();
            })));
        }
        else {
            for (let i = 0; i < player.vectorCardD.length; i++) {
                let card = player.vectorCardD[i];
                card.node.zIndex = this.zIndexCardD;
                card.isTouch = false;

                this.zIndexCardD++;

                let move1 = cc.moveTo(0.2, posCardD).easing(cc.easeCubicActionInOut());
                let scale = cc.scaleTo(0.15, SCALE_CARD_DANH);
                let spawn = cc.spawn(scale, move1);

                card.node.runAction(cc.sequence(cc.delayTime(timedelay), spawn));
                timedelay += 0.03;
                posCardD = posCardD.add(cc.v2(this.sizeCardW * SCALE_CARD_DANH * DIS_CARD, 0));
            }

            this.node.runAction(cc.sequence(cc.delayTime(timedelay + 0.1), cc.callFunc(() => {
                this.dangPhatBai = false;
                require('HandleGamePacket').NextEvt();
                if (player === this.thisPlayer)
                    this.sortCardView();
                else {
                    this.lbNumberCard[indexPos].string = player.numberCard.toString();
                    if (player.numberCard === 0)
                        this.lbNumberCard[indexPos].node.active = false;
                }

                this.setTurn(this.turnNameCurrent, this.timeTurn);

                if (this.turnNameCurrent === this.thisPlayer.pname) {
                    this.btnPass.node.active = true;
                    this.btnDiscard.node.active = true;

                    this.btnPass.enable = true;
                    this.btnDiscard.enable = true;
                    this.btnPass.interactable = true;
                    this.btnDiscard.interactable = true;

                    this.btnDiscard.node.position = cc.v2(140, this.btnDiscard.node.position.y);
                    this.lbDiscard.string = require('GameManager').getInstance().getTextConfig('txt_beat');
                    this.sortCardSelect();
                }
            })));
        }
    },

    showSpecialCard (card,code,delay){
        card.zIndex = 1000;
        card.runAction(
            cc.sequence(
                cc.delayTime(delay),
                cc.spawn(
                    cc.scaleTo(0.15,0.01,1.2),
                    cc.skewTo(0.15,0,-15),
                ),
                cc.callFunc(()=>{
                    card.skewY = 15;
                    card.getComponent('Card').setTextureWithCode(code);
                }),
                cc.spawn(
                    cc.scaleTo(0.15,1.2),
                    cc.skewTo(0.15,0,0),
                ),
                cc.delayTime(0.1),
                cc.scaleTo(0.2,1).easing(cc.easeCubicActionIn()),
                cc.delayTime(0.2),
                
            )
        )
    },

    showBlackCover (){
        this.hideBlackCover();
        let black = cc.instantiate(this.black_cover);
        this.node.addChild(black,999,'cover');
    },

    hideBlackCover (){
        let oldCV = this.node.getChildByName('cover');
        if(oldCV != null){
            oldCV.runAction(
                cc.sequence(
                    cc.fadeOut(0.4),
                    cc.callFunc(()=>{
                        if(oldCV != null){
                            oldCV.destroy();
                        }
                    })
                )
            )
        }
    },

    boLuot(turnName, nextTurn, newTurn) {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/fold');
        var player = this.getPlayer(turnName);
        this.turnNameCurrent = nextTurn;

        if (player === this.thisPlayer) {
            this.btnPass.node.active = false;
            this.btnDiscard.node.active = false;
        }

        if (newTurn) {
            if (this.turnNameCurrent === this.thisPlayer.pname) {
                this.btnDiscard.node.active = true;
                this.btnDiscard.enable = true;
                this.btnDiscard.interactable = true;

                this.btnDiscard.node.position = cc.v2(0, this.btnDiscard.node.position.y);
                this.lbDiscard.string = require('GameManager').getInstance().getTextConfig('siku_discard');
            }

            for (let i = 0; i < this.players.length; i++)
                this.players[i].clearVectorCardD();

            this.lastTurnName = "";
            this.aniCardSpecial.node.active = false;

            for (let i = 0; i < this.listSpritePass.length; i++)
                this.listSpritePass[i].node.active = false;

            this.zIndexCardD = GAME_ZORDER.Z_CARD + 10;
        }
        else {
            if (this.turnNameCurrent === this.thisPlayer.pname) {
                this.btnPass.node.active = true;
                this.btnDiscard.node.active = true;

                this.btnPass.enable = true;
                this.btnDiscard.enable = true;
                this.btnPass.interactable = true;
                this.btnDiscard.interactable = true;

                this.btnDiscard.node.position = cc.v2(140, this.btnDiscard.node.position.y);
                this.lbDiscard.string = require('GameManager').getInstance().getTextConfig('txt_beat');
            }

            var sp = this.listSpritePass[this.getDynamicIndex(this.getIndexOf(player))];

            sp.node.active = true;
            sp.node.setScale(0);

            sp.node.runAction(cc.scaleTo(0.2, 1));
        }

        this.setTurn(this.turnNameCurrent, this.timeTurn);
    },

    cutCard(nameLose, agPlayerLose, nameWin, agPlayerWin, agCut) {
        cc.NGWlog('!> cut card');
        var playerWin = this.getPlayer(nameWin);
        var playerLose = this.getPlayer(nameLose);

        playerWin.ag = agPlayerWin;
        playerLose.ag = agPlayerLose;

        playerWin._playerView.effectFlyMoney(agCut);
        playerLose._playerView.effectFlyMoney(-agCut);

        playerWin.updateMoney();
        playerLose.updateMoney();
    },

    danhBaiError(data) {
        GameManager.onShowToast(data);
        this.sortCardView();
    },

    handleFinishGame() {
        this._super();

        for (let i = 0; i < this.vtChipFinish.length; i++)
            this.vtChipFinish[i].destroy();
        this.vtChipFinish = [];

        for (let i = 0; i < this.vtChipDenLang.length; i++)
            this.vtChipDenLang[i].destroy();
        this.vtChipDenLang = [];

        this.countDownTimeToStart(5);

        this.aniFinish.node.active = false;
        require('HandleGamePacket').NextEvt();
        if (cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
    },

    finishGameTienLen(strData) {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/alert');
        this.isFinish = true;

        var data = JSON.parse(strData);
        this.finishData = data;
        this.listDataPlayerResult = [];

        this.aniFinish.node.active = true;
        this.aniFinish.setAnimation(0, "animation", true);
        this.aniCardSpecial.node.active = false;

        for (let i = 0; i < data.length; i++) {
            var dataPlayer = data[i];
            var player = this.getPlayer(dataPlayer.N);

            if (player === null)
                continue;

            let playerData = {};

            player.M = dataPlayer.M;
            //   player.ag = dataPlayer.AG;
            player.point = dataPlayer.point;
            player.typeWin = dataPlayer.TypeWin;
            playerData.lstDenLang = dataPlayer.lstDenLang;
            playerData.name = dataPlayer.N;
            this.listDataPlayerResult.push(playerData);

            var arrC = dataPlayer.ArrCard;
            for (let id = 0; id < arrC.length; id++)
                player.vectorCard[id].decodeCard(arrC[id]);

            if (player.typeWin > 0) {
                this.playerSpecail = new Player();
                this.playerSpecail.pname = player.displayName;
                this.playerSpecail.avatar_id = player.avatar_id;
                this.playerSpecail.avatar_url = player.avatar_url;
                this.playerSpecail.typeWin = player.typeWin;
                this.playerSpecail.fid = player.fbid

                for (let id = 0; id < arrC.length; id++) {
                    let card = this.getCard();
                    card.decodeCard(arrC[id]);
                    card.node.setScale(SCALE_CARD);
                    this.playerSpecail.vectorCard.push(card);
                }

                cc.NGWlog("-=--==--=-=-==--=-=--=----=-=--=-==-=>>>>>>> Tienlen win special: " + this.playerSpecail.vectorCard);
            }
        }

        if (this.playerSpecail)
            this.node.stopAllActions();

        var actions = [];
        actions.push(cc.delayTime(0.5));
        actions.push(cc.callFunc(() => {
            this.prepareFinish();
        }));
        actions.push(cc.delayTime(1));

        if (this.playerSpecail) {
            actions.push(cc.callFunc(() => {
                this.TienLenCardSpecial();
            }));
            actions.push(cc.delayTime(2.5));
            actions.push(cc.callFunc(() => {
                this.showCard();
            }));
            actions.push(cc.delayTime(2.5));
        }
        else {
            actions.push(cc.callFunc(() => {
                this.showCard();
            }));
            actions.push(cc.delayTime(4));
        }

        actions.push(cc.callFunc(() => {
            this.showExchangeMoney();
        }));
        actions.push(cc.delayTime(4));
        actions.push(cc.callFunc(() => {
            this.handleFinishGame();
        }));

        let sq = cc.sequence(actions);
        this.node.runAction(sq);
    },

    prepareFinish() {
        this.bgHint.node.active = false;
        this.btnSort.node.active = false;
        this.btnPass.node.active = false;
        this.btnDiscard.node.active = false;

        this.turnNameCurrent = "";
        this.lastTurnName = "";
        this.setTurn(this.turnNameCurrent);

        for (let i = 0; i < this.lbNumberCard.length; i++)
            this.lbNumberCard[i].node.active = false;

        for (let i = 0; i < this.listSpritePass.length; i++)
            this.listSpritePass[i].node.active = false;

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            var siC = player.vectorCard.length;


            for (let id = 0; id < siC; id++) {
                var card = player.vectorCard[id];
                card.node.active = false;
                card.isTouch = false;
            }

            player.clearVectorCardD();
        }
    },

    showCard() {
        this.aniWinSpecial.node.active = false;
        this.aniFinish.node.active = false;

        if (this.playerSpecail) {
            this.playerSpecail.clearAllCard();
            this.playerSpecail = null;
        }

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            var siC = player.vectorCard.length;
            var idexPos = this.getDynamicIndex(this.getIndexOf(player));
            var posC = this.listPosCard[idexPos];

            if (siC === 0 || player.typeWin > 0)
                continue;

            this.listBgScore[idexPos].node.active = true;
            this.listLbScore[idexPos].string = player.point.toString();

            if (idexPos === 0)
                posC = posC.sub(cc.v2(this.sizeCardW * SCALE_CARD * DIS_CARD * siC / 2, 0));
            else if (idexPos === 1 || idexPos === 2)
                posC = posC.sub(cc.v2(this.sizeCardW * SCALE_CARD_OTHER * 0.45 * (siC - 1), 0));

            for (let id = 0; id < siC; id++) {
                var card = player.vectorCard[id];
                card.node.zIndex = GAME_ZORDER.Z_CARD + id;
                card.node.active = true;
                card.setTextureWithCode(card.code);
                card.node.position = posC;

                if (player === this.thisPlayer) {
                    var pos = posC.add(cc.v2(this.sizeCardW * id * SCALE_CARD * DIS_CARD, 0));
                    card.node.setScale(SCALE_CARD);
                }
                else
                    var pos = posC.add(cc.v2(this.sizeCardW * id * SCALE_CARD_OTHER * 0.45, 0));

                card.node.runAction(cc.moveTo(0.2, pos).easing(cc.easeCubicActionInOut()));
            }

            if (siC === 13) {
                this.aniChayBai[idexPos].node.active = true;
                this.aniChayBai[idexPos].setAnimation(0, "animation", true);

            }

            for (let i = 0; i < this.listDataPlayerResult.length; i++) {
                cc.NGWlog("=-=-=--=-=-=-=-=-=--=-=-=--=-===--==--=-=>>>> Tienlen den lang: " + i);
                var data = this.listDataPlayerResult[i];
                var siZ = data.lstDenLang.length;
                var agSub = 0;

                if (siZ === 0)
                    continue;

                var player = this.getPlayer(data.name);

                if (player === null)
                    continue;

                for (let chil = 0; chil < 5 * siZ; chil++) {
                    let nodeChip = new cc.Node();
                    nodeChip.addComponent(cc.Sprite);
                    GameManager.loadTexture(nodeChip, "game/icon_chips");
                    this.node.addChild(nodeChip);
                    this.vtChipDenLang.push(nodeChip);

                    var num1 = Math.floor(Math.random() * 30) - 15;
                    var num2 = Math.floor(Math.random() * 30) - 15;
                    var pos = player._playerView.node.position;
                    pos = pos.add(cc.v2(num1, num2));
                    nodeChip.position = pos;
                }

                for (let j = 0; j < siZ; j++) {
                    var pl = this.getPlayer(data.lstDenLang[j].name);
                    var ag = data.lstDenLang[j].ag;

                    if (pl === null)
                        continue;

                    agSub += ag;

                    cc.NGWlog(pl);

                    pl._playerView.effectFlyMoney(-ag);

                    var delayT = 0;
                    for (let chil = j * 5; chil < (j + 1) * 5; chil++) {
                        cc.NGWlog("=-=-=--=-=-=-=-=-=--=-=-=--=-===--==--=-=>>>> Tienlen chip: " + chil + "===========>> bay");
                        var chip = this.vtChipDenLang[chil];
                        let move = cc.moveTo(0.3, pl._playerView.node.position).easing(cc.easeCubicActionInOut());
                        let fadeOut = cc.fadeTo(0.05, 0);
                        let delay = cc.delayTime(delayT);

                        chip.runAction(cc.sequence(delay, move, fadeOut, cc.callFunc(() => {
                            chip.active = false;
                        })));

                        delayT += 0.075;
                    }
                }

                cc.NGWlog("=-=-=--=-=-=-=-=-=--=-=-=--=-===--==--=-=>>>> Tienlen ag: " + agSub);

                player._playerView.effectFlyMoney(agSub);
            }

        }
    },

    TienLenCardSpecial() {
        cc.NGWlog('!> tien len card special');
        this.aniFinish.node.active = false;

        // let idAva = this.playerSpecail.idAva
        // let url_fb = this.playerSpecail.avatar_url;

        // if (idAva > 0 && idAva < 999) {
        //     var url_ava = require('GameManager').getInstance().avatar_link.replace("%avaNO%", idAva);
        //     require('GameManager').getInstance().loadTextureFromUrl(this.avtSpecial, url_ava);
        // }
        this.avtSpecial.node.getComponent("AvatarItem").loadTexture(this.playerSpecail.avatar_id, this.playerSpecail.pname, this.playerSpecail.fid);

        var posC = cc.v2(0, -160);
        posC = posC.sub(cc.v2(this.sizeCardW * DIS_CARD * SCALE_CARD * 6, 0));

        for (let i = 0; i < this.playerSpecail.vectorCard.length; i++) {
            var card = this.playerSpecail.vectorCard[i];

            cc.NGWlog("=---==-=--=-=-==-=--==--=>>> Tienlen, card xxxx: ", posC);
            this.node.addChild(card.node);
            card.setTextureWithCode(card.code);
            card.node.setPosition(posC.x, posC.y);
            card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + i;

            posC = posC.add(cc.v2(this.sizeCardW * DIS_CARD * SCALE_CARD, 0));
        }

        this.aniWinSpecial.node.active = true;
        this.lbNameWin.string = this.playerSpecail.pname;

        switch (this.playerSpecail.typeWin) {
            case 1:
                {
                    this.aniWinSpecial.setAnimation(0, "four 2s", false);
                    break;
                }
            case 2:
                {
                    this.aniWinSpecial.setAnimation(0, "dragon", false);
                    break;
                }
            case 3:
                {
                    this.aniWinSpecial.setAnimation(0, "6 pairs", false);
                    break;
                }
            case 4:
                {
                    this.aniWinSpecial.setAnimation(0, "four triples", false);
                    break;
                }
            case 5:
                {
                    this.aniWinSpecial.setAnimation(0, "Fiveconsecutive", false);
                    break;
                }
            case 6:
                {
                    this.aniWinSpecial.setAnimation(0, "four 3s", false);
                    break;
                }
        }
    },

    showExchangeMoney() {
        for (let i = 0; i < this.players.length; i++)
            this.players[i].clearAllCard();

        for (let i = 0; i < this.listBgScore.length; i++) {
            this.listBgScore[i].node.active = false;
            this.aniChayBai[i].node.active = false;
        }

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            if (player.M < 0) {
                if (player === this.thisPlayer)
                    require('SoundManager1').instance.dynamicallyPlayMusic('sounds/lose');

                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/nemxu');
                player._playerView.showEffectWinLose(-1);
                player._playerView.effectFlyMoney(player.M);
                for (let j = 0; j < this.finishData.length; j++) {
                    if (player.pname === this.finishData[j].N)
                        player.ag = this.finishData[j].AG;
                }
                //    player.updateMoney();

                var delayT = 0;

                for (let id = 0; id < 10; id++) {
                    let nodeChip = new cc.Node();
                    nodeChip.addComponent(cc.Sprite);
                    GameManager.loadTexture(nodeChip, "game/icon_chips");
                    this.node.addChild(nodeChip);
                    this.vtChipFinish.push(nodeChip);
                    nodeChip.position = player._playerView.node.position

                    var pos = cc.v2(0, 0);
                    var num1 = Math.floor(Math.random() * 80) - 40;
                    var num2 = Math.floor(Math.random() * 80) - 40;

                    pos = pos.add(cc.v2(num1, num2));

                    let move = cc.moveTo(0.25, pos).easing(cc.easeCubicActionInOut());
                    let delay = cc.delayTime(delayT);

                    nodeChip.runAction(cc.sequence(delay, move));

                    delayT += 0.075;
                }
            }
        }

        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            for (let i = 0; i < this.players.length; i++) {
                let player = this.players[i];

                if (player.M > 0) {
                    require('SoundManager1').instance.dynamicallyPlayMusic('sounds/nemxu');

                    if (player === this.thisPlayer)
                        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/win');

                    player._playerView.showEffectWinLose(1);
                    player._playerView.effectFlyMoney(player.M);
                    for (let j = 0; j < this.finishData.length; j++) {
                        if (player.pname === this.finishData[j].N)
                            player.ag = this.finishData[j].AG;
                    }
                 //   player.updateMoney();

                    var delayT = 0;

                    for (let id = 0; id < this.vtChipFinish.length; id++) {
                        var chip = this.vtChipFinish[id];
                        let move = cc.moveTo(0.25, player._playerView.node.position).easing(cc.easeCubicActionInOut());
                        let fadeOut = cc.fadeTo(0.05, 0);
                        let delay = cc.delayTime(delayT);

                        chip.runAction(cc.sequence(delay, move, fadeOut, cc.callFunc(() => {
                            chip.active = false;
                        })));

                        delayT += 0.05;
                    }
                }
            }
        })));
    },

    updateMoney(strData) {
        var data = JSON.parse(strData);

        for (let i = 0; i < data.length; i++) {
            var player = this.getPlayer(data[i].N);
            player.ag = data[i].AG;
            player.updateMoney();

            if (player === this.thisPlayer) {
                require('GameManager').getInstance().user.ag = player.ag;
                require('SMLSocketIO').getInstance().emitUpdateInfo();
            }
        }
    },

    sortCard() {
        cc.NGWlog('!> sort card');
        var index = parseInt(this.thisPlayer.vectorCard.length / 2 * -1);

        this.dangPhatBai = true;
        this.numCardSelect = 0;

        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            let card = this.thisPlayer.vectorCard[i];
            card.node.stopAllActions();
            card.node.runAction(cc.scaleTo(0.2,SCALE_CARD).easing(cc.easeCubicActionOut()));
            // card.node.setScale(SCALE_CARD);
            card.node.zIndex = GAME_ZORDER.Z_CARD + i;
            card.node.opacity = 255;

            var posCard = this.listPosCard[0].add(cc.v2(this.sizeCardW * SCALE_CARD * DIS_CARD * index, 0));

            let move1 = cc.moveTo(0.15, this.listPosCard[0]).easing(cc.easeCubicActionOut());
            let move2 = cc.moveTo(0.15, posCard).easing(cc.easeCubicActionOut());
            let sq = cc.sequence(move1, move2, cc.callFunc(() => {
                card.isTouch = true;
                card.isSelect = false;
            }));

            card.node.runAction(sq);

            index++;
        }

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(() => {
            this.dangPhatBai = false;
        })));
    },

    sortCardView() {
        cc.NGWlog('!> sort card view');
        this.dangPhatBai = true;
        var index = parseInt(this.thisPlayer.vectorCard.length / 2 * -1);

        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            let card = this.thisPlayer.vectorCard[i];
            card.node.stopAllActions();
            card.node.runAction(cc.scaleTo(0.2,SCALE_CARD).easing(cc.easeCubicActionOut()));
            // card.node.setScale(SCALE_CARD);
            card.node.zIndex = GAME_ZORDER.Z_CARD + i;
            card.node.opacity = 255;

            var posCard = this.listPosCard[0].add(cc.v2(this.sizeCardW * SCALE_CARD * DIS_CARD * index, 0));

            let move = cc.moveTo(0.1, posCard).easing(cc.easeCubicActionInOut());
            let sq = cc.sequence(move, cc.callFunc(() => {
                card.isTouch = true;
                card.isSelect = false;
            }));

            card.node.runAction(sq);
            index++;
        }

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(() => {
            this.dangPhatBai = false;
        })));

        this.numCardSelect = 0;
    },

    sortCardSelect() {
        cc.NGWlog('!> sort card select');
        var index = parseInt(this.thisPlayer.vectorCard.length / 2 * -1);

        this.numCardSelect = 0;
        this.dangPhatBai = true;
        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            let card = this.thisPlayer.vectorCard[i];
            card.node.stopAllActions();
            // card.node.setScale(SCALE_CARD);
            card.node.zIndex = GAME_ZORDER.Z_CARD + i;
            card.node.opacity = 255;

            if (card.isSelect) {
                var posCard = this.listPosCard[0].add(cc.v2(this.sizeCardW * SCALE_CARD * DIS_CARD * index, 30));
                this.numCardSelect++;
            }
            else
                var posCard = this.listPosCard[0].add(cc.v2(this.sizeCardW * SCALE_CARD * DIS_CARD * index, 0));

            let move = cc.moveTo(0.1, posCard).easing(cc.easeCubicActionInOut());
            let sq = cc.sequence(move, cc.callFunc(() => {
                card.isTouch = true;
            }));

            card.node.runAction(sq);
            index++;
        }
        this.windowCard();

        this.node.runAction(cc.sequence(cc.delayTime(0.01), cc.callFunc(() => {
            this.dangPhatBai = false;
        })));
    },
});

module.export = TienLenGameView;