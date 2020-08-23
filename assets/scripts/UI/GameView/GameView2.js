var Player = require('Player')
var GameManager = require('GameManager');
var NetworkManager = require("NetworkManager");

var GameView2 = cc.Class({
    extends: cc.Component,

    properties: {
        lbInfo: {
            default: null,
            type: cc.Label
        },
        listPosView: {
            default: [],
            type: [cc.Vec2]
        },

        agTable: {
            default: 0,
            visible: false,
        },
        turnCurrentPlayer: {
            default: null,
            visible: false,
            type: Player,
            serializable: false
        },

        table_id: {
            default: 0,
            visible: false
        },

        indexFinish: {
            default: 0,
            visible: false
        },
        itemChatNgoaiGame: require('ItemChatNgoaiGame'),
        btnScrenShot: {
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        require("NetworkManager").getInstance().isInGame = true;
        Global.MainView._isClickGame = false;
        this.playerViewPool = require('UIManager').instance.playerViewPool;
        //  cc.NGWlog('length plAYVIW POOL ==== ' , this.playerViewPool.get().getComponent('PlayerViewCasino'));
        this.quickChat = Global.QuickChatCasino;
        this.listDataDelay = [];
        this.stateGame = null;
        this.players = [];
        this.thisPlayer = null;
        this.nodeGroupMenu = Global.GroupOptionInGame;
        this.nodeGroupMenu.gameView = this;
        this.nodeGroupMenu.onShowAllItem();
        this.setPlaySound();
        this.icBack = null;

        this.cardPool = new cc.NodePool('Card');
        this.node.setContentSize(cc.winSize);

        if (cc.sys.isBrowser) {
            if (this.btnScrenShot !== null) {
                this.btnScrenShot.node.active = false;
            }
            if (require("GameManager").getInstance().curGameId == GAME_ID.TIENLEN) {
                this.lbInfo.getComponent(cc.Widget).left = 98;
            }

        }
        this.btnScrenShot.node.active = false;// hien cmt.dong tam
        cc.loader.loadRes("inviteBtn", (err, prefab) => {
            if (err) {
                cc.NGWlog("tai inviteBtn loi====")
            } else {
                for (let i = 1; i < this.listPosView.length; i++) {
                    if (this.listPosView[i] == null) continue;
                    let item = cc.instantiate(prefab).getComponent(cc.Button);
                    this.node.addChild(item.node, GAME_ZORDER.Z_PLAYERVIEW - 1);
                    item.node.position = this.listPosView[i];
                    var clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //This node is the node to which your event handler code component belongs
                    clickEventHandler.component = "GameView2";//This is the code file name
                    clickEventHandler.handler = "onClickInvite";
                    clickEventHandler.customEventData = "";
                    item.clickEvents.push(clickEventHandler);
                }

            }
        })
        require('UIManager').instance.alertView.setPosAlert();
        cc.sys.localStorage.setItem("isBack", "false");
    },
    onClickInvite() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickInvitePlayer_%s", require('GameManager').getInstance().getCurrentSceneName()));
        // var item = cc.instantiate(this.item_invite).getComponent('InvitePlayerInTable');
        // item.init(require('GameManager').getInstance().table_mark);
        // item.node.zIndex = cc.macro.MAX_ZINDEX;
        // this.node.addChild(item.node);
        if (Global.InviteFriendInTable === null) {
            cc.loader.loadRes("InviteInTable", (err, prefab) => {
                if (err) return
                Global.InviteFriendInTable = cc.instantiate(prefab).getComponent('InvitePlayerInTable');
                if (Global.InviteFriendInTable.node.getParent() === null) {
                    this.node.addChild(Global.InviteFriendInTable.node);
                    Global.InviteFriendInTable.node.zIndex = GAME_ZORDER.Z_MENU_VIEW;
                }
                Global.InviteFriendInTable.setInfo();
                Global.InviteFriendInTable.init(require('GameManager').getInstance().table_mark);
            })

        } else {
            if (Global.InviteFriendInTable.node.getParent() === null) {
                this.node.addChild(Global.InviteFriendInTable.node);
                Global.InviteFriendInTable.node.zIndex = GAME_ZORDER.Z_MENU_VIEW;
            }
            Global.InviteFriendInTable.setInfo();
            Global.InviteFriendInTable.init(require('GameManager').getInstance().table_mark);
        }
    },

    setPlaySound() {
        let music = cc.sys.localStorage.getItem("music");
        // cc.NGWlog('------> onShowMainView ', music);
        if (music === "on" || music === null) {
            require('SoundManager1').instance.playMusicBackground();
        } else {
            require('SoundManager1').instance.stopMusic();
        }
        var sound = cc.sys.localStorage.getItem("sound");
        if (sound === "off") {
            // cc.sys.localStorage.setItem("sound", "off");
            require('SoundManager1').instance.turnOffSFX();
        } else require('SoundManager1').instance.turnOnSFX();

    },

    handleChatTable(data) {
        cc.NGWlog('-=-=--=-=->1', data);
        var datName = data.Name;
        var datNName = data.NName;
        var datMSG = data.Data;
        var datType = data.T;
        if (typeof datName !== 'undefined') {
            var name = datName.toString();
        }
        if (typeof datNName !== 'undefined') {
            var nname = datNName.toString();
        }
        if (typeof datMSG !== 'undefined') {
            var msg = datMSG;
        }
        if (typeof datType !== 'undefined') {
            var type = (datType === null) ? '' : datType;
        }
        var pl = this.getPlayer(name);


        if (pl == null) return;
        let isPlayer = pl == this.thisPlayer ? true : false;
        if (datName.length > 9) datName = datName.substring(0, 9) + '...';

        if (datMSG !== null && datMSG !== '' && typeof datMSG !== 'undefined') {
            var str = pl.displayName + ": " + datMSG;
            if (this.itemChatNgoaiGame != null)
                this.itemChatNgoaiGame.setDataChatText(str);

            this.quickChat.addChatWithText(str, isPlayer);
        }
        if (typeof datType !== 'undefined') {
            var type = (datType === null) ? '' : datType;
            if (typeof type !== "undefined" && type !== '' && type.indexOf('e') != -1) {
                var id = parseInt(type.substring(type.indexOf('e') + 1, type.length));
                var str = pl.displayName + ": ";
                if (this.itemChatNgoaiGame != null)
                    this.itemChatNgoaiGame.setDataChatItem(str, id);
                this.quickChat.addChatWithItem(str, id, isPlayer);
            }
        }
        if (pl._playerView === null) return;
        if (typeof msg !== 'undefined') {
            if (msg != '') {
                var bubble = cc.instantiate(this.quickChat.preBubbleText).getComponent('BubbleChat');
                bubble.node.position = pl._playerView.node.position;
                this.node.addChild(bubble.node, GAME_ZORDER.Z_BUTTON);
                bubble.initChat(msg);
            }
        }
        if (typeof type !== 'undefined') {
            if (type != '') {
                if (type.indexOf('e') != -1) {
                    var listAnimation = this.quickChat.listEmoAni;
                    var idAnimation = parseInt(type.substring(type.indexOf('e') + 1, type.length));
                    var skeDat = listAnimation[idAnimation - 1];
                    // cc.NGWlog("Log vao chat e");
                } else if (type.indexOf('f') != -1) {
                    var listAnimation = this.quickChat.listEmoAniThrow;
                    var idAnimation = parseInt(type.substring(type.indexOf('f') + 1, type.length));
                    var skeDat = listAnimation[idAnimation];
                    // cc.NGWlog("Log vao chat f");
                }

                if (typeof skeDat !== 'undefined') {
                    // cc.NGWlog("Log vao check skeDat !== undefined");
                    // cc.NGWlog("Log vao check nname === '' %s",nname === '');
                    if (nname === '') {
                        var ani = cc.instantiate(this.quickChat.preItemAnimation).getComponent('ItemAnimation');
                        ani.node.position = pl._playerView.node.position;
                        //  ani.node.position = cc.v2(0,0);
                        this.node.addChild(ani.node, GAME_ZORDER.Z_BUTTON);
                        ani.initAnimation(skeDat);
                        ani.playAnimation("animation", true);
                    } else {
                        var npl = this.getPlayer(nname);
                        if (npl == null || npl._playerView === null) return;
                        cc.NGWlog("Log vao start create Nem nhau2");
                        // cc.NGWlog("pl is null %s | npl is null %s | idAnimation not undefined %s", pl !== null,npl !== null,typeof idAnimation !== 'undefined');
                        if (pl !== null && npl !== null && typeof idAnimation !== 'undefined') {
                            //Create icon
                            var icon = new cc.Node('Sprite');
                            var spIcon = icon.addComponent(cc.Sprite);
                            spIcon.spriteFrame = this.quickChat.listEmoThrowImg[idAnimation];
                            icon.position = pl._playerView.node.position;
                            this.node.addChild(icon, GAME_ZORDER.Z_BUTTON);
                            var npos = npl._playerView.node.position;
                            cc.NGWlog('npos=' + npos);
                            var move = cc.moveTo(0.7, npos).easing(cc.easeIn(0.7));
                            var rmv = cc.callFunc(() => {
                                icon.destroy();
                                var ani = cc.instantiate(this.quickChat.preItemAnimation).getComponent('ItemAnimation');
                                ani.node.position = npos;
                                this.node.addChild(ani.node, GAME_ZORDER.Z_BUTTON);
                                ani.initAnimation(skeDat);
                                ani.playAnimation();
                                let timeDel = 0.2;
                                if (idAnimation === 0 || idAnimation === 5) timeDel = 0;
                                this.node.runAction(cc.sequence(cc.delayTime(timeDel), cc.callFunc(() => { require('SoundManager1').instance.playNemNhau(idAnimation); })));
                            });
                            var act = cc.sequence(move, rmv);
                            icon.runAction(act);
                        }
                        cc.NGWlog('GameViewLog: create animation f done');
                    }
                }
            }
        }


    },
    handleCCTable(data) {
        cc.NGWlog('chay vao ham ctable');
        this.stateGame = STATE_GAME.WAITING;
        var name = data.Name;
        var player = this.getPlayer(name);
        if (player === null)
            return;

        for (var i = 0; i < this.players.length; i++) {
            var pl = this.players[i];
            if (pl == player)
                pl.setHost(true);
            else
                pl.setHost(false);
        }
    },
    readDataPlayer(_player, data) {
        _player.id = data.id;
        _player.fid = data.FId;
        _player.pname = data.N;
        _player.ag = data.AG;
        _player.vip = data.VIP;
        _player.avatar_id = data.Av;
        _player.is_ready = data.isStart;
        _player.ip = data.sIP;
        _player.displayName = data.displayName;
    },

    removePlayer(nameP, isInGame = false) {
        let player = this.getPlayer(nameP);
        if (player !== null) {
            this.players.splice(this.players.indexOf(player), 1);
            player.clearAllCard();
            this.playerViewPool.put(player._playerView.node);
            player = null;

            if (!isInGame) {
                this.updatePositionPlayerView();
            }
        }
    },
    handleLTable(data) {
        let name = data.Name;
        var player = this.getPlayer(name);
        if (player == null || typeof player == 'undefined') return;
        var msg = "";
        if (data.hasOwnProperty('message')) {
            msg = data.message;
        }
        cc.NGWlog('name nó la==== ' + name + 'nam mình là ===' + GameManager.getInstance().user.uname);
        if (name !== GameManager.getInstance().user.uname) {
            cc.NGWlog('nhảy vào đay rồi== ham lbtable')
            // require('SoundManager').playSound(ResDefine.sound_remove);
            if (typeof player.displayName !== 'undefined') {
                this.addChatLeave(player.displayName);
            }
            this.removePlayer(name);
        }
    },
    handleJTable(strData) {
        var listPlayer = JSON.parse(strData);
        cc.NGWlog(listPlayer);
        var player = new Player();
        this.players.push(player);
        if (this.playerViewPool.size() < 1) {
            player._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
        } else {
            player._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
        }
        this.node.addChild(player._playerView.node, GAME_ZORDER.Z_PLAYERVIEW);
        this.readDataPlayer(player, listPlayer);
        player.updatePlayerView();
        this.addChatJoin(player.displayName);
        this.updatePositionPlayerView();

    },
    handleVTable(strData) {
        this.stateGame = STATE_GAME.VIEWING;
        var data = JSON.parse(strData);
        this.setGameInfo(data.M, data.Id);
        var listPlayer = data.ArrP;
        var lTemp = [];
        for (var i = 0; i < listPlayer.length; i++) {
            cc.NGWlog(listPlayer[i]);
            let player = new Player();
            lTemp.push(player);
            if (this.playerViewPool.size() < 1) {
                player._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
            } else {
                player._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
            }
            this.node.addChild(player._playerView.node, GAME_ZORDER.Z_PLAYERVIEW);
            this.readDataPlayer(player, listPlayer[i]);
            if (i === 0)
                player.setHost(true);
            if (player.id === GameManager.getInstance().user.id) {
                this.thisPlayer = player;
            }
            player.updatePlayerView();
        }
        //Init thisPlayer
        this.players = lTemp;
        let player = new Player();
        if (this.playerViewPool.size() < 1) {
            player._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
        } else {
            player._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
        }

        this.node.addChild(player._playerView.node, GAME_ZORDER.Z_PLAYERVIEW);
        player.id = GameManager.getInstance().user.id;
        if (GameManager.getInstance().user.tinyURL.indexOf("fb.") !== -1) {
            player.fid = GameManager.getInstance().user.tinyURL.substring(3, GameManager.getInstance().user.tinyURL.length);
        }
        player.pname = GameManager.getInstance().user.uname;
        player.displayName = GameManager.getInstance().user.displayName;
        player.ag = GameManager.getInstance().user.ag;
        player.vip = GameManager.getInstance().user.vip;
        player.avatar_id = GameManager.getInstance().user.avtId;
        player.is_ready = true;
        player.ip = '0.0.0.0';
        player.updatePlayerView();
        this.thisPlayer = player;
        this.players.push(player);
        this.updatePositionPlayerView();
    },
    handleCTable(strData) {
        cc.NGWlog('===========> handleCTable: ');
        // { "evt": "ctable", "data": "{\"N\":\"Poker[1732]\",\"M\":100,\"ArrP\":[{\"id\":100425492,\"N\":\"sondt123789\",\"Url\":\"sondt123789\",\"AG\":101480,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"sIP\":\"116.96.80.111\",\"G\":3,\"Av\":5,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0}],\"Id\":1732,\"V\":0,\"S\":5,\"issd\":true}" }
        var data = JSON.parse(strData);
        this.stateGame = STATE_GAME.WAITING;
        this.setGameInfo(data.M, data.Id, data.Time);
        var listPlayer = data.ArrP[0];
        this.thisPlayer = new Player();
        this.players.push(this.thisPlayer);
        if (this.playerViewPool.size() < 1) {
            this.thisPlayer._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
            cc.NGWlog("on size = 1")
        } else {
            this.thisPlayer._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
            cc.NGWlog("on size = 2")
        }
        this.node.addChild(this.thisPlayer._playerView.node, GAME_ZORDER.Z_PLAYERVIEW);
        this.readDataPlayer(this.thisPlayer, listPlayer);
        this.thisPlayer.setHost(true);
        this.addChatJoin(this.thisPlayer.displayName);
        this.thisPlayer.updatePlayerView();
        this.updatePositionPlayerView();
    },

    handleRTable(data) {
        var name = data.Name;
        var player = this.getPlayer(name);
        if (player === null)
            return;

        player.setReady(true);
    },
    sendTrackingGame() {

        this.stateGame = STATE_GAME.PLAYING;
    },

    handleRJTable(strData) {
        this.stateGame = STATE_GAME.PLAYING;
        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;
        var lTemp = [];
        this.setGameInfo(data.M, data.Id);
        for (var i = 0; i < listPlayer.length; i++) {
            var player = new Player();
            lTemp.push(player);
            if (this.playerViewPool.size() < 1) {
                player._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
            } else {
                player._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
            }

            this.node.addChild(player._playerView.node, GAME_ZORDER.Z_PLAYERVIEW);
            this.readDataPlayer(player, listPlayer[i]);
            if (i === 0) {
                player.setHost(true);
            }
            if (player.id === GameManager.getInstance().user.id) {
                this.thisPlayer = player;
            }
            player.updatePlayerView();
            player.is_ready = true;
        }
        this.players = lTemp;
        this.updatePositionPlayerView();
        this.addChatJoin(this.thisPlayer.displayName);

        if (cc.sys.localStorage.getItem("isBack") == 'true') {
            this.thisPlayer._playerView.icBack.node.active = true;
        } else {
            this.thisPlayer._playerView.icBack.node.active = false;
        }
    },


    handleSTable(strData) {
        for (var i = 0; i < this.players.length; i++) {
            this.playerViewPool.put(this.players[i]._playerView.node);
            cc.NGWlog('chay vao ham xoa playerViewwwwww ');
        }
        this.players.length = 0;
        var data = JSON.parse(strData);
        this.stateGame = STATE_GAME.WAITING;
        this.setGameInfo(data.M, data.Id);
        var listPlayer = data.ArrP;

        for (let i = 0; i < listPlayer.length; i++) {
            let player = new Player();
            this.players.push(player);
            if (this.playerViewPool.size() < 1) {
                player._playerView = cc.instantiate(Global.PlayerView.node).getComponent('PlayerViewCasino');
                cc.NGWlog('chay voa ham khoi tao playerview===========1')
            } else {
                player._playerView = this.playerViewPool.get().getComponent('PlayerViewCasino');
                cc.NGWlog('chay voa ham khoi tao playerview===========2')
            }
            this.node.addChild(player._playerView.node, GAME_ZORDER.Z_PLAYERVIEW);
            this.readDataPlayer(player, listPlayer[i]);
            if (i === 0)
                player.setHost(true);
            if (player.id === GameManager.getInstance().user.id) { //che do test
                this.thisPlayer = player;
                cc.NGWlog('chay duoc vao ham set this player')
            }
            player.updatePlayerView();
            player.is_ready = true;
        }

        this.addChatJoin(this.thisPlayer.displayName);
        this.updatePositionPlayerView();
    },


    handleFinishGame() {
        this.stateGame = STATE_GAME.WAITING;
        // GameManager.getInstance().vectorDelay[0].timeDelay = 0;
        this.clearAllCard();
    },

    onLeave() {
        cc.NGWlog('-------------Trang thaionLeave :   ' + this.stateGame);
        if (this.stateGame !== STATE_GAME.PLAYING) {
            cc.log("data levave game viwe la== " + JSON.stringify(this.dataLeave))
            require('SMLSocketIO').getInstance().emitSIOWithValue(this.dataLeave, "LeavePacket", false);
            this.cleanGame();
            require('GameManager').getInstance().gameView = null;
            //this.dataLeave = {};
            this.node.destroy();
        } else {
            setTimeout(() => {
                if (this.node == null || typeof this.node == 'undefined') return;
                this.onLeave()
            }, 500)

        }
    },
    cleanGame() {
        require("NetworkManager").getInstance().isInGame = false;
        cc.sys.localStorage.setItem("isBack", "false");

        if (Global.InviteFriendInTable !== null && Global.InviteFriendInTable.node.getParent() !== null) Global.InviteFriendInTable.node.removeFromParent();
        this.stateGame = STATE_GAME.WAITING;
        require('HandleGamePacket').listEvt.length = 0;
        require('NetworkManager').getInstance().listEvtGame.length = 0;
        require('GameManager').getInstance().setCurView(CURRENT_VIEW.LOBBY);
        let music = cc.sys.localStorage.getItem("music");
        if (music === "on")
            require('SoundManager1').instance.playMusicBackground();
        else {
            require('SoundManager1').instance.stopMusic();
        }
        if (Global.MainView.isUpVip == true) {
            Global.MainView.isUpVip = false;
        }
        require('NetworkManager').getInstance().sendUAG();
        this.clearAllCard();
        if (this.thisPlayer != null && this.thisPlayer._playerView != null)
            this.thisPlayer._playerView.icBack.node.active = false;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i]._playerView !== null) {
                this.playerViewPool.put(this.players[i]._playerView.node);
            }
        }
        this.quickChat.reset();
        if (this.nodeGroupMenu != null && this.nodeGroupMenu.node.getParent()) this.nodeGroupMenu.node.removeFromParent(false);
        if (this.quickChat.node.getParent()) this.quickChat.node.removeFromParent(false);
        Global.LobbyView.reuse();
        if (Global.InfoPlayerView.node.getParent() != null) Global.InfoPlayerView.node.removeFromParent();
        require('UIManager').instance.onShowLobbyView();
    },
    addChatJoin(namePlayer) {
        let nameP = namePlayer;
        if (nameP === this.thisPlayer.pname) {
            var str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_jointable').replace("%lld", this.agTable + "");
            if (this.itemChatNgoaiGame != null)
                this.itemChatNgoaiGame.setDataChatText(str);
            this.quickChat.addChatWithText(str);

        } else {
            //if (nameP.length > 9) nameP = nameP.substring(0, 9) + '...';
            //hien day du ten nguoi choi
            var str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_player_jointable').replace("%s", nameP);
            if (this.itemChatNgoaiGame != null)

                this.itemChatNgoaiGame.setDataChatText(str);
            this.quickChat.addChatWithText(str);
        }
    },

    addChatLeave(namePlayer) {
        let nameP = namePlayer;

        //if (nameP.length > 9) nameP = nameP.substring(0, 9) + '...';
        var str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_player_leavetable').replace("%s", nameP);
        if (this.itemChatNgoaiGame != null)
            this.itemChatNgoaiGame.setDataChatText(str);

        this.quickChat.addChatWithText(str);
    },


    onClickBack() { // DAY LA CLICK GROUP OPTION MENU
        require('SoundManager1').instance.playButton();
        if (this.nodeGroupMenu !== null) {
            this.nodeGroupMenu.show();
        } else {
            this.nodeGroupMenu = Global.GroupOptionInGame
            this.nodeGroupMenu.init();
            this.nodeGroupMenu.show();
        }
        if (this.nodeGroupMenu.node.getParent() == null)
            this.node.addChild(this.nodeGroupMenu.node, GAME_ZORDER.Z_MENU_VIEW);

        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowGroupMenu_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },
    onClickchat() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChat_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.stateGame === STATE_GAME.VIEWING) return;
        if (this.quickChat.node.getParent() === null) {
            cc.NGWlog('chay voa ham reset quick chat');
            this.node.addChild(this.quickChat.node, GAME_ZORDER.Z_MENU_VIEW);
            //  this.quickChat.initListText(); // boi vi moi game co' 1 list text chat khac nhau
        }
        this.quickChat.onIn();
    },
    onClickEmoji() {
        require('SoundManager1').instance.playButton();
        if (this.stateGame === STATE_GAME.VIEWING) return;
        this.quickChat.quickChatEmo.node.parent = this.node;
        this.quickChat.quickChatEmo.node.zIndex = GAME_ZORDER.Z_MENU_VIEW;
        this.quickChat.quickChatEmo.initText();
        if (require("GameManager").getInstance().curGameId == GAME_ID.TIENLEN) {
            this.quickChat.quickChatEmo.onIn(true, true);
        } else {
            this.quickChat.quickChatEmo.onIn(true);
        }


    },
    onClickShareFb() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShareScreenShot_%s", require('GameManager').getInstance().getCurrentSceneName()));
        cc.NGWlog('On click Share Facebook');

        if (this.btnScrenShot !== null) this.btnScrenShot.interactable = false;

        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            if (this.btnScrenShot !== null) this.btnScrenShot.interactable = true;
        }, 5000)

        if (cc.sys.isNative) {
            require('UIManager').instance.onTakeScreenShot();
        }

    },
    startGameAndSendTracking() {
        this.stateGame = STATE_GAME.PLAYING;
    },
    clearAllCard() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].clearAllCard();
        }
    },
    setGameInfo(m, id) {
        this.agTable = m;
        if (GameManager.getInstance().curGameId === GAME_ID.BACCARAT) {
            this.lbInfo.string = "ID: " + id;
        } else {
            cc.NGWlog('m set info la=====' + m)
            this.lbInfo.string = cc.js.formatStr('%s %d\n%s: %s', GameManager.getInstance().getTextConfig('txt_id'), id, GameManager.getInstance().getTextConfig('txt_bet'), GameManager.getInstance().formatNumber(m));
        }

        GameManager.getInstance().table_mark = m;
        GameManager.getInstance().tableId = id;
    },

    setTurn(turnName, time = 20) {

        if (this.turnCurrentPlayer === null) {
            for (var i = 0; i < this.players.length; i++) {
                this.players[i].setTurn(false);
            }
        } else {
            this.turnCurrentPlayer.setTurn(false);
        }

        this.turnCurrentPlayer = this.getPlayer(turnName);
        cc.NGWlog('------------------------------> TURN    ' + turnName);
        cc.NGWlog(this.turnCurrentPlayer);
        if (this.turnCurrentPlayer !== null) {
            cc.NGWlog('------------------------------> TURN sfsdfsdjgdslgkjd   ' + this.turnCurrentPlayer.pname);
            cc.NGWlog('------------------------------> TURN  time  ' + time);
            this.turnCurrentPlayer.setTurn(true, time);
        }
    },

    getPlayer(namePlayer) {
        for (var i = 0; i < this.players.length; i++) {
            if (namePlayer === this.players[i].pname) {
                return this.players[i];
            }
        }

        return null;
    },
    getIndexWithName(namePlayer) {
        for (var i = 0; i < this.players.length; i++) {
            if (namePlayer === this.players[i].pname) {
                return i;
            }
        }
        return null;
    },
    getIndexOfPlayer(player) {
        return this.players.indexOf(player);
    },
    getIndexOf(player) {
        let index = this.getIndexOfPlayer(player); //vi tri hien tai trong players
        let thisPlayerIndex = this.players.length;
        if (this.thisPlayer) {
            thisPlayerIndex = this.getIndexOfPlayer(this.thisPlayer);
        }
        return ((index + this.players.length - thisPlayerIndex) % this.players.length);
    },

    updatePositionPlayerView() {
        for (let i = 0; i < this.players.length; i++) {
            let index = this.getDynamicIndex(this.getIndexOf(this.players[i]));
            this.players[i]._playerView.node.position = this.listPosView[index];
            this.players[i]._indexDynamic = index;
        }
    },

    getDynamicIndex(index) {
        if (index == 0) return 0;

        var _index = index;


        if (require('GameManager').getInstance().curGameId === GAME_ID.BINH || require('GameManager').getInstance().curGameId === GAME_ID.TIENLEN) {
            if (this.players.length === 2)
                _index++;

        } else {
            if (this.players.length <= 3) {
                _index += 3;
            } else if (this.players.length <= 5) {
                _index += 1;

                if (index >= 2)
                    _index += 1;
                if (index >= 4)
                    _index += 1;
            }
        }
        return _index;
    },

    getPlayerWithId(idPlayer) {
        for (var i = 0; i < this.players.length; i++) {
            if (idPlayer === this.players[i].id) {
                return this.players[i];
            }
        }
        return null;
    },
    generateRandomNumber(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },
    handleAutoExit(data) {
        cc.NGWlog('Day ra ngoai'); //  commit tam thoi ko dung
        if (typeof data.reg === 'boolean') {
            let str = '';
            if (data.reg == true && cc.sys.localStorage.getItem("isBack") === 'false') {
                this.thisPlayer._playerView.icBack.node.active = true;
                str = GameManager.getInstance().getTextConfig('wait_game_end_to_leave')
                cc.sys.localStorage.setItem("isBack", "true");
            }
            else if (data.reg == false && cc.sys.localStorage.getItem("isBack") === 'true') {
                this.thisPlayer._playerView.icBack.node.active = false;
                str = GameManager.getInstance().getTextConfig('minidice_unsign_leave_table')
                cc.sys.localStorage.setItem("isBack", "false");
            };

            require("GameManager").getInstance().onShowToast(str);
        } else if (typeof data.data != 'undefined') {
            this.thisPlayer._playerView.icBack.node.active = true;
            cc.sys.localStorage.setItem("isBack", "true");
            require("GameManager").getInstance().onShowToast(data.data);
        }
    },

    getCard() {
        let card;
        if (this.cardPool.size() < 1)
            card = cc.instantiate(Global.Card.node).getComponent('Card');
        else
            card = this.cardPool.get().getComponent('Card');

        return card;
    },
    removerCard(card) {
        this.cardPool.put(card);
    },
    setTimeout(fun, delayTime) {
        setTimeout(() => {
            if (this.node == null) return;
            fun.call();
        }, delayTime);
    },
    sendDataGame(data) {
        NetworkManager.getInstance().sendDataGame(JSON.stringify(data))
    }
});
module.exports = GameView2;