
const FPS=35; // Frames per secound
const Slow = 0.9; // Ship slowes over time with no thrust
const LASER_DIST = 0.5; // max range of shot(fraction of screen)
const LASER_MAX = 10; // max beams shot
const LASER_SPD = 700; // Shot speed
const SHAPE_JAG = 0.4; // jag of shape (0=0, 1=tons)
const Emoji_Num = 1; //start number of attackers(Emojies)
const EMOJI_SIZE = 100; // start Emoji size PX
const EMOJI_SPD = 100; //max start spd PX
const EMOJI_VERT= 10;//average number of vertices on each emoji
const Thrust_Speed = 6; // acceleration of the ship in pixels per second per second
const SHIP_SIZE = 30; // ship height px
const SHIP_BLINK_DUR = 0.1;//Time of Blinks during restart
const SHIP_BOOM_DUR = 0.3;//Time of Boom
const SHIP_INV_TIME = 3;//Time after restart before death
const SHIP_DEATH = true;//The collision detection circle
const CENTER_DOT = false;//Center dots
const Turn_Speed = 400; // turn speed degrees(dps)
const TEXT_FADE_TIME = 2.5 // text fade deration
const TEXT_SIZE = 40; // text size in pixles



/** @type {HTMLCanvasElements} */
var canv = document.getElementById("gameBoarder");
var ctx = canv.getContext("2d");

