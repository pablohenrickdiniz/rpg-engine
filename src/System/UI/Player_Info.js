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


    var UI = root.UI,
        Game_Face = root.Game_Face,
        Progress_Bar = root.UI.classes.Progress_Bar;

    var Player_Info = function(options){
        var self = this;
        options = options || {};
        initialize(self);
        self.parent = options.parent || null;
        self.style = options.style || {};
        self.id = options.id;
        self.totalMP = options.totalMP || 100;
        self.totalHP = options.totalHP || 100;
        self.totalST = options.totalST || 100;
        self.MP = options.MP || 100;
        self.HP = options.HP || 100;
        self.ST = options.ST || 100;
        self.name = options.playerName || 'player1';
    };


    Player_Info.prototype.hide = function(){
        var self = this;
        self.element.style.display = 'none';
    };

    Player_Info.prototype.show = function(){
        var self= this;
        self.element.style.display = 'inline-block';
    };


    Player_Info.prototype.remove = function(){
        var self = this;
        var el = self.element;
        if(el.parent){
            el.parent.removeChild(el);
        }
    };

    function initialize(self){
        var element = null;
        var parent = null;
        var face = null;
        var totalMP = 1;
        var totalHP = 1;
        var totalST = 1;
        var MP = 0;
        var HP = 0;
        var ST = 0;
        var name = '';


        Object.defineProperty(self,'parent',{
            get:function(){
                return parent;
            },
            set:function(p){
                if(p instanceof Node && p != parent){
                    var element  =self.element;
                    if(parent != null){
                        parent.removeChild(element);
                    }
                    parent = p;
                    parent.appendChild(element);
                }
            }
        });

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('div');
                    element.style.appearance = 'none';
                    element.style.webkitAppearance = 'none';
                    element.style.display = 'none';
                }
                return element;
            }
        });

        Object.defineProperty(self,'id',{
            get:function(){
                return self.element.id;
            },
            set:function(i){
                if(typeof i == 'string'){
                    self.element.id = i;
                }
            }
        });


        /*Face Image*/
        var faceImage = document.createElement('img');
        faceImage.setAttribute("class","face-image");
        faceImage.draggable = false;


        /*faceContainer*/
        var faceContainer = document.createElement('div');
        faceContainer.setAttribute("class","face-container");
        faceContainer.appendChild(faceImage);
        self.element.appendChild(faceContainer);

        var nameContainer = document.createElement('span');
        nameContainer.setAttribute("class","name-container");
        self.element.appendChild(nameContainer);


        var barContainer = document.createElement('div');
        barContainer.setAttribute("class","bar-container");
        self.element.appendChild(barContainer);

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

        var stBar = new Progress_Bar({visible:true,id:'stamina-bar'});
        var mpBar = new Progress_Bar({visible:true,id:'mp-bar'});
        var hpBar = new Progress_Bar({visible:true,id:'hp-bar'});


        barContainer.appendChild(stBar.element);
        barContainer.appendChild(mpBar.element);
        barContainer.appendChild(hpBar.element);



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
                    nameContainer.innerHTML = name;
                }
            }
        });
    }

    UI.classes.Player_Info = Player_Info;
})(RPG);