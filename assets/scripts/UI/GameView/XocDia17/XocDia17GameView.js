const GameView = require('GameView2');
const Player = require('Player');
const GameManager = require('GameManager'); 
const XocDia17GameView = cc.Class({
    extends: GameView,
    properties: {
        listChipForBet: {
            type: [cc.Button],
            default: [],
        },
        listBtnBet: {
            type: [cc.Button],
            default: []
        },
        chipForFly: {
            type: cc.Prefab,
            default: null
        },
        historyNode: {
            type: cc.Node,
            default: null
        },
        historyChildren: {
            type: cc.Prefab,
            default: null,
        },
        historyLabels: {
            type: [cc.Label],
            default: []
        },
        bowl: {
            type: cc.Node,
            default: null,
        },
        arrayLabelTop: {
            type: [cc.Label],
            default: [],
        },
        arrayLabelBottom: {
            type: [cc.Label],
            default: [],
        },
        bowlControl: {
            type: cc.Node,
            default: null
        },
        plateControl: {
            type: cc.Node,
            default: null
        },
        chipResultControl: {
            type: [cc.Node],
            default: []
        },
        chipVang: {
            type: cc.SpriteFrame,
            default: null,
        },
        chipTrang: {
            type: cc.SpriteFrame,
            default: null,
        },
        khungVuong: {
            type: cc.SpriteFrame,
            default: null
        },
        timerControl: {
            type: cc.Node,
            default: null
        },
        khungTron: {
            type: cc.SpriteFrame,
            default: null
        },
        animStart: {
            type: sp.Skeleton,
            default: null
        },
        animBet: {
            type: sp.Skeleton,
            default: null
        },
        animBat: {
            type: sp.Skeleton,
            default: null
        },
        chipBorder: {
            type: cc.Sprite,
            default: null
        },
        nodeReturn: {
            type: cc.Node,
            default: null
        },
        listBtnMask: {
            type: [cc.Sprite],
            default: []
        }
    },
    onLoad() {
        //Chip Fly Action
        this.node.stopAllActions();
        this._super();
        this.timeToBet = 18;
        this.chipPool = new cc.NodePool();
        this.putItemToNodePool();
        this.playerViewPool = require('UIManager').instance.playerViewPool;
        this.players = [];
        this.thisPlayer = null;
        this.stateGame = null;
        this.CurrentChipSelected = 0;
        this.TEMP_VALUE_GOLD_COINS = [
            1,
            5,
            10,
            50,
            100,
            500,
            1000,
            5000,
            10000,
            50000,
            100000,
            500000,
            1000000,
            5000000,
            10000000,
            50000000,
            100000000,
            500000000,
            1000000000,
            5000000000
        ];
        this.buttonBetVector = [];
        this.gateValue = [
            0,
            0,
            0,
            0,
            0,
            0
        ];
        this.gateNumber = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        this.selfGateValue = [
            0,
            0,
            0,
            0,
            0,
            0
        ];
        this.getButtonBetVector();
        this.bowlPos = this.bowlControl.position;
        this.platePos = this.plateControl.position;
        this.aniObj = {
            animStart: 'animation',
            animBet: 'animation'
        };
        this.isXoc = false;
        this.hideAction = cc.hide();
        this.CurrentChipSelected = 0;
        this.ChipReturnArray = [];
        this.nodeGroupMenu = Global.GroupOptionInGame;
        this.nodeGroupMenu.onShowAllItem();
        this.nodeGroupMenu.onHideItem(5);
        this.setup2dArray();
        this.historySprieState = 0;
        this.HISTORY_LAST_VALUE = null;
        this.HISTORY_STATE_IS_VERTICAL = false;
        this.HISTORY_LAST_RESULT_COL = 0;
        this.HISTORY_LAST_RESULT_ROW = 0;
        this.HISTORY_STREAK = 0;
        this.HISTORY_COL_BEFORE_STREAK = null;
        this.dataHistory = '';
        this.chipBetIndex = 0;
    },
    // update(dt) {
    //     if (this.isXoc) {
    //         this.bowlControl.x = Math.sin(this.bowlControl.x - 10) * (this.bowlControl.x + 10);
    //         this.plateControl.x = this.bowlControl.x;
    //     }
    // },
    setGameInfo() {},
    getPositionToInsertSprite(e, result) {
        result = parseInt(result);
        //First Time 
        if (this.HISTORY_LAST_VALUE == null) {
            this.HISTORY_LAST_RESULT_ROW = 0;
            this.HISTORY_LAST_RESULT_COL = 0;
            this.HISTORY_LAST_VALUE = result;
            this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
        } else {
            // Kết quả giống ván trước
            if (result == this.HISTORY_LAST_VALUE) {
                if (this.HISTORY_STREAK == 0) {
                    this.HISTORY_STATE_IS_VERTICAL = true;
                }
                this.HISTORY_STREAK++;
                // Đang chạy dọc
                if (this.HISTORY_STATE_IS_VERTICAL) {

                    // Nếu max cột dọc hoặc vị trí tiếp theo đã có sprite
                    if (this.HISTORY_LAST_RESULT_ROW >= 5 || this.historyArray[this.HISTORY_LAST_RESULT_ROW + 1][this.HISTORY_LAST_RESULT_COL] == 1) {
                        this.HISTORY_STATE_IS_VERTICAL = false;
                        this.HISTORY_LAST_RESULT_COL++;
                        this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                    } else {
                        if (this.historyArray[this.HISTORY_LAST_RESULT_ROW + 1][this.HISTORY_LAST_RESULT_COL] == 1) {
                            this.HISTORY_STATE_IS_VERTICAL = false;
                            this.HISTORY_LAST_RESULT_COL++;
                            this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                        } else {
                            this.HISTORY_LAST_RESULT_ROW++;
                            this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                        }
                    }
                    if (this.HISTORY_STREAK == 5) {
                        // 5 Ván liên tiếp thì lưu lại vị trí ngang
                        this.HISTORY_COL_BEFORE_STREAK = this.HISTORY_LAST_RESULT_COL;
                    }
                // Đang chạy ngang
                } else {
                    this.HISTORY_LAST_RESULT_COL += 1;
                    this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                }
                this.HISTORY_LAST_VALUE = result;
            }
            // Kết quả không giống ván trước
            else {
                // Mặc định quay lại thằng đầu tiên trống trên hàng 1
                for (let j = 0; j < this.historyArray[0].length; j++) {
                    if (this.historyArray[0][j] == 0) {
                        this.HISTORY_LAST_RESULT_COL = j;
                        break;
                    }
                }
                this.HISTORY_STREAK = 0;
                this.HISTORY_LAST_RESULT_ROW = 0;
                this.HISTORY_COL_BEFORE_STREAK = null;
                this.HISTORY_LAST_VALUE = result;
                this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
            }
        }
        //re`Reset History Board
        cc.NGWlog(this.HISTORY_LAST_RESULT_COL, 'COLCKECK')
        if (this.HISTORY_LAST_RESULT_COL == 49) {
            this.resetHistoryBoard();
        }
        let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_RESULT_COL, this.HISTORY_LAST_RESULT_ROW);
        this.setPositionSpriteHistory(vector, result);
    },
    convertArrayIndexToPosition(col, row) {
        return cc.v2((col * 19), (row * -19));
    },
    //DEV-DOING
    resetHistoryBoard() {
        // reset 
        this.HISTORY_LAST_VALUE == null
        this.HISTORY_LAST_RESULT_COL = 0;
        this.HISTORY_LAST_RESULT_ROW = 0;
        this.HISTORY_STREAK = 0;
        this.HISTORY_COL_BEFORE_STREAK = null;
        //reset 2D array
        this.reset2DArray();

        //reset Node Sprite
        this.historyNode.removeAllChildren();

        //Import 40 last History
        let length = this.dataHistory.length;
        this.ImportHistory(this.dataHistory.substring(length - 80));
    },
    setPositionSpriteHistory(vector, state) {
        let item = cc.instantiate(this.historyChildren).getComponent('HistoryManager');
        if (state === 1) {
            item.setTextture(0);
        } else {
            item.setTextture(1);
        }
        item.node.setAnchorPoint(0, 1);
        item.node.setPosition(vector);
        this.historyNode.addChild(item.node);
    },
    setup2dArray() {
        this.historyArray = new Array(6);
        for (let i = 0; i < this.historyArray.length; i++) {
            this.historyArray[i] = new Array(50);
        }
        for (let j = 0; j < 6; j++) {
            for (let k = 0; k < 50; k++) {
                this.historyArray[j][k] = (0)
            }
        }
    },
    reset2DArray() {
        for (let i = 0; i < this.historyArray.length; i++) {
            for (let j = 0; j < this.historyArray[i].length; j++) {
                this.historyArray[i][j] = 0;
            }
        }
    },
    putItemToNodePool() {
        if (this.chipPool.size() >= 180) {
            return;
        }
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let chipForFly = cc.instantiate(this.chipForFly);
            chipForFly.playerID = '';
            this.chipPool.put(chipForFly);
        }
    },
    /* EVT handle block */
    handleCTable(strData) {
        //varible
        let data = JSON.parse(strData);
        let player = data.ArrP[0];
        this.agTable = data.M;

        //Control flow
        this.thisPlayer = new Player();
        this.players.push(this.thisPlayer);
        if (this.playerViewPool.size() < 1) {
            this.thisPlayer._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');

        } else {
            this.thisPlayer._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');

        }
        this.node.addChild(this.thisPlayer._playerView.node);
        this.readDataPlayer(this.thisPlayer, player);
        this.thisPlayer.updatePlayerView();
        this.updatePositionPlayerView();
        this.addChatJoin(this.thisPlayer.displayName);

        //Game State + Info
        this.thisPlayer.setHost(true);
        this.stateGame = STATE_GAME.WAITING;
        this.setGameInfo(data.AG);
        this.updateChipBet();
        this.getButtonChipBetReady();

        //Table Ready
        this.setStateButton(false);
        require('GameManager').instance.onShowToast('Waiting For Game Start...', 5);
        // Put Item To Node Pool
        this.putItemToNodePool();
    },
    handleJtable(strData) {
        let listPlayer = JSON.parse(strData);
        let player = new Player();
        this.players.push(player);
        if (this.playerViewPool.size() < 1) {
            player._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
        } else {
            player._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
        }
        this.node.addChild(player._playerView.node , GAME_ZORDER.Z_PLAYERVIEW  );
        this.readDataPlayer(player, listPlayer);
        player.updatePlayerView();
        this.addChatJoin(player.displayName);
        this.updatePositionPlayerView();
    },
    handleLTable(data) {
        this._super(data);
    },
    handleChatTable(data) {
        this._super(data);
    },
    handleSTable(strData) {
        // PlayerView
        this.setStateButton(false);
        for (let i = 0; i < this.players.length; i++) {
            this.playerViewPool.put(this.players[i]._playerView.node);
        }
        let data = JSON.parse(strData);

        this.agTable = data.M;

        this.stateGame = STATE_GAME.WAITING;
        let listPlayer = data.ArrP;
        let lTemp = [];
        for (let i = 0; i < listPlayer.length; i++) {
            let player = new Player();
            lTemp.push(player);
            if (this.playerViewPool.size() < 1) {
                player._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
            } else {
                player._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
            }

            this.node.addChild(player._playerView.node ,  GAME_ZORDER.Z_PLAYERVIEW);
            this.readDataPlayer(player, listPlayer[i]);
            if (player.id === GameManager.getInstance().user.id) {
                this.thisPlayer = player;
            }
            player.updatePlayerView();
        }
        this.players = lTemp;
        this.addChatJoin(this.thisPlayer.displayName);
        this.updatePositionPlayerView();

        //History
        this.updateChipBet();
        this.getButtonChipBetReady();
        if (data.H.length > 0) {
            this.dataHistory += data.H;
        }
        this.ImportHistory(data.H);

        //Join Table When Game Already Started
        let timeRemaining = data.T;
        if (timeRemaining !== 0) {
            if (timeRemaining > 22 && timeRemaining <= 25) {
                this.node.runAction(cc.sequence(
                    cc.delayTime(25 - timeRemaining - 0.5),
                    cc.callFunc(() => this.animationControl('animBet')),
                    cc.delayTime(1),
                    cc.callFunc(
                        () => this.animationOff('animBet'),
                        this.setTimer(),
                        this.setStateButton(true)
                    )
                ))
            } else if (timeRemaining > 18 && timeRemaining <= 22) {
                this.node.runAction(cc.sequence(
                    cc.callFunc(() => this.animationControl('animBet')),
                    cc.delayTime(1),
                    cc.callFunc(
                        () => this.animationOff('animBet'),
                        this.setTimer(),
                        this.setStateButton(true),
                    )
                ))
            } else {
                this.timeToBet = timeRemaining;
                this.setTimer();
                this.setStateButton(true);
            }
        }
    },
    handleStartGame() {

        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.setTimer();
            this.setStateButton(true);
        }, 6000);
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.animationControl('animStart');
                require('SoundManager1').instance.playStart();
            }),
            cc.delayTime(1),
            cc.callFunc(() => this.animationOff('animStart')),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                
                this.plateControl.getComponent(cc.Sprite).enabled = false;
                this.bowlControl.active = false;
                this.animBat.node.active = true;
                
                this.animBat.setAnimation(0,'xoc bat',false);

                setTimeout(() => {
                    if (this.node == null || typeof this.node == 'undefined') return;
                    require('SoundManager1').instance.playDiceShake();
                }, 1000);
            }),
            cc.delayTime(3.7),
            cc.callFunc(() => {
                this.animBat.node.active = false;
                this.bowlControl.active = true;
                this.plateControl.getComponent(cc.Sprite).enabled = true;
                this.bowlControl.position = this.bowlPos;
                this.plateControl.position = this.platePos;
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => this.animationControl('animBet')),
            cc.delayTime(1),
            cc.callFunc(() => this.animationOff('animBet'), ),
        ))
    },
    handleFinish(data) {
        this.setStateButton(false);
        let strData = JSON.parse(data.data);
        this.setTextTureResult(data.result);
        this.EffectOpenBowl(this.bowlPos);
        this.highLightGateWin(data.result, this, data);
        this.timerControl.active = false;
        // this.EffectMoneyForPlayer(data);
        this.returnMoneyFromDealer(data);
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.stateGame = STATE_GAME.WAITING;
            this.reSetGameDisplay();
            if(cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
        }, 10000)
    },
    handleBet(data) {
        //{"evt":"bet","N":"haiduy","Num":"6","M":"1"}

        require('SoundManager1').instance.playBetMusic();
        this.setStateButton(true);
        
        let player = this.getPlayer(data.N);
        let totalBet = data.M;
        let gate = data.Num;

        //Update Player Gold
        if (player !== null) {
            player.ag -= totalBet;
            player.updatePlayerView();
        }

        // Mỗi lần bet cập nhật lại số tiền của button allin
        

        if (player == this.thisPlayer) {
            this.stateGame = STATE_GAME.PLAYING;
        }

        // Nếu bet số tiền không nằm trong list chip có ảnh. Chia nhỏ chip thành mệnh giá nhỏ hơn + có ảnh;
        if (this.TEMP_VALUE_GOLD_COINS.indexOf(parseInt(totalBet)) < 0) {
            this.chipSpread(player, parseInt(totalBet), gate);
        }

        //Nếu bet mệnh giá nằm trong list chip thì cho Chip bay vào gate bet;
        else {
            this.effectGetReady(player, totalBet, gate);
        }
        //Cập nhật giá trị cho gate bet
        this.setValueBetGate(player, totalBet, gate);
        //Chip and Gate Control
    },
    chipSpread(player, totalBet, gate) {
        // Logic : For qua mảng chip được hỗ trợ, từ lớn -> nhỏ , nếu chip lớn hơn phần tử trong mảng thì trừ đi
        let chipBet = totalBet;
        for (let i = this.TEMP_VALUE_GOLD_COINS.length; i >= 0; i--) {
            if (chipBet >= this.TEMP_VALUE_GOLD_COINS[i]) {
                while (chipBet >= this.TEMP_VALUE_GOLD_COINS[i]) {
                    chipBet -= this.TEMP_VALUE_GOLD_COINS[i];
                    this.effectGetReady(player, this.TEMP_VALUE_GOLD_COINS[i], gate)
                }
            }
        }
    },
    /* Bet Anim */
    animationControl(animName, time = 1.5) {
        let animNameJson = this.aniObj[animName]
        this[animName].node.active = true;
        this[animName].setAnimation(0, animNameJson, false);
    },
    returnMoneyFromDealer(data) {

        //For Loop Each Player
        // if player gold win > 0
        //split chip thanh chip,
        //set Text Ture cHo chip
        // Fly Back Node Player
    },
    // setTextTureChip(money){
    //     //coding
    //     for (let i = this.TEMP_VALUE_GOLD_COINS.length - 1; i >= 0; i--) {
    //         if (money >= this.TEMP_VALUE_GOLD_COINS[i]) {
    //             money -= this.TEMP_VALUE_GOLD_COINS[i];
    //             let item = cc.instantiate(this.chipForFly);
    //             let name = require('GameManager').getInstance().formatMoneyChip(this.TEMP_VALUE_GOLD_COINS[i]);
    //             item.getComponent('Chip').setValue(name)
    //             i++;
    //         }
    //         if (money <= 0) break;
    //     }
    // },
    animationOff(name) {
        this[name].node.active = false;
    },
    /* Bet Button Event Here */
    randomPosition(obj) {
        // Random Position , return 1 object
        let clone = Object.assign({}, obj)
        clone.posX = Math.floor(Math.random() * (obj.posX + 30 - (obj.posX - 30) + 1)) + obj.posX - 30;
        clone.posY = Math.floor(Math.random() * (obj.posY + 30 - (obj.posY - 30) + 1)) + obj.posY - 30;
        return clone;
    },
    ImportHistory(data) {
        // Import history data theo số liệu cho sẵn
        let even = 0;
        let odd = 0;
        let historyData = data.split(';');
        for (let i = 0; i < historyData.length; i++) {
            if (historyData[i] === "1") {
                even++;
                this.getPositionToInsertSprite(null, 0);
            } else {
                odd++
                this.getPositionToInsertSprite(null, 1);
            }
        }
        if (this.historyLabels.length > 0) {
            this.historyLabels[1].string = even;
            this.historyLabels[0].string = odd;
        }
    },
    EffectMoneyForPlayer(data) {
        let playerData = JSON.parse(data.data);
        let player;
        for (let i = 0; i < playerData.length; i++) {
            player = this.getPlayer(playerData[i].N);
            if (player !== null) {
                player.ag = playerData[i].AG;
                player._playerView.effectFlyMoney(playerData[i].M, 60, 60);
                player.updatePlayerView();

                if (player === this.thisPlayer) {
                    require('GameManager').getInstance().user.ag = player.ag;
                   require('SMLSocketIO').getInstance().emitUpdateInfo();
                }
            }
        }
    },
    addSpriteHistory(state) {
        if (this.historyNode !== null && this.historyChildren !== null) {
            let item = cc.instantiate(this.historyChildren).getComponent('HistoryManager');
            if (state === 1) {
                item.setTextture(0);
            } else {
                item.setTextture(1);
            }
            this.historyNode.addChild(item.node);
        }
    },
    UpdateHistory(state) {
        if (state == 1) {
            this.historyLabels[0].string++;
            this.dataHistory += '1;';
        } else {
            this.historyLabels[1].string++;
            this.dataHistory += '2;';
        }
        this.getPositionToInsertSprite(null, state);
    },
    effectGetReady(player, chipType, betGate) {
        if (player === null) {
            return;
        }
        let chipFly = null;
        let target;
        if (this.chipPool.size() > 0) {
            chipFly = this.chipPool.get();
        } else {
            chipFly = cc.instantiate(this.chipForFly);
        }
        chipFly.scale = 0.33;
        chipFly.playerID = player.pname;
        chipFly.getComponent('Chip').setValue(parseInt(chipType), 0, false);
        this.node.addChild(chipFly);
        chipFly.setPosition(player._playerView.node.position);
        target = this.randomPosition(this.buttonBetVector[betGate - 1]);
        let action = cc.moveTo(0.3, cc.v2(target.posX, target.posY)).easing(cc.easeIn(0.3));
        chipFly.runAction(action);
        this.gateNumber[betGate - 1].push(chipFly);
    },
    getButtonBetVector() {
        let posX;
        let posY;
        let Obj = {};
        let arr = [];
        for (let i = 0; i < this.listBtnBet.length; i++) {
            posX = this.listBtnBet[i].node.x;
            posY = this.listBtnBet[i].node.y;
            Obj = {
                posX,
                posY
            }
            this.buttonBetVector.push(Obj);
        }
    },
    setStateButton(type) {
        if (this.listBtnBet !== null) {
            for (let i = 0; i < this.listBtnBet.length; i++) {
                this.listBtnBet[i].interactable = type;
            }
        }
    },
    getCurrentMoney() {
        // if (this.CurrentChipSelected == 0) {
        //     return require('GameManager').instance.onShowToast('Choose Chip Bet', 2);
        // }
        return parseInt(this.CurrentChipSelected);
    },
    sendBet(Money, Gate) {
        if (Money <= this.thisPlayer.ag && Boolean(Money)) {
            require('NetworkManager').getInstance().sendBetXocDia(Money, Gate);
        } else {
            if (this.thisPlayer !== null) {
                require('NetworkManager').getInstance().sendBetXocDia(this.thisPlayer.ag, Gate);
            }
        }
    },
    onClickButtonMakeBet(event, betType) {

        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBet_%s", require('GameManager').getInstance().getCurrentSceneName()));

        let gate = 0;
        let money = this.getCurrentMoney();
        switch (betType) {
            case "1":
                gate = 1;
                break;
            case "2":
                gate = 2;
                break;
            case "3":
                gate = 3;
                break;
            case "4":
                gate = 4;
                break;
            case "5":
                gate = 5;
                break;
            case "6":
                gate = 6;
                break;
            default:
                break;
        }
        
        if (money > this.thisPlayer.ag) {
            money = this.thisPlayer.ag;
        }
        
        if (this.thisPlayer.ag > 0) {
            this.sendBet(money, gate);
        }
    },
    getPostionInOtherNode(spaceNode, targetNode) {
        if (targetNode.parent == null) {
            return null;
        }
        let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.getPosition());
        return spaceNode.convertToNodeSpaceAR(pos);
    },
    resetValueBetGate() {
        if (this.arrayLabelBottom !== null) {
            if (this.arrayLabelBottom.length > 0) {
                for (let i = 0; i < this.arrayLabelBottom.length; i++) {
                    this.listBtnMask[i].node.active = false;
                    this.arrayLabelTop[i].string = '0';
                    this.arrayLabelBottom[i].string = '0';
                    if(this.arrayLabelBottom[i].node._parent !== null && this.arrayLabelBottom[i].node._parent.active == true){
                        this.arrayLabelBottom[i].node._parent.active = false;
                    }
                }
            }
        }
    },
    setValueBetGate(player, totalBet, gate) {
        //Top Label
        let value = parseInt(totalBet);
        this.gateValue[gate - 1] += value;
        this.arrayLabelTop[gate - 1].string = this.gateValue[gate - 1];

        //Bottom Label
        if (player === this.thisPlayer) {
            this.selfGateValue[gate - 1] += value;
            this.arrayLabelBottom[gate - 1].string = this.selfGateValue[gate - 1];
            if(this.arrayLabelBottom[gate - 1].node._parent !== null && this.arrayLabelBottom[gate - 1].node._parent.active == false){
                this.arrayLabelBottom[gate - 1].node._parent.active = true;
            }
        }
    },
    reSetGameDisplay() {
        this.gateValue = [0, 0, 0, 0, 0, 0];
        this.selfGateValue = [0, 0, 0, 0, 0, 0];

        this.setChipBet(this.chipBetIndex);

        if (this.arrayLabelTop != null)
            for (let i = 0; i < this.arrayLabelTop.length; i++) {
                this.arrayLabelTop[i].node._parent.active = true;
            }

        this.resetValueBetGate();
        for (let i = 0; i < 4; i++) {
            if (this.chipResultControl !== null) {
                this.chipResultControl[i].active = false;
            }
        }

        this.timeToBet = 18;
    },
    setTextTureResult(winType) {
        let totalYellowSprite = 0;
        let historyGateWin = 0;
        switch (winType) {
            case 1:
                totalYellowSprite = 2;
                historyGateWin = 0;
                break;
            case 6:
                totalYellowSprite = 0;
                historyGateWin = 0;
                break;
            case 3:
                totalYellowSprite = 4;
                historyGateWin = 0;
                break;
            case 4:
                totalYellowSprite = 1;
                historyGateWin = 1;
                break;
            case 5:
                totalYellowSprite = 3
                historyGateWin = 1;
                break;
            default:
                break;
        }
        for (let i = 0; i < 4; i++) {
            if (i < totalYellowSprite) {
                this.chipResultControl[i].getComponent(cc.Sprite).spriteFrame = this.chipVang;
            } else {
                this.chipResultControl[i].getComponent(cc.Sprite).spriteFrame = this.chipTrang;
            }
            this.chipResultControl[i].active = true;
            this.chipResultControl[i].runAction(cc.fadeIn(0.2));
        }
        this.UpdateHistory(historyGateWin);
    },
    EffectOpenBowl(target) {
        let targetPos = target;
        let action = cc.moveTo(0.5, cc.v2(targetPos.x, targetPos.y + 120)).easing(cc.easeIn(0.3));
        let action1 = cc.fadeOut(0.5);
        let action2 = cc.moveTo(0.5, cc.v2(targetPos.x, targetPos.y)).easing(cc.easeIn(0.3));
        let action3 = cc.fadeIn(0.5);
        this.bowlControl.runAction(cc.sequence(
            action,
            action1,
            cc.delayTime(3),
            action3,
            action2
        ));
    },
    highLightGateWin(dataNumber, context, data) {
        let totalYellowSprite = [];
        switch (dataNumber) {
            //
            case 1:
                totalYellowSprite = [0];
                break;
            case 6:
                totalYellowSprite = [0, 5];
                break;
            case 3:
                totalYellowSprite = [0, 2];
                break;
            case 4:
                totalYellowSprite = [1, 3];
                break;
            case 5:
                totalYellowSprite = [1, 4];
                break;
            default:
                break;
        }
        for (let i = 0; i < totalYellowSprite.length; i++) {
            let nodeEffect = this.listBtnBet[totalYellowSprite[i]].node.getChildByName('Winning');
            nodeEffect.active = true;
            nodeEffect.runAction(cc.sequence(cc.blink(4, 15),
                cc.callFunc(() => {
                    nodeEffect.active = false;
                })
            ))
        }

        var mangToTotal = [0,1,2,3,4,5];
        let difference = mangToTotal.filter(x => !totalYellowSprite.includes(x));
       
        for (let i = 0; i < difference.length;i++) {
            this.arrayLabelTop[difference[i]].node._parent.active = false;
            this.arrayLabelBottom[difference[i]].node._parent.active = false;
            this.listBtnMask[difference[i]].node.active = true;
        }

        context.node.runAction(
            cc.sequence(
                cc.delayTime(4),
                cc.callFunc(() => {
                    context.chipReturnEffect(totalYellowSprite);
                }),
                cc.delayTime(1),
                cc.callFunc(() => {
                    context.returnChipForWinner(totalYellowSprite);
                }),
                cc.delayTime(0.5),
                cc.callFunc(
                    () => {
                        context.EffectMoneyForPlayer(data)
                    }
                ),
                cc.delayTime(2.5),
                cc.callFunc(() => {
                    require('GameManager').instance.onShowToast('Waiting For Game Start...', 5)
                })
            )
        )
    },
    chipReturnEffect(arrayGateWin) {
        let actionHide = cc.hide();
        let count = 0;
        for (let i = 0; i < this.gateNumber.length; i++) {
            if (this.gateNumber[i].length > 0 && count == 0) {
                require('SoundManager1').instance.playChipLose();
                count++;
            }
            if (arrayGateWin.indexOf(i) == -1) {
                for (let j = 0; j < this.gateNumber[i].length; j++) {
                    this.gateNumber[i][j].runAction(
                        cc.spawn(
                            cc.moveTo(0.5, this.bowlPos).easing(cc.easeIn(0.3)),
                            cc.fadeOut(0.6)
                        )
                    )
                    this.gateNumber[i][j].playerID = '';
                }
            }
        }
    },
    setTimer(time) {
        if (this.timerControl !== null) {
            this.timerControl.stopAllActions();
            this.timerControl.active = true;
            let delTime = cc.delayTime(1);
            let timeCheck = cc.callFunc(() => {

                if (this.timeToBet >= 0) {
                    this.timerControl.getChildByName('lb_timer').getComponent(cc.Label).string = this.timeToBet.toString();
                    this.timeToBet--;
                    if (this.timeToBet < 5) {
                        require('SoundManager1').instance.playClockHurry();
                        let eff = cc.sequence(cc.scaleTo(0.25, 0.9), cc.scaleTo(0.25, 1.1));
                        let act = cc.repeatForever(eff);
                        this.timerControl.runAction(act);
                    } else {
                       // require('SoundManager1').instance.playClockTick();
                        let eff = cc.sequence(cc.scaleTo(0.5, 0.9), cc.scaleTo(0.5, 1.1));
                        let act = cc.repeatForever(eff);
                        this.timerControl.runAction(act);
                    }
                } else {
                    this.timerControl.active = false;
                }
            })
            let eff = cc.sequence(timeCheck, delTime);
            let act = cc.repeatForever(eff);
            this.timerControl.runAction(act);
        }
    },
    /* Set value chip bet */
    returnChipForWinner(arrayGateWin) {
        let playerIndex;
        let count = 0;
        for (let i = 0; i < this.gateNumber.length; i++) {
            if (arrayGateWin.indexOf(i) > -1) {
                if (this.gateNumber[i].length > 0 && count == 0) {
                    require('SoundManager1').instance.playChipWin();
                    count++;
                }
                for (let j = 0; j < this.gateNumber[i].length; j++) {
                    playerIndex = this.getPlayer(this.gateNumber[i][j].playerID)
                    if (!Boolean(playerIndex)) {
                        continue
                    }
                    this.gateNumber[i][j].runAction(
                        cc.spawn(
                            cc.moveTo(0.5, playerIndex._playerView.node.position).easing(cc.easeIn(0.3)),
                            cc.fadeOut(0.6)
                        )
                    )
                    this.gateNumber[i][j].playerID = '';
                }
            }

        }
    },
    getIndexPlayerWithName(name) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].pname == name) {
                return i;
            }
        }
    },
    
    updateChipBet() {
        if (this.thisPlayer === null || this.listChipForBet.length == 0) {
            return;
        }
        const playerAG = this.thisPlayer.ag;
        let x = 4;
        for (let i =  this.TEMP_VALUE_GOLD_COINS.length - 1; i >=0; i--) {
            const ag = this.TEMP_VALUE_GOLD_COINS[i];
            if (playerAG > ag) {
                x--;
                break;
            } 
                x = i;
            
        }
        if (x < 4)
            x = 4;

        for (let i = 0; i < this.listChipForBet.length; i++) {
            let btn = this.listChipForBet[i];
            btn.getComponent('Chip').setValue(this.TEMP_VALUE_GOLD_COINS[x - 4 + i]);
        }

        //Chip click Event Ready
        for (let i = 0; i < this.listChipForBet.length; i++) {
            const btn = this.listChipForBet[i];
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "XocDia17GameView";
            clickEventHandler.handler = "onClickChooseChip";
            // clickEventHandler.customEventData = '' + btn.getComponent('Chip').valueChip;
            clickEventHandler.customEventData = i;
            btn.clickEvents = [];
            btn.clickEvents.push(clickEventHandler);
        }
    },
    onClickChooseChip(e, data) {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.setChipBet(data);
    },
    setChipBet(index) {
        var btn = this.listChipForBet[index];
        if (typeof btn !== 'undefined') {
            this.chipBetIndex = index;
            this.chipBorder.node.active = true;
            this.chipBorder.node.position = btn.node.position.add(cc.v2(0, 0));
            this.CurrentChipSelected = btn.getComponent('Chip').getValue();
        }
    },
    getButtonChipBetReady() {
        if (this.listChipForBet.length > 0) {
            this.CurrentChipSelected = this.listChipForBet[0].getComponent('Chip').getValue();
            cc.NGWlog(this.CurrentChipSelected, 'running Here');
        }
    },
    updatePositionPlayerView() {
        for (let i = 0; i < this.players.length; i++) {
            let index = this.getDynamicIndex(this.getIndexOf(this.players[i]));
            this.players[i]._playerView.node.scale = 0.9;
            this.players[i]._playerView.node.position = this.listPosView[index];
            this.players[i]._indexDynamic = index;
        }
    },
    update(dt) {
        if (require("GameManager").getInstance().time_out_game != 0) {
            this.timeToBet -= require("GameManager").getInstance().time_out_game;
            require("GameManager").getInstance().time_out_game = 0;
        }
    }
})