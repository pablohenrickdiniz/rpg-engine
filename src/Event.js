(function(w){
    var Event = function(options){
        var self = this;
        Character.call(self,options);
        self._switches_callbacks = [];
        self.switches = [];
        self.current_page = null;
        self.pages = [];
        self.bounds.groups = ['EV','ACTION_BUTTON'];
        Object.defineProperty(self,'graphic',{
            get:function(){
                if(self.current_page !== null && self.current_page.graphic !== null){
                    return self.current_page.graphic;
                }
                return null;
            }
        });
    };

    Event.prototype = Object.create(Character.prototype);
    Event.constructor = Event;

    /*
     getCurrentFrame():Object
     Retorna o quadtro atual de anima��o
     */
    Event.prototype.getCurrentFrame = function(){
        var self = this;
        if(self.current_page !== null){
            var animation_name = 'step_'+self.direction;
            var animation = self.current_page.graphic.animations[animation_name];
            return animation.frames[animation.getIndexFrame()];
        }
        return null;
    };

    /*
     enableSwitch(String name):void
     Ativa o evento local "name"
     */
    Event.prototype.enableSwitch = function(name){
        var self = this;
        self.switches[name] = true;
        if(self._switches_callbacks[name] !== undefined){
            self._switches_callbacks[name].forEach(function(callback){
                callback();
            });
        }
    };

    /*
     disableSwitch(String name):void
     Desativa o evento local "name"
     */
    Event.prototype.disableSwitch = function(name){
        var self = this;
        self.switches[name] = false;
        if(self._switches_callbacks[name] !== undefined){
            self._switches_callbacks[name].forEach(function(callback){
                callback();
            });
        }
    };
    /*
     _switchCallback(String name, function callback):void
     Registra a fun��o de callback para ativar ou desativar o switch
     */
    Event.prototype._switchCallback = function(name,callback){
        var self = this;
        if(self._switches_callbacks[name] === undefined){
            self._switches_callbacks[name] = [];
        }

        self._switches_callbacks[name].push(callback);
    };

    /*
     addPage(Page page):void
     Adiciona uma nova p�gina ao evento
     */
    Event.prototype.addPage = function(page){
        var self = this;
        self.pages.push(page);
    };
    w.Event = Event;
})(window);