// game perameter
var level, emoji, ship, text, text2;
newGame();

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
    for (var i = 0; i < Emoji_Num + level * 2; i++){// number of objects
        do{
             x = Math.floor(Math.random() * canv.width);
             y = Math.floor(Math.random() * canv.height);
        } while (distBetweenPoints(ship.x, ship.y,x ,y) < EMOJI_SIZE * 2 + ship.r);
        Emoji.push(newEmojis(x, y, Math.ceil(EMOJI_SIZE / 2)));
        
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
                case 32: // SB shoot laser
                    shootLaser();
                    break;
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
                case 32: // SB shoot laser again
                    ship.canShoot = true;
                    break;
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

        function newEmojis(x, y, r) {
            var levelUp = 1 + 0.1 * level;
            var Emoji = {
                x: x,
                y: y,
                xv:Math.random() * EMOJI_SPD * levelUp / FPS * (Math.random() < 0.5 ? 1 : -1),
                yv:Math.random() * EMOJI_SPD * levelUp / FPS * (Math.random() < 0.5 ? 1 : -1),
                r: r,
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

        function newGame() {
            level = 0;
            ship = newShip();
            newLevel();
        }

        function newLevel() {
            createEmojiAttackers();
        }

        //ship creation after boom/death.
        function newShip() {
            
            return {
                x: canv.width / 2,
                y: canv.height / 2,
                r: SHIP_SIZE / 2,
                a: 90 / 180 * Math.PI, // convert to radians
                blinkNum: Math.ceil(SHIP_INV_TIME / SHIP_BLINK_DUR),
                blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
                canShoot: true,
                lasers: [],
                boomTime: 0,
                rot: 0,            
                thrusting: false,            
                thrust: {                
                    x: 0,
                    y: 0 
                    } 
            }
        }

        function shootLaser() {
            // create laser object
            if(ship.canShoot && ship.lasers.length < LASER_MAX) {
                ship.lasers.push({//shoot from nose
                    x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
                    y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
                    xv: LASER_SPD * Math.cos(ship.a) / FPS,
                    yv: -LASER_SPD * Math.sin(ship.a) / FPS,
                    dist: 0
                })
            }
            // stop shooting
            ship.canShoot = false;
        }

function update(){

   

    var blinkOn = ship.blinkNum % 2 == 0;

    var boom = ship.boomTime > 0;

    //space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    


    //Thrust/move
    if (ship.thrusting) {
        ship.thrust.x += Thrust_Speed * Math.cos(ship.a) / FPS;
        ship.thrust.y -= Thrust_Speed * Math.sin(ship.a) / FPS;
        
                        // draw the thruster
                        if (!boom && blinkOn) {
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
        if (blinkOn){
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

        //ship center dot
        if (CENTER_DOT) {
        ctx.fillStyle = "purple";
        ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
    }
    }
      // handle blinking
      if (ship.blinkNum > 0) {

        // reduce the blink time
        ship.blinkTime--;

        // reduce the blink num
        if (ship.blinkTime == 0) {
            ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
            ship.blinkNum--;
        }
    }

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
    //ship collision boundery
    if (SHIP_DEATH){
        ctx.strokeStyle = "#F500B8";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        ctx.stroke();

    }

    //draw emojies
   
    
    ctx.strokeStyle = "yellow"
    ctx.lineWidth = SHIP_SIZE / 20;
    var x, y, r, a, vert, offs;
    for (var i =  0; i < Emoji.length; i++){

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
//image try
         

        //draw shape(Change to Emoji)
  
        // lv 1 object
        var img = document.getElementById("blazeit");
        // lv 2 object
        var img1 = document.getElementById("evil");

        ctx.closePath();
        ctx.stroke();
        //astroid collision boundery
        if (SHIP_DEATH){
            ctx.strokeStyle = "#F500B8";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.drawImage(img, x - r  , y - r, EMOJI_SIZE, EMOJI_SIZE);
    
            //E center dot
            if (CENTER_DOT){
            ctx.fillStyle = "green";
            ctx.fillRect(x - 1, y - 1, 15, 15);
            }
            
        }

    }

    // make Laser
    for (var i = 0; i < ship.lasers.length; i++ ) {
        ctx.fillStyle = "#0ECBFF";
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
        ctx.fill();
    }

    // objects shot
    var ex, ey, er, lx, ly;
    for (var i = Emoji.length - 1; i >= 0; i--) {

        // grab Emoji properties
        ex = Emoji[i].x;
        ey = Emoji[i].y;
        er = Emoji[i].r;

        // loop lasers
        for (var j = ship.lasers.length - 1; j >= 0; j--) {

            //laser properties
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;
            // detect hits
            if (/*ship.lasers[j].explodeTime == 0 &&*/ distBetweenPoints(ex, ey, lx, ly) < er) {

                // hit
                if (distBetweenPoints(ex, ey, lx, ly) < er) {
                    // laser removel
                    ship.lasers.splice(j, 1);

                    //emoji removel
                    Emoji.splice(i, 1);
                    //levelUp
                    if (Emoji.length == 0) {
                        level++;
                        newLevel();
                        ctx.drawImage(img1, x - r  , y - r, EMOJI_SIZE, EMOJI_SIZE);
                    }
                }
                // destroy the asteroid and activate the laser explosion
               destroyEmoji(i);
                /* ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);*/
                break;
            }
        }
    }

    //object hits ship
    if (!boom){
        if (ship.blinkNum == 0) {
                for (var i = 0; i < Emoji.length; i++) {
                    if (distBetweenPoints(ship.x, ship.y, Emoji[i].x, Emoji[i].y) < ship.r + Emoji[i].r){
                       shipBoom();
                       destroyEmoji(i); 
                   }
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
    // move laser
    for (var i = ship.lasers.length - 1; i >= 0; i--) {
        //check distance traveled
        if (ship.lasers[i].dist > LASER_DIST * canv.width) {
            ship.lasers.splice(i, 1);
            continue;
        }

        // move the laser
        ship.lasers[i].x += ship.lasers[i].xv;
        ship.lasers[i].y += ship.lasers[i].yv;

        // distance moved
        ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));

        // handle screen edge
        if (ship.lasers[i].x < 0) {
            ship.lasers[i].x = canv.width;
        } else if (ship.lasers[i].x > canv.width){
            ship.lasers[i].x = 0;
        }
        if (ship.lasers[i].y <0) {
            ship.lasers[i].y = canv.height;
        } else if (ship.lasers[i].y > canv.height){
            ship.lasers[i].y = 0;
        }

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
