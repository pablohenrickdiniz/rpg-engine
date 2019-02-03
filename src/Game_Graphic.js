/**
 * @requires RPG.js
 * @requires Graphics.js
 */
(function(root){
    let Graphics = root.Main.Graphics;
    /**
     *
     * @param options {object}
     * @constructor
     */
    let Game_Graphic = function(options){
        let self = this;
        initialize(self);
        options = options || {};
        self.sx = options.sx || 0;
        self.sy = options.sy || 0;
        self.dWidth = options.dWidth || null;
        self.dHeight = options.dHeight || null;
        self.sWidth = options.sWidth || null;
        self.sHeight = options.sHeight || null;
        self.graphicID = options.graphicID;
        self.graphicType = options.graphicType || 'graphic';
        self.scale = options.scale || 1;
    };

    /**
     *
     * @param self {Game_Graphic}
     */
    function initialize(self){
        let graphicID = null;
        let url = null;
        let shadow = null;
        let sx = 0;
        let sy = 0;
        let sWidth = null;
        let sHeight = null;
        let dWidth = null;
        let dHeight = null;

        Object.defineProperty(self,'graphicID',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return graphicID;
            },
            /**
             *
             * @param gid {string}
             */
            set:function(gid){
                if(gid !== graphicID){
                    graphicID = gid;
                    url = null;
                }
            }
        });

        Object.defineProperty(self,'sx',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return sx;
            },
            /**
             *
             * @param sxn {number}
             */
            set:function(sxn){
                sxn = parseInt(sxn);
                if(!isNaN(sxn) && sxn >= 0 && sxn !== sx){
                    sx = sxn;
                    url = null;
                }
            }
        });

        Object.defineProperty(self,'sy',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                return  sy;
            },
            /**
             *
             * @param syn {number}
             */
            set:function(syn){
                syn = parseInt(syn);
                if(!isNaN(syn) && syn >= 0 && syn !== sy){
                    sy = syn;
                    url = null;
                    shadow = null;
                }
            }
        });

        Object.defineProperty(self,'sWidth',{
            configurable:true,
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(sWidth == null){
                    return self.image.width;
                }
                return sWidth;
            },
            /**
             *
             * @param sw {number}
             */
            set:function(sw){
                sw = parseInt(sw);
                if(!isNaN(sw) && sw >= 0 && sw !== sWidth){
                    sWidth = sw;
                    url = null;
                    shadow = null;
                }
            }
        });

        Object.defineProperty(self,'sHeight',{
            configurable:true,
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(sHeight == null){
                    return self.image.height;
                }
                return sHeight;
            },
            /**
             *
             * @param sh {number}
             */
            set:function(sh){
                sh = parseInt(sh);
                if(!isNaN(sh) && sh >= 0 && sh !== sHeight){
                    sHeight = sh;
                    url = null;
                    shadow = null;
                }
            }
        });

        Object.defineProperty(self,'image',{
            /**
             *
             * @returns {image}
             */
            get:function(){
                return Graphics.get(self.graphicType,graphicID);
            }
        });

        Object.defineProperty(self,'url',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                if(url == null){
                    let sx = self.sx;
                    let sy = self.sy;
                    let width = self.width;
                    let height = self.height;
                    let image = self.image;
                    if(image !== null && width !== null && height !== null){
                        let canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        let ctx = canvas.getContext('2d');
                        ctx.drawImage(image,sx,sy,width,height,0,0,width,height);
                        url = canvas.toDataURL();
                    }
                }
                return url;
            }
        });

        Object.defineProperty(self,'shadow',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                if(shadow == null){
                    let canvas = document.createElement('canvas');
                    let width = self.width;
                    let height = self.height;
                    canvas.width = width;
                    canvas.height = height;
                    let ctx = canvas.getContext('2d');
                    let image = self.image;
                    ctx.drawImage(image,sx,sy,width,height,0,0,width,height);
                    var imageData = ctx.getImageData(0, 0, width, height);
                    var pixels = imageData.data;
                    for(var i = 0; i < pixels.length; i += 4) {
                        pixels[i] = pixels[i] = 0;
                        pixels[i+1] = pixels[i+1] = 0;
                        pixels[i+2] = pixels[i+2] = 0;
                    }
                    ctx.putImageData(imageData, 0, 0);
                    shadow = new Image();
                    shadow.src = canvas.toDataURL();
                }
                return shadow;
            }
        });

        Object.defineProperty(self,'width',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(sWidth != null){
                    return sWidth;
                }
                else if(self.image !== null){
                    return self.image.width;
                }
                return null;
            }
        });

        Object.defineProperty(self,'height',{
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(sHeight != null){
                    return sHeight;
                }
                else if(self.image !== null){
                    return self.image.height;
                }
                return null;
            }
        });

        Object.defineProperty(self,'dWidth',{
            /**
             *
             * @param dw {number}
             */
            set:function(dw){
                dw = parseInt(dw);
                if(!isNaN(dw) && dw > 0 && dw !== dWidth){
                    dWidth = dw;
                }
            },
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(dWidth != null){
                    return dWidth;
                }
                return self.width;
            }
        });

        Object.defineProperty(self,'dHeight',{
            /**
             *
             * @param dh {number}
             */
            set:function(dh){
                dh = parseInt(dh);
                if(!isNaN(dh) && dh > 0 && dh !== dHeight){
                    dHeight = dh;
                }
            },
            /**
             *
             * @returns {number}
             */
            get:function(){
                if(dHeight != null){
                    return dHeight;
                }
                return self.height;
            }
        });
    }

    Object.defineProperty(root,'Game_Graphic',{
        /**
         *
         * @returns {Game_Graphic}
         */
       get:function(){
           return Game_Graphic;
       }
    });
})(RPG);