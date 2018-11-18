'use strict';
(function (root,w) {
    if(!root.Event_Page){
        throw "Game_Event requires Event_Page";
    }

    if(!root.Main){
        throw "Game_Event requires Main";
    }

    if(!root.Main.Switches){
        throw "Game_Event requires Switches";
    }

    if(!root.Events){
        throw "Game_Event requires Events";
    }

    if(!w.Matter){
        throw "Game_Event requires Matter";
    }

    if(!root.Audio){
        throw "Game_Event requires Audio";
    }

    if(!root.Consts){
        throw "Game_Event requires Consts";
    }

    let Event_Page = root.Event_Page,
        Switches = root.Main.Switches,
        Matter = w.Matter,
        Body = Matter.Body,
        Audio = root.Audio,
        Events = root.Events,
        Consts = root.Consts;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Event = function (options) {
        let self = this;
        self.switches = [];
        initialize(self);
        options = options || {};
        self.x = options.x || 0;
        self.y = options.y || 0;
        self.pages = options.pages || [];
        self.listeners = [];
    };

    /**
     *
     * @param options {object}
     * @returns {Event_Page}
     */
    Game_Event.prototype.newPage = function(options) {
        options = options || {};
        let self = this;
        let page = new Event_Page(options);
        page.event = self;
        self.pages.push(page);
        self.updateCurrentPage();
        return page;
    };

    /**
     *
     * @param names {string|Array}
     * @returns {boolean}
     */
    Game_Event.prototype.isSwitchEnabled = function(names){
        if(!(names instanceof Array))
            names = [names];

        let self = this;
        for(let i = 0; i < names.length;i++){
            let name = names[i];
            if(!self.switches[name]){
                return false;
            }
        }
        return true;
    };

    /**
     *
     * @param names {string|Array}
     * @returns {boolean}
     */
    Game_Event.prototype.isSwitchDisabled = function(names){
        if(!(names instanceof Array))
            names = [names];

        let self = this;
        for(let i = 0; i < names.length;i++){
            let name = names[i];
            if(!!self.switches[name]){
                return false;
            }
        }
        return true;
    };

    /**
     *
     * @param names {string|Array}
     * @returns {Game_Event}
     */
    Game_Event.prototype.enableSwitch = function (names) {
        if(!(names instanceof Array))
            names = [names];

        let self = this;
        let changed = false;
        for(let i = 0; i < names.length;i++){
            let name = names[i];
            if(!self.switches[name]){
                self.switches[name] = true;
                changed = true;
            }
        }
        if(changed){
            self.updateCurrentPage();
        }
        return self;
    };

    /**
     *
     * @param names {string|Array}
     * @returns {Game_Event}
     */
    Game_Event.prototype.disableSwitch = function (names) {
        if(!(names instanceof Array))
            names = [names];

        let self = this;
        let changed = false;
        for(let i = 0; i < names.length;i++){
            let name = names[i];
            if(self.switches[name]){
                delete self.switches[name];
                changed = true;
            }
        }

        if(changed){
            self.updateCurrentPage();
        }

        return self;
    };

    /**
     *
     * @param names {string|Array}
     * @returns {Game_Event}
     */
    Game_Event.prototype.enableGlobalSwitch = function (names) {
        Switches.enable(names);
        return this;
    };

    /**
     *
     * @param names {string|Array}
     * @returns {Game_Event}
     */
    Game_Event.prototype.disableGlobalSwitch = function (names) {
        Switches.disable(names);
        return this;
    };

    /**
     *
     * @param names {string|Array}
     * @returns {boolean}
     */
    Game_Event.prototype.isGlobalSwitchEnabled = function (names) {
        return Switches.isEnabled(names);
    };

    /**
     *
     * @param names {string|Array}
     * @returns {boolean}
     */
    Game_Event.prototype.isGlobalSwitchDisabled = function (names) {
        return Switches.isDisabled(names);
    };

    /**
     *
     * @param type {string}
     * @param name {string}
     */
    Game_Event.prototype.playAudio = function(type,name){
        Audio.play(type,name);
        return this;
    };

    /**
     *
     * @param page {Event_Page}
     */
    Game_Event.prototype.add = function (page) {
        let self = this;
        if(page instanceof Event_Page && self.pages.indexOf(page) === -1){
            self.pages.push(page);
            self.updateCurrentPage();
        }
    };

    /**
     *
     * @param page {Event_Page}
     */
    Game_Event.prototype.remove = function(page){
        let self = this;
        let index = self.pages.indexOf(page);
        if(index !== -1){
            self.pages.splice(index,1);
            self.updateCurrentPage();
        }
    };

    Game_Event.prototype.update = function(){
        let self = this;
        if(self.currentPage !== null){
            self.currentPage.update();
        }
    };

    /**
     *
     * @param eventName {string}
     * @param args {Array}
     * @returns {Scene}
     */
    Game_Event.prototype.trigger = function(eventName,args){
        let self = this;
        if(self.listeners[eventName] !== undefined){
            let length = self.listeners[eventName].length;
            for(let i = 0; i < length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
        return self;
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Scene}
     */
    Game_Event.prototype.on = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName] === undefined){
            self.listeners[eventName] = [];
        }
        if(self.listeners[eventName].indexOf(callback) === -1){
            self.listeners[eventName].push(callback);
        }
        return self;
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Scene}
     */
    Game_Event.prototype.off = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName] !== undefined){
            let index =self.listeners[eventName].indexOf(callback);
            if(index !== -1){
                self.listeners[eventName].splice(index,1);
            }
        }
        return self;
    };

    /**
     *
     * @param self {Game_Event}
     */
    function initialize(self){
        let currentPage = null;
        let pages = [];
        let x = 0;
        let y = 0;

        Object.defineProperty(self,'pages',{
            /**
             *
             * @returns {Array}
             */
            get:function(){
                return pages;
            },
            /**
             *
             * @param pgs {Array}
             */
            set:function(pgs){
                pgs = (pgs instanceof Array)?pgs:[];
                let length = pgs.length;
                for(let i =0; i < length;i++){
                    if(pgs[i] instanceof Event_Page){
                        pgs[i].event = self;
                    }
                    else if(pgs[i].constructor === {}.constructor){
                        pgs[i] = new Event_Page(pgs[i]);
                        pgs[i].event = self;
                    }
                    else{
                        pgs.splice(i,1);
                        i--;
                        length--;
                    }
                }
                pages = pgs;
                self.updateCurrentPage();
            }
        });

        Object.defineProperty(self,'currentFrame',{
            configurable:true,
            /**
             *
             * @returns {Tile}
             */
            get:function(){
                if(currentPage != null){
                    return currentPage.currentFrame;
                }
                return null;
            }
        });

        Object.defineProperty(self,'currentPage',{
            /**
             *
             * @returns {Event_Page}
             */
            get:function(){
                return currentPage;
            },
            /**
             *
             * @param cp {Event_Page}
             */
            set:function(cp){
                if(cp !== currentPage && cp instanceof Event_Page){
                    cp.x = self.x;
                    cp.y = self.y;
                    if(currentPage != null && currentPage.body){
                        cp.body = currentPage.body;
                        cp.lightBody = currentPage.lightBody;
                        cp.body.plugin.ref = cp;
                        cp.lightBody.plugin.ref = cp;
                    }
                    currentPage = cp;
                    if(typeof cp.script === 'function' && cp.trigger === Consts.TRIGGER_AUTO_RUN){
                        cp.script();
                    }
                }
            }
        });

        Object.defineProperty(self,'through',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                if(currentPage != null){
                    return currentPage.through;
                }
                return true;
            }
        });

        Object.defineProperty(self,'x',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(currentPage !== null && currentPage.x !== x){
                    x = currentPage.x;
                }
                return x;
            },
            /**
             *
             * @param px {number}
             */
            set:function(px){
                if(currentPage !== null){
                    currentPage.x = px;
                }
                x = px;
            }
        });

        Object.defineProperty(self,'y',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(currentPage !== null && currentPage.y !== y){
                    y = currentPage.y;
                }
                return y;
            },
            /**
             *
             * @param py {number}
             */
            set:function(py){
                if(currentPage !== null){
                    currentPage.y = py;
                }
                y = py;
            }
        });

        Object.defineProperty(self,'body',{
            /**
             *
             * @returns {Body}
             */
            get:function(){
                if(currentPage !== null){
                    return currentPage.body;
                }
                return null;
            }
        });


        Object.defineProperty(self,'width',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(currentPage !== null){
                    return currentPage.width;
                }
                return 0;
            }
        });

        Object.defineProperty(self,'height',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(currentPage !== null){
                    return currentPage.height;
                }
                return 0;
            }
        });

        Object.defineProperty(self,'layer',{
            /**
             *
             * @returns {number}
             */
            get:function(){
               if(currentPage !== null){
                   return currentPage.layer;
               }
               return 0;
            }
        });

        Object.defineProperty(self,'light',{
           get:function(){
               if(currentPage !== null){
                   return currentPage.light;
               }
               return false;
           }
        });

        Object.defineProperty(self,'lightRadius',{
            get:function(){
                if(currentPage !== null){
                    return currentPage.lightRadius;
                }
                return false;
            }
        });

        Object.defineProperty(self,'lightBody',{
            get:function(){
                if(currentPage !== null){
                    return currentPage.lightBody;
                }
                return null;
            }
        });

        Object.defineProperty(self,'lightColor',{
            get:function(){
                if(currentPage !== null){
                    return currentPage.lightColor;
                }
                return 'rgba(255,255,255,0.1)';
            }
        });

        Events.on('globalSwitchChanged',function(){
            self.updateCurrentPage();
        });
    }

    Game_Event.prototype.updateCurrentPage = function(){
        let self = this;
        let pages = self.pages;
        let length = pages.length;
        let currentPage = null;
        for(let i =0; i < length;i++){
            if(validateConditions(pages[i])){
                currentPage = pages[i];
            }
        }
        self.currentPage = currentPage;
    };

    /**
     *
     * @param page {Event_Page}
     * @returns {boolean}
     */
    function validateConditions(page){
        let conditions = page.conditions;
        for(let scope in conditions){
            switch(scope){
                case 'LOCAL':
                    for(let id in conditions[scope]){
                        let status = !!page.event.switches[id];
                        if(conditions[scope][id] !== status){
                            return false;
                        }
                    }
                    break;
                case 'GLOBAL':
                    for(let id in conditions[scope]){
                        if(conditions[scope][id] !== Switches.isEnabled(id)){
                            return false;
                        }
                    }
                    break;
            }
        }

        return true;
    }

    Object.defineProperty(root,'Game_Event',{
        /**
         *
         * @returns {Game_Event}
         */
        get:function(){
            return Game_Event;
        }
    })
})(RPG,window);