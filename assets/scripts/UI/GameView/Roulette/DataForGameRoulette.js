var DataForGameRoulette = cc.Class({
    extends: cc.Component,

    properties: {
        instantiate_parent: {
          default: null,
          type: cc.Node
        },

        btnPlay: {
            default : null,
            type: cc.Button
        },

        animDealer : {
            default : null,
            type: sp.Skeleton
        },

        icon : {
            default : null,
            type: cc.Sprite
        },
    },

    statics: {
        getInstance: function () {
          if (this.instance == null) {
            this.instance = new DataForGameRoulette();
          }
          return this.instance;
        }
    },

    creatGame()
    {
        var arrP = [];
        var pl = {
            id : 123456,
            N : "Player",
            Url : "Player",
            AG : this.getMoney(),
            LQ : 0,
            VIP : 10,
            isStart : true,
            IK : 1,
            sIP : "192.168.1.1",
            G : 3,
            Av : 5,
            FId : 0,
            GId : 0,
            UserType : 1,
            TotalAG : 0,
            timeToStart : 0,
            currentExp : 0,
            currentLevel : 0,
            expNextLevel : 0,
            CO: 0.0,
            CO0: 0.0,
            displayName: "Player"
        };
        arrP.push(pl);

        var idTable = Math.floor(Math.random() * 10000);

        var data = {
            N : "Auto",
            M : 1,
            ArrP : arrP,
            Id : idTable,
            V : 0,
            S : 1,
            issd : true,
            freeSpinCount: 0,
            level: {
                levelUser: 0,
                curLevelExp: 0,
                maxLevelExp: 4,
                agUser: this.getMoney()
            },
        };

        var dataRoulette = {
            evt: 'ctable',
            data: JSON.stringify(data)
        };

        cc.NGWlog("data create game: %s ", JSON.stringify(dataRoulette));

        require('HandleGamePacket').handleGame(JSON.stringify(dataRoulette));
    },

    timeToStart()
    {
        require('GameManager').getInstance().totalBetRouletteOffline = 0;
        require('GameManager').getInstance().dataBetRouletteOffline = [];
        
        var dataRoulette = {
            evt: 'timeToStart',
            data: "20"
        };

        cc.NGWlog("data create game: %s ", JSON.stringify(dataRoulette));
        require('HandleGamePacket').handleGame(JSON.stringify(dataRoulette));

        this.scheduleOnce(()=> {
            this.finish();
        }, 20);
    },

    makeBet(data)
    {   
        var total = 0;
        for(let i = 0; i < data.length; i++)
        {
            require('GameManager').getInstance().dataBetRouletteOffline.push(data[i]);
            require('GameManager').getInstance().totalBetRouletteOffline += data[i].betAmount;
            total += data[i].betAmount;
        }

        var ag = this.getMoney() - total;
        cc.sys.localStorage.setItem("agRouletteOffline", ag);
        
        var dataRoulette = {
            evt: 'make_bet',
            playerId : 123456,
            data: JSON.stringify(data),
            totalBet: total
        };

        cc.NGWlog("data make_bet: %s ", JSON.stringify(dataRoulette));
        require('HandleGamePacket').handleGame(JSON.stringify(dataRoulette));
    },

    finish()
    {
        var payTable = [35,17,11,8,5,2,1];
        var kq = Math.floor(Math.random() * 37);
        var agWin = 0;

        for(let i = 0; i < require('GameManager').getInstance().dataBetRouletteOffline.length; i++)
        {
            let data = require('GameManager').getInstance().dataBetRouletteOffline[i];
            for(let j = 0; j < data.numArr.length; j++)
            {
                if(kq === data.numArr[j])
                {
                    agWin += (data.betAmount * payTable[data.betType]);
                    break;
                }
            }
        }

        var ag = this.getMoney() + agWin;
        cc.sys.localStorage.setItem("agRouletteOffline", ag);

        var data = [];
        var pl = {
            playerId : 123456,
            agWin: agWin,
            ag: this.getMoney(),
            agBet: require('GameManager').getInstance().totalBetRouletteOffline
        };
        data.push(pl);

        var dataRoulette = {
            evt: 'finish',
            result: kq,
            data: JSON.stringify(data)
        };

        cc.NGWlog("data finish game: %s ", JSON.stringify(dataRoulette));
        require('HandleGamePacket').handleGame(JSON.stringify(dataRoulette));

        this.scheduleOnce(()=> {
            this.timeToStart();
        }, 25);
    },

    showGame()
    {
        this.node.runAction(cc.sequence(cc.callFunc(() => {
            this.btnPlay.node.interactable = false;
        }), cc.delayTime(2), cc.callFunc(() => {
            this.btnPlay.node.interactable = true;
        })));

        require("GameManager").getInstance().curGameId = GAME_ID.ROULETTE;
        require("GameManager").getInstance().curGameViewId = GAME_ID.ROULETTE;

        cc.loader.loadRes('prefab/RouletteGameView', (err, prefab) => {
            require("GameManager").getInstance().gameView = cc.instantiate(prefab).getComponent('RouletteGameView');
            this.instantiate_parent.addChild(require("GameManager").getInstance().gameView.node);
            this.btnPlay.node.active = false;
            this.icon.node.active = false;
            this.animDealer.node.active = false;
        });

        this.getData();
        
    },

    getData()
    {
        if(require("GameManager").getInstance().gameView !== null)
        {
            require("GameManager").getInstance().gameView.nodeGroupMenu.onHideItem(0);
            require("GameManager").getInstance().gameView.nodeGroupMenu.onHideItem(1);
            require("GameManager").getInstance().gameView.nodeGroupMenu.onHideItem(2);
            this.creatGame();
            this.timeToStart();
        }
        else
        {
            this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
                this.getData();
            })));
        }
    },

    getMoney()
    {
        var ag = cc.sys.localStorage.getItem("agRouletteOffline");

        if(ag === null)
        {
            cc.sys.localStorage.setItem("agRouletteOffline", 10000);
            ag = cc.sys.localStorage.getItem("agRouletteOffline");
        }

        return parseInt(ag);
    },
});

module.export = DataForGameRoulette;