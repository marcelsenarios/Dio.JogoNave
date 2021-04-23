function start() {

    $("#inicio").hide();
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigoHelecoptero' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigoCaminhao'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    var jogo = {}
    const tecla = {
        arrowUp: 38,
        arrowDown: 40,
        A: 65
    }
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var fimdejogo = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();
        
    jogo.pressionou = [];

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
            
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });                   
    
    /**
     * Gameloop
     */
    
    jogo.timer = setInterval(function() {
        moveFundo();
        moveJogador();
        moveInimigoHelicoptero();
        moveInimigoCaminhao();
        moveAmigo();
        colisao();
        placar();
        energia();
    }, 30);        

    function moveFundo() {
        let esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esquerda-1);
    } 

    function moveJogador() {
    
        if (jogo.pressionou[tecla.arrowUp]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);  

            if (topo<=0) {
                $("#jogador").css("top",topo+10);
            }            
        }
        
        if (jogo.pressionou[tecla.arrowDown]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);	

            if (topo>=434) {	
                $("#jogador").css("top",topo-10);
            }            
        }
        
        if (jogo.pressionou[tecla.A]) {    
            if (podeAtirar == true) {		
                podeAtirar = false;
                topo = parseInt($("#jogador").css("top"))
                posicaoX = parseInt($("#jogador").css("left"))
                tiroX = posicaoX + 190;
                topoTiro = topo+37;
                $("#fundoGame").append("<div id='disparo'></div");
                $("#disparo").css("top",topoTiro);
                $("#disparo").css("left",tiroX);
                
                var tempoDisparo = window.setInterval(executaDisparo, 30);                    
            } 

            executaDisparo(tempoDisparo);
        }    
    }    

    function executaDisparo(tempoDisparo) {
        posicaoX = parseInt($("#disparo").css("left"));
        $("#disparo").css("left",posicaoX + 15); 

        if (posicaoX > 900) {                        
            window.clearInterval(tempoDisparo);
            tempoDisparo = null;
            $("#disparo").remove();
            podeAtirar = true;                    
        }
    } 

    function moveInimigoHelicoptero() {
        posicaoX = parseInt($("#inimigoHelecoptero").css("left"));
        $("#inimigoHelecoptero").css("left",posicaoX - velocidade);
        $("#inimigoHelecoptero").css("top",posicaoY);
            
        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigoHelecoptero").css("left",694);
            $("#inimigoHelecoptero").css("top",posicaoY);                
        }
    }    

    function moveInimigoCaminhao() {
        posicaoX = parseInt($("#inimigoCaminhao").css("left"));
        $("#inimigoCaminhao").css("left",posicaoX-3);
            
        if (posicaoX <= 0) {
            $("#inimigoCaminhao").css("left",775);                   
        }
    }     
    
    function moveAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
                    
        if (posicaoX > 906) {                   
            $("#amigo").css("left",0);                            
        }
    
    }     
    
    function colisao() {
        var colisaoJogadorHelecoptero = ($("#jogador").collision($("#inimigoHelecoptero")));
        var colisaoJogadorInimigoCaminhao = ($("#jogador").collision($("#inimigoCaminhao")));
        var colisaoDisparoInimigoHelecoptero = ($("#disparo").collision($("#inimigoHelecoptero")));
        var colisaoDisparoInimigoCaminhao = ($("#disparo").collision($("#inimigoCaminhao")));
        var colisaoJogadorAmigo = ($("#jogador").collision($("#amigo")));
        var colisaoInimigoCaminhaoAmigo = ($("#inimigoCaminhao").collision($("#amigo")));   
                    
        if (colisaoJogadorHelecoptero.length > 0) {	
            energiaAtual--;	
            inimigoHelecopteroX = parseInt($("#inimigoHelecoptero").css("left"));
            inimigoHelecopteroY = parseInt($("#inimigoHelecoptero").css("top"));
            
            explosaoInimigoHelecoptero(inimigoHelecopteroX,inimigoHelecopteroY);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigoHelecoptero").css("left",694);
            $("#inimigoHelecoptero").css("top",posicaoY);
        }

        if (colisaoJogadorInimigoCaminhao.length > 0) {
            energiaAtual--;
            inimigoCaminhaoX = parseInt($("#inimigoCaminhao").css("left"));
            inimigoCaminhaoY = parseInt($("#inimigoCaminhao").css("top"));
            explosaoInimigoCaminhao(inimigoCaminhaoX,inimigoCaminhaoY);
                    
            $("#inimigoCaminhao").remove();
                
            reposicionaInimigoCaminhao();
        }     
                            
    
        if (colisaoDisparoInimigoHelecoptero.length > 0) {
            somDisparo.play();
            pontos = pontos + 100;
            velocidade = velocidade + 0.3;

            inimigoHelecopteroX = parseInt($("#inimigoHelecoptero").css("left"));
            inimigoHelecopteroY = parseInt($("#inimigoHelecoptero").css("top"));

            explosaoInimigoHelecoptero(inimigoHelecopteroX,inimigoHelecopteroY);
            $("#disparo").css("left",950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigoHelecoptero").css("left",694);
            $("#inimigoHelecoptero").css("top",posicaoY);
        }
            
        if (colisaoDisparoInimigoCaminhao.length > 0) {                
            somDisparo.play();
            pontos = pontos + 50;

            inimigoCaminhaoX = parseInt($("#inimigoCaminhao").css("left"));
            inimigoCaminhaoY = parseInt($("#inimigoCaminhao").css("top"));
            $("#inimigoCaminhao").remove();
        
            explosaoInimigoCaminhao(inimigoCaminhaoX,inimigoCaminhaoY);
            $("#disparo").css("left",950);

            reposicionaInimigoCaminhao();                    
        }
            
        if (colisaoJogadorAmigo.length > 0) {  
            somResgate.play();
            salvos++;              
            reposicionaAmigo();
            $("#amigo").remove();
        }
            
        if (colisaoInimigoCaminhaoAmigo.length > 0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosaoInimigoCaminhaoAmigo(amigoX, amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();                        
        }

    }        

    function explosaoInimigoHelecoptero(inimigoHelecopteroX,inimigoHelecopteroY) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosaoInimigoHelecoptero'></div");
        $("#explosaoInimigoHelecoptero").css("background-image", "url(imgs/explosao.png)");
        var explosaoInimigoHelecopter = $("#explosaoInimigoHelecoptero");
        explosaoInimigoHelecopter.css("top", inimigoHelecopteroX);
        explosaoInimigoHelecopter.css("left", inimigoHelecopteroY);
        explosaoInimigoHelecopter.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao = window.setInterval(removeExplosao, 5000);

        function removeExplosao() {
            explosaoInimigoHelecopter.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }


    function explosaoInimigoCaminhao(inimigoCaminhaoX,inimigoCaminhaoY) {	
        somExplosao.play();
        $("#fundoGame").append("<div id='explosaoInimigoCaminhao'></div");
        $("#explosaoInimigoCaminhao").css("background-image", "url(imgs/explosao.png)");
        var explosaoInimigoCaminhao = $("#explosaoInimigoCaminhao");
        explosaoInimigoCaminhao.css("top", inimigoCaminhaoY);
        explosaoInimigoCaminhao.css("left", inimigoCaminhaoX);
        explosaoInimigoCaminhao.animate({width:200, opacity:0}, "slow");
        
        var tempoexplosaoInimigoCaminhao=window.setInterval(removeExplosaoInimigoCaminhao, 1000);
        
        function removeExplosaoInimigoCaminhao() {                
            explosaoInimigoCaminhao.remove();
            window.clearInterval(tempoexplosaoInimigoCaminhao);
            tempoexplosaoInimigoCaminhao = null;                
        }
    }
    
    function explosaoInimigoCaminhaoAmigo(amigoX,amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosaoInimigoCaminhaoAmigo' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
        
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;       
        }             
    }
        
    function reposicionaInimigoCaminhao() {        
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);
        
        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
                
            if (fimdejogo == false) {                
                $("#fundoGame").append("<div id='inimigoCaminhao'></div");                
            }
            
        }	
    }	
    
    function reposicionaAmigo() {        
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
    
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            
            if (fimdejogo == false) {                
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");                
            }            
        }            
    } 
    
    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }


    function energia() {	
        if (energiaAtual == 3) {                
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        } else if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        } else if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        } else if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(imgs/energia0.png)");
            gameOver();
        }
    }

    function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onclick='reiniciaJogo()'><h3>Jogar Novamente</h3></div>");
    }

}

function reiniciaJogo() {
    console.log("Oasasasas");
    somGameover.pause();
    $("#fim").remove();
    start();
}