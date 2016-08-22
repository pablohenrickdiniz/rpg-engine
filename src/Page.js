(function (root) {
    var Page = function (options) {
        var self = this;
        if (options === undefined || !(options.event instanceof Event)) {
            throw new Error('Page requires an event');
        }

        var graphic = options.graphic;
        self.conditions = options.conditions || {};
        self.graphic = options.graphic || null;
        self.script = options.script || function(){};
        self.event = options.event || null;
        self.trigger = options.trigger || Trigger.AUTO_RUN;
        self.initializeConditions();
    };

    Page.prototype.initializeConditions = function () {
        var self = this;
        var global_switch = self.conditions.global_switch;
        var local_switch = self.conditions.local_switch;

        var global_active = false;
        var local_active = false;
        var name_global = null;
        var name_local = null;
        var status_global = null;
        var status_local = null;
        var global_switches = root.Globals.switches;
        var local_switches = self.event.switches;

        if (global_switch !== undefined && global_switch[0] !== undefined && global_switch[1] !== undefined) {
            name_global = global_switch[0];
            status_global = global_switch[1];
            global_active = true;
        }

        if (local_switch !== undefined && local_switch[0] !== undefined && local_switch[1] !== undefined) {
            name_local = local_switch[0];
            status_local = local_switch[1];
            local_active = true;
        }

        var callback = function () {
            var active = (!global_active || (global_active && global_switches[name_global] === true)) &&
                (!local_active || (local_active && local_switches[name_local] === true));
            if (active) {
                self.event.current_page = self;
            }
            else if (self.event.current_page === self) {
                self.event.current_page = null;
            }
        };

        if (global_active) {
            root.Main.switchCallback(name_global, callback);
        }
        if (local_active) {
            self.event.switchCallback(name_local, callback);
        }
    };

    /*
     setGraphic(Graphic graphic):void
     Altera o gráfico da página
     */
    Page.prototype.setGraphic = function (graphic) {
        var self = this;
        self.graphic = graphic;
    };

    root.Page = Page;
})(RPG);