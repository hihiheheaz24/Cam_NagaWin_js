var SoundManager1 = cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            default: null,
            type: cc.AudioSource,
        },
        soundGamelist: {
            default: null,
            type: cc.AudioClip,
        },
        bkg_SoundInGame: {
            default: null,
            type: cc.AudioClip,
        },
        soundWheel: {
            default: null,
            type: cc.AudioClip,
        },
        currentAudio: 0,
        soundActive: 0,
    },
    onLoad() {
        this.soundInGame = this.bkg_SoundInGame;
        SoundManager1.instance = this;
        let musicBkg = null;
        cc.loader.loadResDir('sounds', cc.AudioClip, (error, result) => {
            if (error !== null) {
            }
            cc.NGWlog('--------------------------> loadAllSound');
        });
    },

    start() {
    },
    /* Start :  Change Method Load Sound => dynamically */

    dynamicallyPlayMusic(_soundResource, _loop = false, _isSFX = true) {
        if (_isSFX) {
            if (this.isSFX == true) {
                cc.loader.loadRes(_soundResource, cc.AudioClip, (err, clip) => {
                    if (err) return;
                    this.currentAudio = cc.audioEngine.play(clip, _loop, 1);
                });
            } else {
                return;
            }
        } else {
            cc.audioEngine.stopAll();
            cc.loader.loadRes(_soundResource, cc.AudioClip, (err, clip) => {
                this.currentAudio = cc.audioEngine.play(clip, _loop, 0.7);
            });
        }
    },
    dynamicallyStopMusic() {
        cc.audioEngine.stop(this.currentAudio);
    },
    playMusicBackground() {
        let gameView = require("GameManager").getInstance().gameView;
        let currentView = require("GameManager").getInstance().currentView;
        if (currentView === CURRENT_VIEW.LOBBY || currentView === CURRENT_VIEW.GAMELIST_VIEW) {
            cc.NGWlog("soundmanagerLdeo co gameview!! ");
            this.audioSource.stop();
            this.audioSource.clip = this.soundGamelist;
            this.audioSource.play();
        } else {
            cc.NGWlog("soundmanagerL van  co gameview!! ");
            let curGameId = require("GameManager").getInstance().curGameId
            let bkg_sound = curGameId === GAME_ID.SLOT50LINE ? ResDefine.slot_bkg_music_9008 : ResDefine.slot_bkg_music_1010;
            if (curGameId === GAME_ID.SLOT50LINE || curGameId === GAME_ID.SLOT_20_LINE_JP) {
                cc.loader.loadRes(bkg_sound, cc.AudioClip, (err, clip) => {
                    if (err) return;
                    else {
                        this.soundInGame = clip;
                        this.audioSource.stop();
                        this.audioSource.clip = this.soundInGame;
                        this.audioSource.play();
                    }
                });
            }
            else {
                this.soundInGame = this.bkg_SoundInGame;
                this.audioSource.stop();
                this.audioSource.clip = this.soundInGame;
                this.audioSource.play();
            }
        }
    },
    stopMusic() {
        this.audioSource.stop();
    },
    playMusicIngame() { // this.dynamicallyPlayMusic('sounds/table_music', true, false);
        cc.audioEngine.stopAll();
        this.currentAudio = cc.audioEngine.play(this.soundInGame, true, 1);
    },
    stopEffect() {
        cc.audioEngine.stopAllEffects();
    },
    turnOffSFX() {
        this.isSFX = false;
    },
    turnOnSFX() {
        this.isSFX = true;;
    },

    _playSFX(clip) {
        if (!this.isSFX) return;
        cc.audioEngine.playEffect(clip, false);
    },

    playWin() {
        this.dynamicallyPlayMusic(ResDefine.winAudio)
    },

    playLose() {
        this.dynamicallyPlayMusic(ResDefine.loseAudio)
    },
    playBauCuaLose() {
        this.dynamicallyPlayMusic(ResDefine.loseAudio)
    },
    playBauCuaWin() {
        this.dynamicallyPlayMusic(ResDefine.baucua_win);
    },
    playBetMusic() {
        this.dynamicallyPlayMusic(ResDefine.sound_nemxu);
    },
    playClockHurry() {
        this.dynamicallyPlayMusic(ResDefine.clock_hurry);
    },
    playClockTick() {
        this.dynamicallyPlayMusic(ResDefine.clock_tick);
    },
    playDiceOpen() {
        this.dynamicallyPlayMusic(ResDefine.dice_open);
    },
    playDiceShake() {
        this.dynamicallyPlayMusic(ResDefine.dice_shake);
    },
    playChipLose() {
        this.dynamicallyPlayMusic(ResDefine.chip_lose);
    },
    playChipWin() {
        this.dynamicallyPlayMusic(ResDefine.chip_win);
    },
    playStart() {
        this.dynamicallyPlayMusic(ResDefine.sound_start);
    },
    playCard() {
        this.dynamicallyPlayMusic(ResDefine.cardAudio);
    },

    playChips() {
        this.dynamicallyPlayMusic(ResDefine.chipsAudio);
    },

    playButton() {
        this.dynamicallyPlayMusic(ResDefine.buttonAudio);
    },
    playTip() {
        this.dynamicallyPlayMusic(ResDefine.tipAudio);
    },
    playAllin() {
        this.dynamicallyPlayMusic(ResDefine.allinAudio);
    },
    playNemNhau(type) {
        let typeAu = ResDefine.newNhauAudio[type];
        this.dynamicallyPlayMusic(typeAu);
    },
    playRemove() {
        this.dynamicallyPlayMusic(ResDefine.remove_PLayer);
    },
    playJoin() {
        this.dynamicallyPlayMusic(ResDefine.join_PLayer);
    },
    playChiaBai() {
        this.dynamicallyPlayMusic(ResDefine.chiaBai);
    },

    playWheel() {
        let music = cc.sys.localStorage.getItem("sound");
        if (music === "on")
            this.audioWheel = cc.audioEngine.play(this.soundWheel, true, 1);
    },
    stopWheel() {
        cc.audioEngine.stop(this.audioWheel);
    },
    playBet() {
        this.dynamicallyPlayMusic(ResDefine.sound_bet);
    },
});

export default SoundManager1;