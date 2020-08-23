var TienLenJsonParse = cc.Class({
    properties: {
    },

    statics: {
        _handleParseDataGame(strData) {
            if (require('GameManager').getInstance().gameView === null) {
                return;
            }

            var gameView = require('GameManager').getInstance().gameView;

            if (gameView === null) {
                return;
            }

            var data = JSON.parse(strData);
            var evt = data.evt;

            cc.NGWlog('==========================>evt TIEN LEN GAME DATA ' + evt);

            switch (evt) {
                case 'ctable':
                    gameView.handleCTable(data.data);
                    break;
                case 'stable':
                // {"evt":"stable","data":"{\"N\":\"\",\"M\":5,\"ArrP\":[{\"id\":1262882,\"N\":\"te.1556708922_d30d1a1f-1717-4dc4-a407-178af5bbdebe\",\"Url\":\"te.1556708922_d30d1a1f-1717-4dc4-a407-178af5bbdebe\",\"AG\":283,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"G\":3,\"Av\":10,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0},{\"id\":968578,\"N\":\"phea_sopheap\",\"Url\":\"fb.403209127140838\",\"AG\":50,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"G\":3,\"Av\":0,\"FId\":403209127140838,\"GId\":0,\"UserType\":0,\"TotalAG\":0,\"timeToStart\":0},{\"id\":9,\"N\":\"ahiha123\",\"Url\":\"ahiha123\",\"AG\":956244,\"LQ\":7,\"VIP\":3,\"isStart\":false,\"IK\":0,\"G\":3,\"Av\":9,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0}],\"Id\":15187,\"V\":0,\"AG\":10,\"S\":4,\"issd\":true}","T":0,"C":0,"rate":0,"score":0,"time":3}
                    gameView.handleSTable(data.data, data.time);
                    break;
                case 'vtable':
                    // {"evt":"vtable","data":"{\"N\":\"\",\"M\":10,\"ArrP\":[{\"id\":1627968,\"A\":true,\"N\":\"123456789\",\"Url\":\"123456789\",\"AG\":434003,\"AGC\":0,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"Arr\":[0,0,0,0,0,0,0,0,0,0],\"G\":3,\"Av\":10,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"rate\":0,\"score\":0,\"point\":0,\"displayName\":\"123456789\"},{\"id\":1627914,\"A\":true,\"N\":\"huyen97\",\"Url\":\"huyen97\",\"AG\":13437298,\"AGC\":0,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"Arr\":[0,0,0,0,0,0,0,0,0,0],\"G\":3,\"Av\":3,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"rate\":0,\"score\":0,\"point\":0,\"displayName\":\"huyen97\"},{\"id\":1628150,\"A\":false,\"N\":\"te.1559116006_98f62116823a8695\",\"Url\":\"te.1559116006_98f62116823a8695\",\"AG\":24195,\"AGC\":0,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"Arr\":[0,0,0,0,0,0,0,0,0,0,0,0,0],\"G\":3,\"Av\":9,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"rate\":0,\"score\":0,\"point\":0,\"displayName\":\"NGW.1628150\"}],\"Id\":2,\"T\":20,\"V\":0,\"AG\":20,\"S\":4,\"CN\":\"huyen97\",\"CT\":20,\"AGBuyIn\":64292710,\"TotalAG\":0,\"CardsInTurn\":[36,22,47],\"lp\":\"123456789\"}","time":0}                    gameView.handleVTable(data.data);
                    gameView.handleVTable(data.data);
                    break;
                case 'jtable':
                // {"evt":"jtable","data":"{\"id\":1180170,\"N\":\"te.1555762860_d8024840-f85b-4c43-b3aa-ebbdf1d880d7\",\"Url\":\"te.1555762860_d8024840-f85b-4c43-b3aa-ebbdf1d880d7\",\"AG\":1374,\"LQ\":0,\"VIP\":1,\"isStart\":false,\"IK\":0,\"G\":3,\"Av\":2,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0}","T":0,"C":0,"rate":0,"score":0,"time":1}
                    gameView.handleJTable(data.data, data.time);
                    break;
                case 'rjtable':
                // {"evt":"rjtable","data":"{\"N\":\"\",\"M\":2,\"ArrP\":[{\"id\":9,\"A\":true,\"N\":\"ahiha123\",\"Url\":\"ahiha123\",\"AG\":963278,\"AGC\":0,\"LQ\":7,\"VIP\":3,\"isStart\":true,\"IK\":0,\"Arr\":[2,16,17,47,34,48,49,10,11,38,12,52,40],\"G\":3,\"Av\":2,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"rate\":0,\"score\":0,\"point\":0},{\"id\":1220142,\"A\":true,\"N\":\"te.1556242415_fdb648e1-c946-4a7e-8eb0-8a68944e9e38\",\"Url\":\"te.1556242415_fdb648e1-c946-4a7e-8eb0-8a68944e9e38\",\"AG\":232,\"AGC\":0,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"Arr\":[0,0,0],\"G\":3,\"Av\":17,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"rate\":0,\"score\":0,\"point\":0},{\"id\":908152,\"A\":false,\"N\":\"te.1552635061_fchc9uga44w_adsid\",\"Url\":\"te.1552635061_fchc9uga44w_adsid\",\"AG\":50,\"AGC\":0,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"Arr\":[0,0],\"G\":3,\"Av\":2,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"rate\":0,\"score\":0,\"point\":0}],\"Id\":16934,\"V\":0,\"AG\":10,\"S\":4,\"CN\":\"ahiha123\",\"CT\":12000,\"AGBuyIn\":963318,\"TotalAG\":0,\"CardsInTurn\":[22,9],\"lp\":\"te.1556242415_fdb648e1-c946-4a7e-8eb0-8a68944e9e38\"}","T":0,"C":0,"rate":0,"score":0,"time":0}
                    gameView.handleRJTable(data.data);
                    break;
                case 'cctable':
                    gameView.handleCCTable(data);
                    break;
                case 'ltable':
                    gameView.handleLTable(data);
                    break;
                case 'rtable':
                    gameView.handleRTable(data);
                    break;
                case 'lc':
                // {"evt":"lc","arr":[25,21,32,14,44,19,20,36,6,35,45,1,39],"T":12,"S":0,"rate":0,"score":0,"nameturn":"fb.105964707280388","deckCount":26,"firstRound":true}
                    gameView.startGame(data);
                    break;
                case 'dc':
                // {"nameturn":"fb.105964707280388","arr":[4,30,5,18],"evt":"dc","nextturn":"ahiha123","T":0,"newTurn":false}
                    gameView.danhBai(data.nameturn, data.nextturn, data.arr, data.newTurn);
                    break;
                case 'cc':
                // {"nameturn":"ahiha123","evt":"cc","nextturn":"fb.105964707280388","T":0,"newTurn":true}
                    gameView.boLuot(data.nameturn, data.nextturn, data.newTurn);
                    break;
                case 'cutCard':
                // {"evt":"cutCard","user":"ahiha123","agUser":1181800,"userCut":"annaly","agUserCut":833200,"ag":200000}
                    gameView.cutCard(data.user, data.agUser, data.userCut, data.agUserCut, data.ag);
                    break;
                case 'ace':
                // {"evt":"ace","data":"You can\u0027t discard this cards","T":0,"C":0,"rate":0,"score":0,"time":0}
                    gameView.danhBaiError(data.data);
                    break;
                case 'finish':
                // {"evt":"finish","data":"[{\"N\":\"ahiha123\",\"M\":-370,\"AG\":965738,\"ArrCard\":[44,45,6,19,32,20,21,35,36,25,39,1,14],\"point\":74,\"rate\":0,\"TypeWin\":-1,\"lstDenLang\":[]},{\"N\":\"fb.105964707280388\",\"M\":351,\"AG\":409,\"ArrCard\":[],\"point\":0,\"rate\":0,\"TypeWin\":0,\"lstDenLang\":[]}]","T":0,"C":0,"rate":0,"score":0,"time":0}
                    cc.NGWlog("Tien len : finihs handle");    
                    gameView.finishGameTienLen(data.data);
                    break;
                case 'uag':
                // {"evt":"uag","data":"[{\"N\":\"fb.173461193643727\",\"AG\":321},{\"N\":\"te.1556959617_460832d0-42e2-469a-abe8-b83b0541a248\",\"AG\":116},{\"N\":\"seth_tha2222\",\"AG\":269}]","T":0,"C":0,"rate":0,"score":0,"time":0}
                    gameView.updateMoney(data.data);
                    break;
                case 'chattable':
                    gameView.handleChatTable(data);
                    break;
            }
        }
    }
});

module.export = TienLenJsonParse;

