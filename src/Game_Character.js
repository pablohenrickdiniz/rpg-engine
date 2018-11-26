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

    if(!root.Game_Inventory){
        throw "Game_Character requires Game_Inventory"
    }

    if(!root.Formulas){
        throw "Game_Character requires Formulas"
    }

    let Game_Animation = root.Game_Animation,
        Consts = root.Consts,
        Main = root.Main,
        Game_Object = root.Game_Object,
        Charas = Main.Charas,
        Faces = Main.Faces,
        Game_Graphic = root.Game_Graphic,
        Game_Inventory = root.Game_Inventory,
        Formulas = root.Formulas;

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
        self.level = options.level || 1;
        self.maxLevel = options.maxLevel || 200;
        self.MP = options.HP || 100;
        self.HP = options.MP || 100;
        self.skills = [];
        self.inventory = options.inventory;
        self.shadow = options.shadow || true;
        self.charaID = options.charaID || null;
        self.faceID = options.faceID;
        self.currentAnimation = self.animations[Consts.CHARACTER_STOP_DOWN];
        self.invulnerable = options.invulnerable || true;
        self.steps = 0;
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
    Game_Character.prototype.stepUp = function(){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_UP,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.stepDown = function(){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_DOWN,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.stepRight = function(){
        let self = this;
        self.moveTo(Consts.CHARACTER_DIRECTION_RIGHT,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Character}
     */
    Game_Character.prototype.stepLeft = function(){
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

    Game_Character.prototype.update = function(){
        let self = this;
        if(self.steps < 60){
            self.steps++;
        }
        else{
            self.steps = 0;
            self.HP += self.regenHPRate;
            self.MP += self.regenMPRate;
        }
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
        self.moveTo(direction,{x:0.0000000001,y:0.0000000001});
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
     * @param options
     */
    Game_Character.prototype.dammage = function(options){
        options = options || {};

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
     * @param self
     * @returns {number}
     */
    function maxHP(self){
        let baseHP = Formulas.yellow(self.level,self.maxLevel,9999);
        let pointHP = self.vitality*10;
        return Math.round(baseHP+pointHP);
    }

    /**
     *
     * @param self
     * @returns {number}
     */
    function regenHPRate(self){
        return Math.max(Math.round(Math.sqrt(self.vitality*self.level)),1);
    }

    /**
     *
     * @param self
     * @returns {number}
     */
    function regenMPRate(self){
        return Math.max(Math.round(Math.sqrt(self.intelligence*self.level)),1);
    }

    /**
     *
     * @param self
     * @returns {number}
     */
    function maxMP(self){
        let baseMP = Formulas.yellow(self.level,self.maxLevel,9999);
        let pointMP = self.intelligence*10;
        return Math.round(baseMP+pointMP);
    }

    /**
     *
     * @param self
     * @returns {number}
     */
    function nextLevelExperience(self){
        return Math.round(Formulas.yellow(self.level,self.maxLevel,99999));
    }

    /**
     *
     * @param self {Game_Character}
     */
    function initialize(self) {
        let charaID = null;
        let faceID = null;
        let direction = Consts.CHARACTER_DIRECTION_DOWN;
        let inventory = new Game_Inventory();
        let level = 1;
        let maxLevel = 100;

        let vars = {
            maxHP:null,
            maxMP:null,
            regenHPRate:null,
            regenMPRate:null,
            nextLevelExperience:null
        };

        let points = {
            HP:100,
            MP:100,
            experience:0
        };

        let stats = {
            strength:1,
            vitality:22,
            defense:1,
            agility:1,
            intelligence:2,
            charisma:1,
            luck:0
        };

        Object.defineProperty(self,'vitality',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return stats.vitality;
            }
        });

        Object.defineProperty(self,'intelligence',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return stats.intelligence;
            }
        });

        Object.defineProperty(self,'maxMP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(vars.maxMP === null){
                    vars.maxMP = maxMP(self);
                }
                return vars.maxMP;
            }
        });

        Object.defineProperty(self,'maxHP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(vars.maxHP === null){
                    vars.maxHP = maxHP(self);
                }
                return vars.maxHP;
            }
        });

        Object.defineProperty(self,'regenHPRate',{
            /**
             *
             * @returns {Number}
             */
            get:function(){
                if(vars.regenHPRate === null){
                    vars.regenHPRate = regenHPRate(self);
                }
                return vars.regenHPRate;
            }
        });

        Object.defineProperty(self,'regenMPRate',{
            /**
             *
             * @returns {Number}
             */
            get:function(){
                if(vars.regenMPRate === null){
                    vars.regenMPRate = regenMPRate(self);
                }
                return vars.regenMPRate;
            }
        });

        Object.defineProperty(self,'nextLevelExperience',{
            /**
             *
             * @returns {Number}
             */
            get:function(){
                if(vars.nextLevelExperience === null){
                    vars.nextLevelExperience = nextLevelExperience(self);
                }
                return vars.nextLevelExperience;
            }
        });

        Object.defineProperty(self,'stats',{
            /**
             *
             * @returns {{}}
             */
            get:function(){
                return stats;
            }
        });

        Object.defineProperty(self,'HP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return points.HP;
            },
            /**
             *
             * @param hp {number}
             */
            set:function(hp){
                hp = parseInt(hp);
                if(!isNaN(hp) && hp >= 0){
                    hp = Math.min(hp,self.maxHP);
                    if(hp !== points.HP){
                        points.HP = hp;
                        self.trigger('HPChange',[hp]);
                    }
                }
            }
        });

        Object.defineProperty(self,'MP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return points.MP;
            },
            /**
             *
             * @param mp {number}
             */
            set:function(mp){
                mp = parseInt(mp);
                if(!isNaN(mp) && mp >= 0){
                    mp = Math.min(mp,self.maxMP);
                    if(mp !== points.MP){
                        points.MP = mp;
                        self.trigger('MPChange',[mp]);
                    }
                }
            }
        });


        Object.defineProperty(self,'experience',{
            get:function(){
                return points.experience;
            },
            set:function(exp){
                exp = parseInt(exp);
                if(!isNaN(exp) && exp >= 0 && exp !== points.experience){
                    points.experience = exp;
                    self.trigger('experienceChange',[exp]);
                }
            }
        });

        Object.defineProperty(self,'inventory',{
            /**
             *
             * @returns {root.Game_Inventory}
             */
            get:function(){
                return inventory;
            },
            /**
             *
             * @param inv
             */
            set:function(inv){
                if(inv instanceof Game_Inventory){
                    inventory = inv;
                }
                else if(inv && inv.constructor === {}.constructor){
                    inventory = new Game_Inventory(inv);
                }
            }
        });

        Object.defineProperty(self,'maxLevel',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return maxLevel;
            },
            /**
             *
             * @param ml
             */
            set:function(ml){
                ml = parseInt(ml);
                if(!isNaN(ml) && ml > 0 && ml !== maxLevel){
                    maxLevel = ml;
                }
            }
        });

        Object.defineProperty(self,'level',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return level;
            },
            /**
             *
             * @param l {number}
             */
            set:function(l){
                l = parseInt(l);
                if(!isNaN(l) && l > 0 && l !== level){
                    level = l;
                    self.trigger('levelChange',[level]);
                }
            }
        });

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
                        i = Math.floor(index / graphic.cols);
                        j = index % graphic.cols;
                    }

                    return graphic.get(i,j);
                }
                return null;
            }
        });


        Object.defineProperty(self,'leftFrame',{
            configurable:false,
            /**
             *
             * @returns {Tile}
             */
            get:function(){
                let graphic = self.graphic;
                let animation = self.currentAnimation;
                if(animation !== null && graphic !== null){
                    let j = 0;
                    let index = animation.index;
                    if(charaID !== null) {
                        j = index % graphic.cols;
                    }

                    return graphic.get(Consts.CHARACTER_DIRECTION_LEFT,j);
                }
                return null;
            }
        });

        Object.defineProperty(self,'downFrame',{
            configurable:false,
            /**
             *
             * @returns {Tile}
             */
            get:function(){
                let graphic = self.graphic;
                let animation = self.currentAnimation;
                if(animation !== null && graphic !== null){
                    let j = 0;
                    let index = animation.index;
                    if(charaID !== null) {
                        j = index % graphic.cols;
                    }

                    return graphic.get(Consts.CHARACTER_DIRECTION_DOWN,j);
                }
                return null;
            }
        });

        Object.defineProperty(self,'rightFrame',{
            configurable:false,
            /**
             *
             * @returns {Tile}
             */
            get:function(){
                let graphic = self.graphic;
                let animation = self.currentAnimation;
                if(animation !== null && graphic !== null){
                    let j = 0;
                    let index = animation.index;
                    if(charaID !== null) {
                        j = index % graphic.cols;
                    }

                    return graphic.get(Consts.CHARACTER_DIRECTION_RIGHT,j);
                }
                return null;
            }
        });

        Object.defineProperty(self,'upFrame',{
            configurable:false,
            /**
             *
             * @returns {Tile}
             */
            get:function(){
                let graphic = self.graphic;
                let animation = self.currentAnimation;
                if(animation !== null && graphic !== null){
                    let j = 0;
                    let index = animation.index;
                    if(charaID !== null) {
                        j = index % graphic.cols;
                    }

                    return graphic.get(Consts.CHARACTER_DIRECTION_UP,j);
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

        self.on('levelChange',function(){
            Object.keys(vars).forEach(function(key){
                vars[key] = null;
            });
        });

        self.on('maxHPChange',function(maxHP){
            self.HP = Math.min(points.HP,maxHP);
        });

        self.on('maxMPChange',function(maxMP){
            self.MP = Math.min(points.MP,maxMP);
        });

        self.on('HPChange',function(hp){
            if(hp === 0){
                self.trigger('die');
            }
        });

        self.on('experienceChange',function(exp){
            if(exp >= self.nextLevelExperience){
                exp -= self.nextLevelExperience;
                self.level++;
                self.experience = exp;
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