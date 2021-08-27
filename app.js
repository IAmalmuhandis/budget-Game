var budgetController = (function(){
    var x = 23;
    function add(a){
        return x + a;
    }
    return {
        publicTest: function(b){
            console.log(add(b));
        }
    }
})();
