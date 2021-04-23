$(document).ready(function(){

    /**
     * Event Function
     */
    $("#inicio").click(function(){
        $("#inicio").hide();
        $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
        $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
        $("#fundoGame").append("<div id='inimigo2'></div>");
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    });

});

