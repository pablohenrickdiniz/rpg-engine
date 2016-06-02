(function(w){
    w.UI_Window = function(bounds,parent){
        var self = this;
        self.bounds = bounds;
        self.parent = parent;
        self.graphic = null;
        self.text = "";
    };

    UI_Window.prototype.setGraphic = function(graphic){
        var self = this;
        self.graphic = graphic;
    };

    UI_Window.prototype.setPosition = function(x,y){
        var self = this;
        switch(x){
            case Position.LEFT:
                self.bounds.x = 0;
                break;
            case Position.CENTER:
                var diff_x = self.parent.width-self.bounds.width*self.size;
                self.bounds.x = diff_x/2;
                break;
            case Position.RIGHT:
                self.bounds.x = self.parent.width-self.bounds.width*self.size;
        }

        switch(y){
            case Position.TOP:
                self.bounds.y = 0;
                break;
            case Position.CENTER:
                var diff_y = self.parent.height-self.bounds.height*self.size;
                self.bounds.y = diff_y/2;
                break;
            case Position.BOTTOM:
                self.bounds.y = self.parent.height-self.bounds.height*self.size;
        }
    };
})(window);