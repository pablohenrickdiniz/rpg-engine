'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Tilesets requires Main";
    }
    else{
        if(root.Main.Graphics === undefined){
            throw "Tilesets requires Graphics";
        }
    }

    if(root.Tileset === undefined){
        throw "Tilesets requires Tileset";
    }

    let Tileset = root.Tileset,
        Main = root.Main,
        Graphics = Main.Graphics;

    let tilesets = [];
    let Tilesets = {
        /**
         *
         * @param id
         * @returns {*}
         */
        get:function(id){
            if(tilesets[id] !== undefined){
                return tilesets[id];
            }
            return null;
        },
        /**
         *
         * @param id
         * @param tileset
         */
        set:function(id,tileset){
            if(tileset instanceof Tileset){
                tilesets[id] = tileset;
            }
        }
    };

    Object.defineProperty(Main,'Tilesets',{
        /**
         *
         * @returns {{get: get, set: set}}
         */
        get:function(){
            return Tilesets;
        }
    });
})(RPG);