
cc.Class({
    extends: cc.Component,

    properties: {
       listSprite:[cc.SpriteFrame],
       lbChip:cc.Label
    },

    // setInfo(target1 , target2 , delay , numChip , rd){
    //     cc.NGWlog('khoi tao chip return');
    //     this.node.getComponent(cc.Sprite).spriteFrame = this.listSprite[rd];
    //     this.node.runAction( cc.sequence(cc.delayTime(0.3),cc.moveTo(0.7 , target1).easing(cc.easeIn(1)),cc.callFunc(()=>{ 
    //         this.lbChip.string  = require('GameManager').getInstance().formatMoney(numChip);
    //         this.lbChip.node.getParent().active = true;
    //     })  ,cc.delayTime(delay) , cc.callFunc(()=>{ 
    //         this.lbChip.node.getParent().active = false;
    //         setTimeout(()=>{
    //             if(this.node == null) return;
    //             require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
    //         },1000);
    //     }) , cc.moveTo(1 ,target2).easing(cc.easeIn(1)) , cc.removeSelf()))
    //     let numduration = delay + 2;
    //     return numduration;
    // },

    setInfo (target1 , target2 , delay , numChip , rd){
        cc.NGWlog('!> khoi tao chip effect cua LVD SF');
        this.node.position = cc.v2(0,120);
        cc.NGWlog('!> tg1,tg2',target1,target2);
        this.node.getComponent(cc.Sprite).spriteFrame = this.listSprite[rd];
        this.node.setScale(0.8,0.8);
        this.lbChip.node.getParent().active = true;
        this.lbChip.node.getParent().opacity = 0;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(0.5),
                // cc.moveTo(0.4,cc.v2(target1.x/2,180)).easing(cc.easeCubicActionOut()),
                // cc.moveTo(0.6,cc.v2(target1.x,target1.y-50)).easing(cc.easeCubicActionOut(2)),
                cc.moveTo(0.6,cc.v2(target1.x,target1.y-40)).easing(cc.easeCubicActionOut()),
                cc.callFunc(()=>{
                    this.lbChip.string  = require('GameManager').getInstance().formatMoney(numChip);
                    this.lbChip.node.getParent().active = true;
                    this.lbChip.node.getParent().runAction(cc.fadeIn(0.4));
                }),
                cc.delayTime(delay),
                cc.callFunc(()=>{
                    this.lbChip.node.getParent().active = false;
                    setTimeout(()=>{
                        if(this.node == null) return;
                        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
                    },1000);
                }),
                cc.moveTo(1,target2).easing(cc.easeCubicActionOut()),
                cc.removeSelf(),
            )
        );

        this.node.runAction(
            cc.sequence(
                cc.delayTime(0.5),
                // cc.scaleTo(0.4,0.6).easing(cc.easeCubicActionOut()),
                // cc.scaleTo(0.6,1).easing(cc.easeCubicActionOut()),
                cc.scaleTo(0.3,1.4),
                cc.scaleTo(0.3,1).easing(cc.easeCubicActionIn()),
                cc.delayTime(delay),
                cc.scaleTo(1,0.5).easing(cc.easeCubicActionOut()),
            )
        );
        let numduration = delay + 2;
        return numduration;
    },
});
