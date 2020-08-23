cc.Class({
    extends: cc.Component,

    properties: {
        scollView: {
            default: null,
            type: cc.ScrollView
        },
        itemMission: {
            default: null,
            type: cc.Prefab
        },
        lbChip: {
            default: null,
            type: cc.Label
        },
        listItemMission: [],
        cameraMan: {
            default: null,
            type: require('textureRenderNode')
        },
        textureNode: {
            default: null,
            type: cc.Node
        },
        bkgNotification: {
            default: null,
            type: cc.Node
        },
        lbNoti: {
            default: null,
            type: cc.Label
        },
        lbID: {
            default: null,
            type: cc.Label
        },
        avt: {
            default: null,
            type: cc.Sprite
        },
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    setInfo() {
        this.initData();
        this.is_login_fb = require('ConfigManager').getInstance().is_login_fb;
        this.textureNode.active = false;
    },

    initData() {
        for(let i=0;i<this.scollView.content.children.length;i++){
            this.scollView.content.children[i].destroy();
        }
        this.scollView.content.removeAllChildren();
        this.listItemMission=[];
        let chipAg = require('GameManager').getInstance().user.ag;
        this.lbChip.string = require('GameManager').getInstance().formatNumber(chipAg);
        this.lbID.string = 'ID:' + require('GameManager').getInstance().user.id;

        let idAva = require('GameManager').getInstance().user.avtId;
        // let name = require('GameManager').getInstance().user.uname;
        let name = require('GameManager').getInstance().user.tinyURL;
        let vip = require('GameManager').getInstance().user.vip;
        this.avt.node.getComponent("AvatarItem").loadTexture(idAva, name,null,vip);

        let listSize = ['shareImage', 'contactAdmin'];

        if (require("GameManager").getInstance().ismaiv === true) {
            listSize.push('shareCode');
        }

        if (require('GameManager').getInstance().isVerifyMobile === true && require('GameManager').getInstance().number_verify === "") {
            listSize.push('isVerify');
        }

        if (!cc.sys.isNative) {
            for (let i = 0; i < listSize.length; i++) {
                if (listSize[i] === 'isVerify') {
                    listSize.splice(i, 1);
                    i--;
                }
            }
        }

        if (listSize.length === 3) {
            this.scollView.content.getComponent(cc.Layout).paddingLeft = 100;
            this.scollView.content.getComponent(cc.Layout).spacingX = 60;
        } else if (listSize.length === 2) {
            this.scollView.content.getComponent(cc.Layout).paddingLeft = 250;
            this.scollView.content.getComponent(cc.Layout).spacingX = 60;
        }
        cc.NGWlog('list size=' + listSize.length);
        let title = '';
        let text = '';
        let chip = '';
        for (let i = 0; i < listSize.length; i++) {
            let itemMission = cc.instantiate(this.itemMission).getComponent('itemMission');
            switch (i) {
                case 3:
                    title = require('GameManager').getInstance().getTextConfig('txt_verify');
                    text = require('GameManager').getInstance().getTextConfig('txt_info_verify');
                    chip = require("GameManager").getInstance().agVerify + '';
                    break;
                case 2:
                    title = require('GameManager').getInstance().getTextConfig('txt_share_code');
                    text = require('GameManager').getInstance().getTextConfig('txt_info_share_code');
                    chip = require("GameManager").getInstance().agInvite + '';
                    break;
                case 1:
                    title = require('GameManager').getInstance().getTextConfig('txt_contact_admin');
                    text = require('GameManager').getInstance().getTextConfig('txt_info_contact');
                    chip = require("GameManager").getInstance().agContactAd + '';
                    break;
                case 0:
                    title = require('GameManager').getInstance().getTextConfig('txt_share_photo');
                    text = require('GameManager').getInstance().getTextConfig('txt_info_share_photo');
                    chip = require("GameManager").getInstance().agShareImg + '';
                    break;
            }
            itemMission.init(title, text, chip);
            this.listItemMission.push(itemMission);
            this.scollView.content.addChild(itemMission.node);
            this.node.position = cc.v2(0, 0);
        }

    },

    onMoveDown() {
        cc.NGWlog('Mission move down');
        let acMoveIn = cc.moveTo(0.3, 0, 0).easing(cc.easeBackInOut());
        // this.node.runAction(acMoveIn);

    },

    onClose() {
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },

    onClickMission(missionType) {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowMission_%s", require('GameManager').getInstance().getCurrentSceneName()));
        for (let i = 0; i < this.listItemMission.length; i++) {
            if (missionType !== this.listItemMission[i].missionType) {
                this.listItemMission[i].clickCount = 0;
            }
            this.listItemMission[i].bkgInfo.active = false;
            this.listItemMission[i].node.width = this.listItemMission[i].oriSize.width;

        }
    },

    sharePhoto() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSharePhoto_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (cc.sys.isNative || cc.sys.isBrowser) {
            if (!this.is_login_fb) {
                this.bkgNotification.active = true;
                this.lbNoti.string = require('GameManager').getInstance().getTextConfig('can_dang_nhap_face');
            } else {
                if (cc.sys.isBrowser) {
                    require("GameManager").getInstance().onShareFacebook();
                    return;
                }
                cc.NGWlog('goi den ham share photo missionView');
                //this.textureNode.position = cc.v2(-1000, -1000);
                this.bkgNotification.active = false;
                this.textureNode.active = true;
                this.textureNode.getComponent(cc.Sprite).spriteFrame = this.spriteFrame;
                this.textureNode.setScale(cc.winSize.width / 1280, cc.winSize.height / 720);
                this.textureNode.getChildByName('lb_id').active = false;
                this.cameraMan.takeNodeShot();
                this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(() => { this.textureNode.active = false; })));
            }
        }
    },

    shareCodeFB(img) {
        if (!img || typeof(img) === 'undefined') return;
        require('SoundManager1').instance.playButton();
        if (!this.is_login_fb) {
            this.bkgNotification.active = true;
            this.lbNoti.string = require('GameManager').getInstance().getTextConfig('can_dang_nhap_face');
        } else {
            this.bkgNotification.active = false;
            this.textureNode.active = true;
            this.textureNode.getComponent(cc.Sprite).spriteFrame = img;
            this.textureNode.setScale(cc.winSize.width / 1280, cc.winSize.height / 720);
            this.textureNode.getChildByName('lb_id').active = true;
            this.textureNode.getChildByName('lb_id').getComponent(cc.Label).string = require('GameManager').getInstance().user.id + '';
            this.cameraMan.takeNodeShot();
            this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(() => { this.textureNode.active = false; })));

            // let imgNode = new cc.Node('imgNode');
            // let sp = imgNode.addComponent(cc.Sprite);
            // sp.spriteFrame = img;
            // let sprSize = img.getOriginalSize();
            // cc.NGWlog('img size=' + sprSize.x);
            // imgNode.setContentSize(cc.size(img.getOriginalSize().width, img.getOriginalSize().height));
            // let lbCode = new cc.Node('yourID');
            // let str = lbCode.addComponent(cc.Label);
            // str.string = require('GameManager').getInstance().user.id;
            // str.fontSize = 60;
            // str.lineHeight = 80;
            // imgNode.addChild(lbCode);
            // lbCode.position = cc.v2(-340, 90);
            // this.node.addChild(imgNode);
            // imgNode.position = cc.v2(0, 0);
            // require('UIManager').instance.onTakeNodeSnapShot(imgNode);
        }
    },

    shareCodeMessage(yourCode) {
        cc.NGWlog(require('GameManager').getInstance().getTextConfig('txt_sharesms') + yourCode);
        require('SoundManager1').instance.playButton();
        require('Util').shareCodeMessage(require('GameManager').getInstance().getTextConfig('txt_sharesms') + yourCode);
    },

    onClickConfirmNoti() {
        require('SoundManager1').instance.playButton();
        this.bkgNotification.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickConfirm_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    contactAdmin() {
        require('SoundManager1').instance.playButton();
        cc.NGWlog('Contact admin!!!!');
        // if (cc.sys.isNative) {
        // if (!this.is_login_fb) {
        //     this.bkgNotification.active = true;
        //     this.lbNoti.string = require('GameManager').getInstance().getTextConfig('can_dang_nhap_face');
        // } else {
        this.bkgNotification.active = false;
        Global.MainView.onClickChatAdmin();
        // }

        // }
    },

    onClickShop() {
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onShowShop();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.PAYMENT);
    }

});