var GET_ANDROID_ID = "1";
var GET_BUNDLE_ID = "2";
var GET_VERSION_ID = "3";
var LOGIN_FACEBOOK = "4";
var GET_PATH_FOR_SCREENSHOT = "5";
var VEYRY_PHONE = "6";
var CHAT_ADMIN = "7";
var DEVICE_VERSION = "8";
var SHARE_FACEBOOK = "9";
var LOG_EVENT_TRACKING = "10";
var BUY_IAP = "11";
var SHARE_CODE_MESSAGE = "12";
var SEND_TAG_ONESIGNAL = "13";
var OPEN_FANPAGE = "14";
var OPEN_GROUP = "15";
var CHECK_NETWORK = "16";
var PUSH_NOTI_OFFLINE = "17";
var SHARE_SUCCESS = "18";
var CARRIER_NAME = "19";//for IOS
var CHECK1SIM = "20";//for Android
var CHECK2SIM = "21";
var HIDESPLASH = "22";
var GET_INFO_DEVICE_SML = "23";
var CALL_PHONE = "24";
var WEB_VIEW = "25";
var CLOSE_WEB_VIEW = "26";

cc.NativeCallJS = function (evt, params) {
    cc.NGWlog('iNativeCallJS------------------------>   DEMO ' + evt + "     " + params);
    switch (evt) {
        case GET_ANDROID_ID:
            require('GameManager').getInstance().deviceId = params;
            cc.sys.localStorage.setItem("GEN_DEVICEID", params);
            cc.NGWlog('gia tri deviceid la===' + params);
            break;
        case GET_BUNDLE_ID:
            require('GameManager').getInstance().bundleID = params;
            cc.sys.localStorage.setItem("GEN_BUNDLEID", params);
            cc.NGWlog('gia tri bundleID la===' + params);
            require('LoadConfig').getInstance().getConfigInfo();
            break;
        case GET_VERSION_ID:
            require('GameManager').getInstance().versionGame = params;
            cc.sys.localStorage.setItem("GEN_VERSIONGAME", params);
            cc.NGWlog('gia tri versionGame la===' + params);
            require('Util').getBundleId();
            break;
        case LOGIN_FACEBOOK:
            cc.NGWlog('tra ve token la===' + params);
            require('GameManager').getInstance().access_token = params;
            cc.sys.localStorage.setItem('Token', params);
            require('NetworkManager').getInstance().onLogin("1", params, false);
            break;
        case VEYRY_PHONE:
            let phone = params;
            cc.NGWlog('Goi Ham Verify phone trong util!!');
            require('NetworkManager').getInstance().sendVeryfyPhone(phone)
            require('GameManager').getInstance().number_verify = phone;
            Global.MissionView.onClose();
            break;
        case DEVICE_VERSION:
            require('GameManager').getInstance().deviceVersion = params;
            break;
        case GET_PATH_FOR_SCREENSHOT:
            // cc.sys.localStorage.setItem('pathSceenShot', params);
            require('GameManager').getInstance().pathScreenShot = params;
            break;

        case CHECK_NETWORK:
            if (params === "-1") {
                cc.NGWlog("Chuc mung ban da duoc ra dao!!!");
            }
            break;
        case CARRIER_NAME:
            cc.NGWlog("mcc la: " + params);
            require('GameManager').getInstance().mccsim1 = parseInt(params);
            break;
        case CHECK1SIM:
            cc.NGWlog("===D: check 1 sim", params);
            require('GameManager').getInstance().mccsim1 = parseInt(params);
            break;
        case CHECK2SIM:
            cc.NGWlog("===D: check 2 sim", params);
            if (params.indexOf("_") !== -1) {//co 2 sim tren may
                var listCountrycode = params.split("_");
                cc.NGWlog("listCountrycode", listCountrycode);
                for (var i = 0; listCountrycode.length; i++) {
                    if (i == 0) require('GameManager').getInstance().mccsim1 = parseInt(listCountrycode[0]);
                    if (i == 1) require('GameManager').getInstance().mccsim2 = parseInt(listCountrycode[1]);
                }
            } else {//chi co 1 sim tren may
                require('GameManager').getInstance().mccsim1 = parseInt(params);
            }
            break;
        case GET_INFO_DEVICE_SML:
            cc.NGWlog("GET_INFO_DEVICE_SML====" + params);
            let listIndexMark = [];
            let listParams = [];
            for (let i = 0; i < params.length; i++) {
                if (params[i] === ",") {
                    listIndexMark.push(i);
                }
            }
            let index = 0;
            for (let i = 0; i < listIndexMark.length; i++) {
                let str = params.slice(index, listIndexMark[i]);
                listParams.push(str);
                index = listIndexMark[i] + 1;
            }
            //Tiếng Việt,Redmi Note 4,1.03,24,xiaomi

            require('GameManager').getInstance().language = listParams[0];
            require('GameManager').getInstance().devicename = listParams[1];
            require('GameManager').getInstance().versionGame = listParams[2];
            require('GameManager').getInstance().osversion = listParams[3];
            require('GameManager').getInstance().brand = listParams[4];
            break;
        case "100":
            cc.NGWlog("iaploggggsigndata:=====" + params);
            require('GameManager').getInstance().signdata = params;
            break;
        case "101":
            cc.NGWlog("iaploggggsignature:=====" + params);
            require('GameManager').getInstance().signature = params;

            let _Signdata = require('GameManager').getInstance().signdata;
            let _Signature = require('GameManager').getInstance().signature;

            cc.NGWlog("iaploggggsigndata:" + _Signdata);
            cc.NGWlog("iaploggggsignature:" + _Signature);

            if (_Signdata == null || _Signdata == '' || _Signature == null || _Signature == '') {
                cc.NGWlog("iaploggggko sendIAPResult");
            } else {
                cc.NGWlog("iaploggggco sendIAPResult");
                require('NetworkManager').instance.sendIAPResult(_Signdata, _Signature);
            }
            break;
        case "200":
            cc.NGWlog("iaploggggreceiptData:=====" + params);
            require('GameManager').getInstance().receipt = params;

            let _receipt = require('GameManager').getInstance().receipt;

            if (_receipt == null || _receipt == '') {
                cc.NGWlog("iaploggggko validateIAPReceipt");
            } else {
                cc.NGWlog("iaploggggco validateIAPReceipt");
                require('NetworkManager').instance.validateIAPReceipt(_receipt);
            }
            break;
        case SHARE_FACEBOOK:
            if (params === "0") {
                cc.NGWlog("Share khong thanh cong");
            } else if (params === "1") {
                cc.NGWlog("Share thanh cong");
                require("NetworkManager").getInstance().sendShareImageFb();
            }

            break;
        case CLOSE_WEB_VIEW:
            cc.NGWlog("BO MAY CLOSE WEB VIEW");
            require("NetworkManager").getInstance().sendUAG();
            break;
    }
    if (cc.sys.os === cc.sys.OS_IOS && cc.game.isPaused) cc.director.startAnimation();
};

