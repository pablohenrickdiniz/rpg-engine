/**
 * @requries Game/Main.js
 */
(function(root){
	let Main = root.Main;

	let skills = [];
	let Skills = {
        /**
		 *
         * @param id
         * @returns {Game_Skill}
         */
		get:function(id){
			return skills[id]?skills[id]:null;
		},
        /**
		 *
         * @param id {string}
         * @param skill {Game_Skill}
         */
		set:function(id,skill){
			skills[id] = skill;
		},
		/**
		 *
		 * @param id
		 * @returns {boolean}
		 */
		has:function(id){
			return !!skills[id];
		}
	};

	Object.freeze(Skills);
	Object.defineProperty(Main,'Skills',{
        /**
		 *
         * @returns {Skills}
         */
		get:function(){
			return Skills;
		}
	});
})(RPG);