
cc.Class({

    extends: cc.Component,

    properties: {
        lb_bonus: {
            default: null,
            type: cc.Label
        },
        lb_chip: {
            default: null,
            type: cc.Label
        },
        lb_price: {
            default: null,
            type: cc.Label
        },
        lb_rate: {
            default: null,
            type: cc.Label
        },
        iconChip: cc.Sprite,
        partner: "",
        url_l: "",
        amount: 0,
        payType: 0,
        shop: null,
        type: "",
        textBox: [],
        listSprItem: [cc.SpriteFrame]
    },

    init(data) {

        /*
        data=
         url: "https://pm.ngwcasino.com/fortumo/?userid=850211&price=1&msisdn=%phone%",
         txtPromo: "1$=80,000Chips",
        txtChip: "80,000Chips",
          txtBuy: "$1",
        txtBonus: "122%"
        cost:1
        */
        this.partner = data.partner;
        this.url_l = data.url;
        if (this.partner === 'iap') {
            this.amount = data.cost;
        }

        this.lb_chip.string = data.txtChip;
        this.lb_price.string = data.txtBuy;
        this.lb_rate.string = data.txtPromo;
        this.textBox = data.textBox;
        this.type = data.type;
        if (data.txtBonus != "") {
            this.lb_bonus.string = "+" + data.txtBonus;
            this.lb_bonus.node.getParent().active = true;
        } else {
            this.lb_bonus.node.getParent().active = false;
        }
        if (data.index > 4) data.index = 4;
        this.iconChip.spriteFrame = this.listSprItem[data.index];
    },

    onClickPrice() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickPrice_%s", require('GameManager').getInstance().getCurrentSceneName()));
        // require('SoundManager1').instance.playButton();
        let otps = {};
        if (IS_RUN_INSTANT_FACEBOOK) {

            FBInstant.payments.onReady(function () {
                cc.NGWlog('Payments Ready!');
            });
            cc.NGWlog('----------------purchase id  ', this.partner);
            FBInstant.payments.purchaseAsync({
                productID: this.partner,
                developerPayload: 'lengbear',
            }).then(function (purchase) {
                cc.NGWlog('----------------Handling a purchase   ');
                cc.NGWlog(purchase);
                cc.NGWlog(purchase.signedRequest);
                // { isConsumed: false, paymentID: "64000038701129", productID: "com.pack.1", purchaseTime: 1547777116, purchaseToken: "949171001941681", … } developerPayload: "sondt"isConsumed: falsepaymentID: "64000038701129"productID: "com.pack.1"purchaseTime: 1547777116purchaseToken: "949171001941681"signedRequest: "dvnOHq0H5rKVwPNF0Ye1S9t42A5NuAOpmHs6PHrM_ZA.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImFtb3VudCI6IjIzMDg1IiwiY3VycmVuY3kiOiJWTkQiLCJkZXZlbG9wZXJfcGF5bG9hZCI6InNvbmR0IiwiaXNfY29uc3VtZWQiOmZhbHNlLCJpc3N1ZWRfYXQiOjE1NDc3NzcxMjAsInBheW1lbnRfaWQiOiI2NDAwMDAzODcwMTEyOSIsInByb2R1Y3RfaWQiOiJjb20ucGFjay4xIiwicHVyY2hhc2VfdGltZSI6MTU0Nzc3NzExNiwicHVyY2hhc2VfdG9rZW4iOiI5NDkxNzEwMDE5NDE2ODEiLCJxdWFudGl0eSI6IjEiLCJyZXF1ZXN0X2lkIjoiIiwic3RhdHVzIjoiY29tcGxldGVkIn0"

                require('NetworkManager').getInstance().sendIAPFacebookInstant(JSON.stringify(purchase), purchase.signedRequest);
            });
        } else {
            if (this.partner === 'iap') {
                cc.NGWlog('---------> IAP:  ', (require('GameManager').getInstance().bundleID + "." + this.amount));
                require('Util').onBuyIap((require('GameManager').getInstance().bundleID + "." + this.amount));
                return;
            } else {
                let data = {};
                data.url = this.url_l;
                data.type = this.type;
                data.textBox = this.textBox;
                Global.ShopView.onClickItemShop(data);
            }


        }
    },
});

