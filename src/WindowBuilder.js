(function(w){
    if(w.UI_Window == undefined){
        throw new Error('WindowBuilder requires UI_Window');
    }

    w.WindowBuilder = {
        top_bounds:{sx:144, sy:0, sWidth:16, sHeight:16},
        right_bounds:{sx:176, sy:16, sWidth:16, sHeight:16},
        bottom_bounds:{sx:144, sy:48, sWidth:16, sHeight:16},
        left_bounds:{sx:128, sy:16, sWidth:16, sHeight:16},
        background_bounds:{sWidth:128, sHeight:128},
        top_left_bounds:{sx:128, sy:0, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        top_right_bounds:{sx:176, sy:0, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        bottom_left_bounds:{sx:128, sy:48, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        bottom_right_bounds:{sx:176, sy:48, sWidth:16, sHeight:16, dWidth:16, dHeight:16},
        size:16,
        setBackgroundsBounds:function(bounds){
            var self = this;
            self.background_bounds =bounds;
        },
        setTopBounds:function(bounds){
            var self = this;
            self.top_bounds = bounds;
        },
        setRightBounds:function(bounds){
            var self = this;
            self.right_bounds = bounds;
        },
        setBottomBounds:function(bounds){
            var self = this;
            self.bottom_bounds = bounds;
        },
        setLeftBounds:function(bounds){
            var self = this;
            self.left_bounds = bounds;
        },
        setTopLeftBounds:function(bounds){
            var self = this;
            self.top_left_bounds = bounds;
        },
        setTopRightBounds :function(bounds){
            var self = this;
            self.top_right_bounds = bounds;
        },
        setBottomRightBounds : function(bounds){
            var self = this;
            self.bottom_right_bounds = bounds;
        },
        setBottomLeftBounds : function(bounds){
            var self = this;
            self.bottom_left_bounds = bounds;
        },
        create:function(options,parent){
            return new UI_Window(options,parent);
        }
    };
})(window);