/**
 * @requires ../System/UI/Window.js
 * @requires ../System/UI/Element.js
 * @requires ../System/UI/Text.js
 * @requires ../Game_Character.js
 */
(function(root,rpg){
    let UI = root.UI,
        Window = UI.Window,
        Element = UI.Element,
        Text = UI.Text,
        Game_Character = rpg.Game_Character;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Stats = function(options){
        let self = this;
        options = options || {};
        Window.call(self,options);
        initialize(self);
        self.title = 'Stats';
        self.statsMap = {
            maxHP:'Máx. HP',
            maxMP:'Máx. MP',
            regenHPRate:'HP Regen Rate',
            regenMPRate:'MP Regen Rate',
            nextLevelExperience:'Next Level Exp.',
            attack:'Attack',
            defense:'Defense',
            magicAttack:'Magic Attack',
            magicDefense:'Magic Defense',
            strength:'Strength',
            vitality:'Vitality',
            agility:'Agility'
        };
    };

    Stats.prototype = Object.create(Window.prototype);
    Stats.prototype.constructor = Stats;

    /**
     *
     * @param self
     */
    function initialize(self){
        let character = null;
        let elements = [];
        let statsTable = new Element({
            parent:self,
            class:"stats-table"
        },'table');

        let statsTbody = new Element({
            parent:statsTable,
            class:"stats-table-tbody"
        },'tbody');

        let statsChange = function(){
            let chr = this;
            let stats = chr.stats;
            let keys = Object.keys(stats);
            for(let i = 0; i < keys.length;i++){
                let key = keys[i];
                if(elements[key] === undefined){
                    let element = new Element({
                        parent:statsTbody
                    },'tr');
                    let title = new Text({
                        value:self.statsMap[key]?self.statsMap[key]:key,
                        parent:element
                    },'td');
                    let value = new Text({
                        value:stats[key],
                        parent:element
                    },'td');
                    elements[key] = element;
                }
                else{
                    elements[key].children[0].value = self.statsMap[key]?self.statsMap[key]:key;
                    elements[key].children[1].value = stats[key];
                }
            }

            let ks = Object.keys(elements);
            for(let i = 0; i < ks.length;i++){
                let key = ks[i];
                if(keys.indexOf(key) === -1){
                    elements[key].remove();
                    delete elements[key];
                }
            }
        };

        Object.defineProperty(self,'character',{
           get:function(){
               return character;
           },
           set:function(chr){
               if((chr === null || chr instanceof Game_Character) && chr !== character){
                   if(character !== null){
                       character.off('statsChange',statsChange);
                   }
                   character = chr;
                   if(character !== null){
                        character.on('statsChange',statsChange);
                   }
               }
           }
        });

    }

    Stats.prototype.render = function(){

    };

    Object.defineProperty(UI,'Stats',{
        /**
         *
         * @returns {Stats}
         */
        get:function(){
            return Stats;
        }
    });
})(window,RPG);