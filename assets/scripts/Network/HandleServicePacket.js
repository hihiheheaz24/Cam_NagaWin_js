const GameManager = require('GameManager')
const TopData = require('TopData')
const MailData = require('MailData')
const MessData = require('MessData')
const HistorySafeData = require('HistorySafeData')
const itemJackPotHistory = require('itemJackPotHistory')
var UIManager = require('UIManager')

var isFirstChatWorld, isFirstLobby, isFirstToprich, isFirstSafeView, isFirstFriend, isFirstMailView, isFirstTopGame;
isFirstChatWorld = true;
isFirstLobby = true;
isFirstToprich = true;
isFirstSafeView = true;
isFirstFriend = true;
isFirstMailView = true;
isFirstTopGame = true;


var HandleServicePacket = cc.Class({
    name: 'HandleServicePacket',
    ctor: function () {
    },
    properties: {

    },
    statics: {
        handleService: function (data) {
            // cc.NGWlog("========>HandleServicePacket: " + data);
            var jsonData = JSON.parse(data);

            let objData = {};
            if (jsonData.hasOwnProperty("evt")) {
                objData.evt = jsonData.evt;
            }
            if (jsonData.hasOwnProperty("idevt")) {
                objData.idevt = jsonData.idevt;
            }
            objData.data = JSON.stringify(jsonData);
            require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "ServiceTransportPacket", false);

            if (jsonData.hasOwnProperty("evt")) {
                var evt = jsonData.evt;
                switch (evt) {
                    case "promotion_info":
                        // "evt":"promotion_info","P":0,"A":0,"UV":0,"O":80,"V":0,"C":0,"T":0,"VC":0,"VM":3,"OC":0,"OM":6,"NV":3000,"NO":80,"NIV":10000,"InviteMark":500,"InviteNum":40,"OnlinePolicy":"{\"numberP\":6,\"timeWaiting\":[60,60,60,60,60,60],\"chipBonus\":[80,80,160,80,80,80]}"
                        cc.NGWlog("jsondata.p: " + jsonData.P);
                        //cc.NGWlog("GM.pro: ", GameManager.getInstance().promotionInfo);
                        GameManager.getInstance().setPromotionInfo(jsonData);
                        Global.MainView.lbTimeOnline.node.stopAllActions();
                        Global.MainView.setTimeGetMoney();
                        if (Global.ChipOnline.node.getParent() !== null) Global.ChipOnline.setInfo();
                        if (GameManager.getInstance().promotionInfo.onlineCurrent > GameManager.getInstance().promotionInfo.numberP - 1) {
                            Global.MainView.lbTimeOnline.node.getParent().getComponent(cc.Button).enabled = false;
                        }
                        Global.FreeChipView.loadFreeChip();
                        break;
                    case 'promotion_online':
                        GameManager.getInstance().promotionInfo.online = jsonData.G;
                        GameManager.getInstance().promotionInfo.agOnline = jsonData.NO;

                        Global.MainView.lbTimeOnline.string = require("GameManager").getInstance().formatNumber(require("GameManager").getInstance().promotionInfo.online);

                        if (Global.FreeChipView.node.getParent() !== null) Global.FreeChipView.loadFreeChip();
                        break;
                    case 'promotion':
                        GameManager.getInstance().handlePromotion(jsonData);
                        break;
                    case "dp":
                        var agDp = jsonData.AG;
                        require('GameManager').getInstance().user.promotionDay = 0;
                        //require('GameManager').getInstance().user.ag += agDp;
                        if (Global.MainView !== null) {
                            Global.MainView.updateChipAndSafe();
                            // Sử dụng hiệu ứng chung với chiponline
                            Global.MainView.MoneyBonusFly(agDp);
                            require('SMLSocketIO').getInstance().emitUpdateInfo();
                        }
                        break;
                    case "GiftCode":
                        //if (jsonData.Msg !== null)
                        var gold = jsonData.G;
                        if (gold > 0) {
                            GameManager.getInstance().user.ag += gold;
                        }
                        GameManager.getInstance().onShowConfirmDialog(jsonData.Msg);
                        break;
                    case "toprich":
                        var dat = JSON.parse(jsonData.data);
                        if (Global.TopRichView.node.parent)
                            Global.TopRichView.receviceData(dat);
                        break;
                    case "followlist":
                        if (jsonData.data !== "") {
                            var dat = JSON.parse(jsonData.data);
                            Global.FriendPopView.receviceData(dat);
                            Global.TopRichView.receviceDataFolowList(dat);
                        } else {
                            Global.FriendPopView._listFriends.length = [];
                        }
                        break;
                    case 'follow':
                        if (!jsonData.data) return;
                        Global.TopRichView.receviceDataFolow(jsonData);
                        require('GameManager').getInstance().onShowToast(require('GameManager').getInstance().getTextConfig('friend_add_success'));
                        break;
                    case SERVICE_CODE.ERR_JOIN_TABLE:
                        // { "Cmd": "You are in table.", "evt": "10", "Bonus": 0, "Ag": 0 }
                        if (jsonData.hasOwnProperty("data")) {
                            GameManager.getInstance().onShowConfirmDialog(jsonData.data);
                        }
                        else {
                            let text = jsonData.Cmd;
                            let curLang = cc.sys.localStorage.getItem("language_save_2");
                            if (curLang == null || curLang == 0) {
                                if (jsonData.Cmd === "ឈ្មោះរបស់អ្នកត្រូវបានមានគេប្រើក្នុងគណនីរួចហើយ,សូមសាកល្បងឈ្មោះមួយផ្សេងទៀត។ ")
                                    text = "Your name is already used in the account, please try another name.";
                            }
                            GameManager.getInstance().onShowConfirmDialog(text);
                        }
                        require('UIManager').instance.onHideLoad();
                        break;

                    case "changea":
                        var status = jsonData.error;
                        if (status == 0) {
                            if (Global.ProfileView.node.getParent() !== null)
                                Global.ProfileView.setAvatar();
                            Global.MainView.setAvatar();
                            GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('success_change_ava'), null, true, 2);
                        }
                        break;
                    case "20":
                    case SERVICE_CODE.MAIL_ADMIN:
                        if (!jsonData.data) break;
                        var jsData = JSON.parse(jsonData.data);
                        Global.MailView.handleDataMailAdmin(jsData);
                        break;
                    case SERVICE_CODE.MAIL_FREECHIP:
                        if (!jsonData.data) break;
                        cc.NGWlog('evt mail la==================================');
                        var jsData = JSON.parse(jsonData.data);
                        if (Global.FreeChipView.node.getParent() !== null && evt === "22") {
                            Global.FreeChipView.dataFreeChipAdmin = [];
                        }
                        for (let i = 0; i < jsData.length; i++) {
                            let _doc = jsData[i];
                            let item = new MailData();
                            if (_doc.DT)
                                item.moneyType = _doc.DT;
                            item.idMsg = _doc.Id;
                            item.t = _doc.T;
                            item.vip = _doc.Vip;
                            item.from = _doc.From;
                            item.to = _doc.To;
                            item.gold = _doc.AG;
                            item.i = _doc.I;
                            item.msg = _doc.Msg;
                            item.time = _doc.Time;
                            item.s = _doc.S ? 0 : 1;
                            item.d = _doc.D;
                            if (item.from.toLowerCase().localeCompare("admin") == 0) {
                                GameManager.getInstance().mail20.push(item);
                            };
                            GameManager.getInstance().user.nmAg = jsData.length;
                            if (Global.FreeChipView.node.getParent() !== null) {
                                Global.FreeChipView.pushMailAdmin(7, item.msg, item.gold, item.idMsg);
                            }
                        }
                        Global.FreeChipView.loadFreeChip();
                        break;

                    case "messagelist":
                        if (!jsonData.data) {
                            GameManager.getInstance().mail21 = [];
                            GameManager.getInstance().numberMail = 0;
                            Global.MailView.reloadListMailPlayer();
                            return;
                        }
                        var jsData = JSON.parse(jsonData.data);
                        Global.MailView.handleDataMailPlayer(jsData);
                        break;
                    case "followfind":
                        require("UIManager").instance.onHideLoad();
                        if (!jsonData.data) return;
                        var status = jsonData.status;
                        if (status == true) {
                            Global.FriendProfilePop.recivceData(jsonData);
                        } else {
                            GameManager.getInstance().onShowConfirmDialog(jsonData.data);
                        }


                        break;
                    case "messagedetail":
                        if (!jsonData.data) return;

                        if (require('MailViewMessage').instance !== null) {
                            var jsData = JSON.parse(jsonData.data);
                            var arrData = jsData.lsMessage;
                            require('MailViewMessage').instance.list_mess = [];

                            for (let i = 0; i < arrData.length; i++) {
                                var item = new MessData();

                                item.id = arrData[i].id;
                                item.nameSend = arrData[i].fromname;
                                item.nameReceive = arrData[i].toname;
                                item.status = arrData[i].statusmsg;
                                item.mess = arrData[i].msg;
                                item.time = arrData[i].timemsg;
                                item.from_id = arrData[i].fromid;
                                item.to_id = arrData[i].toid;
                                require('MailViewMessage').instance.list_mess.push(item);
                            }
                            require('MailViewMessage').instance.showConversation();
                        }
                        break;
                    case "message":
                        if (!jsonData.data) return;
                        Global.MainView._checkMailFirtsTime = false;
                        var jsData = JSON.parse(jsonData.data);
                        Global.MainView.redDotMail.active = (jsData.fromid === GameManager.getInstance().user.id) ? false : true;
                        if (require('MailViewMessage').instance !== null) {
                            var item = new MessData();
                            item.id = jsData.id;
                            item.nameSend = jsData.fromname;
                            item.nameReceive = jsData.toname;
                            item.status = jsData.statusmsg;
                            item.mess = jsData.msg;
                            item.time = jsData.timemsg;
                            item.from_id = jsData.fromid;
                            item.to_id = jsData.toid;
                            require('MailViewMessage').instance.checkMess(item);
                        }
                        else if (Global.MailView.node.getParent() == null) {
                            if (jsData.fromid === GameManager.getInstance().user.id) break;
                            if (require('GameManager').getInstance().gameView !== null) {
                                let str = jsData.fromname;
                                str.substring(0, 10) + '...';
                                require("UIManager").instance.showToast(require('GameManager').getInstance().getTextConfig('has_mail') + ' from ' + str);
                            } else {
                                if (require('GameManager').getInstance().is_show_confirm_dialog_mail == false) {
                                    require('GameManager').getInstance().is_show_confirm_dialog_mail = true;
                                    require('GameManager').getInstance().onShowWarningDialog(require('GameManager').getInstance().getTextConfig('has_mail'), DIALOG_TYPE.TWO_BTN, require('GameManager').getInstance().getTextConfig('ok'), () => {
                                        if (Global.MainView !== null) {
                                            Global.MainView.onClickMail();
                                        }

                                        require('GameManager').getInstance().is_show_confirm_dialog_mail = false;
                                    }, require('GameManager').getInstance().getTextConfig('label_cancel'), () => {
                                        require('GameManager').getInstance().is_show_confirm_dialog_mail = false;
                                    });
                                }
                            }
                        }
                        if (Global.MailView.node.getParent() != null) {
                            cc.log("chay vao reload mail")
                            if (Global.MailView.tab_select === 0)
                                require("NetworkManager").getInstance().getMessList();
                            else
                                require("NetworkManager").getInstance().getMail(11);
                        }
                        break;
                    case "ltv":
                        setTimeout(() => {
                            Global.MainView._isClickGame = false;
                        }, 1500)


                        cc.NGWlog("--------------------------------------------------------------->ltv");
                        if (!jsonData.data) return;
                        cc.NGWlog("--------------------------------------------------------------->onShowLobby 2");
                        Global.LobbyView.recivceData(jsonData);
                        break;
                    case "roomVip":
                        cc.NGWlog("---------------------------------------------> hanlde data roomVip");
                        if (!jsonData.data) return;
                        cc.NGWlog("--------------------------------------------------------------->onShowLobby");
                        Global.LobbyView.recivceDataRoomVip(jsonData);
                        break;

                    case "checkPass":
                        //{"evt":"checkPass","checked":true,"tid":2619}
                        //dar lkdfdf = jsonData.heekd;
                        var isChecked = jsonData.checked;
                        var idCheck = jsonData.tid;
                        if (isChecked) {
                            Global.LobbyView.onShowCheckPass();
                            GameManager.getInstance().checkPassId = idCheck;
                        }


                        break;

                    case "getChatWorld":
                        // get ListChat
                        Global.ChatWorldView.receiveData(jsonData)

                        break;
                    case SERVICE_CODE.CHATWORLDMESS:
                        //handleChat
                        Global.ChatWorldView.handleChat(jsonData)
                        break;


                    case 'ivp':
                        cc.NGWlog('----------------Vao day roi moi' + (GameManager.getInstance().invitePlayGame ? "True" : "False"));
                        if (require("GameManager").getInstance().gameView !== null) {
                            if (require('InvitePlayerInTable').instance !== null) {
                                if (!jsonData.data) return;
                                var data = JSON.parse(jsonData.data);
                                require('InvitePlayerInTable').instance.receiveData(data);
                            }
                        }
                        else if (GameManager.getInstance().invitePlayGame) {

                            cc.NGWlog('Cur view', require("GameManager").getInstance().currentView, 'LOBBY VIEW', CURRENT_VIEW.LOBBY);
                            if (require("GameManager").getInstance().currentView === CURRENT_VIEW.LOBBY/* || require("GameManager").getInstance().currentView === CURRENT_VIEW.LOGIN_VIEW*/) {
                                Global.LobbyView.showInvite(jsonData.N, jsonData.AG, jsonData.TID, jsonData.AGU);
                                cc.NGWlog('hien invite');
                            } else {
                                cc.NGWlog('an invite');
                            }
                        }
                        break;
                    case 'topgamer_new':
                        var list = jsonData.list;
                        if (typeof list !== 'undefined') {
                            if (list.length > 0 && !require("GameManager").getInstance().isGettingTopGameId) {
                                Global.TopGameView.updateList(list);
                                if (isFirstTopGame) {
                                    isFirstTopGame = false;
                                    let len = list.length;
                                    let timeEnd = list[len - 1].timeEnd;
                                    require("UIManager").instance.setTime(timeEnd);
                                }
                                // Global.TopGameView.getNextTopGame();
                            }
                            // if (require("GameManager").getInstance().isGettingTopGameId && list.length > 0) {
                            //     Global.TopListView.init(list);
                            //     Global.TopListView.setPlayer = false;
                            //     let len = list.length;
                            //     let timeEnd = list[len - 1].timeEnd;
                            //     require("UIManager").instance.setTime(timeEnd);
                            // }
                        }
                        break;

                            //////// Handle Loto //////////////
                    case "lottery_topgame":
                        if (!jsonData.data) return;
                        Global.LuckyNumberView.loadListTopLoto(jsonData.data);
                        break;
                    
                    case "lottery_lotos":
                        if (!jsonData.data) return;
                        Global.LuckyNumberView.loadListBet(jsonData.data);
                        break;

                    case "lottery_results":
                        if (!jsonData.data) return;
                        Global.LuckyNumberView.loadListResult(jsonData.data, jsonData.createdTime);
                        break;

                    case "lottery_history":
                        if (!jsonData.data) return;
                        Global.HistoryLoto.loadListHistory(jsonData.data);
                        break;

                    case "lottery_create":
                        if (!jsonData.data) return;
                        let xyz = JSON.parse(jsonData.data);
                        Global.LuckyNumberView.lb_ag.string = GameManager.getInstance().formatNumber(xyz.ag);
                        GameManager.getInstance().user.ag = xyz.ag;
                    break;
                    case "lottery_cancel":
                        if (!jsonData.data) return;
                        let abc = JSON.parse(jsonData.data);
                        Global.LuckyNumberView.lb_ag.string = GameManager.getInstance().formatNumber(abc.ag);
                        GameManager.getInstance().user.ag = abc.ag;
                    break;
                    /////// End Loto //////////

                    case 'salert':
                        if (GameManager.getInstance().list_alert.length < 20) {
                            if (!jsonData.data) return;
                            GameManager.getInstance().list_alert.push(jsonData.data);

                            if (!require('GameManager').getInstance().is_show_alert)
                                require('UIManager').instance.alertView.showAlert();
                        }
                        break;

                    case 'SAON':
                        // arr.includes
                        GameManager.getInstance().list_alert = [];
                        GameManager.getInstance().list_alert.push(jsonData.Cmd);
                        if (!require('UIManager').instance.alertView._strSAON.includes(jsonData.Cmd))
                            require('UIManager').instance.alertView._strSAON.push(jsonData.Cmd);
                        cc.log("length saon la== " + require('UIManager').instance.alertView._strSAON.length);
                        require('UIManager').instance.alertView.showAlert();
                        break;
                    case 'uag':
                        GameManager.getInstance().user.ag = jsonData.ag;
                        GameManager.getInstance().user.vip = jsonData.vip;
                        GameManager.getInstance().user.lq = jsonData.lq;
                        require('UIManager').instance.updateChipUser();
                        require('SMLSocketIO').getInstance().emitUpdateInfo();
                        // Tracking:: sendTrackBanner(3, _idBanner, paybanner);
                        break;
                    case 'uvip': {
                        GameManager.getInstance().userUpVip(jsonData);
                        break;
                    }
                    case 'changepass':
                        if (jsonData.error == 1) {
                            GameManager.getInstance().userChangePass();

                        } else {
                            GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('error_change_pass'));
                        }

                        break;
                    case 'RUF': {
                        if (jsonData.hasOwnProperty("U")) {
                            GameManager.getInstance().userChangename(jsonData);
                        }
                        break;
                    }
                    case 'iapResult': {
                        //{"evt":"iapResult","msg":"លេខកូដនេះត្រូវបានប្រើរួចហើយ។","verified":"false","goldPlus":0,"signature":"tKRMRLaaD3tDrrrGxwR58laVFW36bLvEyryT/kTK6ovSiG23y3SaO8q19kY25r1RuV2T2FAUFxx1EXqnQ5ofgMHFN4gxP8Nm70HbkP7s/ni2jMNRfujzH2hVF51rpJdyrtpGLNDqChZsJaOcw+RTDIDl3eetzrQbeacmf3N3YlF2xSo7MBPSZ9EyRPBq/ru5QWFLGencGT6Szy1AlJcxlS2lraMBL/6LA+NXIaG0wwyVeZOiohI4ky/NuTkKKyilmCw7xpVQ5IC4SwKkVMBSRgxDuNAsoX9D5LUufZa2Qx+y5NMoYXabjftl"}
                        var chip = jsonData.goldPlus;
                        var msg = jsonData.msg;
                        var signature = jsonData.signature;

                        if (chip > 0) {
                            GameManager.getInstance().user.ag += chip;
                            Global.MainView.updateChipAndSafe();
                            if (Global.LobbyView !== null)
                                Global.LobbyView.updateChip();
                            require('NetworkManager').getInstance().sendUAG();
                        }
                        GameManager.getInstance().onShowConfirmDialog(msg);

                        var key_iap = require("GameManager").getInstance().user.id.toString() + "_iap_count";
                        var countIAP = cc.sys.localStorage.getItem(key_iap);
                        if (countIAP === null || typeof (countIAP) === "undefined") {
                            countIAP = 0;
                        }
                        for (var i = 0; i < countIAP; i++) {
                            var key_signdata = require("GameManager").getInstance().user.id.toString() + "_signdata_" + i;
                            var key_signature = require("GameManager").getInstance().user.id.toString() + "_signature_" + i;
                            var _signature = cc.sys.localStorage.getItem(key_signature);

                            if (_signature == signature) {
                                cc.sys.localStorage.removeItem(key_signdata);
                                cc.sys.localStorage.removeItem(key_signature);
                                countIAP--;
                                cc.sys.localStorage.setItem(key_iap, countIAP);
                                break;
                            }
                        }

                        break;
                    }
                    case 'iap_ios': {
                        var chip = jsonData.chip;
                        var msg = jsonData.msg;
                        var receipt = jsonData.receipt;

                        if (chip > 0) {
                            GameManager.getInstance().user.ag += chip;
                            Global.MainView.updateChipAndSafe();
                            if (Global.LobbyView !== null)
                                Global.LobbyView.updateChip();
                            require('NetworkManager').getInstance().sendUAG();
                        }
                        GameManager.getInstance().onShowConfirmDialog(msg);

                        var key_iap = require("GameManager").getInstance().user.id.toString() + "_iap_count";
                        var countIAP = cc.sys.localStorage.getItem(key_iap);
                        if (countIAP === null || typeof (countIAP) === "undefined") {
                            countIAP = 0;
                        }
                        for (var i = 0; i < countIAP; i++) {
                            var key_receipt = require("GameManager").getInstance().user.id.toString() + "_receipt_" + i;
                            var _receipt = cc.sys.localStorage.getItem(key_receipt);

                            if (_receipt == receipt) {
                                cc.sys.localStorage.removeItem(key_receipt);
                                countIAP--;
                                cc.sys.localStorage.setItem(key_iap, countIAP);
                                break;
                            }
                        }
                        require('SMLSocketIO').getInstance().emitUpdateInfo();
                        break;
                    }
                    case 'jackpot':
                        if (GameManager.getInstance().gameView != null) {
                            GameManager.getInstance().handleJackPot(jsonData);
                        }
                        break;
                    case 'jackpotwin':
                        {
                            GameManager.getInstance().handleJackPotWin(jsonData);
                            break;
                        }
                    case 'updatejackpot':
                        GameManager.getInstance().handleUpdateJackPot(jsonData);
                        break;
                    case 'jackpothistory': {
                        GameManager.getInstance().handleJackPotHis(jsonData);
                        break;
                    }
                    case 'cashOutHistory': {
                        if (Global.CashOutView.node.getParent() !== null) {
                            Global.CashOutView.updateHistory(jsonData.data);
                        }
                        break;
                    }
                    case 'getgift': {
                        if (Global.CashOutView.node.getParent() !== null) {
                            Global.CashOutView.cashOutReturn(jsonData);
                        }
                        break;
                    }
                    case 'rejectCashout': {

                        if (jsonData.status == 0) Global.CashOutView.onClickHistory();

                        if (jsonData.msg != "")
                            GameManager.getInstance().onShowConfirmDialog(jsonData.msg);
                        break;
                    }
                    case 'autoExit': {
                        //require("GameManager").getInstance().onShowToast(jsonData.data);
                        require("GameManager").getInstance().gameView.handleAutoExit(jsonData);
                        break;
                    }
                    case 'shareImageFb':
                        GameManager.getInstance().onShowConfirmDialog(jsonData.Msg);
                        require('NetworkManager').getInstance().getMail(12);
                        break;
                    case 'payment_success':
                        GameManager.getInstance().userNapTienSuccess(jsonData);
                        break;

                }
            } else if (jsonData.hasOwnProperty("idevt")) {
                var idevt = jsonData.idevt;
                switch (idevt) {
                    case 300:
                        break;
                    case 301://send to safe
                        break;
                    case 302://get from safe
                        break;

                    case 303:
                        break;

                    case 304:
                        break;

                    case SERVICE_CODE.HISTORYSAFE://get his safe
                        cc.NGWlog("=======> history safe");
                        GameManager.getInstance().list_data_history_safe = [];
                        if (!jsonData.data) return;
                        var data = JSON.parse(jsonData.data);
                        for (var i = 0; i < data.length; i++) {
                            var item = new HistorySafeData();
                            item.timeday = data[i].timeday;
                            item.timehour = data[i].timehour;
                            item.content = data[i].msg;
                            item.chipchange = data[i].chipchange;
                            item.chip = data[i].chip;
                            GameManager.getInstance().list_data_history_safe.push(item);
                        }
                        cc.NGWlog('-hihihihi------->' + GameManager.getInstance().list_data_history_safe.length);
                        if (Global.GiftView.node.getParent() !== null) {
                            Global.GiftView.reloadHistory();
                        }
                        break;
                    case 400:
                        //{"idevt":400,"data":"[{\"id\":311827,\"name\":\"frocker\",\"avatar\":9,\"faceid\":2009684709344701,\"vip\":10,\"chip\":760000,\"status\":\"📌Chipsအား Viberမွသာ ေရာင္းခ်ေပးသည္📌Bill 1,000ks\\u003d6.5M, Wave/OK$ 1000ks\\u003d8.5M📌\",\"online\":false},{\"id\":380703,\"name\":\"koko_kyi\",\"avatar\":3,\"faceid\":0,\"vip\":10,\"chip\":0,\"status\":\"မာနမင္​းသား\",\"online\":true},{\"id\":98788,\"name\":\"piggy_lady\",\"avatar\":10,\"faceid\":567752770291410,\"vip\":10,\"chip\":1950000,\"status\":\"1000\\u003d7m wave 110m\\\"အေခ်းအဌားမလုပ္ပါ\\\" vip pointတက္သည္\",\"online\":false},{\"id\":354062,\"name\":\"saw_thu_ra\",\"avatar\":2,\"faceid\":179839392689481,\"vip\":10,\"chip\":0,\"status\":\"Player\",\"online\":false},{\"id\":100100,\"name\":\"authorised_shweyang\",\"avatar\":7,\"faceid\":0,\"vip\":10,\"chip\":300000,\"status\":\"...\",\"online\":false},{\"id\":325538,\"name\":\"zawpyan\",\"avatar\":5,\"faceid\":0,\"vip\":9,\"chip\":0,\"status\":\"ကတိေတြ လြယ္လြယ္ လာမေပးနဲ႔။feelက်ဲတယ္။\",\"online\":false},{\"id\":134468,\"name\":\"station\",\"avatar\":5,\"faceid\":0,\"vip\":9,\"chip\":2221030,\"status\":\"\",\"online\":false},{\"id\":596996,\"name\":\"7-rainbow\",\"avatar\":12,\"faceid\":0,\"vip\":9,\"chip\":49000,\"status\":\"...\",\"online\":false},{\"id\":588256,\"name\":\"thin_ei_phyu\",\"avatar\":1,\"faceid\":404829843373013,\"vip\":8,\"chip\":0,\"status\":\"\",\"online\":false},{\"id\":516239,\"name\":\"f_seller\",\"avatar\":2,\"faceid\":2030492887263883,\"vip\":8,\"chip\":0,\"status\":\"💰Chips Seller💰\",\"online\":false},{\"id\":679764,\"name\":\"rainwine\",\"avatar\":9,\"faceid\":0,\"vip\":8,\"chip\":900000,\"status\":\"ျပန္ေရာင္းခ်င္တယ္\",\"online\":false},{\"id\":465764,\"name\":\"nay_da_na\",\"avatar\":1,\"faceid\":171080700420707,\"vip\":7,\"chip\":0,\"status\":\"...\",\"online\":false},{\"id\":606363,\"name\":\"1z2a1y1r\",\"avatar\":2,\"faceid\":125782501688239,\"vip\":7,\"chip\":47000,\"status\":\"...\",\"online\":true},{\"id\":372262,\"name\":\"blue123\",\"avatar\":10,\"faceid\":0,\"vip\":7,\"chip\":61870000,\"status\":\"\",\"online\":false},{\"id\":202617,\"name\":\"owlfiter\",\"avatar\":9,\"faceid\":0,\"vip\":7,\"chip\":0,\"status\":\"ခ်ိစ္​​ေရာင္​းမည္​ ၀၉၇၇၉၂၆၈၈၂၉ \",\"online\":true},{\"id\":487688,\"name\":\"ngaye99\",\"avatar\":1,\"faceid\":0,\"vip\":7,\"chip\":0,\"status\":\"\\\" မေကာင္းဘူးထင္ရင္ ကင္းေအာင္ေန \\\"\",\"online\":false},{\"id\":313932,\"name\":\"aye_mya\",\"avatar\":12,\"faceid\":462451614185878,\"vip\":7,\"chip\":0,\"status\":\"...\",\"online\":false},{\"id\":526229,\"name\":\"real_b_fri\",\"avatar\":999,\"faceid\":254193898724202,\"vip\":7,\"chip\":979400,\"status\":\"ျပဳံးတယ္ ဘယ္ေလာက္ကုန္ကုန္\",\"online\":false},{\"id\":157352,\"name\":\"mg_poker\",\"avatar\":3,\"faceid\":220703818516511,\"vip\":7,\"chip\":0,\"status\":\"ေစတနာသည္လုတိုင္းနွင့္မတန္ပါ  က်ြန္ုပ္မရွိခင္ကသင္ကူညီဖူးပါသလား\",\"online\":false},{\"id\":352988,\"name\":\"neverdie\",\"avatar\":999,\"faceid\":110174849889516,\"vip\":7,\"chip\":0,\"status\":\"​ေစတနာသည္.....လူတိုင္းနဲ႔မတန္​\",\"online\":false},{\"id\":199969,\"name\":\"tuetue000\",\"avatar\":8,\"faceid\":0,\"vip\":7,\"chip\":150199969,\"status\":\"\",\"online\":true},{\"id\":649727,\"name\":\"waiphyo.min\",\"avatar\":1,\"faceid\":112117816399676,\"vip\":7,\"chip\":0,\"status\":\"မငိုပါနဲ႔ကေလးရယ္\",\"online\":false},{\"id\":491640,\"name\":\"blank.verse1984\",\"avatar\":999,\"faceid\":102364497355636,\"vip\":7,\"chip\":0,\"status\":\"ပင္လယ္ထဲမွာ လိုင္းမမွီဘူးေနာ္ တစ္ခါတစ္ရံေလာက္ပဲလိုင္းမိတယ္\",\"online\":false},{\"id\":4481,\"name\":\"b1joker\",\"avatar\":999,\"faceid\":1950185488387403,\"vip\":6,\"chip\":133366,\"status\":\"...\",\"online\":false},{\"id\":139042,\"name\":\"paingsoeoo\",\"avatar\":999,\"faceid\":230231111085082,\"vip\":6,\"chip\":0,\"status\":\"လာမ​ေတာင္​းပါန​ွင္​့။မ​ေပးနိုင္​ပါ။မ​ေရာင္​းပါ။ ဆဲမွ ရိုင္​းတယ္​မ​ေျပာပါနွင္​့။\",\"online\":false},{\"id\":527043,\"name\":\"moemoewim\",\"avatar\":2,\"faceid\":211290439724203,\"vip\":6,\"chip\":0,\"status\":\"...\",\"online\":false},{\"id\":594036,\"name\":\"may_shel\",\"avatar\":0,\"faceid\":857294354658078,\"vip\":6,\"chip\":1770400,\"status\":\"...\",\"online\":false},{\"id\":100581,\"name\":\"aungthurawin\",\"avatar\":1,\"faceid\":0,\"vip\":6,\"chip\":547960,\"status\":\"...\",\"online\":false},{\"id\":182348,\"name\":\"ko.par.gyi\",\"avatar\":8,\"faceid\":0,\"vip\":6,\"chip\":120000,\"status\":\"...of\",\"online\":false},{\"id\":528343,\"name\":\"trueman11111\",\"avatar\":3,\"faceid\":0,\"vip\":6,\"chip\":0,\"status\":\"FUCK ADMIN FUCK GAME\",\"online\":false}]"}
                        // var dat = JSON.parse(jsonData.data);
                        // if (Global.TopRichView.instance !== null) {
                        //     Global.TopRichView.arrVip = [];
                        //     for (let i = 0; i < dat.length; i++) {
                        //         const itemDat = dat[i];
                        //         var topData = new TopData();
                        //         topData.name = itemDat.name;
                        //         topData.chip = itemDat.chip;
                        //         topData.av = itemDat.avatar;
                        //         topData.vip = itemDat.vip;
                        //         topData.id = itemDat.id;
                        //         topData.fId = itemDat.faceid;
                        //         topData.status = itemDat.status;
                        //         if (topData.status === "" || typeof topData.status == 'undefined') {
                        //             topData.status = "...";
                        //         }
                        //         Global.TopRichView.arrVip.push(topData);
                        //     }
                        //     //  Global.TopRichView.updateList();
                        // }
                        break;
                    case 200:
                        GameManager.getInstance().user.status = jsonData.status;
                        require('NetworkManager').getInstance().isPing = true;
                        break;
                    case SERVICE_CODE.CHANGE_NAME: //change name
                        GameManager.getInstance().userRegister(jsonData);
                        break;
                    case 201:
                        if (jsonData.result === true) {
                            GameManager.getInstance().user.status = jsonData.status
                            Global.StatusPopup.onClose();
                            Global.ProfileView.updatelb_Status();
                        }
                        break;
                    case SERVICE_CODE.SEND_CHIP_SUCCESS:
                        // { "idevt": 800, "status": true, "msg": "Successfully sent 1000 chips", "AG": 99509161 }
                        let status = jsonData.status;
                        if (status) {
                            GameManager.getInstance().user.ag = jsonData.AG;
                            require('UIManager').instance.updateChipUser();
                            require('SMLSocketIO').getInstance().emitUpdateInfo();
                        }
                        GameManager.getInstance().onShowConfirmDialog(jsonData.msg);
                        break;
                    case 801:
                        GameManager.getInstance().userHasNewMailAdmin();
                        break;
                }
            }
        }
    },
});


module.exports = HandleServicePacket;