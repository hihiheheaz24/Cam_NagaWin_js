const GameManager = require("GameManager");
const HandleServicePacket = require("HandleServicePacket");
const HandleGamePacket = require("HandleGamePacket");

var connector = null;
var indexListSeverIp = 0;
var count = 0;
var fun = null;

var packetCallback = function (packet) {
    cc.NGWlog("..........................packetCallback:  " + packet.classId);
    //  var temp=0;

    switch (packet.classId) {
        case FB_PROTOCOL.PingPacket.CLASSID:
            cc.NGWlog("=========FB_PROTOCOL.PingPacket.CLASSID");
            cc.NGWlog(packet);
            break;
        case FB_PROTOCOL.ServiceTransportPacket.CLASSID:
            {
                var byteArray = FIREBASE.ByteArray.fromBase64String(packet.servicedata);
                var message = utf8.fromByteArray(byteArray);
                // receiveDataFromService($.parseJSON(message));
                switch (JSON.parse(message).evt) {
                    case "getChatWorld":
                   // case "followlist":
                    case "messagelist":
                        cc.NGWlog("ROI VAO CASE KO SHOW LOG");
                        break;
                    default:
                        cc.NGWlog("==========ServiceTransportPacket: " + message);
                }
                HandleServicePacket.handleService(message);
                break;
            }
        case FB_PROTOCOL.JoinResponsePacket.CLASSID:
            cc.NGWlog(
                "Join response: " +
                packet.status +
                "   code  " +
                packet.code +
                " id  " +
                packet.tableid
            );
            if (packet.status === "OK") {

                NetworkManager.getInstance().listEvtGame.length = 0;
                cc.NGWlog('========================== packet OnShowGame');

                let dataJson = {};
                dataJson.tableid = packet.tableid;
                dataJson.curGameID = GameManager.getInstance().curGameId;
                require('SMLSocketIO').getInstance().emitSIOWithValue(dataJson, "JoinPacket", false);
                require("UIManager").instance.onShowGame();
            } else {
                cc.NGWlog('hide load ben vao` ban` ko thanh cong====')
                require('UIManager').instance.onHideLoad();
                var _str = GameManager.getInstance().getTextConfig(
                    "show_join_error"
                );
                switch (packet.code) {
                    case -4:
                        _str = "";
                        break;
                    case -5:
                        _str = GameManager.getInstance().getTextConfig(
                            "err_table_another_table"
                        );
                        break;
                    case -6:
                        _str = GameManager.getInstance().getTextConfig("err_table_full");
                        break;
                    case -7:
                        // _str = GameManager.getInstance().getTextConfig("err_table_vip");
                        break;
                    case -8:
                        _str = GameManager.getInstance().getTextConfig("txt_not_enough_money_gl");

                        break;
                }

                let dataJson = {};
                dataJson.codeError = packet.code;
                dataJson.msgError = _str;
                require('SMLSocketIO').getInstance().emitSIOWithValue(dataJson, "JoinPacket", false);
                if (_str !== "") GameManager.getInstance().onShowConfirmDialog(_str);
            }
            break;

        case FB_PROTOCOL.GameTransportPacket.CLASSID:
            GameManager.getInstance().tableId = packet.tableid;
            var byteArray = FIREBASE.ByteArray.fromBase64String(packet.gamedata);
            var message = utf8.fromByteArray(byteArray);
            cc.NGWlog("Evt  tra ve ==================================: " + message);
            NetworkManager.getInstance().listEvtGame.push(message);
            if (require("GameManager").getInstance().gameView != null && require("GameManager").getInstance().gameView.node != null) {
                NetworkManager.getInstance().playGame();
            }


            break;
        case FB_PROTOCOL.LeaveResponsePacket.CLASSID:
            // user.tableId = 0;
            cc.NGWlog("Leave response received for table: " + packet.tableid);
            cc.NGWlog(packet);
            if (packet.status === "OK") {
                if (GameManager.getInstance().gameView !== null) {
                    cc.NGWlog("--------    FB_PROTOCOL.LeavePacket.CLASSID");
                    require('NetworkManager').getInstance().sendPromotionInfo();
                    HandleGamePacket.handleLeave();
                    //   HandleGamePacket.listEvt.length = 0;
                }
            } else {
                cc.NGWlog("error " + packet.code);
                let dataJson = {};
                dataJson.codeError = packet.code;
                dataJson.msgError = packet.status;
                require('SMLSocketIO').getInstance().emitSIOWithValue(dataJson, "LeavePacket", false);
            }
            break;
        case FB_PROTOCOL.CreateTableResponsePacket.CLASSID:
            cc.NGWlog("Create response received for table: " + packet.tableid);
            // if (packet.code == 1) {
            //     cc.NGWlog("Bạn không đủ Gold tạo bàn. Vui lòng nạp thêm Gold !");
            // }
            break;
        case FB_PROTOCOL.ForcedLogoutPacket.CLASSID:
            {

                cc.NGWlog("You are ForcedLogoutPacket....");
                let btnTxt = require("GameManager").getInstance().getTextConfig("txt_ok");
                cc.sys.localStorage.setItem('isLogOut', 'true');
                GameManager.getInstance().isChooseGame = false;
                setTimeout(() => {
                    require("UIManager").instance.onShowWarningDialog(packet.message, DIALOG_TYPE.ONE_BTN, btnTxt, () => {
                    });
                }, 1000)
                break;
            }
        case FB_PROTOCOL.NotifyJoinPacket.CLASSID:
            cc.NGWlog("Player " + packet.pid + " joined");
            break;
        case FB_PROTOCOL.NotifyLeavePacket.CLASSID:
            cc.NGWlog("Player " + packet.pid + " left");
            break;
        //case FB_PROTOCOL.SeatInfoPacket.CLASSID :
        //    cc.NGWlog("Player " + packet.player.pid + " is seated in seat " + packet.seat);
        //    break;
        case FB_PROTOCOL.WatchResponsePacket.CLASSID:
            cc.NGWlog("Watch response for table: " + packet.tableid);
            break;
        case FB_PROTOCOL.TableChatPacket.CLASSID:
            cc.NGWlog("Received chat from " + packet.pid + ": " + packet.message);
            break;
        case FB_PROTOCOL.MttRegisterResponsePacket.CLASSID:
            cc.NGWlog("Registration response status: " + packet.status);
            //handleRegisterResponse(packet);
            break;
        case FB_PROTOCOL.MttUnregisterResponsePacket.CLASSID:
            cc.NGWlog("Unregistration response status: " + packet.status);
            //handleUnregisterResponse(packet);
            break;
        case FB_PROTOCOL.MttSeatedPacket.CLASSID:
            cc.NGWlog("MttSeatedPacket.");
            //handleMttSeated(packet);
            break;
        case FB_PROTOCOL.NotifyRegisteredPacket.CLASSID:
            cc.NGWlog("Notify Registered");
            //registeredTournaments = registeredTournaments.concat(packet.tournaments);
            //cc.NGWlog("Registered tournaments: " + registeredTournaments);
            break;
        case FB_PROTOCOL.MttTransportPacket.CLASSID:
            cc.NGWlog("Received mtt data.");
            //handleMttTransport(packet);
            break;
    }
};
// var loginCallback = function (code, playerId, name, message) {
var loginCallback = function (status, playerId, screenname, credentials, code, message) {
    cc.NGWlog(
        "loginCallback code : " +
        code +
        " id : " +
        playerId +
        " screenname: " +
        screenname +
        " status: " +
        status +
        " message: " +
        message
    );
    Global.LoginView.isClickLogin = false;
    Global.MainView._checkMailFirtsTime = true;
    if (status == "OK") {
        cc.sys.localStorage.setItem('isLogOut', 'false');
        NetworkManager.getInstance().isCheckLoginAllSeverIP = false;
        var byteArray = FIREBASE.ByteArray.fromBase64String(credentials);
        var data = utf8.fromByteArray(byteArray);

        if (GameManager.getInstance().isChooseGame) {
            let gameCur = GameManager.getInstance().curGameId;

            NetworkManager.getInstance().sendSelectG2(
                GameManager.getInstance().curGameId
            );

            if (GAME_INFO[gameCur].isPlayNow || GameManager.getInstance().user.vip < 1) {
                NetworkManager.getInstance().sendPlayNow(GameManager.getInstance().curGameId);
            }

            GameManager.getInstance().isChooseGame = false;
        } else {
            require("GameManager").getInstance().isLoginSucces = true;
            var jsonData = JSON.parse(data);
            GameManager.getInstance().initUser(jsonData);
            Global.LoginView.node.active = false;
            require('UIManager').instance.onShowMainView();
            require('UIManager').instance.onHideLoad();
            Global.MainView.startGame();
            GameManager.getInstance().initIAP();
            let config_PM = '[{"type":"iap","title":"iap","title_img":"https://storage.googleapis.com/s.ngwcasino.com/test/IAPCAM.png","items":[{"url":"khmer.ngw.card.slot.1","txtPromo":"1USD = 60,606 Chips","txtChip":"60,000 Chips","txtBuy":"0.99 USD","txtBonus":"67%","cost":1},{"url":"khmer.ngw.card.slot.2","txtPromo":"1USD = 64,322 Chips","txtChip":"128,000 Chips","txtBuy":"1.99 USD","txtBonus":"78%","cost":2},{"url":"khmer.ngw.card.slot.5","txtPromo":"1USD = 70,140 Chips","txtChip":"350,000 Chips","txtBuy":"4.99 USD","txtBonus":"94%","cost":5},{"url":"khmer.ngw.card.slot.20","txtPromo":"1USD = 64,032 Chips","txtChip":"1,280,000 Chips","txtBuy":"19.99 USD","txtBonus":"78%","cost":20},{"url":"khmer.ngw.card.slot.50","txtPromo":"1USD = 64,013 Chips","txtChip":"3,200,000 Chips","txtBuy":"49.99 USD","txtBonus":"78%","cost":50},{"url":"khmer.ngw.card.slot.100","txtPromo":"1USD = 70,007 Chips","txtChip":"7,000,000 Chips","txtBuy":"99.99 USD","txtBonus":"94%","cost":100}]}]'
            let strPM = cc.sys.localStorage.getItem('configPM_' + require("GameManager").getInstance().user.id)
            if (strPM == null || strPM == 'undefined')
                cc.sys.localStorage.setItem('configPM_' + require("GameManager").getInstance().user.id, config_PM)

            require('UIManager').instance.requestConfigUser(data);
        }
        GameManager.getInstance().isReconnect = false;
        GameManager.getInstance().isLoginOnGame = false;
    } else {

        let objData = {};
        objData.codeError = code;
        objData.MsgError = message;
        require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "LoginPacket", false);
        // showInfoDialog(message);
        require("UIManager").instance.onShowConfirmDialog(message);
        let length = require("GameManager").getInstance().listIp.length

        for (let i = indexListSeverIp; i < length - 1; i++) {
            if (require("GameManager").getInstance().listIp[indexListSeverIp].domain != require("GameManager").getInstance().listIp[i + 1].domain) {
                NetworkManager.getInstance().isCheckLoginAllSeverIP = true;
                NetworkManager.getInstance().connect_sv(require("GameManager").getInstance().listIp[i].domain, "");
                indexListSeverIp = i;
                return;
            }

        }
        NetworkManager.getInstance().isCheckLoginAllSeverIP = false;
        require('UIManager').instance.onHideLoad();
        NetworkManager.getInstance().indexListSeverIp = 1;

    }
};
// var statusCallback = function (status) {
var statusCallback = function (status) {
    //  cc.NGWlog("----------Connect status 0 : " + FIREBASE.ConnectionStatus.CONNECTED);
    cc.NGWlog("----------Connect status : " + status);
    switch (status) {
        case FIREBASE.ConnectionStatus.CONNECTED:
            {
                if (NetworkManager.getInstance().statusConnect == FIREBASE.ConnectionStatus.CONNECTED) return;
                NetworkManager.getInstance().statusConnect = status;
                require('UIManager').instance.onHideLoad()
                NetworkManager.getInstance().connected = true;
                GameManager.getInstance().showPopConnect = true;
                require("GameManager").getInstance().time_out_game = 0;
                count = 0;
                cc.NGWlog("Connected to server...");
                let isAutoLogin = cc.sys.localStorage.getItem('isLogOut') || "false";
                cc.log("gia tri auto login la== " + isAutoLogin + " type:" + GameManager.getInstance().typeLogin);
                if (IS_RUN_INSTANT_FACEBOOK) {
                    NetworkManager.getInstance().onLogin(
                        "1",
                        GameManager.getInstance().access_token,
                        false,
                        false
                    );

                    if (GameManager.getInstance().startLogin) {
                        GameManager.getInstance().startLogin = false;
                        GameManager.getInstance().onLoginFBInstant();
                    }

                    return;
                }
                if (NetworkManager.getInstance().isInGame || GameManager.getInstance().isReconnect || isAutoLogin === "false") {
                    cc.sys.localStorage.setItem('isLogOut', 'true');
                    cc.NGWlog("chay vao ham tu dong login");
                    Global.LoginView.isClickLogin = false;
                    NetworkManager.getInstance().isInGame = false
                    switch (GameManager.getInstance().typeLogin) {
                        case LOGIN_TYPE.FACEBOOK:
                            if (require('GameManager').getInstance().access_token == '') {
                                Global.LoginView.onClickLoginFacebook();
                            } else {
                                NetworkManager.getInstance().onLogin("1", require('GameManager').getInstance().access_token, false, false);
                            }
                            break;
                        case LOGIN_TYPE.NORMAL:
                            cc.log("Type auto login normal");
                            NetworkManager.getInstance().onLogin(
                                GameManager.getInstance().user_name,
                                GameManager.getInstance().user_pass,
                                GameManager.getInstance().typeLogin === LOGIN_TYPE.REG_ACC,
                                false
                            );
                            break;
                        case LOGIN_TYPE.PLAYNOW:
                            Global.LoginView.onClickPlayNow();
                            // NetworkManager.getInstance().onPlayNow(false);
                            break;
                    }
                }
                GameManager.getInstance().isReconnect = false;
                break;
            }
        case FIREBASE.ConnectionStatus.DISCONNECTED:
            {
                cc.NGWlog("disconnect :(");
                NetworkManager.getInstance().statusConnect = status;
                NetworkManager.getInstance().connected = false;
                GameManager.getInstance().isLoginOnGame = false;
                require("UIManager").instance.onLogout();
                // connector.close();
                require('UIManager').instance.onShowLoad();
                require('Util').checkNetwork();
                break;
            }
        case FIREBASE.ConnectionStatus.CONNECTING:
            {
                NetworkManager.getInstance().statusConnect = status;
                require('UIManager').instance.onShowLoad("Connecting");

                // require('Util').checkNetwork();
                break;
            }

        case FIREBASE.ConnectionStatus.FAIL:
            {
                cc.NGWlog("chay vao network fail");
                NetworkManager.getInstance().statusConnect = status;
                if (NetworkManager.getInstance().isInGame || GameManager.getInstance().isReconnect) {
                    NetworkManager.getInstance().connect_sv(cc.sys.localStorage.getItem("curServerIp" + NAME_GAME), '');
                } else {
                    require('UIManager').instance.onHideLoad();
                    GameManager.getInstance().onShowWarningDialog(GameManager.getInstance().getTextConfig('low_network'), DIALOG_TYPE.ONE_BTN, GameManager.getInstance().getTextConfig('txt_ok'), () => {
                        NetworkManager.getInstance().connect_sv(cc.sys.localStorage.getItem("curServerIp" + NAME_GAME), '');
                    });
                }
                break;
            }

        case FIREBASE.ConnectionStatus.RECONNECTING:
            {
                require('UIManager').instance.onShowLoad("Reconnecting");
                NetworkManager.getInstance().statusConnect = status;
                break;
            }

    }
};
var lobbyCallback = function (protocolObject) {
    cc.NGWlog("lobbyCallback call back:  " + paprotocolObjectcket.classId);
};

