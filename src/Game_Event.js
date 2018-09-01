'use strict';
(function (root) {
    if(root.Event_Page === undefined){
        throw "Game_Event requires Event_Page";
    }

    if(root.Main === undefined){
        throw "Game_Event requires Main";
    }

    let Event_Page = root.Event_Page,
        Switches = root.Main.Switches;

    /**
     *
     * @param options
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
    };

    /**
     *
     * @param options
     * @returns {*}
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
     * @param name
     * @returns {boolean}
     */
    Game_Event.prototype.isEnabled = function(name){
        let self = this;
        return !!self.switches[name];
    };

    /**
     *
     * @param name
     */
    Game_Event.prototype.enableSwitch = function (name) {
        let self = this;
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
        let self = this;
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
        let self = this;
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
     * @param self
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
             * @param pgs
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
            /**
             *
             * @returns {null}
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
                if(cp !== currentPage && cp instanceof Event_Page){
                    cp.x = self.x;
                    cp.y = self.y;
                    if(currentPage != null && currentPage.body){
                        cp.body = currentPage.body;
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
                if(currentPage != null){
                    return currentPage.through;
                }
                return true;
            }
        });

        Object.defineProperty(self,'x',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(currentPage !== null && currentPage.x !== x){
                    x = currentPage.x;
                }
                return x;
            },
            /**
             *
             * @param px
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
             * @returns {*}
             */
            get:function(){
                if(currentPage !== null && currentPage.y !== y){
                    y = currentPage.y;
                }
                return y;
            },
            /**
             *
             * @param py
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
             * @returns {*}
             */
            get:function(){
                if(currentPage !== null){
                    return currentPage.body;
                }
                return null;
            }
        });


        Object.defineProperty(self,'width',{
            get:function(){
                if(currentPage !== null){
                    return currentPage.width;
                }
                return 0;
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                if(currentPage !== null){
                    return currentPage.height;
                }
                return 0;
            }
        })
    };

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
     * @param page
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
                        if(conditions[scope][id] !== Switches.read(id)){
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