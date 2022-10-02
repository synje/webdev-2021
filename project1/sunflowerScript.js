//////////////////////////////////////////////
//              CANVAS DRAWING              //
//////////////////////////////////////////////

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

//drawing the midth
function midth(x, y, radius, fillColor, strokeColor){
    c.fillStyle=fillColor;
    c.strokeStyle=strokeColor;

    c.beginPath();
    c.arc(x, y, radius, 0, 2*Math.PI);
    c.fill();
    c.stroke();
}


//drawing a petal
function petal(x, y, length, rotation, fillColor, strokeColor){
    c.fillStyle=fillColor;
    c.strokeStyle=strokeColor;
    
    c.beginPath();
    c.ellipse(x, y, length, 20, rotation*Math.PI/180, 0, 2*Math.PI);
    c.fill();
    c.stroke();
}


//drawing the whole picture
function drawFlower(petalC, midthC, length){
    //saving the input-colors in variables
    petalLength = length;
    petalCanvas = petalC;
    midthCanvas = midthC;

    //petal(x-coordinates, y-coordinates, length-diameter, radiation, fillColor, strokeColor)
    //upper left petals
    petal((canvasLength/2)-90, (canvasLength/2)-0, length, 0, petalC, strokeC);
    petal((canvasLength/2)-85, (canvasLength/2)-25, length, 15, petalC, strokeC);
    petal((canvasLength/2)-75, (canvasLength/2)-45, length, 30, petalC, strokeC);
    petal((canvasLength/2)-65, (canvasLength/2)-65, length, 45, petalC, strokeC);
    petal((canvasLength/2)-45, (canvasLength/2)-75, length, 60, petalC, strokeC);
    petal((canvasLength/2)-25, (canvasLength/2)-85, length, 75, petalC, strokeC);
    
    //upper right petals
    petal((canvasLength/2)-0, (canvasLength/2)-90, length, 90, petalC, strokeC);
    petal((canvasLength/2)+25, (canvasLength/2)-85, length, -75, petalC, strokeC);
    petal((canvasLength/2)+45, (canvasLength/2)-75, length, -60, petalC, strokeC);
    petal((canvasLength/2)+65, (canvasLength/2)-65, length, -45, petalC, strokeC);
    petal((canvasLength/2)+75, (canvasLength/2)-45, length, -30, petalC, strokeC);
    petal((canvasLength/2)+85, (canvasLength/2)-25, length, -15, petalC, strokeC);
    
    //lower right petals
    petal((canvasLength/2)+90, (canvasLength/2)+0, length, 0, petalC, strokeC);
    petal((canvasLength/2)+85, (canvasLength/2)+25, length, 15, petalC, strokeC);
    petal((canvasLength/2)+75, (canvasLength/2)+45, length, 30, petalC, strokeC);
    petal((canvasLength/2)+65, (canvasLength/2)+65, length, 45, petalC, strokeC);
    petal((canvasLength/2)+45, (canvasLength/2)+75, length, 60, petalC, strokeC);
    petal((canvasLength/2)+25, (canvasLength/2)+85, length, 75, petalC, strokeC);
    
    //lower left petals
    petal((canvasLength/2)+0, (canvasLength/2)+90, length, 90, petalC, strokeC);
    petal((canvasLength/2)-25, (canvasLength/2)+85, length, 105, petalC, strokeC);
    petal((canvasLength/2)-45, (canvasLength/2)+75, length, -240, petalC, strokeC);
    petal((canvasLength/2)-65, (canvasLength/2)+65, length, -225, petalC, strokeC);
    petal((canvasLength/2)-75, (canvasLength/2)+45, length, -210, petalC, strokeC);
    petal((canvasLength/2)-85, (canvasLength/2)+25, length, -195, petalC, strokeC);
    
    //midth
    midth(canvasLength/2, canvasLength/2, 70, midthC, strokeC);
}




//////////////////////////////////////////////
//      INITIALIZING/GLOBAL VARIABLES       //
//////////////////////////////////////////////

let canvasLength = canvas.width;    // size of current canvas, used to make sure the drawing is centered

//variables to save the color-values of the current drawing, canvas
let petalCanvas = "white";
let midthCanvas = "white";
let strokeC = "#eea78b"; // the color of the background, strokeColor can be changed manually from here


