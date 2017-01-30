(function (root,w) {
    if (w.QuadTree == undefined) {
        throw "Map requires QuadTree"
    }

    if(root.Spriteset_Map == undefined){
        throw "Game_Map requires Spriteset_Map"
    }

    if(root.Game_Object == undefined){
        throw 'Game_Map requires Game_Object'
    }

    var Spriteset_Map = root.Spriteset_Map,
        QuadTree = w.QuadTree,
        Game_Object = root.Game_Object;

    /**
     *
     * @param options
     * @constructor
     */
    var Game_Map = function (options) {
        var self = this;
        initialize(self);
        options = options  || {};
        var spriteset_map = options.spriteset_map || null;
        self.tileset_id = options.tileset_id;
        self.name = options.name || '';
        self.width = options.width || spriteset_map.tileWidth*spriteset_map.width || 640;
        self.height = options.height || spriteset_map.tileHeight*spriteset_map.height || 640;
        self.objects = options.objects || [];
        self.autoplay_bgs = options.autoplay_bgs || false;
        self.autoplay_bgm = options.autoplay_bgm || false;
        self.bgm = options.bgm || null;
        self.bgs = options.bgs || null;
        self.parent = null;
        self.tree = null;
        self.spriteset_map = spriteset_map || null;
    };

    /**
     *
     * @returns {null|*}
     */
    Game_Map.prototype.getTree = function () {
        var self = this;
        if (self.tree === null) {
            self.tree = new QuadTree({
                x: 0,
                y: 0,
                width: self.width,
                height: self.height
            });
        }
        return self.tree;
    };


    /**
     *
     * @param obj
     */
    Game_Map.prototype.add = function (obj) {
        var self = this;
        if(obj instanceof Game_Object){
            self.objects.push(obj);
            obj.parent = self;
            self.getTree().insert(obj.bounds);
        }
    };

    /**
     *
     * @param obj
     */
    Game_Map.prototype.remove = function (obj) {
        var self = this;
        var index = self.objects.indexOf(obj);
        if (index != -1) {
            obj.parent = null;
            QuadTree.remove(obj.bounds);
            return self.objects.splice(index, 1)[0];
        }
        return null;
    };

    var initialize = function(self){
        var spriteset_map = null;
        Object.defineProperty(self,'spriteset_map',{
            get:function(){
                return spriteset_map;
            },
            set:function(sm){
                if(sm != spriteset_map && sm instanceof Spriteset_Map){
                    spriteset_map = sm;
                    var tree = self.getTree();
                    tree.removeGroup('TILE');
                    for(var i in spriteset_map.sprites){
                        for(var j in spriteset_map.sprites[i]){
                            for(var k in spriteset_map.sprites[i][j]){
                                var tile = spriteset_map.sprites[i][j][k];
                                if(tile){
                                    if(!tile.passable){
                                        var bounds = {
                                            x:j*spriteset_map.tileWidth,
                                            y:i*spriteset_map.tileHeight,
                                            width:tile.width,
                                            height:tile.height,
                                            groups:['TILE','STEP']
                                        };
                                        tree.insert(bounds);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    };

    root.Game_Map = Game_Map;
})(RPG,window);

