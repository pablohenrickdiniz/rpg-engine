(function (root) {
    if (root.Game_Character == undefined) {
        throw "Game_Event requires Character"
    }

    if(root.Event_Page == undefined){
        throw "Game_Event requires Event_Page"
    }

    var Event_Page = root.Event_Page;


    var Game_Character = root.Game_Character,
        Consts = root.Consts;

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
        self.through = true;
        initialize(self);
        self.updateCurrentPage();
    };

    Game_Event.prototype = Object.create(Game_Character.prototype);
    Game_Event.prototype.constructor = Game_Event;


    Game_Event.prototype.newPage = function(options) {
        options = options || {};
        var self = this;
        var page = new Event_Page(options);
        self.pages.push(page);
        self.updateCurrentPage();
        return page;
    };

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
            self.updateCurrentPage();
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
            self.updateCurrentPage();
        }
    };


    /**
     *
     * @param page
     */
    Game_Event.prototype.add = function (page) {
        var self = this;
        if(page instanceof Event_Page && self.pages.indexOf(page) == -1){
            self.pages.push(page);
            self.updateCurrentPage();
        }
    };

    Game_Event.prototype.remove = function(page){
        var self = this;
        var index = self.pages.indexOf(page);
        if(index != -1){
            self.pages.splice(index,1);
            self.updateCurrentPage();
        }
    };

    Game_Event.prototype.update = function(){
        var self =this;
        if (!self.moving && self.currentPage !== null) {
            var page = self.currentPage;
            switch(page.movement_type){
                case Consts.MOVE_ROUTE:
                    if(page.route.length > 0 && page.currentMove != -1){
                        if(page.route[page.currentMove] == undefined){
                             page.currentMove = page.repeatRoute?0:-1;
                        }
                        if(page.currentMove != -1){
                            var move = page.route[page.currentMove];
                            page.currentMove++;

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
        }

        Game_Character.prototype.update.call(self);
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
        var currentAnimation = self.currentAnimation;

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
                    if(currentPage != null){
                        if(currentPage.through){
                            self.removeCollisionGroup('STEP');
                        }
                        else{
                            self.addCollisionGroup('STEP');
                        }

                        if(self.currentAnimation.running && !currentPage.walkingAnimation){
                            self.currentAnimation.stop();
                        }
                        else if(!self.currentAnimation.running && currentPage.walkingAnimation){
                            self.currentAnimation.start();
                        }
                    }
                    else{
                        self.removeCollisionGroup('STEP');
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



        Object.defineProperty(self,'currentAnimation',{
            get:function(){
                return currentAnimation;
            },
            set:function(ca){
                if(currentAnimation != ca){
                    if(currentAnimation != null){
                        currentAnimation.stop(self.graphic.startFrame);
                    }
                    currentAnimation = ca;
                    if(self.walkingAnimation){
                        self.currentAnimation.start();
                    }
                }
            }
        });

        Object.defineProperty(self,'walkingAnimation',{
            get:function(){
                return currentPage.walkingAnimation || false;
            },
            set:function(wa){
                if(currentPage){
                    currentPage.walkingAnimation = wa;
                }
            }
        });
    };

    Game_Event.prototype.updateCurrentPage = function(){
        var self = this;
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
    function validateConditions(page){
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
                case 'GLOBAL':
                    var GlobalSwitches = root.GlobalSwitches;
                    for(var id in conditions[scope]){
                        var status = GlobalSwitches.switches[id]?true:false;
                        if(conditions[scope][id] != status){
                            return false;
                        }
                    }
            }
        }

        return true;
    }

    root.Game_Event = Game_Event;
})(RPG);