var NetworkManager = cc.Class({
    properties: {
        connected: {
            default: null
        },

        instance: {
            default: null
            // type: NetworkManager
        },
        listEvtGame: [],
        statusConnect: 0,
        isCheckLoginAllSeverIP: false,
        isPlayNow: false,
        isPing: false,
        isInGame: false,
    },

    statics: {
        getInstance() {
            if (this.instance == null) {
                this.instance = new NetworkManager();
                //this.instance.initFb();
                setInterval(() => {
                    if (!Global.LoginView.node.active)
                        this.instance.sendPing();
                }, 5000);
            }
            return this.instance;
        }
    },

    connect_sv(ip, port) {
        cc.NGWlog("ip connect server ====== " + ip);
        if (ip === null || ip === "") ip = "app-001.ngwcasino.com";
        // ip = "35.247.178.163"
        cc.sys.localStorage.setItem("curServerIp" + NAME_GAME, ip);

        cc.NGWlog("After: ip connect server ====== " + ip);
        //   require('Util').checkNetwork();
        if (connector != null) {
            connector.close();
            connector = null;
        }
        connector = new FIREBASE.Connector(packetCallback, lobbyCallback, loginCallback, statusCallback);
        if (port == null || port == '') port = '443';
        //port = '8080'
        if (window.WebSocket && window.WebSocket.prototype && window.WebSocket.prototype.send) {
            connector.connect("FIREBASE.WebSocketAdapter", ip, port, '', true);
            // connector.connect("FIREBASE.WebSocketAdapter", "app-002.ngwcasino.com", port, '', true);
        } else {
            connector.connect("FIREBASE.CometdAdapter", ip, '8080', "/cometd", false, function () { return $.cometd });
        }
        GameManager.getInstance().curServerIp = ip;
    },
    playGame() {
        if (this.listEvtGame.length > 0) {
            let message = this.listEvtGame.shift();
            HandleGamePacket.handleGameTransportPacket(message);
            this.playGame();
        }
    },
    initFb() {
        if (cc.sys.isBrowser) {
            window.fbAsyncInit = function () {
                FB.init({
                    // appId: '212213783065065',
                    // appId: "527796897988374", // si test 
                    appId: "832822687082452", //lengbear
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: "v4.0"
                });
            };

            (function (d, s, id) {
                cc.NGWlog("----------------------> initFb");
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, "script", "facebook-jssdk");
        }
    },
    checkStatusNetWork() {
        //     if(cc.director.getScene().name === "login");

        if (GameManager.getInstance().showPopConnect) {
            GameManager.getInstance().showPopConnect = false;
            GameManager.getInstance().onShowWarningDialog(GameManager.getInstance().getTextConfig('low_network'), DIALOG_TYPE.TWO_BTN, GameManager.getInstance().getTextConfig('txt_ok'), () => {
                GameManager.getInstance().onReconnect();
                require('UIManager').instance.onHideLoad();
                cc.NGWlog('tao click vao dong y connect lai');
                GameManager.getInstance().showPopConnect = true;
            }, GameManager.getInstance().getTextConfig('label_cancel'), () => {
                GameManager.getInstance().showPopConnect = true;
                if (GameManager.getInstance().gameView == null) return;
                GameManager.getInstance().isChooseGame = false;
                GameManager.getInstance().isReconnect = false;
                require('UIManager').instance.onLogout();
                cc.NGWlog('tao click vao khong dong y connect lai');
                require('UIManager').instance.onHideLoad();
            });
        }
    },

    onLogin(user, pass, isReg, isConnect = true) {

        GameManager.getInstance().onShowHideWaiting(true);
        cc.NGWlog(
            "-=-=-=-=-=-=-=-=-=-=-=-=-=-=->     " + GameManager.getInstance().deviceId
        );
        cc.NGWlog(('user la=== ' + user + 'pass la == ' + pass))
        GameManager.getInstance().user_name = user;
        GameManager.getInstance().user_pass = pass;
        //set text
        var langLocal = cc.sys.localStorage.getItem("language_client");
        var strLanguae = "en";

        for (let i = 0; i < require('ConfigManager').getInstance().listTextConfig.length; i++) {
            let item = require('ConfigManager').getInstance().listTextConfig[i];

            if (item.language === langLocal && langLocal === LANGUAGE_TEXT_CONFIG.LANG_EN)
                strLanguae = "en"
            else if (item.language === langLocal && langLocal === LANGUAGE_TEXT_CONFIG.LANG_CAM)
                strLanguae = "cam"
        }
        //set text
        if (cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_OSX) {
            GameManager.getInstance().deviceId = '4BADD3ED-790D-45BA-BD21-2971EE4F7422';
        }
        cc.log("Network cur game Id==" + GameManager.getInstance().curGameId);
        var user = {
            Userid: 1,
            From: "mbacay",
            gameid: GameManager.getInstance().curGameId,
            deviceId: GameManager.getInstance().deviceId,
            Signid: "qazwsxedcrfv123$%^789",
            loginCount: 0,
            versionCode: GameManager.getInstance().versionGame,
            language: strLanguae,
            Username: user,
            Usertype: 1
        };
        if (isReg) {
            user.Reg = 1;
        }

        if (GameManager.getInstance().typeLogin === LOGIN_TYPE.FACEBOOK) {
            user.Username = 1;
            user.Usertype = 2;
        } else if (GameManager.getInstance().typeLogin === LOGIN_TYPE.FACEBOOK_INSTANT) {
            user.Username = 1;
            user.Usertype = 3;
        }
        var jsonValue = JSON.stringify(user);

        cc.NGWlog(jsonValue);
        var loginRequest = new FB_PROTOCOL.LoginRequestPacket();
        loginRequest.user = jsonValue;
        loginRequest.password = pass;
        loginRequest.operatorid = OPERATOR; //operatorid === undefined ? 1 : operatorid;
        loginRequest.credentials = [];
        cc.NGWlog(loginRequest);
        connector.sendProtocolObject(loginRequest);

        require('SMLSocketIO').getInstance().emitSIOWithValue(user, "LoginPacket", true);
    },
    onPlayNow(isConnect = true) {
        // cc.sys.localStorage.removeItem("USER_PLAYNOW");   
        require('GameManager').getInstance().typeLogin = LOGIN_TYPE.PLAYNOW;
        //  cc.sys.localStorage.clear();//hien cmt
        let accPlayNow = cc.sys.localStorage.getItem("USER_PLAYNOW");
        let passPlayNow = cc.sys.localStorage.getItem("PASS_PLAYNOW");
        let isReg = false;
        cc.NGWlog("------------PlayNow");
        cc.NGWlog(accPlayNow);
        if (accPlayNow == null) {
            isReg = true;
            let timeSta = new Date().getTime();

            let textRandom = "";
            let possible =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 10; i++)
                textRandom += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );
            cc.sys.localStorage.setItem("isReg", true);
            accPlayNow = "Te." + timeSta + "_" + require("GameManager").getInstance().deviceId;
            if (accPlayNow.length > 40) accPlayNow = accPlayNow.substring(0, 40);
            passPlayNow = "Te" + timeSta + textRandom;
            cc.NGWlog("----Chua co thi tao!!!   " + accPlayNow);
            // cc.sys.localStorage.setItem("USER_PLAYNOW", accPlayNow);
            // cc.sys.localStorage.setItem("PASS_PLAYNOW", passPlayNow);

        }

        this.isPlayNow = !isReg;
        GameManager.getInstance().user_name = accPlayNow;
        GameManager.getInstance().user_pass = passPlayNow;
        //cc.NGWlog('login bang tk la==== ' + )
        this.onLogin(accPlayNow, passPlayNow, isReg, isConnect);
    },

    onLogout() {
        cc.NGWlog('chay vao ham out ra luon')
        var data = {
            evt: "logout"
        };
        this.sendService(JSON.stringify(data));
        connector.logout();
        connector.close();
    },


    sendLocalService(data) {
        cc.NGWlog("======> Send Service:" + data);
        var localServiceTransport = new FB_PROTOCOL.LocalServiceTransportPacket();
        localServiceTransport.servicedata = utf8.toByteArray(data);
        localServiceTransport.seq = 1;
        connector.sendProtocolObject(localServiceTransport);


        let objData = {};
        if (data.hasOwnProperty('evt')) {
            objData.evt = data.evt;
        }

        objData.data = JSON.stringify(data);

        require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "LocalServiceTransportPacket", true);
    },
    sendPing() {
        let data = {
            evt: "pingjs"
        };
        this.sendService(JSON.stringify(data));

        let serviceTransport = new FB_PROTOCOL.PingPacket();
        connector.sendProtocolObject(serviceTransport);
    },

    sendService(data) {
        if (NetworkManager.getInstance().statusConnect != FIREBASE.ConnectionStatus.CONNECTED) return;

        cc.NGWlog("======> Send Service:" + data);
        var serviceTransport = new FB_PROTOCOL.ServiceTransportPacket();
        serviceTransport.service = "com.athena.services.api.ServiceContract";
        serviceTransport.servicedata = utf8.toByteArray(data);
        serviceTransport.pid = GameManager.getInstance().user.userId;
        serviceTransport.seq = 1;
        serviceTransport.idtype = 1;
        connector.sendProtocolObject(serviceTransport);

        let objData = {};
        let dataParse = JSON.parse(data);
        if (dataParse.hasOwnProperty('evt')) {
            objData.evt = dataParse.evt;
        }
        else if (dataParse.hasOwnProperty('idevt')) {
            objData.idevt = dataParse.idevt;
        }
        // objData.data = JSON.stringify(data);
        objData.data = data;
        require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "ServiceTransportPacket", true);
    },

    sendDataGame(data) {
        var packet = new FB_PROTOCOL.GameTransportPacket();
        packet.pid = GameManager.getInstance().user.userId;
        packet.tableid = GameManager.getInstance().tableId;
        packet.gamedata = utf8.toByteArray(data);
        packet.test = 0;
        connector.sendProtocolObject(packet);
        cc.NGWlog("======> Send Data Game:" + data);

        let objData = {};
        if (data.hasOwnProperty('evt')) {
            objData.evt = data.evt;
        }

        objData.data = JSON.stringify(data);

        require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "GameTransportPacket", true);
    },
    sendSelectGame(gameId) {
        let severIp = "";

        for (let i = 0; i < require('ConfigManager').getInstance().listGameIp.length; i++) {
            if (gameId === require('ConfigManager').getInstance().listGameIp[i].gameid) {
                severIp = require('ConfigManager').getInstance().listGameIp[i].domain;
                break;
            }
        }

        cc.NGWlog('send select game ' + gameId + ' server ip ' + severIp);

        if (severIp !== require('GameManager').getInstance().curServerIp) {
            require('GameManager').getInstance().isLogOut = false;
            this.isInGame = true;
            require('GameManager').getInstance().isChooseGame = true;
            this.onLogout();
            this.connect_sv(severIp, "443");
        } else {
            this.sendSelectG2(gameId);
            cc.NGWlog("gameid_network", gameId);
            if (GAME_INFO[gameId].isPlayNow || require('GameManager').getInstance().user.vip < 1) {
                require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayNow_%d", gameId));
                this.sendPlayNow(gameId);
            } else {
                if (require("GameManager").getInstance().isPlayNowBanner) {
                    this.sendPlayNow(gameId);
                    require("GameManager").getInstance().isPlayNowBanner = false;
                }
            }
        }

        cc.sys.localStorage.setItem("curGameId", gameId);

        require('GameManager').getInstance().curServerIp = severIp;
        require('GameManager').getInstance().curGameId = gameId;
    },

    sendSelectG2(gameId) {
        var data = {
            evt: "selectG2",
            gameid: gameId
        };
        this.sendService(JSON.stringify(data));
    },

    senChangePass(oldPass, NewPass) {
        var data = {
            evt: "changepass",
            OP: oldPass,
            NP: NewPass
        };
        this.sendService(JSON.stringify(data));
    },
    getPromotionInfo() {
        var data = {
            evt: "promotion_info"
        };
        this.sendService(JSON.stringify(data));
    },

    sendRomVip() {
        var data = {
            evt: "roomVip"
        }
        this.sendService(JSON.stringify(data));
    },
    sendCheckPass(tableID) {
        var data = {
            evt: "checkPass",
            tableId: parseInt(tableID)
        };
        this.sendService(JSON.stringify(data));
    },
    sendTopRichRequest() {
        var data = {
            evt: "toprich"
        };
        this.sendService(JSON.stringify(data));
    },

    sendTopVipRequest() {
        var data = {
            idevt: "400"
        };
        cc.NGWlog('topvipdata ===========================================================================================================================================================================================================================================================================================================================')
        this.sendService(JSON.stringify(data));
    },

    sendListFollowRequest() {
        var data = {
            evt: "followlist"
        };
        this.sendService(JSON.stringify(data));
    },

    sendFollow(name, idFr) {
        var data = {
            evt: "follow",
            N: name,
            Id: idFr
        };
        this.sendService(JSON.stringify(data));
    },

    sendFollowByName(name) {
        var data = {
            evt: "followbyname",
            N: name
        };
        this.sendService(JSON.stringify(data));
    },

    sendUnfollow(idFr) {
        var data = {
            evt: "unfollow",
            Id: idFr
        };
        this.sendService(JSON.stringify(data));

        for (var i = 0; i < Global.FriendPopView._listFriends.length; i++) {
            var str_id = idFr + "";
            var str_id_data = Global.FriendPopView._listFriends[i].idFriend + "";
            if (str_id.indexOf(str_id_data) != -1 || str_id_data.indexOf(str_id) != -1) {
                cc.NGWlog('Xoa di 1 thang!');
                Global.FriendPopView._listFriends.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < Global.TopRichView.arrFollow.length; i++) {
            if (idFr == Global.TopRichView.arrFollow[i].id) {
                Global.TopRichView.arrFollow.splice(i, 1);
                break;
            }
        }

        Global.TopRichView.updateList();
    },

    onGetHistorySafe() {
        var data = {
            idevt: 500
        };
        this.sendService(JSON.stringify(data));
    },
    sendUAG() {
        var data = {
            evt: "uag"
        };
        this.sendService(JSON.stringify(data));
    },


    sendStartGame() {
        var data = {
            evt: "sgame"
        };

        this.sendDataGame(JSON.stringify(data));
    },

    sendReadyGame() {
        var data = {
            evt: "rtable"
        };

        this.sendDataGame(JSON.stringify(data));
    },

    sendPlayNow(gameID) {
        cc.NGWlog('chay voa ham send playnow==== ' + gameID);
        var data = {
            evt: "searchT",
            gameid: gameID
        };

        this.sendService(JSON.stringify(data));
    },

    sendCreateTable(bet) {
        var data = {
            idevt: 1,
            M: bet
        };

        this.sendService(JSON.stringify(data));
    },
    sendCreateTableWithPass(bet, name, Pass) {
        var data = {
            idevt: 1,
            M: bet,
            N: name,
            P: Pass
        };

        this.sendService(JSON.stringify(data));
    },


    sendChangeTable(mark, tableid) {
        var data = {
            idevt: 2,
            M: mark,
            idtable: tableid
        };
        this.sendService(JSON.stringify(data));
    },

    sendJoinTable(tableid) {
        var packet = new FB_PROTOCOL.JoinRequestPacket();
        packet.tableid = tableid;
        packet.seat = -1;
        connector.sendProtocolObject(packet);

        let jsonData = {
        };
        jsonData.tableid = tableid;
        require('SMLSocketIO').getInstance().emitSIOWithValue(jsonData, "JoinPacket", true);
    },
    sendJoinTableWithPass(tableid, pass) {
        var packet = new FB_PROTOCOL.JoinRequestPacket();

        cc.NGWlog("-------------------------------->0    ", packet);
        packet.tableid = tableid;
        packet.seat = -1;
        let param = new FB_PROTOCOL.Param();
        param.key = "Pass";
        param.type = FB_PROTOCOL.ParameterTypeEnum.STRING;
        // param.value = utf8.toByteArray(pass);

        var byteArray = new FIREBASE.ByteArray();
        byteArray.writeString(pass)
        param.value = byteArray.getBuffer();
        //  let psss = [];
        //psss.push(param);
        // let param = {
        //   key : "Pass",
        //   type:0,
        //   value: utf8.toByteArray(pass)
        // }
        let pp = [];
        pp.push(param);
        packet.params = pp; //.push(param);

        cc.NGWlog("-------------------------------->1    ", packet);
        cc.NGWlog("-------------------------------->2    ", param);
        connector.sendProtocolObject(packet);

        let jsonData = {
        };
        jsonData.tableid = tableid;
        jsonData.pass = true;
        require('SMLSocketIO').getInstance().emitSIOWithValue(jsonData, "JoinPacket", true);
    },

    sendUpVip() {
        var data = {
            evt: "uvip",
            vip: 1
        };
        this.sendService(JSON.stringify(data));
    },

    sendExitGame() {
        var data = {
            evt: "autoExit"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendChangeAvatar(idAva) {
        var data = {
            evt: "changea",
            A: idAva
        };
        this.sendService(JSON.stringify(data));
    },

    sendUpdateJackPot(gameId) {
        var data = {
            evt: "updatejackpot",
            gameId: gameId
        };
        this.sendService(JSON.stringify(data));
    },
    sendJackPotHistory() {
        var data = {
            evt: "jackpothistory",
            gameId: GameManager.getInstance().curGameId
        }
        this.sendService(JSON.stringify(data));
    },
    getMail(type) {
        var data = {
            evt: 15,
            T: type,
            P: 0
        };
        this.sendService(JSON.stringify(data));
    },

    getMessList() {
        var data = {
            evt: "messagelist"
        };
        this.sendService(JSON.stringify(data));
    },

    sendDeleteMailAdmin(id) {
        var arr = [id];
        var data = {
            evt: 15,
            T: 3,
            Arr: arr
        };
        this.sendService(JSON.stringify(data));
    },
    sendSpinSlot(singleLineBet, isFreeSpin) {
        var data = {
            evt: "spin",
            singleLineBet: singleLineBet,
            isFreeSpin: isFreeSpin,
        };
        cc.NGWlog("slotv111111111", singleLineBet);
        cc.NGWlog("slotv22222222", isFreeSpin);
        this.sendDataGame(JSON.stringify(data));
    },
    sendBetBaccarat(ag, typebet) {
        var data = {
            evt: "bet",
            betAG: ag,
            side: typebet
        };
        this.sendDataGame(JSON.stringify(data));
    },
    sendDeleteMailPlayer(id) {
        var data = {
            evt: "messagedeleteall",
            Id: id
        };
        this.sendService(JSON.stringify(data));
    },

    sendFeedback(content) {
        var data = {
            evt: 15,
            T: 7,
            NN: "Admin",
            D: content
        };
        this.sendService(JSON.stringify(data));
    },

    sendMessageToFriend(idFr, name, content) {
        var data = {
            evt: "message",
            Id: idFr,
            AG: 0,
            I: 0,
            N: name,
            Msg: content
        };
        this.sendService(JSON.stringify(data));
    },

    sendReadMessage(idFr) {
        var data = {
            evt: "messagedetail",
            Id: idFr
        };
        this.sendService(JSON.stringify(data));
    },
    sendDTHistory(id) {
        var data = {
            evt: "cashOutHistory",
            userid: id
        };
        this.sendService(JSON.stringify(data));
    },
    sendCashOut(userId, value, wingId) {
        var data = {
            evt: "getgift",
            Id: userId,
            CashValue: value,
            WingId: wingId
        };
        this.sendService(JSON.stringify(data));
    },
    sendRejectCashout(status, id) {
        var data = {
            evt: "rejectCashout",
            status: status,
            id: id
        };
        this.sendService(JSON.stringify(data));
    },
    sendReadMail(idMess) {

        var data = {
            evt: 15,
            T: 1,
            ID: idMess
        };
        this.sendService(JSON.stringify(data));
    },

    getArrGold(arr) {
        var data = {
            evt: 15,
            T: 2,
            Arr: arr
        };
        this.sendService(JSON.stringify(data));
    },

    sendSearchFriendRequest(idFr) {
        require("UIManager").instance.onShowLoad();
        var data = {
            evt: "followfind",
            id: idFr
        };
        this.sendService(JSON.stringify(data));
    },

    sendBocBai() {
        // rapidjson:: Document document;
        // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
        // rapidjson:: Value data(rapidjson:: kObjectType);
        // data.AddMember("evt", "bc", allocator);
        // SocketSend:: sendDataGame(data);

        var data = {
            evt: "bc"
        };

        this.sendDataGame(JSON.stringify(data));
    },

    sendAnBai_TaLa(card) {
        // rapidjson:: Document document;
        // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
        // rapidjson:: Value data(rapidjson:: kObjectType);
        // data.AddMember("evt", "ac", allocator);
        // data.AddMember("C", card, allocator);
        // SocketSend:: sendDataGame(data);

        var data = {
            evt: "ac",
            C: card
        };

        this.sendDataGame(JSON.stringify(data));
    },

    ////////////////////////////////////////////// LOTO VIEW //////////////////////////////////////////
    sendTopLoto(){
        var data = {
            evt: "lottery_topgame",
        };

        this.sendService(JSON.stringify(data));
    },
    getMyNumber(type){
        var data = {
            evt: "lottery_lotos",
            type: type,
        };
        this.sendService(JSON.stringify(data));
    },
    sendBetLoto(type, number, ag){
        var data = {
            evt: "lottery_create",
            type: type,
            num:  number,
            M: ag
        };

        this.sendService(JSON.stringify(data));
    },
    sendDeleteBet(id,type){
        var data = {
            evt: "lottery_cancel",
            id: id,
            type:  type,
        };

        this.sendService(JSON.stringify(data));
    },

    getResultLoto(){
        var data = {
            evt: "lottery_results",
        };

        this.sendService(JSON.stringify(data));
    },

    getHistoryLoto(){
        var data = {
            evt: "lottery_history",
        };

        this.sendService(JSON.stringify(data));
    },

    ///////////////////////////////////////////// END LOTO  //////////////////////////////////////////

    //////////////////////////////////////////////// RUMMY ////////////////////////////////////////////////
    sendDanhBai_Rummy(cards) {
        //         rapidjson:: Document document;
        // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
        // rapidjson:: Value data(rapidjson:: kObjectType);
        // data.AddMember("evt", "dc", allocator);
        // rapidjson:: Value Arr(rapidjson:: kArrayType);
        // for (int j = 0; j < cards.size(); j++) {
        //     Arr.PushBack(cards.at(j), allocator);
        // }
        // data.AddMember("C", Arr, allocator);
        var data = {
            evt: "dc",
            C: cards
        };

        this.sendDataGame(JSON.stringify(data));
    },

    sendFinish_Rummy(idCard) {
        // rapidjson:: Document document;
        // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
        // rapidjson:: Value data(rapidjson:: kObjectType);
        // data.AddMember("evt", "nd", allocator);
        // data.AddMember("C", idCard, allocator);
        // SocketSend:: sendDataGame(data);
        var data = {
            evt: "nd",
            C: idCard
        };

        this.sendDataGame(JSON.stringify(data));
    },

    sendDeclare_Rummy(cards) {
        // rapidjson:: Document document;
        // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
        // rapidjson:: Value data(rapidjson:: kObjectType);
        // rapidjson:: Value Arr(rapidjson:: kArrayType);
        // data.AddMember("evt", "declare", allocator);
        // for (int i = 0; i < cards.size(); i++) {
        //     rapidjson:: Value ArrChild(rapidjson:: kArrayType);
        //     for (int j = 0; j < cards.at(i).size(); j++) {
        //         ArrChild.PushBack(cards.at(i).at(j), allocator);
        //     }
        //     Arr.PushBack(ArrChild, allocator);
        // }
        // data.AddMember("Arr", Arr, allocator);
        // SocketSend:: sendDataGame(data);
        var data = {
            evt: "declare",
            Arr: cards
        };

        this.sendDataGame(JSON.stringify(data));
    },

    sendCancelDeclare_Rummy() {
        // rapidjson:: Document document;
        // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
        // rapidjson:: Value data(rapidjson:: kObjectType);
        // data.AddMember("evt", "cfd", allocator);
        // data.AddMember("confirm", false, allocator);
        // SocketSend:: sendDataGame(data);
        var data = {
            evt: "cfd",
            confirm: false
        };

        this.sendDataGame(JSON.stringify(data));
    },
    //////////////////////////////////////////////// RUMMY ////////////////////////////////////////////////

    sendFold() {
        // rapidjson:: Document document;
        // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
        0;
        // rapidjson:: Value data(rapidjson:: kObjectType);
        // data.AddMember("evt", "bd", allocator);
        // SocketSend:: sendDataGame(data);
        var data = {
            evt: "bd"
        };

        this.sendDataGame(JSON.stringify(data));
    },

    //////////////////////////////////////////////// BAUCUA ////////////////////////////////////////////////
    sendBet(money, gate) {
        var data = {
            evt: "bet",
            M: money, //string
            N: gate //string
        };

        this.sendDataGame(JSON.stringify(data));
    },

    sendBetXocDia(money, gate) {
        var data = {
            evt: "bet",
            M: money, //string
            N: gate //string
        };

        this.sendDataGame(JSON.stringify(data));
    },
    /////////////////////// INGAME /////////////////////////
    sendTip(chip) {
        var data = {
            evt: "tip"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendRaise(chip) {
        var data = {
            evt: "bm",
            M: chip
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendReiveCard(type) {
        var data = {
            evt: "ac",
            A: type
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendChatEmo(nameSe, nameRe, type) {
        var _type = "*f" + type;
        var data = {
            evt: "chattable",
            Name: nameSe,
            NName: nameRe,
            Data: "",
            T: _type
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendChat(username, text) {
        var data = {
            evt: "chattable",
            Name: username,
            NName: "",
            Data: text,
            T: ""
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendBecomeDealer() {
        var data = {
            evt: "dealer"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendCancelDealer() {
        var data = {
            evt: "canceldealer"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    getHistoryBauCua() {
        var data = {
            evt: "history"
        };
        this.sendDataGame(JSON.stringify(data));
    },
    /////////////////////// ... ///////////////////////////////

    //==================BINH================//
    sendBinhSoBai(cards, isExit) {
        var data = {
            evt: "fsc",
            Arr: cards,
            Auto: isExit
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendBinhXepLai() {
        var data = {
            evt: "ufsc"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendBinhReady() {
        var data = {
            evt: "rtable"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendBinhStart() {
        var data = {
            evt: "sgame"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendBinhDeclare(cards, isExit) {
        var data = {
            evt: "declare",
            Arr: cards,
            Auto: isExit
        };
        this.sendDataGame(JSON.stringify(data));
    },
    //================== END BINH================//
    //==================== Roulette ============//
    sendBetRoulette(listBet) {
        var data = {
            evt: 'make_bet',
            data: JSON.stringify(listBet),
        }
        cc.NGWlog(data);
        this.sendDataGame(JSON.stringify(data));
    },
    sendSpinRoulette() {
        var data = {
            evt: "spin"
        }
        this.sendDataGame(JSON.stringify(data));
    },


    //==================SIKU================//
    sendAnCardSiku(code) {
        var data = {
            evt: "ac",
            C: code
        };
        this.sendDataGame(JSON.stringify(data));
    },
    sendDanhCardSiku(code) {
        var data = {
            evt: "dc",
            C: code
        };
        this.sendDataGame(JSON.stringify(data));
    },
    sendBocCardSiku() {
        var data = {
            evt: "bc"
        };
        this.sendDataGame(JSON.stringify(data));
    },
    sendLeaveNow() {
        var data = {
            evt: "leavenow"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    //================== END SIKU================//
    //================Shan-Koe-Mee==============//
    sendMakeBetShan2(_chipbet) {
        cc.NGWlog("Vua dat cuoc =" + _chipbet);
        var data = {
            evt: "bm",
            M: _chipbet
        };
        this.sendDataGame(JSON.stringify(data));
    },
    sendBocCard(isboc) {
        var data = {
            evt: "ac",
            A: isboc
        };
        this.sendDataGame(JSON.stringify(data));
    },
    sendBanherOpt(opt) {
        var data = {
            evt: "cdco",
            opt: opt
        };
        this.sendDataGame(JSON.stringify(data));
    },
    //===============END=Shan-Koe-Mee=END=============//
    //===============BooGyi=========================//
    sendSortCardBoogyi(arr_3) {
        var data = {
            evt: "sort",
            arr: arr_3
        };
        this.sendDataGame(JSON.stringify(data));
    },
    sendMakeBetBoogyi(amount) {
        var data = {
            evt: "make_bet",
            amount: amount
        };
        this.sendDataGame(JSON.stringify(data));
    },

    //==================END Boogyi======================//
    //=================== Start Bljack ======================//
    sendBlackjackBet(monney) {
        var data = {
            evt: 'bet',
            amount: monney
        }
        this.sendDataGame(JSON.stringify(data));
    },
    sendBlackjackInsure() {
        var data = {
            evt: 'insure'
        }
        this.sendDataGame(JSON.stringify(data));
    },
    sendBlackjackActionPlay(action) {
        let actionName = ''
        switch (action) {
            case 'double':
                actionName = 'double';
                break;
            case 'split':
                actionName = 'split';
                break;
            case 'hit':
                actionName = 'hit';
                break;
            case 'stand':
                actionName = 'stand';
                break;
        }

        var data = {
            evt: actionName
        };
        this.sendDataGame(JSON.stringify(data));

    },

    //=================== End Bljack ======================//
    //================== TIEN LEN ====================//

    sendBoLuotTienLen() {
        var data = {
            evt: "cc"
        };
        this.sendDataGame(JSON.stringify(data));
    },

    sendDanhBaiTienLen(arrCards) {
        var data = {
            evt: "dc",
            arr: arrCards
        };
        this.sendDataGame(JSON.stringify(data));
    },

    //================== END TIEN LEN ================//

    //===================Show===========================//
    sendMakeBetShow(_data, amount = 0) {
        var data;
        cc.NGWlog("Chay va ham sendData Make Bet Show");
        switch (_data) {
            case "pCall":
                data = {
                    evt: "pCall"
                };
                break;
            case "pCheck":
                data = {
                    evt: "pCheck"
                };
                break;
            case "pFold":
                data = {
                    evt: "pFold"
                };
                break;
            case "pRaise":
                data = {
                    evt: "pRaise",
                    chip: amount
                };
                break;
            case "pAllin":
                data = {
                    evt: "pAllin"
                };
                break;
            default:
                cc.NGWlog("Ban da gui sai Data");
                break;
        }

        this.sendDataGame(JSON.stringify(data));
    },

    sendChangeCard(_data) {
        var data = {
            evt: "cs",
            isChange: _data
        };
        this.sendDataGame(JSON.stringify(data));
    },

    //===================EndShow===========================//

    getChatWorld() {
        cc.NGWlog('Get chat world ne!');
        var data = {
            evt: "getChatWorld"
        };
        this.sendService(JSON.stringify(data));
    },

    getChatWorldVip() {
        var data = {
            evt: "chatVIP",
            act: "get"
        };
        this.sendService(JSON.stringify(data));
    },

    sendVeryfyPhone(sdt, nhaMang = "") {
        var data = {
            evt: "mobile",
            N: sdt,
            T: nhaMang
        };
        this.sendService(JSON.stringify(data));
    },
    sendChatWorld(content) {
        // var user = GameManager.getInstance().user.uname + "#";
        var user = GameManager.getInstance().user.displayName + "#";
        if (GameManager.getInstance().user.vip < 10) {
            user += "0" + GameManager.getInstance().user.vip;
        } else {
            user += GameManager.getInstance().user.vip;
        }

        var data = {
            evt: 16,
            T: 1,
            N: user,
            D: content
        };
        this.sendService(JSON.stringify(data));
    },

    sendChatWorldVip(content) {
        var data = {
            evt: "chatVIP",
            act: "chat",
            D: content
        };
        this.sendService(JSON.stringify(data));
    },
    sendGiftCode(giftcode) {
        var data = {
            evt: "GiftCode",
            C: giftcode
        };
        this.sendService(JSON.stringify(data));
    },
    getInfoSafe() {
        var data = {
            idevt: 300
        };
        this.sendService(JSON.stringify(data));
    },
    getStatus() {
        // if (!this.isPing) {
        //     count++;
        //     if (count > 1) {
        //         this.checkStatusNetWork();
        //         count = 0;
        //     }
        // } else {
        //     this.isPing = false;
        //     count = 0;
        // }
        var data = {
            idevt: 200
        };
        this.sendService(JSON.stringify(data));
    },

    sendGiftToID(id, toName, money) {
        var data = {
            idevt: 800,
            toid: id,
            toname: toName,
            chip: parseInt(money)
        };
        this.sendService(JSON.stringify(data));
    },

    sendChangeName(strname) {
        var data = {
            evt: "RUF",
            U: strname
        };
        this.sendService(JSON.stringify(data));
    },

    sendChangeStatus(strStatus) {
        var data = {
            idevt: "201",
            status: strStatus
        };
        this.sendService(JSON.stringify(data));
    },
    sendRegister(name, pass, _oldpass) {
        //đăng ký trong game cho user chơi ngay
        var data = {
            idevt: "202",
            name: name,
            pass: pass,
            oldpass: _oldpass
        };
        this.sendService(JSON.stringify(data));
    },

    getInviteTableList(chip) {
        var data = {
            evt: "ivp",
            T: 0,
            AG: chip
        };
        this.sendService(JSON.stringify(data));
    },

    sendInviteTable(id_fr, chip) {
        var data = {
            evt: "ivp",
            T: 1,
            OID: id_fr,
            AG: chip
        };
        this.sendService(JSON.stringify(data));
    },

    getTopGameNew(idGame, type) {
        var data = {
            evt: "topgamer_new",
            Gameid: idGame,
            Typeid: type
        };
        this.sendService(JSON.stringify(data));
    },

    sendPromotionDay() {
        var data = {
            evt: "dp",
            day: require("GameManager").getInstance().user.onlineDay
        };
        this.sendService(JSON.stringify(data));
    },

    sendPromotinOline() {
        var data = {
            evt: "promotion_online"
        };
        this.sendService(JSON.stringify(data));
    },

    sendPromotinGold(receiveType, chip) {
        var data = {
            evt: "promotion",
            T: receiveType,
            G: chip
        };
        this.sendService(JSON.stringify(data));
        require("GameManager").getInstance().is_click_receive_chip_onl = true;
    },

    sendPromotionInfo() {
        cc.NGWlog('send info===============================================================================================')
        var data = {
            evt: "promotion_info"
        };
        this.sendService(JSON.stringify(data));
    },
    sendIAPFacebookInstant(_signedData, _signature) {
        // rapidjson: Document docSend;
        // rapidjson:: Document:: AllocatorType & al = docSend.GetAllocator();
        // rapidjson:: Value obj(rapidjson:: kObjectType);
        // obj.AddMember("evt", "iap", al);
        // obj.AddMember("signedData", StringRef(signdata.c_str()), al);
        // obj.AddMember("signature", StringRef(signature.c_str()), al);

        // sendService(obj);
        var data = {
            evt: "iap_fb",
            signedData: _signedData,
            signature: _signature
        };
        this.sendService(JSON.stringify(data));
    },
    sendIAPResult(_signdata, _signature) {
        cc.NGWlog("iaploggggsendIAPResult:=====" + _signdata + _signature);
        var data = {
            evt: "iap",
            signedData: _signdata,
            signature: _signature
        }

        this.sendService(JSON.stringify(data));

        var key_iap = require("GameManager").getInstance().user.id.toString() + "_iap_count";
        var countIAP = cc.sys.localStorage.getItem(key_iap);
        if (countIAP === null || typeof (countIAP) === "undefined") {
            countIAP = 0;
        }
        var key_signdata = require("GameManager").getInstance().user.id.toString() + "_signdata_" + countIAP;
        var key_signature = require("GameManager").getInstance().user.id.toString() + "_signature_" + countIAP;
        cc.sys.localStorage.setItem(key_signdata, _signdata);
        cc.sys.localStorage.setItem(key_signature, _signature);
        countIAP++;
        cc.sys.localStorage.setItem(key_iap, countIAP);

    },
    validateIAPReceipt(_receipt) {
        cc.NGWlog("iaploggggvalidateIAPReceipt:=====" + _receipt);
        var data = {
            evt: "iap_ios",
            receipt_encoded64: _receipt,
            data: require("GameManager").getInstance().bundleID
        }

        this.sendService(JSON.stringify(data));

        var key_iap = require("GameManager").getInstance().user.id.toString() + "_iap_count";
        var countIAP = cc.sys.localStorage.getItem(key_iap);
        if (countIAP === null || typeof (countIAP) === "undefined") {
            countIAP = 0;
        }
        var key_receipt = require("GameManager").getInstance().user.id.toString() + "_receipt_" + countIAP;
        cc.sys.localStorage.setItem(key_receipt, _receipt);
        countIAP++;
        cc.sys.localStorage.setItem(key_iap, countIAP);

    },
    sendShareImageFb() {
        var data = {
            evt: "shareImageFb"
        }
        this.sendService(JSON.stringify(data));
    },

});