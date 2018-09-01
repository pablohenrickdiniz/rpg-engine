'use strict';
(function(root){
    if(root.Game_Event === undefined){
        throw "Switches requires Game_Event";
    }

    if(root.Main === undefined){
        throw "Switches requires RPG Main";
    }

    let Main = root.Main,
        Game_Event = root.Game_Event;

    let switches = {};

    function update(){
        let scene = Main.currentScene;
        if(scene){
            let objects = scene.objs;
            let length = objects.length;
            for(let i =0; i < length;i++){
                if(objects[i] instanceof Game_Event){
                    objects[i].updateCurrentPage();
                }
            }
        }
    }

    Main.Switches = {
        /**
         *
         * @param name
         */
        enable:function(name){
            if(switches[name] !== true){
                switches[name] = true;
                update();
            }
        },
        /**
         *
         * @param name
         */
        disable:function(name){
            if(switches[name] !== false){
                switches[name] = false;
                update();
            }
        },
        /**
         *
         * @param name
         * @returns {*|boolean}
         */
        read:function(name){
            return !!switches[name];
        }
    };
})(RPG);