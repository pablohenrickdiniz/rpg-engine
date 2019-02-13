/**
 * @requires ../RPG.js
 * @requires Scene.js
 * @requires ../Spriteset_Map.js
 * @requires ../Game_Object.js
 * @requires ../Tile.js
 * @requires ../Game_Graphic.js
 * @requires ../Game_Event.js
 * @requires ../../plugins/Matter/build/matter.js
 */
(function (root,w) {
    let Scene = root.Scene,
        Spriteset_Map = root.Spriteset_Map,
        Game_Object = root.Game_Object,
        Matter = w.Matter,
        Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events,
        Game_Event = root.Game_Event;

    /**
     *
     * @param name
     * @param options
     * @constructor
     */
    let Scene_Map = function (name,options) {
        let self = this;
        Scene.call(self, options);
        options  = options || {};
        self.map = options.map || {};
        self.spriteset = new Spriteset_Map(self.map.spriteset || {});
        self.objects = [];
        self.name = name;
        self.action = false;
        initialize(self);
    };

    Scene_Map.prototype = Object.create(Scene.prototype);
    Scene_Map.prototype.constructor = Scene_Map;

    /**
     *
     * @param object {Game_Object}
     */
    Scene_Map.prototype.add = function(object){
        let self = this;
        self.objects.push(object);
        if(object.body){
            World.add(self.engine.world,object.body);
            if(object instanceof Game_Event){
                let page = object.currentPage;
                if(page.autoRun){
                    page.autoRun.apply(object);
                }
            }
        }

        object.on('remove',function(){
            self.remove(object);
        });
    };

    /**
     *
     * @param object {Game_Object}
     */
    Scene_Map.prototype.remove = function(object){
        let self = this;
        let index = self.objects.indexOf(object);
        if(index !== -1){
            self.objects.splice(index,1);
        }
        if(object.body){
            World.remove(self.engine.world,object.body);
        }
        object.off('remove');
    };

    Scene_Map.prototype.step = function () {
        let self = this;
        Engine.update(self.engine);
        update(self);
    };

    /**
     *
     * @param self {Scene_Map}
     */
    function update(self) {
        let objs = self.objects;
        let length = objs.length;
        let i;
        for (i = 0; i < length; i++) {
            objs[i].update();
        }
        self.action = false;
    }

    /**
     *
     * @param self {Scene_Map}
     */
    function initialize(self){
        let engine = Engine.create();
        engine.world.gravity = {
            x:0,
            y:0
        };
        let size = 20;
        World.add(engine.world,[
            Bodies.rectangle(self.spriteset.realWidth/2, -size/2, self.spriteset.realWidth, size, { isStatic: true,friction: 0 }),
            Bodies.rectangle(self.spriteset.realWidth+size/2, self.spriteset.realHeight/2, size, self.spriteset.realHeight, { isStatic: true,friction:0 }),
            Bodies.rectangle(self.spriteset.realWidth/2, self.spriteset.realHeight+(size/2), self.spriteset.realWidth, size, { isStatic: true,friction:0}),
            Bodies.rectangle(-size/2, self.spriteset.realHeight/2, size, self.spriteset.realHeight, { isStatic: true, friction:0})
        ]);

        let collisionStart = function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                let bodyA = pair.bodyA, bodyB = pair.bodyB,typeA = bodyA.plugin.type, typeB = bodyB.plugin.type;
                if(typeA && typeB){
                    let eventName = [
                        'collisionStart',
                        [typeA,typeB].sort(sortAsc).join()
                    ].join();
                    self.trigger(eventName,[bodyA,bodyB].sort(sortByPlugin));
                }
            }
        };

        let collisionActive = function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                let bodyA = pair.bodyA, bodyB = pair.bodyB,typeA = bodyA.plugin.type, typeB = bodyB.plugin.type;
                if(typeA && typeB){
                    let eventName = [
                        'collisionActive',
                        [typeA,typeB].sort(sortAsc).join()
                    ].join();
                    self.trigger(eventName,[bodyA,bodyB].sort(sortByPlugin));
                }
            }
        };

        let collisionEnd = function(event){
            let pairs = event.pairs;
            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                let bodyA = pair.bodyA, bodyB = pair.bodyB,typeA = bodyA.plugin.type, typeB = bodyB.plugin.type;
                if(typeA && typeB){
                    let eventName = [
                        'collisionEnd',
                        [typeA,typeB].sort(sortAsc).join()
                    ].join();
                    self.trigger(eventName,[bodyA,bodyB].sort(sortByPlugin));
                }
            }
        };

        Object.defineProperty(self,'engine',{
            /**
             *
             * @returns {engine}
             */
            get:function(){
                return engine;
            }
        });

        Object.defineProperty(self,'collisionStart',{
            /**
             *
             * @returns {collisionStart}
             */
            get:function(){
                return collisionStart;
            }
        });

        Object.defineProperty(self,'collisionActive',{
            /**
             *
             * @returns {collisionActive}
             */
            get:function(){
                return collisionActive;
            }
        });

        Object.defineProperty(self,'collisionEnd',{
            /**
             *
             * @returns {collisionEnd}
             */
            get:function(){
                return collisionEnd;
            }
        });
    }

    Scene_Map.prototype.start = function(){
        let self = this;
        let engine = self.engine;
        Events.on(engine,'collisionStart',self.collisionStart);
        Events.on(engine,'collisionActive',self.collisionActive);
        Events.on(engine,'collisionEnd',self.collisionEnd);
        self.on('collisionActive,objectBody,objectBody',function(a,b){
            let objectA = a.plugin.object, objectB = b.plugin.object;
            if(objectA && objectB){
                let typeA = objectA.type, typeB = objectB.type;
                let eventName = [
                    'collisionActive',
                    [typeA,typeB].sort(sortAsc).join()
                ].join();
                self.trigger(eventName,[objectA,objectB].sort(sortByType));
            }
        });

        self.on('collisionActive,Game_Actor,Game_Event',function(actor,event){
            let page = event.currentPage;
            if (page.touch !== null) {
                page.touch.apply(event,[actor]);
            }
            if(page.action && self.action){
                page.action.apply(event,[actor]);
                self.action = false;
            }
        });
        self.running = true;
    };

    Scene_Map.prototype.end = function(){
        let self = this;
        self.running = false;
        let engine = self.engine;
        Events.off(engine,'collisionStart',self.collisionStart);
        Events.off(engine,'collisionActive',self.collisionActive);
        Events.off(engine,'collisionEnd',self.collisionEnd);
        self.off();
    };
    
    /**
     *
     * @param a {string}
     * @param b {string}
     * @returns {boolean}
     */
    function sortAsc(a,b){
        return a.localeCompare(b);
    }

    /**
     *
     * @param a {Game_Object}
     * @param b {Game_Object}
     * @returns {boolean}
     */
    function sortByType(a,b){
        return sortAsc(a.type,b.type);
    }

    /**
     *
     * @param a
     * @param b
     * @returns {boolean}
     */
    function sortByPlugin(a,b){
        return sortByType(a.plugin,b.plugin);
    }

    Object.defineProperty(root,'Scene_Map',{
        /**
         *
         * @returns {Scene_Map}
         */
        get:function(){
            return Scene_Map;
        }
    });
})(RPG,window);
