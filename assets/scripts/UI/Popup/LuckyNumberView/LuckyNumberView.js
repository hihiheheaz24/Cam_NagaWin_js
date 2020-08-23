var NetworkManager = require("NetworkManager");
cc.Class({
    extends: cc.Component,

    properties: {
        //top lotp
        scr_top_loto : {
            default : null,
            type : cc.Layout
        },
        item_top_loto : {
            default : null,
            type : cc.Node
        },
        //
        //list bet
        scr_bet : {
            default : null,
            type : cc.Layout
        },
        item_bet : {
            default : null,
            type : cc.Node
        },
        edb_number_2 : {
            default : null,
            type : cc.EditBox
        },
        edb_ag_2 : {
            default : null,
            type : cc.EditBox
        },
        // historyyyy
        pre_history : {
            default : null,
            type : cc.Prefab
        },
        pre_help : {
            default : null,
            type : cc.Node
        },
        //
        main_result :{
            default : null,
            type : cc.Label
        },
        time_result : {
            default : null,
            type : cc.Label
        },
        lb_ag : {
            default : null,
            type : cc.Label
        },
        ///
        btn_2d : {
            default : null,
            type : cc.Button
        },
        btn_2d_special : {
            default : null,
            type : cc.Button
        },
        list_result : {
            default : [],
            type : cc.Label
        },
    },

    setInfo(){
        this.typeBet = -1;
        this.isClick = true;
        cc.log('chay vao loto voew');
        NetworkManager.getInstance().sendTopLoto();
        NetworkManager.getInstance().getResultLoto();
        this.onCLickTab1d();
        this.pre_history.active = false;
        this.pre_help.active = false;
        this.lb_ag.string = require('GameManager').getInstance().
        formatNumber(require('GameManager').getInstance().user.ag);
        require('UIManager').instance.onShowLoad();
    },

    onBack(){
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
    },
    loadListTopLoto(dataa){
       let data = JSON.parse(dataa);
        this.scr_top_loto.node.removeAllChildren();
        cc.log('chay vao log datatattatta ', data.length);
        for (let i = 0; i < data.length; i++) {
            const objData = data[i];
            let item = cc.instantiate(this.item_top_loto).getComponent('ItemTopLoto');
            this.scr_top_loto.node.addChild(item.node);
            item.init(objData, i+1);
            
        }
    },
    loadListBet(dataa){
        let data = JSON.parse(dataa);
        cc.log('chay vao load lisst bettttt');
        this.scr_bet.node.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            const objData = data[i];
            let item = cc.instantiate(this.item_bet).getComponent('ItemBetLoto');
            this.scr_bet.node.addChild(item.node);
            item.init(objData, i)
            
        }
    },
    loadListResult(data, time){
        require('UIManager').instance.onHideLoad();
        //let data = JSON.parse(dataa);
        cc.log('data result la : ', data);
        let arrResult = data.split(','); // split string on comma space
        console.log('data result sau khi cut la : ', arrResult.length );
        if(arrResult.length > this.list_result.length) return;
        for (let i = 0; i < arrResult.length; i++) {
            const objData = arrResult[i];
            this.list_result[i].string = objData;
        }

        this.main_result.string = arrResult[0];
        var time_ = new Date(time);
        let min = time_.getMinutes();
        let hou = time_.getHours();
        let _time1 = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min) + " " + (hou > 12 ? "pm" : "am") ;
        var _time = 'Updated: ' + time_.getFullYear() + '-' + (time_.getMonth() + 1) + '-' + time_.getDate() + ' ' +_time1;

        this.time_result.string = _time;

    },
    onClickSendBet2D(){
        require('SoundManager1').instance.playButton();
        if(this.edb_number_2.string === '') {
            require('GameManager').getInstance().onShowConfirmDialog('Please enter the number');
            return;
        }
        if(this.edb_ag_2.string === ''){
            require('GameManager').getInstance().onShowConfirmDialog('Must bet with chip bigger than 1000');
            return;
        }
        NetworkManager.getInstance().sendBetLoto(this.typeBet,this.edb_number_2.string,this.edb_ag_2.string);
        this.edb_ag_2.string = '';
        this.edb_number_2.string = '';
        NetworkManager.getInstance().getMyNumber(this.typeBet);
    },

    onCLickTab1d (event, data){
        if(!this.isClick){
            return;
        } 
        setTimeout(() => {
            this.isClick  = true;
        }, 1500);
        this.scr_bet.node.removeAllChildren();
        NetworkManager.getInstance().getMyNumber(2);
        this.isClick = false;
        this.typeBet = 2;
        //
        this.btn_2d.node.getChildByName('checkmark').active = true;
        this.btn_2d_special.node.getChildByName('checkmark').active = false;
    },
    onClickTab2d (event, data){
        if(!this.isClick){
            return;
        } 
        setTimeout(() => {
            this.isClick  = true;
        }, 1500);
        this.scr_bet.node.removeAllChildren();
        NetworkManager.getInstance().getMyNumber(1);
        this.isClick = false;
        this.typeBet =  1;
        //
        this.btn_2d.node.getChildByName('checkmark').active = false;
        this.btn_2d_special.node.getChildByName('checkmark').active = true;
    },
    onClickHis(){
        require('UIManager').instance.onShowLoad();
        NetworkManager.getInstance().getHistoryLoto();
        Global.HistoryLoto.scr_history.content.removeAllChildren();
      if(Global.HistoryLoto.node.getParent() === null){
           this.node.addChild(Global.HistoryLoto.node);
       }
       Global.HistoryLoto.setInfo();
    },
    onClickHelp(){
        this.pre_help.active = true;
        ///
        this.pre_help.scale = 0.8;
        this.pre_help.opacity = 200;
        let acScaleOut = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
        let acFadeOut = cc.fadeTo(0.1, 255);
        this.pre_help.stopAllActions();
        this.pre_help.runAction(cc.spawn(acScaleOut, acFadeOut));

    },
    onCloseHelp(){
        let acScaleOut = cc.scaleTo(0.1, 0.8).easing(cc.easeBackIn());
        let acFadeOut = cc.fadeTo(0.1, 120).easing(cc.easeCircleActionIn());
        this.pre_help.stopAllActions();
        this.pre_help.runAction(cc.spawn(acScaleOut, acFadeOut));
        this.scheduleOnce(() => {
            this.pre_help.active = false;
        }, 0.1)
    },
    onClickShop(){
        require('SoundManager1').instance.playButton();
        require("UIManager").instance.onShowShop();
    },
    editBoxTextChanged_ag2: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.edb_ag_2.string = parseInt(strTemp);
    },
    editBoxTextChanged_nb2: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.edb_number_2.string = strTemp;
    },
    // update (dt) {},
});
