// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        spIcStatus : cc.Sprite,
        listSprite:[cc.SpriteFrame],
        lbChip:cc.Label,
        theFirst:0,
    },

    onLoad(){
        this.chip = 0;
        this.status = '';
    },
    // onLoad () {},
    setInfo(chipBet = 0 , status){
        this.chip = parseInt(chipBet);
        cc.NGWlog('so chip set dc la=========' +  this.chip );
        this.status = status;
        if(this.chip == 0){
            this.node.getComponent(cc.Sprite).enabled = false;
            this.lbChip.string ='';
        }else{
            if(!this.node.getComponent(cc.Sprite).enabled) this.node.getComponent(cc.Sprite).enabled = true;
            this.lbChip.string = require('GameManager').getInstance().formatMoney(chipBet);
        }
        
        switch(status){
            case 'Allin':
                this.spIcStatus.spriteFrame = this.listSprite[0];
                //this.node.getComponent(cc.Sprite).enabled = false;
                //this.lbChip.string = '';
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.allinAudio);
                break;
            case 'Raise':
                this.spIcStatus.spriteFrame = this.listSprite[1];
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_bet);
                break;
            case 'Call':
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_bet);
                if(chipBet == 0){
                    this.spIcStatus.spriteFrame = this.listSprite[3];
                }else{
                    this.spIcStatus.spriteFrame = this.listSprite[2];
                }
                break;
            case 'Check':
                this.node.getComponent(cc.Sprite).enabled = false;
                this.spIcStatus.spriteFrame = this.listSprite[3];
                break;
            case 'Fold':
                this.node.getComponent(cc.Sprite).enabled = false;
                this.lbChip.string ='';
                this.spIcStatus.spriteFrame = this.listSprite[4];
                break;
            default:
                    this.spIcStatus.spriteFrame = null
                break;
        }
    },
    offSpriteAll(){
        this.node.getComponent(cc.Sprite).enabled = false;
        this.lbChip.string = '';
    }

    // update (dt) {},
});
