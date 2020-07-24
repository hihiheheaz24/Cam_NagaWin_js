
var PopupEffect = cc.Class({
    extends: cc.Component,

    properties: {
        bkg: {
            default: null,
            type: cc.Node
        },
        // mask: {
        //     default: null,
        //     type: cc.Node
        // },
        posOutScr: {
            default: new cc.Vec2()
        },
        posInScr: {
            default: new cc.Vec2()
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.node.setTag(TAG.POPUP);
         if(this.node.name==="DialogUtil") {
             cc.log("DIALOG");
             this.node.zIndex=DIALOG_ZINDEX;
         }
         else this.node.zIndex=POPUP_ZINDEX;
     },


    onPopOn(opa=255) {
        this.bkg.scale = 0.8;
        this.bkg.opacity = 200;
        let acScaleOut = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
        let acFadeOut = cc.fadeTo(0.1, opa);
        this.bkg.stopAllActions();
        this.bkg.runAction(cc.spawn(acScaleOut, acFadeOut));

    },
    onPopOff(isDestroy = false, isActive = false) {

        let acScaleOut = cc.scaleTo(0.1, 0.8).easing(cc.easeBackIn());
        let acFadeOut = cc.fadeTo(0.1, 120).easing(cc.easeCircleActionIn());
        this.bkg.stopAllActions();
        this.bkg.runAction(cc.spawn(acScaleOut, acFadeOut));
        if (isActive) {
            this.scheduleOnce(() => {
                this.node.active=false;
            }, 0.1);
            return;
        }
        this.scheduleOnce(() => {
            if (!isDestroy) {
                this.node.removeFromParent(false);
            }
            else {
                this.node.destroy();
            };
        }, 0.1)

    },
    onMoveUp() {
        this.bkg.position = this.posOutScr;
        this.bkg.stopAllActions();
        this.bkg.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
    }

    // update (dt) {},
});
module.exports = PopupEffect;
