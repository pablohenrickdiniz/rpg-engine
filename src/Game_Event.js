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

    if(!root.Game_Character){
        throw "Game_Event requires Game_Character"
    }

    let Event_Page = root.Event_Page,
        Switches = root.Main.Switches,
        Matter = w.Matter,
        Audio = root.Audio,
        Events = root.Events,
        Consts = root.Consts,
        Game_Character = root.Game_Character;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Event = function (options) {
        let self = this;
        Game_Character.call(self, options);
        self.switches = [];
        initialize(self);
        options = options || {};
        self.pages = options.pages || [];
        self.listeners = [];
    };

    Game_Event.prototype = Object.create(Game_Character.prototype);
    Game_Event.prototype.constructor = Game_Event;

    /**
     *
     * @param options {object}
     * @returns {root.Event_Page}
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
                                self.stepUp();
                                break;
                            case 'MOVE_DOWN':
                                self.stepDown();
                                break;
                            case 'MOVE_LEFT':
                                self.stepLeft();
                                break;
                            case 'MOVE_RIGHT':
                                self.stepRight();
                                break;
                        }
                    }
                }
        }

        Game_Character.prototype.update.call(self);
    };

    /**
     *
     * @param self {Game_Event}
     */
    function initialize(self){
        let currentPage = null;
        let pages = [];
        let walkingAnimation =false;

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
                    currentPage = cp;
                    let options = currentPage.options;
                    let properties = Object.keys(options);
                    for(let i = 0; i < properties.length;i++){
                        let value = options[properties[i]];
                        if(value !== undefined){
                            self[properties[i]] = value;
                        }
                    }
                    let s = cp.initialize;
                    if(s !== null){
                        s.apply(self);
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
                    let currentAnimation = self.currentAnimation;
                    if(walkingAnimation && !currentAnimation.running){
                        currentAnimation.start();
                    }
                    else if(!walkingAnimation && currentAnimation.running){
                        currentAnimation.stop();
                    }
                }
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