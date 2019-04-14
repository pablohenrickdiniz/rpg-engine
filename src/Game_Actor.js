/**
 * @requires RPG.js
 * @requires Game_Object.js
 * @requires Consts.js
 * @requires Game/Main.js
 * @requires Game_Inventory.js
 * @requires Formulas.js
 * @requires Faces.js
 * @requires Scenes.js
 */
(function(root){
    let Game_Object = root.Game_Object,
        Consts  = root.Consts,
        Main = root.Main,
        Game_Inventory = root.Game_Inventory,
        Formulas = root.Formulas,
        Faces = Main.Faces,
        Scenes = Main.Scenes;
    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Actor = function(options){
        let self = this;
        Game_Object.call(self, options);
        initialize(self);
        self.id = options.id;
        self.invulnerable = options.invulnerable || false;
        options = options || {};
        self.level = options.level || 1;
        self.maxLevel = options.maxLevel || 100;
        self.MP = options.HP || 100;
        self.HP = options.MP || 100;
        self.baseStrength = options.baseStrength || 1;
        self.baseIntelligence = options.baseIntelligence || 1;
        self.baseVitality = options.baseVitality || 1;
        self.skills = [];
        self.inventory = options.inventory;
        self.shadow = options.shadow || true;
        self.faceID = options.faceID;
        self.scene = options.scene;
        self.turnDown();
        self.stop();
    };

    Game_Actor.prototype = Object.create(Game_Object.prototype);
    Game_Actor.prototype.constructor = Game_Actor;

    /**
     *
     * @param direction {number}
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.turn = function (direction) {
        let self = this;
        switch (direction) {
            case Consts.ACTOR_DIRECTION_UP:
            case Consts.ACTOR_DIRECTION_DOWN:
            case Consts.ACTOR_DIRECTION_RIGHT:
            case Consts.ACTOR_DIRECTION_LEFT:
                break;
            default:
                if (direction instanceof Game_Actor) {
                    let d_x = self.x - direction.x;
                    let d_y = self.y - direction.y;

                    if(Math.abs(d_x) > Math.abs(d_y)){
                        if(d_x > 0){
                            direction = Consts.ACTOR_DIRECTION_LEFT;
                        }
                        else if(d_x < 0){
                            direction = Consts.ACTOR_DIRECTION_RIGHT;
                        }
                    }
                    else{
                        if(d_y > 0){
                            direction = Consts.ACTOR_DIRECTION_UP;
                        }
                        else if(d_y < 0){
                            direction = Consts.ACTOR_DIRECTION_DOWN;
                        }
                    }

                }

        }
        self.moveTo(direction,{x:0.0000000001,y:0.0000000001});
        return self;
    };


    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.turnDown = function(){
        let self = this;
        return self.turn(Consts.ACTOR_DIRECTION_DOWN);
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.turnUp = function(){
        let self = this;
        return self.turn(Consts.ACTOR_DIRECTION_UP);
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.turnLeft = function(){
        let self = this;
        return self.turn(Consts.ACTOR_DIRECTION_LEFT);
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.turnRight = function(){
        let self = this;
        return self.turn(Consts.ACTOR_DIRECTION_RIGHT);
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.stop = function(){
        let self = this;
        let graphic = self.graphic;
        switch (self.direction) {
            case Consts.ACTOR_DIRECTION_UP:
                self.playAnimation('stopDown',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:graphic.cols*3+1,
                    endFrame:graphic.cols*3+1
                });
                break;
            case Consts.ACTOR_DIRECTION_RIGHT:
                self.playAnimation('stopRight',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:graphic.cols*2+1,
                    endFrame:graphic.cols*2+1
                });
                break;
            case Consts.ACTOR_DIRECTION_LEFT:
                self.playAnimation('stopLeft',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:graphic.cols+1,
                    endFrame:graphic.cols+1
                });
                break;
            case Consts.ACTOR_DIRECTION_DOWN:
                self.playAnimation('stopDown',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:1,
                    endFrame:1
                });
                break;
        }
        return self;
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.lookToPlayer = function () {
        let self = this;
        return self.turn(Main.currentPlayer);
    };


    /**
     *
     * @param direction {number}
     * @param speed {object}
     */
    Game_Actor.prototype.moveTo = function (direction,speed) {
        let self = this;
        if (direction === Consts.ACTOR_DIRECTION_RANDOM) {
            direction = Math.floor(Math.random() * 4);
        }

        speed = speed || {};
        speed.x = speed.x || 0;
        speed.y = speed.y || 0;
        let graphic = self.graphic;
        let x = 0;
        let y = 0;
        switch (direction) {
            case Consts.ACTOR_DIRECTION_UP:
                y = -speed.y;
                self.playAnimation('stepUp',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:graphic.cols*3,
                    endFrame:graphic.cols*3 + graphic.cols-1
                });
                break;
            case Consts.ACTOR_DIRECTION_RIGHT:
                x = speed.x;
                self.playAnimation('stepRight',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:graphic.cols*2,
                    endFrame:graphic.cols*2 + graphic.cols-1
                });
                break;
            case Consts.ACTOR_DIRECTION_LEFT:
                x = -speed.x;
                self.playAnimation('stepLeft',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:graphic.cols,
                    endFrame:graphic.cols+ graphic.cols-1
                });
                break;
            case Consts.ACTOR_DIRECTION_DOWN:
                y = speed.y;
                self.playAnimation('stepDown',self.charaID,{
                    fps:self.animationSpeed,
                    startFrame:0,
                    endFrame:graphic.cols-1
                });
                break;
        }
        self.move(x, y);
    };

    /**
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.stepUp = function(){
        let self = this;
        self.moveTo(Consts.ACTOR_DIRECTION_UP,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.stepDown = function(){
        let self = this;
        self.moveTo(Consts.ACTOR_DIRECTION_DOWN,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.stepRight = function(){
        let self = this;
        self.moveTo(Consts.ACTOR_DIRECTION_RIGHT,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.stepLeft = function(){
        let self = this;
        self.moveTo(Consts.ACTOR_DIRECTION_LEFT,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.stepForward = function () {
        let self = this;
        self.moveTo(self.direction,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    /**
     *
     * @returns {Game_Actor}
     */
    Game_Actor.prototype.stepRandom = function () {
        let self = this;
        self.moveTo(Consts.ACTOR_DIRECTION_RANDOM,{x:self.hSpeed,y:self.vSpeed});
        return self;
    };

    Game_Actor.prototype.update = function(){
        let self = this;
        self.HP += self.regenHPRate*0.016;
        self.MP += self.regenMPRate*0.016;
        self.trigger('update');
    };

    /**
     *
     * @param options
     */
    Game_Actor.prototype.dammage = function(options){
        options = options || {};

    };

    Game_Actor.prototype.canEquip = function(item){
        let self = this;
        for(let i = 0; i < item.requirements.length;i++){
            let stat = item.requirements[i].stat;
            let value = item.requirements[i].value;
            let statvalue = self[stat];
            switch(item.requirements[i].type){
                case '=':
                    if(statvalue !== value){
                        return false;
                    }
                    break;
                case '>=':
                    if(statvalue < value){
                        return false;
                    }
                    break;
                case '>':
                    if(statvalue <= value){
                        return false;
                    }
                    break;
                case '<=':
                    if(statvalue > value){
                        return false;
                    }
                    break;
                case '<':
                    if(statvalue >= value){
                        return false;
                    }
                    break;
                case '!=':
                case '<>':
                    if(statvalue === value){
                        return false;
                    }
                    break;
            }
        }
        return true;
    };

    Game_Actor.prototype.teleport = function(x,y,scene){
        let self = this;
        if(scene){
            let s = Scenes.get(scene);
            if(s){

            }
        }
        else{
            self.x = x;
            self.y = y;
        }
    };

    /**
     *
     * @param self {Game_Object}
     */
    function initialize(self) {
        let faceID = null;
        let inventory = new Game_Inventory(self);
        let level = 1;
        let maxLevel = 100;
        let charaID = null;

        let stats = {
            maxHP:null,
            maxMP:null,
            regenHPRate:null,
            regenMPRate:null,
            nextLevelExperience:null,
            attack:null,
            defense:null,
            magicAttack:null,
            magicDefense:null,
            strength:null,
            vitality:null,
            agility:null,
            intelligence:null,
            charisma:null,
            luck:null
        };

        let points = {
            HP:100,
            MP:100,
            experience:0
        };

        let baseStats = {
            strength:1,
            vitality:1,
            agility:1,
            intelligence:1,
            charisma:0,
            luck:0
        };

        let keys = Object.keys(stats);
        for(let i = 0; i < keys.length;i++){
            let key = keys[i];
            Object.defineProperty(self,key,{
                get:function(){
                    if(typeof Formulas[key] == 'function' && stats[key] === null){
                        stats[key] = Formulas[key](self);
                        self.trigger('statsChange',[key,stats[key]]);
                    }
                    return stats[key];
                }
            })
        }

        Object.defineProperty(self,'baseVitality',{
            set:function(bv){
                bv = parseInt(bv);
                if(!isNaN(bv) && bv >= 1 && bv !== baseStats.vitality){
                    baseStats.vitality = bv;
                    self.trigger('baseVitalityChange',[bv]);
                }
            },
            /**
             *
             * @returns {number}
             */
            get:function(){
                return baseStats.vitality;
            }
        });

        Object.defineProperty(self,'baseIntelligence',{
            set:function(bi){
                bi = parseInt(bi);
                if(!isNaN(bi) && bi >= 1 && bi !== baseStats.intelligence){
                    baseStats.intelligence = bi;
                    self.trigger('baseIntelligenceChange',[bi]);
                }
            },
            /**
             *
             * @returns {number}
             */
            get:function(){
                return baseStats.intelligence;
            }
        });

        Object.defineProperty(self,'baseStrength',{
            set:function(bs){
                bs = parseInt(bs);
                if(!isNaN(bs) && bs >= 1 && bs !== baseStats.strength){
                    baseStats.strength = bs;
                    self.trigger('baseStrengthChange',[bs]);
                }
            },
            /**
             *
             * @returns {number}
             */
            get:function(){
                return baseStats.strength;
            }
        });

        Object.defineProperty(self,'stats',{
            get:function(){
                let tmp = {};
                let keys = Object.keys(stats);
                for(let i = 0; i < keys.length;i++){
                    let key = keys[i];
                    tmp[key] = self[key];
                }
                return tmp;
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
                hp = parseFloat(hp);
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
                mp = parseFloat(mp);
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
                    inventory = new Game_Inventory(self,inv);
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
                if(!isNaN(l) && l > 0){
                    l = Math.min(l,self.maxLevel);
                    if(l !== level){
                        level = l;
                        self.trigger('levelChange',[level]);
                    }
                }
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

        Object.defineProperty(self,'face',{
            /**
             *
             * @returns {Game_Face}
             */
            get:function(){
                return Faces.get(self.faceID);
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

                    return graphic.get(Consts.ACTOR_DIRECTION_LEFT,j);
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

                    return graphic.get(Consts.ACTOR_DIRECTION_DOWN,j);
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

                    return graphic.get(Consts.ACTOR_DIRECTION_RIGHT,j);
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

                    return graphic.get(Consts.ACTOR_DIRECTION_UP,j);
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
                        return Consts.ACTOR_DIRECTION_RIGHT;
                    }
                    else{
                        return Consts.ACTOR_DIRECTION_LEFT;
                    }
                }
                else{
                    if(vy >= 0){
                        return Consts.ACTOR_DIRECTION_DOWN;
                    }
                    else{
                        return Consts.ACTOR_DIRECTION_UP;
                    }
                }
            }
        });

        self.on([
            'levelChange',
            'baseVitalityChange',
            'baseStrengthChange',
            'baseIntelligenceChange'
        ],function(){
            Object.keys(stats).forEach(function(key){
                stats[key] = null;
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


    Object.defineProperty(root,'Game_Actor',{
        /**
         *
         * @returns {Game_Actor}
         */
        get:function(){
            return Game_Actor;
        }
    });
})(RPG);