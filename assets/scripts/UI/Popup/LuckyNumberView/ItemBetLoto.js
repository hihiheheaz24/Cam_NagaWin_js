cc.Class({
    extends: cc.Component,

    properties: {
       lb_number : {
           default : null,
           type : cc.Label
       },
       lb_chipbet : {
           default : null,
           type : cc.Label
       },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    init(data, i){
        cc.log('load data bet lototototto');
        this.lb_number.string = data.StrNumber;
        this.lb_chipbet.string = 'Bet ' + data.ChipsBet + ' Chip'
        this.id = data.Id;
        this.type = data.TypeLottery;

        if(i % 2 !== 0) this.getComponent(cc.Sprite).enabled = false;
        if(this.type !==2){
            this.lb_number.font = '';
            this.lb_number.fontSize = 40;
            this.lb_number.lineHeight = 72;
        }
       
    },
    onCLickEarse(){
        require('GameManager').getInstance().onShowWarningDialog(
            'Do you want to delete? If deleted you will lose 10% of the money',
            DIALOG_TYPE.TWO_BTN,
            'Yes',
            () => {
                require('NetworkManager').getInstance().sendDeleteBet(this.id,this.type);
                require('NetworkManager').getInstance().getMyNumber(this.type);
                require('SoundManager1').instance.playButton();
            },
            'No'
        );
        require('SoundManager1').instance.playButton();
    },

    // update (dt) {},
});
