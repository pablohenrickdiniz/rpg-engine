(function (root) {
    if (root.Character == undefined) {
        throw "Event requires Character"
    }

    var Character = root.Character;


    var Event = function (options) {
        var self = this;
        Character.call(self, options);
        self.switches_callbacks = [];
        self.switches = [];
        self.current_page = null;
        self.pages = [];
        self.bounds.groups = ['EV', 'ACTION_BUTTON'];
        Object.defineProperty(self, 'graphic', {
            get: function () {
                if (self.current_page !== null && self.current_page.graphic !== null) {
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
     Retorna o quadtro atual de animação
     */
    Event.prototype.getCurrentFrame = function () {
        var self = this;
        if (self.current_page !== null) {
            var animation_name = 'step_' + self.direction;
            var animation = self.current_page.graphic.animations[animation_name];
            return animation.frames[animation.getIndexFrame()];
        }
        return null;
    };

    /*
     enableSwitch(String name):void
     Ativa o evento local "name"
     */
    Event.prototype.enableSwitch = function (name) {
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
    Event.prototype.disableSwitch = function (name) {
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
    Event.prototype.switchCallback = function (name, callback) {
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
    Event.prototype.addPage = function (page) {
        var self = this;
        self.pages.push(page);
    };

    root.Event = Event;
})(RPG);