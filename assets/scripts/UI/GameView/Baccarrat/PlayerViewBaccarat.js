

var PlayerViewBaccarat=cc.Class({
    extends: require("PlayerViewCasino"),

    properties: {
       sideBetPl:"",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    getPosChipbet(typeBet){
        for(let i =0;i<this.listChipBet.length;i++){
            if(this.listChipBet[i].typeBet===typeBet)
            return this.listChipBet[i].listChip[0].node.position;
        }
    },
    start () {

    },

    // update (dt) {},
});
