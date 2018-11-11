'use strict';
(function (root) {
    if(!root.Consts){
        throw "Event_Page requires Consts";
    }

    if(!root.Game_Character){
        throw "Event_Page requires Game_Character";
    }

    let Consts = root.Consts,
        Game_Character = root.Game_Character;

    let SWITCH_CONDITION_REGEX = /^(LOCAL|GLOBAL):([A-Za-z0-9]+):(ON|OFF)$/;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Event_Page = function (options) {
        let self = this;
        Game_Character.call(self, options);
        options = options || {};
        initialize(self);
        self.conditions = options.conditions || [];
        self.script = options.script || null;
        self.event = options.event || null;
        self.trigger = options.trigger || Consts.TRIGGER_AUTO_RUN;
        self.through = options.through || false;
        self.route = options.route || [];
        self.currentMove = 0;
        self.repeatRoute = options.repeatRoute || false;
        self.movementType = options.movementType || Consts.MOVE_FIXED;
        self.walkingAnimation = options.walkingAnimation || false;
        self.animationType = options.animationType || Consts.ANIMATION_MOVE;
    };

    Event_Page.prototype = Object.create(Game_Character.prototype);
    Event_Page.prototype.constructor = Event_Page;

    Event_Page.prototype.update = function(){
        let self =this;
        switch(self.movementType){
            case Consts.MOVE_ROUTE:
                if(self.route.length > 0 && self.currentMove !== -1){
                    if(self.route[self.currentMove] === undefined){
                        self.currentMove = self.repeatRoute?0:-1;
                    }
                    if(self.currentMove !== -1){
                        let move = self.route[self.currentMove];
                        self.currentMove++;

                        switch(move){
                            case 'MOVE_UP':
                                self.moveUp();
                                break;
                            case 'MOVE_DOWN':
                                self.moveDown();
                                break;
                            case 'MOVE_LEFT':
                                self.moveLeft();
                                break;
                            case 'MOVE_RIGHT':
                                self.moveRight();
                                break;
                        }
                    }
                }
        }

        Game_Character.prototype.update.call(self);
    };

    /**
     *
     * @param name {string|Array}
     * @returns {Game_Event}
     */
    Event_Page.prototype.enableSwitch = function(name){
        return this.event.enableSwitch(name);
    };

    /**
     *
     * @param name {string|array}
     * @returns {Game_Event}
     */
    Event_Page.prototype.disableSwitch = function(name){
        return this.event.disableSwitch(name);
    };

    /**
     *
     * @param name {string|array}
     * @returns {boolean}
     */
    Event_Page.prototype.isSwitchEnabled = function(name){
        return this.event.isSwitchEnabled(name);
    };

    /**
     *
     * @param name {string|Array}
     * @returns {boolean}
     */
    Event_Page.prototype.isSwitchDisabled = function(name){
        return this.event.isSwitchDisabled(name);
    };

    /**
     *
     * @param names {string|Array}
     * @returns {Game_Event}
     */
    Event_Page.prototype.enableGlobalSwitch = function (names) {
        return this.event.enableGlobalSwitch(names);
    };

    /**
     *
     * @param names {string|Array}
     * @returns {Game_Event}
     */
    Event_Page.prototype.disableGlobalSwitch = function (names) {
        return this.event.disableGlobalSwitch(names);
    };

    /**
     *
     * @param names {string|Array}
     * @returns {boolean}
     */
    Event_Page.prototype.isGlobalSwitchEnabled = function (names) {
        return this.event.isGlobalSwitchEnabled(names);
    };

    /**
     *
     * @param names {string|Array}
     * @returns {boolean}
     */
    Event_Page.prototype.isGlobalSwitchDisabled = function (names) {
        return this.event.isGlobalSwitchDisabled(names);
    };

    /**
     *
     * @param type {string}
     * @param name {string}
     * @returns {Game_Event}
     */
    Event_Page.prototype.playAudio = function(type,name){
        return this.event.playAudio(type,name);
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Game_Event}
     */
    Event_Page.prototype.on = function(eventName,callback){
        return this.event.on(eventName,callback);
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Game_Event}
     */
    Event_Page.prototype.off = function(eventName,callback){
        return this.event.off(eventName,callback);
    };

    /**
     *
     * @param eventName {string}
     * @param args {Array}
     * @returns {Game_Event}
     */
    Event_Page.prototype.trigger = function(eventName,args){
        return this.event.trigger(eventName,args);
    };

    /**
     *
     * @param condition {string}
     * @returns {Event_Page}
     */
    Event_Page.prototype.addCondition = function(condition){
        let self = this;
        condition = condition.toUpperCase();
        if(SWITCH_CONDITION_REGEX.test(condition)){
            condition = condition.split(':');
            let scope = condition[0];
            let id = condition[1];
            let status = condition[2]==='ON';
            if(self.conditions[scope] === undefined){
                self.conditions[scope] = [];
            }
            self.conditions[scope][id] = status;
        }
        return self;
    };

    /**
     *
     * @param self {Event_Page}
     */
    let initialize = function(self){
        let conditions = [];
        let through = false;
        let walkingAnimation =false;

        Object.defineProperty(self,'conditions',{
            /**
             *
             * @param cond {object}
             */
            set:function(cond){
                conditions = [];
                let length = cond.length;
                for(let i =0; i < length;i++){
                    self.addCondition(cond[i]);
                }
            },
            /**
             *
             * @returns {Array}
             */
            get:function(){
                return conditions;
            }
        });

        Object.defineProperty(self,'through',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return through;
            },
            /**
             *
             * @param t {boolean}
             */
            set:function(t){
                if(t !== through){
                    through = t;
                    if(through){
                        self.removeCollisionGroup('STEP');
                    }
                    else{
                        self.addCollisionGroup('STEP');
                    }
                }
            }
        });

        Object.defineProperty(self,'walkingAnimation',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return walkingAnimation;
            },
            /**
             *
             * @param wa {Game_Animation}
             */
            set:function(wa){
                if(wa !== walkingAnimation){
                    walkingAnimation = wa;
                    if(self.event){
                        let event = self.event;
                        if(walkingAnimation && !event.currentAnimation.running){
                            event.currentAnimation.start();
                        }
                        else if(!walkingAnimation && event.currentAnimation.running){
                            event.currentAnimation.stop();
                        }
                    }
                }
            }
        });
    };

    Object.defineProperty(root,'Event_Page',{
        /**
         *
         * @returns {Event_Page}
         */
        get:function(){
            return Event_Page;
        }
    });
})(RPG);