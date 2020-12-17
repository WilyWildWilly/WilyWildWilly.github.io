// three main projects in one file (for now):
// orbiter, iss-tracker and flow-field

//generic variables for iss-tracker
var img;
function preload() {
  img = loadImage('background/world-map-g-b.jpeg');
}
var boxSizeHeight;
var boxSizeWidth;
var translateX;
var translateY;
var latConst;
var lonConst;
var frameLine = 0;
// generic variables for the perlin noise flow field
// set the increment
var inc = 0.1;
// set the scale (no touchie for now)
var scl = 10;
var cols, rows;
// time dimension variable
var zoff = 0;
var particles = [];
var flowfield;
var cols;
var rows;
var particles;
// flowT is an internal counter for the perlin noise flow field
var flowT = 0;


function setup() {
  // time counter
  t = 0;
  // get the width and height for the canvas from the DOM
  boxSizeWidth = document.getElementById("canvas-box").clientWidth;
  boxSizeHeight = 213;
  createCanvas(boxSizeWidth, boxSizeHeight);
  //having a width and height, setup the perlin noise field variables
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);
  for (var i = 0; i < 2000; i++) {
    particles[i] = new Point();
  }
  // this array and selector are used to keep track of what to execute
  samples = ["orbiter", "iss-tracker", "flow-field"]
  selectedSample = 0;
  // attractor sample
  if (selectedSample === 0) {
    translateX = 0;
    translateY = 0;
    particle = new Particle(createVector(width / 2, 30), 2, createVector(2.3, 0));
    moon = new Particle(createVector(particle.pos.x, particle.pos.y + 13), 0.5, createVector(1.3, 0));
    attractor = new Attractor(width / 2, height / 2);
  }
  // tracker sample
  if (selectedSample === 1) {
    img = img.resize(boxSizeWidth, boxSizeHeight);
  }
}

// show the sample names highlighting the selected one
function displaySample() {
  // for each sample in the array
  for (var i = 0; i < samples.length; i++) {
    // fill light green if selected
    if (i === selectedSample) {
      fill(180, 250, 185, 60);
    }
    // or dark otherwise
    else {
      fill(37, 37, 29, 60);
    }
    noStroke();
    textFont("courier new")
    text(samples[i], ((width / 3) * i) + 15, 30);
  }
}

// switch displayed samples by clicking the mouse
function mousePressed() {
  changeSelection(selectedSample, samples)
}

function changeSelection() {
  selectedSample += 1;
  if (selectedSample >= samples.length) {
    selectedSample = 0;
  }
  // reset the perlin noise time variable
  flowT = 0;
}


// global functions for the Tracker sample
// fetch-get the data for the iss tracker
function getData() {
  fetch("https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json", {
    headers: { Origin: window.location.host }
  })
  .then(res => res.json())
  .then(res => {
    gotData(res);
  })
  .catch(err => {
    console.log(err);
  });
}
// turn the data into coordinates and represent them
function gotData(data) {
  background(img);
  displaySample();
  frameLine = 0;
  // this will allow you to see the raw data live in your browser console
  console.log("latitude of the ISS : " + data.iss_position.latitude);
  console.log("longitude of the ISS: " + data.iss_position.longitude);
  posX = (parseFloat(data.iss_position.latitude * latConst) + translateX);
  posY = map((parseFloat(data.iss_position.longitude)), -180, 180, 0, 213);
  stroke(10, 247, 20);
  ellipse(posX, posY, 10, 10)
  // console.log(posX);
  // console.log(posY);
  fill(250, 50, 50, 90);
  ellipse(posX, posY, 10, 10);
}


function draw() {
  //case orbiter
  if (selectedSample === 0) {
    background(50);
    var force = attractor.calculateAttraction(particle);
    particle.applyForce(force);
    particle.update();
    force = particle.calculateAttraction(moon);
    moon.applyForce(force);
    force = attractor.calculateAttraction(moon);
    moon.applyForce(force);
    moon.update();
    particle.display();
    moon.display();
    attractor.display();
  }
  // case tracker
  if (selectedSample === 1) {
    translateX = boxSizeWidth / 2;
    translateY = boxSizeHeight / 2;
    latConst = boxSizeWidth / 360;
    lonConst = boxSizeHeight / 180;
    stroke(20, 247, 50, 80);
    line(0, frameLine, width, frameLine);
    stroke(10, 20, 10);
    line(0, (frameLine - 3), width, (frameLine - 3));
    if (t === 0) {
      getData()
    }
  }
  if (selectedSample === 2) {
    if (flowT === 0) {
      background(10, 20, 10);
    }
    if (flowT < 2000) {
      var yoff = 0;
      for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
          var index = x + y * cols;
          var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
          var v = p5.Vector.fromAngle(angle);
          // *** set the intensity of the force field through the vectors' magnitude
          v.setMag(1.0);
          flowfield[index] = v;
          xoff += inc;
        }
        yoff += inc;
        // set the time flow for the force field
        zoff += 0.0003;
      }
      for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
      }
      flowT++;
    }
    if (flowT >= 2000) {
      flowT = 0;
    }
  }
  displaySample();
  t++
  if (t >= 119) {
    t = 0;
  }
  frameLine += 3;
}