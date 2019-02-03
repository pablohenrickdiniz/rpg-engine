/**
 * @requires Consts.js
 */
(function (root) {
    let Consts = root.Consts;
    let SWITCH_CONDITION_REGEX = /^(LOCAL|GLOBAL):([A-Za-z0-9]+):(ON|OFF)$/;
    let triggers = [
        Consts.TRIGGER_ACTION_BUTTON,
        Consts.TRIGGER_AUTO_RUN,
        Consts.TRIGGER_PLAYER_TOUCH
    ];

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Event_Page = function (options) {
        let self = this;
        options = options || {};
        initialize(self);
        self.conditions = options.conditions || [];
        self.script = options.script;
        self.initialize = options.initialize;
        self.event = options.event || null;
        self.trigger = options.trigger || [Consts.TRIGGER_AUTO_RUN];
        self.options = {
            through :options.through || false,
            route : options.route || [],
            repeatRoute : options.repeatRoute || false,
            movementType : options.movementType || Consts.MOVE_FIXED,
            walkingAnimation : options.walkingAnimation || false,
            animationType : options.animationType || Consts.ANIMATION_MOVE,
            static: options.static,
            width: options.width,
            height:options.height,
            charaID: options.charaID,
            light:options.light,
            lightRadius:options.lightRadius
        };
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

    Event_Page.prototype.executeScript = function(){
        let self = this;
        if(self.script !== null){
            self.script.apply(self.event,arguments);
        }
        return self;
    };

    Event_Page.prototype.isTrigger = function(tgr){
        let self = this;
        return self.trigger.indexOf(tgr) !== -1;
    };

    /**
     *
     * @param self {Event_Page}
     */
    let initialize = function(self){
        let conditions = [];
        let options = {};
        let trigger = [];
        let script = null;
        let initialize = null;

        Object.defineProperty(self,'script',{
            /**
             *
             * @returns {function}
             */
            get:function(){
                return script;
            },
            /**
             *
             * @param s {function}
             */
            set:function(s){
                if(s === null || typeof s === 'function'){
                    script = s;
                }
            }
        });

        Object.defineProperty(self,'initialize',{
            /**
             *
             * @returns {function}
             */
            get:function(){
                return initialize;
            },
            /**
             *
             * @param s {function}
             */
            set:function(s){
                if(s === null || typeof s === 'function'){
                    initialize = s;
                }
            }
        });


        Object.defineProperty(self,'options',{
            /**
             *
             * @returns {{}}
             */
            get:function(){
                return options;
            },
            set:function(o){
                if(o.constructor === {}.constructor){
                    options = o;
                }
            }
        });

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

        Object.defineProperty(self,'trigger',{
            get:function(){
                return trigger;
            },
            set:function(tgr){
                if(!(tgr instanceof  Array)){
                    tgr = [tgr];
                }
                tgr.filter(function(t){
                    return triggers.indexOf(t) !== -1;
                });
                trigger = tgr;
            }
        })
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