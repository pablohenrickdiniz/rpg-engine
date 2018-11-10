'use strict';
(function(root){
    if(!root.Main){
        throw "Animations requires Main";
    }

    if(!root.Animation){
        throw "Animations requires Animation";
    }

    let Animation = root.Animation,
    	Main = root.Main;

    let animations = [];
    let Animations = {
        /**
		 *
         * @param id {string}
         * @returns {Animation}
         */
    	get:function(id){
    		if(animations[id] !== undefined){
    			return animations[id];
    		}
    		return null;
    	},
        /**
		 *
         * @param id {string}
         * @param animation {Animation}
         */
    	set:function(id,animation){
    		if(animation instanceof Animation){
    			animations[id] = animation;		
    		}		
    	}		
    };

    Object.defineProperty(Main,'Animations',{
        /**
		 *
         * @returns {Animations}
         */
    	get:function(){
    		return Animations;
		}
	});
})(RPG);