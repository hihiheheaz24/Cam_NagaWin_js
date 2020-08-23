cc.Class({
    extends: cc.Component,

    properties: {
        edb_status: {
            default: null,
            type: cc.EditBox
        },
    },
    onClickUpdateStatus() {
        require('SoundManager1').instance.playButton();
        if (this.edb_status.string != "") {
            require("NetworkManager")
                .getInstance()
                .sendChangeStatus(this.edb_status.string);
        }
    },
    onClose() {
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
    }
});
