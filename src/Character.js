(function(w){
    if(w.Utils == undefined){
        throw new Error('Character requires Utils');
    }
    else if(w.QuadTree == undefined){
        throw new Error('Character requires QuadTree');
    }
    else if(w.Direction == undefined){
        throw new Error('Character requires Direction');
    }

    var Utils = w.Utils,
        QuadTree = w.QuadTree;

    var Character = function(options){
        var self = this;
        options = options === undefined?{}:options;
        self.initialize(options);
    };

    /*
     initialize(Object options):void
     Inicializa as variáveis do Character
     */
    Character.prototype.initialize = function(options){
        var self = this;
        var speed = parseInt(options.speed);
        var x = parseInt(options.x);
        var y = parseInt(options.y);
        x = isNaN(x)?0:x;
        y = isNaN(y)?0:y;
        speed = isNaN(speed)?5:Math.abs(speed);
        self.speed = speed;
        self.graphic = null;

        self.bounds = {
            x:x,
            y:y,
            width:32,
            height:32,
            _ref:self,
            groups:['EV']
        };

        self.layer = 2;
        self.direction = Direction.DOWN;
        self.h_speed = 32;
        self.v_speed = 32;

        self._moving = false;
        self._refreshed = false;
        self._start_moving_time = (new Date()).getTime();
        self._moving_time = 0;
        self._moving_callback = null;
        self._start_position = {x:x, y:y};
        self._end_position = {x:x,y:y};
        self._camera_focus = false;
        self._follow = null;
    };

    /*
     setPosition(double x, double y):void
     Altera a posição x,y do character
     */
    Character.prototype.setPosition = function(x,y){
        var self = this;
        self.bounds.x = x;
        self.bounds.y = y;
        self.updateFocus();
    };

    /*
     moveTo(double x, double y, int time, function callback):void
     Registra o tempo e a posição final do movimento do character
     */
    Character.prototype.moveTo = function (x,y,time,callback) {
        var self = this;
        var final_bounds = Utils.calculate_final_position(self.bounds,x,y,time);
        self._start_moving_time = (new Date()).getTime();
        self._moving_time = final_bounds.time;
        self._start_position = {x:self.bounds.x, y:self.bounds.y};
        self._end_position = {x:final_bounds.x, y:final_bounds.y};
        self._moving_callback = callback;
    };

    /*
     _timeStepMove():void
     Executa um passo de tempo no movimento do character
     */
    Character.prototype._timeStepMove = function(){
        var self = this;
        var now = (new Date()).getTime();
        var diff = now - self._start_moving_time;
        if(diff >= self._moving_time){
            self.bounds.x = self._end_position.x;
            self.bounds.y = self._end_position.y;
            var callback = self._moving_callback;
            self._moving_callback = null;
            if(typeof callback === 'function'){
                callback();
            }
        }
        else{
            var distance_x = (self._end_position.x-self._start_position.x);
            var distance_y = (self._end_position.y-self._start_position.y);
            var x =  self._start_position.x + ((distance_x*diff)/self._moving_time);
            var y =  self._start_position.y + ((distance_y*diff)/self._moving_time);
            self.bounds.x = x;
            self.bounds.y = y;
            self.updateFocus();
            QuadTree.reInsert(self.bounds);
        }
    };

    /*
     updateFocus():void
     Atualiza a  posição da câmera (se focada nesse character)
     */
    Character.prototype.updateFocus = function(){
        var self = this;
        if(self._camera_focus){
            var screen_width = RPG._screen_width;
            var screen_height = RPG._screen_height;
            var half_width = screen_width/2;
            var half_height = screen_height/2;
            var x= self.bounds.x;
            var y = self.bounds.y;
            var viewX = -x+half_width-(self.graphic.width/2);
            var viewY = -y+half_height-(self.graphic.height/2);
            RPG._canvas_engine.set({
                viewX:viewX,
                viewY:viewY
            });
        }
    };
    /*
     setGraphic(Graphic graphic):void
     Altera o gráfico do character
     */
    Character.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
        graphic.lx = self.bounds.x;
        graphic.ly = self.bounds.y;
    };

    /*
     getCurrentFrame():Object
     Retorna o gráfico atual do character
     */
    Character.prototype.getCurrentFrame = function(){
        var self = this;
        var animation_name = 'step_'+self.direction;
        var animation = self.graphic.animations[animation_name];
        return animation.frames[animation.getIndexFrame()];
    };

    /*
     look(String|Character direction):void
     Faz o character olhar para a direção/character direction
     */
    Character.prototype.look = function(direction){
        var self = this;
        switch(direction){
            case Direction.UP:
            case Direction.DOWN:
            case Direction.RIGHT:
            case Direction.LEFT:
                self.direction = direction;
                break;
            default:
                if(direction instanceof Character){
                    var d_x = self.bounds.x-direction.bounds.x;
                    var d_y = self.bounds.y-direction.bounds.y;
                    self.direction = (d_x === d_y || d_x === 0)? d_y < 0? Direction.DOWN:Direction.UP:d_x < 0? Direction.RIGHT:Direction.LEFT;
                }
        }
    };

    /*
     step(String direction,int times,function end,Boolean allow):void
     Move o character um passo na direção "direction"
     */
    Character.prototype.step = function(direction,times,end,allow){
        var self = this;
        allow = allow === undefined?false:allow;
        if(!self._moving || allow){
            self._moving = true;
            var x = self.bounds.x;
            var y = self.bounds.y;
            var time = 1000/self.speed;

            times = times === undefined?1:times;
            switch(direction){
                case Direction.UP:
                    y -= self.h_speed;
                    break;
                case Direction.RIGHT:
                    x += self.h_speed;
                    break;
                case Direction.LEFT:
                    x-= self.h_speed;
                    break;
                case Direction.DOWN:
                    y+= self.h_speed;
                    break;
            }

            if(times < 1){
                self._moving = false;
                if(typeof end === 'function'){
                    end();
                }
            }
            else{
                var animation_name = 'step_'+direction;
                self.graphic.animations[animation_name].execute();
                self.direction = direction;
                self.moveTo(x,y,time,function(){
                    times--;
                    self.step(direction,times,end,true);
                });
            }
        }
    };

    /*
     stepForward():void
     Move o character um passo para frente
     */
    Character.prototype.stepForward = function(){
        var self = this;
        self.step(self.direction);
    };

    /*
     stepRandom():void
     Move o character a um passo aleatório
     */
    Character.prototype.stepRandom = function(){
        var self = this;
        var directions = Object.keys(Direction);
        var pos = Math.floor(Math.random()*directions.length);
        var direction = directions[pos];
        self.step(Direction[direction]);
    };

    /*
     follow(Character character):void
     Segue um character
     */
    Character.prototype.follow = function(character){
        var self = this;
        self._follow = character;
    };

    /*
     unfollow():void
     Deixa de seguir um character
     */
    Character.prototype.unfollow = function(){
        var self = this;
        self._moving = false;
    };

    w.Character = Character;
})(window);