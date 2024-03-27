//Colors
let asphalt = (110);
let paint = (210);
let concrete = (165);
let grout = (60);
let tan = "#c2b18c";
let brownstone = "#5f483c";
//let blue = color(114, 147, 207); //I wanted to use this code in order to change the hex color, but it seems that I can't for some reason do this because it ends up klling my code

//Global Variable
let tod = 0; //this will help functions and objects alter their looks depending on the time using abbr. tod for "Time of Day"

//Weather-based constructions
let norm = 0;
let cloudy = 1;
let weather = norm;


//Clouds
let cloudsBackground = []; //Empty array to fill up for clouds in Background
let cloudsForeground = []; //Empty array to fill up for clouds in Foreground


let sunAngle = 0;

function setup() {
    createCanvas(1000,600);
    
    frameRate(60);

    buildingA = new Building(300, 300, 130, 148, tan); //buildings must have their bottoms at base level which is at 448 w/ origin at 0,0 top left
    buildingB = new Building(550, 278,120,170, brownstone);
    buildingC = new Building(800,320,120,128,asphalt);
    sky = new Sky(114, 147, 227, 0);
    tree = new Tree(width / 2, height, 20, 100); // Create a tree object

    //Creates clouds of random properties
    for (let i = 0; i <3; i ++){
        let x = random(width); //where the cloud will spawn in the x
        let y = random (0, 200); //where the cloud will spawn y axis, ensured to be in top half
        let speed = random(.1,.5); //how fast the clouds are moving across the screen
        let sizeX = random(50,75);
        let sizeY = random (60,75);
        let opacity = random (100, 200);
        cloudsForeground.push(new Cloud(x, y, speed, sizeX, sizeY, opacity))
        
        for (let i = 0; i < 5; i ++){
            let x = random(width); //where the cloud will spawn in the x
            let y = random (0, 200); //where the cloud will spawn y axis, ensured to be in top half
            let speed = random(.1,.5); //how fast the clouds are moving across the screen
            let sizeX = random(50,75);
            let sizeY = random (60,75);
            let opacity = random (100, 200);
            cloudsBackground.push(new Cloud(x, y, speed, sizeX, sizeY, opacity));
        }
        
        
    }


 }

function draw() {
    print(cloudsBackground.length);
    sceneSwitcher(); 
    if (tod == 0){
        sky.display();
    } else if (tod == 1){
        sky.night();
        sky.display();
    } else if (tod == 2){
        sky.day();
        sky.display();
    }

    sunAngle += .01
    orbital();

   //Background layer of clouds
    for (let cloud of cloudsBackground){ //Defines a variable for the array-based clouds in order to let them each update/display and iterates through them all
        cloud.update();
        cloud.display();
    }
    sceneSetup(); //Road
    buildingA.display();
    buildingB.display();
    buildingC.display();
    //tree.display();

    for (let cloud of cloudsForeground){ //Defines a variable for the array-based clouds in order to let them each update/display and iterates through them all
        cloud.update();
        cloud.display();

    if (weather == norm){
        for (let cloud of cloudsForeground){ //Defines a variable for the array-based clouds in order to let them each update/display and iterates through them all
            cloud.update();
        }
        if (cloudsBackground.length >15){
            cloudsBackground.pop();
        }
    } else  if (weather == cloudy){
        if (cloudsBackground.length < 500){
                let x = random(width); //where the cloud will spawn in the x
                let y = random (0, 200); //where the cloud will spawn y axis, ensured to be in top half
                let speed = random(.1,.3); //how fast the clouds are moving across the screen
                let sizeX = random(30,55);
                let sizeY = random (20,35);
                let opacity = random (20, 90);
                cloudsBackground.push(new Cloud(x, y, speed, sizeX, sizeY, opacity));
                console.log(cloudsBackground.length)      
        }
    }
}
    
    //This has to be kept separate from the main change in the sky because it needs to be able to cover the foreground
    if (tod == 0){
        sky.lighting();
    } else if (tod == 1){
        sky.night();
        sky.lighting();
    } else if (tod == 2){
        sky.day();
        sky.lighting();
    }

}

function sceneSwitcher(){ //Made purely for managing what the weather status is
    //let ms = millis(); //this is what will dictate changes in the time, but this actually cannot be accessed BEFORE the setup because it requires the program to be running already (I think), originally wanted to use this for the time changes, but I feel more comforatble working with frame Count
     if (frameCount % 300 == 0){  //it isn't possible to make this land on an exact zero because it doesn't refresh at the exact rate
        if (tod < 2){
            tod += 1;
        } else {
            tod = 0;
        }
    }

    if (frameCount % 500 == 0){
        weather = cloudy;
    } else if (frameCount % 900 == 0){
        weather = norm;
    }
}

function sceneSetup(){ //builds the background
    
    //Asphalt road
    noStroke();
    fill(60);
    quad(0,465,1000,465,1000,600,0,600);
    fill(asphalt);
    quad(0,475,1000,475,1000,600,0,600);

    //Iterative items for road
    for(let xPos = 10; xPos <= 1100; xPos += 50){
        //Dotted lines in the middle of the road
        rectMode(CENTER);
        fill(paint);
        rect(xPos,530,30,8);

        //Sidewalk Area
        push();
        fill(concrete);
        stroke(grout);
        strokeWeight(4);
        rect(xPos-20,460,150,20);
        pop();
    }
}

class Sky{
    constructor(skyR, skyG, skyB, skyOpacity){
        this.skyR = skyR;
        this.skyG = skyG;
        this.skyB = skyB;
        this.skyO = skyOpacity
    }

