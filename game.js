// Frames per secound
const FPS=35; 
const SHIP_SIZE = 30; // ship height px
const Turn_Speed = 360; // turn speed degrees(dps)


/** @type {HTMLCanvasElements} */
var canv = document.getElementById("gameBoarder");
var ctx = canv.getContext("2d");

var ship = {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI, // convert to radians            
    rot: 0,            
    thrusting: false,            
    thrust: {                
        x: 0,
        y: 0 
    }
}
//up/down key
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//game loop
setInterval(update, 1000 / FPS);

function keyDown(/** @type {KeyboardEvent} */ ev) {
            switch(ev.keyCode) {
                case 37: // LA rotate Left
                    ship.rot = Turn_Speed / 180 * Math.PI / FPS;
                    break;
                case 38: // UA Thrustter
                    ship.thrusting = true;
                    break;
                case 39: // RA rotate Right
                    ship.rot = -Turn_Speed / 180 * Math.PI / FPS;
                    break;
            }
        }

        function keyUp(/** @type {KeyboardEvent} */ ev) {
            switch(ev.keyCode) {
                case 37: // LA stop rotate Left
                    ship.rot = 0;
                    break;
                case 38: // UA Thrustter
                    ship.thrusting = false;
                    break;
                case 39: // RA stop rotate Right
                    ship.rot = 0;
                    break;
            }
        }


function update(){
    //space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    //make ship
 ctx.strokeStyle = "limeGreen";
       ctx.lineWidth = SHIP_SIZE / 20;
       ctx.beginPath();
       ctx.moveTo( // nose of the ship
           ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
           ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
           );
            ctx.lineTo( // rear left
           ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
           ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
           );
           ctx.lineTo( // rear right
          ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
           ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
       );
    ctx.closePath();
     ctx.stroke();

    //rotate ship
    ship.a += ship.rot


    //move ship

    //center
    ctx.fillStyle = "blue";
    ctx.fillRect(ship.x - 1, ship.y - 1, 2,2);
}

