'use strict';
(function(root,w){
    var ID = 0;
    var Game_Timer = root.Game_Timer;

    if(root.Main === undefined){
        throw "Game Object requires Main";
    }

    if(w.Matter === undefined){
        throw "Game Object requires Matter";
    }

    var Main = root.Main,
        Matter = w.Matter,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

    /**
     *
     * @param options
     * @constructor
     */
    var Game_Object = function(options){
        var self = this;
        initialize(self);
        options = options || {};
        self.object_id = ID;
        ID++;
        self.animations = [];
        self.animationSpeed = options.animationSpeed || 4;
        self.body = Bodies.rectangle(
            options.x || 0,
            options.y || 0,
            options.width || 32,
            options.height || 32,{
                frictionAir:0.09,
                inertia:Infinity,
                friction:0.0001
            });
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
        var id = ID;
        ID++;
        return Object.assign({object_id:id},properties,this);
    };

    /**
     *
     * @param group
     */
    Game_Object.prototype.addCollisionGroup = function(group){
        var self = this;
       // QuadTree.addGroup(self.bounds,group);
    };

    /**
     *
     * @param name
     */
    Game_Object.prototype.removeCollisionGroup = function(name){
        var self = this;
        //QuadTree.removeGroup(self.bounds,name);
    };

    Game_Object.prototype.update = function () {};

    /**
     *
     * @param x
     * @param y
     */
    Game_Object.prototype.move = function (x, y) {
        var self = this;
        var body = self.body;
        Body.applyForce(body,{x:body.position.x,y:body.position.y},{x:x,y:y});
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        var speed = 5;
        var currentAnimation = null;
        var through = null;
        var body = null;
        var width = null;
        var height = null;

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
                return body;
            }
        });

        Object.defineProperty(self,'x',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                return self.body.position.x;
            },
            /**
             *
             * @param x
             */
            set:function(x){
                if(x !== self.body.position.x){
                    Body.setPosition(self.body,{
                        x:x,
                        y:self.y
                    });
                }
            }
        });

        Object.defineProperty(self,'y',{
            /**
             *
             * @returns {*}
             */
            get:function(){
                return self.body.position.y;
            },
            /**
             *
             * @param y
             */
            set:function(y){
                if(y !== self.body.position.y){
                    Body.setPosition(self.body,{
                        x:self.x,
                        y:y
                    });
                }
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
                if(w !== width){
                    width = w;
                    Body.set(self.body,'width',w);
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
                if(h !== height){
                    height = h;
                    Body.set(self.body,'height',h);
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
                    var keys = Object.keys(self.animations);
                    var length = keys.length;
                    var key;
                    for(var i =0; i < length;i++){
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
                    if(currentAnimation != null){
                        currentAnimation.stop(self.graphic.startFrame);
                    }
                    currentAnimation = ca;
                    currentAnimation.start();
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
    }

    root.Game_Object = Game_Object;
})(RPG,window);