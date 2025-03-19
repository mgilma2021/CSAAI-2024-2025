//-- Clase cronómetro
class Crono {

    //-- Constructor. Hay que indicar el 
    //-- display donde mostrar el cronómetro
    constructor(display) {
        this.display = display;

        //-- Tiempo
        this.cent = 0, //-- Centésimas
        this.seg = 0,  //-- Segundos
        this.min = 0,  //-- Minutos
        this.timer = 0;  //-- Temporizador asociado
    }

    //-- Método que se ejecuta cada centésima
    tic() {
        //-- Incrementar en una centesima
        this.cent += 1;

        //-- 100 centésimas hacen 1 segundo
        if (this.cent == 100) {
        this.seg += 1;
        this.cent = 0;
        }

        //-- 60 segundos hacen un minuto
        if (this.seg == 60) {
        this.min = 1;
        this.seg = 0;
        }

        //-- Mostrar el valor actual
        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent
    }

    // Función para reproducir un sonido cada vez que se pulsa un botón
    reproducirSonido() {
        let sonido = new Audio("boton.mp3"); // Ruta del archivo de sonido
        sonido.play();
}

    //-- Arrancar el cronómetro
    start() {
        this.reproducirSonido()
        if (!this.timer) {
            //-- Lanzar el temporizador para que llame 
            //-- al método tic cada 10ms (una centésima)
            this.timer = setInterval( () => {
                this.tic();
            }, 10);
        }
    }

    //-- Parar el cronómetro
    stop() {
        this.reproducirSonido()
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    //-- Reset del cronómetro
    reset() {
        this.reproducirSonido()
        this.cent = 0;
        this.seg = 0;
        this.min = 0;

        this.display.innerHTML = "0:0:0";
    }
}