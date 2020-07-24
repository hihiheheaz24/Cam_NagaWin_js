var textureRender = cc.Class({
    extends: cc.Component,

    properties: {
    //    camera: cc.Camera,
        _canvas: null,
        texture:null
    },
    start() {
    },
    takeScreenShot() {
        let _this = this;
        this.node.active = true;
        cc.NGWlog('start take screen shot');
        this.node.setContentSize = cc.v2(cc.winSize.width, cc.winSize.height);
        this.init();
        this.scheduleOnce(() => {
            // let picData = this.initImage();
            _this.saveFile(this.texture);
        }, 1);
    },
    captureinHTML() {
        var callback = () => {
            //var imageData = cc._canvas.toDataURL("image/png");
        }
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, callback);
    },
    init() {
        var gl = 0;

        if (cc.sys.isNative) {
            gl = 0x88f0;
        } else {
            gl = 0x8d48;
        }

        cc.director.setNextDeltaTimeZero(true);

        var renderScreen = new cc.RenderTexture(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888,gl);
        renderScreen.setVirtualViewport(cc.p(0, 0), cc.rect(0, 0, cc.winSize.width, cc.winSize.height), cc.rect(0, 0, cc.winSize.width, cc.winSize.height))
        renderScreen.setAutoDraw(true);
        renderScreen.beginWithClear(255, 255, 255, 0, 0, 0);
        cc.director.getRunningScene().visit();
        renderScreen.end();
        this.texture = renderScreen;

    },
    // create the img element
    initImage() {
        let data = this.texture.getSprite().getTexture()._image;
        let picData = this.filpYImage(data, this.imgWidth, this.imgHeight);
        cc.NGWlog(picData);
        return picData;
    },
    //create the canvas and context, filpY the image Data
    createSprite() {
        let width = this.texture.width;
        let height = this.texture.height;
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');

            this._canvas.width = width;
            this._canvas.height = height;
        }
        else {
            this.clearCanvas();
        }
        let ctx = this._canvas.getContext('2d');
        this.camera.render();
        let data = this.texture.readPixels();
        // write the render data
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }
        return this._canvas;
    },

    // show on the canvas
    showSprite(picData) {
        let texture = new cc.Texture2D();
        texture.initWithData(picData, 32, this._width, this._height);

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);

        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;

        node.zIndex = cc.macro.MAX_ZINDEX;
        node.parent = cc.director.getScene();
        // set position
        let width = cc.winSize.width;
        let height = cc.winSize.height;
        node.setContentSize(cc.winSize.width, cc.winSize.height);
        node.x = width / 2;
        node.y = height / 2;
        this.captureAction(node, width, height);
    },
    // sprite action
    captureAction(capture, width, height) {
        let scaleAction = cc.scaleTo(0.5, 0);
        let targetPos = cc.v2(width / 2, height / 2);
        let moveAction = cc.moveTo(0.5, targetPos);
        let spawn = cc.spawn(scaleAction, moveAction);
        capture.runAction(spawn);
        let blinkAction = cc.blink(0.1, 1);
        // scene action
        this.node.runAction(cc.sequence(blinkAction, cc.delayTime(1.0), cc.callFunc(() => { this.node.active = false; this.node.setContentSize = cc.v2(0, 0); capture.destroy(); })));
    },
    saveFile(picData) {
        if (cc.sys.isNative) {
            let path = require('GameManager').getInstance().pathScreenShot;
            cc.NGWlog('Screenshot path === ' + path);
            var image = picData.newImage();
            let success = image.saveToFile(path);
            cc.NGWlog('--------------------------------------------------> path done     ', success);
            if (success) {
                require('Util').onShareFb(path);
                cc.NGWlog("save image data success, file: " + path);
            }
            else {
                cc.NGWlog("save image data failed!");
            }
        }
    },
    filpYImage(data, width, height) {
        // create the data array
        let picData = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }
        return picData;
    },
    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
});
module.exports = textureRender;