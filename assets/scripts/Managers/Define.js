
var IS_RUN_INSTANT_FACEBOOK = false;
var IS_CLOSE_SIO_OLD = 3//1: dung cu,2:dung moi ,3: dung ca 2.
var NAME_GAME = "_____CAM_JS";
var OPERATOR = 7000;
var DIALOG_ZINDEX=50;
var POPUP_ZINDEX=51;
var TAG = {
    POPUP: 10,
    DIALOG: 11,
    BANNER:12,
};
var GAME_ID = {

    SLOT_20_LINE: 1009, //doi cho 50.tam thoi;
    SLOT_20_LINE_JP: 1010,
    BLACKJACK: 9501,
    // POKER9:8035,
    BACCARAT: 9500,
    BINH: 8044,
    BORK: 8802,
    SESKU: 8813,
    SHOW: 8808,
    BAUCUA: 8803,
    TIENLEN: 9009,
    SLOT100LINE: 1008,
    ROULETTE: 1111,
    SLOT50LINE: 9008, // doi cho 20.tam thoi 
}; 
var LANGUAGE_TEXT_CONFIG = {
    LANG_EN: "EN",
    LANG_CAM: "KH",
};
var SERVICE_CODE= {
    CHATWORLDMESS:"16",
    UPDATE_STATUS:"201",
    MAIL_FREECHIP:"22",
    MAIL_ADMIN:"21",
    ERR_JOIN_TABLE:"10",
    CHANGE_NAME:202,
    SEND_CHIP_SUCCESS:800,
    HISTORYSAFE:500,
   
};
var GAME_INFO = {
    1009:{
        urlAssets:'prefab/SlotMachine',
        component: "SlotMachineView",
        isPlayNow: true,
        handleScritps : 'HandleSlotMachine',
        delayEvt : []
    },
    1010:{
        urlAssets: 'prefab/Slot20JPView' ,
        component : "Slot20LineJPView",
        isPlayNow: true,
        handleScritps : 'HandleSlot20JP',
        delayEvt : []
    },
    9501:{
        urlAssets:'prefab/BlackJack',
        component: 'BlackJackGameView',
        isPlayNow: false,
        handleScritps : 'HandleBlackJack',
        delayEvt : ['finish', 'irFinish', 'insuranceResult', 'cards', 'playerHit', 'playerDoubled', 'decisionTurn']
    },
    9500:{
        urlAssets:'prefab/BaccaratView',
        component : "BaccaratView",
        isPlayNow: false,
        handleScritps :'HandleBaccarat',
        delayEvt : ['finish']
    },
    8044:{
        urlAssets: 'prefab/BinhGameView',
        component : "BinhGameView",
        isPlayNow: false,
        handleScritps : 'BinhJsonParse',
        delayEvt : ['finish']
    },
    8802:{
        urlAssets:'prefab/BorkGameView',
        component: 'BorkGameView',
        isPlayNow: false,
        handleScritps : 'BorkHandleData',
        delayEvt : ['finish' , 'lc', 'startdealer']
    },
    8813:{
        urlAssets:'prefab/XocDiaView',
        component: "XocDia17GameView",
        isPlayNow: true,
        handleScritps : 'XocDia17Handle',
        delayEvt : []
    },
    8808:{
        urlAssets:'prefab/ShowGameView',
        component: "ShowGameView",
        isPlayNow: false,
        handleScritps : 'ShowHandlerData',
        delayEvt : ['finish']
    },
    8803:{
     urlAssets : 'prefab/BauCuaView',
     component: "BauCuaView",
     isPlayNow: true,
     handleScritps : 'BauCuaJsonParse',
     delayEvt : []
    },
    9009:{
        urlAssets:'prefab/TienLenView',
        component:"TienLenGameView",
        isPlayNow: false,
        handleScritps : 'TienLenJsonParse',
        delayEvt : ['finish' ,'lc', 'dc' ]
    },
    1008:{
        urlAssets:'prefab/Slot100Line',
        component : "Slot100Line",
        isPlayNow: true,
        handleScritps : 'HandleSlot100Line',
        delayEvt : []
    },
    1111:{
        urlAssets:'prefab/RouletteGameViewAlone' ,
        component: 'RouletteGameView2',
        isPlayNow: true,
        handleScritps : 'HandleRoulette',
        delayEvt : ['finish']
    },
    9008:{
        urlAssets:'prefab/Slot20Inca',
        component : "Slot20IncaView",
        isPlayNow: true,
        handleScritps : 'HandleSlot20Inca',
        delayEvt : []
    }
}
var EFFECT_TYPE = {
    NONE: 0,
    MOVE_LEFT: 1,
    MOVE_RIGHT: 2,
    MOVE_UP: 3,
    MOVE_DOWN: 4,
    SCALE: 5
};

