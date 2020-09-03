var TYPE_CONFIG = {
    INFO: 1,
    USER: 2,
    CHIP: 3,
    DT: 4,
    BNF: 5,

}
var LoadConfig = cc.Class({
    ctor: function () {
        this.cors_url = "https://cors-anywhere.herokuapp.com/";
        if (cc.sys.isNative)
            this.cors_url = '';

        this.url_start = 'https://n.cfg.ngwcasino.com/info';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.config_info = '{"allowPushOffline":true,"is_reg":false,"is_login_guest":true,"is_login_fb":true,"agSauCacTL":10,"time_request":5,"avatar_change":2,"avatar_count":10,"avatar_build":"https://storage.googleapis.com/cdn.ngwcasino.com/ava/ngw/%avaNO%.png","avatar_fb":"https://graph.facebook.com/v4.0/%fbID%/picture?width=200&height=200&redirect=true","text":[{"lang":"EN","url":"https://cfg.ngwcasino.com/text/nagajs/text_en.json"},{"lang":"KH","url":"https://cfg.ngwcasino.com/text/nagajs/text_cam.json"}],"listGame":[{"id":9009,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":1111,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8813,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9501,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9500,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9008,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8802,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8044,"ip":"35.247.184.4","ip_dm":"app-003.ngwcasino.com"},{"id":8803,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8808,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"}],"bundleID":"khmer.ngw.card.slot","version":"1.00","operatorID":7000,"os":"android","publisher":"config_offline_android","disID":1001,"url_rule":"https://cfg.ngwcasino.com/rule/%gameid%","data0”:false,”listTop":[{"id":8044,"url_img_js":"https://cfg.ngwcasino.com/image/top/js/8044_1.png"},{"id":9009,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8808,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8803,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8802,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9008,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9500,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9501,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8813,"url_img_js":"https://cfg.ngwcasino.com/image/top/js/8044_1.png"},{"id":1111,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"}],"infoUser":"https://n.cfg.ngwcasino.com/infoUser"}'
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            this.config_info = '{"allowPushOffline":true,"is_reg":false,"is_login_guest":true,"is_login_fb":true,"agSauCacTL":10,"time_request":5,"avatar_change":2,"avatar_count":10,"avatar_build":"https://storage.googleapis.com/cdn.ngwcasino.com/ava/ngw/%avaNO%.png","avatar_fb":"https://graph.facebook.com/v4.0/%fbID%/picture?width=200&height=200&redirect=true","text":[{"lang":"EN","url":"https://cfg.ngwcasino.com/text/nagajs/text_en.json"},{"lang":"KH","url":"https://cfg.ngwcasino.com/text/nagajs/text_cam.json"}],"listGame":[{"id":9009,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":1111,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8813,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9501,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9500,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9008,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8802,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8044,"ip":"35.247.184.4","ip_dm":"app-003.ngwcasino.com"},{"id":8803,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8808,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"}],"bundleID":"khmer.ngw.card.slot","version":"1.00","operatorID":7000,"os":"ios","publisher":"config_offline_ios","disID":1001,"url_rule":"https://cfg.ngwcasino.com/rule/%gameid%","data0”:false,”listTop":[{"id":8044,"url_img_js":"https://cfg.ngwcasino.com/image/top/js/8044_1.png"},{"id":9009,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8808,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8803,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8802,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9008,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9500,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9501,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8813,"url_img_js":"https://cfg.ngwcasino.com/image/top/js/8044_1.png"},{"id":1111,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"}],"infoUser":"https://n.cfg.ngwcasino.com/infoUser"}'
        } else {
            this.config_info = '{"allowPushOffline":true,"is_reg":false,"is_login_guest":true,"is_login_fb":true,"agSauCacTL":10,"time_request":5,"avatar_change":2,"avatar_count":10,"avatar_build":"https://storage.googleapis.com/cdn.ngwcasino.com/ava/ngw/%avaNO%.png","avatar_fb":"https://graph.facebook.com/v4.0/%fbID%/picture?width=200&height=200&redirect=true","text":[{"lang":"EN","url":"https://cfg.ngwcasino.com/text/nagajs/text_en.json"},{"lang":"KH","url":"https://cfg.ngwcasino.com/text/nagajs/text_cam.json"}],"listGame":[{"id":9009,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":1111,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8813,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9501,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9500,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":9008,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8802,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8044,"ip":"35.247.184.4","ip_dm":"app-003.ngwcasino.com"},{"id":8803,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"},{"id":8808,"ip":"35.240.165.227","ip_dm":"app-001.ngwcasino.com"}],"bundleID":"khmer.ngw.card.slot","version":"1.00","operatorID":7000,"os":"web","publisher":"config_offline_web","disID":1001,"url_rule":"https://cfg.ngwcasino.com/rule/%gameid%","data0”:false,”listTop":[{"id":8044,"url_img_js":"https://cfg.ngwcasino.com/image/top/js/8044_1.png"},{"id":9009,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8808,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8803,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8802,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9008,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9500,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":9501,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"},{"id":8813,"url_img_js":"https://cfg.ngwcasino.com/image/top/js/8044_1.png"},{"id":1111,"url_img_js":"https://cfg.ngwcasino.com/image/top/coming_js_1.png"}],"infoUser":"https://n.cfg.ngwcasino.com/infoUser"}'
        }
    },

    properties: {

    },

    statics: {
        _instance: null,
        getInstance() {
            if (this._instance === null) {
                this._instance = new LoadConfig();
            }

            return this._instance;
        }
    },

    onLoad() {

    },

    getConfigInfo() {
        cc.NGWlog('-=-=-=-=-=-=-=-=-=-=-=-=-=> getConfig New')
        let bodyJson = this.createBodyJsonNormal();
        this.getHttpRequest("POST", this.url_start, bodyJson, TYPE_CONFIG.INFO);
        console.log('dmdmdmdmdmdmdmd : ', JSON.stringify(bodyJson));
    },

    getInfoUser(_data0) {
        let cfManager = require('ConfigManager').getInstance()

        let bodyJson = this.createBodyJsonNormal()

        bodyJson.id = require('GameManager').getInstance().user.id
        bodyJson.ag = require('GameManager').getInstance().user.ag
        bodyJson.lq = require('GameManager').getInstance().user.lq
        bodyJson.vip = require('GameManager').getInstance().user.vip

        if (cfManager.data0)
            bodyJson.data0 = _data0

        this.getHttpRequest("POST", cfManager.infoUser, bodyJson, TYPE_CONFIG.USER);
    },

    getInfoChip() {
        let cfManager = require('ConfigManager').getInstance()

        require('UIManager').instance.onShowLoad()

        let bodyJson = this.createBodyJsonNormal()
        bodyJson.id = require('GameManager').getInstance().user.id
        bodyJson.ag = require('GameManager').getInstance().user.ag
        bodyJson.lq = require('GameManager').getInstance().user.lq
        bodyJson.vip = require('GameManager').getInstance().user.vip

        this.getHttpRequest("POST", cfManager.infoChip, bodyJson, TYPE_CONFIG.CHIP);
    },

    getInfoDT() {
        let cfManager = require('ConfigManager').getInstance()

        require('UIManager').instance.onShowLoad()

        let bodyJson = this.createBodyJsonNormal()
        bodyJson.id = require('GameManager').getInstance().user.id
        bodyJson.ag = require('GameManager').getInstance().user.ag
        bodyJson.lq = require('GameManager').getInstance().user.lq
        bodyJson.vip = require('GameManager').getInstance().user.vip

        this.getHttpRequest("POST", cfManager.infoDT, bodyJson, TYPE_CONFIG.DT);
    },

    getInfoBenefit() {
        let cfManager = require('ConfigManager').getInstance()
        this.getHttpRequest("POST", cfManager.infoBNF, null, TYPE_CONFIG.BNF);
    },

    createBodyJsonNormal() {
        let bodyJson = {};

        bodyJson.bundleID = require('GameManager').getInstance().bundleID;
        bodyJson.version = require('GameManager').getInstance().versionGame;
        bodyJson.operatorID = OPERATOR
        bodyJson.publisher = require('GameManager').getInstance().publisher

        let osName = "web";

        if (cc.sys.os === cc.sys.OS_ANDROID)
            osName = "android_cocosjs";
        else if (cc.sys.os === cc.sys.OS_IOS)
            osName = "ios_cocosjs";

        bodyJson.os = osName
        bodyJson.mcc = [require('GameManager').getInstance().mccsim1, require('GameManager').getInstance().mccsim2]

        return bodyJson
    },

    getHttpRequest(_typeRequest, _url, bodyJson = null, typeConfig) {

        let cfManager = require('ConfigManager').getInstance()

        var request = new XMLHttpRequest();
        if (cc.sys.isBrowser)
            request.open(_typeRequest, "" + _url, true); //hien cmt
        else request.open(_typeRequest, this.cors_url + _url, true);
        request.setRequestHeader("Access-Control-Allow-Origin", "*");
        request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        if (cc.sys.isNative)
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        request.timeout = cfManager.time_request * 1000;

        if (bodyJson != null)
            request.send(JSON.stringify(bodyJson))
        else
            request.send()

        var _this = this

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                require('UIManager').instance.onHideLoad()
                if (request.status >= 200 && request.status < 400) {
                    switch (typeConfig) {
                        case TYPE_CONFIG.INFO:
                            cc.NGWlog('CONFIG INFO TRA VE: ' + request.responseText);
                            _this.handleInfo(request.responseText);
                            break;
                        case TYPE_CONFIG.USER:
                            cc.NGWlog('CONFIG USER TRA VE: ' + request.responseText);
                            cc.sys.localStorage.setItem('configUser_' + require("GameManager").getInstance().user.id, request.responseText);
                            _this.handleInfoUser(request.responseText);
                            break;
                        case TYPE_CONFIG.CHIP:
                            cc.NGWlog('CONFIG PM TRA VE: ' + request.responseText);
                            cc.sys.localStorage.setItem('configPM_' + require("GameManager").getInstance().user.id, request.responseText);
                            _this.handleInfoChip(request.responseText);
                            break;
                        case TYPE_CONFIG.DT:
                            cc.NGWlog('CONFIG DT TRA VE: ' + request.responseText);
                            cc.sys.localStorage.setItem('configDT_' + require("GameManager").getInstance().user.id, request.responseText);
                            _this.handleInfoDT(request.responseText);
                            break;
                        case TYPE_CONFIG.BNF:
                            cc.NGWlog('CONFIG BNF TRA VE: ' + request.responseText);
                            _this.handleInfoBenefit(request.responseText);
                            break;
                    }
                } else {
                    switch (typeConfig) {
                        case TYPE_CONFIG.INFO:
                            cc.NGWlog('CONFIG INFO OFFLINE: ' + _this.config_info);
                            _this.handleInfo(_this.config_info);
                            break;
                        case TYPE_CONFIG.USER:
                            cc.NGWlog('CONFIG USER OFFLINE: ' + cc.sys.localStorage.getItem('configUser_' + require("GameManager").getInstance().user.id));
                            _this.handleInfoUser(cc.sys.localStorage.getItem('configUser_' + require("GameManager").getInstance().user.id));
                            break;
                        case TYPE_CONFIG.CHIP:
                            cc.NGWlog('CONFIG PM OFFLINE: ' + cc.sys.localStorage.getItem('configPM_' + require("GameManager").getInstance().user.id));
                            _this.handleInfoChip(cc.sys.localStorage.getItem('configPM_' + require("GameManager").getInstance().user.id));
                            break;
                        case TYPE_CONFIG.DT:
                            cc.NGWlog('CONFIG DT OFFLINE: ' + cc.sys.localStorage.getItem('configDT_' + require("GameManager").getInstance().user.id));
                            _this.handleInfoDT(cc.sys.localStorage.getItem('configDT_' + require("GameManager").getInstance().user.id));
                            break;
                    }
                }
            } else {
                cc.NGWlog('Load request chưa xong');
            }
        };

        request.ontimeout = function () {
            require('UIManager').instance.onHideLoad()
            cc.NGWlog('Load request time out');
            switch (typeConfig) {
                case TYPE_CONFIG.INFO:
                    cc.NGWlog('CONFIG INFO OFFLINE: ' + _this.config_info);
                    _this.handleInfo(_this.config_info);
                    break;
                case TYPE_CONFIG.USER:
                    cc.NGWlog('CONFIG USER OFFLINE: ' + cc.sys.localStorage.getItem('configUser_' + require("GameManager").getInstance().user.id));
                    _this.handleInfoUser(cc.sys.localStorage.getItem('configUser_' + require("GameManager").getInstance().user.id));
                    break;
                case TYPE_CONFIG.CHIP:
                    cc.NGWlog('CONFIG PM OFFLINE: ' + cc.sys.localStorage.getItem('configPM_' + require("GameManager").getInstance().user.id));
                    _this.handleInfoChip(cc.sys.localStorage.getItem('configPM_' + require("GameManager").getInstance().user.id));
                    break;
                case TYPE_CONFIG.DT:
                    cc.NGWlog('CONFIG DT OFFLINE: ' + cc.sys.localStorage.getItem('configDT_' + require("GameManager").getInstance().user.id));
                    _this.handleInfoDT(cc.sys.localStorage.getItem('configDT_' + require("GameManager").getInstance().user.id));
                    break;
            }
        };

        request.onerror = function () {
            require('UIManager').instance.onHideLoad()
            cc.NGWlog('Load request error');
            switch (typeConfig) {
                case TYPE_CONFIG.INFO:
                    cc.NGWlog('CONFIG INFO OFFLINE: ' + _this.config_info);
                    _this.handleInfo(_this.config_info);
                    break;
                case TYPE_CONFIG.USER:
                    cc.NGWlog('CONFIG USER OFFLINE: ' + cc.sys.localStorage.getItem('configUser_' + require("GameManager").getInstance().user.id));
                    _this.handleInfoUser(cc.sys.localStorage.getItem('configUser_' + require("GameManager").getInstance().user.id));
                    break;
                case TYPE_CONFIG.CHIP:
                    cc.NGWlog('CONFIG PM OFFLINE: ' + cc.sys.localStorage.getItem('configPM_' + require("GameManager").getInstance().user.id));
                    _this.handleInfoChip(cc.sys.localStorage.getItem('configPM_' + require("GameManager").getInstance().user.id));
                    break;
                case TYPE_CONFIG.DT:
                    cc.NGWlog('CONFIG DT OFFLINE: ' + cc.sys.localStorage.getItem('configDT_' + require("GameManager").getInstance().user.id));
                    _this.handleInfoDT(cc.sys.localStorage.getItem('configDT_' + require("GameManager").getInstance().user.id));
                    break;
            }
        };
    },

    getTextConfig(_url, _language) {

        let cfManager = require('ConfigManager').getInstance()

        var request = new XMLHttpRequest();
        request.open("GET", this.cors_url + _url, true);
        request.setRequestHeader("Access-Control-Allow-Origin", "*");
        request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        if (cc.sys.isNative)
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        request.timeout = cfManager.time_request * 1000;
        request.send()

        cc.log("getTextConfig======" + request.responseText);

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                require('UIManager').instance.onHideLoad()
                if (request.status >= 200 && request.status < 400) {
                    let key = 'config_text_' + _language;
                    cc.sys.localStorage.setItem(key, request.responseText);
                } else {
                }
            }
            else {
                cc.NGWlog('Load request text chưa xong');
            }
        };

        require("GameManager").getInstance().initConfigText()
    },

    handleInfo(result) {
        let cfManager = require('ConfigManager').getInstance()

        let objData = JSON.parse(result);

        cc.NGWlog(objData)

        if (objData.hasOwnProperty('publisher'))
            cfManager.publisher = objData.publisher

        if (objData.hasOwnProperty('disID'))
            cfManager.disID = objData.disID
        else
            cfManager.disID = 1001

        if (objData.hasOwnProperty('allowPushOffline'))
            cfManager.allowPushOffline = objData.allowPushOffline
        else
            cfManager.allowPushOffline = false;

        if (objData.hasOwnProperty('is_reg'))
            cfManager.is_reg = objData.is_reg
        else
            cfManager.is_reg = false;

        if (objData.hasOwnProperty('is_login_fb'))
            cfManager.is_login_fb = objData.is_login_fb
        else
            cfManager.is_login_fb = false;

        if (objData.hasOwnProperty('is_login_guest'))
            cfManager.is_login_guest = objData.is_login_guest
        else
            cfManager.is_login_guest = false;

        if (objData.hasOwnProperty('time_request'))
            cfManager.time_request = objData.time_request
        else
            cfManager.time_request = 5;

        if (objData.hasOwnProperty('agSauCacTL'))
            cfManager.agSauCacTL = objData.agSauCacTL
        else
            cfManager.agSauCacTL = 10;

        if (objData.hasOwnProperty('avatar_change'))
            cfManager.avatar_change = objData.avatar_change

        if (objData.hasOwnProperty('avatar_count'))
            cfManager.avatar_count = objData.avatar_count

        if (objData.hasOwnProperty('avatar_build'))
            cfManager.avatar_build = objData.avatar_build

        if (objData.hasOwnProperty('avatar_fb'))
            cfManager.avatar_fb = objData.avatar_fb

        if (objData.hasOwnProperty('u_SIO')) {
            cfManager.u_SIO = objData.u_SIO
            require("SMLSocketIO").getInstance().intiSml();
            require("SMLSocketIO").getInstance().startSIO();
        }
        else
            cfManager.u_SIO = '';

        if (objData.hasOwnProperty('data0'))
            cfManager.data0 = objData.data0
        else
            cfManager.data0 = false

        if (objData.hasOwnProperty('fbprivateappid'))
            cfManager.fbprivateappid = objData.fbprivateappid
        else
            cfManager.fbprivateappid = ''

        if (objData.hasOwnProperty('fanpageID'))
            cfManager.fanpageID = objData.fanpageID
        else
            cfManager.fanpageID = ''

        if (objData.hasOwnProperty('groupID'))
            cfManager.groupID = objData.groupID
        else
            cfManager.groupID = ''

        if (objData.hasOwnProperty('hotline'))
            cfManager.hotline = objData.hotline
        else
            cfManager.hotline = ''

        if (objData.hasOwnProperty('isShowLog'))
            cfManager.isShowLog = objData.isShowLog
        else
            cfManager.isShowLog = false

        if (cfManager.isShowLog)
            cc.NGWlog = console.log
        else
            cc.NGWlog = cc.log

        if (objData.hasOwnProperty('newest_versionUrl'))
            cfManager.newest_versionUrl = objData.newest_versionUrl
        else
            cfManager.newest_versionUrl = ''

        if (objData.hasOwnProperty('u_chat_fb'))
            cfManager.u_chat_fb = objData.u_chat_fb
        else
            cfManager.u_chat_fb = ''

        if (objData.hasOwnProperty('url_rule'))
            cfManager.url_rule = objData.url_rule
        else
            cfManager.url_rule = ''

        if (objData.hasOwnProperty('infoUser'))
            cfManager.infoUser = objData.infoUser
        else
            cfManager.infoUser = ''

        if (objData.hasOwnProperty('infoChip'))
            cfManager.infoChip = objData.infoChip
        else
            cfManager.infoChip = ''

        if (objData.hasOwnProperty('infoDT'))
            cfManager.infoDT = objData.infoDT;
        else
            cfManager.infoDT = ''

        if (objData.hasOwnProperty('infoBNF')) {
            cfManager.infoBNF = objData.infoBNF;
            this.getInfoBenefit();
        }
        else
            cfManager.infoBNF = ''

        if (objData.hasOwnProperty('text')) {
            cfManager.listTextConfig = []

            let data = objData.text;

            for (let i = 0; i < data.length; i++) {
                let itemText = {};

                if (data[i].hasOwnProperty('lang'))
                    itemText.language = data[i].lang;
                else
                    itemText.language = ''

                if (data[i].hasOwnProperty('url'))
                    itemText.url_text = data[i].url;
                else
                    itemText.url_text = ''

                cfManager.listTextConfig.push(itemText);
                if (itemText.url_text !== '') {
                    this.getTextConfig(itemText.url_text, itemText.language);
                }
            }
        }

        if (objData.hasOwnProperty('delayNoti'))
            cfManager.delayNoti = objData.delayNoti

        if (objData.hasOwnProperty('everyDayNoti'))
            cfManager.everyDayNoti = objData.everyDayNoti

        if (objData.hasOwnProperty('listGame')) {
            cfManager.listGameId = [];
            cfManager.listGameIp = [];
            let data = objData.listGame;
            cc.log("======Cur Game Id=111111=" + require('GameManager').getInstance().curGameId);
            for (let i = 0; i < data.length; i++) {
                let serverIp = {};

                serverIp.gameid = data[i].id;
                serverIp.gameip = data[i].ip;
                serverIp.domain = data[i].ip_dm;

                if (data[i].hasOwnProperty('v_tb'))
                    serverIp.vip = data[i].v_tb;
                else
                    serverIp.vip = 10;

                if (data[i].hasOwnProperty('agSvipMin'))
                    serverIp.agSvipMin = data[i].agSvipMin;
                else
                    serverIp.agSvipMin = 50000;

                cfManager.listGameId.push(data[i].id);
                cfManager.listGameIp.push(serverIp);

                if (require('GameManager').getInstance().curGameId === 0 && i === 0) {
                    require('GameManager').getInstance().curGameId = serverIp.gameid;
                    require('GameManager').getInstance().curServerIp = serverIp.domain;

                    cc.sys.localStorage.setItem("curGameId", serverIp.gameid);
                    cc.sys.localStorage.setItem("curServerIp" + NAME_GAME, serverIp.domain);
                }
            }
        }
        cfManager.listGameId = [];
        cfManager.listGameId = [9009,8802,9008,8808,8813,8803];

        if (objData.hasOwnProperty('listTop')) {
            cfManager.listRankGame = [];
            let data = objData.listTop;

            for (let i = 0; i < data.length; i++) {
                let itemRank = {};

                itemRank.gameid = data[i].id
                if (data[i].hasOwnProperty('url_img_js'))
                    itemRank.url_img = data[i].url_img_js;
                else
                    itemRank.url_img = '';

                cfManager.listRankGame.push(itemRank);
            }
        }

        if (objData.hasOwnProperty('umode'))
            cfManager.umode = objData.umode
        else
            cfManager.umode = 0

        if (objData.hasOwnProperty('umsg'))
            cfManager.umsg = objData.umsg
        else
            cfManager.umsg = ''

        if (objData.hasOwnProperty('uop1'))
            cfManager.uop1 = objData.uop1
        else
            cfManager.uop1 = ''

        if (objData.hasOwnProperty('uop2'))
            cfManager.uop2 = objData.uop2
        else
            cfManager.uop2 = ''

        if (objData.hasOwnProperty('utar'))
            cfManager.utar = objData.utar
        else
            cfManager.utar = ''

        require("UIManager").instance.updateConfigUmode();
    },

    handleInfoUser(result) {
        let cfManager = require('ConfigManager').getInstance()

        let objData = JSON.parse(result);
        cc.NGWlog(objData)

        if (objData.hasOwnProperty('publisher'))
            cfManager.publisher = objData.publisher

        if (objData.hasOwnProperty('disID')){
            cfManager.disID = objData.disID;
            console.log('disid game : ', cfManager.disID);
        }
        else
            cfManager.disID = 1001;

        if (objData.hasOwnProperty('is_xs')){
            cfManager.isXoSo = objData.is_xs;
            cc.log('is xoxoxooxoo ', cfManager.isXoSo);
        }
        else
            cfManager.isXoSo = false;

        if (objData.hasOwnProperty('listGame')) {
            cfManager.listGameId = [];
            cfManager.listGameIp = [];
            let data = objData.listGame;

            for (let i = 0; i < data.length; i++) {
                let serverIp = {};

                serverIp.gameid = data[i].id;
                serverIp.gameip = data[i].ip;
                serverIp.domain = data[i].ip_dm;

                if (data[i].hasOwnProperty('v_tb'))
                    serverIp.vip = data[i].v_tb;
                else
                    serverIp.vip = 10;

                if (data[i].hasOwnProperty('agSvipMin'))
                    serverIp.agSvipMin = data[i].agSvipMin;
                else
                    serverIp.agSvipMin = 50000;

                cfManager.listGameId.push(data[i].id);
                cfManager.listGameIp.push(serverIp);

                if (require('GameManager').getInstance().curGameId === 0 && i === 0) {
                    require('GameManager').getInstance().curGameId = serverIp.gameid;
                    require('GameManager').getInstance().curServerIp = serverIp.domain;
                }
                cc.log("Cur game Id3333===" + require('GameManager').getInstance().curGameId);
            }
        }
        cfManager.listGameId = [];
        cfManager.listGameId = [9009,8044,8802,9008,8808,8813,8803];

        if (objData.hasOwnProperty('ismaqt'))
            cfManager.ismaqt = objData.ismaqt
        else
            cfManager.ismaqt = false

        if (objData.hasOwnProperty('ketT'))
            cfManager.ketT = objData.ketT
        else
            cfManager.ketT = false

        if (objData.hasOwnProperty('ketPhe')){
            cfManager.ketPhe = objData.ketPhe;
            cc.log('ket ophe === ', cfManager.ketPhe);
        }
        else
            cfManager.ketPhe = 10

        if (objData.hasOwnProperty('is_dt'))
            cfManager.is_dt = objData.is_dt
        else
            cfManager.is_dt = false;

        if (objData.hasOwnProperty('is_bl_salert'))
            cfManager.is_bl_salert = objData.is_bl_salert
        else
            cfManager.is_bl_salert = false;

        if (objData.hasOwnProperty('is_bl_fb'))
            cfManager.is_bl_fb = objData.is_bl_fb
        else
            cfManager.is_bl_fb = false;

        require("UIManager").instance.refreshButtonConfig();
    },

    handleInfoChip(result) {
        let cfManager = require('ConfigManager').getInstance()

        require('UIManager').instance.onHideLoad()

        try {
            cfManager.dataInfoChip = JSON.parse(result)
        } catch (e) {
            cfManager.dataInfoChip = null
        }

        cc.NGWlog(cfManager.dataInfoChip);

        if (cfManager.dataInfoChip) {
            Global.ShopView.setInfo()
        }

    },

    handleInfoDT(result) {
        let cfManager = require('ConfigManager').getInstance()

        require('UIManager').instance.onHideLoad()

        try {
            cfManager.dataInfoExchange = JSON.parse(result)
        } catch (e) {
            cfManager.dataInfoExchange = null
        }

        cc.NGWlog(cfManager.dataInfoExchange);

        if (cfManager.dataInfoExchange) {
            Global.CashOutView.setInfo();
        }
    },

    handleInfoBenefit(result) {
        let cfManager = require('ConfigManager').getInstance()

        let objData = JSON.parse(result)
        if (objData.hasOwnProperty('jackpot')) {
            cfManager.listRuleJackPot = []
            let data = objData.jackpot
            for (let i = 0; i < data.length; i++) {
                let item = {}
                item.gameid = data[i].gameid
                let arrMark = []
                let arrChip = []
                for (let id = 0; id < data[i].mark.length; id++) {
                    arrMark.push(data[i].mark[id]);
                    arrChip.push(data[i].chip[id]);
                }
                item.listMark = arrMark;
                item.listChip = arrChip;
                cfManager.listRuleJackPot.push(item);
            }
        }

        if (objData.hasOwnProperty('agContactAd'))
            cfManager.agContactAd = objData.agContactAd

        if (objData.hasOwnProperty('agRename'))
            cfManager.agRename = objData.agRename
    }
});
export default LoadConfig;