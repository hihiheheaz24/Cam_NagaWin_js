cc.Class({
    extends : cc.Component,
    properties:{
        chip:{
            default:null,
            type:cc.Sprite,
        },
        chipSprites:{
            type:cc.SpriteFrame,
            default:[]
        }
    },
    setTextture(state){
        this.chip.spriteFrame = this.chipSprites[state]
    }
});