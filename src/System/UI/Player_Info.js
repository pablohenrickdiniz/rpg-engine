'use strict';
(function(root){
    if(!root.UI){
        throw "Player_Info requires UI";
    }

    if(!root.Game_Face){
        throw "Player_Info requires Game_Face";
    }

    if(!root.UI.Progress_Bar){
        throw  "Player_Info requires Progress_Bar";
    }

    if(!root.UI.Element){
        throw "Player_Info requires Element";
    }

    if(!root.UI.Image){
        throw "Player_Info requires Image";
    }

    if(!root.UI.Text){
        throw "Player_Info requires Text";
    }

    let UI = root.UI,
        Game_Face = root.Game_Face,
        Progress_Bar = UI.Progress_Bar,
        Element = UI.Element,
        Image = UI.Image,
        Text = UI.Text;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Player_Info = function(options){
        let self = this;
        options = options || {};
        Element.call(self,options);
        initialize(self);
        self.totalMP = options.totalMP || 100;
        self.totalHP = options.totalHP || 100;
        self.totalST = options.totalST || 100;
        self.MP = options.MP || 100;
        self.HP = options.HP || 100;
        self.ST = options.ST || 100;
        self.name = options.playerName || 'player1';
    };

    Player_Info.prototype = Object.create(Element.prototype);
    Player_Info.prototype.constructor = Player_Info;

    /**
     *
     * @param self {Player_Info}
     */
    function initialize(self){
        let face = null;
        let totalMP = 1;
        let totalHP = 1;
        let totalST = 1;
        let MP = 0;
        let HP = 0;
        let ST = 0;
        let name = '';

        let faceContainer = new Element({
            parent:self,
            class:"face-container"
        });

        let faceImage = new Image({
            parent:faceContainer,
            class:"face-image"
        });

        let nameContainer = new Text({
            parent:self,
            class:"name-container"
        });

        let barContainer = new Element({
            parent:self,
            class:"bar-container"
        });

        let stBar = new Progress_Bar({parent:barContainer,class:'stamina-bar'});
        let mpBar = new Progress_Bar({parent:barContainer,class:'mp-bar'});
        let hpBar = new Progress_Bar({parent:barContainer,class:'hp-bar'});

        Object.defineProperty(self,'face',{
            /**
             *
             * @returns {Game_Face}
             */
            get:function(){
                return face;
            },
            /**
             *
             * @param f {Game_Face}
             */
            set:function(f){
                if(f !== face && f instanceof Game_Face){
                    face = f;
                    faceImage.src = face.image.src;
                }
            }
        });

        Object.defineProperty(self,'totalMP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return totalMP;
            },
            /**
             *
             * @param tmp {number}
             */
            set:function(tmp){
                if(tmp !== totalMP){
                    totalMP = tmp;
                    mpBar.progress = MP*100/totalMP;
                    mpBar.text = MP+'/'+totalMP;
                }
            }
        });

        Object.defineProperty(self,'totalHP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return totalHP;
            },
            /**
             *
             * @param thp {number}
             */
            set:function(thp){
                if(thp !== totalHP){
                    totalHP = thp;
                    hpBar.progress = HP*100/totalHP;
                    hpBar.text = HP+'/'+totalHP;
                }
            }
        });

        Object.defineProperty(self,'totalST',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return totalST;
            },
            /**
             *
             * @param tst {number}
             */
            set:function(tst){
                if(tst !== totalST){
                    totalST = tst;
                    stBar.progress = ST*100/totalST;
                    stBar.text = ST+'/'+totalST;
                }
            }
        });

        Object.defineProperty(self,'MP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return MP;
            },
            /**
             *
             * @param mp {number}
             */
            set:function(mp){
                if(mp !== MP){
                    MP = mp;
                    mpBar.progress = MP*100/totalMP;
                    mpBar.text = MP+'/'+totalMP;
                }
            }
        });

        Object.defineProperty(self,'HP',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return HP;
            },
            /**
             *
             * @param hp {number}
             */
            set:function(hp){
                if(hp !== HP){
                    HP = hp;
                    hpBar.progress = HP*100/totalHP;
                    hpBar.text = HP+"/"+totalHP;
                }
            }
        });

        Object.defineProperty(self,'ST',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return ST;
            },
            /**
             *
             * @param st {number}
             */
            set:function(st){
                if(st !== ST){
                    ST = st;
                    stBar.progress = ST*100/totalST;
                    stBar.text = ST+"/"+totalST;
                }
            }
        });

        Object.defineProperty(self,'name',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return name;
            },
            /**
             *
             * @param n {string}
             */
            set:function(n){
                if(n !== name){
                    name = n;
                    nameContainer.value = name;
                }
            }
        });
    }

    Object.defineProperty(UI,'Player_Info',{
        /**
         *
         * @returns {Player_Info}
         */
       get:function(){
           return Player_Info;
       }
    });
})(RPG);