var ConfigManager = cc.Class({
    statics: {
        _instance: null,
        getInstance() {
            if (this._instance === null) {
                this._instance = new ConfigManager();
            }

            return this._instance;
        }
    },
    properties: 
    {
        listGameId: [],
        listGameIp: [],
        listRankGame: [],
        listRuleJackPot: [],
        listTextConfig: [],

        allowPushOffline: false,
        gamenotification: false,
        time_request: 5,
        avatar_change: 2,
        avatar_count: 12,
        avatar_build: '',
        avatar_fb: '',
        delayNoti: null,
        operatorID: '',
        publisher: '',
        disID: '',
        u_SIO: '',
        data0: false,
        fbprivateappid: '',
        fanpageID: '',
        groupID: '',
        hotline: '',
        infoUser: '',
        infoChip: '',
        infoDT: '',
        infoBNF: '',
        hashTagShareImage: '',
        is_login_fb: false,
        is_login_guest: false,
        is_reg: false,
        newest_versionUrl: '',
        u_chat_fb: '',
        umode: '',
        umsg: '',
        uop1: '',
        uop2: "",
        utar: '',
        url_rule: '',

        groupLink: "https://www.facebook.com/groups/",
        is_helpvip: false,
        is_bl_fb: false,
        is_bl_salert: false,
        is_dt: false,
        ket: false,
        ismaqt: false,
        ket: false,
        ketT: false,

        isXoSo : false,
        ketPhe: 10,
        agSauCacTL: 10,
        agContactAd: 100,
        agRename: 100,

        //info chip
        dataInfoChip: null,
        dataInfoExchange: null,
    }
});

export default ConfigManager;