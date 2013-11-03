function Point(x,y){
	this.x=x
	this.y=y
	this.rotate = function(center,theta){
		var x = (this.x-center.x)*Math.cos(theta)-(this.y-center.y)*Math.sin(theta)+center.x
		var y = (this.x-center.x)*Math.sin(theta)+(this.y-center.y)*Math.cos(theta)+center.y
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
	this.dist = function(p){
		return Math.sqrt(
				(this.x-p.x)*(this.x-p.x) + (this.y-p.y)*(this.y-p.y)
			)
	}
	this.equals = function(p){
		return this.x==p.x&&this.y==p.y
	}
	
}
