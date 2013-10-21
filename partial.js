function drawLine(from,to,context){
	context.save()
	context.beginPath()
	context.moveTo(to.x,to.y)
	context.lineTo(from.x,from.y)
	context.strokeStyle = "rgb(200,200,200)"
	context.stroke()
	context.closePath()
	context.restore()
}

function Partial(){
	this.data = null
	this.name = null
	this.text= ""
	this.index = 0
	this.children = []
	this.parent = null
	this.partial_render= null
	this.context = null
	this.hierachy = 0
	this.settins
	this.toString = function(){
		return "name: "+this.name + "center: "+this.center.x+" , "+this.center.y+ ", parent "+this.parent
	}	
	this.generate_render = function(){
		var p  = new Partial_Render()
		p.data= this.data
		if(this.parent!=null){
			p.radius =this.parent.partial_render.radius*RADIUS_GRADIENT_RATE
		}
		p.partial = this
		this.partial_render = p
		p.generate_center()
		for(var i =0;i<this.children.length;i++){
			this.children[i].generate_render()
		}
	}

	this.render = function(context){
		this.partial_render.render(context)
		for(var i =0;i<this.children.length;i++){
			this.children[i].render(context)
			drawLine(this.partial_render.center,this.children[i].partial_render.center,context)
		}

	}
	this.minus = function(other){
		return this.partial_render.center.minus(other.partial_render.center)
	}
	this.parse = function(data){
		this.parseData(data)
		this.generate_render()
	}
	this.parseData = function(data){
		this.data = data
		this.text = data.text
		this.name = data.name
		this.text = data.text
		//p.context = this.context
		//p.index = index
		if(data.children!=null)	{
			for(var i=0;i<data.children.length;i++){
				 var partial = new Partial()
				 partial.parseData(data.children[i])
				 partial.index=  i
				 partial.parent = this
				 partial.hierachy +=this.hierachy
				 this.children.push(partial)
			}
		}
	}
}