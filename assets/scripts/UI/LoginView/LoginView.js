// const NetworkManager = require('NetworkManager').getInstance()
const GameManager = require('GameManager').getInstance()

var LoginView = cc.Class({
    extends: cc.Component,

    properties: {
        node_form: {
            default: null,
            type: cc.Node
        },
        node_input: {
            default: null,
            type: cc.Node
        },
        node_model: {
            default: null,
            type: cc.Node
        },
        edit_user: {
            default: null,
            type: cc.EditBox
        },
        edit_pass: {
            default: null,
            type: cc.EditBox
        },

        btn_reg: {
            default: null,
            type: cc.Button
        },
        // btn_login: {
        //     default: null,
        //     type: cc.Button
        // },

        btn_login_main: {
            default: null,
            type: cc.Button
        },
        btn_playnow: {
            default: null,
            type: cc.Button
        },
        btn_fb: {
            default: null,
            type: cc.Button
        },
        lb_playnow: {
            default: null,
            type: cc.Label
        },
        btn_admin: {
            default: null,
            type: cc.Button
        },
        lb_permission: {
            default: null,
            type: cc.Label
        },
        node_permission: {
            default: null,
            type: cc.Node
        },
        lb_Support: cc.Label,
        lb_version: cc.Label,
        isClickLogin: false,
        editboxTest: cc.EditBox,
    },

    statics: {
        instance: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.LoginView = this;
        Global.MainView = cc.find("Canvas/Main").getComponent("MainView");
        require("UIManager").instance.loadingBar.node.active = false;
        if (cc.sys.isBrowser) require("NetworkManager").getInstance().initFb();
        cc.loader.loadResDir("logo/anim_iconJS", (count, totalcount) => { }, (err, prefabs) => {
            if (err) return;
            cc.log("load xong dir logo");
        });
        if (require("ConfigManager").getInstance().isShowLog)
            cc.NGWlog = console.log
        else
            cc.NGWlog = cc.log;

    },
    onTest() {
        require("GameManager").getInstance().effRunNumber(this.lb_test, 34567, 30000, 1);
    },
    onEnable() {
        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     if(require("GameManager").getInstance().isShowPermission == false){
        //         require("GameManager").getInstance().isShowPermission = true;
        //         let first = cc.sys.localStorage.getItem("firstOpenGame");
        //         if (first === null || typeof first === 'undefined' || first === false) {
        //             cc.NGWlog("===D hien permission");
        //             cc.sys.localStorage.setItem("firstOpenGame", true);
        //             this.node_permission.active = true;
        //             this.lb_permission.string = require('GameManager').getInstance().getTextConfig("note_permission");
        //         }else{
        //             cc.NGWlog("===D ko hien permission");
        //             this.node_permission.active = false;
        //             require("Util").sendCheck2Sim();
        //         }
        //     }
        // }//duy test

        let lastLogin = cc.sys.localStorage.getItem("lastLogin");
        if (lastLogin == null) {
            lastLogin = 1;
        }
        require("GameManager").getInstance().typeLogin = parseInt(lastLogin);


        Global.MainView._isClickGame = true;
        require('UIManager').instance.alertView.hideAlert();
        Global.TopGameView.listTopGame.content.removeAllChildren();
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.LOGIN_VIEW);
        this.isClickLogin = false;
        require("GameManager").getInstance().isLoginSucces = false;

        require('GameManager').getInstance().initConfigText();
        require("GameManager").getInstance().getGameIdSeverIp();

        this.node_input.position = cc.v2(cc.winSize.width, 0);
        this.node_form.position = cc.v2((cc.winSize.width - this.node_form.width) / 2, -this.node_form.height / 2);//cc.v2(240, 0);
        require('GameManager').getInstance().isChooseGame = false;
        require('GameManager').getInstance().invitePlayGame = true;
        cc.log("SV IP==" + require('GameManager').getInstance().curServerIp);
        require('NetworkManager').getInstance().connect_sv(require('GameManager').getInstance().curServerIp, '');
        if (IS_RUN_INSTANT_FACEBOOK) {
            if (require('NetworkManager').getInstance().connected)
                require('GameManager').getInstance().onLoginFBInstant();
            else {
                require('GameManager').getInstance().startLogin = true;
            }
            this.btn_playnow.node.parent.active = false;
            return;
        }
        this.btn_playnow.node.parent.active = true;
        var uname = cc.sys.localStorage.getItem('user_name');
        var pass = cc.sys.localStorage.getItem('password');

        if (uname !== null) {
            this.edit_user.string = uname;
            require('GameManager').getInstance().user_name = uname
        }
        if (pass != null) {
            //  cc.NGWlog('pass cua no la================= ' + pass);
            this.edit_pass.string = pass;
            require('GameManager').getInstance().user_pass = pass;
        }
        if (!cc.sys.isNative) {
            this.isPrivateMode().then((isPrivate) => {
                cc.NGWlog('-------Is in private mode: ', isPrivate);
                if (isPrivate) {
                    // interactable
                    Global.LoginView.setIsPrivate();
                }
            });
        }
        require('SoundManager1').instance.stopMusic();
        this.lb_Support.node.active = require("ConfigManager").getInstance().is_bl_fb;
        this.lb_Support.string ='Fb.com/'+require("ConfigManager").getInstance().fanpageID;

        let strVer = ""
        if (require("GameManager").getInstance().versionA != null)
            strVer = " - " + require("GameManager").getInstance().versionA;
        this.lb_version.string = require("GameManager").getInstance().versionGame + strVer + " - " + require("ConfigManager").getInstance().disID;
        this.btn_admin.node.active = require("ConfigManager").getInstance().is_bl_fb;
    },
    setIsPrivate() {
        cc.NGWlog("========> Private Mode");
        this.btn_playnow.node.active = false;
        // this.btn_login_main.node.position = cc.v2(this.btn_fb.node.x, this.btn_login_main.node.y);
    },
    isPrivateMode() { // mo ctrl shift N;
        return new Promise((resolve) => {
            const on = () => resolve(true); // is in private mode
            const off = () => resolve(false); // not private mode
            const testLocalStorage = () => {
                try {
                    if (localStorage.length) off();
                    else {
                        localStorage.x = 1;
                        localStorage.removeItem('x');
                        off();
                    }
                } catch (e) {
                    // Safari only enables cookie in private mode
                    // if cookie is disabled then all client side storage is disabled
                    // if all client side storage is disabled, then there is no point
                    // in using private mode
                    navigator.cookieEnabled ? on() : off();
                }
            };
            // Chrome & Opera
            if (window.webkitRequestFileSystem) {
                return void window.webkitRequestFileSystem(0, 0, off, on);
            }
            // Firefox
            if ('MozAppearance' in document.documentElement.style) {
                const db = indexedDB.open('test');
                db.onerror = on;
                db.onsuccess = off;
                return void 0;
            }
            // // Safari
            // if (/constructor/i.test(window.HTMLElement)) {
            //     return testLocalStorage();
            // }
            const isSafari = navigator.userAgent.match(/Version\/([0-9\._]+).*Safari/);
            if (isSafari) {
                const version = parseInt(isSafari[1], 10);
                if (version >= 11) {
                    try {
                        window.openDatabase(null, null, null, null);
                        return off();
                    } catch (_) {
                        return on();
                    };
                } else if (version < 11) {
                    return testLocalStorage();
                }
            }
            // IE10+ & Edge
            if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
                return on();
            }

            // others
            return off();
        });
    },
    // TextChangeBegan(){
    //     cc.NGWlog("========= " + this.edit_user.string);
    // },
    // TextChangeEnd(){
    //     cc.NGWlog("========= " + this.edit_user.string);
    // },
    // TextChangeReturn(){
    //     cc.NGWlog("========= " + this.edit_user.string);
    // },
    // TextChange(){
    //     cc.NGWlog("========= " + this.edit_user.string);
    // },

    onClickShowInput(event, data) {
        if (require('NetworkManager').getInstance().statusConnect != 2) {
            require('NetworkManager').getInstance().connect_sv(cc.sys.localStorage.getItem("curServerIp" + NAME_GAME), '');
        }
        this.isClickLogin = false;
        if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickLoginWithId_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        if (this.node_form.getNumberOfRunningActions() > 0) return;
        var siz = cc.winSize;
        this.node_input.active = true;
        this.node_form.runAction(cc.sequence(cc.moveTo(.2, cc.v2(siz.width * 1.5, -this.node_form.height / 2)).easing(cc.easeBackOut(1)), cc.callFunc(function () {
            cc.NGWlog('chay vao ham run ra')
            this.node_input.runAction(cc.moveTo(.2, cc.v2(0, 0)).easing(cc.easeBackOut(1)));
            this.node_form.active = false;
        }, this)));
    },
    onClickHideInput() {
        require('SoundManager1').instance.playButton();
        this.isClickLogin = false;
        if (this.node_input.getNumberOfRunningActions() > 0) return;
        var siz = cc.winSize;
        this.node_form.active = true;
        this.node_input.runAction(cc.sequence(cc.moveTo(.2, cc.v2(siz.width, 0)).easing(cc.easeBackOut(1)), cc.callFunc(function () {
            this.node_form.runAction(cc.moveTo(.2, cc.v2((siz.width - this.node_form.width) / 2, -this.node_form.height / 2)).easing(cc.easeBackOut()));
            this.node_input.active = false;
        }, this)));
    },
    onClickLogin() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickLogin_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickLogin_WithID");
        require('SoundManager1').instance.playButton();
        if (require('NetworkManager').getInstance().statusConnect != 2) {
            require('NetworkManager').getInstance().connect_sv(cc.sys.localStorage.getItem("curServerIp" + NAME_GAME), '');
            //  return;
        }

        var user_name = this.edit_user.string;
        var user_pass = this.edit_pass.string;

        if (user_name === '' || user_pass === '') {
            cc.NGWlog('=======> Khong duoc de trong!');
            // GameManager.onShowConfirmDialog('Khong duoc de trong!');
            return;
        }

        // if (user_name.length < 6 || user_pass.length < 6) {
        //     cc.NGWlog('=======> Mat khau khong duoc ngan qua!');
        //     return;
        // }
        // user_name: "",
        //     user_pass: "",
        GameManager.user_name = user_name;
        GameManager.user_pass = user_pass;
        GameManager.typeLogin = LOGIN_TYPE.NORMAL;
        cc.sys.localStorage.setItem("lastLogin", LOGIN_TYPE.NORMAL);

        this.isClickLogin = true;
        require('NetworkManager').getInstance().onLogin(user_name, user_pass, false);
    },
    onClickPlayNow(event, data) {
        // require("UIManager").instance.onShowListBaner();
        // return;
        require('SoundManager1').instance.playButton();
        // if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickPlayNow_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickLogin_Continue");
        GameManager.typeLogin = LOGIN_TYPE.PLAYNOW;
        if (require('NetworkManager').getInstance().statusConnect != 2) {
            require('NetworkManager').getInstance().connect_sv(cc.sys.localStorage.getItem("curServerIp" + NAME_GAME), '');
            GameManager.isReconnect = true;
            return;
        }



        GameManager.onShowHideWaiting(true);
        cc.sys.localStorage.setItem("lastLogin", LOGIN_TYPE.PLAYNOW);
        require('NetworkManager').getInstance().onPlayNow();

        this.isClickLogin = true;

    },


    onClickLoginFacebook(event, data) {
        // let strData = "{\"event\":\"banner\",\"data\":[{\"arrButton\":[{\"type\":\"sms\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.5,0.5]},{\"type\":\"iap\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.25,0.5]},{\"type\":\"openlink\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.75,0.5]},{\"type\":\"showwebview\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.3,0.25]},{\"type\":\"ok\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.8,0.25]}],\"_id\":\"5d91d14eabad411338f5dd2d\",\"id\":\"5d91825f8cbf0a0ed591e349\",\"title\":\"title Data5\",\"urlImg\":\"https:\/\/img.pokemondb.net\/artwork\/large\/bulbasaur.jpg\",\"urlLink\":\"https:\/\/www.google.com\/\"},{\"arrButton\":[{\"type\":\"sms\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.5,0.5]},{\"type\":\"iap\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.25,0.5]},{\"type\":\"openlink\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.75,0.5]},{\"type\":\"showwebview\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.3,0.25]},{\"type\":\"ok\",\"urlBtn\":\"https:\/\/iaibloggertips.files.wordpress.com\/2014\/05\/0ea98-back-to-top-button-for-blogger4-3.png\",\"pos\":[0.8,0.25]}],\"_id\":\"5d91d14eabad411338f5dd2e\",\"id\":\"5d91825f8cbf0a0ed591e347\",\"title\":\"title Data3\",\"urlImg\":\"https:\/\/img.pokemondb.net\/artwork\/large\/bulbasaur.jpg\",\"urlLink\":\"https:\/\/www.google.com\/\"}]}"
        // let dataa = JSON.parse(strData);
        // require("UIManager").instance.handleBannerIO(dataa.data);
        // return;
        //hien tesst
        // require('GameManager').getInstance().gameView = cc.instantiate(require('UIManager').instance.Baccarat_GameViewPr).getComponent("BaccaratView");
        // require('UIManager').instance.instantiate_parent.addChild(require('GameManager').getInstance().gameView.node);
        // var data = {
        //     evt: "demo"
        // };

        // require('NetworkManager').getInstance().sendLocalService(JSON.stringify(data));
        // return;
        //hien test
        require('SoundManager1').instance.playButton();
        // if (data == 1) 
        cc.sys.localStorage.setItem("lastLogin", LOGIN_TYPE.FACEBOOK);
        require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickLogin_Facebook");
        GameManager.typeLogin = LOGIN_TYPE.FACEBOOK;
        if (require('NetworkManager').getInstance().statusConnect != 2) {
            require('NetworkManager').getInstance().connect_sv(cc.sys.localStorage.getItem("curServerIp" + NAME_GAME), '');
            GameManager.isReconnect = true;
            return;
        }


        cc.NGWlog('----------------------> onClickLoginFacebook');
        if (cc.sys.isNative) {
            this.isClickLogin = true;
            require('Util').onLoginFb();
        } else {

            this.isClickLogin = true;
            // require('GameManager').getInstance().access_token = "EAAHgB0qePxYBAI9CFLF9rMGgZBs4uysyhZB7Mk8wFLPdiBKBa26b5DZBZCZCf9YXGn3ly8zer33xaQs2HUnlnHcymvH3wEqCL7GCD3Y0rhCgrQA9cuo31Abv84uuKR4YREOiS1q3kPu7wVBsIYKSANeAY0jdA7OYKrCnZAOO0D9AZDZD";
            // require('NetworkManager').getInstance().onLogin("1", require('GameManager').getInstance().access_token, false);
            // return;//duy test

            FB.login(function (response) {
                if (response.status === 'connected') {
                    require('GameManager').getInstance().access_token = response.authResponse.accessToken;
                    require('NetworkManager').getInstance().onLogin("1", require('GameManager').getInstance().access_token, false);
                } else {
                    cc.NGWlog("The person is not logged into this app or we are unable to tell.");
                }
            }, { scope: 'public_profile, email' });
        }
    },
    contactAdmin() {
        cc.NGWlog('Contact admin!!!!');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickContactAdmin_%s", require('GameManager').getInstance().getCurrentSceneName()));
        //cc.sys.openURL(require("GameManager").getInstance().u_chat_fb);
        require("Util").onChatAdmin();
    },
    onAllow() {
        require("Util").sendCheck2Sim();
        this.node_permission.active = false;
    },
    onDeny() {
        require("Util").sendCheck1Sim();
        this.node_permission.active = false;
    },

});

module.export = LoginView;