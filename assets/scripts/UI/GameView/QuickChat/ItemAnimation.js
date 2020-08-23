cc.Class({
    extends: cc.Component,

    properties: {
        animation: {
            default: null,
            type: sp.Skeleton
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {},

    // update (dt) {},

    initAnimation(skeletonData) {
        this.animation.skeletonData = skeletonData;
        this.animation.premultipliedAlpha = false;
       // this.animation.animation = "animation";
    },

    playAnimation(animation = "animation", loop = false, autoStop = true, newAction = false) {
        this.animation.node.active = true;
        this.animation.paused = false;
        this.animation.setAnimation(0, animation, loop);
        if (!newAction) {
            this.animation.node.runAction(cc.sequence(cc.delayTime(2), cc.removeSelf()));
        }
        // if(autoStop) {this.animation.setEndListener(()=>{this.stopAnimation();});}
    },
    playAnimation2(animation = "animation", loop = false) {
        this.animation.node.active = true;
        this.animation.paused = false;
        this.animation.setAnimation(0, animation, loop);
        // if(autoStop) {this.animation.setEndListener(()=>{this.stopAnimation();});}
    },

    playAnimBinh(ani = "animation", loop = false) {
        this.animation.node.opacity = 255;
        this.animation.setAnimation(0, ani, loop);
    },

    setMultiAlpha(isAlpha) {
        this.animation.premultipliedAlpha = isAlpha;
    },

    stopAnimation() {

        this.animation.node.active = false;
        this.animation.paused = true;
    }
});