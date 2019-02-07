/**
 * @requires RPG.js
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;

    let tilesets = [];
    let Tilesets = {
        /**
         *
         * @param id {string}
         * @returns {Tileset}
         */
        get:function(id){
            return tilesets[id]?tilesets[id]:null;
        },
        /**
         *
         * @param id {string}
         * @param tileset {Tileset}
         */
        set:function(id,tileset){
            tilesets[id] = tileset;
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