var User = cc.Class({
	name: 'User',
	ctor: function () {
	},
	properties: {
		id: 0,
		lq: {
			default: 0
		},
		ag: {
			default: 0
		},
		agSafe: {
			default: 0
		},
		ce: {
			default: 0
		},
		lastGameID: {
			default: 0
		},
		onlineDay: {
			default: 0
		},
		promotionDay: {
			default: 0
		},
		listPromotionDay: {
			default: [],
			type: [cc.String]
		},
		vipPoint: {
			default: 0
		},
		vip: {
			default: 0
		},
		mvip: {
			default: 0
		},
		level: {
			default: 0
		},
		mLevel: {
			default: 0
		},
		mMaxLevel: {
			default: 100
		},
		avt: {
			default: 1
		},
		nm: {
			default: 0
		},
		nmAg: {
			default: 0
		},
		avtId: {
			default: 0
		},
		userNameLQ: {
			default: ""
		},
		uname: {
			default: ""
		},

		co: 0.0,
		co0: 0.0,
		lqsms: 0.0,
		lqiap: 0.0,
		lqother: 0.0,
		blq1: 0.0,
		blq3: 0.0,
		blq5: 0.0,
		blq7: 0.0,
		avg7: 0.0,
		group: 0,
		

		_displayName:null,
        displayName:{
            get(){
                if(this._displayName == null) return this.uname;
                return this._displayName
            },
            set(value){
                if(value != null && typeof value != 'undefined')
                this._displayName = value;
            }   
        },
		tinyURL: {
			default: ""
		},
		avatarUrl: {
			default: ""
		},
		status: {
			default: ""
		},
		auth: {
			default: ""
		},
	},
});

module.exports = User;