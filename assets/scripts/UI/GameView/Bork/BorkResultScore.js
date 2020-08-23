

cc.Class({
    extends: cc.Component,

    properties: {
    
        bg_score: {
            default: null,
            type: cc.Sprite
        },

        lb_score: {
            default: null,
            type: cc.Label
        },

        bg_Bork: {
            default: null,
            type: sp.Skeleton
        },

        listAniBork:[sp.SkeletonData],

        bg_bonus: {
            default: null,
            type: cc.Sprite
        },
        listImgBouns:[cc.SpriteFrame],
        listImgWinlose:[cc.SpriteFrame],
        
    },
    onLoad(){
        this.lb_score.node.on('size-changed',this.changeSize,this);
    },
    changeSize(){
        let sizeWidth = this.lb_score.node.getContentSize().width;
        this.bg_score.node.setContentSize(cc.size(sizeWidth + 75 , 68));
    },
    setResult( score, rate, numCard){
        if (rate > 1) {
            this.bg_bonus.node.active = true;
            if(rate == 2){
                this.bg_bonus.spriteFrame = this.listImgBouns[0];
            }else if(rate == 3) {
                this.bg_bonus.spriteFrame = this.listImgBouns[1];
            }else{
                this.bg_bonus.spriteFrame = this.listImgBouns[2];
            }
        }else{
            this.bg_bonus.node.active = false;
        }
        if (numCard === 2) {
            if (score === 8) {
                this.bg_Bork.node.active = true;
                this.bg_Bork.skeletonData = this.listAniBork[0];
                this.bg_Bork.setAnimation(0,'animation',false);
            }
            else if (score === 9) {
                this.bg_Bork.node.active = true;
                this.bg_Bork.skeletonData = this.listAniBork[1];
                this.bg_Bork.setAnimation(0,'animation',false);
            }
            else {
                this.bg_score.node.active = true;
                this.lb_score.string = score +" "+ require('GameManager').getInstance().getTextConfig('diem');
            }
        }
        else if (numCard === 3) {
            this.bg_score.node.active = true;
            this.lb_score.string = score +" "+ require('GameManager').getInstance().getTextConfig('diem');
            if (score === 11) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_sanh');
            if (score === 12) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_tpsanh');
            if (score === 13) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_3daunguoi');
            if (score === 14) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_xam');
        }
    
    },
    resultLose(isLose){
        if(isLose){
            this.bg_score.spriteFrame = this.listImgWinlose[1];
        }
    },
    unuse(){
        this.bg_score.node.active = false;
        this.bg_Bork.node.active = false;
        this.bg_bonus.node.active = false;
        this.bg_score.spriteFrame = this.listImgWinlose[0];
    }

    

    // update (dt) {},
});