var DIALOG_TYPE = {
    ONE_BTN: 0,
    TWO_BTN: 1,
    THREE_BTN: 2,
    NO_BTN:3,
};

var LOGIN_TYPE = {
    NORMAL: 0,
    PLAYNOW: 1,
    FACEBOOK: 2,
    FACEBOOK_INSTANT: 3,
    REG_ACC: 4
};

var STATE_GAME = {
    WAITING: 0,
    PLAYING: 1,
    VIEWING: 2
};

var GAME_ZORDER = {
    Z_PLAYERVIEW: 40,
    Z_CARD: 50,
    Z_BET: 100,
    Z_CHAT: 150,
    Z_EMO: 200,
    Z_BUTTON: 250,
    Z_MENU_VIEW: 300
};

var CODE_JOKER_BLACK = 60
var CODE_JOKER_RED = 61

TYPE_CARD_RUMMY = {
    NONE: 0,
    TCR_PURE: 1,
    SET: 2,
    IMPURE: 3,
    JOKER: 4
};


var TYPE_CARD_MAU_BINH = {
    NONE: -1,
    HIGH_CARD: 0,
    PAIR: 1,
    TWO_PAIR: 2,
    THREE_OF_A_KIND: 3,
    STRAIGHT: 4,
    FLUSH: 5,
    FULL_HOUSE: 6,
    FOUR_OF_A_KIND: 7,
    STRAIGHT_FLUSH: 8,
    THREE_FLUSHES: 9, // đặc biệt
    THREE_STRAIGHT: 10,
    SIX_PAIRS: 11,
    SAME_COLOR: 12,
    DRAGON: 13,
    GRAND_DRAGON: 14
};

var TYPE_CARD_TIEN_LEN = {
    TL_NONE: -1,
    TL_DOI: 0,
    TL_XAM: 1,
    TL_SANH: 2,
    TL_TPS: 3
};

var CURRENT_VIEW = {
    LOGIN_VIEW: "LOGIN_VIEW",
    LOBBY: "LOBBY",
    PAYMENT: "PAYMENT",
    MAIL: "MAIL",
    PERSONAL: "PERSONAL",
    CHAT_FRIEND: "CHAT_FRIEND",
    RULE_VIEW: "RULE_VIEW",
    GAMELIST_VIEW: "GAMELIST_VIEW",
    FEEDBACK_VIEW: "FEEDBACK_VIEW",
    NEWS_VIEW: "NEWS_VIEW",
    SETTING_VIEW: "SETTING_VIEW",
    JACKPOT_VIEW: "JACKPOT_VIEW",
    GUIDE_INGAME: "GUIDE_INGAME",
    COUNTDOWN: "COUNTDOWN",
    REGISTER_VIEW: "REGISTER_VIEW",
    RANK_VIEW: "RANK_VIEW",
    DT_VIEW: "DT_VIEW",
    KET: "KET_VIEW",
    CHATWORLD: "CHATWORLD",
    TOP_VIEW: "TOP_VIEW",
    FRIEND_VIEW: "FRIEND_VIEW",
    INFO_FRIEND_VIEW: "INFO_FRIEND_VIEW",
    CREATE_TABLE_GAME: "CREATE_TABLE_GAME",
    GIFT_CODE_VIEW: "GIFT_CODE_VIEW",
    MISSION_VIEW: "MISSION_VIEW",
    GAME_VIEW: "GAME_VIEW",
    SEND_GIFT_VIEW: "SEND_GIFT_VIEW",
    MAIL_CHIP_VIEW: "MAIL_CHIP_VIEW",
    FREECHIP_VIEW: "FREECHIP_VIEW",
    PROFILE_VIEW: "PROFILE_VIEW",
    TOPRICH_VIEW: "TOPRICH_VIEW",
};
var SIDE_BET = { //use for Baccarat
    PLAYER: "Player",
    PLAYER_PAIR: "PlayerPair",
    BANKER: "Banker",
    BANKER_PAIR: "BankerPair",
    TIE: "Tie"
};
var SIDE_WINPAIR = {
    NONE: "None",
    PLAYER: "PlayerPair",
    BANKER: "BankerPair",
    BOTHPB: "BothBP",
};
// var SIDE_WINMATCH = {
//     PLAYER: "Player",
//     BANKER: "Banker",
//     TIE: "TIE",
//     PLAYER_P:"PlayerWinPlayerPair",
//     PLAYER_B:"PlayerWinBankerPair",
//     PLAYER_PB:"PlayerWinPlayerBankerPair",
//     BANKER_P:"BankerWinPlayerPair",
//     BANKER_B:"BankerWinBankerPair",
//     BANKER_PB:"BankerWinPlayerBankerPair",

