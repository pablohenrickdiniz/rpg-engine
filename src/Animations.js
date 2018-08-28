'use strict';
(function(root){
    if(root.Main === undefined){
        throw "Animations requires Main"
    }

    if(root.Animation === undefined){
        throw "Animations requires Animation"
    }

    var Animation = root.Animation,
    	Main = root.Main;

    var animations = [];	

    Main.Animations = {
        /**
		 *
         * @param id
         * @returns {*}
         */
    	get:function(id){
    		if(animations[id] === undefined){
    			return animations[id];
    		}
    		return null;
    	},
        /**
		 *
         * @param id
         * @param animation
         */
    	set:function(id,animation){
    		if(animation instanceof Animation){
    			animations[id] = animation;		
    		}		
    	}		
    };
})(RPG);