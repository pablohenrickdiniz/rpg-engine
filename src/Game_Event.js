(function (root) {
    if (root.Game_Character == undefined) {
        throw "Event requires Character"
    }

    var Game_Character = root.Game_Character;


    var Game_Event = function (options) {
        var self = this;
        Game_Character.call(self, options);
        self.switches_callbacks = [];
        self.switches = [];
        self.page = null;
        self.pages = [];
        self.bounds.groups = ['EV', 'ACTION_BUTTON'];
        Object.defineProperty(self, 'graphic', {
            get: function () {
                if (self.page !== null && self.page.graphic !== null) {
                    return self.page.graphic;
                }
                return null;
            }
        });
    };

    Game_Event.prototype = Object.create(Game_Character.prototype);
    Game_Event.prototype.constructor = Game_Event;

    /*
     getCurrentFrame():Object
     Retorna o quadtro atual de animação
     */
    Game_Event.prototype.getCurrentFrame = function () {
        var self = this;
        if (self.page !== null) {
            var animation_name = 'step_' + self.direction;
            var animation = self.page.graphic.animations[animation_name];
            return animation.frames[animation.getIndexFrame()];
        }
        return null;
    };

    /*
     enableSwitch(String name):void
     Ativa o evento local "name"
     */
    Game_Event.prototype.enableSwitch = function (name) {
        var self = this;
        self.switches[name] = true;
        if (self.switches_callbacks[name] !== undefined) {
            self.switches_callbacks[name].forEach(function (callback) {
                callback();
            });
        }
    };

    /*
     disableSwitch(String name):void
     Desativa o evento local "name"
     */
    Game_Event.prototype.disableSwitch = function (name) {
        var self = this;
        self.switches[name] = false;
        if (self.switches_callbacks[name] !== undefined) {
            self.switches_callbacks[name].forEach(function (callback) {
                callback();
            });
        }
    };
    /*
     _switchCallback(String name, function callback):void
     Registra a função de callback para ativar ou desativar o switch
     */
    Game_Event.prototype.switchCallback = function (name, callback) {
        var self = this;
        if (self.switches_callbacks[name] === undefined) {
            self.switches_callbacks[name] = [];
        }

        self.switches_callbacks[name].push(callback);
    };

    /*
     addPage(Page page):void
     Adiciona uma nova página ao evento
     */
    Game_Event.prototype.addPage = function (page) {
        var self = this;
        self.pages.push(page);
    };

    Game_Event.prototype.update = function(){
        var self =this;
        if (self.page !== null) {
            if (!self.moving) {
                if (self.graphic !== null) {
                    self.animations[self.direction].pauseToFrame(1);
                }
            }
            else {
                self.refreshed = false;
            }
        }
    };

    root.Event = Game_Event;
})(RPG);