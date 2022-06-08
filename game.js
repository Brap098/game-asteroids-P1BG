// Frames per secound
const FPS=35; 
const Slow = 0.9; // Ship slowes over time with no thrust
const Thrust_Speed = 6; // acceleration of the ship in pixels per second per second
const SHIP_SIZE = 30; // ship height px
const Turn_Speed = 400; // turn speed degrees(dps)


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

    


    //Thrust/move
    if (ship.thrusting) {
        ship.thrust.x += Thrust_Speed * Math.cos(ship.a) / FPS;
        ship.thrust.y -= Thrust_Speed * Math.sin(ship.a) / FPS;
        
                        // draw the thruster
                        ctx.fillStyle = "#0ECBFF";
                        ctx.strokeStyle = "#C422D6";
                        ctx.lineWidth = SHIP_SIZE / 10;
                        ctx.beginPath();
                        ctx.moveTo( // rear left
                            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
                            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
                        );
                        ctx.lineTo( // rear centre (behind the ship)
                            ship.x - ship.r * 5 / 3 * Math.cos(ship.a),
                            ship.y + ship.r * 5 / 3 * Math.sin(ship.a)
                        );
                        ctx.lineTo( // rear right
                            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
                            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
                        );
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
    } else{
        //apply friction (slow the ship down when not thrusting)               
        ship.thrust.x -= Slow * ship.thrust.x / FPS;               
        ship.thrust.y -= Slow * ship.thrust.y / FPS;
    }

    //make ship
 ctx.strokeStyle = "#05F70D";
       ctx.lineWidth = SHIP_SIZE / 15;
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
    //loop space(ship will apear on opposite side of side flown through)
    if (ship.x < 0 - ship.r) {
        ship.x = canv.width + ship.r;
    }else if(ship.x > canv.width + ship.r ){
        ship.x =  0 - ship.r;
    }
    if (ship.y< 0 - ship.r) {
        ship.y = canv.height + ship.r;
    }else if(ship.y> canv.height + ship.r ){
        ship.y =  0 - ship.r;
    }

    //move ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;
 
    //center
    ctx.fillStyle = "#F511AD";
    //ctx.fillRect(ship.x - 1, ship.y - 1, 2.5,2.5);
}

