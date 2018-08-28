'use strict';
(function(root){
    var Consts = {
        UP:38,
        RIGHT:39,
        DOWN:40,
        LEFT:37,
        MOVE_FIXED:'fixed',
        MOVE_ROUTE:'route',
        CHARACTER:'character',
        ICON:'icon',
        CHARACTER_DIRECTION_DOWN:0,
        CHARACTER_DIRECTION_UP:3,
        CHARACTER_DIRECTION_RIGHT:2,
        CHARACTER_DIRECTION_LEFT:1,
        CHARACTER_DIRECTION_RANDOM:4,
        CHARACTER_STEP_DOWN:0,
        CHARACTER_STEP_UP:1,
        CHARACTER_STEP_RIGHT:2,
        CHARACTER_STEP_LEFT:3,
        CHARACTER_STOP_DOWN:4,
        CHARACTER_STOP_UP:5,
        CHARACTER_STOP_RIGHT:6,
        CHARACTER_STOP_LEFT:7,
        TRIGGER_AUTO_RUN:4,
        TRIGGER_PLAYER_TOUCH:5,
        TRIGGER_ACTION_BUTTON:6,
        STATUS_ON:'ON',
        STATUS_OFF:'OFF',
        BACKGROUND_LAYER:0,
        EVENT_LAYER:1,
        FOREGROUND_LAYER:2,
        EFFECT_LAYER:3,
        UI_LAYER:4,
        FADE_SCREEN_LAYER : 2
    };

    Object.freeze(Consts);
    root.Consts = Consts;
})(RPG);


