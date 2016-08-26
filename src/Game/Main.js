(function (root) {



    root.Main = {
        scenes: [],
        scene:null,//cena atual
        map:null,
        player: null,//Jogador Atual
        actors: [],// Atores
        switches: [],//Switches
        variables: [],//Variáveis
        switches_callbacks: [],//callbacks de switches
        /*_switchCallback(String name, function callback)
         * Registra função de callback para ativar ou desativar switch global
         * */
        switchCallback: function (name, callback) {
            var self = this;
            if (self.switches_callbacks[name] === undefined) {
                self.switches_callbacks[name] = [];
            }

            self.switches_callbacks[name].push(callback);
        },
        /*
         enableSwitch(String name):void
         Ativa um Switch "name" global
         */
        enableSwitch: function (name) {
            var self = this;
            self.switches[name] = true;
            if (self.switches_callbacks[name] !== undefined) {
                call_functions(self.switches_callbacks[name]);
            }
        },
        /*
         disableSwitch(String name):void
         Desativa um switch "name" global
         */
        disableSwitch: function (name) {
            var self = this;
            self.switches[name] = false;
            if (self.switches_callbacks[name] !== undefined) {
                call_functions(self.switches_callbacks[name]);
            }
        }
    };

    var call_functions = function(array){
        var length = array.length;
        var i;
        for(i =0; i < length;i++){
            array[i]();
        }
    };
})(RPG);