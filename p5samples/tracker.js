function Tracker(w, h) {
  this.positionsAry = [];
  this.i = 0;
  this.lonConst = w / 360;
  this.latConst = h / 180;
  this.translateX = w/2;
  this.translateY = h/2;
  
  this.tracker = function(position) {
    if(position !== positionsAry[positionsAry.length - 1]){
      fill(180, 250, 185);
      ellipse(position[0], position[1], 4, 4);
    }
  }
  this.gotData = function(data) {
  
    // this will allow you to see the raw data live in your browser console
    console.log(data.iss_position.longitude);
    console.log(data.iss_position.latitude);
    const back = backSelector.value();
    textSize(25);
    fill(txtColor);
    text(String(back), backSelector.width * 2, 85);
    console.log(back)
    // draw the background, translate to map correctly and draw the red dot
    background(img, windowWidth, windowHeight);
    translate(translateX, translateY);
    fill(redColor);
    ellipse(parseFloat(data.iss_position.longitude * lonConst), parseFloat(data.iss_position.latitude * latConst), 10, 10);
    if(i % 30 === 0 || i === 0) {
      positionsAry.push([parseFloat(data.iss_position.longitude * lonConst), parseFloat(data.iss_position.latitude * latConst)]);
      if(positionsAry.length > 100) {
        positionsAry = positionsAry.slice(1);
      }
    }
    // this will count the seconds to let postionsAry hold 1 in 60 values (1 per minute)
    i++
    /// call the tracker function to draw the array of recorded positions
    positionsAry.forEach(tracker);
    console.log(positionsAry)
  }
  this.askForPosition = function(){
    // var promise = fetch("http://api.open-notify.org/iss-now.json");
    setTimeout(function(){
      loadJSON("http://api.open-notify.org/iss-now.json", gotData, 'jsonp')
    }, 2000) 
  }
}