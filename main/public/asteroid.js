function Asteroid(a) {
  this.pos = createVector(a.x * width, a.y * height);
  this.r = a.r * width;
  this.vel = createVector(a.xVel, a.yVel).normalize().div(this.r / 16);
  this.offset = [];
  for (var i = 0; i < a.offset.length; i++) {
    this.offset[i] = a.offset[i] * width;
  }
  this.update = function() {
    this.pos.add(this.vel);
  }
  this.show = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.offset.length; i++) {
      var angle = map(i, 0, this.offset.length, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
  this.checkEdges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    }
    if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    }
    if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
// function Asteroid(a) {
//   if (r) {
//     this.r = r / 2;
//   } else {
//     this.r = width / 30;
//   }
//   if (pos) {
//     this.pos = pos.copy();
//     this.vel = p5.Vector.random2D().div(this.r / 16);
//   } else {
//     var sector = floor(random(1, 5));
//     switch (sector) {
//       case 1:
//         var x = width;
//         var y = random(height);
//         var xVel = random(-1, 0);
//         var yVel = random(-1, 1);
//         break;
//       case 2:
//         var x = random(width);
//         var y = height;
//         var xVel = random(-1, 1);
//         var yVel = random(-1, 0);
//         break;
//       case 3:
//         var x = 0;
//         var y = random(height);
//         var xVel = random();
//         var yVel = random(-1, 1);
//         break;
//       case 4:
//         var x = random(width);
//         var y = 0;
//         var xVel = random(-1, 1);
//         var yVel = random();
//         break;
//     }
//     this.pos = createVector(x, y);
//     this.vel = createVector(xVel, yVel).normalize().div(this.r / 16);
//   }
//   this.total = random(5, 15);
//   this.offset = [];
//   for (var i = 0; i < this.total; i++) {
//     this.offset.push(random(-this.r / 4, this.r / 4));
//   }
//   this.update = function() {
//     this.pos.add(this.vel);
//   }
//   this.show = function() {
//     push();
//     stroke(255);
//     noFill();
//     translate(this.pos.x, this.pos.y);
//     beginShape();
//     for (var i = 0; i < this.total; i++) {
//       var angle = map(i, 0, this.total, 0, TWO_PI);
//       var r = this.r + this.offset[i];
//       var x = r * cos(angle);
//       var y = r * sin(angle);
//       vertex(x, y);
//     }
//     endShape(CLOSE);
//     pop();
//   }
//   this.breakup = function() {
//     let newA = [];
//     newA.push(new Asteroid(this.pos, this.r));
//     newA.push(new Asteroid(this.pos, this.r));
//     return newA;
//   }
//   this.checkEdges = function() {
//     if (this.pos.x > width + this.r) {
//       this.pos.x = -this.r;
//     }
//     if (this.pos.x < -this.r) {
//       this.pos.x = width + this.r;
//     }
//     if (this.pos.y > height + this.r) {
//       this.pos.y = -this.r;
//     }
//     if (this.pos.y < -this.r) {
//       this.pos.y = height + this.r;
//     }
//   }
// }