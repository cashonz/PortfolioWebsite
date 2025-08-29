class Point {
    x = null;
    y = null;
    dragging = false;

    constructor(x, y) {
        this.x =x;
        this.y = y;
        this.dragging = false;
    }

    getPosition() {
        return [this.x, this.y];
    }

    changePosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

function getMousePosition(canvas, event){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    return [x, y]
}

function canvasInteract(canvas, event, points, iterations){
    let cords = getMousePosition(canvas, event);

    let addpoint = true;
    
    //radius for circles drawn are 7
    for (let i = 0; i < points.length; i++){
        currPoint = points[i];
        if (pointInCircle(cords, currPoint.getPosition(), 7)){
            if (event.type == "mousedown"){
                currPoint.dragging = true;
                addpoint = false;
            }
            else if (event.type == "mouseup" || event.type == "mouseout"){
                currPoint.dragging = false;
            }
        }
        if (event.type == "mousemove" && currPoint.dragging == true){
            currPoint.changePosition(cords[0] - 3.5, cords[1] - 3.5);
        }
    }
    if (addpoint && event.type == "mousedown"){
        points.push(new Point(cords[0] - 3.5, cords[1] - 3.5));
    }
    

    drawElements(points, canvasElem, iterations);
    
    return points
}

function pointInCircle(cordsClick, cordsCircle, r){
    var distancesquared = (((cordsClick[0] - 3.5)- (cordsCircle[0]) - 3.5) * ((cordsClick[0]- 3.5) - (cordsCircle[0]- 3.5))) + (((cordsClick[1]- 3.5) - (cordsCircle[1]- 3.5)) * ((cordsClick[1]- 3.5) - (cordsCircle[1])- 3.5));
    return distancesquared <= r * r;
}

function drawElements(points, canvas, iterations){
    if(points.length ==  0){
        clearCanvas(canvas, points);
        return;
    }

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#23B5D3";
    ctx.fillStyle = "#23B5D3";
    ctx.lineWidth = 5;

    //calculate chaikin line based on input points on the canvas
    let curve = chaikin(points, iterations);

    if (!isPolygon){
        if (!hideOriginal){
            //draws points as circles
            for (let i = 0; i < points.length; i++){
                const cords = points[i].getPosition()  
                ctx.beginPath();
                ctx.arc(cords[0], cords[1], 7, 0, 2 * Math.PI);
                ctx.fill();
            }

            ctx.beginPath();

            //draws lines between points
            for (let i = 0; i < points.length - 1; i++){
                const cords = points[i].getPosition(); 
                const cordsNext = points[i+1].getPosition();
                ctx.moveTo(cords[0], cords[1]);
                ctx.lineTo(cordsNext[0], cordsNext[1]);
            }
        }
        
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#F3DFA2";
        
        //draw chaikin line
        for (let i = 0; i < curve.length - 1; i++){
            const cords = curve[i].getPosition();
            const cordsNext = curve[i+1].getPosition();
            ctx.moveTo(cords[0], cords[1]);
            ctx.lineTo(cordsNext[0], cordsNext[1]);
        }
    
        ctx.stroke();
    }
    else{
        if(!hideOriginal){
            //draws points as circles
            for (let i = 0; i < points.length; i++){
                const cords = points[i].getPosition() 
                ctx.beginPath();
                ctx.arc(cords[0], cords[1], 7, 0, 2 * Math.PI);
                ctx.fill();
            }

            ctx.beginPath();

            //draws lines between points
            for (let i = 0; i < points.length; i++){
                const cords = points[i].getPosition(); 
                const cordsNext = points[(i+1) % points.length].getPosition();
                ctx.moveTo(cords[0], cords[1]);
                ctx.lineTo(cordsNext[0], cordsNext[1]);
            }
        }
    
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#F3DFA2";
    
        //draw chaikin line
        for (let i = 0; i < curve.length; i++){
            const cords = curve[i].getPosition(); 
            const cordsNext = curve[(i+1) % curve.length].getPosition();
            ctx.moveTo(cords[0], cords[1]);
            ctx.lineTo(cordsNext[0], cordsNext[1]);
        }
    
        ctx.stroke();
    }
}

function chaikin(points, iterations){
    let buffer = points;
    let curve = [];

    if (iterations == 0){ return points }

    for (let i = 0; i < iterations; i++){
        curve = [];
        if (!isPolygon){
            for (let j = 0; j < buffer.length - 1; j++){
                let leftPoint = buffer[j].getPosition();
                let rightPoint = buffer[j+1].getPosition();
    
                curve.push(new Point(0.75 * leftPoint[0] + 0.25 * rightPoint[0], 0.75 * leftPoint[1] + 0.25 * rightPoint[1]));
                curve.push(new Point(0.25 * leftPoint[0] + 0.75 * rightPoint[0], 0.25 * leftPoint[1] + 0.75 * rightPoint[1]));
            }
        }
        else{
            for (let j = 0; j < buffer.length; j++){
                let leftPoint = buffer[j].getPosition();
                let rightPoint = buffer[(j+1) % buffer.length].getPosition();
    
                curve.push(new Point(0.75 * leftPoint[0] + 0.25 * rightPoint[0], 0.75 * leftPoint[1] + 0.25 * rightPoint[1]));
                curve.push(new Point(0.25 * leftPoint[0] + 0.75 * rightPoint[0], 0.25 * leftPoint[1] + 0.75 * rightPoint[1]));
            }
        }
        buffer =  curve;
    }
    return curve;
}

function clearCanvas(canvas, points){
    ctx = canvas.getContext("2d");
    points = [];
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    return points;
}

function undoLastPoint(points){
    points.splice(-1);

    drawElements(points, canvasElem, chaikinSteps);

    return points;
}

function setChaikinStepVal(canvas, points){
    var sliderVal = parseInt(document.getElementById("chaikinSteps").value);
    document.getElementById("chaikinStepVal").innerHTML = sliderVal;

    drawElements(points, canvas, sliderVal);

    return sliderVal;
}

function setChaikinStepValButton(canvas, points, increase, sliderVal){
    if (increase && sliderVal < 10){
        sliderVal += 1
        document.getElementById("chaikinStepVal").innerHTML = sliderVal;
        document.getElementById("chaikinSteps").value = sliderVal;

        drawElements(points, canvas, sliderVal);
        return sliderVal
    }
    else if (!increase && sliderVal > 0) {
        sliderVal -= 1
        document.getElementById("chaikinStepVal").innerHTML = sliderVal;
        document.getElementById("chaikinSteps").value = sliderVal;

        drawElements(points, canvas, sliderVal);
        return sliderVal
    }
    else{
        return sliderVal
    }
}

function togglePolygonMode(bool, canvas, points, sliderVal){
    var polygonToggleElem = document.getElementById("polygonToggle");
    if (bool){
        polygonToggleElem.textContent = "Polygon Mode: Off"
        polygonToggleElem.style.background='#BB4430'
        isPolygon = false;
        drawElements(points, canvas, sliderVal);
        return false;
    }
    else{
        polygonToggleElem.textContent = "Polygon Mode: On"
        polygonToggleElem.style.background='#138A36'
        isPolygon = true;
        drawElements(points, canvas, sliderVal);
        return true;
    }
}

function toggleHideOriginalMode(bool){
    if (bool){
        hideOriginalElem.textContent = "Hide original: Off"
        hideOriginalElem.style.background='#BB4430'
        hideOriginal = false;
        drawElements(points, canvasElem, chaikinSteps);
        return false;
    }
    else{
        hideOriginalElem.textContent = "Hide original: On"
        hideOriginalElem.style.background='#138A36'
        hideOriginal = true;
        drawElements(points, canvasElem, chaikinSteps);
        return true;
    }
}

function hoverBoolButton(event, button, bool){
    if(event.type == "mouseover"){
        if(!bool){
            button.style.background = '#8C3324'
        }
        else{
            button.style.background='#0E6829'
        }
    }
    if(event.type == "mouseout"){
        if(!bool){
            button.style.background = '#BB4430'
        }
        else{
            button.style.background='#138A36'
        }
    }
}

function hoverButton(event, button) {
    if(event.type == "mouseover"){
        button.style.background = '#BFBFBF'
    }
    if(event.type == "mouseout"){
        button.style.background = '#FFFFFF'
    }
}

let canvasElem = document.getElementById("clickArea");
canvasElem.width = window.innerWidth * 0.8;
canvasElem.height = window.innerHeight * 0.85;

let clearButtonElem = document.getElementById("clearButton");
clearButtonElem.style.background = '#FFFFFF'
let undoButtonElem = document.getElementById("undoLast");
undoButtonElem.style.background = '#FFFFFF'
let plusButtonElem = document.getElementById("increaseSteps");
let minusButtonElem = document.getElementById("decreaseSteps");

var stepSlider = document.getElementById("chaikinSteps");
document.getElementById("chaikinStepVal").innerHTML = stepSlider.value;

var polygonToggleElem = document.getElementById("polygonToggle");
polygonToggleElem.textContent = "Polygon Mode: Off"
polygonToggleElem.style.background = '#BB4430'

let hideOriginalElem = document.getElementById("hideOriginalToggle");
hideOriginalElem.textContent = "Hide original: Off"
hideOriginalElem.style.background = '#BB4430'

let points = [];

let chaikinSteps = 0;

let isPolygon = false;

let hideOriginal = false;

clearButtonElem.addEventListener("click", function() {points = clearCanvas(canvasElem, points)});
clearButtonElem.addEventListener("mouseover", function(e) {hoverButton(e, clearButtonElem)});
clearButtonElem.addEventListener("mouseout", function(e) {hoverButton(e, clearButtonElem)});

undoButtonElem.addEventListener("click", function() {points = undoLastPoint(points)});
undoButtonElem.addEventListener("mouseover", function(e) {hoverButton(e, undoButtonElem)});
undoButtonElem.addEventListener("mouseout", function(e) {hoverButton(e, undoButtonElem)});

polygonToggleElem.addEventListener("click", function() {isPolygon = togglePolygonMode(isPolygon, canvasElem, points, chaikinSteps)});
polygonToggleElem.addEventListener("mouseover", function(e) {hoverBoolButton(e, polygonToggleElem, isPolygon)});
polygonToggleElem.addEventListener("mouseout", function(e) {hoverBoolButton(e, polygonToggleElem, isPolygon)});

hideOriginalElem.addEventListener("click", function() {hideOriginal = toggleHideOriginalMode(hideOriginal)});
hideOriginalElem.addEventListener("mouseover", function(e) {hoverBoolButton(e, hideOriginalElem, hideOriginal)});
hideOriginalElem.addEventListener("mouseout", function(e) {hoverBoolButton(e, hideOriginalElem, hideOriginal)});

canvasElem.addEventListener("mousedown", function(e) {points = canvasInteract(canvasElem, e, points, chaikinSteps)});
canvasElem.addEventListener("mouseup", function(e) {points = canvasInteract(canvasElem, e, points, chaikinSteps)});
canvasElem.addEventListener("mouseout", function(e) {points = canvasInteract(canvasElem, e, points, chaikinSteps)});
canvasElem.addEventListener("mousemove", function(e) {points = canvasInteract(canvasElem, e, points, chaikinSteps)});

stepSlider.addEventListener("input", function() {chaikinSteps = setChaikinStepVal(canvasElem, points)});

minusButtonElem.addEventListener("click", function() { chaikinSteps =  setChaikinStepValButton(canvasElem, points, false, chaikinSteps)});
minusButtonElem.addEventListener("mouseover", function(e) {hoverButton(e, minusButtonElem)});
minusButtonElem.addEventListener("mouseout", function(e) {hoverButton(e, minusButtonElem)});

plusButtonElem.addEventListener("click", function() { chaikinSteps =  setChaikinStepValButton(canvasElem, points, true, chaikinSteps)});
plusButtonElem.addEventListener("mouseover", function(e) {hoverButton(e, plusButtonElem)});
plusButtonElem.addEventListener("mouseout", function(e) {hoverButton(e, plusButtonElem)});

//dynamically set button sizes?
//lägg till lite förklarande text?
//make look good.

//https://htmlcolorcodes.com/color-picker/