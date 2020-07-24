var ComparisionTalaForN = function (x, y) {
    let xN = x.N;
    let yN = y.N;
    if (xN > 13)
        xN -= 13;
    if (yN > 13)
        yN -= 13;
    if (xN > yN || (xN === yN && x.S > y.S))
        return 1;
    else
        return -1;
}

var ComparisionTalaForN_2 = function (x, y) {
    let xN = x.N;
    let yN = y.N;
    if (xN > yN || (xN === yN && x.S > y.S))
        return 1;
    else
        return -1;
}

var ComparisionTalaForS = function (x, y) {
    if (x.S > y.S) {
        return 1;
    } else {
        return -1;
    }
}



var LogicManager = cc.Class({
    statics: {
        /*****************************BURMESE POKER*****************************/
        checkListGetScore(listIn, numSanh = 0) {
            let list = listIn.slice();
            require('BurmesePokerView').isInvalid = false;
            let i = 0;
            let countSanh = 0;
            for (i = 0; i < list.length; i++) {
                let type = LogicManager.getTypeCardRummy(list[i]);
                if (type === TYPE_CARD_RUMMY.TCR_PURE || type === TYPE_CARD_RUMMY.IMPURE) {
                    countSanh++;
                }
            }
            if (countSanh >= numSanh) {
                require('BurmesePokerView').isInvalid = true;
                for (i = 0; i < list.length; i++) {
                    let type = LogicManager.getTypeCardRummy(list[i]);
                    if (type === TYPE_CARD_RUMMY.TCR_PURE || type === TYPE_CARD_RUMMY.IMPURE) {
                        // list.erase(list.begin() + i);
                        list.splice(i, 1);
                        i--;
                    }
                }
            }

            let score = 0;
            if (require('BurmesePokerView').isInvalid) {
                for (i = 0; i < list.length; i++) {
                    let type = LogicManager.getTypeCardRummy(list[i]);
                    if (type === TYPE_CARD_RUMMY.NONE) {
                        score += LogicManager.getScore(list[i]);
                    }
                }
            } else {
                for (i = 0; i < list.length; i++) {
                    score += LogicManager.getScore(list[i]);
                }
            }
            if (score >= 80) score = 80;
            return score;
        },

        getTypeCardRummy(listIn) {
            let list = listIn.slice();
            if (LogicManager.checkJoker(list)) {
                if (list.length > 2)
                    return TYPE_CARD_RUMMY.IMPURE;
                return TYPE_CARD_RUMMY.JOKER;
            } else if (LogicManager.checkPure_Xam(list) || LogicManager.checkPure_TPS(list)) {
                return TYPE_CARD_RUMMY.TCR_PURE;
            } else if (LogicManager.checkImpure(list)) {
                return TYPE_CARD_RUMMY.IMPURE;
            } else if (LogicManager.checkSet(list)) {
                return TYPE_CARD_RUMMY.SET;
            }
            return TYPE_CARD_RUMMY.NONE;
        },

        checkPure_Xam(listIn) {
            let list = listIn.slice();//3 co giong nhau ca so lan chat
            if (list.length !== 3) return false;
            if (LogicManager.checkDoubleEat(list)) return false;
            if (list[0].code === list[1].code && list[0].code === list[2].code) {
                return true;
            }
            return false;
        },

        checkPure_TPS(listIn) {
            let list = listIn.slice();
            if (list.length < 3 || list.length > 4) return false;

            if (LogicManager.checkDoubleEat(list)) return false;
            list.sort(ComparisionTalaForN);
            // sort(list.begin(), list.end(), LogicManager:: ComparisionTalaForN);//son
            return LogicManager.checkThungPhaSanh(list, list.length);
        },

        checkImpure(listIn) {
            let list = listIn.slice();
            if (list.length < 3 || list.length > 4) return false;
            if (LogicManager.checkDoubleEat(list)) return false;

            let i;
            for (i = 0; i < list.length - 1; i++) {
                for (let j = i + 1; j < list.length; j++) {
                    if (list[i].code === list[j].code && !list[i].isJoker) {
                        return false;
                    }

                    if (list[i].isJoker) break;
                    if (list[j].isJoker) continue;

                    if (list[i].S !== list[j].S) {
                        return false;
                    }
                }
            }

            let listJoker = [];
            let listJoker2 = [];
            for (i = 0; i < list.length; i++) {
                if (list[i].isJoker || list[i].code === CODE_JOKER_BLACK || list[i].code === CODE_JOKER_RED) {
                    listJoker.push(list[i]);
                    listJoker2.push(list[i]);
                    // list.eraseObject(list[i]);
                    list.splice(i, 1);
                    i--;
                }
            }

            if (list.length <= 0) return false;
            if (list.length === 1) return true;
            let isCheck = false;

            // sort(list.begin(), list.end(), ComparisionTalaForN);
            // cc.NGWlog('---------------------------------------------------------------------------------------------------------------0');
            // cc.NGWlog(list);
            list.sort(ComparisionTalaForN);

            let NN = list[0].N;
            let NN2 = -1;
            if (NN === 14) {
                NN2 = 1;
            }

            for (i = 1; i < list.length; i++) {
                if (NN === list[i].N - 1 || NN2 === list[i].N - 1) {
                    isCheck = true;
                    NN = list[i].N;
                } else {
                    if (listJoker.length > 0) {
                        isCheck = true;
                        listJoker.splice(0, 1);
                        if (NN >= 14) {
                            NN2++;
                        }
                        NN++;

                        if (i > 1)
                            i--;
                        else
                            i = 0;
                    } else {
                        isCheck = false;
                        break;
                    }
                }
            }

            // cc.NGWlog('---------------------------------------------------------------------------------------------------------------2');
            // cc.NGWlog(isCheck);
            if (isCheck === false) {
                // sort(list.begin(), list.end(), LogicManager:: ComparisionTalaForN_2);
                list.sort(ComparisionTalaForN_2);
                // cc.NGWlog('---------------------------------------------------------------------------------------------------------------1');
                // cc.NGWlog(list);

                NN = list[0].N;
                NN2 = -1;
                if (NN === 14) {
                    NN2 = 1;
                }

                // cc.NGWlog(NN + ' ---------------------------------------------------------------------------------------------------------------11  ' + NN2);
                for (i = 1; i < list.length; i++) {

                    // cc.NGWlog('---------------------------------------------------------------------------------------------------------------111  ' + list[i].N);
                    if (NN === list[i].N - 1 || NN2 === list[i].N - 1) {
                        isCheck = true;
                        NN = list[i].N;
                    } else {
                        if (listJoker2.length > 0) {
                            isCheck = true;
                            listJoker2.splice(0, 1);
                            NN++;
                            if (i > 1)
                                i--;
                            else
                                i = 0;
                        } else {
                            isCheck = false;
                            break;
                        }
                    }
                }
            }


            // cc.NGWlog('---------------------------------------------------------------------------------------------------------------3');
            // cc.NGWlog(isCheck);

            return isCheck;
        },

        checkSet(listIn) {
            let list = listIn.slice();
            if (list.length < 3 || list.length > 4) return false;
            if (LogicManager.checkDoubleEat(list)) return false;
            let i;

            for (i = 0; i < list.length - 1; i++) {
                for (let j = i + 1; j < list.length; j++) {
                    if (list[i].N != list[j].N && !list[i].isJoker && !list[j].isJoker) {
                        return false;
                    }
                }
            }
            //    Vector<Card*> listJoker;
            for (i = 0; i < list.length; i++) {
                if (list[i].isJoker) {
                    // list.eraseObject(list[i]);
                    list.splice(i, 1);
                    i--;
                }
            }

            if (list.length <= 1) return false;
            let valueC = list[0];
            let isCheck = false;
            for (i = 1; i < list.length; i++) {
                if (valueC.N === list[i].N) {
                    isCheck = true;
                } else {
                    isCheck = false;
                    break;
                }
            }

            return isCheck;
        },
        checkJoker(listIn) {
            let list = listIn.slice();
            if (list.length < 3 || list.length > 4) return false;
            if (LogicManager.checkDoubleEat(list)) return false;
            let isCheck = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].isJoker) {
                    isCheck = true;
                } else {
                    isCheck = false;
                    break;
                }
            }
            return isCheck;
        },
        checkDoubleEat(listIn) {
            let list = listIn.slice();
            let count = 0;
            for (let i = 0; i < list.length; i++) {
                if (list[i].getIsEat()) {
                    count++;
                }
            }

            return count >= 2;
        },
        getScore(listIn) {
            let list = listIn.slice();
            let diem = 0;
            for (let i = 0; i < list.length; i++) {
                let c = list[i];
                if (c.isJoker)
                    continue;
                if (c.N >= 14) {
                    diem += 1;
                } else if (c.N >= 1 && c.N <= 9) {
                    diem += c.N;
                } else if (c.N >= 10 && c.N < 14) {
                    diem += 10;
                }
            }
            return diem;
        },
        sortImpure(listIn, isCo2) {
            let list = listIn.slice();
            if (list.length <= 0) return;
            let i;
            let listJoker = [];
            let listJoker2 = [];
            let isCoK = false;
            for (i = 0; i < list.length; i++) {
                if (list[i].N === 13) {
                    isCoK = true;
                }
                if (list[i].isJoker || list[i].code === CODE_JOKER_BLACK || list[i].code === CODE_JOKER_RED) {
                    listJoker.push(list[i]);
                    listJoker2.push(list[i]);
                    // list.eraseObject(list[i]);
                    list.splice(i, 1);
                    i--;
                }
            }

            // sort(listJoker.begin(), listJoker.end(), LogicManager:: ComparisionTalaForS);
            listJoker.sort(ComparisionTalaForS);
            if (list.length <= 0 && listJoker.length > 0) {
                for (i = 0; i < listJoker.length; i++) {
                    list.push(listJoker[i]);
                }
                return;
            }

            listJoker2.sort(ComparisionTalaForS);
            // sort(listJoker2.begin(), listJoker2.end(), LogicManager:: ComparisionTalaForS);

            if (list.length == 1) {
                for (i = 0; i < listJoker.length; i++) {
                    if (i === 0) {
                        // list.insert(0, listJoker[i]);
                        list.splice(0, 0, listJoker[i]);
                    } else
                        list.push(listJoker[i]);
                }

                return;
            }


            let isCheck = false;
            if (isCo2) {

                list.sort(ComparisionTalaForN);
                // sort(list.begin(), list.end(), LogicManager:: ComparisionTalaForN);
            } else
                list.sort(ComparisionTalaForN_2);
            // sort(list.begin(), list.end(), LogicManager:: ComparisionTalaForN_2);

            //    Vector<Card*> list2 = list;
            let NN = list[0].N;
            let NN2 = -1;
            if (NN === 14) {
                NN2 = 1;
            }

            for (i = 1; i < list.length; i++) {
                if (NN === list[i].N - 1 || NN2 === list[i].N - 1) {
                    isCheck = true;
                    NN = list[i].N;
                } else {
                    if (listJoker.length > 0) {
                        isCheck = true;
                        // list.insert(i, listJoker.at(0));
                        // listJoker.erase(0);
                        list.splice(i, 0, listJoker[0]);
                        listJoker.splice(0, 1);
                        if (NN >= 14) {
                            NN2++;
                        }
                        NN++;

                        if (i > 1)
                            i--;
                        else
                            i = 1;
                    } else {
                        isCheck = false;
                        break;
                    }
                }
            }

            if (listJoker.length > 0) {
                if (isCoK && list.length > 0) {
                    for (i = 0; i < listJoker.length; i++) {
                        list.splice(0, 0, listJoker[i]);
                    }
                } else {
                    for (i = 0; i < listJoker.length; i++) {
                        list.push(listJoker[i]);
                    }
                }
            }
        },
        /*****************************END BURMESE POKER*****************************/
        getTypeCard(list, size = 5) {
            if (LogicManager.checkThungPhaSanh(list, size)) {
                return TYPE_CARD.THUNG_PHA_SANH;
            } else if (LogicManager.checkTuQuy(list)) {
                return TYPE_CARD.TU_QUY;
            } else if (LogicManager.checkCulu(list)) {
                return TYPE_CARD.CU_LU;
            } else if (LogicManager.checkThung(list, size)) {
                return TYPE_CARD.THUNG;
            } else if (LogicManager.checkSanh(list, size)) {
                return TYPE_CARD.SANH;
            } else if (LogicManager.checkXam(list)) {
                return TYPE_CARD.XAM;
            } else if (LogicManager.checkThu(list)) {
                return TYPE_CARD.THU;
            } else if (LogicManager.checkDoi(list)) {
                return TYPE_CARD.DOI;
            }

            return TYPE_CARD.MAU_THAU;
        },
        checkThungPhaSanh(listIn, size) {
            let list = listIn.slice();
            if (LogicManager.checkThung(list, size) === true && LogicManager.checkSanh(list, size) === true)
                return true;

            return false;
        },
        checkTuQuy(listIn) {
            let list = listIn.slice();

            list.sort((x, y) => {
                return x.N - y.N;
            });

            if (list.length < 4)
                return false;


            for (let i = 0; i < list.length - 1; i++) {
                let count = 0;

                for (let j = i + 1; j < list.length; j++)
                    if (list[j].N === list[i].N)
                        count++;

                if (count === 3)
                    return true;
            }


            return false;
        },
        checkCulu(listIn) {
            let list = listIn.slice();
            if (!LogicManager.checkXam(list) || list.length < 5) // thoả mãn điều kiện đầu
                return false;

            // sortVector(list);

            list.sort((x, y) => {
                return x.N - y.N;
            });

            // let listTmp = [];

            if (list.length === 5) // check nhanh sz = 5
            {
                for (let i = 0; i < list.length - 4; i++) {
                    if (list[i].N === list[i + 1].N) {
                        if (list[i + 1].N === list[i + 2].N && list[i + 3].N === list[i + 4].N) // 3-2
                            return true;
                        if (list[i + 2].N === list[i + 3].N && list[i + 3].N === list[i + 4].N) // 2-3
                            return true;
                    }
                }
                return false;
            }

            let tmp = [];
            for (let i = 0; i < list.length - 2; i++) {
                tmp = list;
                if (list[i].N === list[i + 1].N && list[i + 1].N === list[i + 2].N) //xám
                {
                    // tmp.eraseObject(list.at(i + 2));
                    // tmp.eraseObject(list.at(i + 1));
                    // tmp.eraseObject(list.at(i));
                    tmp.slice(i, 3);
                    if (LogicManager.checkDoi(tmp))
                        return true;
                }

            }

            return false;
        },
        checkThung(listIn, size) {
            let list = listIn.slice();
            if (list.length < size)
                return false;

            let count = 0;

            for (let i = 0; i < list.length; i++) {
                count = 0;

                for (let j = i + 1; j < list.length; j++)
                    if (list[j].S === list[i].S)
                        count++;

                if (count >= size - 1)
                    return true;
            }


            return false;
        },
        checkSanh(listIn, size) {
            let list = listIn.slice();
            if (list.length < size)
                return false;


            let c = [];
            for (let i = 0; i < list.length; i++) {
                c.push(list[i].N);
                if (list[i].N === 14)
                    c.push(1); // thêm op cho Át có N = 14, nếu 1 2 3 4 5 k phải sảnh thì bỏ pushback này
            }
            // sortVector(c);

            c.sort((x, y) => {
                return x - y;
            })

            for (let i = 0; i < c.length - 1; i++) {
                let count = 0;
                for (let j = i + 1; j < c.length; j++) {
                    if ((c[i] + count + 1) === c[j]) // đk 2 tránh lặp count  1 2 2 2
                        count++;
                }

                if (count >= size - 1)
                    return true;
            }

            return false;
        },
        checkXam(listIn) {
            let list = listIn.slice();
            list.sort((x, y) => {
                return x.N - y.N;
            });

            if (list.length < 3)
                return false;

            for (let i = 0; i < list.length - 2; i++)
                if (list[i].N === list[i + 1].N && list[i + 1].N === list[i + 2].N)
                    return true;

            return false;
        },
        checkThu(listIn) {
            // sortVector(list);
            let list = listIn.slice();
            list.sort((x, y) => {
                return x.N - y.N;
            });
            if (list.length < 4)
                return false;

            for (let i = 0; i < list.length - 1; i++)
                if (list[i].N === list[i + 1].N)
                    for (let j = i + 2; j < list.length - 1; j++)
                        if (list[j].N === list[j + 1].N)
                            return true;

            return false;
        },
        checkDoi(listIn) {
            // sortVector(list);
            let list = listIn.slice();
            list.sort((x, y) => {
                return x.N - y.N;
            });

            if (list.length < 2)
                return false;

            for (let i = 0; i < list.length - 1; i++)
                if (list[i].N === list[i + 1].N)
                    return true;

            return false;
        },

        //////////////////// MAU BINH /////////////////////
        checkBinhGrandDragon(listIn) /// 
        {
            for (let i = 1; i < listIn.length; i++)
                if (listIn[i].S != listIn[i-1].S)
                    return false;
            
            if(!this.checkBinhDragon(listIn))
                return false;
            
            return true;
        },

        checkBinhDragon(listIn)
        {
            let list = listIn.slice();

            list.sort((x, y) => {
                return x.N - y.N;
            });
            
            for (let i = 1; i < list.length; i++)
                if (list[i].N != list[i-1].N + 1)
                    return false;
            
            return true;
        },

        checkBinhSameColor(listIn)
        {
            var black = 0;
            var red = 0;
            
            for (let i = 0; i < listIn.length; i++)
            {
                if (listIn[i].S <= 2)
                    black++;
                else
                    red++;
            }
            
            if(black == 13 || red == 13)
                return true;
            
            return false;
        },

        checkBinhSixPairs(listIn)
        {
            let list = listIn.slice();
            
            list.sort((x, y) => {
                return x.N - y.N;
            });

            var index = 0;
            for (let i = 0; i < list.length - 1; i++)
            {
                if (list[i].N == list[i+1].N)
                {
                    index++;
                    i = i+1;
                }
            }
            
            if(index == 6)
                return true;

            return false;
        },

        checkBinhThreeStraights(list1, list2, list3)
        {
            if(!this.checkSanh(list1, 3) || !this.checkSanh(list2, 5) || !this.checkSanh(list3, 5))
                return false;
            
            return true;
        },

        checkBinhThreeFlushes(list1, list2, list3)
        {
            if(!this.checkThung(list1,3) || !this.checkThung(list2, 5) || !this.checkThung(list3, 5))
                return false;
            
            return true;
        },
        /////////////////////////// MAU BINH /////////////////////////

        ////////////////////////////TIEN LEN////////////////////////////
        check2DoiThong(listIn)
        {
            let list = listIn.slice();
            
            if(list.length !== 4)
                return false;

            list.sort((x, y) => {
                return x.N - y.N;
            });

            for(let i = 0; i < list.length - 2; i++)
            {
                if(list[i].N + 1 !== list[i+2].N)
                    return false;
            }

            return true;
        },

        check3DoiThong(listIn)
        {
            let list = listIn.slice();
            
            if(list.length !== 6)
                return false;

            list.sort((x, y) => {
                return x.N - y.N;
            });

            for(let i = 0; i < list.length - 2; i++)
            {
                if(list[i].N + 1 !== list[i+2].N)
                    return false;
            }

            return true;
        },
        
        check4DoiThong(listIn)
        {
            let list = listIn.slice();
            
            if(list.length !== 8)
                return false;

            list.sort((x, y) => {
                return x.N - y.N;
            });

            for(let i = 0; i < list.length - 2; i++)
            {
                if(list[i].N + 1 !== list[i+2].N)
                    return false;
            }

            return true;
        },

        checkSetOfTwos(listIn)
        {
            let list = listIn.slice();
            
            if(list.length > 3 || list.length < 2)
                return false;
            
            for(let i = 0; i < list.length; i++)
            {
                if(list[i].N !== 2)
                    return false;
            }

            return true;
        },

        checkDoiTL(listIn)
        {
            if(!this.checkDoi(listIn) || listIn.length !== 2)
                return false;

            // if(listIn[0].N === 2)
            //     return false;

            return true;
        },

        checkXamTL(listIn)
        {
            if(!this.checkXam(listIn) || listIn.length !== 3)
                return false;

            // if(listIn[0].N === 2)
            //     return false;

            return true;
        },

        checkSanhTL(listIn)
        {
            let list = listIn.slice();

            if(list.length < 3)
                return false;

            list.sort((x, y) => {
                return x.N - y.N;
            });

            for(let i = 0; i < list.length - 1; i++)
            {
                if(list[i].N + 1 !== list[i+1].N)
                    return false;
            }

            return true;

        },

        ckeckThungPhaSanhTL(listIn)
        {
            let list = listIn.slice();

            if(!this.checkSanhTL(list))
                return false;

            for(let i = 0; i < list.length - 1; i++)
            {
                if(list[i].S !== list[i+1].S)
                    return false;
            }

            return true;
        },
        ////////////////////////////TIEN LEN////////////////////////////
    }
});

module.export = LogicManager;