    display(){
        //Base Sky
        fill(this.skyR,this.skyG,this.skyB); //There is nothing going on with opacity with the main drawing
        push();
        translate(width/2,height/2);
        rect(0,0,500,300);
        pop();
    }

    lighting(){
        fill( this.skyR, this.skyG, this.skyB, this.skyO) //This will only be primarily affected by the opacity adjustment
        push();
        translate(width/2,height/2);
        rect(0,0,500,300);
        pop();
    }

    night(){       
        if(this.skyR > 40){
            this.skyR -= 1;
        } else {
            stop();
        }

        if(this.skyG > 40){
            this.skyG -= 1;
        } else{
            stop();
        }

        if (this.skyR < 60, this.skyG <60){ //I think the comma means "and." To be honest, I'm not quite sure, but it seems to be reflecting that in my code
            if (this.skyB > 60){
                this.skyB -= 3;
            } else{
                stop();
            }
        }

        if (this.skyO < 100){
            this.skyO += 1;
        } else{
            stop();
        }
    }

    day(){
        if (this.skyR < 114){
            this.skyR += 1;
        } else {
            stop();
        }
        if (this.skyG < 147){
            this.skyG += 1;
        } else{
            stop();
        }
        if (this.skyB < 227){
            this.skyB += 2.5;
        } else{
            stop();
        }     
        if (this.skyO > 0){
            this.skyO -= 1;
        } else{
            stop();
        }
    }
}

/*class Lighting{
    constructor(lightR, lightG, lightB, lightOpacity){
        this.r = lightR;
        this.g = lightG;
        this.b = lightB;
        this.o = lightOpacity;
    }

    //Works on the same theory as the sky positioning, but operates as an overlay through interactions with opacity, maybe I'll combine this into the Sky "class"
    display(){
        
    }
}
*/

class Cloud{
    constructor(x, y, speed, sizeX, sizeY, opacity){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.opacity = opacity;
    }

    update(){
        //Moves the cloud horizontally across the screen
        this.x += this.speed;

        //Makes the cloud reset it's position if it moves offscreen
        if (this.x > width + this.sizeX){
            this.x = -this.sizeX;
        }
    }

    display(){
        fill(255,255,255, this.opacity);
        noStroke();

        for (let i = 0; i < 5; i ++){ //Creates dimensionality for the cloud through kind of smearing the ellipses
            /*let yStore = this.sizeY; //I wanted to be able to make clouds with more dimensions but this isn't working out right now
            this.sizeY = yStore;
            if (this.sizeY % 2 != 0){
                this.sizeY += 10;
            } */
            ellipse(this.x + i * 10, this.y, this.sizeX, this.sizeY);
        }
    }

     moreClouds(){
        let x = 0;
        fill(255,255,255,x);
        for(let i = 0; i<10; i ++){
            ellipse(this.x + i * 10, this.y, this.sizeX, this.sizeY);
        }

        if (x < this.opacity){
            x += 1;
        } else{
            stop();
        }
   
    } 
}

class Building{
    constructor(xPos, yPos, height, width, color1){
        this.height = height;
        this.width = width;
        this.color1 = color1;
        //this.color2 = color2;
        this.xPos = xPos;
        this.yPos = yPos;
    }
    
    display(){
        //Actual Building Base
        rectMode(RADIUS);
        fill(this.color1);
        rect(this.xPos, this.yPos, this.height, this.width);

        //Making windows trying to use math-based formulas instead of hard-coding, this is frying my brain, I think I might just hard code
        push();
        fill(150);

        //Number of rows of windows
        let numWindowRows = Math.floor(this.height/20); //by dividing the height by 20 I get the number of rows that are included within the building

        //Number of windows in each row
        let numWindowsPerRow = Math.floor(this.width/20);

        //Vertical spacing between window rows
        let windowRowSpacing = this.height/(numWindowRows + 1)+15;

        //Horizontal spacing between windows in each row
        let windowColumnSpacing = this.width / (numWindowsPerRow + 1) +5;

        for (let i = 1; i <= numWindowRows; i++) {
            let windowY = this.yPos - this.height / 1.1 + i * windowRowSpacing;
            for (let j = 1; j <= numWindowsPerRow; j++) {
                let windowX = this.xPos - this.width / 2 + j * windowColumnSpacing;
                rect(windowX, windowY, 5, 10);
            }
        }
        pop();
    }

}

class Tree{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.leaves = []; //I think this works... an array to hold the leaves that I will be generating later on
        this.makeLeaves(); //Calling the method here makes sure that the method doesn't need to be called again within the main draw() or setup() section
    }

    //This is using the logic behind how I made the clouds (kind of)
    makeLeaves(){
        for(let i = 0; i < 50; i ++){ //I think I would make the leaves "die" later on based on the time that the program has been running
            let x = random(this.x -50, this.x +50); //Random distance for the leaves from the trunk position "this.x"
            let y = random(this.y - this.height, this.y - this.trunkHeight - 50); //this ensures that the leaves will be spawning "higher above the trunk"
            let size = random(10,20); //Random size for the leaves 
            let leaf = { x: x, y: y, size: size }; //Creation of another object
            this.leaves.push(leaf); //This adds the leaf object created to the array
        }
    }
    display() {
        // Draw the trunk
        fill(139, 69, 19); // Brown color for trunk
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height);
    
        // Draw the leaves
        fill(0, 128, 0); // Green color for leaves
        for (let leaf of this.leaves) {
          ellipse(leaf.x, leaf.y, leaf.size, leaf.size); // Draw each leaf
        }
    }
}

function orbital(){
    push();
    fill(242, 235, 12);
    translate(width/2,448);
    rotate(sunAngle);
    ellipse(-400,0,100);
    pop();
}