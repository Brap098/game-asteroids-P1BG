// Frames per secound
const FPS=35; 
const Slow = 0.9; // Ship slowes over time with no thrust
const SHAPE_JAG = 0.4; // jag of shape (0=0, 1=tons)
const Emoji_Num = 4; //start number of attackers(Emojies)
const EMOJI_SIZE = 100; // start Emoji size PX
const EMOJI_SPD = 100; //max start spd PX
const EMOJI_VERT= 10;//average number of vertices on each emoji
const Thrust_Speed = 6; // acceleration of the ship in pixels per second per second
const SHIP_SIZE = 30; // ship height px
const SHIP_BOOM_DUR = 0.3;//Time of Boom
const SHIP_DEATH = false;//The collision detection
const Turn_Speed = 400; // turn speed degrees(dps)


/** @type {HTMLCanvasElements} */
var canv = document.getElementById("gameBoarder");
var ctx = canv.getContext("2d");
// ship object
var ship = newShip();

// flying objects
var Emoji = [];
createEmojiAttackers();

//up/down key handler
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//game loop
setInterval(update, 1000 / FPS);

function createEmojiAttackers() {
    Emoji = [];
    var x, y;
    for (var i = 0; i < Emoji_Num; i++){
        do{
             x = Math.floor(Math.random() * canv.width);
             y = Math.floor(Math.random() * canv.height);
        } while (distBetweenPoints(ship.x, ship.y,x ,y) < EMOJI_SIZE * 2 + ship.r);
        Emoji.push(newEmojis(x, y));
        
    };
}
function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function shipBoom() {
    ship.boomTime = Math.ceil(SHIP_BOOM_DUR * FPS);

}

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

        function newEmojis(x, y) {
            var Emoji = {
                x: x,
                y: y,
                xv:Math.random() * EMOJI_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
                yv:Math.random() * EMOJI_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
                r: EMOJI_SIZE / 2,
                a: Math.random() * Math.PI * 2, // in radians
                vert: Math.floor(Math.random() * (EMOJI_VERT + 1) + EMOJI_VERT / 2),
                offs: []
            };
             // populate the offsets array
             for (var i = 0; i < Emoji.vert; i++) {
                Emoji.offs.push(Math.random() * SHAPE_JAG * 2 + 1 - SHAPE_JAG);
            }
            return Emoji;
        };

        function newShip() {
            return {
            x: canv.width / 2,
            y: canv.height / 2,
            r: SHIP_SIZE / 2,
            a: 90 / 180 * Math.PI, // convert to radians
            boomTime: 0,
            rot: 0,            
            thrusting: false,            
            thrust: {                
                x: 0,
                y: 0 
                } 
            }
        }

function update(){
    var boom = ship.boomTime > 0;

    //space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    


    //Thrust/move
    if (ship.thrusting) {
        ship.thrust.x += Thrust_Speed * Math.cos(ship.a) / FPS;
        ship.thrust.y -= Thrust_Speed * Math.sin(ship.a) / FPS;
        
                        // draw the thruster
                        if (!boom) {
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
                        }
    } else{
        //apply friction (slow the ship down when not thrusting)               
        ship.thrust.x -= Slow * ship.thrust.x / FPS;               
        ship.thrust.y -= Slow * ship.thrust.y / FPS;
    }

    //make ship
    if(!boom){
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
    }else {
        //draw boom
    
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
    }
    if (SHIP_DEATH){
        ctx.strokeStyle = "#F500B8";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        ctx.stroke();

    }

    //draw emojies
   
    var x, y, r, a, vert, offs;
    for (var i =  0; i < Emoji.length; i++){

    ctx.strokeStyle = "yellow"
    ctx.lineWidth = SHIP_SIZE / 20;

        //emoji properties
        x = Emoji[i].x;
        y = Emoji[i].y;
        r = Emoji[i].r;
        a = Emoji[i].a;
        vert = Emoji[i].vert;
        offs = Emoji[i].offs;

        //draw path
        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a),
        );

        //draw shape(Change to Emoji)
        for (var j = 1; j < vert; j++){
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)

            )
        }
        ctx.closePath();
        ctx.stroke();

        if (SHIP_DEATH){
            ctx.strokeStyle = "#F500B8";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();
    
        }

       
    
    }

    //object hits ship
    if (!boom){
    for (var i = 0; i < Emoji.length; i++) {
            if (distBetweenPoints(ship.x, ship.y, Emoji[i].x, Emoji[i].y) < ship.r + Emoji[i].r){
                shipBoom();
            }
        }
        //rotate ship
        ship.a += ship.rot
        //move ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
    } else {
        ship.boomTime--;

        if (ship.boomTime == 0) {
            ship = newShip();
        }
    }

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

     //mave emojis
     for (var i = 0; i < Emoji.length; i++){
        Emoji[i].x += Emoji[i].xv;
        Emoji[i].y += Emoji[i].yv;
        //boarder control
        if (Emoji[i].x < 0 - Emoji[i].r) {
            Emoji[i].x = canv.width + Emoji[i].r;
        } else if (Emoji[i].x > canv.width + Emoji[i].r) {
            Emoji[i].x = 0 - Emoji[i].r
        }
        if (Emoji[i].y < 0 - Emoji[i].r) {
            Emoji[i].y = canv.height + Emoji[i].r;
        } else if (Emoji[i].y > canv.height + Emoji[i].r) {
            Emoji[i].y = 0 - Emoji[i].r
        }
    }


 
    //center
    ctx.fillStyle = "#F511AD";
    //ctx.fillRect(ship.x - 1, ship.y - 1, 2.5,2.5);
}

