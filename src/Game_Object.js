'use strict';
(function(root,w){
    let ID = 0;
    if(!w.Matter){
        throw "Game_Object requires Matter";
    }

    if(!root.Animation_Time){
        throw "Game_Object requires Animation_Time";
    }

    let
        Matter = w.Matter,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Animation_Time = root.Animation_Time;

    /**
     *
     * @param options
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
        self.focused = false;
        self.name = options.name || '';
        self.listeners = [];
    };

    /**
     *
     * @param properties
     * @returns {*}
     */
    Game_Object.prototype.clone = function(properties){
        properties = properties || {};
        let id = ID;
        ID++;
        return Object.assign({object_id:id},properties,this);
    };

    /**
     *
     * @param group
     */
    Game_Object.prototype.addCollisionGroup = function(group){
        let self = this;
        // QuadTree.addGroup(self.bounds,group);
    };

    /**
     *
     * @param name
     */
    Game_Object.prototype.removeCollisionGroup = function(name){
        let self = this;
        //QuadTree.removeGroup(self.bounds,name);
    };

    Game_Object.prototype.update = function () {};

    /**
     *
     * @param x
     * @param y
     */
    Game_Object.prototype.move = function (x, y) {
        let self = this;
        let body = self.body;
        Body.applyForce(body,{x:body.position.x,y:body.position.y},{x:x,y:y});
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        let speed = 5;
        let currentAnimation = null;
        let through = null;
        let body = null;
        let width = 32;
        let height = 32;
        let x = 0;
        let y = 0;
        let st = true;

        Object.defineProperty(self,'body',{
            /**
             *
             * @param b
             */
            set:function(b){
                if(body !==  b){
                    body = b;
                }
            },
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(body == null){
                    body = Bodies.rectangle(
                        x,
                        y,
                        width,
                        height,{
                            frictionAir:0.09,
                            inertia:Infinity,
                            friction:0.0001,
                            isStatic:st,
                            plugin:{
                                ref:self
                            }
                        }
                    );
                }
                return body;
            }
        });

        Object.defineProperty(self,'x',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                if(body !== null && body.position.x !== x){
                    x = body.position.x;
                }
                return x;
            },
            /**
             *
             * @param bx
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
             * @returns {*}
             */
            get:function(){
                if(body !== null && body.position.y !== y){
                    y = body.position.y;
                }
                return y;
            },
            /**
             *
             * @param by
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
             * @returns {*}
             */
            get:function(){
                return width;
            },
            /**
             *
             * @param w
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
             * @returns {*}
             */
            get:function(){
                return height;
            },
            /**
             *
             * @param h
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
             * @param s
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
             * @returns {*}
             */
            get:function(){
                return currentAnimation;
            },
            /**
             *
             * @param ca
             */
            set:function(ca){
                if(currentAnimation !== ca){
                    if(currentAnimation !== null && currentAnimation instanceof Animation_Time){
                        currentAnimation.stop(self.graphic.startFrame);
                    }
                    currentAnimation = ca;
                    if(currentAnimation !== null && currentAnimation instanceof  Animation_Time){
                        currentAnimation.start();
                    }
                }
            }
        });

        Object.defineProperty(self,'through',{
            configurable:true,
            /**
             *
             * @returns {*}
             */
            get:function(){
                return through;
            },
            /**
             *
             * @param t
             */
            set:function(t){
                if(t !== through){
                    through = t;
                    if(through){
                        self.removeCollisionGroup('STEP');
                    }
                    else{
                        self.addCollisionGroup('STEP');
                    }
                }
            }
        });


        Object.defineProperty(self,'static',{
            set:function(s){
                if(body !== null){
                    Body.set(body,'isStatic',!!s);
                }
                if(st !== s){
                    st = s;
                }
            },
            get:function(){
                if(body != null && body.isStatic !== st){
                    st = body.isStatic;
                }
                return st;
            }
        })
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