// objeto canvas
const canvas = document.getElementById('canvas')
// objeto contexto del canvas
const ctx = canvas.getContext('2d')

// clase cuadrado
class Square {

    // metodo predeterminado para inicializar una clase
    // se le pasa las coordenadas como parametro
    constructor(x, y) {
        // atributos de clase
        this.x = x
        this.y = y     
    }

    // metodo para dibujar el cuadrado de 10px de lado en el lienzo
    draw() {        
        ctx.fillRect(this.x,this.y,10,10)
    }

    move(direction) {
        if (direction == 'left') return (this.x -= 10) // izquierda - left
        if (direction == 'up') return (this.y -= 10) // arriba - up
        if (direction == 'down') return (this.y += 10) // abajo - down
        if (direction == 'right') return (this.x += 10) // derecha - right
    }

    relocate(x, y) {
        this.x = x
        this.y = y
    }
}


class Snake {    
    constructor() {
        // atributo cabeza de serpiente de tipo cuadrado
        this.head = new Square(50,50)
        // direccon inicial
        this.direction = 'right'
        // arreglo que contiene la cola de la serpiente
        this.tail = new Array()
        this.tail.push(new Square(40, 50))
        this.tail.push(new Square(30, 50))
        this.tail.push(new Square(20, 50))
    }

    draw() {
        this.head.draw()
        this.tail.forEach(element => {
            element.draw()
        });        
    }

    redirect(code) {
        if (code == 37) return (this.direction = 'left') // izquierda - left
        if (code == 38) return (this.direction = 'up') // arriba - up
        if (code == 39) return (this.direction = 'right') // derecha - right
        if (code == 40) return (this.direction = 'down') // abajo - down
    }

    move() {
        let previus = new Square(this.head.x,this.head.y) // primer elemento previo es la cabeza de serpiente
        // recorre la cola de serpiente actualizando la posicion de cada cuadrado
        this.tail.forEach(element => {
            const aux = new Square(element.x,element.y)
            element.relocate(previus.x,previus.y) 
            previus.relocate(aux.x,aux.y)
        });
        this.head.move(this.direction)        
    }

    addTail() {
        this.tail.push(new Square([this.tail.length - 1].x,[this.tail.length - 1].y))
    }
}





function play() {
    // oculta la ventana flotante
    document.getElementById('floatingWindow').style.display='none'

    // objeto snake de tipo snake - se ejecuta el metodo constructor
    let snake = new Snake()

    // objeto comida de tipo cuadrado - posicion aleatoria
    let eat = new Square((Math.floor(Math.random() * (canvas.width/10)))*10,(Math.floor(Math.random() * (canvas.height/10)))*10)

    // window es el objeto global de la ventana 
    // el metodo addEventListener recibe como primer parametro el evento a escuchar -presion de tecla- y como segundo parametro la funcion a ejecutar
    window.addEventListener('keydown', function(event){
        if (!(
        // casos en que la serpiente tenga direccion contrariar
        ((event.keyCode == 37) && (snake.direction == 'right')) ||
        ((event.keyCode == 38) && (snake.direction == 'down')) ||
        ((event.keyCode == 39) && (snake.direction == 'left')) ||
        ((event.keyCode == 40) && (snake.direction == 'up'))
        )) {
            snake.redirect(event.keyCode)
            // ejecuta segun el codigo de la tecla presionada
        }
    })

    // set interval ejecuta una funcion en un intervalo de tiempo
    // como primer parametro la funcion a ejecutar y como segundo parametro el intervalo de execution -recibe en milisegundos por eso la division- en este caso son 30 fotogramas por segundo
    let interval = setInterval(function() {
        ctx.clearRect(0,0,canvas.width,canvas.height) // limpia el canvas completo
        ctx.fillStyle = 'green'
        snake.draw()
        ctx.fillStyle = 'red'
        eat.draw()    
        // condicional para comida
        if ((eat.x == snake.head.x) && ((eat.y == snake.head.y))) {
            eat.relocate((Math.floor(Math.random() * (canvas.width/10)))*10,(Math.floor(Math.random() * (canvas.height/10)))*10)
            snake.addTail()
        }
        // condicional para salida del cuadro
        if 
        (((canvas.width <= snake.head.x) || ((canvas.height <= snake.head.y))) ||
        ((0 > snake.head.x) || ((0 > snake.head.y))))
        {
            clearInterval(interval)
            // muestra la ventana flotante
            document.getElementById('floatingWindow').style.display='block'
        }
        // condicional choque con cola
        snake.tail.forEach(element => {
            if ((element.x == snake.head.x) && (element.y == snake.head.y)){
                clearInterval(interval)
                document.getElementById('floatingWindow').style.display='block'
            }
        });
        snake.move()
    },(1000 / 5))
}