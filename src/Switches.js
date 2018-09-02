'use strict';
(function(root){
    if(!root.Main){
        throw "Switches requires RPG Main";
    }

    if(!root.Main.Events){
        throw "Switches requires Events";
    }

    let Main = root.Main,
        Events = Main.Events;

    let switches = [];

    Main.Switches = {
        /**
         *
         * @param names
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
                Events.emmit('globalSwitchChanged',[changed]);
            }
        },
        /**
         *
         * @param names
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
                Events.emmit('globalSwitchChanged',[changed]);
            }
        },

        /**
         *
         * @param names
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
         * @param names
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
})(RPG);