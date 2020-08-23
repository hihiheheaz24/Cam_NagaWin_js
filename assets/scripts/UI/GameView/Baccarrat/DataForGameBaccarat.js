var DataForGameBaccarat = cc.Class({
    extends: cc.Component,

    properties: {
        instantiate_parent: {
            default: null,
            type: cc.Node
        },

        btnPlay: {
            default: null,
            type: cc.Button
        },

        animDealer: {
            default: null,
            type: sp.Skeleton
        },

        icon: {
            default: null,
            type: cc.Sprite
        },

        playerCards: [],
        bankerCards: [],
        tie: false,
        player: false,
        banker: false,
        playerPair: false,
        bankerPair: false,
        scorePlayer: 0,
        scoreBanker: 0,
    },

    statics: {
        getInstance: function() {
            if (this.instance == null) {
                this.instance = new DataForGameBaccarat();
            }
            return this.instance;
        }
    },

    creatGame() {
        var arrP = [];
        var pl = {
            id: 123456,
            N: "Player",
            Url: "Player",
            AG: this.getMoney(),
            LQ: 0,
            VIP: 10,
            isStart: true,
            IK: 1,
            sIP: "192.168.1.1",
            G: 3,
            Av: 5,
            FId: 0,
            GId: 0,
            UserType: 1,
            TotalAG: 0,
            slot: 0,
            timeToStart: 0,
            displayName: "Player"
        };
        arrP.push(pl);

        var mcb = 1;
        var ag = this.getMoney();
        if (ag > 1000 && ag <= 10000)
            mcb = 10;
        else if (ag > 10000)
            mcb = 100;

        require('GameManager').getInstance().mcbBaccaratOff = mcb;
        var idTable = Math.floor(Math.random() * 10000);

        var data = {
            N: "Auto",
            M: mcb,
            ArrP: arrP,
            Id: idTable,
            T: 0,
            V: 0,
            AG: 5,
            issd: false,
            gameStatus: "ACT_TIME",
            timeLeft: 20000,
            // bet: {
            //     tie: 0,
            //     player: 0,
            //     banker: 0,
            //     playerPair: 0,
            //     bankerPair: 0
            // },
            // cardsLeft: 0,
            // bankerWinCount: 0,
            // playerWinCoun: 0,
            // tieWinCount: 0,
            // bankerPairCount: 0,
            // playerPairCount: 0,
            // playerBet: [
            //     {
            //         pid: 1627726,
            //         tie: 0,
            //         player: 0,
            //         banker: 0,
            //         playerPair: 0,
            //         bankerPair: 0
            //     }
            // ]

        };

        var dataBaccarat = {
            evt: 'ctable',
            data: JSON.stringify(data),
        };

        cc.NGWlog("data create game: %s ", JSON.stringify(dataBaccarat));
        require('HandleGamePacket').handleGame(JSON.stringify(dataBaccarat));
    },

    timeToStart() {
        require('GameManager').getInstance().totalBetBaccaratOff = 0;
        require('GameManager').getInstance().soLanDatCuocBaccaratOff = 0;
        require('GameManager').getInstance().dataBetBaccaratOff = [];

        var data = {
            finishAfter: 15000
        };

        var dataBaccarat = {
            evt: 'start',
            data: JSON.stringify(data),
        };

        cc.NGWlog("data start game: %s ", JSON.stringify(dataBaccarat));
        require('HandleGamePacket').handleGame(JSON.stringify(dataBaccarat));

        this.scheduleOnce(() => {
            this.finish();
        }, 15);
    },

    bet(betAG, side) {
        var ag = this.getMoney();

        if (betAG > ag) {
            this.betErrorEnoughAg();
        } else if (require('GameManager').getInstance().soLanDatCuocBaccaratOff >= 20) {
            this.betErrorMax20();
        } else if (!this.checkBetSide(betAG, side)) {
            this.betError(betAG);
        } else {
            this.betAccepted(betAG, side);
        }
    },

    checkBetSide(betAG, side) {
        var agBet = betAG;
        for (let i = 0; i < require('GameManager').getInstance().dataBetBaccaratOff.length; i++) {
            var data = require('GameManager').getInstance().dataBetBaccaratOff[i];

            if (data.side === side)
                agBet += data.betAG;
        }

        if (agBet > require('GameManager').getInstance().mcbBaccaratOff * 100)
            return false;

        return true;
    },

    betAccepted(betAG, side) {
        require('GameManager').getInstance().totalBetBaccaratOff += betAG;
        require('GameManager').getInstance().soLanDatCuocBaccaratOff++;

        var ag = this.getMoney() - betAG;
        cc.sys.localStorage.setItem("agBaccaratOffline", ag);

        var dataBet = {
            betAG: betAG,
            side: side
        };
        require('GameManager').getInstance().dataBetBaccaratOff.push(dataBet);

        var data = {
            chipBet: betAG,
            betTotal: require('GameManager').getInstance().totalBetBaccaratOff,
            side: side,
            pid: 123456,
        };

        var dataBaccarat = {
            evt: 'betAccepted',
            data: JSON.stringify(data),
        };

        cc.NGWlog("data betAccepted game: %s ", JSON.stringify(dataBaccarat));
        require('HandleGamePacket').handleGame(JSON.stringify(dataBaccarat));
    },

    betError(betAG) {
        var mcb = require('GameManager').getInstance().mcbBaccaratOff;

        var data = {
            betChip: betAG,
            minChipToBet: mcb,
            maxChipToBet: mcb * 100
        };

        var dataBaccarat = {
            evt: 'betError',
            data: JSON.stringify(data),
        };

        cc.NGWlog("data betError  game: %s ", JSON.stringify(dataBaccarat));
        require('HandleGamePacket').handleGame(JSON.stringify(dataBaccarat));
    },

    betErrorMax20() {
        var data = {
            actionResult: "MAX_BET"
        };

        var dataBaccarat = {
            evt: 'betError',
            data: JSON.stringify(data),
        };

        cc.NGWlog("data betError MaxBet  game: %s ", JSON.stringify(dataBaccarat));
        require('HandleGamePacket').handleGame(JSON.stringify(dataBaccarat));
    },

    betErrorEnoughAg() {
        var data = {
            actionResult: "NOT_ENOUGH_AG"
        };

        var dataBaccarat = {
            evt: 'betError',
            data: JSON.stringify(data),
        };

        cc.NGWlog("data betErrorEnoughAg  game: %s ", JSON.stringify(dataBaccarat));
        require('HandleGamePacket').handleGame(JSON.stringify(dataBaccarat));
    },

    finish() {
        this.tie = false;
        this.player = false;
        this.banker = false;
        this.playerPair = false;
        this.bankerPair = false;
        this.scorePlayer = 0;
        this.scoreBanker = 0;
        this.playerCards = [];
        this.bankerCards = [];

        this.playerCards = this.getCardsPlayer();
        this.bankerCards = this.getCardsBanker();

        if (this.scorePlayer === this.scoreBanker) {
            this.tie = true;
            require('GameManager').getInstance().tieWinCountBaccaratOff++;
        } else if (this.scorePlayer > this.scoreBanker) {
            this.player = true;
            require('GameManager').getInstance().playerWinCountBaccaratOff++;
        } else if (this.scorePlayer < this.scoreBanker) {
            this.banker = true;
            require('GameManager').getInstance().bankerWinCountBaccaratOff++;
        }

        var vtCardPlayer = [];
        for (let i = 0; i < this.playerCards.length; i++) {
            if (this.playerCards[i] !== null) {
                var pl = {
                    code: this.playerCards[i].code
                };
                vtCardPlayer.push(pl);
            } else
                vtCardPlayer.push(null);
        }

        var vtCardBanker = [];
        for (let i = 0; i < this.bankerCards.length; i++) {
            if (this.bankerCards[i] !== null) {
                var pl = {
                    code: this.bankerCards[i].code
                };
                vtCardBanker.push(pl);
            } else
                vtCardBanker.push(null);
        }

        this.updateHistory();

        var data = {
            tie: this.tie,
            player: this.player,
            banker: this.banker,
            playerPair: this.playerPair,
            bankerPair: this.bankerPair,
            playerCards: vtCardPlayer,
            bankerCards: vtCardBanker,
            startAfter: 17000,
            results: this.getResult(),
            bets: this.getBetInRound(),
            cardsLeft: 312,
            bankerWinCount: require('GameManager').getInstance().bankerWinCountBaccaratOff,
            playerWinCount: require('GameManager').getInstance().playerWinCountBaccaratOff,
            tieWinCount: require('GameManager').getInstance().tieWinCountBaccaratOff,
            bankerPairCount: require('GameManager').getInstance().bankerPairCountBaccaratOff,
            playerPairCount: require('GameManager').getInstance().playerPairCountBaccaratOff,
            history: require('GameManager').getInstance().dataHistoryBaccaratOff,
        };

        var dataBaccarat = {
            evt: 'finish',
            data: JSON.stringify(data),
        };

        cc.NGWlog("data finish game: %s ", JSON.stringify(dataBaccarat));
        require('HandleGamePacket').handleGame(JSON.stringify(dataBaccarat));

        this.scheduleOnce(() => {
            this.timeToStart();
        }, 17);
    },

    getCardsPlayer() {
        var vtCards = [];
        var score = 0;
        var isPair = false;

        for (let i = 0; i < 2; i++) {
            let num = Math.floor(Math.random() * 13) + 2;
            let suit = Math.floor(Math.random() * 4) + 1;
            let code = 13 * (suit - 1) + num - 1;

            let data = {
                num: num,
                code: code,
            };
            vtCards.push(data);

            if (num >= 10 && num <= 13)
                num = 0;
            else if (num === 14)
                num = 1;

            score += num;
            score %= 10;
        }

        if (score < 6) {
            let num = Math.floor(Math.random() * 13) + 2;
            let suit = Math.floor(Math.random() * 4) + 1;
            let code = 13 * (suit - 1) + num - 1;

            let data = {
                num: num,
                code: code,
            };
            vtCards.push(data);

            if (num >= 10 && num <= 13)
                num = 0;
            else if (num === 14)
                num = 1;

            score += num;
            score %= 10;
        } else
            vtCards.push(null);


        if (vtCards[0].num === vtCards[1].num)
            isPair = true;

        this.scorePlayer = score;
        this.playerPair = isPair;

        cc.NGWlog("-=--=-=-==-=->>> baccarat card players=> ", vtCards);
        cc.NGWlog("-=--=-=-==-=->>> baccarat player Pair=> ", isPair);
        cc.NGWlog("-=--=-=-==-=->>> baccarat player score=> ", score);

        if (isPair === true)
            require('GameManager').getInstance().playerPairCountBaccaratOff++;

        return vtCards;
    },

    getCardsBanker() {
        var vtCards = [];
        var score = 0;
        var isPair = false;

        for (let i = 0; i < 2; i++) // get 2 la
        {
            let num = Math.floor(Math.random() * 13) + 2;
            let suit = Math.floor(Math.random() * 4) + 1;
            let code = 13 * (suit - 1) + num - 1;

            let data = {
                num: num,
                code: code,
            };
            vtCards.push(data);

            if (num >= 10 && num <= 13)
                num = 0;
            else if (num === 14)
                num = 1;

            score += num;
            score %= 10;
        }


        // Trường hợp 1: Player không rút lá bài thứ 3: (Bài của player > = 6 điểm)
        //   -> 2 lá Banker = 0 – 5 điểm -> Banker được rút thêm lá bài thứ 3
        //   -> 2 lá Banker = 6 – 9 điểm -> Banker không được rút lá bài thứ 3
        if (this.playerCards[2] === null && score < 6) {
            let num = Math.floor(Math.random() * 13) + 2;
            let suit = Math.floor(Math.random() * 4) + 1;
            let code = 13 * (suit - 1) + num - 1;

            let data = {
                num: num,
                code: code,
            };
            vtCards.push(data);

            if (num >= 10 && num <= 13)
                num = 0;
            else if (num === 14)
                num = 1;

            score += num;
            score %= 10;
        } else if (this.playerCards[2] !== null) {
            if (score < 3) {
                // 2 lá Banker =  0 1 2 điểm => Luôn luôn rút lá thứ 3
                let num = Math.floor(Math.random() * 13) + 2;
                let suit = Math.floor(Math.random() * 4) + 1;
                let code = 13 * (suit - 1) + num - 1;

                let data = {
                    num: num,
                    code: code,
                };
                vtCards.push(data);

                if (num >= 10 && num <= 13)
                    num = 0;
                else if (num === 14)
                    num = 1;

                score += num;
                score %= 10;
            } else if (score === 3) {
                // -> 2 lá Banker = 3 điểm
                //   * Player rút được lá bài có giá trị = 8 => Banker không rút thêm. Player 3 lá - Banker 2 lá -> So bài tính điểm
                //   * Player rút được lá bài không phải là 8 => Banker rút thêm lá thứ 3. Player 3 lá - Banker 3 lá -> So bài tính điểm 
                if (this.playerCards[2].num !== 8) {
                    let num = Math.floor(Math.random() * 13) + 2;
                    let suit = Math.floor(Math.random() * 4) + 1;
                    let code = 13 * (suit - 1) + num - 1;

                    let data = {
                        num: num,
                        code: code,
                    };
                    vtCards.push(data);

                    if (num >= 10 && num <= 13)
                        num = 0;
                    else if (num === 14)
                        num = 1;

                    score += num;
                    score %= 10;
                } else
                    vtCards.push(null);
            } else if (score === 4) {
                //-> 2 lá Banker = 4 điểm
                //   * Player rút được 1 trong các lá bài có giá trị = 0,1,8,9 => Banker không rút thêm. Player 3 lá - Banker 2 lá -> So bài tính điểm
                //   * Nếu Player rút được lá bài có giá trị = 2,3,4,5,6 hoặc 7 => Banker rút thêm lá thứ 3. Player 3 lá - Banker 3 lá -> So bài tính điểm 
                if (this.playerCards[2].num >= 2 && this.playerCards[2].num <= 7) {
                    let num = Math.floor(Math.random() * 13) + 2;
                    let suit = Math.floor(Math.random() * 4) + 1;
                    let code = 13 * (suit - 1) + num - 1;

                    let data = {
                        num: num,
                        code: code,
                    };
                    vtCards.push(data);

                    if (num >= 10 && num <= 13)
                        num = 0;
                    else if (num === 14)
                        num = 1;

                    score += num;
                    score %= 10;
                } else
                    vtCards.push(null);
            } else if (score === 5) {
                //-> 2 lá Banker = 5 điểm
                //   * Player rút được 1 trong các lá bài có giá trị = 0,1,2,3,8,9 => Banker không rút thêm. Player 3 lá - Banker 2 lá -> So bài tính điểm
                //   * Nếu Player rút được lá bài có giá trị = 4,5,6 hoặc 7 => Banker rút thêm lá thứ 3. Player 3 lá - Banker 3 lá -> So bài tính điểm
                if (this.playerCards[2].num >= 4 && this.playerCards[2].num <= 7) {
                    let num = Math.floor(Math.random() * 13) + 2;
                    let suit = Math.floor(Math.random() * 4) + 1;
                    let code = 13 * (suit - 1) + num - 1;

                    let data = {
                        num: num,
                        code: code,
                    };
                    vtCards.push(data);

                    if (num >= 10 && num <= 13)
                        num = 0;
                    else if (num === 14)
                        num = 1;

                    score += num;
                    score %= 10;
                } else
                    vtCards.push(null);
            } else if (score === 6) {
                // -> 2 lá Banker = 6 điểm
                // * Player rút được 1 trong các lá bài có giá trị = 0,1,2,3,4,5,8,9 => Banker không rút thêm. Player 3 lá - Banker 2 lá -> So bài tính điểm
                // * Nếu Player rút được lá bài giá trị = 6 hoặc 7 => Banker rút thêm lá thứ 3. Player 3 lá - Banker 3 lá -> So bài tính điểm
                if (this.playerCards[2].num === 6 || this.playerCards[2].num === 7) {
                    let num = Math.floor(Math.random() * 13) + 2;
                    let suit = Math.floor(Math.random() * 4) + 1;
                    let code = 13 * (suit - 1) + num - 1;

                    let data = {
                        num: num,
                        code: code,
                    };
                    vtCards.push(data);

                    if (num >= 10 && num <= 13)
                        num = 0;
                    else if (num === 14)
                        num = 1;

                    score += num;
                    score %= 10;

                } else
                    vtCards.push(null);
            } else
                vtCards.push(null);
        } else
            vtCards.push(null);


        if (vtCards[0].num === vtCards[1].num)
            isPair = true;

        this.scoreBanker = score;
        this.bankerPair = isPair;

        cc.NGWlog("-=--=-=-==-=->>> baccarat card Banker=> ", vtCards);
        cc.NGWlog("-=--=-=-==-=->>> baccarat Banker Pair=> ", isPair);
        cc.NGWlog("-=--=-=-==-=->>> baccarat Banker score=> ", score);

        if (isPair === true)
            require('GameManager').getInstance().bankerPairCountBaccaratOff++;

        return vtCards;
    },

    updateHistory() {
        if (this.banker === true && this.playerPair === false && this.bankerPair === false)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.BANKER);
        else if (this.player === true && this.playerPair === false && this.bankerPair === false)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.PLAYER);
        else if (this.tie === true && this.playerPair === false && this.bankerPair === false)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.TIE);
        else if (this.player === true && this.playerPair === true && this.bankerPair === false)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.PLAYER_P);
        else if (this.player === true && this.playerPair === false && this.bankerPair === true)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.PLAYER_B);
        else if (this.player === true && this.playerPair === true && this.bankerPair === true)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.PLAYER_PB);
        else if (this.banker === true && this.playerPair === true && this.bankerPair === false)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.BANKER_P);
        else if (this.banker === true && this.playerPair === false && this.bankerPair === true)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.BANKER_B);
        else if (this.banker === true && this.playerPair === true && this.bankerPair === true)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.BANKER_PB);
        else if (this.tie === true && this.playerPair === true && this.bankerPair === false)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.TIE_P);
        else if (this.tie === true && this.playerPair === false && this.bankerPair === true)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.TIE_B);
        else if (this.tie === true && this.playerPair === true && this.bankerPair === true)
            require('GameManager').getInstance().dataHistoryBaccaratOff.push(TYPEWIN_BACCARAT.TIE_PB);
    },

    getBetInRound() {
        var data = [];

        var chipBanker = 0;
        var chipPlayer = 0;
        var chipTie = 0;
        var chipPlayerPair = 0;
        var chipBankerPair = 0;

        for (let i = 0; i < require('GameManager').getInstance().dataBetBaccaratOff.length; i++) {
            let data = require('GameManager').getInstance().dataBetBaccaratOff[i];
            if (data.side === "Banker")
                chipBanker += data.betAG;
            else if (data.side === "Player")
                chipPlayer += data.betAG;
            else if (data.side === "Tie")
                chipTie += data.betAG;
            else if (data.side === "PlayerPair")
                chipPlayerPair += data.betAG;
            else if (data.side === "BankerPair")
                chipBankerPair += data.betAG;
        }

        var pl = {
            bankerSide: {
                chip: chipBanker,
                side: "Banker"
            },
            playerSide: {
                chip: chipPlayer,
                side: "Player"
            },
            tieSide: {
                chip: chipTie,
                side: "Tie"
            },
            playerPairSide: {
                chip: chipPlayerPair,
                side: "PlayerPair"
            },
            bankerPairSide: {
                chip: chipBankerPair,
                side: "BankerPair"
            },
            pid: 123456,
        };

        data.push(pl);

        return data;
    },

    getResult() {
        var data = [];

        var chipBanker = 0;
        var chipPlayer = 0;
        var chipTie = 0;
        var chipPlayerPair = 0;
        var chipBankerPair = 0;
        var totalAg = 0;

        for (let i = 0; i < require('GameManager').getInstance().dataBetBaccaratOff.length; i++) {
            let data = require('GameManager').getInstance().dataBetBaccaratOff[i];
            if (data.side === "Banker")
                chipBanker += data.betAG;
            else if (data.side === "Player")
                chipPlayer += data.betAG;
            else if (data.side === "Tie")
                chipTie += data.betAG;
            else if (data.side === "PlayerPair")
                chipPlayerPair += data.betAG;
            else if (data.side === "BankerPair")
                chipBankerPair += data.betAG;
        }

        if (this.player === true)
            totalAg = totalAg + chipPlayer + chipPlayer;
        if (this.banker === true)
            totalAg = totalAg + chipBanker + chipBanker * 0.95;
        if (this.tie === true)
            totalAg = totalAg + chipTie + chipTie * 8;
        if (this.playerPair === true)
            totalAg = totalAg + chipPlayerPair + chipPlayerPair * 11;
        if (this.bankerPair === true)
            totalAg = totalAg + chipBankerPair + chipBankerPair * 11;

        // if(this.player === false)
        //     totalAg -= chipPlayer;
        // if(this.banker === false)
        //     totalAg -= chipBanker;
        // if(this.tie === false)
        //     totalAg -= chipTie;
        // if(this.playerPair === false)
        //     totalAg -= chipPlayerPair;
        // if(this.bankerPair === false)
        //     totalAg -= chipBankerPair;

        var ag = this.getMoney() + totalAg;
        cc.sys.localStorage.setItem("agBaccaratOffline", ag);

        var pl = {
            pid: 123456,
            agAdd: totalAg,
            AG: this.getMoney()
        };

        data.push(pl);

        return data;
    },

    showGame() {
        this.node.runAction(cc.sequence(cc.callFunc(() => {
            this.btnPlay.node.interactable = false;
        }), cc.delayTime(2), cc.callFunc(() => {
            this.btnPlay.node.interactable = true;
        })));

        require("GameManager").getInstance().curGameId = GAME_ID.BACCARAT;
        require("GameManager").getInstance().curGameViewId = GAME_ID.BACCARAT;
        cc.NGWlog("--------- vao  Baccarat");
        cc.loader.loadRes('prefab/BaccaratView', (err, prefab) => {
            require("GameManager").getInstance().gameView = cc.instantiate(prefab).getComponent('BaccaratView');
            this.instantiate_parent.addChild(require("GameManager").getInstance().gameView.node);
            this.btnPlay.node.active = false;
            this.icon.node.active = false;
            this.animDealer.node.active = false;
        });

        this.getData();
    },

    getData() {
        if (require("GameManager").getInstance().gameView !== null) {
            require("GameManager").getInstance().gameView.nodeGroupMenu.onHideItem(0);
            require("GameManager").getInstance().gameView.nodeGroupMenu.onHideItem(1);
            require("GameManager").getInstance().gameView.nodeGroupMenu.onHideItem(2);
            this.creatGame();
            this.timeToStart();
        } else {
            this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
                this.getData();
            })));
        }
    },

    getMoney() {
        var ag = cc.sys.localStorage.getItem("agBaccaratOffline");

        if (ag === null) {
            cc.sys.localStorage.setItem("agBaccaratOffline", 10000);
            ag = cc.sys.localStorage.getItem("agBaccaratOffline");
        }

        return parseInt(ag);
    },
});

module.export = DataForGameBaccarat;