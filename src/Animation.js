'use strict';
(function(root){
	let Animation = function(options){
		options = options || {};
		let self = this;
	};


	Object.defineProperty(root,'Animation',{
        /**
		 *
         * @returns {Animation}
         */
		get:function(){
			return Animation;
		}
	});
})(RPG);