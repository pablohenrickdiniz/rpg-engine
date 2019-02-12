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
        ACTOR:'actor',
        ICON:'icon',
        ACTOR_DIRECTION_DOWN:0,
        ACTOR_DIRECTION_LEFT:1,
        ACTOR_DIRECTION_RIGHT:2,
        ACTOR_DIRECTION_UP:3,
        ACTOR_DIRECTION_RANDOM:4,
        ACTOR_STEP_DOWN:0,
        ACTOR_STEP_LEFT:1,
        ACTOR_STEP_RIGHT:2,
        ACTOR_STEP_UP:3,
        ACTOR_STOP_DOWN:4,
        ACTOR_STOP_LEFT:5,
        ACTOR_STOP_RIGHT:6,
        ACTOR_STOP_UP:7,
        STATUS_ON:'ON',
        STATUS_OFF:'OFF',
        BACKGROUND_LAYER:0,
        EVENT_LAYER:1,
        FOREGROUND_LAYER:2,
        EFFECT_LAYER:3,
        FADE_SCREEN_LAYER : 4
    };

    Object.freeze(Consts);

    Object.defineProperty(root,'Consts',{
        /**
         *
         * @returns {{UP: number, RIGHT: number, DOWN: number, LEFT: number, MOVE_FIXED: string, MOVE_ROUTE: string, ACTOR: string, ICON: string, ACTOR_DIRECTION_DOWN: number, ACTOR_DIRECTION_UP: number, ACTOR_DIRECTION_RIGHT: number, ACTOR_DIRECTION_LEFT: number, ACTOR_DIRECTION_RANDOM: number, ACTOR_STEP_DOWN: number, ACTOR_STEP_UP: number, ACTOR_STEP_RIGHT: number, ACTOR_STEP_LEFT: number, ACTOR_STOP_DOWN: number, ACTOR_STOP_UP: number, ACTOR_STOP_RIGHT: number, ACTOR_STOP_LEFT: number, TRIGGER_AUTO_RUN: number, TRIGGER_PLAYER_TOUCH: number, TRIGGER_ACTION_BUTTON: number, STATUS_ON: string, STATUS_OFF: string, BACKGROUND_LAYER: number, EVENT_LAYER: number, FOREGROUND_LAYER: number, EFFECT_LAYER: number, UI_LAYER: number, FADE_SCREEN_LAYER: number}}
         */
        get:function(){
            return Consts;
        }
    });
})(RPG);


