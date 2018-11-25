/**
 * Created by pablo on 25/11/18.
 */
'use strict';
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
        }
    };

    Object.defineProperty(root,'Formulas',{
        get:function(){
            return Formulas;
        }
    })
})(RPG);