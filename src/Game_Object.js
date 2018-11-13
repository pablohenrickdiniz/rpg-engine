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
        Consts = root.Consts,
        Constraint = Matter.Constraint;

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
        self.type = options.type || 'Object';
        self.through = options.through || false;
        self.flashlight = options.flashlight;
        self.flashlightRadius = options.flashlightRadius || 100;
        self.flashlightColor = options.flashlightColor || 'rgba(255,255,255,0.1)';
        self.focused = false;
        self.name = options.name || '';
        self.listeners = [];
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
                self.listeners[eventName][i].apply(null,args);
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
        let flashlight = false;
        let flashlightRadius = 100;
        let flashlightBody = null;
        let width = 32;
        let height = 32;
        let x = 0;
        let y = 0;
        let st = true;

        Object.defineProperty(self,'objectBody',{
            get:function(){
                if(objectBody == null){
                    objectBody =  Bodies.rectangle(
                        x,
                        y,
                        width,
                        height,{
                            plugin:{
                                ref:self
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
                        parts:[self.objectBody,self.flashlightBody],
                        isStatic:self.static,
                        friction:0.0001,
                        frictionAir:0.09,
                        inertia:Infinity,
                        plugin:{
                            ref:self
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
                if(body !== null && bx !== body.position.x){
                    Body.setPosition(body,{
                        x:bx,
                        y:body.position.y
                    });
                }
                x = bx;
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
                if(by !== self.body.position.y){
                    Body.setPosition(body,{
                        x:body.position.x,
                        y:by
                    });
                }
                y = by;
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
                if(width !== w){
                    Body.scale(body,w/width,1);
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
                if(height !== h){
                    Body.scale(body,1,h/height);
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
                if(s !== speed){
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
                if(t !== through){
                    through = t;
                    if(body !== null){
                        body.isSensor = through;
                    }
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

        Object.defineProperty(self,'flashlight',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return flashlight;
            },
            /**
             *
             * @param f {boolean}
             */
            set:function(f){
                flashlight = !!f;
            }
        });

        Object.defineProperty(self,'flashlightRadius',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return flashlightRadius;
            },
            /**
             *
             * @param f {number}
             */
            set:function(f){
                f = parseInt(f);
                if(!isNaN(f) && f >= 1){
                    flashlightRadius = f;
                    if(flashlightBody !== null){
                        Body.scale(flashlightBody,f/flashlightRadius,f/flashlightRadius);
                        Body.set(flashlightBody,'circleRadius',flashlightRadius);
                    }
                }
            }
        });

        Object.defineProperty(self,'flashlightBody',{
            /**
             *
             * @param fb {Body}
             */
            set:function(fb){
                if(flashlightBody !==  fb){
                    flashlightBody = fb;
                }
            },
            /**
             *
             * @returns {Body}
             */
            get:function(){
                if(flashlightBody == null){
                    flashlightBody = Bodies.circle(x,y,flashlightRadius,{
                        isSensor:true,
                        density:0
                    });
                }
                return flashlightBody;
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