// };
var TYPEWIN_BACCARAT = {
    BANKER: 1,
    PLAYER: 2,
    TIE: 3,
    PLAYER_P: 102,
    PLAYER_B: 12,
    PLAYER_PB: 112,
    BANKER_P: 101,
    BANKER_B: 11,
    BANKER_PB: 111,
    TIE_P: 103,
    TIE_B: 13,
    TIE_PB: 113,
};
var TRACKING_TYPE = {
    AppLauncher: 0,
    RegisterClick: 1,
    RegisterFail: 2,
    RegisterSuccess: 3,
    LoginClick: 4,
    LoginSuccess: 5,
    LoginFail: 6,
    LoginPlayNowClick: 7,
    LoginPlayNowFail: 8,
    LoginPlayNowSuccess: 9,
    ContinueClick: 10,
    ContinueFail: 11,
    ContinueSuccess: 12,
    FacebookClick: 13,
    FacebookFail: 14,
    FacebookSuccess: 15,
    ClickPlayGame_: 16,//+gameID
    JoinTable_: 17,//+gameID
    PlayGame_: 18,//+gameID
    ClickChatWorld: 19,
    ClickTopRick: 20,
    ClickProfile: 21,
    ClickRename: 22,
    ClickBank: 23,
    ClickFriend: 24,
    ClickShareFB: 25,
    ClickShareMesFriend: 26,
    ClickShareLine: 27,
    ClickMailBox: 28,
    ClickFreeChip: 29,
    ClickVideo: 30,
    ClickInvite: 31,
    ClickFeedback: 32,
    ClickCode: 33,
    ClickUrl: 34,
    ClickDt: 35,
    ClickDt_FullChip: 36,
    ClickDt_NotEnoughChip: 37,
    Dt_Succes: 38,
    Dt_Fail: 39,
    ClickSetting_Button: 40,
    ClickSetting_Group: 41,
    ClickSetting_Fanpage: 42,
    ClickSetting_Quit: 43,
    ClickPayment_Button: 44,
    ClickPayment_IAP: 45,
    IAP_Cancel: 46,
    IAP_Success: 47,
    IAP_Fail: 48,
    ClickPC: 49,
    ClickPS: 50,
    ClickPCI: 51,
    PCS: 52,
    PCF: 53,
    ClickPSI: 54,
    ClickBack_: 55,//+gameID
    ClickCreateInTable_: 56,//+gameID
    ClickChangeTable_: 57,//+gameID
    ClickGuide_: 58,//+gameID
    KickNotEnoughChip_: 59,//+gameID
    ClickPlayNow: 60,//allgame
    ClickPlayNowSuccess: 61,//all game
    ClickPlayNowFail: 62,//all game
    ClickPlayNow_: 63,//+gameID
    ClickPlayNowSuccess_: 64,//+gameID
    ClickPlayNowFail_: 65,//+gameID
    ClickCreateTable: 66,
    CreateTableSuccess: 67,
    CreateTableFail: 68,
    ClickCreateTable_: 69,//+gameID
    CreateTableSuccess_: 70,//+gameID
    CreateTableFail_: 71,//+gameID
    ClickOffer: 72,
    ClickHelpVip: 73,
    ClickPayment_IAP_Item: 74,
    UserActive: 75,
    COUNT: 76,

    toString: function (type) {
        var key;
        for (key in this) {
            if (this[key] === type) {
                return key;
            }
        }
    },
   
};