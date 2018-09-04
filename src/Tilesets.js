'use strict';
(function(root){
    if(!root.Main){
        throw "Tilesets requires Main";
    }
    else{
        if(!root.Main.Graphics){
            throw "Tilesets requires Graphics";
        }
    }

    if(!root.Tileset){
        throw "Tilesets requires Tileset";
    }

    let Tileset = root.Tileset,
        Main = root.Main;

    let tilesets = [];
    let Tilesets = {
        /**
         *
         * @param id {string}
         * @returns {Tileset}
         */
        get:function(id){
            if(tilesets[id] !== undefined){
                return tilesets[id];
            }
            return null;
        },
        /**
         *
         * @param id {string}
         * @param tileset {Tileset}
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
         * @returns {Tilesets}
         */
        get:function(){
            return Tilesets;
        }
    });
})(RPG);