cc.NativeCallIAP = function (evt, params) {
    cc.NGWlog('iapobj------------------------>' + evt + params);
    switch (evt) {
        case "100":
            cc.NGWlog("iaploggggsigndata:=====" + params);
            require('GameManager').getInstance().signdata = params;
            break;
        case "101":
            cc.NGWlog("iaploggggsignature:=====" + params);
            require('GameManager').getInstance().signature = params;

            let _Signdata = require('GameManager').getInstance().signdata;
            let _Signature = require('GameManager').getInstance().signature;

            cc.NGWlog("iaploggggsigndata:" + _Signdata);
            cc.NGWlog("iaploggggsignature:" + _Signature);

            if (_Signdata == null || _Signdata == '' || _Signature == null || _Signature == '') {
                cc.NGWlog("iaploggggko sendIAPResult");
            } else {
                cc.NGWlog("iaploggggco sendIAPResult");
                require('NetworkManager').instance.sendIAPResult(_Signdata, _Signature);
            }
            break;
    }
};

var Util = cc.Class({
    statics: {
        onCallNative(evt, params) {
            if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", evt, params);
            } else if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("AppController", "onCallFromJavaScript:andParams:", evt, params);
            }
        },
        getGetDeviceId() {
            Util.onCallNative(GET_ANDROID_ID, "");
        },
        getBundleId() {
            Util.onCallNative(GET_BUNDLE_ID, "");
        },
        getVersionId() {
            Util.onCallNative(GET_VERSION_ID, "");
        },
        onLoginFb(reLogin = "0") {
            Util.onCallNative(LOGIN_FACEBOOK, "" + reLogin);
        },
        onVeryPhone() {
            Util.onCallNative(VEYRY_PHONE, "");
        },
        onChatAdmin() {
            // let data = {
            //     pageID: require('ConfigManager').getInstance().fanpageID,
            //     pageUrl: require('GameManager').getInstance().fanpageURL
            // };
            // cc.NGWlog('pageID la===' + require('GameManager').getInstance().fanpageID)
            // cc.NGWlog('pageURL la===' + require('GameManager').getInstance().fanpageURL)
            // let str = JSON.stringify(data);
            // Util.onCallNative(CHAT_ADMIN, str);
            cc.sys.openURL(require("ConfigManager").getInstance().u_chat_fb);
        },

        getDeviceVersion() {
            Util.onCallNative(DEVICE_VERSION, "");
        },
        onShareFb(imgPath) {
            cc.NGWlog(' SHARE FACEBOOK!!!');
            var data = {
                path: imgPath,
                hasTag: require("GameManager").getInstance().hashTagShareImage
            };

            Util.onCallNative(SHARE_FACEBOOK, JSON.stringify(data));
        },
        getPathForScreenshot() {
            Util.onCallNative(GET_PATH_FOR_SCREENSHOT, "");
        },
        sendLogEvent(params) {
            Util.onCallNative(LOG_EVENT_TRACKING, params);
        },
        onBuyIap(itemID) {
            Util.onCallNative(BUY_IAP, itemID);
        },
        shareCodeMessage(code) {
            Util.onCallNative(SHARE_CODE_MESSAGE, code);
        },
        sendLogEvent(params) {
            let data = {
                param: params
            };
            Util.onCallNative(LOG_EVENT_TRACKING, JSON.stringify(data));
        },
        sendTagOneSignal(key, value) {
            let data = {
                key: key,
                value: value
            };
            Util.onCallNative(SEND_TAG_ONESIGNAL, JSON.stringify(data));
        },

        openFanpage() {
            let data = {
                pageID: require('ConfigManager').getInstance().fanpageID,
                pageUrl: "https://www.facebook.com/" + require('ConfigManager').getInstance().fanpageID
            };

            Util.onCallNative(OPEN_FANPAGE, JSON.stringify(data));
        },
        openGroup() {
            let data = {
                groupID: require('ConfigManager').getInstance().groupID,
                groupUrl: require("ConfigManager").getInstance().groupLink + require('ConfigManager').getInstance().groupID
            };

            Util.onCallNative(OPEN_GROUP, JSON.stringify(data));
        },

        checkNetwork() {
            // Util.onCallNative(CHECK_NETWORK, "");
        },

        getCarrierName() {
            Util.onCallNative(CARRIER_NAME, "");
        },

        sendCheck1Sim() {
            cc.NGWlog("sendCheck1Sim");
            Util.onCallNative(CHECK1SIM, "");
        },

        sendCheck2Sim() {
            cc.NGWlog("sendCheck2Sim");
            Util.onCallNative(CHECK2SIM, "");
        },

        pushNotiOffline(data) {
            cc.NGWlog("UtilCocos: Push noti offline!");
            Util.onCallNative(PUSH_NOTI_OFFLINE, data);
        },
        hideSplash() {
            Util.onCallNative(HIDESPLASH, "");
        },
        getInfoDeviceSML() {
            cc.NGWlog("Call Android:getInfoDeviceSML");
            Util.onCallNative(GET_INFO_DEVICE_SML, "");
        },
        onCallPhone(phoneNumber) {
            Util.onCallNative(CALL_PHONE, phoneNumber);
        },
        onCallWebView(url) {
            Util.onCallNative(WEB_VIEW, url);
        }
    }
});

module.exports = Util;