window.onload = function(){
    drawFlower(petalCanvas, midthCanvas, 30);    // draws the initial canvas-drawing on window-load
    
    //  initiates canvas animation on load
    timer = setInterval(automate, 200);
    
    //  initiates svg animation on load
    klokke = setInterval(animate, 200);
}

let timer;
let klokke;




//////////////////////////////////////////////
//              CANVAS ANIMATION            //
//////////////////////////////////////////////

//  calculates length of petals
let canvasBlad = 30;
function getLength(){
    if(canvasBlad < 80){
        canvasBlad += 3;
    }
    else if(canvasBlad > 80){
        canvasBlad -= 3;
    }
    return canvasBlad;
}

//  animation, canvas
function automate() {
    c.clearRect(0, 0, canvasLength, canvasLength);
    let canvasBlad = getLength();
    drawFlower(petalCanvas, midthCanvas, canvasBlad);
}

//  stop canvas animation
$("#stopCanvas").click(function(){
    clearInterval(timer);
});

//  start canvas animation
$("#startCanvas").click(function(){
    clearInterval(timer);
    timer = setInterval(automate, 200);
});

//  restart canvas animation
$("#restartCanvas").click(function(){
    clearInterval(timer);
    canvasBlad = 30;
    c.clearRect(0, 0, canvasLength, canvasLength);
    drawFlower(petalCanvas, midthCanvas, 30);
    timer = setInterval(automate, 200);
});




//////////////////////////////////////////////
//               SVG ANIMATION              //
//////////////////////////////////////////////

//  calculates length of petals
let svgBlad = 30;
function getSVGLength(){
    if(svgBlad < 80){
        svgBlad += 3;
    }
    else if(svgBlad > 80){
        svgBlad -= 3;
    }
    return svgBlad;
}

//  animation, svg
function animate(){
    let svgBlad = getSVGLength();
    $(".petal").attr("rx", svgBlad); 
}

//  stop SVG animation
$("#stopSVG").click(function(){
    clearInterval(klokke);
})

//  start SVG animation
$("#startSVG").click(function(){
    clearInterval(klokke);
    klokke = setInterval(animate, 200);
});

//  restart SVG animation
$("#restartSVG").click(function(){
    clearInterval(klokke);
    svgBlad = 30;
    $(".petal").attr("rx", svgBlad);
    klokke = setInterval(animate, 200);
});




////////////////////////////////////////
//            COLOR CHANGE            //
////////////////////////////////////////

//  CANVAS, color change
//  Kilder__  Video: https://bit.ly/3yNqut9  Kodesnutt: https://bit.ly/3DNIYxh

const getCoords = (event) =>{
    const container = canvas.getBoundingClientRect();
    const x = (event.clientX - container.left) - container.width/2;     // calculates the coordinates of the mouseclick, x
    const y = (event.clientY - container.top) - container.height/2;     // calculates the coordinates of the mouseclick, y
    
    if(x > -70 && x < 70 && y > -70 && y < 70){     // imaginary rect around the middle part of the flower, coordinates
        colorCanvas();
    }
}

canvas.addEventListener("click", getCoords);

//  slight delay because it takes the new color into account only on the next redraw/next frame
function colorCanvas(){
    if(petalCanvas == "black"){
        petalCanvas = "white";
        midthCanvas = "white";
    }
    else{
        petalCanvas = "black";
        midthCanvas = "black";
    }
    c.clearRect(0, 0, canvasLength, canvasLength);
    drawFlower(petalCanvas, midthCanvas, canvasBlad);
}


//  SVG, color change
$("#midth").click(function(){
    $(".petal").toggleClass("petalC");
    $("#midth").toggleClass("midthC");
})




////////////////////////////////////////
//        TOGGLE DOCUMENTATION        //
////////////////////////////////////////

//  listens for clicks on header
$("#dokH1").click(function(){
    $(".dokP").toggle();
    toggleH1();
});

//  changes the header text
function toggleH1() {
    var h1 = document.getElementById("dokH1");
    if (h1.innerHTML === "VIS DOKUMENTASJON") {
      h1.innerHTML = "SKJUL DOKUMENTASJON";
    }
    else {
      h1.innerHTML = "VIS DOKUMENTASJON";
    }
}