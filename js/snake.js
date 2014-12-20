$(document).ready(function(){

    // Información del canvas
    var canvas = $("#juego-snake")[0];
    var ctx = canvas.getContext("2d");
    var ancho = $("#juego-snake").width();
    var alto = $("#juego-snake").height();
    
    // Información del juego
    var cw = 10;
    var direccion;
    var comida;
    var puntaje;
    var snake_arreglo;

    // Inicia la infirmación de Snake, comida y puntaje    
    function iniciar() {
        direccion = "derecha";  // Dirección por defecto
        crear_snake();
        crear_comida();
        // Inicializar Puntaje
        puntaje = 0;
    }
    
    // Crea todas las casillas de snake en su posición inicial
    function crear_snake() {
        var largo = 5;
        snake_arreglo = [];
        for(var i = largo-1; i>=0; i--) {
            snake_arreglo.push({x: i, y:0});
        }
    }
    
    // Crea comida en una posición aleatoria de la ventana del juego
    function crear_comida() {
        comida = {
            x: Math.round(Math.random()*(ancho-cw)/cw), 
            y: Math.round(Math.random()*(alto-cw)/cw), 
        };
    }

    function dibujar_casilla(x, y) {
        ctx.fillStyle = "black";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }
    
    function chequear_colision(x, y, arreglo) {
        for(var i = 0; i < arreglo.length; i++) {
            if(arreglo[i].x == x && arreglo[i].y == y)
                return true;
        }
        return false;
    }
    
    // Administra la entrada por teclado y actualiza la dirección actual
    $(document).keydown(function(e) {
        var key = e.which;
        // Izquierda
        if (key == "37" && direccion != "derecha") {
            direccion = "izquierda";
        } else if (key == "38" && direccion != "abajo") {
            direccion = "arriba";
        } else if (key == "39" && direccion != "izquierda") {
            direccion = "derecha";
        } else if (key == "40" && direccion != "arriba") {
            direccion = "abajo";
        }
    });
    
    // Actualiza
    function update() {
        // Toma la posición de la primera casilla de snake
        var nx = snake_arreglo[0].x;
        var ny = snake_arreglo[0].y;
        // Actualiza la posición de la casilla según la dirección
        if (direccion == "derecha") {
            nx++;
        } else if(direccion == "izquierda") {
            nx--;
        } else if(direccion == "arriba") {
            ny--;
        } else if(direccion == "abajo") {
            ny++;
        }
        
        // Chequea colisión con el marco de la ventana y
        // en caso de ocurrir reinicia
        if(nx == -1 || nx == ancho/cw || ny == -1 || ny == alto/cw || chequear_colision(nx, ny, snake_arreglo)) {
            // Reinicia el juego
            iniciar();
            return;
        }
        
        var cabeza;
        // Chequea colisión con la comida
        if(nx == comida.x && ny == comida.y) {
            cabeza = {x: nx, y: ny};
            // Incrementa puntaje
            puntaje++;
            // Crear nueva comida
            crear_comida();
        } else {
            // Si no hubo colisión cabeza comida se elimina la última ficha
            cabeza = snake_arreglo.pop();
            // Se coloca la nueva
            cabeza.x = nx;
            cabeza.y = ny;
        }
        // Se coloca la nueva cabeza
        snake_arreglo.unshift(cabeza);
    }
    
    // Dibuja el estado actual
    function render() {
        // Se dibuja la ventana de juego
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ancho, alto);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, ancho, alto);
        
        // Se dibuja a Snake
        for(var i = 0; i < snake_arreglo.length; i++) {
            var c = snake_arreglo[i];
            dibujar_casilla(c.x, c.y);
        }
        
        // Se dibuja la comida
        dibujar_casilla(comida.x, comida.y);
        
        // Dibuja el puntaje
        var puntaje_text = "Puntaje: " + puntaje;
        ctx.fillText(puntaje_text, 5, 10);
    }

    // Método principal
    function main() {
        // Actualiza
        update();
        // Dibuja
        render();
    }

    // Inicializar todos los valores del juego
    iniciar();
    // Se llama a la función cada 65 milisegundos
    setInterval(main, 65);
    
});