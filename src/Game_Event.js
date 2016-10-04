(function (root) {
    if (root.Game_Character == undefined) {
        throw "Game_Event requires Character"
    }

    if(root.Event_Page == undefined){
        throw "Game_Event requires Event_Page"
    }

    var Event_Page = root.Event_Page;


    var Game_Character = root.Game_Character;

    /**
     *
     * @param options
     * @constructor
     */
    var Game_Event = function (options) {
        var self = this;
        Game_Character.call(self, options);
        self.switches = [];
        self.currentPage = null;
        self.pages = options.pages || [];
        self.bounds.groups.push('ACTION_BUTTON');
        initialize(self);
        updateCurrentPage(self);
    };

    Game_Event.prototype = Object.create(Game_Character.prototype);
    Game_Event.prototype.constructor = Game_Event;

    /**
     *
     * @param name
     * @returns {boolean}
     */
    Game_Event.prototype.isEnabled = function(name){
        var self = this;
        return self.switches[name] == true;
    };

    /**
     *
     * @param name
     */
    Game_Event.prototype.enableSwitch = function (name) {
        var self = this;
        if(!self.switches[name]){
            self.switches[name] = true;
            updateCurrentPage(self);
        }
    };

    /**
     *
     * @param name
     */
    Game_Event.prototype.disableSwitch = function (name) {
        var self = this;
        if(self.switches[name]){
            delete self.switches[name];
            updateCurrentPage(self);
        }
    };

    /**
     *
     * @param name
     * @param callback
     */
    Game_Event.prototype.switchCallback = function (name, callback) {
        var self = this;
        if (self.switches_callbacks[name] === undefined) {
            self.switches_callbacks[name] = [];
        }

        self.switches_callbacks[name].push(callback);
    };

    /**
     *
     * @param page
     */
    Game_Event.prototype.add = function (page) {
        var self = this;
        if(page instanceof Event_Page){
            self.pages.push(page);
        }
    };

    Game_Event.prototype.remove = function(page){
        var self = this;
        var index = self.pages.indexOf(page);
        if(index != -1){
            self.pages.splice(index,1);
        }
    };

    Game_Event.prototype.update = function(){
        var self =this;
        if (self.currentPage !== null) {
            if (!self.moving) {
                if (self.graphic !== null) {
                    self.animations[self.direction].pauseToFrame(1);
                }
            }
            else {
                self.refreshed = false;
            }
        }
    };

    /**
     *
     * @param self
     */
    var initialize = function(self){
        var length = self.pages.length;
        for(var i =0; i < length;i++){
            self.pages[i].event = self;
        }

        var currentPage = null;

        Object.defineProperty(self, 'graphic', {
            get: function () {
                if (currentPage !== null && currentPage.graphic !== null) {
                    return currentPage.graphic;
                }
                return null;
            }
        });


        Object.defineProperty(self,'currentPage',{
            get:function(){
                return currentPage;
            },
            set:function(cp){
                if(cp != currentPage){
                    currentPage = cp;
                    if(currentPage.through){
                        self.removeCollisionGroup('STEP');
                    }
                    else{
                        self.addCollisionGroup('STEP');
                    }
                }
            }
        });

        Object.defineProperty(self,'through',{
            get:function(){
                return currentPage || true;
            },
            set:function(t){
                if(currentPage){
                    currentPage.through = t;
                }
            }
        });
    };

    /**
     *
     * @param self
     */
    var updateCurrentPage = function(self){
        var pages = self.pages;
        var length = pages.length;
        var currentPage = null;
        for(var i =0; i < length;i++){
            if(validateConditions(pages[i])){
                currentPage = pages[i];
            }
        }
        self.currentPage = currentPage;
    };

    /**
     *
     * @param page
     * @returns {boolean}
     */
    var validateConditions = function(page){
        var conditions = page.conditions;
        var event = page.event;
        for(var scope in conditions){
            switch(scope){
                case 'LOCAL':
                    for(var id in conditions[scope]){
                        var status = event.switches[id]?true:false;
                        if(conditions[scope][id] != status){
                            return false;
                        }
                    }
            }
        }

        return true;
    };

    root.Game_Event = Game_Event;
})(RPG);