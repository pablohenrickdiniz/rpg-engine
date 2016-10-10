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

    if(root.Game_Object == undefined){
        throw "Game_Character requires Game_Object"
    }

    var Animation = root.Animation,
        Consts = root.Consts,
        Main = root.Main,
        Game_Timer = root.Game_Timer,
        Character_Graphic = root.Character_Graphic,
        Game_Object = root.Game_Object;
    /**
     *
     * @param options
     * @constructor
     */
    var Game_Character = function (options) {
        var self = this;
        Game_Object.call(self,options);
        options = options || {};
        self.direction = Consts.CHARACTER_DIRECTION_DOWN;
        self.moving = false;
        self.refreshed = false;
        self.obj_movement = null;
        self.setGraphic(options.graphic || new Character_Graphic());
        self.currentAnimation = self.animations[Consts.CHARACTER_STOP_DOWN];
        self.graphic_type = 'character';
        self.parent = options.parent || null;
        self.id = Game_Character.ID;
    };

    Game_Character.prototype = Object.create(Game_Object.prototype);
    Game_Character.prototype.constructor = Game_Character;


    /**
     *
     * @param graphic
     */
    Game_Character.prototype.setGraphic = function (graphic) {
        var self = this;
        self.graphic = graphic;
        self.animations[Consts.CHARACTER_STEP_DOWN] = new Animation(graphic.cols, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_UP] = new Animation(graphic.cols, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_RIGHT] = new Animation(graphic.cols, graphic.cols);
        self.animations[Consts.CHARACTER_STEP_LEFT] = new Animation(graphic.cols, graphic.cols);
        self.animations[Consts.CHARACTER_STOP_DOWN] =  new Animation(graphic.cols, 1);
        self.animations[Consts.CHARACTER_STOP_UP] =  new Animation(graphic.cols, 1);
        self.animations[Consts.CHARACTER_STOP_RIGHT] =  new Animation(graphic.cols, 1);
        self.animations[Consts.CHARACTER_STOP_LEFT] =  new Animation(graphic.cols, 1);
    };

    /**
     *
     * @returns {*|Object}
     */
    Game_Character.prototype.getCurrentFrame = function () {
        var self = this;
        if(self.currentAnimation !=null && self.graphic != null){
            var index = self.currentAnimation.getIndexFrame();
            return self.graphic.get(self.direction, index);
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
            var time = 1000 / self.animationSpeed;
            times = times == undefined?1:times;
            var dir = direction;
            if(dir == Consts.CHARACTER_DIRECTION_RANDOM){
                dir = Math.floor(Math.random()*4);
            }
            switch (dir) {
                case Consts.CHARACTER_DIRECTION_UP:
                    y -= self.vSpeed;
                    self.currentAnimation = self.animations[Consts.CHARACTER_STEP_UP];
                    break;
                case Consts.CHARACTER_DIRECTION_RIGHT:
                    x += self.hSpeed;
                    self.currentAnimation = self.animations[Consts.CHARACTER_STEP_RIGHT];
                    break;
                case Consts.CHARACTER_DIRECTION_LEFT:
                    x -= self.hSpeed;
                    self.currentAnimation = self.animations[Consts.CHARACTER_STEP_LEFT];
                    break;
                case Consts.CHARACTER_DIRECTION_DOWN:
                    y += self.vSpeed;
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
                self.direction = dir;
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


    Game_Character.prototype.moveUp = function(times){
        var self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_UP,times);
    };

    Game_Character.prototype.moveDown = function(times){
        var self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_DOWN,times);
    };

    Game_Character.prototype.moveRight = function(times){
        var self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_RIGHT,times);
    };

    Game_Character.prototype.moveLeft = function(times){
        var self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_LEFT,times);
    };

    Game_Character.prototype.stepForward = function (times) {
        var self = this;
        self.moveTo(self.direction,times);
    };

    Game_Character.prototype.stepRandom = function (times) {
        this.moveTo(Consts.CHARACTER_DIRECTION_RANDOM,times);
    };

    /**
     *
     * @param direction
     */
    Game_Character.prototype.turn = function (direction) {
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

    Game_Character.prototype.turnDown = function(){
        var self = this;
        self.turn(Consts.CHARACTER_DIRECTION_DOWN);
    };

    Game_Character.prototype.turnUp = function(){
        var self = this;
        self.turn(Consts.CHARACTER_DIRECTION_UP);
    };

    Game_Character.prototype.turnLeft = function(){
        var self = this;
        self.turn(Consts.CHARACTER_DIRECTION_LEFT);
    };

    Game_Character.prototype.turnRight = function(){
        var self = this;
        self.turn(Consts.CHARACTER_DIRECTION_RIGHT);
    };

    Game_Character.prototype.lookToPlayer = function () {
        var self = this;
        self.turn(Main.Player);
    };

    root.Game_Character = Game_Character;
})(RPG, window);