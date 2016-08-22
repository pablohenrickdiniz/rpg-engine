(function (w) {
    w.Utils = {
        /*
         * calculate_final_position(Object bounds,double ex, double ey, int time):Object {x:double, y:double, int: time}
         * Calcula a posição final do character, analisando as possíveis colisões que podem ocorrer pelo caminho
         * */
        calculate_final_position: function (bounds, ex, ey, time) {
            var final_bounds = {x: ex, y: ey, width: bounds.width, height: bounds.height, groups: ['STEP']};
            var vec = {x: ex - bounds.x, y: ey - bounds.y};
            var c_map = RPG.Game.current_scene;


            var quadtree = c_map.getTree();
            var collisions = quadtree.retrieve(final_bounds, 'STEP');

            collisions.forEach(function (colision) {
                if (vec.x > 0 && colision.x < (final_bounds.x + bounds.width)) {
                    final_bounds.x = colision.x - bounds.width;
                }
                else if (vec.x < 0 && ((colision.x + colision.width) > final_bounds.x)) {
                    final_bounds.x = colision.x + colision.width;
                }

                if (vec.y > 0 && colision.y < (final_bounds.y + bounds.height)) {
                    final_bounds.y = colision.y - bounds.height;
                }
                else if (vec.y < 0 && ((colision.y + colision.height) > final_bounds.y)) {
                    final_bounds.y = colision.y + colision.height;
                }
            });

            if (final_bounds.x < 0) {
                final_bounds.x = 0;
            }
            else if (final_bounds.x > c_map.getFullWidth() - 32) {
                final_bounds.x = c_map.getFullWidth() - 32;
            }
            else if (vec.x > 0) {
                final_bounds.x = Math.max(final_bounds.x, bounds.x);
            }
            else if (vec.x < 0) {
                final_bounds.x = Math.min(final_bounds.x, bounds.x);
            }
            else {
                final_bounds.x = bounds.x;
            }

            if (final_bounds.y < 0) {
                final_bounds.y = 0;
            }
            else if (final_bounds.y > c_map.getFullHeight() - 32) {
                final_bounds.y = c_map.getFullHeight() - 32;
            }
            else if (vec.y > 0) {
                final_bounds.y = Math.max(final_bounds.y, bounds.y);
            }
            else if (vec.y < 0) {
                final_bounds.y = Math.min(final_bounds.y, bounds.y);
            }
            else {
                final_bounds.y = bounds.y;
            }

            var distance_a = Math.distance({x: bounds.x, y: bounds.y}, {x: ex, y: ey});
            var distance_b = Math.distance({x: bounds.x, y: bounds.y}, {x: final_bounds.x, y: final_bounds.y});
            time = (time * distance_b) / distance_a;

            return {
                x: final_bounds.x,
                y: final_bounds.y,
                time: time
            };
        }
    };
})(window);