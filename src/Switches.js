/**
 * @requires Game/Main.js
 * @requires System/Events.js
 */
(function(root){
    let Main = root.Main,
        Events = root.Events;

    let switches = [];
    let Switches = {
        /**
         *
         * @param names {string|Array}
         */
        enable:function(names){
            if(!(names instanceof Array))
                names = [names];

            let changed = [];
            for(let i = 0; i < names.length;i++){
                let name = names[i];
                if(!switches[name]){
                    switches[name] = true;
                    changed.push(name);
                }
            }
            if(changed.length > 0){
                Events.trigger('globalSwitchChanged',[changed]);
            }
        },
        /**
         *
         * @param names {string|Array}
         */
        disable:function(names){
            if(!(names instanceof Array))
                names = [names];

            let changed = [];
            for(let i = 0; i < names.length;i++){
                let name = names[i];
                if(switches[name]){
                    delete switches[name];
                    changed.push(name);
                }
            }

            if(changed.length > 0){
                Events.trigger('globalSwitchChanged',[changed]);
            }
        },

        /**
         *
         * @param names {string|Array}
         * @returns {boolean}
         */
        isEnabled:function(names){
            if(!(names instanceof Array))
                names = [names];

            for(let i = 0; i < names.length;i++){
                let name = names[i];
                if(!switches[name]){
                    return false;
                }
            }
            return true;
        },

        /**
         *
         * @param names{string|Array}
         * @returns {boolean}
         */
        isDisabled:function(names){
            if(!(names instanceof Array))
                names = [names];

            for(let i = 0; i < names.length;i++){
                let name = names[i];
                if(!!switches[name]){
                    return false;
                }
            }
            return true;
        }
    };

    Object.defineProperty(Main,'Switches',{
        /**
         *
         * @returns {Switches}
         */
       get:function(){
           return Switches;
       }
    });
})(RPG);