function Shot(pos, h) {
  this.pos = pos.copy();
  this.vel = p5.Vector.fromAngle(h).mult(10);
  this.toRemove = false;
  this.update = function() {
    this.pos.add(this.vel);
  }
  this.show = function() {
    push();
    stroke(255, 255, 255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
    pop();
  }
  this.checkEdges = function() {
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      this.toRemove = true;
    }
  }
  // this.hits = function(a) {
  //   var d = p5.Vector.dist(this.pos, a.pos);
  //   if (d < a.r) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}