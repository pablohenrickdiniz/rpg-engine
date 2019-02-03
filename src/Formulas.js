/**
 * Created by pablo on 25/11/18.
 * @requires RPG.js
 */
(function(root){
    let Formulas = {
        red:function(level,maxlevel,maxvalue){
            return Math.pow(maxvalue*(1/maxlevel),level);
        },
        blue:function(level,maxlevel,maxvalue){
            return Math.pow(level/(maxlevel/Math.sqrt(maxvalue)),2);
        },
        black:function(level,maxlevel,maxvalue){
            return level*maxvalue/maxlevel;
        },
        green:function(level,maxlevel,maxvalue){
            return -((level-maxlevel)/Math.pow(maxlevel/Math.sqrt(maxvalue),2))+maxvalue;
        },
        yellow:function(level,maxlevel,maxvalue){
            return -Math.pow((level-maxlevel)/(maxlevel/Math.sqrt(maxvalue)),2)+maxvalue;
        },
        maxHP:function(chrt){
            let baseHP = this.yellow(chrt.level,chrt.maxLevel,9999);
            let pointHP = chrt.vitality*10;
            return Math.min(Math.round(baseHP+pointHP),9999);
        },
        regenHPRate:function(chrt){
            return Math.max(Math.round(Math.sqrt(chrt.vitality*chrt.level)),1);
        },
        regenMPRate:function(chrt){
            return Math.max(Math.round(Math.sqrt(chrt.intelligence*chrt.level)),1);
        },
        maxMP:function(chrt){
            let baseMP = this.yellow(chrt.level,chrt.maxLevel,9999);
            let pointMP = chrt.intelligence*10;
            return Math.min(Math.round(baseMP+pointMP),9999);
        },
        nextLevelExperience:function(chrt){
            return Math.round(this.yellow(chrt.level,chrt.maxLevel,99999));
        },
        attack:function(chrt){
            return Math.max(Math.round(Math.sqrt(chrt.strength*chrt.level)*10),1);
        },
        magicAttack:function(chrt){
            return Math.max(Math.round(Math.sqrt(chrt.intelligence*chrt.level)*10),1);
        },
        defense:function(chrt){
            return Math.max(Math.round(Math.sqrt(chrt.vitality*chrt.level)*10),1);
        },
        magicDefense:function(chrt){
            return Math.max(Math.round(Math.sqrt(chrt.intelligence*chrt.level)*10),1);
        },
        vitality:function(chrt){
            return chrt.baseVitality;
        },
        strength:function(chrt){
            return chrt.baseStrength;
        },
        intelligence:function(chrt){
            return chrt.baseIntelligence;
        }
    };

    Object.defineProperty(root,'Formulas',{
        get:function(){
            return Formulas;
        }
    })
})(RPG);