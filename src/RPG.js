(function (w) {
    if (w.CE == undefined) {
        throw new Error('RPG requires Canvas Engine');
    }


    var RPG = {
        Resources:{},
        Main: null,
        /*
         initialize(String container):void
         inicializa a engine de rpg dentro do elemento container
         */
        initialize: function (container) {
            var self = this;
            self.System.initialize(container);
            w.addEventListener('blur',self.System.freeze);
            w.addEventListener('focus',self.System.resume)
        },
        /*actionEvents():void
         * Tratamento de eventos relacionados às ações do jogador
         */
        actionEvents: function () {
            var player = RPG.Main.player;
            var tree = RPG.Main.scene.getTree();

            var bounds_tmp = {
                x: player.bounds.x,
                y: player.bounds.y,
                width: player.bounds.width,
                height: player.bounds.height,
                groups: ['ACTION_BUTTON']
            };

            var direction = player.direction;
            var Direction = RPG.Direction;

            switch (direction) {
                case Direction.UP:
                    bounds_tmp.y -= bounds_tmp.height;
                    bounds_tmp.height *= 2;
                    break;
                case Direction.RIGHT:
                    bounds_tmp.width *= 2;
                    break;
                case Direction.DOWN:
                    bounds_tmp.height *= 2;
                    break;
                case Direction.LEFT:
                    bounds_tmp.x -= bounds_tmp.width;
                    bounds_tmp.width *= 2;
                    break;
            }

            var collisions = tree.retrieve(bounds_tmp, 'ACTION_BUTTON');
            var keyboard = RPG.System.Controls.Keyboard;


            collisions.forEach(function (colision) {
                if (colision.ref !== undefined) {
                    var event = colision.ref;
                    if (event.current_page !== undefined && event.current_page !== null) {
                        var current_page = event.current_page;
                        if (current_page.trigger === Trigger.PLAYER_TOUCH) {
                            current_page.script();
                        }
                        else if (current_page.trigger === Trigger.ACTI0N_BUTTON && keyboard.isActive('KEY_ENTER')) {
                            current_page.script();
                        }
                    }
                }
            });
        }
    };

    w.RPG = RPG;
})(window);