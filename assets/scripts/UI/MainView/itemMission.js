cc.Class({
    extends: cc.Component,

    properties: {
        lbText: {
            default: null,
            type: cc.Label
        },

        lbTitle: {
            default: null,
            type: cc.Label
        },
        lbChipGift: {
            default: null,
            type: cc.Label
        },
        bkgMission: {
            default: null,
            type: cc.Node
        },
        bkgInfo: {
            default: null,
            type: cc.Node
        },
        sprBkg: {
            default: [],
            type: [cc.SpriteFrame]
        },
        sprBkgInfo: {
            default: [],
            type: [cc.SpriteFrame]
        },
        BkgTextCode: {
            default: null,
            type: cc.Node
        },
        lbCode: {
            default: null,
            type: cc.Label
        },
        lbInfo: {
            default: null,
            type: cc.Label
        },
        lbReward: {
            default: null,
            type: cc.Label
        },
        lb_yourCodeInfo: {
            default: null,
            type: cc.Label
        },
        imgInfo: {
            default: null,
            type: cc.Node
        },
        bgk_ImgShare: {
            default: null,
            type: cc.Sprite
        },
        btn1: {
            default: null,
            type: cc.Button
        },
        btn2: {
            default: null,
            type: cc.Button
        },
        listImgInfo: {
            default: [],
            type: [cc.SpriteFrame]
        },
        missionType: 0,
        itemSize: cc.v2(0, 0),
        clickCount: 0

    },


    // onLoad () {},

    start() {
        this.itemSize.x = this.node.width;
        this.itemSize.y = this.node.height;
        this.oriSize = this.sprBkg[0].getOriginalSize();
        cc.NGWlog('size=' + this.itemSize.x);
    },
    init(title, text, chip) {

        this.lbText.string = text;
        this.lbTitle.string = title;
        this.lbChipGift.string = chip;
        switch (title) {
            case require('GameManager').getInstance().getTextConfig('txt_verify'):
                this.bkgMission.getComponent(cc.Sprite).spriteFrame = this.sprBkg[0];
                break;
            case require('GameManager').getInstance().getTextConfig('txt_share_code'):
                this.BkgTextCode.active = true;
                this.bkgMission.getComponent(cc.Sprite).spriteFrame = this.sprBkg[1];
                this.lbCode.string = require('GameManager').getInstance().user.id;
                this.missionType = 1;
                break;
            case require('GameManager').getInstance().getTextConfig('txt_contact_admin'):
                this.lbText.node.position = cc.v2(this.lbText.node.position.x, this.lbText.node.position.y - 10);
                this.bkgMission.getComponent(cc.Sprite).spriteFrame = this.sprBkg[2];
                this.missionType = 2;
                break;
            case require('GameManager').getInstance().getTextConfig('txt_share_photo'):
                this.missionType = 3;
                this.bkgMission.getComponent(cc.Sprite).spriteFrame = this.sprBkg[3];
                break;

        }

    },
    onClickMission() {
        require('SoundManager1').instance.playButton();
        if (this.clickCount !== 0) {
            this.clickCount = 0;
            cc.NGWlog('chay vao day');
            this.clickCount = 0;
            this.node.width = this.oriSize.width;
            this.bkgInfo.active = false;
            return;
        }
        Global.MissionView.onClickMission(this.missionType);
        if (this.missionType !== 0) {
            if (this.missionType === 2) {
                this.contactAdmin();
            } else {
                if (this.clickCount === 0) {
                    this.clickCount++;
                    this.node.setContentSize(cc.size(this.node.width + this.bkgInfo.width - 30, this.node.height));
                    this.bkgInfo.getComponent(cc.Sprite).spriteFrame = this.sprBkgInfo[this.missionType - 1];
                    this.bkgInfo.active = true;
                }
            }

        } else {
            this.onClickVerify();
        }
        switch (this.missionType) {
            case 0:
                Global.MissionView.scollView.scrollToLeft(0.1);
                break;
            case 1:
                Global.MissionView.scollView.scrollToLeft(0.1);
                this.lb_yourCodeInfo.node.getParent().active = true;
                this.lb_yourCodeInfo.node.getParent().position = cc.v2(204, -15);
                this.btn1.node.active = true;
                this.btn2.node.active = true;
                this.lbInfo.node.position = cc.v2(237, 152);

                let txtInfo = require('GameManager').getInstance().getTextConfig('txt_key_share_code');
                this.lbInfo.string = txtInfo;

                this.btn1.node.position = cc.v2(186, this.bkgInfo.y - 80);
                this.btn2.node.position = cc.v2(this.btn1.node.x, this.btn1.node.y - 80);
                this.lbReward.node.active = true;
                this.lb_yourCodeInfo.string = require('GameManager').getInstance().user.id;

                let textReward = require('GameManager').getInstance().getTextConfig('txt_node_share_code');
                textReward = cc.js.formatStr(require('GameManager').getInstance().getTextConfig('txt_node_share_code'), require("GameManager").getInstance().agInvite, require("GameManager").getInstance().agInviteFr)
                this.lbReward.string = textReward;
                break;
            case 3:
                Global.MissionView.scollView.scrollToRight(0.1);
                this.imgInfo.active = true;
                //this.bgk_ImgShare.node.active = true;
                this.btn1.node.active = true;
                this.btn1.node.position = cc.v2(this.imgInfo.x, this.imgInfo.y - 145);
                this.btn1.node.setContentSize(cc.size(250, 80));
                this.lbInfo.node.setContentSize(cc.size(470, 40));
                this.lbInfo.node.position = cc.v2(this.btn1.node.x - 15, this.btn1.node.y - 90);
                this.lbInfo.fontSize = 20;
                this.btn1.node.getChildByName('lbBtn1').getComponent(cc.Label).string = require('GameManager').getInstance().getTextConfig('txt_share_photo');
                this.btn1.node.getChildByName('lbBtn1').position = cc.v2(0, 0);
                this.btn1.getComponent(cc.Sprite).spriteFrame = this.sprBkgInfo[1];
                //this.lbReward.string = require('GameManager').getInstance().getTextConfig('txt_node_share_photo');
                this.lbInfo.string = cc.js.formatStr(require('GameManager').getInstance().getTextConfig('txt_key_share_photo'), require("GameManager").getInstance().agShareImg)
                    //this.lbInfo.node.width = 400;
                break;
        }

    },
    onClickButton(envent, data) {
        data = parseInt(data);
        switch (this.missionType) {
            case 0:
                break;
            case 1:
                if (data === 1) this.shareCodeFB(this.listImgInfo[0]);
                else this.shareCodeMessage(require('GameManager').getInstance().user.id);
                break;
            case 2:
                this.contactAdmin();
                break;
            case 3:
                this.sharePhoto();
        }
    },

    onClickVerify() {
        require('SoundManager1').instance.playButton();
        if (cc.sys.isNative) {
            cc.NGWlog('verify phone number deeeeeeee');
            Global.MainView.onClickVerifySDT();
        }
    },
    sharePhoto() {
        Global.MissionView.sharePhoto();
    },
    shareCodeFB(img) {
        cc.NGWlog('Share Code fb!!!');
        Global.MissionView.shareCodeFB(img);
    },
    shareCodeMessage(yourCode) {
        cc.NGWlog('Share Code message!!!');
        Global.MissionView.shareCodeMessage(yourCode);
    },
    contactAdmin() {
        Global.MissionView.contactAdmin();
    },


});