(function (root, w) {
    if (root.Animation == undefined) {
        throw "Game_Character requires Animation"
    }

    if (root.Consts == undefined) {
        throw "Game_Character requires Consts"
    }

    if(root.Character_Graphic == undefined){
        throw "Game_Character requires Character_Graphic"
    }

    if(root.Game_Timer == undefined){
        throw "Game_Character requires Game_Timer"
    }

    var Animation = root.Animation,
        Consts = root.Consts,
        Main = root.Main,
        Game_Timer = root.Game_Timer,
        Character_Graphic = root.Character_Graphic;
    /**
     *
     * @param options
     * @constructor
     */
    var Game_Character = function (options) {
        var self = this;
        initialize(self);
        options = options || {};
        self.animations = [];
        self.speed = options.speed || 5;
        var x = options.x || 0;
        var y = options.y || 0;
        self.bounds = {
            x: x,
            y: y,
            lx: x,
            ly: y,
            width: 32,
            height: 32,
            _ref: self,
            groups: ['EV']
        };
        self.layer = options.layer || 2;
        self.direction = Consts.CHARACTER_DIRECTION_DOWN;
        self.h_speed = 32;
        self.v_speed = 32;
        self.moving = false;
        self.refreshed = false;
        self.character_movement = null;
        self.setGraphic(options.graphic || new Character_Graphic());
        self.currentAnimation = self.animations[Consts.CHARACTER_STOP_DOWN];
        self.type = 'character';
        self.parent = options.parent || null;
        self.id = Game_Character.ID;
        Game_Character.ID++;
    };

    Game_Character.ID = 0;

    /**
     *
     * @param graphic
     */
    Game_Character.prototype.setGraphic = function (graphic) {
        var self = this;
        self.graphic = graphic;
        self.animations[Consts.CHARACTER_STEP_DOWN] = new Animation(self.speed, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_UP] = new Animation(self.speed, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_RIGHT] = new Animation(self.speed, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_LEFT] = new Animation(self.speed, graphic.cols);
        self.animations[Consts.CHARACTER_STOP_DOWN] =  new Animation(self.speed, 1);
        self.animations[Consts.CHARACTER_STOP_UP] =  new Animation(self.speed, 1);
        self.animations[Consts.CHARACTER_STOP_RIGHT] =  new Animation(self.speed, 1);
        self.animations[Consts.CHARACTER_STOP_LEFT] =  new Animation(self.speed, 1);
    };

    /**
     *
     * @returns {*|Object}
     */
    Game_Character.prototype.getCurrentFrame = function () {
        var self = this;
        if(self.currentAnimation !=null && self.graphic != null){
            var index = self.currentAnimation.getIndexFrame();
            return self.graphic.get(self.direction, index+self.graphic.startFrame);
        }
        return null;
    };

    /**
     *
     * @param direction
     * @param times
     * @param complete
     * @param allow
     */
    Game_Character.prototype.moveTo = function (direction, times, complete, allow) {
        allow = allow === undefined ? false : allow;
        var self = this;

        if (!self.moving || allow) {
            self.moving = true;
            var x = self.bounds.x;
            var y = self.bounds.y;
            var time = 1000 / self.speed;

            times = times === undefined ? 1 : times;
            switch (direction) {
                case Consts.CHARACTER_DIRECTION_UP:
                    y -= self.h_speed;
                    self.currentAnimation = self.animations[Consts.CHARACTER_STEP_UP];
                    break;
                case Consts.CHARACTER_DIRECTION_RIGHT:
                    x += self.h_speed;
                    self.currentAnimation = self.animations[Consts.CHARACTER_STEP_RIGHT];
                    break;
                case Consts.CHARACTER_DIRECTION_LEFT:
                    x -= self.h_speed;
                    self.currentAnimation = self.animations[Consts.CHARACTER_STEP_LEFT];
                    break;
                case Consts.CHARACTER_DIRECTION_DOWN:
                    y += self.h_speed;
                    self.currentAnimation = self.animations[Consts.CHARACTER_STEP_DOWN];
                    break;
            }

            if (times < 1) {
                self.moving = false;
                if(self.type != 'player'){
                    self.stop();
                }
                if (typeof complete === 'function') {
                    complete();
                }
            }
            else {
                self.direction = direction;
                self.move(x, y, time, function () {
                    self.moveTo(direction, times-1, complete, true);
                });
            }
        }
    };

    Game_Character.prototype.stop = function(){
        var self = this;
        switch (self.direction) {
            case Consts.CHARACTER_DIRECTION_UP:
                self.currentAnimation = self.animations[Consts.CHARACTER_STOP_UP];
                break;
            case Consts.CHARACTER_DIRECTION_RIGHT:
                self.currentAnimation = self.animations[Consts.CHARACTER_STOP_RIGHT];
                break;
            case Consts.CHARACTER_DIRECTION_LEFT:
                self.currentAnimation = self.animations[Consts.CHARACTER_STOP_LEFT];
                break;
            case Consts.CHARACTER_DIRECTION_DOWN:
                self.currentAnimation = self.animations[Consts.CHARACTER_STOP_DOWN];
                break;
        }
    };


    /**
     *
     * @param x
     * @param y
     * @param time
     * @param callback
     */
    Game_Character.prototype.move = function (x, y, time, callback) {
        var self = this;
        var final_bounds = calculate_final_position(self.bounds, x, y, time);
        self.character_movement = {
            startmoving_time: Game_Timer.currentTime,
            moving_time: final_bounds.time,
            start_position: {x: self.bounds.x, y: self.bounds.y},
            end_position: {x: final_bounds.x, y: final_bounds.y},
            oncomplete: callback
        };
    };

    Game_Character.prototype.stepForward = function () {
        var self = this;
        self.moveTo(self.direction);
    };

    Game_Character.prototype.stepRandom = function () {
        this.moveTo(Math.floor(Math.random() * 4));
    };

    /**
     *
     * @param direction
     */
    Game_Character.prototype.look = function (direction) {
        var self = this;
        switch (direction) {
            case Consts.CHARACTER_DIRECTION_UP:
            case Consts.CHARACTER_DIRECTION_DOWN:
            case Consts.CHARACTER_DIRECTION_RIGHT:
            case Consts.CHARACTER_DIRECTION_LEFT:
                self.direction = direction;
                break;
            default:
                if (direction instanceof Game_Character) {
                    var d_x = self.bounds.x - direction.bounds.x;
                    var d_y = self.bounds.y - direction.bounds.y;
                    console.log(d_x,d_y);

                    if(Math.abs(d_x) > Math.abs(d_y)){
                        if(d_x > 0){
                            self.direction = Consts.CHARACTER_DIRECTION_LEFT;
                        }
                        else if(d_x < 0){
                            self.direction = Consts.CHARACTER_DIRECTION_RIGHT;
                        }
                    }
                    else{
                        if(d_y > 0){
                            self.direction = Consts.CHARACTER_DIRECTION_UP;
                        }
                        else if(d_y < 0){
                            self.direction = Consts.CHARACTER_DIRECTION_DOWN;
                        }
                    }

                }
        }
    };

    Game_Character.prototype.lookToPlayer = function () {
        var self = this;
        self.look(Main.Player);
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
        var c_map = root.Main.scene.map_data.map;

        var quadtree = c_map.getTree();
        var collisions = quadtree.retrieve(final_bounds, 'STEP');
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

    Game_Character.prototype.update = function () {
        var self = this;
        if (self.character_movement != null) {
            var data = self.character_movement;
            var diff = Game_Timer.currentTime - data.startmoving_time;
            var bounds = self.bounds;
            if (diff >= data.moving_time) {
                bounds.x = data.end_position.x;
                bounds.y = data.end_position.y;
                var callback = data.oncomplete;
                self.character_movement = null;
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
                if (bounds._full_inside) {
                    QuadTree.reInsert(bounds);
                }
            }
        }
    };

    var initialize = function(self){
        var speed = 5;
        var currentAnimation = null;

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

        Object.defineProperty(self,'index',{
            get:function(){
                return self.bounds.y+'-'+self.id;
            }
        });
    };

    var next_frame = function(index,frameCount){
        if(index < frameCount){
            return index;
        }
        return frameCount % index;
    };

    root.Game_Character = Game_Character;
})(RPG, window);