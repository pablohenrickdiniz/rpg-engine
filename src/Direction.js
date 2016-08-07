(function(root){
    root.Direction =  {
        DOWN:0,
        LEFT:1,
        RIGHT:2,
        UP:3,
        getName:function(index){
            var self = this;
            switch(index){
                case self.DOWN:
                    return 'down';
                case self.LEFT:
                    return 'left';
                case self.RIGHT:
                    return 'right';
                case self.UP:
                    return 'up';
            }
        }
    };
})(RPG);


