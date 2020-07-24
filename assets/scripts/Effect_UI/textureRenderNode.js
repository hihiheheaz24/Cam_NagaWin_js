var textureRenderNode = cc.Class({
    extends: require('textureRender'),

    properties: {
       // camera: cc.Camera,
        //_canvas: null
    },
    onLoad(){
        
    },
    start() {
    },
    takeNodeShot() {
        let _this = this;
        this.node.active = true;
        this.imgWidth= this.node.getParent().getContentSize().width;
        this.imgHeight= this.node.getParent().getContentSize().height;
        cc.NGWlog('img width height:'+this.imgWidth+' , '+this.imgHeight);
        cc.NGWlog('start take node shot');
        this.node.setContentSize = cc.v2(this.imgWidth, this.imgHeight);
        this.init();
        this.scheduleOnce(() => {
            _this.saveFile(this.texture);
        }, 1);
    },
    init() {
        this._super();
    },
    saveFile(picData) {
        // if (cc.sys.isNative) {
        //     let path= require('GameManager').getInstance().pathScreenShot;
        //     cc.NGWlog('Node snap path === ' + path);
        //     let success = jsb.saveImageData(picData, this.imgWidth, this.imgHeight,path);
        //     cc.NGWlog('--------------------------------------------------> path done     ', success);
        //     if (success) {
        //         require('Util').onShareFb(path);
        //         cc.NGWlog("save image data success, file: " + path);
        //         // if(isSendMission) 
        //           //  require('NetworkManager').getInstance().sendShareImageFb();
        //     }
        //     else {
        //         cc.error("save image data failed!");
        //     }
        // }
        this._super(picData);
    },
    
});
module.exports = textureRenderNode;