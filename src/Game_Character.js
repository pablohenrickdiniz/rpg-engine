'use strict';
(function (root) {
    if (!root.Animation_Time) {
        throw "Game_Character requires Animation_Time";
    }

    if (!root.Consts) {
        throw "Game_Character requires Consts";
    }

    if(!root.Game_Object){
        throw "Game_Character requires Game_Object";
    }

    if(!root.Main.Charas){
        throw "Game_Character requires Charas";
    }

    if(!root.Main.Faces){
        throw "Game_Character requires Faces";
    }

    if(!root.Main.Tilesets){
        throw "Game_Character requres Tilesets";
    }

    let Animation_Time = root.Animation_Time,
        Consts = root.Consts,
        Main = root.Main,
        Game_Object = root.Game_Object,
        Charas = Main.Charas,
        Faces = Main.Faces,
        Tilesets = Main.Tilesets;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Character = function (options) {
        let self = this;
        Game_Object.call(self,options);
        initialize(self);
        options = options || {};
        self.direction = options.i || Consts.CHARACTER_DIRECTION_DOWN;
        self.charaID = options.charaID || null;
        self.tilesetID = options.tilesetID || null;
        self.faceID = options.faceID;
        self.currentAnimation = options.j || self.animations[Consts.CHARACTER_STOP_DOWN];
    };

    Game_Character.prototype = Object.create(Game_Object.prototype);
    Game_Character.prototype.constructor = Game_Character;

    /**
     *
     * @param direction {number}
     */
    Game_Character.prototype.moveTo = function (direction) {
        let self = this;
        if (direction === Consts.CHARACTER_DIRECTION_RANDOM) {
            direction = Math.floor(Math.random() * 4);
        }
        let x = 0;
        let y = 0;
        self.direction = direction;
        switch (direction) {
            case Consts.CHARACTER_DIRECTION_UP:
                y = -self.vSpeed;
                self.currentAnimation = self.animations[Consts.CHARACTER_STEP_UP];
                break;
            case Consts.CHARACTER_DIRECTION_RIGHT:
                x = self.hSpeed;
                self.currentAnimation = self.animations[Consts.CHARACTER_STEP_RIGHT];
                break;
            case Consts.CHARACTER_DIRECTION_LEFT:
                x = -self.hSpeed;
                self.currentAnimation = self.animations[Consts.CHARACTER_STEP_LEFT];
                break;
            case Consts.CHARACTER_DIRECTION_DOWN:
                y = self.vSpeed;
                self.currentAnimation = self.animations[Consts.CHARACTER_STEP_DOWN];
                break;
        }
        self.move(x, y);
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.stop = function(){
        let self = this;
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
        return self;
    };

    /**
     *
     * @param times {number}
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveUp = function(times){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_UP,times);
        return self;
    };

    /**
     *
     * @param times {number}
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveDown = function(times){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_DOWN,times);
        return self;
    };

    /**
     *
     * @param times {number}
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveRight = function(times){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_RIGHT,times);
        return self;
    };

    /**
     *
     * @param times {number}
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveLeft = function(times){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_LEFT,times);
        return self;
    };

    /**
     *
     * @param times {number}
     * @returns {Game_Character}
     */
    Game_Character.prototype.stepForward = function (times) {
        let self = this;
        self.moveTo(self.direction,times);
        return self;
    };

    /**
     *
     * @param times {number}
     * @returns {Game_Character}
     */
    Game_Character.prototype.stepRandom = function (times) {
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_RANDOM,times);
        return self;
    };

    /**
     *
     * @param direction {number}
     * @returns {Game_Character}
     */
    Game_Character.prototype.turn = function (direction) {
        let self = this;
        switch (direction) {
            case Consts.CHARACTER_DIRECTION_UP:
            case Consts.CHARACTER_DIRECTION_DOWN:
            case Consts.CHARACTER_DIRECTION_RIGHT:
            case Consts.CHARACTER_DIRECTION_LEFT:
                self.direction = direction;
                break;
            default:
                if (direction instanceof Game_Character) {
                    let d_x = self.x - direction.x;
                    let d_y = self.y - direction.y;

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
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.turnDown = function(){
        let self = this;
        return self.turn(Consts.CHARACTER_DIRECTION_DOWN);
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.turnUp = function(){
        let self = this;
        return self.turn(Consts.CHARACTER_DIRECTION_UP);
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.turnLeft = function(){
        let self = this;
        return self.turn(Consts.CHARACTER_DIRECTION_LEFT);
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.turnRight = function(){
        let self = this;
        return self.turn(Consts.CHARACTER_DIRECTION_RIGHT);
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.lookToPlayer = function () {
        let self = this;
        return self.turn(Main.Player);
    };

    /**
     *
     * @param self {Game_Character}
     */
    function initialize(self) {
        let charaID = null;
        let faceID = null;
        let tilesetID = null;

        Object.defineProperty(self, 'charaID', {
            /**
             *
             * @param id {string}
             */
            set: function (id) {
                if (id !== charaID) {
                    charaID = id;
                    let graphic = Charas.get(id);
                    if (graphic != null) {
                        self.animations[Consts.CHARACTER_STEP_DOWN] = new Animation_Time(self.animationSpeed, graphic.cols);
                        self.animations[Consts.CHARACTER_STEP_UP] = new Animation_Time(self.animationSpeed, graphic.cols);
                        self.animations[Consts.CHARACTER_STEP_RIGHT] = new Animation_Time(self.animationSpeed, graphic.cols);
                        self.animations[Consts.CHARACTER_STEP_LEFT] = new Animation_Time(self.animationSpeed, graphic.cols);
                        self.animations[Consts.CHARACTER_STOP_DOWN] = new Animation_Time(self.animationSpeed, 1);
                        self.animations[Consts.CHARACTER_STOP_UP] = new Animation_Time(self.animationSpeed, 1);
                        self.animations[Consts.CHARACTER_STOP_RIGHT] = new Animation_Time(self.animationSpeed, 1);
                        self.animations[Consts.CHARACTER_STOP_LEFT] = new Animation_Time(self.animationSpeed, 1);
                    }
                    else {
                        self.animations = [];
                    }
                }
            },
            /**
             *
             * @returns {string}
             */
            get: function () {
                return charaID;
            }
        });

        Object.defineProperty(self, 'faceID', {
            /**
             *
             * @param id {string}
             */
            set: function (id) {
                if (id !== faceID) {
                    faceID = id;
                }
            },
            /**
             *
             * @returns {string}
             */
            get: function () {
                return faceID;
            }
        });



        Object.defineProperty(self, 'tilesetID', {
            /**
             *
             * @param id {string}
             */
            set: function (id) {
                if (id !== tilesetID) {
                    tilesetID = id;
                }
            },
            /**
             *
             * @returns {string}
             */
            get: function () {
                return tilesetID;
            }
        });

        Object.defineProperty(self,'graphic',{
            configurable:true,
            /**
             *
             * @returns {Game_Graphic}
             */
            get:function(){
                if(charaID !== null){
                    return Charas.get(charaID);
                }
                else if(tilesetID !== null){
                    return Tilesets.get(tilesetID);
                }

                return null;
            }
        });

        Object.defineProperty(self,'face',{
            /**
             *
             * @returns {Game_Face}
             */
            get:function(){
                return Faces.get(self.faceID);
            }
        });

        Object.defineProperty(self,'currentFrame',{
            configurable:false,
            /**
             *
             * @returns {Tile}
             */
            get:function(){
                if(self.currentAnimation !== null && self.graphic !== null){
                    let animation = self.currentAnimation;
                    let i = self.direction;
                    let j;
                    if(animation instanceof Animation_Time){
                        j = animation.getIndexFrame();
                    }
                    else{
                        j = animation;
                    }
                    //
                    //index = self.graphic.startFrame+index;
                    //while(index > self.graphic.cols){
                    //    index = index % self.graphic.cols-1;
                    //}
                    return self.graphic.get(i,j);
                }
                return null;
            }
        });
    }

    Object.defineProperty(root,'Game_Character',{
        /**
         *
         * @returns {Game_Character}
         */
       get:function(){
           return Game_Character;
       }
    });
})(RPG);