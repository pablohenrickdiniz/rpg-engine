(function(w){
    if(w.CE == undefined){
        throw new Error('RPGCanvas requires CanvasEngine');
    }

    /*
     drawQuadTreeCallback(QuadTree quadtree, CanvasLayer layer,Boolean first):void
     Desenha a árvore de colisão(Modo Debug)
     */
    var drawQuadTreeCallback = function(quadtree,layer,first){
        first = first === undefined?true:first;
        if(first){
            layer.clear();
        }
        layer.rect(quadtree.bounds);

        if(first){
            var objects = quadtree.objects;
            objects.forEach(function(object){
                layer.rect(object);
            });
        }

        if(!quadtree.isLeaf()){
            for(var i =0; i < quadtree.nodes.length;i++){
                drawQuadTreeCallback(quadtree.nodes[i],layer,false);
            }
        }
    };

    var RPGCanvas = function(options){
        var self = this;
        CE.call(self,options);
    };

    RPGCanvas.prototype = Object.create(CE.prototype);
    RPGCanvas.constructor = RPGCanvas;

    /*
     drawMap(Map map):void
     Desenha o mapa nas camadas de canvas
     */
    RPGCanvas.drawMap = function(map,context){
        var interval = map.getAreaInterval({
            x:0,
            y:0,
            width:map.getFullWidth(),
            height:map.getFullHeight()
        });
        for(var i = interval.si; i <= interval.ei;i++){
            for(var j = interval.sj; j <= interval.ej;j++){
                if(map.tiles[i] !== undefined && map.tiles[i][j] !== undefined){
                    map.tiles[i][j].forEach(function(tile,layer){
                        if(context.layers[layer] !== undefined){
                            if(tile !== null){
                                var dx = j*map.tile_w;
                                var dy = i*map.tile_h;

                                context.layers[layer].clearRect({
                                    x:dx,
                                    y:dy,
                                    width:tile.dWidth,
                                    height:tile.dHeight
                                });

                                context.layers[layer].image(tile,{
                                    dx:dx,
                                    dy:dy
                                });
                            }
                        }
                    });
                }
            }
        }
    };

    /*
     drawQuadTree(QuadTree quadtree, CanvasLayer layer):void
     Desenha a árvore de colisão(Modo debug)
     */
    RPGCanvas.prototype.drawQuadTree = function(quadtree,layer){
        var self = this;
        layer = self.getLayer(layer);
        drawQuadTreeCallback(quadtree,layer);
    };

    /*
     clearGraphic(int layer index, Graphic graphic):void
     Limpa uma região do canvas onde é desenhado um gráfico
     */
    RPGCanvas.prototype.clearGraphic = function(layer_index,graphic){
        var self = this;
        if(graphic != null && self.layers[layer_index] !== undefined){
            var layer = self.layers[layer_index];
            layer.clearRect({
                x:graphic.lx,
                y:graphic.ly,
                width:graphic.width,
                height:graphic.height
            });
        }
    };

    /*
     drawCharacter(Character character):void
     Desenha um character
     */
    RPGCanvas.prototype.drawCharacter = function(character){
        if(character.graphic !== null){
            var layer_index = character.layer;
            var self = this;
            if(self.layers[layer_index] !== undefined){
                var layer = self.layers[layer_index];
                var bounds = character.bounds;
                var graphic = character.graphic;
                var frame = character.getCurrentFrame();
                var x = bounds.x-(Math.max(graphic.width-32,0));
                var y = bounds.y-(Math.max(graphic.height-32,0));

                if(frame !== undefined){
                    var image = {
                        image:frame.image,
                        sx:frame.sx,
                        sy:frame.sy,
                        dx:x,
                        dy:y,
                        dWidth:frame.dWidth,
                        dHeight:frame.dHeight,
                        sWidth:frame.sWidth,
                        sHeight:frame.sHeight
                    };
                    layer.image(image);
                    graphic.lx = x;
                    graphic.ly = y;
                    character._refreshed = true;
                }

            }
        }
    };

    RPGCanvas.prototype.drawWindow = function(window){
        var parent = window.parent;
        if(window.graphic !== null && window.parent !== null){
            var bounds,size = WindowBuilder.size,dx,dy,count;
            var graphic = window.graphic;
            var x = window.bounds.x;
            var y = window.bounds.y;
            var width = window.bounds.width*size;
            var height = window.bounds.height*size;

            bounds = WindowBuilder.background_bounds;
            parent.image({
                image:graphic,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight,
                dx:x,
                dy:y,
                dWidth:width,
                dHeight:height,
                opacity:60
            });

            bounds = WindowBuilder.top_left_bounds;
            parent.image({
                image:graphic,
                dx:x,
                dy:y,
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.top_right_bounds;
            parent.image({
                image:graphic,
                dx:(x+width-size),
                dy:y,
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.bottom_right_bounds;
            parent.image({
                image:graphic,
                dx:(x+width-size),
                dy:(y+height-size),
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.bottom_left_bounds;
            parent.image({
                image:graphic,
                dx:x,
                dy:(y+height-size),
                sx:bounds.sx,
                sy:bounds.sy,
                dWidth:bounds.dWidth,
                dHeight:bounds.dHeight,
                sWidth:bounds.sWidth,
                sHeight:bounds.sHeight
            });

            bounds = WindowBuilder.top_bounds;
            dx = x+16;
            count = 1;
            while(dx < (x+width-16)){
                parent.image({
                    image:graphic,
                    dx:dx,
                    dy:y,
                    sx:bounds.sx+(count%2===0?16:0),
                    sy:bounds.sy,
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dx+=16;
                count++;
            }

            bounds = WindowBuilder.right_bounds;
            dy = y+16;
            count = 1;

            while(dy < (y+height-16)){
                parent.image({
                    image:graphic,
                    dx:x+width-size,
                    dy:dy,
                    sx:bounds.sx,
                    sy:bounds.sy+(count%2==0?16:0),
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dy+=size;
                count++;
            }

            bounds = WindowBuilder.bottom_bounds;
            dx = x+16;
            count = 1;
            while(dx < (x+width-16)){
                parent.image({
                    image:graphic,
                    dx:dx,
                    dy:y+height-size,
                    sx:bounds.sx+(count%2==0?16:0),
                    sy:bounds.sy,
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dx+=size;
                count++;
            }


            bounds = WindowBuilder.left_bounds;
            dy = y+16;
            count = 1;
            while(dy < (y+height-16)){
                parent.image({
                    image:graphic,
                    dx:x,
                    dy:dy,
                    sx:bounds.sx,
                    sy:bounds.sy+(count%2==0?16:0),
                    dWidth:16,
                    dHeight:16,
                    sWidth:bounds.sWidth,
                    sHeight:bounds.sHeight
                });
                dy+=size;
                count++;
            }

        }
    };
    w.RPGCanvas = RPGCanvas;
})(window);