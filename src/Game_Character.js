(function (root, w) {
    if (root.Animation == undefined) {
        throw "Game_Character requires Animation"
    }

    if (root.Consts == undefined) {
        throw "Game_Character requires Consts"
    }

    var Animation = root.Animation,
        Consts = root.Consts,
        Main = root.Main;

    var Game_Character = function (options) {
        var self = this;
        options = options === undefined ? {} : options;
        self.speed = options.speed || 5;
        var x = options.x || 0;
        var y = options.y || 0;
        self.graphic = null;
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

        self.layer = 2;
        self.direction = Consts.DOWN;
        self.h_speed = 32;
        self.v_speed = 32;
        self.moving = false;
        self.refreshed = false;
        self.animations = [];
        self.character_movement = null;
    };

    Game_Character.prototype.setX = function (x) {
        var self = this;
        self.bounds.x = x;
    };

    Game_Character.prototype.setY = function (y) {
        var self = this;
        self.bounds.y = y;
    };

    /*
     setGraphic(Graphic graphic):void
     Altera o gráfico do character
     */
    Game_Character.prototype.setGraphic = function (graphic) {
        var self = this;
        self.graphic = graphic;
        self.animations[Consts.CHARACTER_STEP_DOWN] = new Animation(self.speed, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_UP] = new Animation(self.speed, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_RIGHT] = new Animation(self.speed, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_LEFT] = new Animation(self.speed, graphic.cols);
    };

    /*
     getCurrentFrame():Object
     Retorna o gráfico atual do character
     */
    Game_Character.prototype.getCurrentFrame = function () {
        var self = this;
        var animation = self.animations[self.direction];

        var index = animation.getIndexFrame();
        return self.graphic.get(self.direction, index);
    };


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
                case Consts.UP:
                    y -= self.h_speed;
                    break;
                case Consts.RIGHT:
                    x += self.h_speed;
                    break;
                case Consts.LEFT:
                    x -= self.h_speed;
                    break;
                case Consts.DOWN:
                    y += self.h_speed;
                    break;
            }

            if (times < 1) {
                self.moving = false;
                if (typeof complete === 'function') {
                    complete();
                }
            }
            else {
                self.animations[direction].execute();
                self.direction = direction;
                self.move(x, y, time, function () {
                    times--;
                    self.moveTo(direction, times, complete, true);
                });
            }
        }
    };

    Game_Character.prototype.move = function (x, y, time, callback) {
        var self = this;
        var final_bounds = calculate_final_position(self.bounds, x, y, time);
        self.character_movement = {
            startmoving_time: root.System.time,
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

    Game_Character.prototype.look = function (direction) {
        var self = this;
        switch (direction) {
            case Consts.UP:
            case Consts.DOWN:
            case Consts.RIGHT:
            case Consts.LEFT:
                self.direction = direction;
                break;
            default:
                if (direction instanceof Game_Character) {
                    var d_x = self.bounds.x - direction.bounds.x;
                    var d_y = self.bounds.y - direction.bounds.y;
                    self.direction = (d_x === d_y || d_x === 0) ? d_y < 0 ? Consts.DOWN : Consts.UP : d_x < 0 ? Consts.RIGHT : Consts.LEFT;
                }
        }
    };

    Game_Character.prototype.lookToPlayer = function () {
        var self = this;
        self.look(Main.player);
    };

    var calculate_final_position = function (bounds, ex, ey, time) {
        var final_bounds = {x: ex, y: ey, width: bounds.width, height: bounds.height, groups: ['STEP']};
        var vec = {x: ex - bounds.x, y: ey - bounds.y};
        var c_map = root.Main.map;

        var quadtree = c_map.getTree();
        var collisions = quadtree.retrieve(final_bounds, 'STEP');

        collisions.forEach(function (colision) {
            if (vec.x > 0 && colision.x < (final_bounds.x + bounds.width)) {
                final_bounds.x = colision.x - bounds.width;
            }
            else if (vec.x < 0 && ((colision.x + colision.width) > final_bounds.x)) {
                final_bounds.x = colision.x + colision.width;
            }

            if (vec.y > 0 && colision.y < (final_bounds.y + bounds.height)) {
                final_bounds.y = colision.y - bounds.height;
            }
            else if (vec.y < 0 && ((colision.y + colision.height) > final_bounds.y)) {
                final_bounds.y = colision.y + colision.height;
            }
        });

        if (final_bounds.x < 0) {
            final_bounds.x = 0;
        }
        else if (final_bounds.x > c_map.getWidth() - 32) {
            final_bounds.x = c_map.getHeight() - 32;
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
        else if (final_bounds.y > c_map.getHeight() - 32) {
            final_bounds.y = c_map.getWidth() - 32;
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
            var diff = root.System.time - data.startmoving_time;
            var event = data.event;

            if (diff >= data.moving_time) {
                event.bounds.x = data.end_position.x;
                event.bounds.y = data.end_position.y;
                var callback = data.oncomplete;
                if (typeof callback === 'function') {
                    callback();
                }
                self.character_movement = null;
            }
            else {
                var distance_x = (data.end_position.x - data.start_position.x);
                var distance_y = (data.end_position.y - data.start_position.y);
                var x = data.start_position.x + ((distance_x * diff) / data.moving_time);
                var y = data.start_position.y + ((distance_y * diff) / data.moving_time);
                event.bounds.x = x;
                event.bounds.y = y;
                if (event.bounds._full_inside) {
                    QuadTree.reInsert(event.bounds);
                }
            }
        }
    };

    root.Game_Character = Game_Character;
})(RPG, window);