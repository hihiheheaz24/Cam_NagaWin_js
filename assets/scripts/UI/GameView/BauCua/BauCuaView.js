var GameView = require('GameView2')
const Player = require('Player')
var GameManager = require('GameManager');

var BauCuaView = cc.Class({
    extends: GameView,
    // name: "BauCuaView",

    properties: {
        playerPrefab: {
            default: null,
            type: cc.Prefab
        },
        btnBet: {
            default: [],
            displayName: 'List bet',
            type: [cc.Button]
        },

        list_spBet: {
            default: [],
            displayName: 'Ls spBet',
            type: [cc.Sprite]
        },
        list_lbBet: {
            default: [],
            displayName: 'Ls lbBet',
            type: [cc.Label]
        },

        btnChip: {
            default: [],
            displayName: 'List chip',
            type: [cc.Button]
        },

        spChipGrow: {
            default: null,
            type: cc.Sprite
        },

        aniNode: {
            default: null,
            type: cc.Node
        },

        aniStart: {
            default: null,
            type: sp.Skeleton
        },

        aniShake: {
            default: null,
            type: sp.Skeleton
        },

        aniClock: {
            default: null,
            type: sp.Skeleton
        },
        lbLose: {
            default: null,
            type: cc.Label
        },
        aniWin: {
            default: null,
            type: sp.Skeleton
        },
        lbWin: {
            default: null,
            type: cc.Label
        },
        lbTime: {
            default: null,
            type: cc.Label
        },
        spMask: {
            default: null,
            type: cc.Sprite
        },
        spBowl: {
            default: null,
            type: cc.Sprite
        },
        preChip: {
            default: null,
            type: cc.Prefab
        },

        preDice: {
            default: null,
            type: cc.Prefab
        },

        preHist: {
            default: null,
            type: cc.Prefab
        },

        spTable: {
            default: null,
            type: cc.Sprite
        },
        spfGrow: {
            default: [],
            type: [cc.SpriteFrame]
        },
        spBonus: {
            default: [],
            type: [cc.SpriteFrame]
        },
        backGrourd: {
            default: null,
            type: cc.Node
        },
        number_player: {
            default: null,
            type: cc.Label
        },
        button_player: {
            default: null,
            type: cc.Button
        },
        lb_total_my_bet: {
            default: null,
            type: cc.Label
        },
        button_deal: {
            default: null,
            type: cc.Button
        },
        button_cancel: {
            default: null,
            type: cc.Button
        },
        button_hist: {
            default: null,
            type: cc.Button
        },
        listPlayerPop: {
            default: null,
            type: cc.Prefab
        },
        listHistoryPop: {
            default: null,
            type: cc.Prefab
        },
        fontWin: {
            default: null,
            type: cc.Font
        },
        spfBgGoldTable: {
            default: null,
            type: cc.SpriteFrame
        },
        myMoney: {
            default: null,
            type: cc.Label
        },
        spLose: {
            default: null,
            type: cc.Sprite
        }
    },

    //--LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        this.nodeGroupMenu.onHideItem(1);
        this.nodeGroupMenu.onHideItem(5);
        //Config game
        this.LIST_BET_DEFINE = [
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
            [1, 6],
            [2, 3],
            [2, 4],
            [2, 5],
            [2, 6],
            [3, 4],
            [3, 5],
            [3, 6],
            [4, 5],
            [4, 6],
            [5, 6]
        ];
        this.TEMP_VALUE_GOLD_COINS = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000, 5000000000];
        this.lbInfo.node.active = false;
        this.listChip = []; //List chip of all user [name,[gate,chip]]
        this.listUserBet = []; //List chip of all user [gate,value,background,label]
        this.listUserSum = [];
        this.diceHistory = []; //List dice history [[dice1,dice2,dice3]]
        this.countTime = -1; //Clock count time
        this.onBet = false;
        this.listAllChipBet = []; //List tong tien / so nguoi dat [gate,ag,numb,[plname],[label]]
        this.dearlerPos = cc.v2(0, this.spTable.node.height * 0.5);
        this.mypos = cc.v2(this.listPosView[0].x, this.listPosView[0].y);
        this.totalMyBet = 0; // tong so tien cuoc cua minh
        this.gateData = [];
        this.list_spBonus = [];
        this.ArrCountItem = [0, 0, 0, 0, 0, 0],

            //Zoder
            this.aniClock.node.zIndex = 10;
        this.aniStart.node.zIndex = 10;
        this.aniShake.node.zIndex = 11;

        for (let i = 0; i < this.list_spBet.length; i++) {
            this.list_spBet[i].node.getParent().zIndex = 13;
            //this.list_spBet[i].node.setContentSize(cc.size(80, 35));
        }

        //Tag
        this.listTag = [
            [],
            [],
            [],
            []
        ];
        this.BAUCUATAG = {
            CHIP: 0,
            BETGROW: 1,
            BGCHIPBET: 2,
            DICE: 3,
        };

        //Time
        this.TIMEACTION = {
            CHIPFLY: 0.3,
            GROWBET: 0.5,
            BGBET: 0.2,
            HISTORY: 0.3,
            TIMEONBET: 15.0,
            //-Start effect
            STARTTIME: 23.0,
            STARTANI: 2.0,
            STARTSHAKE: 3.5,
            STARTBET: 1.0,
            //Finish effect
            FINISHTIME: 11.0,
            FINISHDELCHIP: 4.5,
            FINISHOPENSCRATCH: 0.5,
        };

        //Gate
        this.GATETYPE = {
            SQUARE: 0,
            RECTANGLE: 1,
            RECTANGLE_CURVED: 2,
            RECTANGLE_TINYH: 3,
            RECTANGLE_TINYV: 4,
        };

        this.gate = [];
        var gateSquare = [1, 2, 3, 4, 5, 6];
        var gateRec = [8, 10, 15, 20];
        var gateRecCur = [13, 14, 16, 17];
        var gateRecTiH = [11, 12, 19];
        var gateRecTiV = [7, 9, 18, 21];
        this.gate.push(gateSquare, gateRec, gateRecCur, gateRecTiH, gateRecTiV);

        //Set function button bet
        for (let i = 0; i < this.btnBet.length; i++) {
            const btn = this.btnBet[i];
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "BauCuaView";
            clickEventHandler.handler = "onClickBet";
            clickEventHandler.customEventData = '' + i;
            btn.clickEvents = [];
            btn.enabled = false;
            btn.interactable = true;
            btn.clickEvents.push(clickEventHandler);
        }

        this.popupListPlayer = cc.instantiate(this.listPlayerPop).getComponent("BauCuaListPlayer");
        this.popupListHistory = cc.instantiate(this.listHistoryPop).getComponent("BauCuaTableHistory");
    },

    //--Handle game
    handleCTable(strData) {

        var data = JSON.parse(strData);
        this.stateGame = STATE_GAME.WAITING;
        this.setGameInfo(data.M, data.Id, data.Time);
        var listPlayer = data.ArrP[0];
        cc.NGWlog(listPlayer);
        this.thisPlayer = new Player();
        this.players.push(this.thisPlayer);
        this.readDataPlayer(this.thisPlayer, listPlayer);
        this.myMoney.string = GameManager.getInstance().formatNumber(this.thisPlayer.ag);
        this.addChatJoin(this.thisPlayer.displayName);
        this.updatePlayers();
        this.updateChipBet();
        this.setChipBet(0);
        this.setReadyAllPl();
        require('NetworkManager').getInstance().getHistoryBauCua();
    },
    handleChatTable(data) {
        this._super(data);
    },
    handleHistory(data) {

        var listHistory = JSON.parse(data);
        this.ArrCountItem = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < listHistory.length; i++) {
            let item = listHistory[i];
            for (let j = 0; j < item.length; j++) {
                if (item[j] === 1) {
                    this.ArrCountItem[0]++;
                } else if (item[j] === 2) {
                    this.ArrCountItem[1]++;
                } else if (item[j] === 3) {
                    this.ArrCountItem[2]++;
                } else if (item[j] === 4) {
                    this.ArrCountItem[3]++;
                } else if (item[j] === 5) {
                    this.ArrCountItem[4]++;
                } else if (item[j] === 6) {
                    this.ArrCountItem[5]++;
                }
            }
            this.diceHistory.push(item);
        }

        this.popupListHistory.reloadListPercent(this.ArrCountItem);

        if (this.diceHistory.length <= 0) {
            this.popupListHistory.vienvang.active = false;
            return;
        }
        this.popupListHistory.vienvang.active = true;

        for (let i = 0; i < this.diceHistory.length; i++) {
            if (this.diceHistory.length > 12) {
                this.diceHistory.splice(0, 1);
            } else {
                break;
            }
        }
        // or 
        //this.diceHistory.slice(-12);

        this.popupListHistory.reloadListDice(this.diceHistory);
        this.updateHistory();

    },
    handleSTable(strData) {
        cc.NGWlog('-BauCuaLog>handleSTable');

        for (var i = 0; i < this.players.length; i++) {
            this.players[i]._playerView.node.destroy();
        }
        this.players = [];

        //Parse
        var data = JSON.parse(strData);
        var time = data.T;
        this.stateGame = STATE_GAME.WAITING;

        this.setGameInfo(data.M, data.Id, data.Time);
        var listPlayer = data.ArrP;
        var lTemp = [];

        for (let i = 0; i < listPlayer.length; i++) {
            var player = new Player();
            lTemp.push(player);
            this.readDataPlayer(player, listPlayer[i]);
            if (player.id === GameManager.getInstance().user.id) {
                this.thisPlayer = player;
                this.myMoney.string = GameManager.getInstance().formatNumber(this.thisPlayer.ag);
                require('NetworkManager').getInstance().getHistoryBauCua();
            }
        }

        this.players = lTemp;

        this.updateChipBet();
        this.setChipBet(0);
        this.updatePlayers();
        this.addChatJoin(this.thisPlayer.displayName);
        //Show start animation
        this.showStart(time);
        cc.NGWlog('BauCuaLog->handleSTable: done');
        //Ready all player
        this.setReadyAllPl();
    },

    handleVTable(strData) {
        this._super(strData);

        //Ready all player
        this.setReadyAllPl();
    },

    handleJTable(strData) {
        var listPlayer = JSON.parse(strData);
        var player = new Player();
        this.players.push(player);
        this.readDataPlayer(player, listPlayer);
        this.addChatJoin(player.displayName);
        this.updatePlayers();
        //Ready all player
        this.setReadyAllPl();
    },


    handleRJTable(strData) {
        this._super(strData);
        this.updateChipBet();
        //Ready all player
        this.setReadyAllPl();
    },

    handleCCTable(strData) {
        //this._super(strData);
        //this.updatePlayers();
        cc.NGWlog('doi chu ban')
    },

    handleLTable(data) {
        var name = data.Name;

        if (name !== GameManager.getInstance().user.uname) {
            require('SoundManager1').instance.playRemove();
            let player = this.getPlayer(name);
            if (player !== null) {
                this.players.splice(this.players.indexOf(player), 1);
            }
        }
        this.updatePlayers();
    },

    handleStartGame(data) {
        cc.NGWlog('BauCuaLog->startgame');

        //Show animation
        var time = parseInt(data.data) / 1000;
        time = time + this.TIMEACTION.STARTANI + this.TIMEACTION.STARTSHAKE;
        this.showStart(time);
    },
    handleBet(plName, listBets, listMoney) {
        require('SoundManager1').instance.playBetMusic();
        var player = this.getPlayer(plName);
        if (player === null) return null;

        //Clear animation node
        if (this.aniShake.node.active) {
            this.aniNode.stopAllActions();
            this.aniShake.node.active = false;
        }

        if (this.aniStart.node.active) {
            this.aniNode.stopAllActions();
            this.aniStart.node.active = false;
        }
        for (let i = 0; i < listBets.length; i++) {
            var betGate = listBets[i];
            var ag = listMoney[i];
            this.showAllChipBet(plName, betGate, ag);

            //Subtract ag player
            player.ag = player.ag - ag;
            if (player._playerView !== null) {
                player.updateMoney();
            }
        }

        //Show clock
        if (!this.aniClock.node.active) {
            this.showClock(true);
        }

        if (!this.onBet) {
            this.onBet = true;
            for (let i = 0; i < this.btnBet.length; i++) {
                const btn = this.btnBet[i];
                btn.enabled = true;
            }
        }

        //For this player
        if (plName === this.thisPlayer.pname) {
            this.stateGame = STATE_GAME.PLAYING;
            this.lb_total_my_bet.string = GameManager.getInstance().formatMoney(this.totalMyBet);

            this.myMoney.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1.0), cc.delayTime(0.1), cc.callFunc(() => {
                this.myMoney.string = GameManager.getInstance().formatNumber(this.thisPlayer.ag);
            })));

            for (let i = 0; i < listBets.length; i++) {

                var betGate = listBets[i];
                var ag = listMoney[i];

                //Create chip
                var chip = this.flyChipBet(ag, plName, betGate);

                var plIndex = -1;
                for (let j = 0; j < this.listChip.length; j++) {
                    const list = this.listChip[j];
                    if (list[0] === plName) {
                        plIndex = j;
                        break;
                    }
                }

                if (plIndex === -1) {
                    this.listChip.push([plName, []]);
                    plIndex = this.listChip.length - 1;
                }

                this.listChip[plIndex][1].push([betGate, chip]);


                //create User bet
                let ide = -1;
                for (let k = 0; k < this.listUserBet.length; k++) {
                    if (this.listUserBet[k].gate === betGate) {
                        ide = k;
                        break;
                    }
                }

                if (ide === -1) {
                    var obj = {};
                    obj.gate = betGate;
                    obj.chip = ag;
                    this.listUserBet.push(obj);
                } else {
                    this.listUserBet[ide].chip = this.listUserBet[ide].chip + ag;
                }
            }
            this.showChipBet();

            //Check lock chip
            this.lockChipBet();
        }
        cc.NGWlog('BauCuaLog->bet: done');
    },

    handleUnBet(strData) {
        cc.NGWlog('BauCuaLog->unbet');
    },

    handleFinish(packet) {
        //this.stateGame = STATE_GAME.PLAYING;
        this.totalMyBet = 0;
        this.lb_total_my_bet.string = GameManager.getInstance().formatMoney(this.totalMyBet);
        this.button_deal.interactable = false;
        this.button_cancel.interactable = false;

        this.listUserSum = [];
        this.diceHistory = [];
        this.showChipBet();
        require('NetworkManager').getInstance().getHistoryBauCua();

        //Clear animation node
        this.aniNode.stopAllActions();
        this.aniShake.node.active = false;
        this.aniStart.node.active = false;

        //Disable bet
        this.onBet = false;
        for (let i = 0; i < this.btnBet.length; i++) {
            const btn = this.btnBet[i];
            btn.enabled = false;
        }
        //Hide clock
        if (this.aniClock.node.active) {
            this.showClock(false);
        }

        //Push history list
        var dice1 = packet.dice1;
        var dice2 = packet.dice2;
        var dice3 = packet.dice3;
        //this.diceHistory.push([dice1, dice2, dice3]);

        //Get all gate win
        var listGateWin = [dice1, dice2, dice3];
        const listGateBlockGrow = [9, 7, 19, 11, 12, 21, 18];
        for (let i = 0; i < 3; i++) {
            var diceComp1 = null;
            var diceComp2 = null;
            if (i == 0) {
                diceComp1 = dice1;
                diceComp2 = dice2;
            } else if (i == 1) {
                diceComp1 = dice2;
                diceComp2 = dice3;
            } else if (i == 2) {
                diceComp1 = dice1;
                diceComp2 = dice3;
            }

            if (diceComp1 === diceComp2) continue;

            for (let j = 0; j < this.LIST_BET_DEFINE.length; j++) {
                const gateDefine = this.LIST_BET_DEFINE[j];
                if (gateDefine.indexOf(diceComp1) != -1 && gateDefine.indexOf(diceComp2) != -1 /*&& listGateBlockGrow.indexOf(j + 1) == -1*/ ) {
                    listGateWin.push(j + 1);
                }
            }
        }

        //Get all bet win different between each other
        var listTableWin = JSON.parse(packet.listTableWin);
        var listBetWin = [];
        for (let i = 0; i < listTableWin.length; i++) {
            const bet = listTableWin[i];
            if (listBetWin.indexOf(bet) == -1) {
                listBetWin.push(bet)
            }
        }

        let totalBetWin = 0;


        //Effect finish

        var funcAni = cc.callFunc(() => {
            this.spBowl.node.active = false;
            this.showScratch(dice1, dice2, dice3, true);

            setTimeout(() => {
                if (this.node == null || typeof this.node == 'undefined') return;
                this.spBowl.node.active = true;
            }, 2500);
        });
        var delGrow = cc.delayTime(this.TIMEACTION.FINISHOPENSCRATCH);
        var funcGrow = cc.callFunc(() => {
            for (let j = 0; j < this.btnBet.length; j++) {
                if (j === 8 || j === 6 || j === 20 || j === 17 || j === 18 || j === 10 || j === 11) {
                    this.btnBet[j].node.opacity = 1;
                } else {
                    this.btnBet[j].node.opacity = 100;
                }
            }

            for (let i = 0; i < listGateWin.length; i++) {
                const gate = listGateWin[i];
                // if (gate != 9 && gate != 7 && gate != 19 && gate != 11 && gate != 12 && gate != 21 && gate != 18) {
                //     this.createGrow(gate, 3, false);
                // }
                this.createGrow(gate, 3, false);
                this.btnBet[gate - 1].node.opacity = 1;
            }

            let listGateWinTemp = listGateWin.sort(function(a, b) { return a - b });
            for (let i = 0; i < listGateWinTemp.length - 1; i++) {
                if (listGateWinTemp[i] === listGateWinTemp[i + 1]) {
                    listGateWinTemp.splice(i + 1, 1);
                    i--;
                }
            }

            // hide all lb myBet 
            for (let i = 0; i < this.list_spBet.length; i++) {
                this.list_spBet[i].node.active = false;
            }

            for (let i = 0; i < listGateWinTemp.length; i++) {
                let gateIndex = listGateWinTemp[i];
                for (let j = 0; j < this.listUserBet.length; j++) {
                    let x = this.listUserBet[j].gate;
                    if (gateIndex === x) {
                        let chip = this.listUserBet[j].chip;
                        this.list_spBet[gateIndex - 1].node.active = true;
                        totalBetWin += chip;
                        let count = 0;
                        var itemSpBonus = [];
                        var nodeBet = new cc.Node('Sprite');
                        nodeBet.scale = 0.8;
                        var spBet = nodeBet.addComponent(cc.Sprite);
                        nodeBet.position = this.btnBet[gateIndex - 1].node.position.add(cc.v2(0, -25));
                        spBet.spriteFrame = this.spBonus[2];

                        var nodeText = new cc.Node('Label');
                        var labelText = nodeText.addComponent(cc.Label);
                        nodeText.position = this.btnBet[gateIndex - 1].node.position.add(cc.v2(0, 25));
                        labelText.cacheMode = 2;
                        labelText.fontSize = 40;
                        labelText.lineHight = 73;
                        labelText.verticalAlign = 1;
                        labelText.font = this.fontWin;

                        if (gateIndex < 7) {
                            let itemLast = this.diceHistory[this.diceHistory.length - 1];
                            for (let k = 0; k < itemLast.length; k++) {
                                if (x === itemLast[k]) count++;
                            }

                            if (gateIndex === 1 || gateIndex === 2 || gateIndex === 4) {
                                nodeText.position = this.btnBet[gateIndex - 1].node.position.add(cc.v2(0, 37));
                                nodeBet.position = this.btnBet[gateIndex - 1].node.position.add(cc.v2(0, -17));
                            }

                            if (count === 2) {
                                spBet.spriteFrame = this.spBonus[0];
                                this.spTable.node.addChild(nodeBet, 20);
                                this.spTable.node.addChild(labelText.node, 20);
                                labelText.string = GameManager.getInstance().formatMoneyAg(chip * count);
                            } else if (count === 3) {
                                spBet.spriteFrame = this.spBonus[1];
                                this.spTable.node.addChild(nodeBet, 20);
                                this.spTable.node.addChild(labelText.node, 20);
                                labelText.string = GameManager.getInstance().formatMoneyAg(chip * count);
                            }

                        } else {
                            if (count === 0) count = 5;

                            if (gateIndex === 11 || gateIndex === 12 || gateIndex === 19) {
                                nodeText.position = this.btnBet[gateIndex - 1].node.position.add(cc.v2(-30, 0));
                                nodeBet.position = this.btnBet[gateIndex - 1].node.position.add(cc.v2(30, -0));
                                this.list_spBet[gateIndex - 1].node.active = true;
                            }

                            this.spTable.node.addChild(nodeBet,20);
                            this.spTable.node.addChild(labelText.node, 20);
                            labelText.string = GameManager.getInstance().formatMoneyAg(chip * count);
                        }
                        itemSpBonus.push(nodeBet);
                        itemSpBonus.push(labelText);
                        this.list_spBonus.push(itemSpBonus);
                    }
                }
            }
        });
        var delEnd = cc.delayTime(this.TIMEACTION.CHIPFLY * 3 + 1 + this.TIMEACTION.FINISHDELCHIP + 3.0 - this.TIMEACTION.FINISHOPENSCRATCH);
        var funcEnd = cc.callFunc(() => {
            if (this.getAM) {
                var msg = GameManager.getInstance().getTextConfig('nhan_ag_tu_server');
                require('UIManager').getInstance().onShowConfirmDialog(msg);
                this.getAM = false;
            }
        });
        var act = cc.sequence(funcAni, delGrow, funcGrow, delEnd, funcEnd);
        this.aniNode.runAction(act);

        //Get data
        var data = JSON.parse(packet.data);
        for (let i = 0; i < data.length; i++) {
            //Parse
            const plData = data[i];
            let N = plData.N;
            let M = plData.M;
            let AG = plData.AG;

            //Update player
            let player = this.getPlayer(N);
            if (player === null) continue;
            player.ag = AG;

            if (player.pname === GameManager.getInstance().user.uname) {
                GameManager.getInstance().user.ag = AG;
                require('SMLSocketIO').getInstance().emitUpdateInfo();
            }

            //Animation chip
            //-Get list chip
            let listChip = [];
            for (let i = 0; i < this.listChip.length; i++) {
                const list = this.listChip[i];
                if (list[0] === player.pname) {
                    listChip = list[1];
                    break;
                }
            }

            let numChip = listChip.length; //Because list chip will be add in future
            for (let i = 0; i < numChip; i++) {
                const list = listChip[i];
                let gate = list[0];
                let chip = list[1];
                if (listBetWin.indexOf(gate) !== -1) { //Animation chip win
                    let delayO = cc.delayTime(this.TIMEACTION.CHIPFLY * 2 + this.TIMEACTION.FINISHDELCHIP + 1.5);
                    let create = cc.callFunc(() => {
                        require('SoundManager1').instance.playChipWin();

                        let newChip = this.flyChipBet(chip.valueChipTem, null, gate);
                        list.push([gate, newChip]);
                    });
                    let act = cc.sequence(delayO, create);
                    chip.node.runAction(act);
                } else { //Animation chip lose
                    let deylayTime = this.TIMEACTION.CHIPFLY + this.TIMEACTION.FINISHDELCHIP;

                    //-Fly chip
                    let create = cc.callFunc(() => {
                        require('SoundManager1').instance.playChipLose();
                        this.flyChip(chip, this.dearlerPos, 0.5);
                    });

                    //-Fade chip
                    let del = cc.delayTime(deylayTime);
                    let fade = cc.fadeOut(this.TIMEACTION.CHIPFLY);
                    let act = cc.sequence(del, create, cc.delayTime(0.5), fade);
                    chip.node.runAction(act);
                }
            }

            if (N === GameManager.getInstance().user.uname) {
                let aniWinlose = cc.callFunc(() => {
                    if (M > 0) {
                        require('SoundManager1').instance.playBauCuaWin();
                        this.spMask.node.active = true;
                        this.lbWin.string = 'WIN\n' + '+' + (GameManager.getInstance().formatMoney(M + totalBetWin));
                        this.aniWin.node.active = true;
                        this.aniWin.setAnimation(0, "animation", false);

                        this.myMoney.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1.0), cc.delayTime(0.1), cc.callFunc(() => {
                            this.myMoney.string = GameManager.getInstance().formatNumber(this.thisPlayer.ag);
                        })));

                    } else if (M < 0) {
                        require('SoundManager1').instance.playBauCuaLose();
                        this.spMask.node.active = true;
                        this.lbLose.string = 'LOSE\n' + GameManager.getInstance().formatMoney(M);
                        this.spLose.node.active = true;
                    }
                })
                let deylayTime = this.TIMEACTION.CHIPFLY * 2 + this.TIMEACTION.FINISHDELCHIP + 2.5;
                let del = cc.delayTime(deylayTime);
                let act = cc.sequence(del, aniWinlose, cc.delayTime(2), cc.callFunc(() => {
                    this.restartGame();
                    cc.NGWlog('set lai status game ========= bau cua=======================================')
                    this.stateGame = STATE_GAME.WAITING;
                }));

                this.aniNode.runAction(act)
            }
        }
    },

    handleAM(strData) {
        //Parse
        var name = strData.N;
        var money = parseInt(strData.M);

        //Update
        var pl = this.getPlayer(name);
        pl.ag = pl.ag + money;

        this.myMoney.string = GameManager.getInstance().formatNumber(pl.ag);

        if (typeof pl !== 'undefined') {
            if (pl.pname === GameManager.getInstance().user.uname) {
                GameManager.getInstance().user.ag = AG;
                Global.MainView.updateChipAndSafe();
                this.getAM = true;
            }
        }
    },

    handleTip(strData) {
        cc.NGWlog('BauCuaLog->tip');
    },

    //--Function
    //Start animation
    showStart(time) {
        cc.NGWlog("Time la", time);
        this.stateGame = STATE_GAME.WAITING;
        this.restartGame();
        //Start animation
        var funcStart = cc.callFunc(() => {
            require('SoundManager1').instance.playStart();
            this.aniStart.node.active = true;
            this.aniStart.setAnimation(0, "animation", false);

            this.aniWin.node.active = false;
            this.spMask.node.active = false;
            this.spLose.node.active = false;
            require("GameManager").getInstance().time_out_game = 0;
        });

        var delStart = cc.delayTime(this.TIMEACTION.STARTANI);

        var delShake = cc.delayTime(this.TIMEACTION.STARTSHAKE);

        var funcShake = cc.callFunc(() => {
            require('SoundManager1').instance.playDiceShake();
            this.spBowl.node.active = false;
            if (this.aniStart.node.active) {
                this.aniStart.node.active = false;
            }

            this.aniShake.node.active = true;
            this.aniShake.setAnimation(0, "lac", false);

            let deactiveFunc = cc.callFunc(() => {
                this.spBowl.node.active = true;
                if (this.aniShake.node.active)
                    this.aniShake.node.active = false;
            })
            this.node.runAction(cc.sequence(delShake, deactiveFunc));
        });

        var funcBet = cc.callFunc(() => {
            this.spBowl.node.active = true;
            this.aniShake.node.active = true;
            this.aniShake.setAnimation(0, "khong lac", false);
        });

        var delBet = cc.delayTime(this.TIMEACTION.STARTBET);
        var timeDelayBet = 0.2;
        var act = null;
        if (time >= this.TIMEACTION.TIMEONBET + this.TIMEACTION.STARTANI + this.TIMEACTION.STARTSHAKE) {
            this.countTime = Math.floor(time - this.TIMEACTION.STARTANI - this.TIMEACTION.STARTSHAKE);
            act = cc.sequence(funcStart, delStart, funcShake, delShake);
            timeDelayBet += this.TIMEACTION.STARTANI + this.TIMEACTION.STARTSHAKE
        } else if (time >= this.TIMEACTION.TIMEONBET + this.TIMEACTION.STARTSHAKE) {
            this.countTime = Math.floor(time - this.TIMEACTION.STARTSHAKE);
            act = cc.sequence(funcShake, delShake);
            timeDelayBet += this.TIMEACTION.STARTSHAKE
        } else if (time >= this.TIMEACTION.TIMEONBET + this.TIMEACTION.STARTBET) {
            ///this.countTime = Math.floor(time - this.TIMEACTION.STARTBET);
            this.countTime = 15;
            act = cc.sequence(funcBet, delBet);
            timeDelayBet += this.TIMEACTION.STARTBET
        }
        if (act !== null) {
            this.aniNode.runAction(act);
        }

        let onbetFun = cc.callFunc(() => {
            this.aniShake.node.active = false;
            this.spMask.node.active = false;
            this.spLose.node.active = false;
            this.aniWin.node.active = false;

            this.onBet = true;
            for (let i = 0; i < this.btnBet.length; i++) {
                const btn = this.btnBet[i];
                btn.enabled = true;
            }

            //Show clock
            if (!this.aniClock.node.active) {
                this.showClock(true);
            }
        })
        if (time !== 0) {
            cc.NGWlog('cha co nhe === 0');
            this.aniNode.runAction(cc.sequence(cc.delayTime(timeDelayBet), onbetFun));
        }
      //  this.updateChipBet();
    },

    //Chip click
    updateChipBet() {
        //Caculate chip for this play bet
        cc.NGWlog('BauCuaLog->updateChipBet');
        //Check this player
        if (this.thisPlayer === null || this.btnChip.length == 0) {
            cc.NGWlog('BauCuaLog->updateChipBet: Error');
            return null;
        }

        var gold = this.thisPlayer.ag;

        //Caculate index max
        var x = 4;
        for (let i =  this.TEMP_VALUE_GOLD_COINS.length - 1; i >=0; i--) {
            const ag = this.TEMP_VALUE_GOLD_COINS[i];
            if (gold > ag) {
                x--;
                break;
            } 
                x = i;
            
        }

        if (x < 4)
            x = 4;

        //Set value for chip normal
        for (let i = 0; i < this.btnChip.length ; i++) {
            const btn = this.btnChip[i];
            btn.getComponent('Chip').setValue(this.TEMP_VALUE_GOLD_COINS[x - 4 + i]);
        }

        //Set value for chip allin
        
        //Set chip event
        for (let i = 0; i < this.btnChip.length; i++) {
            const btn = this.btnChip[i];
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "BauCuaView";
            clickEventHandler.handler = "onClickChip";
            // clickEventHandler.customEventData = '' + btn.getComponent('Chip').valueChip;
            clickEventHandler.customEventData = '' + i;

            btn.clickEvents = [];
            btn.clickEvents.push(clickEventHandler);
        }

        //Set default
        //this.setChipBet(0);

        //Check enable and disable
        this.lockChipBet();
    },

    lockChipBet() {
        var index = 4;
        for (let i = 0; i < this.btnChip.length; i++) {
            const btn = this.btnChip[i];
            if (btn.getComponent('Chip').valueChip > this.thisPlayer.ag) {
                btn.enabled = false;
                btn.node.color = new cc.Color(96, 96, 96);
                index--;
            } else {
                btn.enabled = true;
                btn.node.color = new cc.Color(255, 255, 255);
            }
           
        }

        if (index >= this.chipBetIndex)
            this.setChipBet(this.chipBetIndex);
        else
            this.setChipBet(index);
    },

    setChipBet(index) {
        var btn = this.btnChip[index];
        if (typeof btn !== 'undefined') {
            this.chipBetIndex = index;
            this.spChipGrow.node.position = btn.node.position.add(cc.v2(-1, 0));
            cc.NGWlog('BauCuaLog->setChipBet: Grow at %d', this.spChipGrow.node.position.x);
        }
        cc.NGWlog('BauCuaLog->setChipBet: User chip bet index %d', this.chipBetIndex);
    },

    //Chip
    flyChipBet(value, plName, gate, delayTime = 0) {
        //Caculate position
        var ratX = 0.7;
        var ratY = 0.7;
        let type = -1;
        if (this.getGateType(gate) === this.GATETYPE.RECTANGLE_TINYV) {
            cc.log('bet chip 1');
            ratX = 0.05;
            ratY = 0.7;
            type = 1;
        }
        if (this.getGateType(gate) === this.GATETYPE.RECTANGLE_TINYH) {
            cc.log('bet chip 2');
            ratY = 0.05;
            ratX = 0.7;
            type = 2;
        }
        if (this.getGateType(gate) == this.GATETYPE.SQUARE) {
            cc.log('bet chip 3');
            ratX = 0.4;
            ratY = 0.4;
            type = 3;
        }

        var opos = this.dearlerPos;
        var idGate = gate - 1;

        if (plName !== null && plName === GameManager.getInstance().user.uname) {
            var pl = this.getPlayer(plName);
            if (pl === null) return null;
            opos = this.mypos; //this.getPlayer(plName)._playerView.node.position; 
        }
        var btn = this.btnBet[idGate];
       // var posX = btn.node.position.x + ratX * (Math.random() - 0.5) * btn.node.width;
        var posX = btn.node.position.x;
        // var posY = btn.node.position.y + ratY * (Math.random() - 0.5) * btn.node.height;
        var posY = btn.node.position.y;
        var npos = cc.v2(posX, posY);
        //Create chip
        var chip = this.createChip(value, opos, npos, type);
        return chip;
    },

    createChip(value, opos, npos, type) {
        //Create chip
        var count = 0;
        var chip = cc.instantiate(this.preChip).getComponent('Chip');
        chip.setValue(value, value);

        for (let i = 0; i < this.TEMP_VALUE_GOLD_COINS.length; i++) {
            if (value === this.TEMP_VALUE_GOLD_COINS[i]) {
                count++;
                break;
            }
        }

        if (count == 0) {
            var nodeText = new cc.Node('Label');
            var labelText = nodeText.addComponent(cc.Label);

            var outline = nodeText.addComponent(cc.LabelOutline);
            outline.color = new cc.Color(0, 0, 0);
            outline.width = 2;

            labelText.cacheMode = 2;
            labelText.string = GameManager.getInstance().formatMoneyChip(value).replace(/(.)(?=(\d{3})+$)/g, '$1,');;
            labelText.fontSize = 30;
            labelText.lineHeight = 30;

            if (value > 1000) {
                labelText.fontSize = 26;
                labelText.lineHeight = 26;
            }

            labelText.horizontalAlign = 1;
            labelText.verticalAlign = 1;
            labelText.node.color = new cc.Color(0, 0, 0);
            chip.node.addChild(labelText.node);
        }

        chip.node.position = opos;
        chip.node.scale = 0.5;
        // if(type !== 3)
        // chip.node.scale = 0.4;
        this.listTag[this.BAUCUATAG.CHIP].push(chip);
        this.spTable.node.addChild(chip.node, 1);

        //Move chip
        this.flyChip(chip, npos)

        return chip;
    },

    flyChip(chip, npos, delay = 0) {
        var del = cc.delayTime(delay);
        var move = cc.moveTo(this.TIMEACTION.CHIPFLY, npos);
        var rot = cc.rotateBy(this.TIMEACTION.CHIPFLY * 0.7, 0);
        var eff = cc.spawn(move, rot).easing(cc.easeIn(0.6));
        var act = cc.sequence(del, eff);
        chip.node.runAction(act);
        return act;
    },

    //Grow
    createGrow(gate, repeatEff = 1, rm = true) {
        var resource = "";
        var scaleX = 0.97;
        var scaleY = 0.97;

        //Get resource
        var gateType = this.getGateType(gate);
        switch (gateType) {
            case this.GATETYPE.SQUARE:
                resource = this.spfGrow[0];
                break;
            case this.GATETYPE.RECTANGLE:
                resource = this.spfGrow[1];
                break;
            case this.GATETYPE.RECTANGLE_CURVED:
                resource = this.spfGrow[2];
                if (gate == 13) {
                    scaleX = -0.97;
                    scaleY = 0.97;
                } else if (gate == 14) {
                    scaleX = 0.97;
                    scaleY = 0.97;
                } else if (gate == 16) {
                    scaleX = 0.97;
                    scaleY = -0.97;
                } else if (gate == 17) {
                    scaleX = -0.97;
                    scaleY = -0.97;
                }
                break;
            case this.GATETYPE.RECTANGLE_TINYH:
                resource = this.spfGrow[4];
                break;
            case this.GATETYPE.RECTANGLE_TINYV:
                resource = this.spfGrow[3];
                break;
        }

        //Create
        var nodeGrow = new cc.Node('Sprite');
        var spGrow = nodeGrow.addComponent(cc.Sprite);
        spGrow.spriteFrame = resource;
        nodeGrow.position = this.btnBet[gate - 1].node.position;
        nodeGrow.scaleX = scaleX;
        nodeGrow.scaleY = scaleY;
        nodeGrow.opacity = 0;
        this.listTag[this.BAUCUATAG.BETGROW].push(spGrow);
        this.spTable.node.addChild(nodeGrow, 0);

        //Effect
        var fadeI = cc.fadeIn(this.TIMEACTION.GROWBET * 0.5);
        var fadeO = cc.fadeOut(this.TIMEACTION.GROWBET - fadeI.getDuration());
        var fade = cc.sequence(fadeI, fadeO).easing(cc.easeOut(0.6));
        var eff = cc.repeat(fade, repeatEff);
        var rmv = cc.callFunc(() => {
            if (typeof nodeGrow !== 'undefined') {
                nodeGrow.destroy();
            }
        });
        if (rm) {
            var act = cc.sequence(eff, rmv);
        } else {
            var act = cc.sequence(eff, fadeI);
        }

        nodeGrow.runAction(act);
    },

    //Show bet
    showChipBet() { // show chip bet cua minh

        for (let i = 0; i < this.list_spBet.length; i++) {
            var sp = this.list_spBet[i];
            var lb = this.list_lbBet[i];
            sp.node.active = false;
            lb.string = '';
        }

        var ArrTG = [];
        for (let i = 0; i < this.listUserSum.length; i++) {
            let ide1 = -1;
            var list1 = this.listUserSum[i];
            for (let j = 0; j < ArrTG.length; j++) {
                if (ArrTG[j].gate === list1.gate) {
                    ide1 = j;
                    break;
                }
            }

            if (ide1 === -1) {
                var obj = {};
                obj.gate = list1.gate;
                obj.chip = list1.chip;
                ArrTG.push(obj);
            } else {
                ArrTG[ide1].chip += list1.chip;
            }
        }

        for (let i = 0; i < this.listUserBet.length; i++) {
            let ide1 = -1;
            var list1 = this.listUserBet[i];
            for (let j = 0; j < ArrTG.length; j++) {
                if (ArrTG[j].gate === list1.gate) {
                    ide1 = j;
                    break;
                }
            }

            if (ide1 === -1) {
                var obj = {};
                obj.gate = list1.gate;
                obj.chip = list1.chip;
                ArrTG.push(obj);
            } else {
                ArrTG[ide1].chip += list1.chip;
            }
        }

        for (let i = 0; i < ArrTG.length; i++) {
            let gate = ArrTG[i].gate;
            let chip = ArrTG[i].chip;
            this.list_spBet[gate - 1].node.active = true;
            this.list_lbBet[gate - 1].string = GameManager.getInstance().formatMoneyAg(chip);
        }
    },

    showAllChipBet(plName, gate, ag) { //show chip bet cua tat ca
        var userBet = null;
        var plIndex = -1;
        for (let i = 0; i < this.listAllChipBet.length; i++) {
            const list = this.listAllChipBet[i];
            if (list[0] === gate) {
                userBet = list;
                plIndex = i;
                break;
            }
        }

        //-Add gate if missing
        if (plIndex === -1) {
            userBet = [];
            //Push gate at 0
            userBet.push(gate);
            //Push label at 1
            userBet.push(ag);
            //Push label at 2
            userBet.push(1);
            //Push label at 3
            userBet.push([plName]);
            //Push label at 4
            var nodeBet = new cc.Node('Sprite');
            var spBet = nodeBet.addComponent(cc.Sprite);
            spBet.spriteFrame = this.spfBgGoldTable;
            //spBet.node.setContentSize(cc.size(100, 45));
            this.listTag[this.BAUCUATAG.BGCHIPBET].push(spBet);
            this.spTable.node.addChild(nodeBet, 12);
            userBet.push(spBet);
            cc.log('bet to gate ?? : ', gate);
            if (gate === 3 || gate === 5 || gate === 6) {
                nodeBet.position = this.btnBet[gate - 1].node.position.add(cc.v2(0, 70));
            } else if (gate === 1 || gate === 2 || gate === 4) {
                nodeBet.position = this.btnBet[gate - 1].node.position.add(cc.v2(0, 95));
            } else if (gate === 13 || gate === 8 || gate === 15 || gate === 17 || gate === 14 || gate === 20 || gate === 10 || gate === 16) {
                nodeBet.position = this.btnBet[gate - 1].node.position.add(cc.v2(0, 40));
            } else if (gate === 9 || gate === 7 || gate === 21 || gate === 18) {
                nodeBet.position = this.btnBet[gate - 1].node.position.add(cc.v2(0, 60));
            } else {
                nodeBet.position = this.btnBet[gate - 1].node.position.add(cc.v2(-60, 0));
            }

            var nodeText = new cc.Node('Label');
            nodeText.position = cc.v2(0, 0);
            var labelText = nodeText.addComponent(cc.Label);

            labelText.cacheMode = 2;
            labelText.string = GameManager.getInstance().formatMoneyAg(ag) + '/' + 1;
            labelText.fontSize = 20;
            labelText.lineHight = 25;
            labelText.node.color = new cc.Color(255, 255, 255);

            nodeBet.addChild(labelText.node, 3);
            userBet.push(labelText);
            this.listAllChipBet.push(userBet);
        } else {
            userBet[1] += ag;
            cc.NGWlog();
            for (let i = 0; i < userBet[3].length; i++) {
                let name = userBet[3][i];
                let count = 0;
                if (plName !== name) {
                    count++;
                }
                if (count == userBet[3].length) userBet[3].push(plName);
            }
            userBet[5].getComponent(cc.Label).string = GameManager.getInstance().formatMoneyAg(userBet[1]) + "/" + userBet[3].length;
        }
    },

    //Show scratch
    showScratch(dice1, dice2, dice3, isOpen) {
        //Showscratch
        this.aniShake.node.active = true;
        var pos = [];
        var timeI = 0.0;
        var timeD = 0.0;
        var timeO = 0.0;
        var timeH = 4.0;

        pos = [cc.v2(6, 89), cc.v2(-71, 5), cc.v2(88, 2)];
        timeI = this.TIMEACTION.FINISHOPENSCRATCH;
        timeD = 3.0;
        timeO = 0.3;
        timeH = 2.5;
        //Hide plate
        var delS = cc.delayTime(timeH);
        var hideS = cc.callFunc(() => {
            if (this.aniShake.node.active) {
                this.removeTag(this.BAUCUATAG.DICE);
                this.aniShake.node.active = false;
                cc.NGWlog('BauCuaLog->showScratch: hide scratch done');
            }
        });
        var actS = cc.sequence(delS, hideS);
        cc.NGWlog('BauCuaLog->showScratch: time hide %d', timeH);
        cc.NGWlog('BauCuaLog->showScratch: time delay hide %d', delS.getDuration());
        this.aniShake.node.runAction(actS);

        //Remove all dice
        this.removeTag(this.BAUCUATAG.DICE);

        //Set animation
        this.aniShake.setAnimation(0, 'open', false);
        for (let i = 0; i < 3; i++) {
            let value = 0;
            if (i == 0) value = dice1;
            else if (i == 1) value = dice2;
            else if (i == 2) value = dice3;

            let dice = cc.instantiate(this.preDice).getComponent('Dice');
            dice.getComponent('Dice').setValue(value);
            dice.node.position = pos[i];
            dice.node.opacity = 0;
            this.listTag[this.BAUCUATAG.DICE].push(dice);
            this.aniShake.node.addChild(dice.node);

            //Effect
            let fadeI = cc.fadeIn(timeI);
            let del = cc.delayTime(timeD);
            let fadeO = cc.fadeOut(timeO);
            let rmv = cc.callFunc(() => {
                if (typeof dice !== 'undefined') {
                    this.listTag[this.BAUCUATAG.DICE].splice(this.listTag[this.BAUCUATAG.DICE].indexOf(dice), 1);
                    dice.node.destroy();
                }
            });
            let act = cc.sequence(fadeI, del, fadeO, rmv);
            dice.node.runAction(act);
        }
    },

    //Show clock
    showClock(isShow) {
        cc.NGWlog('BauCuaLog->showclock: %s - Time %d', isShow, this.countTime);
        this.aniClock.node.stopAllActions();
        this.aniClock.node.active = false;
        if (isShow) {
            if (this.countTime === 0) return null;
            this.aniClock.node.active = true;

            var del = cc.delayTime(1.0);
            var time = cc.callFunc(() => {

                this.aniWin.node.active = false;
                this.spMask.node.active = false;
                this.spLose.node.active = false;
                this.removeTag(this.BAUCUATAG.BETGROW);

                this.countTime -= require("GameManager").getInstance().time_out_game;
                require("GameManager").getInstance().time_out_game = 0;

                this.lbTime.string = this.countTime.toString();
                if (this.countTime >= 0) {
                    this.countTime--;
                    if (this.countTime > 5) {
                        require('SoundManager1').instance.playClockTick();
                        this.aniClock.setAnimation(0, 'animation', false);
                    } else {
                        require('SoundManager1').instance.playClockHurry();
                        this.aniClock.setAnimation(0, 'animation', true);
                    }
                } else {
                    this.aniClock.node.stopAction();
                    this.aniClock.node.active = false;
                }
            });
            var eff = cc.sequence(time, del);
            var act = cc.repeatForever(eff);
            this.aniClock.node.runAction(act);
            cc.NGWlog('BauCuaLog->showclock done');
        } else {
            this.countTime = -1;
            cc.NGWlog('BauCuaLog->hideclock done');
        }
    },

    //History
    updateHistory() {
        if (this.button_hist.node.children.length > 1) {
            this.button_hist.node.getChildByName('dice').destroy();
        }

        let hist = this.diceHistory[this.diceHistory.length - 1]

        let item = cc.instantiate(this.preHist).getComponent('BauCuaHistoryItem');
        item.getComponent('BauCuaHistoryItem').init(hist[0], hist[1], hist[2]);
        item.node.position = cc.v2(0, -28);
        this.button_hist.node.addChild(item.node, 0, 'dice');
    },
    showHistory() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowHistory_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.popupListHistory.init();
        if (this.popupListHistory.node.getParent() === null)
            this.node.addChild(this.popupListHistory.node, GAME_ZORDER.Z_MENU_VIEW);
    },
    showListPlayer() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowNodeMorePlayer_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.players.length > 1) {
            this.popupListPlayer.init(this.players);
            if (this.popupListPlayer.node.getParent() === null)
                this.node.addChild(this.popupListPlayer.node, GAME_ZORDER.Z_MENU_VIEW);
        }
    },
    updatePlayers() { //hien thi buttom morew player
        cc.NGWlog('so nguoi choi la ', this.players.length)

        let strNum = "+" + (this.players.length - 1);
        this.number_player.string = strNum;
        if (this.players.length - 1 <= 0) {
            this.button_player.node.active = false;
        } else {
            this.button_player.node.active = true;
        }
    },
    //--Function support
    getGateType(gate) {
        if (this.gate[this.GATETYPE.SQUARE].indexOf(gate) != -1) {
            return this.GATETYPE.SQUARE;
        } else if (this.gate[this.GATETYPE.RECTANGLE].indexOf(gate) != -1) {
            return this.GATETYPE.RECTANGLE;
        } else if (this.gate[this.GATETYPE.RECTANGLE_CURVED].indexOf(gate) != -1) {
            return this.GATETYPE.RECTANGLE_CURVED;
        } else if (this.gate[this.GATETYPE.RECTANGLE_TINYH].indexOf(gate) != -1) {
            return this.GATETYPE.RECTANGLE_TINYH;
        } else if (this.gate[this.GATETYPE.RECTANGLE_TINYV].indexOf(gate) != -1) {
            return this.GATETYPE.RECTANGLE_TINYV;
        } else {
            return null;
        }
    },

    restartGame() {
        if(cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
        this.totalMyBet = 0;
        this.lb_total_my_bet.string = GameManager.getInstance().formatMoney(this.totalMyBet);
        this.spMask.node.active = false;
        this.gateData = [];
        this.listUserBet = [];
        this.listUserSum = [];

        // clean 
        for (let j = 0; j < this.btnBet.length; j++) {
            this.btnBet[j].node.opacity = 1;
        }

        // hide all lb myBet 
        for (let i = 0; i < this.list_spBet.length; i++) {
            var sp = this.list_spBet[i];
            var lb = this.list_lbBet[i];
            sp.node.active = false;
            lb.string = '';
        }

        //Update player money
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (player === null || typeof player === 'undefined') {
                continue;
            }

            if (player._playerView !== null)
                player.updateMoney();

            if (player.pname === this.thisPlayer.pname) {
                this.lockChipBet();
            }
        }

        //Clean chip bet
        for (let i = 0; i < this.listAllChipBet.length; i++) {
            var userBet = this.listAllChipBet[i];

            for (let j = 0; j < userBet.length; j++) {
                if (j <= 3) {
                    userBet[j] = null;
                } else {
                    if (typeof userBet[j] !== 'undefined') {
                        userBet[j].node.destroy();
                        userBet[j] = null;
                    }
                }
            }
        }
        this.listAllChipBet = [];


        //Clean chip
        for (let i = 0; i < this.listChip.length; i++) {
            const list = this.listChip[i];
            if (list[0] === null) { continue };
            list[0] = null;
            for (let j = 0; j < list[1].length; j++) {
                const listChip = list[1][j];
                if (listChip[0] === null || typeof listChip[0] === 'undefined') { continue; }
                listChip[0] = null;

                if (listChip[1] === null || typeof listChip[1] === 'undefined') { continue; }
                listChip[1].node.destroy();
                listChip[1] = null;
            }
        }
        this.listChip = [];

        //clean bonus
        for (let i = 0; i < this.list_spBonus.length; i++) {
            let list = this.list_spBonus[i];
            if (typeof list[0] !== 'undefined') {
                list[0].destroy();
                list[0] = null;
            }
            if (typeof list[0] !== 'undefined') {
                list[1].destroy();
                list[1] = null;
            }
        }
        this.list_spBonus = [];
        //Hide clock
        if (this.aniClock.node.active) {
            this.showClock(false);
        }

        //Animation
        //Clear animation node
        this.aniNode.stopAllActions();
        this.node.stopAllActions();
        this.aniShake.node.active = false;
        this.aniStart.node.active = false;
        this.aniClock.node.active = false;
        this.aniWin.node.active = false;
        this.spLose.node.active = false;

        // disable btn bet
        this.onBet = false;
        for (let i = 0; i < this.btnBet.length; i++) {
            const btn = this.btnBet[i];
            btn.enabled = false;
        }
        //Remove tag
        this.removeTag(this.BAUCUATAG.CHIP);
        this.removeTag(this.BAUCUATAG.BETGROW);
        this.removeTag(this.BAUCUATAG.BGCHIPBET);
        this.removeTag(this.BAUCUATAG.DICE);

        //disable button deal
        this.button_deal.interactable = false;
        this.button_cancel.interactable = false;
    },

    removeTag(tag) {
        for (let i = 0; i < this.listTag[tag].length; i++) {
            const item = this.listTag[tag][i];
            if (item === null || typeof item === 'undefined') {
                continue
            } else {
                if (item.node === null || typeof item.node === 'undefined') { continue; }
                item.node.destroy();
            }
        }
        this.listTag[tag] = [];
    },

    onLeave() {
        this._super();
    },

    setReadyAllPl() {
        //Set player ready
        for (let i = 0; i < this.players.length; i++) {
            const pl = this.players[i];
            if (typeof pl !== 'undefined' && pl !== null) continue;
            var plv = pl._playerView;
            if (typeof plv !== 'undefined' && plv !== null) continue;
            plv.setReady(true);
        }
    },

    //--Click function
    onClickChip(event, data) {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let index = parseInt(data);
        this.setChipBet(index);
    },


    onClickBet(event, data) {

        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBet_%s", require('GameManager').getInstance().getCurrentSceneName()));

        if (!this.onBet) return;
        let gate = parseInt(data) + 1;
        let ag = this.btnChip[this.chipBetIndex].getComponent('Chip').valueChip;
        if ( this.thisPlayer.ag <= 0 ) {
            GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('not_enought_gold'));
        } else {
             if(this.totalMyBet >= this.thisPlayer.ag) {
                GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('not_enought_gold'));
                return;
             }
             if (ag + this.totalMyBet > this.thisPlayer.ag) {
                ag = this.thisPlayer.ag  - this.totalMyBet;
                //GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('not_enought_gold'));
                //return;
             }
             else if (ag > this.thisPlayer.ag) ag = this.thisPlayer.ag
          
            // enable button
            this.button_deal.interactable = true;
            this.button_cancel.interactable = true;

            //push data in array deal
            let ide = -1;
            for (let i = 0; i < this.gateData.length; i++) {
                if (this.gateData[i].gate === gate) {
                    ide = i;
                    break;
                }
            }

            if (ide === -1) {
                var obj = {};
                obj.gate = gate;
                obj.chip = ag;
                this.gateData.push(obj);
            } else {
                this.gateData[ide].chip += ag;
            }

            //Grow table
            this.createGrow(gate);

            //Show chip
            let ide1 = -1;
            for (let i = 0; i < this.listUserSum.length; i++) {
                if (this.listUserSum[i].gate === gate) {
                    ide1 = i;
                    break;
                }
            }

            if (ide1 === -1) {
                var obj = {};
                obj.gate = gate;
                obj.chip = ag;
                this.listUserSum.push(obj);
            } else {
                cc.NGWlog('ide cua listUserSum ' + ide1)
                this.listUserSum[ide1].chip += ag;
            }

            this.totalMyBet += ag;
            this.lb_total_my_bet.string = GameManager.getInstance().formatMoney(this.totalMyBet);

            this.showChipBet();
        }
    },

    onclickCancel() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCancelBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.totalMyBet = 0;
        this.lb_total_my_bet.string = GameManager.getInstance().formatMoney(this.totalMyBet);
        this.button_deal.interactable = false;
        this.button_cancel.interactable = false;
        this.gateData = [];
        this.listUserSum = [];
        this.showChipBet();
    },
    onclickDeal() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDealBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let val = '';
        let index = '';
        let sum = 0;
        for (let i = 0; i < this.gateData.length; i++) {
            if (i !== this.gateData.length - 1) {
                index += this.gateData[i].gate + ';';
                val += this.gateData[i].chip + ';';
            } else {
                index += this.gateData[i].gate;
                val += this.gateData[i].chip;
            }
            sum += this.gateData[i].chip;
        }
        cc.NGWlog("Val la %s, index la %s, sum la %d", val, index, sum);

        if (val === '') return;

        require('NetworkManager').getInstance().sendBet(val, index);
        //GameManager.getInstance().onShowToast(cc.js.formatStr(GameManager.getInstance().getTextConfig('txt_successful_bet'), sum));
        //show msg success

        var str = cc.js.formatStr(GameManager.getInstance().getTextConfig('txt_successful_bet'), sum);
        var siz = cc.view.getVisibleSize();
        var toast = new cc.Node('Sprite');
        var spBack = toast.addComponent(cc.Sprite);
        let nodeLabel = new cc.Node('Label');
        let componentLabel = nodeLabel.addComponent(cc.Label);
        componentLabel.string = str;
        componentLabel.fontSize = 30;
        componentLabel.lineHeight = 30;
        toast.addChild(nodeLabel);
        spBack.spriteFrame = this.spfBgGoldTable;
        spBack.type = cc.Sprite.Type.SLICED;
        spBack.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        spBack.node.setContentSize(siz.width * 0.6, 60);
        toast.position = cc.v2(0, 0);
        this.node.addChild(toast);
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            toast.destroy()
        }, 1000);

        this.button_deal.interactable = false;
        this.button_cancel.interactable = false;
        this.totalMyBet = 0;
        this.gateData = [];
        this.listUserSum = [];
    },
    onClickBack() {
        this._super();
    },
    onClickchat() {
        this._super();
    },
    onclickMask() {
        cc.NGWlog('clicked');
    }
});

module.export = BauCuaView;