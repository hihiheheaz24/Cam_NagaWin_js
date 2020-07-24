// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
let Player = require('Player')
var GameManager = require('GameManager').getInstance();
cc.Class({
    extends: require('GameView2'),
    properties: {
        lbTime: cc.Label,
        tableRotate: cc.Node,
        ball: cc.Animation,
        fatherBall: cc.Animation,
        GrandBall: cc.Node,
        prNodeImg: cc.Node,
        spBoxBet: cc.SpriteFrame,
        spBoxBet0: cc.SpriteFrame,
        nodeBetFp: cc.Prefab,
        tableMask: cc.Node,
        isRebet: true,
        isDouble: false,
        _minBet: 0,
        _maxbet: 0,
        _isStopRotateTable: true,
        aniResult: sp.Skeleton,
        lbResult: cc.Label,
        _isResultColor: null,
        _resultNumber: null,
        HistoryPf: cc.Prefab,
        HistoryMini: cc.Node,
        NodeHistory: cc.Node,
        spOffBoxBet: cc.SpriteFrame,
        NodeSpriteOff: cc.Node,
        aniWinLose: sp.Skeleton,
        lbWinLose: cc.Label,
        font: [cc.Font],
        count: 0,
        nodeMain: cc.Node,
        lbId: cc.Label,
        lbMin: cc.Label,
        lbMax: cc.Label,
        lbMoneyPlayer: cc.Label,
        nodeBoxMoneyPlayer: cc.Node,
        lbTotalPlayer: cc.Label,
        moneyDealer: cc.Node,
        nodeListPlayerPf: cc.Prefab,
        nodeBetTimePf: cc.Prefab,
        nodeClickChat: cc.Node,
        nodeBoxMoneyTheir: cc.Node,
        lbWating: cc.Label,
        aniStartGame: sp.Skeleton
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        this.node.setContentSize(cc.winSize);
        this.nodeGroupMenu.onHideItem(1);
        this.nodeGroupMenu.onHideItem(2);
        this.History = null;
        this.ItemHistoryPoll = new cc.NodePool();
        this.listResult = [5.5, 230, 64.5, 346, 45, 191, 104, 307, 161.5, 269, 181, 142, 327, 123, 249.5, 25.5, 210, 84, 288, 35, 239.5, 55, 279, 171, 200.5, 74, 356, 113, 317, 298, 151, 258.5, 15.5, 220, 94, 337, 132];
        this.nodeBet = null;
        this._curChipBet = 0;
        this._totalMoneyBet = 0;
        this._totalMoneyCurentBet = 0;
        this._isLastTotalMoneyBet = 0;
        this.listBet = [];
        this.listLastBetSingle = [];
        this.listLastBetMutil = [];
        this.listBetSingleCurent = [];
        this.listBetMutilCurent = [];
        this.listBetSingleCurentTurn = [];
        this.listBetMutilCurentTurn = [];
        this.node.setContentSize(cc.winSize);
        this.nodeMain.on('touchstart', this.callBackMove, this);
        this.nodeMain.on('touchmove', this.callBackMove, this);
        this.nodeMain.on('touchend', this.callBackEnd, this);
        this.listEventCall = [];
        this.listEventCallMutil = [];
        this.vect2 = cc.v2(-354, 2);
        this.vectSPOff = cc.v2(-354, 2);
        this.vect2Doc = cc.v2(-354, 33);
        this.vect2Ngang = cc.v2(-391.5, 2);
        this.vect4 = cc.v2(-316, 33);
        this.vectDoc3 = cc.v2(-429.5, 33);
        this.vectDoc6 = cc.v2(-467, 33);
        this.vectSP = cc.v2(-354, 3);

        this.creatNodeSpriteOff();
        this.creatNodeSprite();
        this.creatNodeSingle();
        this.creatDoiDoc();
        this.creatDoiNgang();
        this.creat4();
        this.creatDoc3();
        this.creatDoc6();
        this.isBetTime = false;
        this.listChipBetTheir = [];
        this.listBetTheir = [];
        this.listDataFinish = null;
        this.isOkBet = true;
        this.isRunAction = false;
        this.isSlowMotionBall = false;
        this.speedPather = 0;
        this.isStartRotateTable = false;
        this.deltaRotate = 0;
        this.fatherBall.on('finished', this.onFinished, this);
        this.nodeTime = null;
        this.isRunAction3 = false;

        let text0 = "Game is playing ! Please wait a moment ";
        let text1 = "Game is playing ! Please wait a moment .";
        let text2 = "Game is playing ! Please wait a moment ..";
        let text3 = "Game is playing ! Please wait a moment ...";

        var seq = cc.repeatForever(
            cc.sequence(
                cc.callFunc(() => {
                    this.lbWating.string = text0;
                }), cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.lbWating.string = text1;
                }), cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.lbWating.string = text2;
                }), cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.lbWating.string = text3;
                }), cc.delayTime(0.5),
            ));
        this.lbWating.node.runAction(seq)
    },
    onDestroy() {
        this.fatherBall.off('finished', this.onFinished, this);
        this.nodeMain.off('touchstart', this.callBackMove, this);
        this.nodeMain.off('touchmove', this.callBackMove, this);
        this.nodeMain.off('touchend', this.callBackEnd, this);



    },
    update(dt) {
        // cc.game.setFrameRate(this.generateRandomNumber(1,40));
        if (this.isSlowMotionBall) {
            if (this.speedPather.speed > 0.0) {
                this.speedPather.speed -= (dt / 3.5);
            }
            if (this.speedPather.speed <= 0 || this.tableRotate.rotation > 490) {
                this.speedPather.speed = 0;
                this.fatherBall.stop('PatherBall');
                this.onFinished();
            }
        }
    },
    onFinished() {
        //cc.NGWlog('========== finish== ' + this.tableRotate.rotation);
        this.tableRotate.rotation = 491;
        this.speedPather.speed = 1;
        this.isSlowMotionBall = false;
        this.GrandBall.parent = this.tableRotate;
        this.fatherBall.node.rotation = -this.tableRotate.rotation;
        this.ball.play('AniStatic');
        this.onShowResult();
    },

    creatNodeSprite() {
        cc.NGWlog('chay vao ham creator');
        let node0 = new cc.Node();
        let cpSpNode0 = node0.addComponent(cc.Sprite);
        cpSpNode0.spriteFrame = this.spBoxBet0;
        node0.position = cc.v2(-421.8, 125.3);
        this.prNodeImg.addChild(node0);
        node0.active = false;
        for (let i = 0; i < 36; i++) {
            if (i % 3 == 0 && i != 0) {
                this.vectSP = cc.v2(this.vectSP.x + 75.5, 64);
            } else {
                this.vectSP = cc.v2(this.vectSP.x, this.vectSP.y + 61);
            }
            let nodeSP = new cc.Node();
            let cpSpNodeSp = nodeSP.addComponent(cc.Sprite);
            cpSpNodeSp.spriteFrame = this.spBoxBet;
            nodeSP.position = this.vectSP;
            this.prNodeImg.addChild(nodeSP);
            nodeSP.active = false;
        }

        let vecTemp = cc.v2(-241, 3);

        for (let i = 0; i < 3; i++) {
            let nodeMutilSp = new cc.Node();
            let cpSpnodeMutilSp = nodeMutilSp.addComponent(cc.Sprite);
            cpSpnodeMutilSp.spriteFrame = this.spBoxBet;
            cpSpnodeMutilSp.type = 1;
            nodeMutilSp.position = vecTemp;
            this.prNodeImg.addChild(nodeMutilSp);
            nodeMutilSp.setContentSize(cc.size(298, 58));
            nodeMutilSp.active = false;
            let nodeSPOff = new cc.Node();
            let cpSpNodeSpOff = nodeSPOff.addComponent(cc.Sprite);
            cpSpNodeSpOff.spriteFrame = this.spOffBoxBet;

            nodeSPOff.position = vecTemp;
            this.NodeSpriteOff.addChild(nodeSPOff);
            nodeSPOff.setContentSize(cc.size(302, 61));
            nodeSPOff.active = false;
            let item = new cc.Node();

            // let _cpSpnodeMutilSp = item.addComponent(cc.Sprite);
            // _cpSpnodeMutilSp.spriteFrame = this.spBoxBet;

            item.setContentSize(cc.size(300, 40));
            let cp = item.addComponent(require('MutilBet'))
            cp.setInfo(this.count, this, this.count, nodeMutilSp, nodeSPOff);
            this.listEventCallMutil.push(cp);
            item.position = vecTemp;
            this.nodeMain.addChild(item);
            vecTemp = cc.v2(vecTemp.x + 302, vecTemp.y);
            this.count++;
        }

        vecTemp = cc.v2(-316.2, -59.5);
        for (let i = 0; i < 6; i++) {
            let nodeMutilSp = new cc.Node();
            let cpSpnodeMutilSp = nodeMutilSp.addComponent(cc.Sprite);
            cpSpnodeMutilSp.spriteFrame = this.spBoxBet;
            cpSpnodeMutilSp.type = 1;
            nodeMutilSp.position = vecTemp;

            this.prNodeImg.addChild(nodeMutilSp);
            nodeMutilSp.setContentSize(cc.size(149, 59));
            nodeMutilSp.active = false;
            let nodeSPOff = new cc.Node();
            let cpSpNodeSpOff = nodeSPOff.addComponent(cc.Sprite);
            cpSpNodeSpOff.spriteFrame = this.spOffBoxBet;

            nodeSPOff.position = vecTemp;
            this.NodeSpriteOff.addChild(nodeSPOff);
            nodeSPOff.setContentSize(cc.size(151, 63));
            nodeSPOff.active = false;
            let item = new cc.Node();
            item.setContentSize(cc.size(149, 59));
            let cp = item.addComponent(require('MutilBet'))
            cp.setInfo(this.count, this, this.count, nodeMutilSp, nodeSPOff);
            this.listEventCallMutil.push(cp);
            item.position = vecTemp;
            this.nodeMain.addChild(item);
            vecTemp = cc.v2(vecTemp.x + 151, vecTemp.y);
            this.count++;
        }

        vecTemp = cc.v2(551.4, 186.7);
        for (let i = 0; i < 3; i++) {
            let nodeMutilSp = new cc.Node();
            let cpSpnodeMutilSp = nodeMutilSp.addComponent(cc.Sprite);
            cpSpnodeMutilSp.spriteFrame = this.spBoxBet;
            cpSpnodeMutilSp.type = 1;
            nodeMutilSp.position = vecTemp;

            this.prNodeImg.addChild(nodeMutilSp);
            nodeMutilSp.active = false;

            let nodeSPOff = new cc.Node();
            let cpSpNodeSpOff = nodeSPOff.addComponent(cc.Sprite);
            cpSpNodeSpOff.spriteFrame = this.spOffBoxBet;

            nodeSPOff.position = vecTemp;
            this.NodeSpriteOff.addChild(nodeSPOff);
            nodeSPOff.setContentSize(cc.size(75.5, 60));
            nodeSPOff.active = false;


            let item = new cc.Node();
            item.setContentSize(cc.size(45, 35));
            let cp = item.addComponent(require('MutilBet'))
            cp.setInfo(this.count, this, this.count, nodeMutilSp, nodeSPOff);
            this.listEventCallMutil.push(cp);
            item.position = vecTemp;
            this.nodeMain.addChild(item);
            vecTemp = cc.v2(vecTemp.x, vecTemp.y - 61.5);
            this.count++
        }
    },
    creatNodeSingle() {

        let listChildControll = this.prNodeImg.children;
        let listChildControllOff = this.NodeSpriteOff.children;
        let node0 = new cc.Node();
        node0.position = cc.v2(-424, 124);
        node0.setContentSize(cc.size(40, 150));
        this.nodeMain.addChild(node0);
        let cp0 = node0.addComponent(require('SingleBet'));
        cp0.setInfo(0, listChildControll[0], this, listChildControllOff[0]);
        this.listEventCall.push(cp0);
        cp0.color = 2;
        let isCheckColor = 0;
        for (let i = 0; i < 36; i++) {
            if (i % 3 == 0 && i != 0) {
                this.vect2 = cc.v2(this.vect2.x + 75.5, 63);
            } else {
                this.vect2 = cc.v2(this.vect2.x, this.vect2.y + 61);
            }
            let item = new cc.Node();
            item.setContentSize(cc.size(45, 35));
            let cp = item.addComponent(require('SingleBet'))
            cp.setInfo(i + 1, listChildControll[i + 1], this, listChildControllOff[i + 1]);
            this.listEventCall.push(cp);
            item.position = this.vect2;
            this.nodeMain.addChild(item);

            if (i > -1 && i < 12) {
                //cc.NGWlog('chay vao ham khoi tao');
                this.listEventCallMutil[0].listControll.push(this.listEventCall[i + 1]);
            } else if (i > 11 && i < 24) {
                this.listEventCallMutil[1].listControll.push(this.listEventCall[i + 1]);
            } else {
                this.listEventCallMutil[2].listControll.push(this.listEventCall[i + 1]);
            }

            if (i > -1 && i < 18) {
                this.listEventCallMutil[3].listControll.push(this.listEventCall[i + 1]);
            } else {
                this.listEventCallMutil[8].listControll.push(this.listEventCall[i + 1]);
            }

            if (i % 2 == 0) {
                this.listEventCallMutil[7].listControll.push(this.listEventCall[i + 1]);
            } else {
                this.listEventCallMutil[4].listControll.push(this.listEventCall[i + 1]);
            }

            let temp = i % 3;
            if (temp == 0) {
                this.listEventCallMutil[11].listControll.push(this.listEventCall[i + 1]);
            } else if (temp == 1) {
                this.listEventCallMutil[10].listControll.push(this.listEventCall[i + 1]);
            } else {
                this.listEventCallMutil[9].listControll.push(this.listEventCall[i + 1]);
            }

            if (i > 9 && i < 18 || i > 27) {
                isCheckColor = 1;
            } else {
                isCheckColor = 0;
            }

            //  if(){
            //     isCheckColor = 1;
            //  }

            if (isCheckColor == 0) {
                if (i % 2 == 0) {
                    this.listEventCall[i + 1].color = 0;
                    this.listEventCallMutil[5].listControll.push(this.listEventCall[i + 1]);
                } else {
                    this.listEventCall[i + 1].color = 1;
                    this.listEventCallMutil[6].listControll.push(this.listEventCall[i + 1]);
                }
            } else {
                if (i % 2 != 0) {
                    this.listEventCall[i + 1].color = 0;
                    this.listEventCallMutil[5].listControll.push(this.listEventCall[i + 1]);
                } else {
                    this.listEventCall[i + 1].color = 1;
                    this.listEventCallMutil[6].listControll.push(this.listEventCall[i + 1]);
                }
            }




        }
    },
    creatDoiDoc() {
        let index = 1;
        for (let i = 0; i < 24; i++) {
            if (i % 2 == 0 && i != 0) {
                index++;
                this.vect2Doc = cc.v2(this.vect2Doc.x + 75.5, 94);
            } else {
                this.vect2Doc = cc.v2(this.vect2Doc.x, this.vect2Doc.y + 61);
            }
            let item = new cc.Node();
            item.setContentSize(cc.size(45, 35));
            let cp = item.addComponent(require('MutilBet'));
            cp.setInfo(this.count, this, this.count);
            for (let j = 0; j < 2; j++) {
                cp.listControll.push(this.listEventCall[i + j + index]);
            }
            this.listEventCallMutil.push(cp);
            item.position = this.vect2Doc;
            this.nodeMain.addChild(item);
            this.count++;
        }
    },
    creatDoiNgang() {

        for (let i = 0; i < 36; i++) {
            if (i % 3 == 0 && i != 0) {
                this.vect2Ngang = cc.v2(this.vect2Ngang.x + 75.5, 63);
            } else {
                this.vect2Ngang = cc.v2(this.vect2Ngang.x, this.vect2Ngang.y + 61);
            }
            let item = item = new cc.Node();
            item.setContentSize(cc.size(30, 30));
            let cp = item.addComponent(require('MutilBet'));
            cp.setInfo(this.count, this, this.count);

            if (i < 3) {
                cp.listControll.push(this.listEventCall[0]);
                cp.listControll.push(this.listEventCall[i + 1]);
            } else {
                cp.listControll.push(this.listEventCall[i - 2]);
                cp.listControll.push(this.listEventCall[i + 1]);
            }
            this.listEventCallMutil.push(cp);
            item.position = this.vect2Ngang;
            this.nodeMain.addChild(item);
            this.count++
        }
    },
    creat4() {
        let index = 1;
        let item0 = new cc.Node();
        item0.setContentSize(cc.size(30, 30));
        let cp0 = item0.addComponent(require('MutilBet'));
        cp0.setInfo(this.count, this, this.count);
        cp0.listControll = [this.listEventCall[0], this.listEventCall[1], this.listEventCall[2]];
        this.listEventCallMutil.push(cp0);
        item0.position = cc.v2(this.vect4.x - 75.7, 94);
        this.nodeMain.addChild(item0);
        this.count++;
        let item1 = new cc.Node();
        item1.setContentSize(cc.size(30, 30));
        let cp1 = item1.addComponent(require('MutilBet'));
        cp1.setInfo(this.count, this, this.count);
        cp1.listControll = [this.listEventCall[0], this.listEventCall[2], this.listEventCall[3]];
        this.listEventCallMutil.push(cp1);
        item1.position = cc.v2(this.vect4.x - 75.7, 94 + 61);
        this.nodeMain.addChild(item1);
        this.count++;

        for (let i = 0; i < 22; i++) {
            if (i % 2 == 0 && i != 0) {
                index++;
                this.vect4 = cc.v2(this.vect4.x + 75.5, 94);
            } else {
                this.vect4 = cc.v2(this.vect4.x, this.vect4.y + 61);
            }
            let item = new cc.Node();
            item.setContentSize(cc.size(30, 30));
            let cp = item.addComponent(require('MutilBet'));
            cp.setInfo(this.count, this, this.count);
            let index2 = 0;
            for (let j = 0; j < 4; j++) {
                if (j == 2) index2 = 1;
                cp.listControll.push(this.listEventCall[i + j + index + index2]);
            }
            this.listEventCallMutil.push(cp);
            item.position = this.vect4;
            this.nodeMain.addChild(item);
            this.count++;
        }
    },
    creatDoc3() {
        let index = 1;
        for (let i = 0; i < 12; i++) {

            this.vectDoc3 = cc.v2(this.vectDoc3.x + 75.5, this.vectDoc3.y);
            let item = new cc.Node();
            item.setContentSize(cc.size(45, 35));
            let cp = item.addComponent(require('MutilBet'));
            cp.setInfo(this.count, this, this.count);
            for (let j = 0; j < 3; j++) {
                cp.listControll.push(this.listEventCall[i + j + index]);
            }
            index += 2;
            this.listEventCallMutil.push(cp);
            item.position = this.vectDoc3;
            this.nodeMain.addChild(item);
            this.count++;
        }
    },
    creatDoc6() {
        let length = 4;
        let index = 0;
        for (let i = 0; i < 12; i++) {
            if (i > 0) {
                length = 6;
                if (i > 1) index += 2;

            }
            this.vectDoc6 = cc.v2(this.vectDoc6.x + 75.5, this.vectDoc6.y);
            let item = item = new cc.Node();
            item.setContentSize(cc.size(30, 35));
            let cp = item.addComponent(require('MutilBet'));
            cp.setInfo(this.count, this, this.count);

            for (let j = 0; j < length; j++) {
                cp.listControll.push(this.listEventCall[i + j + index]);
            }

            this.listEventCallMutil.push(cp);
            item.position = this.vectDoc6;
            this.nodeMain.addChild(item);
            this.count++;
        }
    },

    handleSTable(strData) {
        this.players = [];
        var data = JSON.parse(strData);
        this.stateGame = STATE_GAME.WAITING;
        this.setGameInfo(data.M, data.Id);
        var listPlayer = data.ArrP;
        var lTemp = [];

        for (let i = 0; i < listPlayer.length; i++) {
            var player = new Player();
            lTemp.push(player);
            this.readDataPlayer(player, listPlayer[i]);
            if (player.id === GameManager.user.id) { //che do test
                this.thisPlayer = player;
            }
        }
        this.players = lTemp;
        this.lbMoneyPlayer.string = GameManager.formatNumber(this.thisPlayer.ag);
        this.lbTotalPlayer.string = this.players.length;
        this.addChatJoin(this.thisPlayer.displayName);
    },
    handleVTable(strData) {
        this.players = [];
        var data = JSON.parse(strData);
        this.stateGame = STATE_GAME.WAITING;
        this.setGameInfo(data.M, data.Id);
        var listPlayer = data.ArrP;
        var lTemp = [];

        for (let i = 0; i < listPlayer.length; i++) {
            var player = new Player();
            lTemp.push(player);
            this.readDataPlayer(player, listPlayer[i]);
        }
        this.players = lTemp;

        player = new Player();
        player.id = GameManager.user.id;
        if (GameManager.user.tinyURL.indexOf("fb.") !== -1) {
            player.fid = GameManager.user.tinyURL.substring(3, GameManager.user.tinyURL.length);
        }
        player.pname = GameManager.user.uname;
        player.displayName = GameManager.user.displayName;
        player.ag = GameManager.user.ag;
        player.vip = GameManager.user.vip;
        player.avatar_id = GameManager.user.avtId;
        player.is_ready = true;
        player.ip = '0.0.0.0';
        this.thisPlayer = player;
        this.players.push(player);
        this.lbMoneyPlayer.string = GameManager.formatNumber(this.thisPlayer.ag);
        this.lbTotalPlayer.string = this.players.length;
        this.addChatJoin(this.thisPlayer.displayName);
    },
    handleCTable(strdata) {
        let data = JSON.parse(strdata);
        let pLayer = data.ArrP[0];
        this.thisPlayer = new Player();
        this.players.push(this.thisPlayer);
        this.readDataPlayer(this.thisPlayer, pLayer);
        this.lbMoneyPlayer.string = GameManager.formatNumber(pLayer.AG);
        this.setGameInfo(data.M, data.Id);
        this.lbTotalPlayer.string = this.players.length;
        this.addChatJoin(this.thisPlayer.displayName);
    },
    handleJTable(strData) {
        var listPlayer = JSON.parse(strData);
        //cc.NGWlog(listPlayer);
        var player = new Player();
        this.players.push(player);
        this.lbTotalPlayer.string = this.players.length;
        this.readDataPlayer(player, listPlayer);
        this.addChatJoin(player.displayName);
    },
    handleLTable(data) {
        let name = data.Name;
        var msg = "";
        if (data.hasOwnProperty('message')) {
            msg = data.message;
        }
        //cc.NGWlog('name nó la==== ' + name +'nam mình là ===' + GameManager.user.uname);
        if (name !== GameManager.user.uname) {
            //// require('SoundManager').playSound(ResDefine.sound_remove);
            let player = this.getPlayer(name);
            if (player != null) { this.addChatLeave(player.displayName); }
            this.removePlayer(name);
        };
        this.lbTotalPlayer.string = this.players.length;
    },
    removePlayer(nameP, isInGame = false) {
        let player = this.getPlayer(nameP);
        if (player !== null) {
            this.players.splice(this.players.indexOf(player), 1);
            player = null;
        }
    },
    handleFinish(strdata) {
        //let data
        this.isBetTime = false;
        this.tableMask.stopAllActions();
        this.tableMask.opacity = 0;
        let length;
        for (let i = 0; i < 12; i++) {
            this.listEventCallMutil[i].callBackSingleCancel();
        };
        length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            this.listEventCallMutil[i].callBackCancel();
        }
        let number = strdata.result;
        //  number = 17;
        this.listDataFinish = JSON.parse(strdata.data);
        this.onClearbet();
        this.nodeBet.node.active = false;
        this.lbResult.string = number;
        //cc.NGWlog('ket qua la========= ' + number);
        this._resultNumber = number;
        this._isResultColor = this.listEventCall[number].color;
        this.startRuningBall(number);
        this.setTimeout(() => {
            this.clearAllBetForNextGame();
        }, 23000)
    },
    startRuningBall(result) {
        // result = this.generateRandomNumber(0,36);
        // //cc.NGWlog('ket qua la=== ' + result);
        // this._resultNumber = result;
        // this._isResultColor = this.listEventCall[result].color;

        //----------------test---------------------------------
        this.nodeClickChat.active = false;
        this.nodeMain.runAction(cc.moveBy(1, cc.v2(950, 0)).easing(cc.easeExponentialInOut()))
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_remove);
        let offSetRotate = this.listResult[result];
        this.GrandBall.parent = this.tableRotate.parent;
        this.GrandBall.rotation = 0;
        this.fatherBall.node.rotation = 0;
        this.ball.node.x = 291;
        this.ball.node.y += 40;
        this.ball.node.scale = 2;
        this.ball.node.opacity = 0;
        this.tableRotate.rotation = 0;
        this.tableRotate.runAction(cc.rotateBy(2, -360));
        this.setTimeout(() => {
            this.ball.node.runAction(cc.spawn(cc.moveBy(1, cc.v2(0, -40)).easing(cc.easeIn(2)), cc.fadeIn(0.4).easing(cc.easeIn(2)), cc.scaleTo(1, 1).easing(cc.easeIn(2))))
        }, 1000)
        this.setTimeout(() => {
            this.tableRotate.rotation = 0;
            this.tableRotate.stopAllActions();
            this.tableRotate.runAction(cc.repeatForever(cc.rotateBy(10, 780)));
            this.fatherBall.stop('PatherBall');
            this.GrandBall.stopAllActions();
            this.GrandBall.runAction(cc.sequence(cc.rotateBy(3.5, -1080 + offSetRotate), cc.callFunc(() => {
                this.speedPather = this.fatherBall.play('PatherBall');
                let string = 'BallMove' + this.generateRandomNumber(1, 6);
                //cc.NGWlog('kieu quay la === ' + string);
                this.ball.play(string);
                this.isSlowMotionBall = true;
            })));
        }, 2000)

    },
    getOffsetRotate(result) {
        return this.listResult[result];
        this.listResult = [17, 3, -14, 15, -16, -1, -10, 11, -4, 7, -2, -6, 13, -8, 5, -18, 1, -12, 9, -17, 4, -15, 8, -3, 0, -13, 16, -9, 12, 10, -5, 6, -19, 2, -11, 14, -7];
    },
    callBackEnd(touch) {
        //   //cc.NGWlog('touch end')

        if (!this.isBetTime) return;
        let positionTouch = touch.getLocation();
        this.tableMask.stopAllActions();
        this.tableMask.opacity = 0;
        var length = 0;
        length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            if (this.listEventCall[i].node.getBoundingBoxToWorld().contains(positionTouch)) {
                this.listEventCall[i].callBackEnd();
                return;
            }
        }
        length = this.listEventCallMutil.length;
        for (let i = 0; i < length; i++) {
            if (this.listEventCallMutil[i].node.getBoundingBoxToWorld().contains(positionTouch)) {
                this.listEventCallMutil[i].callBackEnd()
                return;
            }
        }
    },
    callBackMove(touch) {
        if (!this.isBetTime) return;
        let positionTouch = touch.getLocation();
        if (this.tableMask.getBoundingBoxToWorld().contains(positionTouch)) {
            this.tableMask.runAction(cc.fadeTo(0.3, 180)).easing(cc.easeIn(1));
        } else {
            this.tableMask.stopAllActions();
            this.tableMask.opacity = 0
        }
        var length = 0;
        length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            if (this.listEventCall[i].node.getBoundingBoxToWorld().contains(positionTouch)) {
                this.listEventCall[i].isSlect = true;
                this.listEventCall[i].callBack();
                this.CancelAll();
                return;
            }
        }
        length = this.listEventCallMutil.length;
        for (let i = 0; i < length; i++) {
            if (this.listEventCallMutil[i].node.getBoundingBoxToWorld().contains(positionTouch)) {
                this.listEventCallMutil[i].isSlect = true;
                this.listEventCallMutil[i].callBack();
                this.CancelAll();
                return;
            }
        }

        this.CancelAll();

    },
    CancelAll() {
        var length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            this.listEventCall[i].callBackCancel();
        };
        for (let i = 0; i < 12; i++) {
            this.listEventCallMutil[i].callBackSingleCancel();
        }
    },
    BetSingle(id, pos, chipBet, totalChip, target, isMultil = false) {
        if (!this.isOkBet) {
            if (this.thisPlayer.ag < this._maxbet) {
                require('UIManager').instance.showToast(GameManager.getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'))
            } else {
                require('UIManager').instance.showToast(GameManager.getTextConfig('txt_maxBet').replace("%s", this._maxbet))
            }

            return;
        }
        if (this.isCheckListLastBetSingleCurentTurn(id)) this.listBetSingleCurentTurn.push(id);
        this._totalMoneyCurentBet += chipBet;
        this.nodeBet.setlbChip();
        this.nodeBet.checkListChip();
        this.InstantiateMultiChip(pos, chipBet, totalChip, target);
        //     if(!this.isDouble) this.nodeBet.btn_Double.interactable = true;
    },
    BetMutil(id, listArr, pos, chipBet, totalChip, indexListBet, target, isMultil = false) {
        if (!this.isOkBet) {
            if (this.thisPlayer.ag < this._maxbet) {
                require('UIManager').instance.showToast(GameManager.getTextConfig('NOT_ENOUGHT_AVAIABLE_AG'))
            } else {
                require('UIManager').instance.showToast(GameManager.getTextConfig('txt_maxBet').replace("%s", this._maxbet))
            }

            return;
        }
        this._totalMoneyCurentBet += chipBet;
        this.InstantiateMultiChip(pos, chipBet, totalChip, target);
        this.nodeBet.setlbChip();
        this.nodeBet.checkListChip();
        if (this.isCheckListLastBetMultiCurentTurn(indexListBet)) this.listBetMutilCurentTurn.push(indexListBet);
    },
    InstantiateMultiChip(pos, money, totalMonney, target) {
        var i = this.nodeBet.listChipBet.length - 1;
        let delayTime = 0;
        let moneyTemp = money
        for (i; i >= 0; i--) {
            if (money >= this.nodeBet.listChipBet[i]) {
                money -= this.nodeBet.listChipBet[i];
                let item = new cc.Node();
                let cpSpNode = item.addComponent(cc.Sprite);
                target.listChipCur.push(item);
                let name = GameManager.formatMoneyChip(this.nodeBet.listChipBet[i]);
                cpSpNode.spriteFrame = this.nodeBet.listSprite.getSpriteFrame(name);
                this.nodeMain.addChild(item, GAME_ZORDER.Z_PLAYERVIEW);
                item.opacity = 0;
                item.position = cc.v2(pos.x, pos.y + 20);
                item.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
                        item.scale = 0.7;
                        item.opacity = 120
                        item.runAction(cc.spawn(cc.moveBy(0.5, cc.v2(0, -20)).easing(cc.easeIn(2)), cc.fadeTo(0.2, 255).easing(cc.easeIn(2)), cc.scaleTo(0.5, 0.5).easing(cc.easeIn(2))));
                    })))
                    // this.setTimeout(()=>{
                    //  if(this.node == null || typeof this.node =='undefined' || item == null || typeof item =='undefined') return;

                //   },delayTime * 1000)
                delayTime += 0.5;
                i++;
            }
            if (money <= 0) break;
        }
        let nodeLb = new cc.Node();
        nodeLb.color = cc.Color.YELLOW;
        nodeLb.position = cc.v2(pos.x, pos.y + 20)
        this.nodeMain.addChild(nodeLb);
        nodeLb.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.8).easing(cc.easeExponentialIn()), cc.moveBy(0.8, cc.v2(0, 20))), cc.removeSelf()));
        let lb = nodeLb.addComponent(cc.Label);
        lb.fontSize = 25;
        lb.string = GameManager.formatNumber(totalMonney);
        //  this.listHistoryBet.push(target);
    },
    InstantiateChipTheir(target, money) {
        let pos = target.node.position;
        var i = this.nodeBet.listChipBet.length - 1;
        let dlTime = 0;
        for (i; i >= 0; i--) {
            if (money >= this.nodeBet.listChipBet[i]) {
                money -= this.nodeBet.listChipBet[i];
                let item = new cc.Node();
                let cpSpNode = item.addComponent(cc.Sprite);
                target.listChipTheir.push(item);
                let name = GameManager.formatMoneyChip(this.nodeBet.listChipBet[i]);
                cpSpNode.spriteFrame = this.nodeBet.listSprite.getSpriteFrame(name);
                this.nodeMain.addChild(item, GAME_ZORDER.Z_PLAYERVIEW);
                item.position = cc.v2(-23, 266);
                item.scale = 0.4;
                item.runAction(cc.sequence(cc.delayTime(dlTime), cc.moveTo(0.3, pos)));
                dlTime += 0.1;
                i++;
            }
            if (money <= 0) break;

        }
    },
    setGameInfo(m, id) {
        this.agTable = m;
        this.lbId.string = "ID: " + id;
        this.lbMin.string = 'MIN BET: ' + m;
        this.lbMax.string = 'MAX BET: ' + m * 200;
        GameManager.table_mark = m;
        GameManager.tableId = id;
        this._maxbet = this.agTable * 200;
    },
    onClearbet() {
        var length;
        this._totalMoneyCurentBet = 0;
        length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            this.listEventCall[i].totalChip = this.listEventCall[i].totalChipFinal;
        }
        length = this.listEventCallMutil.length;
        for (let i = 0; i < length; i++) {
            this.listEventCallMutil[i].totalChip = this.listEventCallMutil[i].totalChipFinal;
        }
        if (this._totalMoneyBet == 0) this.nodeBet.btn_Rebet.interactable = true;
        //   this.nodeBet.btn_Double.interactable = false;

        length = this.listBetSingleCurentTurn.length
        for (let i = 0; i < length; i++) {
            this.listEventCall[this.listBetSingleCurentTurn[i]].onClear();
        }
        this.listBetSingleCurentTurn.length = 0;

        length = this.listBetMutilCurentTurn.length
        for (let i = 0; i < length; i++) {
            this.listEventCallMutil[this.listBetMutilCurentTurn[i]].onClear();
        }
        this.listBetMutilCurentTurn.length = 0;
        // this.isDouble = false;
        this.nodeBet.checkListChip();
    },
    onDealBet() {
        var length;
        this._totalMoneyBet += this._totalMoneyCurentBet;
        //cc.NGWlog('toall chip bet ben roulette la=== ' + this._totalMoneyBet);
        this._totalMoneyCurentBet = 0;
        length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            this.listEventCall[i].totalChipFinal = this.listEventCall[i].totalChip;
        }

        length = this.listEventCallMutil.length;
        for (let i = 0; i < length; i++) {
            this.listEventCallMutil[i].totalChipFinal = this.listEventCallMutil[i].totalChip;
        }

        length = this.listBetSingleCurentTurn.length;
        //cc.NGWlog('mang deal turn hien tai la===' + length);
        for (let i = 0; i < length; i++) {
            let temp = this.listBetSingleCurentTurn.shift();
            this.listEventCall[temp].onDeal();
            if (this.isCheckListLastBetSingleCurent(temp))
                this.listBetSingleCurent.push(temp)
        }
        length = this.listBetMutilCurentTurn.length;
        //cc.NGWlog('mang deal turn hien tai2 la===' + length);
        for (let i = 0; i < length; i++) {
            let temp = this.listBetMutilCurentTurn.shift();
            this.listEventCallMutil[temp].onDeal();
            if (this.isCheckListLastBetMultiCurent(temp))
                this.listBetMutilCurent.push(temp)
        }
        //      this.nodeBet.btn_Double.interactable = false;
        this.isDouble = false;
        this.nodeBet.checkListChip();
    },
    sendBetServer() {
        if (this._totalMoneyCurentBet < 1) return;
        let length = this.listBetSingleCurentTurn.length;
        let listArrBet = [];
        for (let i = 0; i < length; i++) {
            let item = this.listEventCall[this.listBetSingleCurentTurn[i]];
            let arrNumTemp = [item.number];
            let betType = 0;
            let amount = item.totalChip - item.totalChipFinal;

            let obj = {};
            obj.betType = betType;
            obj.numArr = arrNumTemp;
            obj.betAmount = amount;
            listArrBet.push(obj);
        }

        length = this.listBetMutilCurentTurn.length;
        for (let i = 0; i < length; i++) {
            let item = this.listEventCallMutil[this.listBetMutilCurentTurn[i]];
            let arrNumTemp = [];
            let lengthTemp = item.listControll.length;
            for (let j = 0; j < lengthTemp; j++) {
                arrNumTemp.push(item.listControll[j].number);
            }
            let amount = item.totalChip - item.totalChipFinal;
            if (lengthTemp < 5) {
                lengthTemp -= 1;
            } else {
                switch (lengthTemp) {
                    case 6:
                        lengthTemp = 4;
                        break;
                    case 12:
                        lengthTemp = 5;
                        break;
                    case 18:
                        lengthTemp = 6;
                        break;
                }
            }
            let obj = {};
            obj.betType = lengthTemp;
            obj.numArr = arrNumTemp;
            obj.betAmount = amount;
            listArrBet.push(obj);
        }

        require('NetworkManager').getInstance().sendBetRoulette(listArrBet); // online

        // require('DataForGameRoulette').getInstance().makeBet(listArrBet); // offline Loc


    },


    handleMakeBet(pid, data, totalBet) {
        let player = this.getPlayerWithId(pid);
        if (player == null) return;
        player.ag -= totalBet;
        if (player == this.thisPlayer) {
            if (totalBet < 1) {
                this.onClearbet();
                return;
            }
            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.coinAdd);
            this.onDealBet();
            //cc.NGWlog('so tien player con1 la=============== ' + player.ag);
            this.lbMoneyPlayer.string = GameManager.formatNumber(player.ag);
            //cc.NGWlog('so tien player con2 la=============== ' + player.ag);
            let nodeText = new cc.Node();
            let cpLbnode = nodeText.addComponent(cc.Label);
            cpLbnode.fontSize = 50;
            cpLbnode.font = this.font[0];
            cpLbnode.string = '-' + totalBet;
            this.nodeMain.addChild(nodeText, GAME_ZORDER.Z_PLAYERVIEW);
            nodeText.y = 60;
            nodeText.runAction(cc.sequence(cc.moveBy(2, cc.v2(0, 60)).easing(cc.easeExponentialOut()), cc.removeSelf()));
        } else {
            let listBet = JSON.parse(data);
            let length = listBet.length;

            for (let i = 0; i < length; i++) {
                //cc.NGWlog('============= i la==== ' + i);
                if (listBet[i].betType == 0) {
                    let item = this.listEventCall[listBet[i].numArr[0]];
                    this.InstantiateChipTheir(item, listBet[i].betAmount);
                } else {
                    // length = ;
                    for (let j = 0; j < this.listEventCallMutil.length; j++) {
                        if (this.listEventCallMutil[j].isCheckTheirBet(listBet[i].betType, listBet[i].numArr[0], listBet[i].numArr[listBet[i].numArr.length - 1])) {
                            let item = this.listEventCallMutil[j];
                            this.InstantiateChipTheir(item, listBet[i].betAmount);
                        }
                    }
                }
            }
        }
    },

    clearAllBetForNextGame() {
        this.tableRotate.stopAllActions();
        this.nodeBet.clearAllNextGame();
        var length;


        this.aniWinLose.node.active = false;



        length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            let item = this.listEventCall[i]
            item.turnOffEffect();
        }
        length = this.listEventCallMutil.length;
        for (let i = 0; i < length; i++) {
            let item = this.listEventCallMutil[i];
            item.turnOffEffect();
        }
        require("HandleGamePacket").NextEvt();
        if (this._totalMoneyBet == 0) return;

        length = this.listEventCall.length;
        for (let i = 0; i < length; i++) {
            let item = this.listEventCall[i]
            item.lastTotalChip = item.totalChipFinal;
            item.totalChip = 0;
            item.totalChipFinal = 0;

        }
        length = this.listEventCallMutil.length;
        for (let i = 0; i < length; i++) {
            let item = this.listEventCallMutil[i];
            item.lastTotalChip = item.totalChipFinal;
            item.totalChip = 0;
            item.totalChipFinal = 0;

        }
        if (this._totalMoneyBet > 0) this.nodeBet.btn_Rebet.interactable = true;
        this._isLastTotalMoneyBet = this._totalMoneyBet;
        this._totalMoneyBet = 0;
        this._totalMoneyCurentBet = 0;

        this.listLastBetSingle = this.listBetSingleCurent;
        this.listLastBetMutil = this.listBetMutilCurent;
        this.listBetSingleCurent = [];
        this.listBetMutilCurent = [];

        // length = this.listLastBetSingle.length;
        // for(let i = 0 ; i < length ; i++){
        //     this.listEventCall[this.listLastBetSingle[i]].clearAllNextGame();
        // };

        // length = this.listLastBetMutil.length;
        // for(let i = 0 ; i < length ; i++){
        //     this.listEventCallMutil[this.listLastBetMutil[i]].clearAllNextGame();
        // };

    },
    onClickRebet() {
        var length;
        this.isRebet = false;
        length = this.listLastBetSingle.length;
        //cc.NGWlog('length rebet hien tai la==== ' + length);
        for (let i = 0; i < length; i++) {
            let item = this.listEventCall[this.listLastBetSingle[i]]
            item.callBackEndSpecial(item.lastTotalChip);
        };
        length = this.listLastBetMutil.length;
        //cc.NGWlog('length rebet hien tai2 la==== ' + length);
        for (let i = 0; i < length; i++) {
            let item = this.listEventCallMutil[this.listLastBetMutil[i]]
            item.callBackEndSpecial(item.lastTotalChip);
        };

        this.nodeBet.setlbChip();
        //   this.sendBetServer();
    },
    onClickDouble() {
        var length;
        this.isRebet = false;
        if (this._totalMoneyBet == 0 && this._totalMoneyCurentBet == 0) {
            if ((this._isLastTotalMoneyBet * 2) > this.thisPlayer.ag) {
                require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('txt_koduchipx2'))
                return;
            }

            if ((this._isLastTotalMoneyBet * 2) > this._maxbet) {
                require('UIManager').instance.showToast(GameManager.getTextConfig('txt_maxBet').replace("%s", this._maxbet))
                return;
            }

            //cc.NGWlog('chay vao ham bet 0===========')
            length = this.listLastBetSingle.length;
            for (let i = 0; i < length; i++) {
                let item = this.listEventCall[this.listLastBetSingle[i]]
                item.callBackEndSpecial(item.lastTotalChip * 2);
            };
            length = this.listLastBetMutil.length;
            for (let i = 0; i < length; i++) {
                let item = this.listEventCallMutil[this.listLastBetMutil[i]]
                item.callBackEndSpecial(item.lastTotalChip * 2);
            };
            this.nodeBet.setlbChip();

        } else if (this._totalMoneyCurentBet == 0) {
            if ((this._totalMoneyBet) > this.thisPlayer.ag) {
                require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('txt_koduchipx2'))
                return;
            }

            if (this._totalMoneyBet * 2 > this._maxbet) {
                require('UIManager').instance.showToast(GameManager.getTextConfig('txt_maxBet').replace("%s", this._maxbet))
                return;
            }
            //cc.NGWlog('chay vao ham bet 1===========')
            length = this.listBetSingleCurent.length;
            for (let i = 0; i < length; i++) {
                let item = this.listEventCall[this.listBetSingleCurent[i]]
                item.callBackEndSpecial(item.totalChipFinal);
            };
            length = this.listBetMutilCurent.length;
            for (let i = 0; i < length; i++) {
                let item = this.listEventCallMutil[this.listBetMutilCurent[i]]
                    //cc.NGWlog('chip total truogn hop 1 la=== ' + item.totalChipFinal);
                item.callBackEndSpecial(item.totalChipFinal);

            };
            this.nodeBet.setlbChip();

        } else {
            if ((this._totalMoneyCurentBet) > this.thisPlayer.ag) {
                require('UIManager').instance.showToast(require('GameManager').getInstance().getTextConfig('txt_koduchipx2'))
                return;
            }
            if (this._totalMoneyCurentBet * 2 + this._totalMoneyBet > this._maxbet) {
                require('UIManager').instance.showToast(GameManager.getTextConfig('txt_maxBet').replace("%s", this._maxbet))
                return;
            }
            //cc.NGWlog('chay vao ham bet 2===========')
            length = this.listBetSingleCurentTurn.length;
            for (let i = 0; i < length; i++) {
                let item = this.listEventCall[this.listBetSingleCurentTurn[i]]
                item.callBackEndSpecial(item.totalChip);
            };
            length = this.listBetMutilCurentTurn.length;
            for (let i = 0; i < length; i++) {
                let item = this.listEventCallMutil[this.listBetMutilCurentTurn[i]]
                item.callBackEndSpecial(item.totalChip);
            };
            this.nodeBet.setlbChip();
        }





        //     length = this.listBetSingleCurentTurn.length;
        //     for(let i = 0 ; i <  length; i++){
        //         let item = this.listEventCall[this.listBetSingleCurentTurn[i]]
        //         item.callBackEndSpecial(item.totalChip);
        //     };
        //   //  this.listBetSingleCurentTurn.length = 0;
        //     length = this.listBetMutilCurentTurn.length;
        //     for(let i = 0 ; i <  length; i++){
        //         let item =this.listEventCallMutil[this.listBetMutilCurentTurn[i]]
        //         item.callBackEndSpecial(item.totalChip);
        //     };
        //   this.listBetMutilCurentTurn.length = 0;
        //  this.sendBetServer();
    },
    isCheckListLastBetSingleCurentTurn(number) {
        // let length = this.listBetSingleCurentTurn.length;
        // for(let i = 0 ; i < length ; i++){
        //     if(number == this.listBetSingleCurentTurn[i]) return false
        // }
        // return true;

        if (this.listBetSingleCurentTurn.indexOf(number) == -1) {
            return true;
        } else {
            return false;
        }

    },
    isCheckListLastBetMultiCurentTurn(number) {
        //     let length = this.listBetMutilCurentTurn.length;
        if (this.listBetMutilCurentTurn.indexOf(number) == -1) {
            return true;
        } else {
            return false;
        }
    },
    isCheckListLastBetSingleCurent(number) {
        //  let length = this.listBetSingleCurent.length;
        if (this.listBetSingleCurent.indexOf(number) == -1) {
            return true;
        } else {
            return false;
        }
    },
    isCheckListLastBetMultiCurent(number) {
        // let length = this.listBetMutilCurent.length;
        if (this.listBetMutilCurent.indexOf(number) == -1) {
            return true;
        } else {
            return false;
        }
    },

    handleStartGame(data) {
        this.aniStartGame.node.active = true;
        this.aniStartGame.setAnimation(0, 'animation', false);
        this.setTimeout(() => {
            this.aniStartGame.node.active = false;
            this.handleTimeToBet(data);
        }, 1000);
    },
    handleTimeToBet(data) {
        this.lbWating.node.parent.active = false;
        this.isBetTime = true;
        if (this.nodeBet == null) {
            this.nodeBet = cc.instantiate(this.nodeBetFp).getComponent('NodeBetRoulette');
            this.nodeBet._curMonney = GameManager.user.ag;
            this.nodeBet.setInfo(this.agTable, this.agTable * 200, this);
            this.node.addChild(this.nodeBet.node);
        };
        let time = parseInt(data) - 1;

        this.nodeTime = cc.instantiate(this.nodeBetTimePf).getComponent('CountDownTime');
        this.nodeTime.setInfo((time - 1), 2);
        this.nodeTime.node.position = cc.v2(0, cc.winSize.height / 2 + 100);
        this.node.addChild(this.nodeTime.node, GAME_ZORDER.Z_BUTTON);
        this.nodeTime.node.runAction(cc.moveTo(0.5, cc.v2(0, 40)).easing(cc.easeBackOut()));
        this.setTimeout(() => {
            this.nodeTime.node.runAction(cc.sequence(cc.spawn(cc.moveTo(0.5, this.lbTime.node.getParent().position), cc.scaleTo(0.5, 0.2), cc.fadeTo(0.5, 100)), cc.callFunc(() => {
                this.lbTime.node.getParent().active = true;
                this.lbTime.node.getParent().runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1)));
                this.nodeTime.node.destroy();
            })))
        }, 1000)
        this.nodeBet._curMonney = GameManager.user.ag;
        this.nodeBet.node.active = true;
        this.nodeBet.checkListChip();
        this.nodeBet.moveOn();

        time--;
        this.lbTime.node.color = cc.Color.YELLOW;
        this.lbTime.string = time;
        var interVal = setInterval(() => {
            if (this.node == null || typeof this.node == 'undefined') {
                clearInterval(interVal);
                return;
            }
            time--;
            this.lbTime.string = time;
            if (time < 1) {
                this.lbTime.node.getParent().active = false;
                this.nodeBet.node.active = false;
                this.isBetTime = false;
                clearInterval(interVal);
                return;
            }
        }, 1000)

        if (time > 4) {
            let timeDelay = (time - 4) * 1000;
            this.setTimeout(() => {
                this.lbTime.node.color = cc.Color.RED;
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.clockTick);
            }, timeDelay)
        } else {
            this.lbTime.node.color = cc.Color.RED;
        }
    },
    onShowResult() {
        let nameAni = '';
        switch (this._isResultColor) {
            case 0:
                nameAni = 'red';
                break;
            case 1:
                nameAni = 'black';
                break;
            case 2:
                nameAni = 'green';
                break;
        }

        this.setTimeout(() => {

            this.lbResult.node.active = true;
            this.lbResult.node.scale = 0.3;
            this.lbResult.node.runAction(cc.scaleTo(0.3, 1).easing(cc.easeExponentialInOut()));
            this.aniResult.node.active = true;
            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.showResult);
            this.aniResult.setAnimation(0, nameAni, false);
            this.addHistory();
            this.setTimeout(() => {

                this.lbResult.node.runAction(cc.scaleTo(0.5, 0).easing(cc.easeExponentialInOut()));
                this.setTimeout(() => {

                    this.lbResult.node.stopAllActions();
                    this.lbResult.node.active = false;
                }, 500)
            }, 1600)
            this.setTimeout(() => {

                this.showFinishEffect();
                this.nodeClickChat.active = true;
                this.nodeMain.runAction(cc.moveBy(1, cc.v2(-950, 0)).easing(cc.easeExponentialInOut()));
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_remove);
                this.setTimeout(() => {

                    let chipWin = null;
                    for (let i = 0; i < this.listDataFinish.length; i++) {
                        let player = this.getPlayerWithId(this.listDataFinish[i].playerId);
                        if (player != null) {
                            let totalAg = this.listDataFinish[i].ag;
                            let agChange = this.listDataFinish[i].agWin;
                            let agChangeLose = this.listDataFinish[i].agBet
                            player.ag = totalAg
                            if (player == this.thisPlayer) {
                                cc.NGWlog("dmm buc minh");
                                require('GameManager').getInstance().user.ag = totalAg;
                                
                                if (require('GameManager').getInstance().user.vip < 1 && agChangeLose != 0) require('NetworkManager').getInstance().sendUpVip();
                                chipWin = agChange;
                                if (chipWin < 1) {
                                    chipWin = -agChangeLose;
                                }
                                this.lbMoneyPlayer.string = GameManager.formatNumber(totalAg);
                               require('SMLSocketIO').getInstance().emitUpdateInfo();
                            }
                        }
                    }
                    
                    if (chipWin != null) {
                        if (chipWin < 0) {
                            this.aniWinLose.node.active = true;
                            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_lose);
                            this.aniWinLose.setAnimation(0, 'lose', false);
                            this.lbWinLose.font = this.font[0];
                            this.lbWinLose.string = chipWin;

                        } else if (chipWin > 0) {
                            this.aniWinLose.node.active = true;
                            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_win);
                            this.aniWinLose.setAnimation(0, 'win', true)
                            this.lbWinLose.font = this.font[1];
                            this.lbWinLose.string = "+" + chipWin;
                        }
                    }
                }, 5000)
            }, 3000)
        }, 2000);

    },
    showFinishEffect() {
        let length = this.listEventCall.length;
        let result = null
        for (let i = 0; i < length; i++) {
            if (this.listEventCall[i].number != this._resultNumber) {
                this.listEventCall[i].imgControllOff.active = true;
                this.listEventCall[i].chipLose(this.moneyDealer.position);

            } else {
                this.listEventCall[i].finisheffect(this.nodeBoxMoneyPlayer.position, this.nodeBoxMoneyTheir.position);
                result = this.listEventCall[i];
            }
        }
        length = this.listEventCallMutil.length;
        for (let i = 0; i < length; i++) {
            let item = this.listEventCallMutil[i];
            if (item.isCheckResult(result)) {
                item.finisheffect(this.nodeBoxMoneyPlayer.position, this.nodeBoxMoneyTheir.position);
            } else {
                // //cc.NGWlog('lose===================')
                if (item.imgControllOff != null) item.imgControllOff.active = true;
                item.chipLose(this.moneyDealer.position);
            }
        };


    },

    addHistory() {
        if (this.History == null) {
            this.History = cc.instantiate(this.HistoryPf).getComponent(require('HistoryRoulette'));
            this.History.setPool(this.ItemHistoryPoll);
        }
        this.History.addHistory(this._resultNumber, this._isResultColor);

        var nodeSp;
        nodeSp = new cc.Node();
        nodeSp.addComponent(cc.Sprite).spriteFrame = this.History.listSpriteFrame[this._isResultColor];
        let nodeLb = new cc.Node('labelTest');
        let lb = nodeLb.addComponent(cc.Label);
        lb.string = this._resultNumber
        lb.font = this.History.font;
        nodeSp.addChild(nodeLb);
        nodeLb.position = cc.v2(0, 4);
        nodeSp.scale = 0;
        nodeSp.position = cc.v2(0, -42);
        this.HistoryMini.insertChild(nodeSp, 0);
        nodeSp.runAction(cc.scaleTo(0.2, 1).easing(cc.easeElasticOut()));
        //cc.NGWlog('chay vao day roi');
        if (this.HistoryMini.children.length > 2) {
            this.HistoryMini.children[1].parent = this.NodeHistory;
            let length = this.NodeHistory.children.length
            if (length > 0) {
                for (let i = 0; i < length; i++) {
                    //cc.NGWlog('so lan chay vao day la=======')
                    this.NodeHistory.children[i].scale = 0.7;
                };
                if (length > 5) {
                    let item = this.NodeHistory.children[0];
                    item.removeFromParent(true);
                    item.destroy();
                }
            }
        }



    },
    onClickHistory() {
        require('SoundManager1').instance.playButton();
        if (this.History == null) return;

        if (this.History.node.getParent() == null) {
            this.node.addChild(this.History.node, GAME_ZORDER.Z_BUTTON)
        } else {
            this.History.node.active = true;
        }

    },
    creatNodeSpriteOff() {
        //cc.NGWlog('chay vao ham creator');

        for (let i = 0; i < 36; i++) {
            var size;
            if (i % 3 == 0 && i != 0) {
                this.vectSPOff = cc.v2(this.vectSPOff.x + 75.5, 63);
            } else {
                this.vectSPOff = cc.v2(this.vectSPOff.x, this.vectSPOff.y + 61);
            }
            size = cc.size(75.5, 61)
            let nodeSP = new cc.Node();
            let cpSpNodeSp = nodeSP.addComponent(cc.Sprite);
            cpSpNodeSp.spriteFrame = this.spOffBoxBet;
            nodeSP.position = this.vectSPOff;
            this.NodeSpriteOff.addChild(nodeSP);
            nodeSP.setContentSize(size);
            nodeSP.active = false;
        }
    },
    onClickListPLayer() {
        require('SoundManager1').instance.playButton();
        let item = cc.instantiate(this.nodeListPlayerPf).getComponent(require('NodeListPlayerRoulette'));
        for (let i = 0; i < this.players.length; i++) {
            item.addItem(this.players[i]);
        };
        this.node.addChild(item.node, GAME_ZORDER.Z_MENU_VIEW);
        item.onPopOn();
    },

    effectScaleMoney() {
        if (this.isRunAction) return;
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.coinBanker);
        this.isRunAction = true;
        this.nodeBoxMoneyPlayer.runAction(cc.sequence(cc.scaleTo(0.05, 1.3), cc.scaleTo(0.05, 1)));
        this.setTimeout(() => {

            this.isRunAction = false;
        }, 100)
    },
    effectScaleMoneyTheir() {
        if (this.isRunAction3) return;
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.coinBanker);
        this.isRunAction3 = true;
        this.nodeBoxMoneyTheir.runAction(cc.sequence(cc.scaleTo(0.05, 1.3), cc.scaleTo(0.05, 1)));
        this.setTimeout(() => {

            this.isRunAction3 = false;
        }, 100)
    },
    effectScaleMoneyDealer() {
        if (this.isRunAction2) return;
        this.isRunAction2 = true;
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.coinBanker);
        this.moneyDealer.runAction(cc.sequence(cc.callFunc(() => {
            this.moneyDealer.getComponent(cc.Button).interactable = true;
        }), cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 0.8), cc.callFunc(() => {
            this.moneyDealer.getComponent(cc.Button).interactable = false;
        })));
        this.setTimeout(() => {

            this.isRunAction2 = false;
        }, 200)

    },

    //  creatNodeSpriteOffMutil(){
    //     //cc.NGWlog('chay vao ham creator');
    //     // for(let i = 0 ; i < 38; i++){
    //     //     var size;
    //     //     if(i>34){};

    //     //         if(i % 3 == 0 && i != 0){
    //     //             this.vectSPOff =cc.v2(this.vectSPOff.x + 75.5 , 63);
    //     //         }else{
    //     //             this.vectSPOff =cc.v2(this.vectSPOff.x , this.vectSPOff.y + 61);
    //     //         }
    //     //         size = cc.size(75.5,61)



    //     //     let nodeSP = new cc.Node() ;
    //     //     let cpSpNodeSp = nodeSP.addComponent(cc.Sprite);
    //     //     cpSpNodeSp.spriteFrame = this.spOffBoxBet;
    //     //     nodeSP.setContentSize(size);
    //     //     nodeSP.position = this.vectSPOff;
    //     //     this.NodeSpriteOff.addChild(nodeSP);
    //     // }
    //  },
});