cc.Class({
    extends: cc.Component,

    properties: {
       lb_time : {
           default : null,
           type : cc.Label
       },
       lb_number : {
           default : null,
           type : cc.Label
       },
       lb_chip : {
           default : null,
           type : cc.Label
       },
       lb_chip_won :{
           default : null,
           type : cc.Label
       },
    },
    start () {

    },
    init(data){
        var time_ = new Date(data.CreateTime);
        let min = time_.getMinutes();
        let hou = time_.getHours();
        let second = time_.getSeconds();
        let _time1 = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min) + " " + (second < 10 ? "0" + second : second) ;
        var _time = time_.getDate() + "." + (time_.getMonth() + 1) + "." + time_.getFullYear() + "\n" + _time1;

        this.lb_time.string = _time;

        this.lb_number.string = data.StrNumber;

        this.lb_chip.string = data.ChipsBet;

        this.lb_chip_won.string = data.ChipsWin;
        if(data.TypeLottery !== 2)
        this.lb_number.font = '';
    },

    // update (dt) {},
});
