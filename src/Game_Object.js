(function(root){
    var ID = 0;
    var Game_Timer = root.Game_Timer;

    var Game_Object = function(options){
        var self = this;
        initialize(self);
        options = options || {};
        self.object_id = ID;
        ID++;
        self.animations = [];
        self.animationSpeed = options.animationSpeed || 4;
        self.bounds = {
            x:options.x || 0,
            y:options.y || 0,
            width: options.width || 32,
            height: options.height || 32,
            _ref: self,
            groups: [],
            parents:[]
        };
        self.layer = options.layer || 2;
        self.hSpeed = options.hSpeed || 32;
        self.vSpeed = options.vSpeed || 32;
        self.moving = false;
        self.refreshed = false;
        self.obj_movement = null;
        self.currentAnimation = null;
        self.type = options.type || 'Object';
        self.parent = options.parent || null;
        self.clearX = null;
        self.clearY = null;
        self.clearWidth = null;
        self.clearHeight = null;
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
        QuadTree.addGroup(self.bounds,group);
    };

    Game_Object.prototype.removeCollisionGroup = function(name){
        var self = this;
        QuadTree.removeGroup(self.bounds,name);
    };


    Game_Object.prototype.update = function () {
        var self = this;
        if (self.obj_movement != null) {
            var data = self.obj_movement;
            var diff = Game_Timer.currentTime - data.startmoving_time;
            var bounds = self.bounds;
            if (diff >= data.moving_time) {
                bounds.x = data.end_position.x;
                bounds.y = data.end_position.y;
                var callback = data.oncomplete;
                self.obj_movement = null;
                if (typeof callback === 'function') {
                    callback();
                }
            }
            else {
                var distance_x = (data.end_position.x - data.start_position.x);
                var distance_y = (data.end_position.y - data.start_position.y);
                var x = data.start_position.x + ((distance_x * diff) / data.moving_time);
                var y = data.start_position.y + ((distance_y * diff) / data.moving_time);
                bounds.x = x;
                bounds.y = y;
                QuadTree.reInsert(bounds);
            }
        }
    };

    /**
     *
     * @param bounds
     * @param ex
     * @param ey
     * @param time
     * @returns {{x: *, y: *, time: number}}
     */
    var calculate_final_position = function (bounds, ex, ey, time) {
        var final_bounds = {x: ex, y: ey, width: bounds.width, height: bounds.height, groups: ['STEP']};
        var vec = {x: ex - bounds.x, y: ey - bounds.y};
        var scene = root.Main.currentScene;
        var c_map = scene.map;
        var tree = scene.tree;
        var collisions = tree.retrieve(final_bounds, 'STEP');
        var length = collisions.length;

        for(var i =0; i < length;i++){
            var collision = collisions[i];
            if (vec.x > 0 && collision.x < (final_bounds.x + bounds.width)) {
                final_bounds.x = collision.x - bounds.width;
            }
            else if (vec.x < 0 && ((collision.x + collision.width) > final_bounds.x)) {
                final_bounds.x = collision.x + collision.width;
            }

            if (vec.y > 0 && collision.y < (final_bounds.y + bounds.height)) {
                final_bounds.y = collision.y - bounds.height;
            }
            else if (vec.y < 0 && ((collision.y + collision.height) > final_bounds.y)) {
                final_bounds.y = collision.y + collision.height;
            }
        }


        if (final_bounds.x < 0) {
            final_bounds.x = 0;
        }
        else if (final_bounds.x > c_map.width - 32) {
            final_bounds.x = c_map.height - 32;
        }
        else if (vec.x > 0) {
            final_bounds.x = Math.max(final_bounds.x, bounds.x);
        }
        else if (vec.x < 0) {
            final_bounds.x = Math.min(final_bounds.x, bounds.x);
        }
        else {
            final_bounds.x = bounds.x;
        }

        if (final_bounds.y < 0) {
            final_bounds.y = 0;
        }
        else if (final_bounds.y > c_map.width - 32) {
            final_bounds.y = c_map.height - 32;
        }
        else if (vec.y > 0) {
            final_bounds.y = Math.max(final_bounds.y, bounds.y);
        }
        else if (vec.y < 0) {
            final_bounds.y = Math.min(final_bounds.y, bounds.y);
        }
        else {
            final_bounds.y = bounds.y;
        }

        var distance_a = Math.distance({x: bounds.x, y: bounds.y}, {x: ex, y: ey});
        var distance_b = Math.distance({x: bounds.x, y: bounds.y}, {x: final_bounds.x, y: final_bounds.y});
        time = (time * distance_b) / distance_a;

        return {
            x: final_bounds.x,
            y: final_bounds.y,
            time: time
        };
    };
    /**
     *
     * @param self
     */
    var initialize = function(self){
        var speed = 5;
        var currentAnimation = null;
        var through = null;

        Object.defineProperty(self,'x',{
            get:function(){
                return self.bounds.x;
            },
            set:function(x){
                if(x != self.bounds.x){
                    self.bounds.x = x;
                }
            }
        });

        Object.defineProperty(self,'y',{
            get:function(){
                return self.bounds.y;
            },
            set:function(y){
                if(y != self.bounds.y){
                    self.bounds.y = y;
                }
            }
        });


        Object.defineProperty(self,'width',{
            get:function(){
                return self.bounds.width;
            },
            set:function(w){
                if(w != self.bounds.width){
                    self.bounds.width = w;
                }
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return self.bounds.height;
            },
            set:function(h){
                if(h != self.bounds.height){
                    self.bounds.height = h;
                }
            }
        });


        Object.defineProperty(self,'speed',{
            get:function(){
                return speed;
            },
            set:function(s){
                if(s != speed){
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
                if(currentAnimation != ca){
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
                if(t != through){
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
    };

    /**
     *
     * @param x
     * @param y
     * @param time
     * @param callback
     */
    Game_Object.prototype.move = function (x, y, time, callback) {
        var self = this;
        var final_bounds = calculate_final_position(self.bounds, x, y, time);
        self.obj_movement = {
            startmoving_time: Game_Timer.currentTime,
            moving_time: final_bounds.time,
            start_position: {x: self.bounds.x, y: self.bounds.y},
            end_position: {x: final_bounds.x, y: final_bounds.y},
            oncomplete: callback
        };
    };


    root.Game_Object = Game_Object;
})(RPG);