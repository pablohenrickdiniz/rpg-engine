/**
 * @requires Game_Skill.js
 * @requries Game/Main.js
 */
(function(root){
	let Game_Skill = root.Game_Skill,
		Main = root.Main;

	let skills = [];
	let Skills = {
        /**
		 *
         * @param id
         * @returns {Game_Skill}
         */
		get:function(id){
			if(skills[id] !== undefined){
				return skills[id];
			}	
			return null;
		},
        /**
		 *
         * @param id {string}
         * @param skill {Game_Skill}
         */
		set:function(id,skill){
			if(skill instanceof Game_Skill){
				skills[id] = skill;	
			}	
		}
	};

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