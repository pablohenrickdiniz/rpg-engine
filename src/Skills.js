(function(root){
	if(root.Main == undefined){
		throw "Skills requires Main"
	}

	if(root.Game_Skill == undefined){
		throw "Skills requires Game_Skill"
	}

	var Game_Skill = root.Game_Skill,
		Main = root.Main;
	var skills = [];	

	Main.Skills = {	
		get:function(id){
			if(skills[id] != undefined){
				return skills[id];
			}	
			return null;
		},
		set:function(id,skill){
			if(skill instanceof Game_Skill){
				skills[id] = skill;	
			}	
		}
	};	
})(RPG);