'use strict';
(function (root) {
    if(root.Consts === undefined){
        throw "Event_Page requires Consts";
    }

    if(root.Game_Character === undefined){
        throw "Event_Page requires Game_Character";
    }

    var Consts = root.Consts,
        Game_Character = root.Game_Character;

    var SWITCH_CONDITION_REGEX = /^(LOCAL|GLOBAL):([A-Za-z0-9]+):(ON|OFF)$/;

    /**
     *
     * @param options
     * @constructor
     */
    var Event_Page = function (options) {
        var self = this;
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
        self.movement_type = options.movement_type || Consts.MOVE_FIXED;
        self.walkingAnimation = options.walkingAnimation || false;
    };

    Event_Page.prototype = Object.create(Game_Character.prototype);
    Event_Page.prototype.constructor = Event_Page;

    Event_Page.prototype.update = function(){
        var self =this;
        switch(self.movement_type){
            case Consts.MOVE_ROUTE:
                if(self.route.length > 0 && self.currentMove !== -1){
                    if(self.route[self.currentMove] === undefined){
                        self.currentMove = self.repeatRoute?0:-1;
                    }
                    if(self.currentMove !== -1){
                        var move = self.route[self.currentMove];
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
     * @param condition
     */
    Event_Page.prototype.addCondition = function(condition){
        condition = condition.toUpperCase();
        if(SWITCH_CONDITION_REGEX.test(condition)){
            condition = condition.split(':');
            var scope = condition[0];
            var id = condition[1];
            var status = condition[2]==='ON';
            var self = this;
            if(self.conditions[scope] === undefined){
                self.conditions[scope] = [];
            }
            self.conditions[scope][id] = status;
        }
    };

    /**
     *
     * @param self
     */
    var initialize = function(self){
        var conditions = [];
        var through = null;
        var walkingAnimation =false;

        Object.defineProperty(self,'conditions',{
            /**
             *
             * @param cond
             */
            set:function(cond){
                conditions = [];
                var length = cond.length;
                for(var i =0; i < length;i++){
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
             * @returns {*}
             */
            get:function(){
                return through;
            },
            /**
             *
             * @param t
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
             * @param wa
             */
            set:function(wa){
                if(wa !== walkingAnimation){
                    walkingAnimation = wa;
                    if(self.event){
                        var event = self.event;
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


    root.Event_Page = Event_Page;
})(RPG);