'use strict';
(function (root) {
    if (!root.Game_Animation) {
        throw "Game_Character requires Game_Animation";
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

    if(!root.Game_Graphic){
        throw "Game_Character requires Game_Graphic";
    }

    let Game_Animation = root.Game_Animation,
        Consts = root.Consts,
        Main = root.Main,
        Game_Object = root.Game_Object,
        Charas = Main.Charas,
        Faces = Main.Faces,
        Game_Graphic = root.Game_Graphic;

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
        self.charaID = options.charaID || null;
        self.faceID = options.faceID;
        self.currentAnimation = self.animations[Consts.CHARACTER_STOP_DOWN];
        self.flashlight = options.flashlight;
        self.flashlightRadius = options.flashligthRadius;
    };

    Game_Character.prototype = Object.create(Game_Object.prototype);
    Game_Character.prototype.constructor = Game_Character;

    /**
     *
     * @param direction {number}
     * @param speed {object}
     */
    Game_Character.prototype.moveTo = function (direction,speed) {
        let self = this;
        if (direction === Consts.CHARACTER_DIRECTION_RANDOM) {
            direction = Math.floor(Math.random() * 4);
        }

        speed = speed || {};
        speed.x = speed.x || 0;
        speed.y = speed.y || 0;
        let x = 0;
        let y = 0;
        switch (direction) {
            case Consts.CHARACTER_DIRECTION_UP:
                y = -speed.y;
                self.currentAnimation = self.animations[Consts.CHARACTER_STEP_UP];
                break;
            case Consts.CHARACTER_DIRECTION_RIGHT:
                x = speed.x;
                self.currentAnimation = self.animations[Consts.CHARACTER_STEP_RIGHT];
                break;
            case Consts.CHARACTER_DIRECTION_LEFT:
                x = -speed.x;
                self.currentAnimation = self.animations[Consts.CHARACTER_STEP_LEFT];
                break;
            case Consts.CHARACTER_DIRECTION_DOWN:
                y = speed.y;
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
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveUp = function(){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_UP,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveDown = function(){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_DOWN,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveRight = function(){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_RIGHT,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.moveLeft = function(){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_LEFT,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.stepForward = function () {
        let self = this;
        self.moveTo(self.direction,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.stepRandom = function () {
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_RANDOM,{x:self.hSpeed,y:self.vSpeed});
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
                break;
            default:
                if (direction instanceof Game_Character) {
                    let d_x = self.x - direction.x;
                    let d_y = self.y - direction.y;

                    if(Math.abs(d_x) > Math.abs(d_y)){
                        if(d_x > 0){
                            direction = Consts.CHARACTER_DIRECTION_LEFT;
                        }
                        else if(d_x < 0){
                            direction = Consts.CHARACTER_DIRECTION_RIGHT;
                        }
                    }
                    else{
                        if(d_y > 0){
                            direction = Consts.CHARACTER_DIRECTION_UP;
                        }
                        else if(d_y < 0){
                            direction = Consts.CHARACTER_DIRECTION_DOWN;
                        }
                    }

                }

        }
        self.moveTo(direction,{x:0.01,y:0.01});
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
        let direction = Consts.CHARACTER_DIRECTION_DOWN;
        let flashlight = false;
        let flashlightRadius = 100;

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
                        for(let i = 0; i <= 3;i++){
                            self.animations[i] = new Game_Animation(graphic,{
                                fps:self.animationSpeed,
                                startFrame:graphic.cols*i,
                                endFrame:graphic.cols*i+(graphic.cols-1)
                            });
                        }
                        for(let i = 0; i <= 3;i++){
                            self.animations[i+4] = new Game_Animation(graphic,{
                                fps:self.animationSpeed,
                                startFrame:graphic.cols*i+1,
                                endFrame:graphic.cols*i+1
                            });
                        }
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
                let graphic = self.graphic;
                let animation = self.currentAnimation;
                if(animation !== null && graphic !== null){
                    let i = 0;
                    let j = 0;

                    let index = animation.index;
                    if(charaID !== null) {
                        i = Math.floor(animation.index / graphic.cols);
                        j = animation.index % graphic.cols;
                    }

                    return graphic.get(i,j);
                }
                return null;
            }
        });

        Object.defineProperty(self,'direction',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                let body = self.body;
                let vx = body.velocity.x;
                let vy = body.velocity.y;
                if(Math.abs(vx) >= Math.abs(vy)){
                    if(vx >= 0){
                        return Consts.CHARACTER_DIRECTION_RIGHT;
                    }
                    else{
                        return Consts.CHARACTER_DIRECTION_LEFT;
                    }
                }
                else{
                    if(vy >= 0){
                        return Consts.CHARACTER_DIRECTION_DOWN;
                    }
                    else{
                        return Consts.CHARACTER_DIRECTION_UP;
                    }
                }
            }
        });

        Object.defineProperty(self,'flashligth',{
            /**
             *
             * @returns {boolean}
             */
            get:function(){
                return flashlight;
            },
            /**
             *
             * @param f {boolean}
             */
            set:function(f){
                flashlight = !!f;
            }
        });

        Object.defineProperty(self,'flashligthRadius',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return flashlightRadius;
            },
            /**
             *
             * @param f {number}
             */
            set:function(f){
                f = parseInt(f);
                if(!isNaN(f) && f >= 1){
                   flashlightRadius = f;
                }
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