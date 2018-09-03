'use strict';
(function(root){
	if(root.Main === undefined){
		throw "Skills requires Main";
	}

	if(root.Game_Skill === undefined){
		throw "Skills requires Game_Skill";
	}

	let Game_Skill = root.Game_Skill,
		Main = root.Main;
	let skills = [];
	let Skills = {
        /**
		 *
         * @param id
         * @returns {*}
         */
		get:function(id){
			if(skills[id] !== undefined){
				return skills[id];
			}	
			return null;
		},
        /**
		 *
         * @param id
         * @param skill
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
         * @returns {{get: get, set: set}}
         */
		get:function(){
			return Skills;
		}
	});
})(RPG);