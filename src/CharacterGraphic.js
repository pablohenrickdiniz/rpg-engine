(function(w){
    if(w.Animation == undefined){
        throw "CharacterGraphic requires Animation"
    }


    var CharacterGraphic = function(options){
        var self = this;
        var image = options.image;
        var rows = parseInt(options.rows);
        var cols = parseInt(options.cols);
        rows = isNaN(rows)?1:rows;
        cols = isNaN(cols)?1:cols;
        self.image = image;
        self.rows = rows;
        self.cols = cols;
        self.width = image.width/self.cols;
        self.height = image.height/self.rows;
        self.animations = {};
        self.lx = 0;
        self.ly = 0;
        self._initialize();
    };

    /*
     _initialize():void
     Inicializa as animações do gráfico
     */
    CharacterGraphic.prototype._initialize = function(){
        var self = this;
        var image = self.image;
        self.animations.step_down = Animation.create({rows:4, cols:4,si:0,ei:0,image:image});
        self.animations.step_left = Animation.create({rows:4, cols:4,si:1,ei:1,image:image});
        self.animations.step_right = Animation.create({rows:4, cols:4,si:2,ei:2,image:image});
        self.animations.step_up = Animation.create({rows:4, cols:4,si:3,ei:3,image:image});
    };

    w.CharacterGraphic = CharacterGraphic;
})(window);