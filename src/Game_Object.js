'use strict';
(function(root,w){
    let ID = 0;
    if(!w.Matter){
        throw "Game_Object requires Matter";
    }

    if(!root.Game_Animation){
        throw "Game_Object requires Game_Animation";
    }

    if(!root.Consts){
        throw "Game_Object requires Consts"
    }

    let
        Matter = w.Matter,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Game_Animation = root.Game_Animation,
        Consts = root.Consts;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Object = function(options){
        let self = this;
        initialize(self);
        options = options || {};
        self.object_id = ID;
        ID++;
        self.animations = [];
        self.animationSpeed = options.animationSpeed || 4;
        self.static = options.static || false;
        self.x = options.x || 0;
        self.y = options.y || 0;
        self.width = options.width || 32;
        self.height = options.height || 32;
        self.layer = options.layer || 2;
        self.hSpeed = options.hSpeed || 0.02;
        self.vSpeed = options.vSpeed || 0.02;
        self.currentAnimation = null;
        self.through = options.through || false;
        self.light = options.light;
        self.shadow = options.shadow || false;
        self.lightRadius = options.lightRadius || 16;
        self.lightColor = options.lightColor || 'rgba(255,255,255,0.1)';
        self.focused = false;
        self.name = options.name || '';
        self.listeners = [];
        self.steps = 0;

    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Game_Object}
     */
    Game_Object.prototype.on = function(eventName,callback){
        let self = this;
        if(typeof callback === 'function'){
            if(self.listeners[eventName] === undefined){
                self.listeners[eventName] = [];
            }
            if(self.listeners.indexOf(callback) === -1){
                self.listeners[eventName].push(callback);
            }
        }
        return self;
    };

    /**
     *
     * @param eventName {string}
     * @param callback {function}
     * @returns {Game_Object}
     */
    Game_Object.prototype.off = function(eventName,callback){
        let self = this;
        if(self.listeners[eventName] !== undefined){
            if(typeof callback === 'function'){
                let index = self.listeners[eventName].indexOf(callback);
                if(index !== -1){
                    self.listeners[eventName].splice(index,1);
                }
                if(self.listeners[eventName].length === 0){
                    delete self.listeners[eventName];
                }
            }
            else{
                delete self.listeners[eventName];
            }
        }
        return self;
    };

    /**
     *
     * @param eventName {string}
     * @param args {Array}
     * @returns {Game_Object}
     */
    Game_Object.prototype.trigger = function(eventName, args){
        let self = this;
        if(self.listeners[eventName] !== undefined){
            for(let i = 0;i < self.listeners[eventName].length;i++){
                self.listeners[eventName][i].apply(self,args);
            }
        }
        return self;
    };

    /**
     *
     * @param properties {object}
     * @returns {object}
     */
    Game_Object.prototype.clone = function(properties){
        properties = properties || {};
        let id = ID;
        ID++;
        return Object.assign({object_id:id},properties,this);
    };

    Game_Object.prototype.update = function () {};

    /**
     *
     * @param x {number}
     * @param y {number}
     * @returns {Game_Object}
     */
    Game_Object.prototype.move = function (x, y) {
        let self = this;
        let body = self.body;
        Body.applyForce(body,{x:body.position.x,y:body.position.y},{x:x,y:y});
        return self;
    };

    /**
     *
     * @param self {Game_Object}
     */
    function initialize(self){
        let speed = 5;
        let currentAnimation = null;
        let through = null;
        let body = null;
        let objectBody = null;
        let light = false;
        let lightRadius = 16;
        let lightBody = null;
        let width = 32;
        let height = 32;
        let x = 0;
        let y = 0;
        let st = true;
        let lights = [];
        let shadow = false;

        Object.defineProperty(self,'shadow',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return shadow;
            },
            /**
             *
             * @param s {boolean}
             */
            set:function(s){
                shadow = !!s;
            }
        });

        Object.defineProperty(self,'objectBody',{
            get:function(){
                if(objectBody == null){
                    objectBody =  Bodies.rectangle(
                        x,
                        y,
                        width,
                        height,{
                            plugin:{
                                object:self,
                                type:'objectBody'
                            },
                            isSensor:through
                        }
                    );
                }
                return objectBody;
            }
        });

        Object.defineProperty(self,'body',{
            /**
             *
             * @param b {Body}
             */
            set:function(b){
                if(body !==  b){
                    body = b;
                }
            },
            /**
             *
             * @returns {Body}
             */
            get:function(){
                if(body == null){
                    body = Body.create({
                        parts:[self.objectBody,self.lightBody],
                        isStatic:self.static,
                        friction:0.0001,
                        frictionAir:0.09,
                        inertia:Infinity,
                        plugin:{
                            type:'body'
                        }
                    });
                }
                return body;
            }
        });

        Object.defineProperty(self,'x',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(body !== null && body.position.x !== x){
                    x = body.position.x;
                }
                return x;
            },
            /**
             *
             * @param bx {number}
             */
            set:function(bx){
                bx = parseFloat(bx);
                if(!isNaN(bx) && bx !== x){
                    if(body !== null && bx !== body.position.x){
                        Body.setPosition(body,{
                            x:bx,
                            y:body.position.y
                        });
                    }
                    x = bx;
                }

            }
        });

        Object.defineProperty(self,'y',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(body !== null && body.position.y !== y){
                    y = body.position.y;
                }
                return y;
            },
            /**
             *
             * @param by {number}
             */
            set:function(by){
                by = parseFloat(by);
                if(!isNaN(by) && by !== y){
                    if(body !== null && by !== body.position.y){
                        Body.setPosition(body,{
                            x:body.position.x,
                            y:by
                        });
                    }
                    y = by;
                }

            }
        });

        Object.defineProperty(self,'width',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return width;
            },
            /**
             *
             * @param w {number}
             */
            set:function(w){
                w = parseInt(w);
                if(!isNaN(w) && w > 0 && width !== w){
                    if(body !== null){
                        Body.scale(body,w/width,1);
                    }
                    width = w;
                }
            }
        });

        Object.defineProperty(self,'height',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return height;
            },
            /**
             *
             * @param h {number}
             */
            set:function(h){
                h = parseInt(h);
                if(!isNaN(h) && h > 0 && height !== h){
                    if(body !== null){
                        Body.scale(body,1,h/height);
                    }
                    height = h;
                }
            }
        });

        Object.defineProperty(self,'speed',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return speed;
            },
            /**
             *
             * @param s {number}
             */
            set:function(s){
                s = parseInt(s);
                if(!isNaN(s) && s > 0 && s !== speed){
                    speed = s;
                    let keys = Object.keys(self.animations);
                    let length = keys.length;
                    let key;
                    for(let i =0; i < length;i++){
                        key = keys[i];
                        self.animations[key].fps = speed;
                    }
                }
            }
        });

        Object.defineProperty(self,'currentAnimation',{
            configurable:true,
            /**
             *
             * @returns {Game_Animation}
             */
            get:function(){
                return currentAnimation;
            },
            /**
             *
             * @param ca {Game_Animation}
             */
            set:function(ca){
                ca = ca || null;
                if(currentAnimation !== ca){
                    if(currentAnimation !== null && currentAnimation instanceof Game_Animation){
                        currentAnimation.stop();
                    }
                    currentAnimation = ca;
                    if(currentAnimation !== null && currentAnimation instanceof  Game_Animation){
                        currentAnimation.start();
                    }
                }
            }
        });

        Object.defineProperty(self,'through',{
            configurable:true,
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
                through = !!t;
                if(body !== null){
                    body.isSensor = through;
                }
            }
        });

        Object.defineProperty(self,'static',{
            /**
             *
             * @param s {boolean}
             */
            set:function(s){
                s = !!s;
                if(body !== null){
                    Body.set(body,'isStatic',s);
                }
                if(st !== s){
                    st = s;
                }
            },
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                if(body != null && body.isStatic !== st){
                    st = body.isStatic;
                }
                return st;
            }
        });

        Object.defineProperty(self,'light',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return light;
            },
            /**
             *
             * @param f {boolean}
             */
            set:function(f){
                light = !!f;
            }
        });

        Object.defineProperty(self,'lightRadius',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return lightRadius;
            },
            /**
             *
             * @param f {number}
             */
            set:function(f){
                f = parseInt(f);
                if(!isNaN(f) && f >= 1){
                    lightRadius = f;
                    if(lightBody !== null){
                        Body.scale(lightBody,f/lightRadius,f/lightRadius);
                        Body.set(lightBody,'circleRadius',lightRadius);
                    }
                }
            }
        });

        Object.defineProperty(self,'lightBody',{
            /**
             *
             * @param fb {Body}
             */
            set:function(fb){
                if(lightBody !==  fb){
                    lightBody = fb;
                }
            },
            /**
             *
             * @returns {Body}
             */
            get:function(){
                if(lightBody == null){
                    lightBody = Bodies.circle(x,y,lightRadius,{
                        isSensor:true,
                        density:0,
                        plugin:{
                            object:self,
                            type:'light'
                        }
                    });
                }
                return lightBody;
            }
        });

        Object.defineProperty(self,'type',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return self.constructor.name;
            }
        });

        Object.defineProperty(self,'lights',{
            /**
             *
             * @returns {Array}
             */
            get:function(){
                return lights;
            },
            /**
             *
             * @param lgs {Array}
             */
            set:function(lgs){
                if(lgs instanceof Array){
                    lights = lgs;
                }
            }
        });
    }

    Object.defineProperty(root,'Game_Object',{
        /**
         *
         * @returns {Game_Object}
         */
        get:function(){
            return Game_Object;
        }
    });
})(RPG,window);