(function(root){
    if(root.Main == undefined){
        throw "Game_Graphic requires Main"
    }
    else{
        if(root.Main.Graphics == undefined){
            throw "Game_Graphic requires Graphics"
        }
    }

    var Graphics = root.Main.Graphics;

    root.Game_Graphic = function(options){
        var self = this;
        initialize(self);
        options = options || {};
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.dWidth = options.dWidth || null;
        self.dHeight = options.dHeight || null;
        self.sWidth = options.sWidth || null;
        self.sHeight = options.sHeight || null;
        self.startFrame = 0;
        self.graphicID = options.graphicID;
        self.graphicType = options.graphicType || 'graphic';
        self.scale = options.scale || 1;
    };

    function initialize(self){
        var graphicID = null;
        var url = null;
        var sx = 0;
        var sy = 0;
        var sWidth = null;
        var sHeight = null;
        var dWidth = null;
        var dHeight = null;

        Object.defineProperty(self,'graphicID',{
            get:function(){
                return graphicID;
            },
            set:function(gid){
                if(gid != graphicID){
                    graphicID = gid;
                    url = null;
                }
            }
        });

        Object.defineProperty(self,'sx',{
            get:function(){
                return sx;
            },
            set:function(sxn){
                sxn = parseInt(sxn);
                if(!isNaN(sxn) && sxn != sx){
                    sx = sxn;
                    url = null;
                }
            }
        });

        Object.defineProperty(self,'sy',{
            get:function(){
                return  sy;
            },
            set:function(syn){
                syn = parseInt(syn);
                if(!isNaN(syn) && syn != sy){
                    sy = syn;
                    url = null;
                }
            }
        });

        Object.defineProperty(self,'sWidth',{
            configurable:true,
            get:function(){
                if(sWidth == null){
                    return self.image.width;
                }
                return sWidth;
            },
            set:function(sw){
                sw = parseInt(sw);
                if(!isNaN(sw) && sw >= 0 && sw != sWidth){
                    sWidth = sw;
                    url = null;
                }
            }
        });

        Object.defineProperty(self,'sHeight',{
            configurable:true,
            get:function(){
                if(sHeight == null){
                    return self.image.height;
                }
                return sHeight;
            },
            set:function(sh){
                sh = parseInt(sh);
                if(!isNaN(sh) && sh >= 0 && sh != sHeight){
                    sHeight = sh;
                    url = null;
                }
            }
        });



        Object.defineProperty(self,'image',{
            get:function(){
                return Graphics.get(self.graphicType,self.graphicID);
            }
        });

        Object.defineProperty(self,'url',{
            get:function(){
                if(url == null){
                    var sx = self.sx;
                    var sy = self.sy;
                    var width = self.width;
                    var height = self.height;
                    var image = self.image;
                    var canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(image,sx,sy,width,height,0,0,width,height);
                    url = canvas.toDataURL();
                }
                return url;
            }
        });


        Object.defineProperty(self,'width',{
            get:function(){
                if(sWidth != null){
                    return sWidth;
                }
                return self.image.width;
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                if(sHeight != null){
                    return sHeight;
                }
                return self.image.height;
            }
        });

        Object.defineProperty(self,'dWidth',{
            set:function(dw){
                dw = parseInt(dw);
                if(!isNaN(dw) && dw > 0 && dw != dWidth){
                    dWidth = dw;
                }
            },
            get:function(){
                if(dWidth != null){
                    return dWidth;
                }
                return self.width;
            }
        });

        Object.defineProperty(self,'dHeight',{
            set:function(dh){
                dh = parseInt(dh);
                if(!isNaN(dh) && dh > 0 && dh != dHeight){
                    dHeight = dh;
                }
            },
            get:function(){
                if(dHeight != null){
                    return dHeight;
                }
                return self.height;
            }
        });
    }
})(RPG);