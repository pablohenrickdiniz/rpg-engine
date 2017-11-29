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
        self.currentAnimation = null;
        self.type = options.type || 'Object';
        self.through = options.through || false;
        self.focused = false;
        self.name = options.name || '';
        self.listeners = [];
        self._movement = null;
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
        var scene = root.Main.currentScene;
        var c_map = scene.map;
        var spriteset = scene.spriteset;

        if (self._movement != null) {
            var data = self._movement;
            var diff = Game_Timer.currentTime - data.start;
            var bounds = self.bounds;
            var x;
            var y;
            if (diff >= data.time) {
                x = data.epos.x;
                y = data.epos.y;

                if(c_map.loop_x){
                    x = calcloop(x,spriteset.realWidth);
                }
                if(c_map.loop_y){
                    y = calcloop(y,spriteset.realHeight);
                }

                bounds.x = x;
                bounds.y = y;
                var callback = data.complete;
                self._movement = null;
                if (typeof callback === 'function') {
                    callback();
                }
            }
            else {
                /**
                 * Distância pecorrida baseada no tempo
                 * @type {number}
                 */
                var distance_x = (data.epos.x - data.spos.x);
                var distance_y = (data.epos.y - data.spos.y);
                x = data.spos.x + ((distance_x * diff) / data.time);
                y = data.spos.y + ((distance_y * diff) / data.time);


                /**
                 * Verificação de loop horizontal
                 */
                if(c_map.loop_x){
                    x = calcloop(x,spriteset.realWidth);
                }

                /**
                 * Verificação de loop vertical
                 */
                if(c_map.loop_y){
                    y = calcloop(y,spriteset.realHeight);
                }

                bounds.x = x;
                bounds.y = y;
                QuadTree.reInsert(bounds);
            }
        }
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
     * @param bounds
     * @param ex
     * @param ey
     * @param time
     * @returns {{x: *, y: *, time: number}}
     */
    function calculate_final_position(bounds, ex, ey, time) {
        var final_bounds = {x: ex, y: ey, width: bounds.width, height: bounds.height, groups: ['STEP']};
        var vec = {x: ex - bounds.x, y: ey - bounds.y};
        var scene = root.Main.currentScene;
        var c_map = scene.map;
        var spriteset = scene.spriteset;
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


        if(!c_map.loop_x){
            if (final_bounds.x < 0) {
                final_bounds.x = 0;
            }
            else if (final_bounds.x > spriteset.realWidth - bounds.width) {
                final_bounds.x = spriteset.realHeight - bounds.height;
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
        }

        if(!c_map.loop_y){
            if (final_bounds.y < 0) {
                final_bounds.y = 0;
            }
            else if (final_bounds.y > spriteset.realWidth - bounds.width) {
                final_bounds.y = spriteset.realHeight - bounds.height;
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
        }

        var distance_a = Math.distance({x: bounds.x, y: bounds.y}, {x: ex, y: ey});
        var distance_b = Math.distance({x: bounds.x, y: bounds.y}, {x: final_bounds.x, y: final_bounds.y});
        time = (time * distance_b) / distance_a;

        return {
            x: final_bounds.x,
            y: final_bounds.y,
            time: time
        };
    }

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
        self._movement = {
            start: Game_Timer.currentTime,
            time: final_bounds.time,
            spos: {x: self.bounds.x, y: self.bounds.y},
            epos: {x: final_bounds.x, y: final_bounds.y},
            complete: callback
        };
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
    }

    root.Game_Object = Game_Object;
})(RPG);