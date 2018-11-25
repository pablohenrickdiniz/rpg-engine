'use strict';
(function(root){
    if(!root.UI){
        throw "Player_Info requires UI";
    }

    if(!root.UI.Progress_Bar){
        throw  "Player_Info requires Progress_Bar";
    }

    if(!root.UI.Element){
        throw "Player_Info requires Element";
    }

    if(!root.UI.Image){
        throw "Player_Info requires Image";
    }

    if(!root.UI.Text){
        throw "Player_Info requires Text";
    }

    if(!root.Game_Character){
        throw "Player_Info requires Game_Character"
    }

    let UI = root.UI,
        Progress_Bar = UI.Progress_Bar,
        Element = UI.Element,
        Image = UI.Image,
        Text = UI.Text,
        Game_Character = root.Game_Character;

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

        let mpChange  = function(){
            let self = this;
            mpBar.total = self.maxMP;
            mpBar.progress = self.maxMP*100/self.maxMP;
            mpBar.text = [self.MP,'/',self.maxMP].join('');
        };

        let hpChange  = function(){
            let self = this;
            hpBar.total = self.maxHP;
            hpBar.progress = self.maxHP*100/self.maxHP;
            hpBar.text = [self.HP,'/',self.maxHP].join('');
        };

        Object.defineProperty(self,'player',{
            /**
             *
             * @returns {Game_Character}
             */
           get:function(){
               return player;
           },
            /**
             *
             * @param p {Game_Character || null}
             */
           set:function(p){
               if(p !== player && (p == null || p instanceof Game_Character)){
                   if(player !== null){
                       player.off('mpChange',mpChange);
                       player.off('hpChange',hpChange);
                       player.off('maxMPChange',mpChange);
                       player.off('maxHPChange',hpChange);
                   }
                    player = p;
                    if(player !== null){
                        player.on('mpChange',mpChange);
                        player.on('hpChange',hpChange);
                        player.on('maxMPChange',mpChange);
                        player.on('maxHPChange',hpChange);
                        hpBar.total = player.maxHP;
                        hpBar.progress = player.HP*100/player.maxHP;
                        hpBar.text = [player.HP,'/',player.maxHP].join('');
                        mpBar.total = player.maxMP;
                        mpBar.progress = player.maxMP*100/player.maxMP;
                        mpBar.text = [player.MP,'/',player.maxMP].join('');
                        nameContainer.value = player.name;
                        if(player.face){
                            if(player.face.image !== null){
                                faceImage.src = player.face.url;
                            }
                        }
                        mpBar.visible = true;
                        hpBar.visible = true;
                        barContainer.visible = true;
                        faceContainer.visible = true;
                        nameContainer.visible = true;
                    }
                    else{
                        mpBar.visible = false;
                        barContainer.visible = false;
                        faceContainer.visible = false;
                        nameContainer.visible = false;
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
})(RPG);