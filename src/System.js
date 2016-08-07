(function(root){
    root.System = {
        wait_calls:[],
        wait:function(mss,callback){
            var self=this;
            self.wait_calls.push([mss,callback]);
        },
        step:function(passed){
            var self =this;
            var calls= self.wait_calls;
            if(calls.length > 0){
                for(var i = 0;i <calls.length;i++){
                    calls[i][0]-=passed;
                    if(calls[i][0] <= 0){
                        calls[i][1]();
                        calls.splice(i,1);
                        i--;
                    }
                }
            }
        }
    };
})(RPG);