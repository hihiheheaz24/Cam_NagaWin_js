

cc.Class({
    extends: cc.Component,

    properties: {
        Boxbet_Player: cc.Label,
        Boxbet_PlayerPair: cc.Label,
        Boxbet_Banker: cc.Label,
        Boxbet_BankerPair: cc.Label,
        Boxbet_Tie: cc.Label,
        list_lbBoxbet: [cc.Label],
        itemPlayer : cc.Node,
        itemPPlayer : cc.Node,
        itemBanker : cc.Node,
        itemPBanker : cc.Node,
        itemTie : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.my_BetValue = [];
        this.boxValue = [];
        this.dataBet=[];
    },

    start() {
        this.PValue = 0; this.PPValue = 0; this.BValue = 0; this.BPValue = 0; this.TieValue = 0;
        this.my_PValue = 0; this.my_PPValue = 0; this.my_BValue = 0; this.my_BPValue = 0; this.my_TieValue = 0;
        this.itemPlayer.active = false;
        this.itemPPlayer.active = false;
        this.itemBanker.active = false;
        this.itemPBanker.active = false;
        this.itemTie.active = false;
    },
    onBet(betType, value) {
        switch (betType) {
            case SIDE_BET.PLAYER:
                this.PValue += value;
                this.itemPlayer.active = true;
                break;
            case SIDE_BET.PLAYER_PAIR:
                this.PPValue += value;
                this.itemPPlayer.active = true;
                break;
            case SIDE_BET.BANKER:
                this.BValue += value;
                this.itemBanker.active = true;
                break;
            case SIDE_BET.BANKER_PAIR:
                this.BPValue += value;
                this.itemPBanker.active = true;
                break;
            case SIDE_BET.TIE:
                this.TieValue += value;
                this.itemTie.active = true;
                break;
        }
        this.setValueBoxbet();
    },
    onPlayerClear() {
        this.PValue -=this.my_PValue ;
        this.PPValue -=this.my_PPValue;
        this.BValue -= this.my_BValue;
        this.BPValue -=this.my_BPValue;
        this.TieValue -=this.my_TieValue;
        this.my_PValue = 0; this.my_PPValue = 0; this.my_BValue = 0; this.my_BPValue = 0; this.my_TieValue = 0;
        this.setValueBoxbet();
    },
    resetBoxbet() {
        cc.NGWlog("Baccarat RESET BOXBET");
        this.PValue = 0; this.PPValue = 0; this.BValue = 0; this.BPValue = 0; this.TieValue = 0;
        this.my_PValue = 0; this.my_PPValue = 0; this.my_BValue = 0; this.my_BPValue = 0; this.my_TieValue = 0;
        this.itemPlayer.active = false;
        this.itemPPlayer.active = false;
        this.itemBanker.active = false;
        this.itemPBanker.active = false;
        this.itemTie.active = false;
        this.setValueBoxbet();

    },
    setValueBoxbet() {
        this.Boxbet_Player.string=require("GameManager").getInstance().formatMoney(this.PValue);
        this.Boxbet_PlayerPair.string=require("GameManager").getInstance().formatMoney(this.PPValue);
        this.Boxbet_Banker.string=require("GameManager").getInstance().formatMoney(this.BValue);
        this.Boxbet_BankerPair.string=require("GameManager").getInstance().formatMoney(this.BPValue);
        this.Boxbet_Tie.string=require("GameManager").getInstance().formatMoney(this.TieValue);
    },
    createDataBet(){
        this.dataBet=[];
        if(this.PValue>0){
            this.initData(SIDE_BET.PLAYER,this.PValue);
        }
        if(this.PPValue>0){
            this.initData(SIDE_BET.PLAYER_PAIR,this.PPValue);
        }
        if(this.BValue>0){
            this.initData(SIDE_BET.BANKER,this.BValue);
        }
        if(this.BPValue>0){
            this.initData(SIDE_BET.BANKER_PAIR,this.BPValue);
        }
        if(this.TieValue>0){
            this.initData(SIDE_BET.TIE,this.TieValue);
        }
    },
    initData(type,value){
        let data={
            typeBet:type,
            value:value
        }
        this.dataBet.push(data);
    }
    // update (dt) {},
});
