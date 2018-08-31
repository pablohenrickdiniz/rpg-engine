'use strict';
(function(root){
    let ui_root = null;
    let UI = {
        classes:[]
    };

    function prevent(e){
        e.preventDefault();
        return false;
    }

    Object.defineProperty(UI,'root',{
        /**
         *
         * @returns {UI.classes.Element}
         */
        get:function(){
            return ui_root;
        },
        /**
         *
         * @param r
         */
        set:function(r){
            if(r !== ui_root && r instanceof UI.classes.Element){
                if(ui_root != null){
                    while(ui_root.children.length > 0){
                        r.add(ui_root.children[0]);
                    }
                }
                ui_root = r;
                ui_root.element.setAttribute('tabindex','-1');
            }
        }
    });

    Object.defineProperty(UI,'width',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return UI.root.width;
        },
        /**
         *
         * @param w
         */
        set:function(w){
            UI.root.width = w;
        }
    });

    Object.defineProperty(UI,'height',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return UI.root.height;
        },
        /**
         *
         * @param h
         */
        set:function(h){
            UI.root.height = h;
        }
    });

    root.UI = UI;
})(RPG);