'use strict';
(function (root) {
    if(root.Event_Page === undefined){
        throw "Game_Event requires Event_Page";
    }

    var Event_Page = root.Event_Page;

    /**
     *
     * @param options
     * @constructor
     */
    var Game_Event = function (options) {
        var self = this;
        self.switches = [];
        self.currentPage = null;
        self.pages = options.pages || [];
        initialize(self);
        self.x = options.x || 0;
        self.y = options.y || 0;
        self.updateCurrentPage();
    };

    /**
     *
     * @param options
     * @returns {*}
     */
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
        return !!self.switches[name];
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
        if(page instanceof Event_Page && self.pages.indexOf(page) === -1){
            self.pages.push(page);
            self.updateCurrentPage();
        }
    };

    /**
     *
     * @param page
     */
    Game_Event.prototype.remove = function(page){
        var self = this;
        var index = self.pages.indexOf(page);
        if(index !== -1){
            self.pages.splice(index,1);
            self.updateCurrentPage();
        }
    };

    Game_Event.prototype.update = function(){
        var self =this;
        if(self.currentPage != null){
            self.currentPage.update();
        }
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        var length = self.pages.length;
        for(var i =0; i < length;i++){
            self.pages[i].event = self;
        }

        var currentPage = null;
        var x = 0;
        var y = 0;

        Object.defineProperty(self,'currentFrame',{
            /**
             *
             * @returns {null}
             */
            get:function(){
                if(currentPage){
                    return currentPage.currentFrame;
                }
                return null;
            }
        });

        Object.defineProperty(self,'currentPage',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                return currentPage;
            },
            /**
             *
             * @param cp
             */
            set:function(cp){
                if(cp !== currentPage){
                    if(cp){
                        cp.x = self.x;
                        cp.y = self.y;
                        if(currentPage && currentPage.body){
                            cp.body = currentPage.body;
                        }
                    }
                    currentPage = cp;
                }
            }
        });

        Object.defineProperty(self,'through',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(currentPage){
                    return currentPage.through;
                }
                return true;
            }
        });

        Object.defineProperty(self,'body',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(currentPage){
                    return currentPage.body;
                }
                return null;
            }
        });

        Object.defineProperty(self,'x',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(currentPage){
                    return currentPage.x;
                }
                return x;
            },
            /**
             *
             * @param p
             */
            set:function(p){
                x = p;
                if(currentPage){
                    currentPage.x = x;
                }
            }
        });

        Object.defineProperty(self,'y',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(currentPage){
                    return currentPage.y;
                }
                return y;
            },
            /**
             *
             * @param p
             */
            set:function(p){
                y = p;
                if(currentPage){
                    currentPage.y = y;
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
        for(var scope in conditions){
            switch(scope){
                case 'LOCAL':
                    for(var id in conditions[scope]){
                        var status = !!event.switches[id];
                        if(conditions[scope][id] !== status){
                            return false;
                        }
                    }
                    break;
                case 'GLOBAL':
                    var GlobalSwitches = root.GlobalSwitches;
                    for(var id in conditions[scope]){
                        var status = !!GlobalSwitches.switches[id];
                        if(conditions[scope][id] !== status){
                            return false;
                        }
                    }
                    break;
            }
        }

        return true;
    }

    root.Game_Event = Game_Event;
})(RPG);