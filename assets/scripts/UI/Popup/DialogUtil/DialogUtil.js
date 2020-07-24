
cc.Class({
    extends: require('PopupEffect'),

    properties: {
        lbContent: {
            default: null,
            type: cc.Label,
        },
        lbContent1: cc.Label,

        listButton: {
            default: [],
            type: [cc.Button]
        },
        listButtonName: {
            default: [],
            type: [cc.Label]
        },
        dialogType: null,
        functionCallback_1: null,
        functionCallback_2: null,
        functionCallback_3: null,

    },

    // LIFE-CYCLE CALLBACKS:

    setContent(strContent) {
        this.lbContent.string = strContent;
        this.onPopOn();
    },
    setType(dialType) {
        this.dialogType = dialType;
        this.listButton[1].node.active = false;
        this.listButton[2].node.active = false;
        this.lbContent1.node.active = false;

        switch (this.dialogType) {
            case DIALOG_TYPE.TWO_BTN:
                this.listButton[0].node.active = true;
                this.listButton[1].node.active = true;
                this.listButton[1].node.x = this.listButton[0].node.width * .5 + 10;
                this.listButton[0].node.x = -this.listButton[0].node.width * .5 - 10;
                break;
            case DIALOG_TYPE.THREE_BTN:
                this.listButton[0].node.active = true;
                this.listButton[1].node.active = true;
                this.listButton[2].node.active = true;

                this.listButton[2].node.x = this.listButton[0].node.width + 10;
                this.listButton[1].node.x = 0;
                this.listButton[0].node.x = -this.listButton[0].node.width - 10;
                break;
            case DIALOG_TYPE.NO_BTN:
                this.listButton[0].node.active = false;
                break;
            default:
                this.listButton[0].node.active = true;
                this.listButton[0].node.x = 0;
                break;
        }


    },

    setNameButton(nameBtn1, nameBtn2 = '', nameBtn3 = '') {
        this.listButtonName[0].string = nameBtn1;
        if (nameBtn2 !== '') {
            this.listButtonName[1].string = nameBtn2;
        }
        if (nameBtn3 !== '') {
            this.listButtonName[2].string = nameBtn3;
        }
        cc.NGWlog("name btn1-2-3=" + this.listButtonName[0].string + '-' + this.listButtonName[1].string + "-" + this.listButtonName[2].string);
    },

    setFunctionCallBack(func1, func2 = null, func3 = null) {
        this.functionCallback_1 = func1;
        if (func2 !== null) {
            this.functionCallback_2 = func2;

        }
        if (func3 !== null) {
            this.functionCallback_3 = func3;

        }
    },
    setFunctionDelay(time, func, isCountDown = true) {
        let timeDel = time;
        let text2 = require("GameManager").getInstance().getTextConfig("txt_seccond");
        if (isCountDown) {
            this.lbContent1.node.active = true;
            this.lbContent1.string = text2.replace("%s", time)
        }
        this.lbContent.node.runAction(cc.repeat(cc.sequence(cc.delayTime(1),
            cc.callFunc(() => {
                timeDel--;
                let timeText = timeDel > 0 ? timeDel : 0;
                if (isCountDown) {
                    this.lbContent1.string = text2.replace("%s", timeText)
                }
                if (timeDel <= 0) {
                    func.call();
                    this.node.destroy();
                }
            })), time));
    },
    setDelayTime(timeDelay, indexFunc) {
        if (timeDelay < 0) return;
        var timeAction = timeDelay;
        switch (indexFunc) {
            case 1:
                if (this.listButton[0].activeInHierarchy === false) return;
                var str = this.listButtonName[0].string;
                this.listButtonName[0].string = str + "(" + timeAction.valueOf() + ")";
                this.node.runAction(cc.repeat(cc.sequence(cc.delayTime(1.0), cc.callFunc(() => {
                    timeAction--;
                    this.listButtonName[0].string = str + "(" + timeAction.valueOf() + ")";
                    if (timeAction <= 0) {
                        this.onClickBtn1();
                    }
                })), timeAction));
                break;

            case 2:
                if (this.listButton[1].activeInHierarchy === false) return;
                var str = this.listButtonName[1].string;
                this.listButtonName[1].string = str + "(" + timeAction.valueOf() + ")";
                this.node.runAction(cc.repeat(cc.sequence(cc.delayTime(1.0), cc.callFunc(() => {
                    timeAction--;
                    this.listButtonName[1].string = str + "(" + timeAction.valueOf() + ")";
                    if (timeAction <= 0) {
                        this.onClickBtn1();
                    }
                })), timeAction));
                break;

            case 3:
                if (this.listButton[2].activeInHierarchy === false) return;
                var str = this.listButtonName[2].string;
                this.listButtonName[2].string = str + "(" + timeAction.valueOf() + ")";
                this.node.runAction(cc.repeat(cc.sequence(cc.delayTime(1.0), cc.callFunc(() => {
                    timeAction--;
                    this.listButtonName[2].string = str + "(" + timeAction.valueOf() + ")";
                    if (timeAction <= 0) {
                        this.onClickBtn1();
                    }
                })), timeAction));
                break;

            default:
                this.node.runAction(cc.repeat(cc.sequence(cc.delayTime(1.0), cc.callFunc(() => {
                    timeAction--;
                    if (timeAction <= 0) {
                        this.onClose();
                    }
                })), timeAction));
                break;
        }
    },

    onClickBtn1() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDialog_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.functionCallback_1 !== null)
            this.functionCallback_1.call();
        cc.NGWlog('click vao btn_1')
        this.onClose();
    },
    onClickBtn2() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDialog_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.functionCallback_2 !== null)
            this.functionCallback_2.call();
        this.onClose();
    },
    onClickBtn3() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDialog_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.functionCallback_3 !== null)
            this.functionCallback_3.call();
        this.onClose();
    },

    autoClose(num, text = require("GameManager").getInstance().getTextConfig("ok")) {
        // Auto hide
        this.listButtonName[0].fontSize = 30;
        let repeat = cc.repeat(cc.sequence(cc.callFunc(() => {
            this.setNameButton(`(${num})${text}`);
            num--;
            if (num < 0) {
                this.onPopOff(true);
                this.node.stopAllActions();
            }
        }), cc.delayTime(1)), num + 1);
        this.node.runAction(repeat);
    },

    onClose() {
        this.onPopOff(true)
        require('SoundManager1').instance.playButton();
        //  require('UIManager').instance.onHideLoad();
    },

});



