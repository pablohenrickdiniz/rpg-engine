/**
 * @requires ../System/UI/Progress_Bar.js
 * @requires ../System/UI/Element.js
 * @requires ../System/UI/Image.js
 * @requires ../System/UI/Text.js
 * @requires ../Game_Actor.js
 */
(function(root,rpg){
    let UI = root.UI,
        Progress_Bar = UI.Progress_Bar,
        Element = UI.Element,
        Image = UI.Image,
        Text = UI.Text,
        Game_Actor = rpg.Game_Actor;

    /**
     *
     * @param options {object}
     * @constructor
     */
    let Player_Info = function(options){
        let self = this;
        options = options || {};
        Element.call(self,options);
        initialize(self);
        self.player = options.player || null;
    };

    Player_Info.prototype = Object.create(Element.prototype);
    Player_Info.prototype.constructor = Player_Info;

    /**
     *
     * @param self {Player_Info}
     */
    function initialize(self){
        let player = null;

        let faceContainer = new Element({
            parent:self,
            class:"face-container",
            visible:false
        });

        let faceImage = new Image({
            parent:faceContainer,
            class:"face-image"
        });

        let nameContainer = new Text({
            parent:self,
            class:"name-container",
            visible:false
        });

        let barContainer = new Element({
            parent:self,
            class:"bar-container",
            visible:false
        });

        let stBar = new Progress_Bar({
            parent:barContainer,
            class:'stamina-bar',
            visible:false
        });

        let mpBar = new Progress_Bar({
            parent:barContainer,
            class:'mp-bar',
            visible:false
        });

        let hpBar = new Progress_Bar({
            parent:barContainer,
            class:'hp-bar',
            visible:false
        });

        let levelContainer = new Text({
            parent:self,
            class:"level-container",
            visible:false
        });

        let mpChange  = function(){
            let self = this;
            mpBar.total = self.maxMP;
            mpBar.progress = self.MP;
            mpBar.text = [parseInt(self.MP),'/',self.maxMP].join('');
        };

        let hpChange  = function(){
            let self = this;
            hpBar.total = self.maxHP;
            hpBar.progress = self.HP;
            hpBar.text = [parseInt(self.HP),'/',self.maxHP].join('');
        };

        let levelChange = function(){
            let self = this;
            levelContainer.value = self.level;
        };

        let experienceChange = function(){
            let self = this;
            stBar.total = self.nextLevelExperience;
            stBar.progress = self.experience;
            stBar.text = [self.experience,'/',self.nextLevelExperience].join('');
        };

        Object.defineProperty(self,'player',{
            /**
             *
             * @returns {Game_Actor}
             */
           get:function(){
               return player;
           },
            /**
             *
             * @param p {Game_Actor || null}
             */
           set:function(p){
               if(p !== player && (p == null || p instanceof Game_Actor)){
                   if(player){
                       player.off('MPChange',mpChange);
                       player.off('HPChange',hpChange);
                       player.off('maxMPChange',mpChange);
                       player.off('maxHPChange',hpChange);
                       player.off('experienceChange',experienceChange);
                       player.off('levelChange',levelChange);
                   }
                    player = p;
                    if(player){
                        player.on('MPChange',mpChange);
                        player.on('HPChange',hpChange);
                        player.on('maxMPChange',mpChange);
                        player.on('maxHPChange',hpChange);
                        player.on('experienceChange',experienceChange);
                        player.on('levelChange',levelChange);
                        hpBar.total = player.maxHP;
                        hpBar.progress = player.HP;
                        hpBar.text = [player.HP,'/',player.maxHP].join('');
                        mpBar.total = player.maxMP;
                        mpBar.progress = player.MP;
                        mpBar.text = [player.MP,'/',player.maxMP].join('');
                        stBar.total = player.nextLevelExperience;
                        stBar.progress = player.experience;
                        stBar.text = [player.experience,'/',player.nextLevelExperience].join('');
                        nameContainer.value = player.name;
                        if(player.face){
                            if(player.face.image !== null){
                                faceImage.src = player.face.url;
                            }
                        }
                        levelContainer.value = player.level;
                        mpBar.visible = true;
                        hpBar.visible = true;
                        barContainer.visible = true;
                        faceContainer.visible = true;
                        nameContainer.visible = true;
                        stBar.visible = true;
                        levelContainer.visible = true;
                    }
                    else{
                        mpBar.visible = false;
                        barContainer.visible = false;
                        faceContainer.visible = false;
                        nameContainer.visible = false;
                        levelContainer.visible = false;
                    }
               }
           }
        });
    }

    Object.defineProperty(UI,'Player_Info',{
        /**
         *
         * @returns {Player_Info}
         */
       get:function(){
           return Player_Info;
       }
    });
})(this,RPG);