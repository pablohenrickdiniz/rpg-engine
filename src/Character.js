(function (root,w) {
    if (w.Utils == undefined) {
        throw 'Character requires Utils';
    }

    else if (w.QuadTree == undefined) {
        throw 'Character requires QuadTree';
    }
    else if (root.Direction == undefined) {
        throw 'Character requires Direction';
    }
    else if (root.Animation == undefined) {
        throw "Character requires Animation"
    }

    var Utils = w.Utils,
        QuadTree = w.QuadTree,
        Direction = root.Direction,
        Animation = root.Animation;

    var Character = function (options) {
        var self = this;
        options = options === undefined ? {} : options;
        self.initialize(options);
    };

    /*
     initialize(Object options):void
     Inicializa as variáveis do Character
     */
    Character.prototype.initialize = function (options) {
        var self = this;
        self.speed = options.speed || 5;
        self.x = options.x || 0;
        self.y = options.y || 0;
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
        self.direction = Direction.DOWN;
        self.h_speed = 32;
        self.v_speed = 32;
        self.moving = false;
        self.refreshed = false;
        self.start_moving_time = RPG.System.time;
        self.moving_time = 0;
        self.moving_callback = null;
        self.start_position = {x: x, y: y};
        self.end_position = {x: x, y: y};
        self.camera_focus = false;
        self.animations = {};
        self.follow = null;
    };

    /*
     setPosition(double x, double y):void
     Altera a posição x,y do character
     */
    Character.prototype.setPosition = function (x, y) {
        var self = this;
        self.bounds.x = x;
        self.bounds.y = y;
    };

    /*
     moveTo(double x, double y, int time, function callback):void
     Registra o tempo e a posição final do movimento do character
     */
    Character.prototype.moveTo = function (x, y, time, callback) {
        var self = this;
        var final_bounds = Utils.calculate_final_position(self.bounds, x, y, time);
        self.startmoving_time = RPG.System.time;
        self.moving_time = final_bounds.time;
        self.start_position = {x: self.bounds.x, y: self.bounds.y};
        self.end_position = {x: final_bounds.x, y: final_bounds.y};
        self.moving_callback = callback;
    };

    /*
     _timeStepMove():void
     Executa um passo de tempo no movimento do character
     */
    Character.prototype.timeStepMove = function () {
        var self = this;

        var diff = RPG.System.time - self.startmoving_time;
        if (diff >= self.moving_time) {
            self.bounds.x = self.end_position.x;
            self.bounds.y = self.end_position.y;
            var callback = self.moving_callback;
            self.moving_callback = null;
            if (typeof callback === 'function') {
                callback();
            }
        }
        else {
            var distance_x = (self.end_position.x - self.start_position.x);
            var distance_y = (self.end_position.y - self.start_position.y);
            var x = self.start_position.x + ((distance_x * diff) / self.moving_time);
            var y = self.start_position.y + ((distance_y * diff) / self.moving_time);
            self.bounds.x = x;
            self.bounds.y = y;
            if (self.bounds._full_inside) {
                QuadTree.reInsert(self.bounds);
            }
        }
    };

    /*
     setGraphic(Graphic graphic):void
     Altera o gráfico do character
     */
    Character.prototype.setGraphic = function (graphic) {
        var self = this;
        self.graphic = graphic;
        self.animations.step_down = new Animation(self.speed, graphic.cols);
        self.animations.step_up = new Animation(self.speed, graphic.cols);
        self.animations.step_left = new Animation(self.speed, graphic.cols);
        self.animations.step_right = new Animation(self.speed, graphic.cols);
    };

    /*
     getCurrentFrame():Object
     Retorna o gráfico atual do character
     */
    Character.prototype.getCurrentFrame = function () {
        var self = this;
        var animation = null;
        var row = 0;
        switch (self.direction) {
            case Direction.DOWN:
                animation = self.animations.step_down;
                break;
            case Direction.UP:
                animation = self.animations.step_up;
                break;
            case Direction.LEFT:
                animation = self.animations.step_left;
                break;
            case Direction.RIGHT:
                animation = self.animations.step_right;
                break;
        }

        var index = animation.getIndexFrame();
        return self.graphic.get(self.direction, index);
    };

    /*
     look(String|Character direction):void
     Faz o character olhar para a direção/character direction
     */
    Character.prototype.look = function (direction) {
        var self = this;
        switch (direction) {
            case Direction.UP:
            case Direction.DOWN:
            case Direction.RIGHT:
            case Direction.LEFT:
                self.direction = direction;
                break;
            default:
                if (direction instanceof Character) {
                    var d_x = self.bounds.x - direction.bounds.x;
                    var d_y = self.bounds.y - direction.bounds.y;
                    self.direction = (d_x === d_y || d_x === 0) ? d_y < 0 ? Direction.DOWN : Direction.UP : d_x < 0 ? Direction.RIGHT : Direction.LEFT;
                }
        }
    };

    /*
     step(String direction,int times,function end,Boolean allow):void
     Move o character um passo na direção "direction"
     */
    Character.prototype.stepTo = function (direction, times, end, allow) {
        var self = this;
        allow = allow === undefined ? false : allow;
        if (!self.moving || allow) {
            self.moving = true;
            var x = self.bounds.x;
            var y = self.bounds.y;
            var time = 1000 / self.speed;

            times = times === undefined ? 1 : times;
            switch (direction) {
                case Direction.UP:
                    y -= self.h_speed;
                    break;
                case Direction.RIGHT:
                    x += self.h_speed;
                    break;
                case Direction.LEFT:
                    x -= self.h_speed;
                    break;
                case Direction.DOWN:
                    y += self.h_speed;
                    break;
            }

            if (times < 1) {
                self.moving = false;
                if (typeof end === 'function') {
                    end();
                }
            }
            else {
                var name = Direction.getName(direction);
                var animation_name = 'step_' + name;
                self.animations[animation_name].execute();
                self.direction = direction;
                self.moveTo(x, y, time, function () {
                    times--;
                    self.step(direction, times, end, true);
                });
            }
        }
    };

    /*
     stepForward():void
     Move o character um passo para frente
     */
    Character.prototype.stepForward = function () {
        var self = this;
        self.step(self.direction);
    };

    /*
     stepRandom():void
     Move o character a um passo aleatório
     */
    Character.prototype.stepRandom = function () {
        var self = this;
        var directions = Object.keys(Direction);
        var pos = Math.floor(Math.random() * directions.length);
        var direction = directions[pos];
        self.step(Direction[direction]);
    };

    /*
     follow(Character character):void
     Segue um character
     */
    Character.prototype.follow = function (character) {
        var self = this;
        self.follow = character;
    };

    /*
     unfollow():void
     Deixa de seguir um character
     */
    Character.prototype.unfollow = function () {
        var self = this;
        self.moving = false;
    };

    root.Character = Character;
})(RPG,window);