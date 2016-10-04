(function (root) {
    if(root.Consts == undefined){
        throw "Event_Page requires Consts"
    }

    var Consts = root.Consts;
    var SWITCH_CONDITION_REGEX = /^(LOCAL|GLOBAL):([A-Za-z0-9]+):(ON|OFF)$/;

    var Event_Page = function (options) {
        var self = this;
        options = options || {};
        initialize(self);
        self.conditions = options.conditions || [];
        self.graphic = options.graphic || null;
        self.script = options.script || null;
        self.event = options.event || null;
        self.trigger = options.trigger || Consts.TRIGGER_AUTO_RUN;
        self.through = options.through || false;
    };


    Event_Page.prototype.addCondition = function(condition){
        condition = condition.toUpperCase();
        if(SWITCH_CONDITION_REGEX.test(condition)){
            condition = condition.split(':');
            var scope = condition[0];
            var id = condition[1];
            var status = condition[2]=='ON';
            var self = this;
            if(self.conditions[scope] == undefined){
                self.conditions[scope] = [];
            }
            self.conditions[scope][id] = status;
        }
    };


    var initialize = function(self){
        var conditions = [];
        var through = false;

        Object.defineProperty(self,'conditions',{
            set:function(cond){
                conditions = [];
                var length = cond.length;
                for(var i =0; i < length;i++){
                    self.addCondition(cond[i]);
                }
            },
            get:function(){
                return conditions;
            }
        });

        Object.defineProperty(self,'through',{
            get:function(){
                return through;
            },
            set:function(t){
                if(t != through){
                    through = t;
                    if(self.event && self.event.currentPage == self){
                        if(through){
                            self.event.removeCollisionGroup('STEP');
                        }
                        else{
                            self.event.addCollisionGroup('STEP');
                        }
                    }
                }
            }
        });
    };


    root.Event_Page = Event_Page;
})(RPG);