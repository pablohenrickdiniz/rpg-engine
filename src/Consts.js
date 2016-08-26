(function(root){
    var Consts = {
        UP:38,
        RIGHT:39,
        DOWN:40,
        LEFT:37,
        CHARACTER_STEP_UP:38,
        CHARACTER_STEP_RIGHT:39,
        CHARACTER_STEP_DOWN:40,
        CHARACTER_STEP_LEFT:37,
        TRIGGER_AUTO_RUN:4,
        TRIGGER_PLAYER_TOUCH:5,
        TRIGGER_ACTION_BUTTON:6,
        STATUS_ON:'ON',
        STATUS_OFF:'OFF'
    };

    Object.freeze(Consts);
    root.Consts = Consts;
})(RPG);


