/**
 * @requires Game/Main.js
 */
(function(root){
    let Main = root.Main;

    let animations = [];
    let Animations = {
        /**
		 *
         * @param id {string}
         * @returns {Animation}
         */
    	get:function(id){
    		return animations[id]?animations[id]:null;
    	},
        /**
		 *
         * @param id {string}
         * @param animation {Animation}
         */
    	set:function(id,animation){
    		animations[id] = animation;
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