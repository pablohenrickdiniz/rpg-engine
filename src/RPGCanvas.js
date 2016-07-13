(function(w){
    if(w.CE == undefined){
        throw new Error('RPGCanvas requires CanvasEngine');
    }

    /*
     drawQuadTreeCallback(QuadTree quadtree, CanvasLayer layer,Boolean first):void
     Desenha a árvore de colisão(Modo Debug)
     */
    var drawQuadTreeCallback = function(quadtree,context,first){
        //first = first === undefined?true:first;
        //if(first){
        //    layer.clear();
        //}
        //var context = layer.getContext();
        //layer.rect(quadtree.bounds);
        //
        //if(first){
        //    var objects = quadtree.objects;
        //    objects.forEach(function(object){
        //        layer.rect(object);
        //    });
        //}
        //
        //if(!quadtree.isLeaf()){
        //    for(var i =0; i < quadtree.nodes.length;i++){
        //        drawQuadTreeCallback(quadtree.nodes[i],layer,false);
        //    }
        //}
        first = first === undefined?true:first;
        var bounds = quadtree.bounds;
        if(first){
            context.clearRect(0,0,bounds.width,bounds.height);
        }
        context.strokeStyle = '#000000';
        context.strokeRect(bounds.x,bounds.y,bounds.width,bounds.height);
        if(first){
           var objects = quadtree.objects;
            objects.forEach(function(object){
                context.strokeRect(bounds.x,bounds.y,bounds.width,bounds.height);
            });
        }

        if(!quadtree.isLeaf()){
            for(var i =0; i < quadtree.nodes.length;i++){
                drawQuadTreeCallback(quadtree.nodes[i],context,false);
            }
        }
    };

    var RPGCanvas = function(options){
        var self = this;
        CE.call(self,options);
    };

    RPGCanvas.prototype = Object.create(CE.prototype);
    RPGCanvas.constructor = RPGCanvas;

    RPGCanvas.prototype.drawMapArea = function(map,sx,sy,width,height){
        var interval = map.getAreaInterval({x:sx,y:sy,width:width,height:height});
        var self = this;
        for(var i = interval.si; i <= interval.ei;i++){
            for(var j = interval.sj; j <= interval.ej;j++){
                if(map.tiles[i] !== undefined && map.tiles[i][j] !== undefined){
                    map.tiles[i][j].forEach(function(tile,layer){
                        if(self.layers[layer] != undefined){
                            var context = self.layers[layer].getContext();
                            var graphic = tile.getGraphic();
                            var dx = j*graphic.dWidth-sx;
                            var dy = i*graphic.dHeight-sy;
                            dx = parseInt(dx);
                            dy = parseInt(dy);
                            context.drawImage(graphic.image,graphic.sx,graphic.sy,graphic.sWidth,graphic.sHeight,dx,dy,graphic.dWidth,graphic.dHeight);
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
        var context = self.getLayer(layer).getContext();
        drawQuadTreeCallback(quadtree,context);
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
        console.log('draw character');
        if(character.graphic !== null){
            var layer_index = character.layer;
            var self = this;
            if(self.layers[layer_index] !== undefined){
                var layer = self.layers[layer_index];
                var bounds = character.bounds;
                var frame = character.getCurrentFrame();

                if(frame !== undefined){
                    var graphic = frame.getGraphic();
                    var x = bounds.x-RPG.Screen.x;
                    var y = bounds.y-RPG.Screen.y;

                    var context = layer.getContext();
                    context.clearRect(bounds.lx,bounds.ly,graphic.dWidth,graphic.dHeight);
                    context.drawImage(graphic.image,graphic.sx,graphic.sy,graphic.sWidth,graphic.sHeight,x,y,graphic.dWidth,graphic.dHeight);
                    bounds.lx = x;
                    bounds.ly = y;
                    character._refreshed = true;
                }

            }
        }
    };

    w.RPGCanvas = RPGCanvas;
})(window);