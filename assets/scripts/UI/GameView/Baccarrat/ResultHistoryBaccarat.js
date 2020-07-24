cc.Class({
    extends: cc.Component,

    properties: {
        lb_His_Player: cc.Label,
        lb_His_Banker: cc.Label,
        lb_His_Tie: cc.Label,
        BaccaratAtlas: cc.SpriteAtlas,
        Tb_His_Detail: cc.Node,
        lb_His_Player_Detail: cc.Label,
        lb_His_Banker_Detail: cc.Label,
        lb_His_Tie_Detail: cc.Label,
        lb_His_PlayerPair: cc.Label,
        lb_His_BankerPair: cc.Label,
        content: cc.Node,
        itemBigRoad: cc.Node,
        old_Bread_Road: [],
        old_Big_Eye: [],
        tb_BreadRoad: {
            type: cc.Node,
            default: null
        },
        breadRoad: {
            type: cc.Node,
            default: null
        },
        tb_BigEye: cc.Node,
        hisBigEye: cc.Node,
        dataBigEyeRoad: [],
        //smaill road
        old_small_road: [],
        tb_SmallRoad: cc.Node,
        hisSmallRoad: cc.Node,
        //CockRoad road
        old_cock_road: [],
        tb_CockRoad: cc.Node,
        hisCockRoad: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.numWinB = 0;
        this.numWinP = 0;
        this.numWinT = 0;
        this.numWinPP = 0;
        this.numWinBP = 0;
        this.count = 0;
        this.index = 1;
        this.indexBigEye = 1;
        this.indexSmallRoad = 1;
        this.indexCockRoad = 1;
        this.curBigRoad = this.itemBigRoad;
        this.node.zIndex = cc.macro.MAX_ZINDEX;
        // Biến set vị trí BigBoard
        this.setup2dArray();
        this.HISTORY_LAST_VALUE = null;
        this.HISTORY_STATE_IS_VERTICAL = false;
        this.HISTORY_LAST_RESULT_COL = 0;
        this.HISTORY_LAST_RESULT_ROW = 0;
        this.HISTORY_STREAK = 1;
        this.BREAD_ROAD_CHILD = null;
        this.old_Bread_Road.push(this.tb_BreadRoad);
        this.old_Bread_Road.push(this.tb_BreadRoad);
        // Biến set vị tri Big Eye Road
        this.HISTORY_LAST_BIGEYE_VALUE = null;
        this.HISTORY_STATE_IS_VERTICAL_BIGEYE = false;
        this.HISTORY_LAST_BIGEYE_COL = 0;
        this.HISTORY_LAST_BIGEYE_ROW = 0;
        this.HISTORY_STREAK_BIGEYE = 0;
        this.BIG_EYE_CHILD = null;
        this.old_Big_Eye.push(this.hisBigEye);
        this.old_Big_Eye.push(this.hisBigEye);
        this.isChuyenCot = false;
        // Biến set vị tri SmallRoad
        this.HISTORY_LAST_SMALL_VALUE = null;
        this.HISTORY_STATE_IS_VERTICAL_SMALL = false;
        this.HISTORY_LAST_SMALL_COL = 0;
        this.HISTORY_LAST_SMALL_ROW = 0;
        this.HISTORY_STREAK_SMALL = 0;
        this.SMALL_CHILD = null;
        this.old_small_road.push(this.hisSmallRoad);
        this.old_small_road.push(this.hisSmallRoad);
        // Biến set vị tri cockRoad
        this.HISTORY_LAST_COCK_VALUE = null;
        this.HISTORY_STATE_IS_VERTICAL_COCK = false;
        this.HISTORY_LAST_COCK_COL = 0;
        this.HISTORY_LAST_COCK_ROW = 0;
        this.HISTORY_STREAK_COCK = 0;
        this.COCK_CHILD = null;
        this.old_cock_road.push(this.hisCockRoad);
        this.old_cock_road.push(this.hisCockRoad);


    },

    start() {
        this.setInfo();
    },
    tableHisDetailPopOn() {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_click);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickHistory_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.Tb_His_Detail.active) return;
        this.Tb_His_Detail.active = true;
        if (this.Tb_His_Detail.getParent() === null) {
            this.node.addChild(this.Tb_His_Detail);
        }
        this.Tb_His_Detail.getComponent("PopupEffect").onPopOn();
    },
    tableHisDetailPopOff() {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_click);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClose_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.Tb_His_Detail.getComponent("PopupEffect").onPopOff(false, true);
    },
    setInfo() {
        this.lb_His_Banker.string = this.numWinB;
        this.lb_His_Player.string = this.numWinP;
        this.lb_His_Tie.string = this.numWinT;
        this.lb_His_Player_Detail.string = this.numWinP;
        this.lb_His_Banker_Detail.string = this.numWinB;
        this.lb_His_Tie_Detail.string = this.numWinT;
        this.lb_His_PlayerPair.string = this.numWinPP;
        this.lb_His_BankerPair.string = this.numWinBP;

    },
    updateHistory(numWinB, numWinP, numWinT, numWinBP, numWinPP) {
        this.numWinB = numWinB;
        this.numWinP = numWinP;
        this.numWinT = numWinT;
        this.numWinPP = numWinPP;
        this.numWinBP = numWinBP;
        this.setInfo();
    },
    updateHistoryBigRoad(typeWin) {
        let itemHis = new cc.Node();
        let sprItemHis = itemHis.addComponent(cc.Sprite);
        sprItemHis.spriteFrame = this.getSprBigRoad(typeWin, "BigRoad");
        var numChild = this.content.childrenCount;
        if (this.count > 83) {
            if (this.count === 84 * numChild) {
                var bkgTable = new cc.Node();
                bkgTable.setContentSize(355, 153);
                bkgTable.setAnchorPoint(0, 1);
                let sprBkgTable = bkgTable.addComponent(cc.Sprite);
                sprBkgTable.spriteFrame = this.getSprBigRoad('', "BigRoad");
                bkgTable.setAnchorPoint(0, 1);
                this.content.addChild(bkgTable);
                var nodeItem = new cc.Node();
                nodeItem.setPosition(2, -2);
                nodeItem.setAnchorPoint(0, 1);
                nodeItem.setContentSize(355, 153);
                let layoutItem = nodeItem.addComponent(cc.Layout);
                layoutItem.startAxis = 1;
                layoutItem.type = 3;
                layoutItem.spacingX = 5.5;
                layoutItem.spacingY = 5.5;
                layoutItem.verticalDirection = 1;
                layoutItem.horizontalDirection = 0;
                bkgTable.addChild(nodeItem);
                this.curBigRoad = nodeItem;

            }
            this.curBigRoad.addChild(itemHis);
        } else {
            this.itemBigRoad.getChildByName("nodeItem").addChild(itemHis);
        }
        this.count++;
        let resultWin;
        switch (typeWin) {
            case TYPEWIN_BACCARAT.PLAYER:
                resultWin = 2;
                break;
            case TYPEWIN_BACCARAT.PLAYER_P:
                resultWin = 2;
                break;
            case TYPEWIN_BACCARAT.PLAYER_B:
                resultWin = 2;
                break;
            case TYPEWIN_BACCARAT.PLAYER_PB:
                resultWin = 2;
                break;
            case TYPEWIN_BACCARAT.BANKER:
                resultWin = 1;
                break;
            case TYPEWIN_BACCARAT.BANKER_P:
                resultWin = 1;
                break;
            case TYPEWIN_BACCARAT.BANKER_B:
                resultWin = 1;
                break;
            case TYPEWIN_BACCARAT.BANKER_PB:
                resultWin = 1;
                break;
            case TYPEWIN_BACCARAT.TIE:
            case TYPEWIN_BACCARAT.TIE_P:
            case TYPEWIN_BACCARAT.TIE_B:
            case TYPEWIN_BACCARAT.TIE_PB:
                resultWin = 3;
                break;
        }
        this.getPositionToInsertSprite(resultWin, typeWin);
    },
    getSprBigRoad(typeWin, table) {
        let spr;
        let spritNameFrefix = "";
        let sprName = "";
        switch (table) {
            case "BigRoad":
                spritNameFrefix = "BigRoad";
                break;
            case "BreadRoad":
                spritNameFrefix = "BreadRoad";
                break;
            case "CockRoad":
                spritNameFrefix = "CockRoad";
                break;
            case "SmallRoad":
                spritNameFrefix = "SmallRoad";
                break;
            case "BigEye":
                spritNameFrefix = "BigEye";
                break;
            case "cockroad":
                spritNameFrefix = "cockroad";
                break;
        }
        switch (typeWin) {
            case TYPEWIN_BACCARAT.PLAYER:
                sprName = "_P";
                break;
            case TYPEWIN_BACCARAT.PLAYER_P:
                sprName = "_P_P";
                break;
            case TYPEWIN_BACCARAT.PLAYER_B:
                sprName = "_P_B";
                break;
            case TYPEWIN_BACCARAT.PLAYER_PB:
                sprName = "_P_PB";
                break;
            case TYPEWIN_BACCARAT.BANKER:
                sprName = "_B";
                break;
            case TYPEWIN_BACCARAT.BANKER_P:
                sprName = "_B_P";
                break;
            case TYPEWIN_BACCARAT.BANKER_B:
                sprName = "_B_B";
                break;
            case TYPEWIN_BACCARAT.BANKER_PB:
                sprName = "_B_PB";
                break;
            case TYPEWIN_BACCARAT.TIE:
            case TYPEWIN_BACCARAT.TIE_P:
            case TYPEWIN_BACCARAT.TIE_B:
            case TYPEWIN_BACCARAT.TIE_PB:
                sprName = "_T";
                break;
        }
        //cc.NGWlog("Baccarat:updateHistoryBigRoad:Spr Name="+spritNameFrefix + sprName);
        spr = this.BaccaratAtlas.getSpriteFrame(spritNameFrefix + sprName);
        return spr;
    },
    convertArrayIndexToPosition(row, col, typeTable) {
        switch (typeTable) {
            case "BreadRoad":
                {
                    let indexCol = 0;
                    let indexRow = 0;
                    // >95 - 96
                    if (this.HISTORY_LAST_RESULT_COL >= 32 * (this.index)) row -= 32 * (this.index);
                    if (row === 0) indexRow = 3.5;
                    if (col === 0) indexCol = 3.5;
                    return cc.v2((row * 23.7 + indexRow), (col * -26.3 - indexCol));
                }
            case "BigEye":
                {
                    let indexCol = 0;
                    let indexRow = 0;
                    if (this.HISTORY_LAST_BIGEYE_COL >= 64 * (this.indexBigEye)) row -= 64 * (this.indexBigEye);
                    if (row % 2 !== 0) indexRow = 0.3;
                    if (row === 0) indexRow = 2;
                    if (col === 0) indexCol = 2;
                    return cc.v2((row * 11.8 + indexRow), (col * -13 - indexCol));
                }
            case "SmallRoad":
                {
                    let indexCol = 0;
                    let indexRow = 0;
                    if (this.HISTORY_LAST_SMALL_COL >= 30 * (this.indexSmallRoad)) row -= 30 * (this.indexSmallRoad);
                    if (row % 2 !== 0) indexRow = 0.3;
                    if (row === 0) indexRow = 2;
                    if (col === 0) indexCol = 2;
                    return cc.v2((row * 11.8 + indexRow), (col * -13 - indexCol));
                }
            case "CockRoad":
                {
                    let indexCol = 0;
                    let indexRow = 0;
                    if (this.HISTORY_LAST_COCK_COL >= 30 * (this.indexCockRoad)) row -= 30 * (this.indexCockRoad);
                    if (row % 2 !== 0) indexRow = 0.3;
                    if (row === 0) indexRow = 2;
                    if (col === 0) indexCol = 2;
                    return cc.v2((row * 11.8 + indexRow), (col * -13 - indexCol));
                }
        }
    },
    getPositionToInsertSprite(result, typeWin) {
        result = parseInt(result);
        // if item fist = tie
        if (result == 3 && this.HISTORY_LAST_VALUE == null) {
            this.HISTORY_LAST_VALUE == null
            return;
        }
        //First Time Running 
        if (this.HISTORY_LAST_VALUE == null) {
            this.HISTORY_LAST_RESULT_ROW = 0;
            this.HISTORY_LAST_RESULT_COL = 0;
            this.HISTORY_LAST_VALUE = result;
            this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
        } else {
            // Nếu kết quả hòa
            if (result == 3) {
                let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_RESULT_COL, this.HISTORY_LAST_RESULT_ROW, "");
                this.setPositionSpriteHistory(result, typeWin);
                return;
            }
            // Kết quả giống ván trước
            if (result == this.HISTORY_LAST_VALUE) {
                this.isChuyenCot = false;
                if (this.HISTORY_STREAK == 1) {
                    this.HISTORY_STATE_IS_VERTICAL = true;
                }
                this.HISTORY_STREAK++;
                if (this.HISTORY_STATE_IS_VERTICAL) {
                    if (this.HISTORY_LAST_RESULT_ROW >= 5 || this.historyArray[this.HISTORY_LAST_RESULT_ROW + 1][this.HISTORY_LAST_RESULT_COL] == 1) {
                        this.HISTORY_STATE_IS_VERTICAL = false;
                        this.HISTORY_LAST_RESULT_COL++;
                        this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                    } else {
                        if (this.historyArray[this.HISTORY_LAST_RESULT_ROW + 1][this.HISTORY_LAST_RESULT_COL] == 1) {
                            this.HISTORY_STATE_IS_VERTICAL = false;
                            this.HISTORY_LAST_RESULT_COL++;
                            this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                        } else {
                            this.HISTORY_LAST_RESULT_ROW++;
                            this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                        }
                    }
                } else {
                    this.HISTORY_LAST_RESULT_COL += 1;
                    this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
                }
                this.HISTORY_LAST_VALUE = result;
            }
            // Kết quả không giống ván trước ( đổi cột)
            else {
                // Mặc định quay lại thằng đầu tiên trống trên hàng 1
                for (let j = 0; j < this.historyArray[0].length; j++) {
                    if (this.historyArray[0][j] == 0) {
                        this.HISTORY_LAST_RESULT_COL = j;
                        break;
                    }
                }
                this.dataBigEyeRoad.push(this.HISTORY_STREAK);
                this.isChuyenCot = true;
                this.HISTORY_STREAK = 1;
                this.HISTORY_LAST_RESULT_ROW = 0;
                this.HISTORY_LAST_VALUE = result;
                this.historyArray[this.HISTORY_LAST_RESULT_ROW][this.HISTORY_LAST_RESULT_COL] = 1
            }
        }
        this.setPositionSpriteHistory(result, typeWin);
        this.dataBigEye();
        this.dataIndexSmallRoad();
        this.dataIndexCockRoad();
        // cc.NGWlog(vector,'result chip')
        // cc.NGWlog(result,'result chip')
    },
    dataBigEye() { //type win xanh do cua bigRoad
        // if(this.HISTORY_STREAK >= 2 && this.dataBigEyeRoad.length >= 2){

        // }
        let itemIndex = 0;
        if (!this.isChuyenCot && this.dataBigEyeRoad.length > 0 && this.HISTORY_STREAK > 1) {
            if (this.HISTORY_STREAK === this.dataBigEyeRoad[this.dataBigEyeRoad.length - 1] + 1) {
                itemIndex = 2;
            } else {
                itemIndex = 1;
            }
        } else {
            if (this.dataBigEyeRoad.length > 1) {
                if (this.dataBigEyeRoad[this.dataBigEyeRoad.length - 1] !== this.dataBigEyeRoad[this.dataBigEyeRoad.length - 2]) {
                    itemIndex = 2;
                } else {
                    itemIndex = 1;
                }
            } else {
                return;
            }
        }
        this.getPositionBigEyeRoad(itemIndex)
    },
    dataIndexSmallRoad() {
        let itemIndex = 0;
        if (!this.isChuyenCot && this.dataBigEyeRoad.length > 1 && this.HISTORY_STREAK > 1) {
            if (this.HISTORY_STREAK === this.dataBigEyeRoad[this.dataBigEyeRoad.length - 2] + 1) {
                itemIndex = 1
            } else {
                itemIndex = 2;
            }
        } else {
            if (this.dataBigEyeRoad.length > 2) {
                if (this.dataBigEyeRoad[this.dataBigEyeRoad.length - 1] !== this.dataBigEyeRoad[this.dataBigEyeRoad.length - 3]) {
                    itemIndex = 1;
                } else {
                    itemIndex = 2;
                }
            } else {
                return;
            }
        }
        this.getPositionSmallRoad(itemIndex)
    },
    dataIndexCockRoad() {
        let itemIndex = 0;
        if (!this.isChuyenCot && this.dataBigEyeRoad.length > 2 && this.HISTORY_STREAK > 1) {
            if (this.HISTORY_STREAK === this.dataBigEyeRoad[this.dataBigEyeRoad.length - 3] + 1) {
                itemIndex = 1;
            } else {
                itemIndex = 2;
            }
        } else {
            if (this.dataBigEyeRoad.length > 3) {
                if (this.dataBigEyeRoad[this.dataBigEyeRoad.length - 1] !== this.dataBigEyeRoad[this.dataBigEyeRoad.length - 4]) {
                    itemIndex = 1;
                } else {
                    itemIndex = 2;
                }
            } else {
                return;
            }
        }
        this.getPositionCockRoad(itemIndex)
    },
    getPositionBigEyeRoad(result) {
        result = parseInt(result);
        //First Time Running 
        if (this.HISTORY_LAST_BIGEYE_VALUE == null) {
            this.HISTORY_LAST_BIGEYE_ROW = 0;
            this.HISTORY_LAST_BIGEYE_COL = 0;
            this.HISTORY_LAST_BIGEYE_VALUE = result;
            this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW][this.HISTORY_LAST_BIGEYE_COL] = 1
        } else {
            // Kết quả giống ván trước
            if (result == this.HISTORY_LAST_BIGEYE_VALUE) {
                if (this.HISTORY_STREAK_BIGEYE == 0) {
                    this.HISTORY_STATE_IS_VERTICAL_BIGEYE = true;
                }
                this.HISTORY_STREAK_BIGEYE++;
                if (this.HISTORY_STATE_IS_VERTICAL_BIGEYE) {
                    if (this.HISTORY_LAST_BIGEYE_ROW >= 5 || this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW + 1][this.HISTORY_LAST_BIGEYE_COL] == 1) {
                        this.HISTORY_STATE_IS_VERTICAL_BIGEYE = false;
                        this.HISTORY_LAST_BIGEYE_COL++;
                        this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW][this.HISTORY_LAST_BIGEYE_COL] = 1
                    } else {
                        if (this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW + 1][this.HISTORY_LAST_BIGEYE_COL] == 1) {
                            this.HISTORY_STATE_IS_VERTICAL_BIGEYE = false;
                            this.HISTORY_LAST_BIGEYE_COL++;
                            this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW][this.HISTORY_LAST_BIGEYE_COL] = 1
                        } else {
                            this.HISTORY_LAST_BIGEYE_ROW++;
                            this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW][this.HISTORY_LAST_BIGEYE_COL] = 1
                        }
                    }
                } else {
                    this.HISTORY_LAST_BIGEYE_COL += 1;
                    this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW][this.HISTORY_LAST_BIGEYE_COL] = 1
                }
                this.HISTORY_LAST_BIGEYE_VALUE = result;
            }
            // Kết quả không giống ván trước
            else {
                // Mặc định quay lại thằng đầu tiên trống trên hàng 1
                for (let j = 0; j < this.historyBigEyeArr[0].length; j++) {
                    if (this.historyBigEyeArr[0][j] == 0) {
                        this.HISTORY_LAST_BIGEYE_COL = j;
                        break;
                    }
                }
                this.HISTORY_STREAK_BIGEYE = 0;
                this.HISTORY_LAST_BIGEYE_ROW = 0;
                this.HISTORY_LAST_BIGEYE_VALUE = result;
                this.historyBigEyeArr[this.HISTORY_LAST_BIGEYE_ROW][this.HISTORY_LAST_BIGEYE_COL] = 1
            }
        }
        this.setPositionItemBigEye(result);
    },
    getPositionSmallRoad(result) {
        result = parseInt(result);
        //First Time Running 
        if (this.HISTORY_LAST_SMALL_VALUE == null) {
            this.HISTORY_LAST_SMALL_ROW = 0;
            this.HISTORY_LAST_SMALL_COL = 0;
            this.HISTORY_LAST_SMALL_VALUE = result;
            this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW][this.HISTORY_LAST_SMALL_COL] = 1
        } else {
            // Kết quả giống ván trước
            if (result == this.HISTORY_LAST_SMALL_VALUE) {
                if (this.HISTORY_STREAK_SMALL == 0) {
                    this.HISTORY_STATE_IS_VERTICAL_SMALL = true;
                }
                this.HISTORY_STREAK_SMALL++;
                if (this.HISTORY_STATE_IS_VERTICAL_SMALL) {
                    if (this.HISTORY_LAST_SMALL_ROW >= 5 || this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW + 1][this.HISTORY_LAST_SMALL_COL] == 1) {
                        this.HISTORY_STATE_IS_VERTICAL_SMALL = false;
                        this.HISTORY_LAST_SMALL_COL++;
                        this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW][this.HISTORY_LAST_SMALL_COL] = 1
                    } else {
                        if (this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW + 1][this.HISTORY_LAST_SMALL_COL] == 1) {
                            this.HISTORY_STATE_IS_VERTICAL_SMALL = false;
                            this.HISTORY_LAST_SMALL_COL++;
                            this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW][this.HISTORY_LAST_SMALL_COL] = 1
                        } else {
                            this.HISTORY_LAST_SMALL_ROW++;
                            this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW][this.HISTORY_LAST_SMALL_COL] = 1
                        }
                    }
                } else {
                    this.HISTORY_LAST_SMALL_COL += 1;
                    this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW][this.HISTORY_LAST_SMALL_COL] = 1
                }
                this.HISTORY_LAST_SMALL_VALUE = result;
            }
            // Kết quả không giống ván trước
            else {
                // Mặc định quay lại thằng đầu tiên trống trên hàng 1
                for (let j = 0; j < this.historySmallRoad[0].length; j++) {
                    if (this.historySmallRoad[0][j] == 0) {
                        this.HISTORY_LAST_SMALL_COL = j;
                        break;
                    }
                }
                this.HISTORY_STREAK_SMALL = 0;
                this.HISTORY_LAST_SMALL_ROW = 0;
                this.HISTORY_LAST_SMALL_VALUE = result;
                this.historySmallRoad[this.HISTORY_LAST_SMALL_ROW][this.HISTORY_LAST_SMALL_COL] = 1
            }
        }
        this.setPositionItemSmallRoad(result);
    },
    getPositionCockRoad(result) {
        result = parseInt(result);
        //First Time Running 
        if (this.HISTORY_LAST_COCK_VALUE == null) {
            this.HISTORY_LAST_COCK_ROW = 0;
            this.HISTORY_LAST_COCK_COL = 0;
            this.HISTORY_LAST_COCK_VALUE = result;
            this.historyCockRoad[this.HISTORY_LAST_COCK_ROW][this.HISTORY_LAST_COCK_COL] = 1
        } else {
            // Kết quả giống ván trước
            if (result == this.HISTORY_LAST_COCK_VALUE) {
                if (this.HISTORY_STREAK_COCK == 0) {
                    this.HISTORY_STATE_IS_VERTICAL_COCK = true;
                }
                this.HISTORY_STREAK_COCK++;
                if (this.HISTORY_STATE_IS_VERTICAL_COCK) {
                    if (this.HISTORY_LAST_COCK_ROW >= 5 || this.historyCockRoad[this.HISTORY_LAST_COCK_ROW + 1][this.HISTORY_LAST_COCK_COL] == 1) {
                        this.HISTORY_STATE_IS_VERTICAL_COCK = false;
                        this.HISTORY_LAST_COCK_COL++;
                        this.historyCockRoad[this.HISTORY_LAST_COCK_ROW][this.HISTORY_LAST_COCK_COL] = 1
                    } else {
                        if (this.historyCockRoad[this.HISTORY_LAST_COCK_ROW + 1][this.HISTORY_LAST_COCK_COL] == 1) {
                            this.HISTORY_STATE_IS_VERTICAL_COCK = false;
                            this.HISTORY_LAST_COCK_COL++;
                            this.historyCockRoad[this.HISTORY_LAST_COCK_ROW][this.HISTORY_LAST_COCK_COL] = 1
                        } else {
                            this.HISTORY_LAST_COCK_ROW++;
                            this.historyCockRoad[this.HISTORY_LAST_COCK_ROW][this.HISTORY_LAST_COCK_COL] = 1
                        }
                    }
                } else {
                    this.HISTORY_LAST_COCK_COL += 1;
                    this.historyCockRoad[this.HISTORY_LAST_COCK_ROW][this.HISTORY_LAST_COCK_COL] = 1
                }
                this.HISTORY_LAST_COCK_VALUE = result;
            }
            // Kết quả không giống ván trước
            else {
                // Mặc định quay lại thằng đầu tiên trống trên hàng 1
                for (let j = 0; j < this.historyCockRoad[0].length; j++) {
                    if (this.historyCockRoad[0][j] == 0) {
                        this.HISTORY_LAST_COCK_COL = j;
                        break;
                    }
                }
                this.HISTORY_STREAK_COCK = 0;
                this.HISTORY_LAST_COCK_ROW = 0;
                this.HISTORY_LAST_COCK_VALUE = result;
                this.historyCockRoad[this.HISTORY_LAST_COCK_ROW][this.HISTORY_LAST_COCK_COL] = 1
            }
        }
        this.setPositionItemCockRoad(result);
    },
    setPositionSpriteHistory(state, typeWin) {
        let itemHis = new cc.Node();
        let sprItemHis = itemHis.addComponent(cc.Sprite);
        if (state !== 3) {
            sprItemHis.spriteFrame = this.getSprBigRoad(typeWin, "BreadRoad");
        }
        itemHis.setAnchorPoint(0, 1);
        var numChild = this.breadRoad.childrenCount;
        if (this.HISTORY_LAST_RESULT_COL >= 32 * this.index) {
            if (this.HISTORY_LAST_RESULT_COL === 32 * numChild) {
                var bkgTable = new cc.Node();
                bkgTable.setContentSize(754, 151);
                bkgTable.setAnchorPoint(0, 1);
                let sprBkgTable = bkgTable.addComponent(cc.Sprite);
                sprBkgTable.spriteFrame = this.getSprBigRoad('', "BreadRoad");
                this.breadRoad.addChild(bkgTable);
                this.old_Bread_Road.push(bkgTable);
                if (this.HISTORY_LAST_RESULT_COL === 32) {
                    this.index = 1;
                } else {
                    this.index++;
                }
            }
            this.BREAD_ROAD_CHILD = this.old_Bread_Road[this.old_Bread_Road.length - 1];
            this.BREAD_ROAD_CHILD.addChild(itemHis);
        } else {
            this.BREAD_ROAD_CHILD = this.old_Bread_Road[this.old_Bread_Road.length - 2];
            this.BREAD_ROAD_CHILD.addChild(itemHis);
            if (this.HISTORY_LAST_RESULT_COL >= 32) {
                let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_RESULT_COL - 32 * (this.index - 1), this.HISTORY_LAST_RESULT_ROW, "BreadRoad");
                itemHis.setPosition(vector);
                return;
            }
        }
        let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_RESULT_COL, this.HISTORY_LAST_RESULT_ROW, "BreadRoad");
        itemHis.setPosition(vector);

    },
    setPositionItemBigEye(state) {
        let itemHis = new cc.Node();
        let sprItemHis = itemHis.addComponent(cc.Sprite);
        itemHis.setScale(0.5);
        if (state !== 3) {
            sprItemHis.spriteFrame = this.getSprBigRoad(state, "BreadRoad");
        }
        var numChild = this.tb_BigEye.childrenCount;
        itemHis.setAnchorPoint(0, 1);
        if (this.HISTORY_LAST_BIGEYE_COL >= 64 * this.indexBigEye) {
            if (this.HISTORY_LAST_BIGEYE_COL === 64 * numChild) {
                var bkgTable = new cc.Node();
                bkgTable.setContentSize(754, 77);
                bkgTable.setAnchorPoint(0, 1);
                let sprBkgTable = bkgTable.addComponent(cc.Sprite);
                sprBkgTable.spriteFrame = this.getSprBigRoad('', "BigEye");
                this.tb_BigEye.addChild(bkgTable);
                this.old_Big_Eye.push(bkgTable);
                if (this.HISTORY_LAST_BIGEYE_COL === 64) {
                    this.indexBigEye = 1;
                } else {
                    this.indexBigEye++;
                }
            }
            this.BIG_EYE_CHILD = this.old_Big_Eye[this.old_Big_Eye.length - 1];
            this.BIG_EYE_CHILD.addChild(itemHis);
        } else {
            this.BIG_EYE_CHILD = this.old_Big_Eye[this.old_Big_Eye.length - 2];
            this.BIG_EYE_CHILD.addChild(itemHis);
            if (this.HISTORY_LAST_BIGEYE_COL >= 64) {
                let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_BIGEYE_COL - 64 * (this.indexBigEye - 1), this.HISTORY_LAST_BIGEYE_ROW, "BigEye");
                itemHis.setPosition(vector);
                return;
            }
        }
        let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_BIGEYE_COL, this.HISTORY_LAST_BIGEYE_ROW, "BigEye");
        itemHis.setPosition(vector);

    },
    setPositionItemSmallRoad(state) {
        let itemHis = new cc.Node();
        let sprItemHis = itemHis.addComponent(cc.Sprite);
        itemHis.setScale(0.5);
        if (state !== 3) {
            sprItemHis.spriteFrame = this.getSprBigRoad(state, "SmallRoad");
        }
        var numChild = this.tb_SmallRoad.childrenCount;
        itemHis.setAnchorPoint(0, 1);
        if (this.HISTORY_LAST_SMALL_COL >= 30 * this.indexSmallRoad) {
            if (this.HISTORY_LAST_SMALL_COL === 30 * numChild) {
                var bkgTable = new cc.Node();
                bkgTable.setContentSize(355, 77);
                bkgTable.setAnchorPoint(0, 1);
                let sprBkgTable = bkgTable.addComponent(cc.Sprite);
                sprBkgTable.spriteFrame = this.getSprBigRoad('', "cockroad");
                this.tb_SmallRoad.addChild(bkgTable);
                this.old_small_road.push(bkgTable);
                if (this.HISTORY_LAST_SMALL_COL === 30) {
                    this.indexSmallRoad = 1;
                } else {
                    this.indexSmallRoad++;
                }
            }
            this.SMALL_CHILD = this.old_small_road[this.old_small_road.length - 1];
            this.SMALL_CHILD.addChild(itemHis);
        } else {
            this.SMALL_CHILD = this.old_small_road[this.old_small_road.length - 2];
            this.SMALL_CHILD.addChild(itemHis);
            if (this.HISTORY_LAST_SMALL_COL >= 30) {
                let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_SMALL_COL - 30 * (this.indexSmallRoad - 1), this.HISTORY_LAST_SMALL_ROW, "SmallRoad");
                itemHis.setPosition(vector);
                return;
            }
        }
        let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_SMALL_COL, this.HISTORY_LAST_SMALL_ROW, "SmallRoad");
        itemHis.setPosition(vector);

    },
    setPositionItemCockRoad(state) {
        let itemHis = new cc.Node();
        let sprItemHis = itemHis.addComponent(cc.Sprite);
        itemHis.setScale(0.5);
        if (state !== 3) {
            sprItemHis.spriteFrame = this.getSprBigRoad(state, "CockRoad");
        }
        var numChild = this.tb_CockRoad.childrenCount;
        itemHis.setAnchorPoint(0, 1);
        if (this.HISTORY_LAST_COCK_COL >= 30 * this.indexCockRoad) {
            if (this.HISTORY_LAST_COCK_COL === 30 * numChild) {
                var bkgTable = new cc.Node();
                bkgTable.setContentSize(355, 77);
                bkgTable.setAnchorPoint(0, 1);
                let sprBkgTable = bkgTable.addComponent(cc.Sprite);
                sprBkgTable.spriteFrame = this.getSprBigRoad('', "cockroad");
                this.tb_CockRoad.addChild(bkgTable);
                this.old_cock_road.push(bkgTable);
                if (this.HISTORY_LAST_COCK_COL === 30) {
                    this.indexCockRoad = 1;
                } else {
                    this.indexCockRoad++;
                }
            }
            this.COCK_CHILD = this.old_cock_road[this.old_cock_road.length - 1];
            this.COCK_CHILD.addChild(itemHis);
        } else {
            this.COCK_CHILD = this.old_cock_road[this.old_cock_road.length - 2];
            this.COCK_CHILD.addChild(itemHis);
            if (this.HISTORY_LAST_COCK_COL >= 30) {
                let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_COCK_COL - 30 * (this.indexCockRoad - 1), this.HISTORY_LAST_COCK_ROW, "CockRoad");
                itemHis.setPosition(vector);
                return;
            }
        }
        let vector = this.convertArrayIndexToPosition(this.HISTORY_LAST_COCK_COL, this.HISTORY_LAST_COCK_ROW, "CockRoad");
        itemHis.setPosition(vector);

    },
    setup2dArray() {
        this.historyArray = new Array(6);
        for (let i = 0; i < this.historyArray.length; i++) {
            this.historyArray[i] = new Array(200);
        }
        for (let j = 0; j < 6; j++) {
            for (let k = 0; k < 200; k++) {
                this.historyArray[j][k] = (0)
            }
        }
        // vt Pos BigEyes
        this.historyBigEyeArr = new Array(6);
        for (let i = 0; i < this.historyBigEyeArr.length; i++) {
            this.historyBigEyeArr[i] = new Array(200);
        }
        for (let j = 0; j < 6; j++) {
            for (let k = 0; k < 200; k++) {
                this.historyBigEyeArr[j][k] = (0)
            }
        }
        //vt smallroad
        this.historySmallRoad = new Array(6);
        for (let i = 0; i < this.historySmallRoad.length; i++) {
            this.historySmallRoad[i] = new Array(200);
        }
        for (let j = 0; j < 6; j++) {
            for (let k = 0; k < 200; k++) {
                this.historySmallRoad[j][k] = (0)
            }
        }
        //vt cock road
        this.historyCockRoad = new Array(6);
        for (let i = 0; i < this.historyCockRoad.length; i++) {
            this.historyCockRoad[i] = new Array(200);
        }
        for (let j = 0; j < 6; j++) {
            for (let k = 0; k < 200; k++) {
                this.historyCockRoad[j][k] = (0)
            }
        }
    },
    //---------------------> Tuyen Test
    onlicktesttrang() {
        this.getPositionCockRoad(1);
    },
    onclicktestvang() {
        this.getPositionCockRoad(2);
    },
    //------------------------> end
    // update (dt) {},
});