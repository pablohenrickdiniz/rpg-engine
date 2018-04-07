(function(root,w){
    var ID = 0;
    var Game_Timer = root.Game_Timer;

    if(root.Main === undefined){
        throw "Game Object requires Main"
    }

    if(w.Matter === undefined){
        throw "Game Object requires Matter"
    }

    var Main = root.Main,
        Matter = w.Matter,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

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
                frictionAir:0.09
            });
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

    Game_Object.prototype.clone = function(properties){
        properties = properties || {};
        var id = ID;
        ID++;
        return Object.assign({object_id:id},properties,this);
    };


    Game_Object.prototype.addCollisionGroup = function(group){
        var self = this;
       // QuadTree.addGroup(self.bounds,group);
    };

    Game_Object.prototype.removeCollisionGroup = function(name){
        var self = this;
        //QuadTree.removeGroup(self.bounds,name);
    };


    Game_Object.prototype.update = function () {
        var self = this;
        var x = self.x;
        var y = self.y;
        if(Main.currentScene && Main.currentScene.spriteset){
            var spriteset = Main.currentScene.spriteset;
            x = calcloop(x,spriteset.realWidth);
            y = calcloop(y,spriteset.realHeight);
        }
        self.x = x;
        self.y = y;
    };

    /**
     *
     * @param c
     * @param d
     * @returns {*}
     */
    function calcloop(c,d){
        if(c < 0){
            while(c < -d){c = c%d;}
            return d+c;
        }
        else if(c > d){
            while(c > d){c = c%d;}
            return c;
        }
        return c;
    }

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

        Object.defineProperty(self,'x',{
            get:function(){
                return self.body.position.x;
            },
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
            get:function(){
                return self.body.position.y;
            },
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
            get:function(){
                return self.body.width;
            },
            set:function(w){
                if(w !== self.body.width){
                    Body.set(self.body,'width',w);
                }
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return self.body.height;
            },
            set:function(h){
                if(h !== self.body.height){
                    Body.set(self.body,'height',h);
                }
            }
        });


        Object.defineProperty(self,'speed',{
            get:function(){
                return speed;
            },
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
            get:function(){
                return currentAnimation;
            },
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
            get:function(){
                return through;
            },
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