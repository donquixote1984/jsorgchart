function Point(x,y){
	this.x=x
	this.y=y
	this.rotate = function(center,theta){
		var x = center.x+this.x*Math.cos(theta)-this.y*Math.sin(theta)
		var y = center.y+this.x*Math.sin(theta)+this.y*Math.cos(theta)
		return new Point(x,y)
	}
	this.append = function(p){
		return new Point(this.x+p.x,this.y+p.y)
	}
	this.minus = function(p){
		return new Point(this.x-p.x, this.y-p.y)
	}	
	this.toString = function(){
		return "x:"+this.x+", y="+this.y
	}
	this.multiply = function(num){
		return new Point(this.x*num,this.y*num)
	}
	this.muyltiply_xy = function(x,y){
		return new Point(this.x*x,this.y*y)
	}
	this.length = function(p){
		return Math.sqrt(
				(this.x-p.x)*(this.x-p.x) + (this.y-p.y)*(this.y-p.y)
			)
	}
}
