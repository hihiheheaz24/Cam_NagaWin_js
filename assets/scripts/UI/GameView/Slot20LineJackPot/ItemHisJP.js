

cc.Class({
    extends: cc.Component,

    properties: {
        lb_UserId:cc.Label,
        lb_UserName:cc.Label,
        lb_ChipBet:cc.Label,
        lb_ChipWin:cc.Label,
        lb_Time:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lb_Time.node.on("size-changed",()=>{
            this.node.height=this.lb_Time.node.height;
        });
    },

    start () {

    },
    init(data){
        this.lb_UserId.string=data.userID;
        let userName=data.userName;
        if (userName.length > 15) {
            userName = userName.substring(0, 12) + '...';
          }        
          this.lb_UserName.string=userName;
        this.lb_ChipWin.string= require("GameManager").getInstance().formatMoney(data.reward);
        this.lb_ChipBet.string= require("GameManager").getInstance().formatMoney(data.chipBet);
        this.lb_Time.string= this.getTime(data.timeWin);

    },
    getTime(time){
        let timeWin= new Date(time);
        let lbDate=timeWin.getDate();
        let lbMonth= timeWin.getMonth();
        let lbYear= timeWin.getFullYear();
        let lbHour= timeWin.getHours();
        let lbMinute= timeWin.getMinutes();
        let lbSeccond= timeWin.getSeconds();
        let timeReturn= lbDate+"/"+lbMonth+"/"+lbYear +"\n"+lbHour+":"+lbMinute+":"+lbSeccond;
        cc.NGWlog("SLOTJP:timeReturn==="+timeReturn);
        return timeReturn;
    }
    // update (dt) {},
});
