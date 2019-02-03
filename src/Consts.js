/**
 * @requires RPG.js
 */
(function(root){
    let Consts = {
        UP:38,
        RIGHT:39,
        DOWN:40,
        LEFT:37,
        MOVE_FIXED:'fixed',
        MOVE_ROUTE:'route',
        ANIMATION_FIXED:'animation_fixed',
        ANIMATION_MOVE:'animation_move',
        CHARACTER:'character',
        ICON:'icon',
        CHARACTER_DIRECTION_DOWN:0,
        CHARACTER_DIRECTION_LEFT:1,
        CHARACTER_DIRECTION_RIGHT:2,
        CHARACTER_DIRECTION_UP:3,
        CHARACTER_DIRECTION_RANDOM:4,
        CHARACTER_STEP_DOWN:0,
        CHARACTER_STEP_LEFT:1,
        CHARACTER_STEP_RIGHT:2,
        CHARACTER_STEP_UP:3,
        CHARACTER_STOP_DOWN:4,
        CHARACTER_STOP_LEFT:5,
        CHARACTER_STOP_RIGHT:6,
        CHARACTER_STOP_UP:7,
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

    Object.defineProperty(root,'Consts',{
        /**
         *
         * @returns {{UP: number, RIGHT: number, DOWN: number, LEFT: number, MOVE_FIXED: string, MOVE_ROUTE: string, CHARACTER: string, ICON: string, CHARACTER_DIRECTION_DOWN: number, CHARACTER_DIRECTION_UP: number, CHARACTER_DIRECTION_RIGHT: number, CHARACTER_DIRECTION_LEFT: number, CHARACTER_DIRECTION_RANDOM: number, CHARACTER_STEP_DOWN: number, CHARACTER_STEP_UP: number, CHARACTER_STEP_RIGHT: number, CHARACTER_STEP_LEFT: number, CHARACTER_STOP_DOWN: number, CHARACTER_STOP_UP: number, CHARACTER_STOP_RIGHT: number, CHARACTER_STOP_LEFT: number, TRIGGER_AUTO_RUN: number, TRIGGER_PLAYER_TOUCH: number, TRIGGER_ACTION_BUTTON: number, STATUS_ON: string, STATUS_OFF: string, BACKGROUND_LAYER: number, EVENT_LAYER: number, FOREGROUND_LAYER: number, EFFECT_LAYER: number, UI_LAYER: number, FADE_SCREEN_LAYER: number}}
         */
        get:function(){
            return Consts;
        }
    });
})(RPG);


