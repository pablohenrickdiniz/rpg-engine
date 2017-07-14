(function(root){
    if(root.UI == undefined){
        throw "Player_Info requires UI"
    }

    if(root.Game_Face == undefined){
        throw "Player_Info requires Game_Face"
    }

    if(root.UI.classes.Progress_Bar == undefined){
        throw  "Player_Info requires Progress_Bar"
    }

    if(root.UI.classes.Element == undefined){
        throw "Player_Info requires Element"
    }

    if(root.UI.classes.Image == undefined){
        throw "Player_Info requires Image"
    }

    if(root.UI.classes.Text == undefined){
        throw "Player_Info requires Text"
    }


    var UI = root.UI,
        Game_Face = root.Game_Face,
        Progress_Bar = UI.classes.Progress_Bar,
        Element = UI.classes.Element,
        Image = UI.classes.Image,
        Text = UI.classes.Text;

    var Player_Info = function(options){
        var self = this;
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

    function initialize(self){
        var element = null;
        var face = null;
        var totalMP = 1;
        var totalHP = 1;
        var totalST = 1;
        var MP = 0;
        var HP = 0;
        var ST = 0;
        var name = '';

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('div');
                    element.id = self.id;
                    Element.bind(self,element);
                }
                return element;
            }
        });

        /*faceContainer*/
        var faceContainer = new Element({
            parent:self,
            class:"face-container"
        });
        faceContainer.show();

        /*Face Image*/
        var faceImage = new Image({
            parent:faceContainer,
            class:"face-image"
        });
        faceImage.show();

        var nameContainer = new Text({
            parent:self,
            class:"name-container"
        });
        nameContainer.show();

        var barContainer = new Element({
            parent:self,
            class:"bar-container"
        });
        barContainer.show();

        var stBar = new Progress_Bar({parent:barContainer,id:'stamina-bar'});
        var mpBar = new Progress_Bar({parent:barContainer,id:'mp-bar'});
        var hpBar = new Progress_Bar({parent:barContainer,id:'hp-bar'});

        stBar.show();
        mpBar.show();
        hpBar.show();

        Object.defineProperty(self,'face',{
            get:function(){
                return face;
            },
            set:function(f){
                if(f != face && f instanceof Game_Face){
                    face = f;
                    faceImage.src = face.image.src;
                }
            }
        });



        Object.defineProperty(self,'totalMP',{
            get:function(){
                return totalMP;
            },
            set:function(tmp){
                if(tmp != totalMP){
                    totalMP = tmp;
                    mpBar.progress = MP*100/totalMP;
                    mpBar.text = MP+'/'+totalMP;
                }
            }
        });

        Object.defineProperty(self,'totalHP',{
            get:function(){
                return totalHP;
            },
            set:function(thp){
                if(thp != totalHP){
                    totalHP = thp;
                    hpBar.progress = HP*100/totalHP;
                    hpBar.text = HP+'/'+totalHP;
                }
            }
        });

        Object.defineProperty(self,'totalST',{
            get:function(){
                return totalST;
            },
            set:function(tst){
                if(tst != totalST){
                    totalST = tst;
                    stBar.progress = ST*100/totalST;
                    stBar.text = ST+'/'+totalST;
                }
            }
        });

        Object.defineProperty(self,'MP',{
            get:function(){
                return MP;
            },
            set:function(mp){
                if(mp != MP){
                    MP = mp;
                    mpBar.progress = MP*100/totalMP;
                    mpBar.text = MP+'/'+totalMP;
                }
            }
        });

        Object.defineProperty(self,'HP',{
            get:function(){
                return HP;
            },
            set:function(hp){
                if(hp != HP){
                    HP = hp;
                    hpBar.progress = HP*100/totalHP;
                    hpBar.text = HP+"/"+totalHP;
                }
            }
        });

        Object.defineProperty(self,'ST',{
            get:function(){
                return ST;
            },
            set:function(st){
                if(st != ST){
                    ST = st;
                    stBar.progress = ST*100/totalST;
                    stBar.text = ST+"/"+totalST;
                }
            }
        });

        Object.defineProperty(self,'name',{
            get:function(){
                return name;
            },
            set:function(n){
                if(n != name){
                    name = n;
                    nameContainer.value = name;
                }
            }
        });
    }

    UI.classes.Player_Info = Player_Info;
})(RPG);