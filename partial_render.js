function Partial_Render(settings){
	this.data = null
	this.partial = null
	this.center = null
	this.settings = settings
	this.radius = this.settings.center_radius 
	this.context = null
	this.visible = true
	this.generate_center= function(){
		if(this.partial == null)	
			return null
		var parent = this.partial.parent
		if(parent == null){
			//origin
			this.center= new Point(0,0)
			return
		}

		var parent_render= this.partial.parent.partial_render
		var index =this.partial.index
		if(parent_render == null || parent_render.center == null ){
			return null
		}
		else{
			var parent_center=  parent_render.center
			var parent_vector = null
			var grandparent = parent.parent
			var _new_base_center = new Point(0,0)
			//next will be the parent vector. get the grandparents.
			if(grandparent == null){
				//first generation, default normal line is horizontal.
				parent_vector = new Point(-1,0)
				_new_base_center = new Point(-this.settings.center_line_length,0)
			}
			else{
				parent_vector= grandparent.minus(parent)
				var deltaX = parent_vector.x
				var deltaY = parent_vector.y
				var rate = DIST_GRADIENT_RATE
				var _new_base_center_x = deltaX*(1-rate)+grandparent.partial_render.center.x
				var _new_base_center_y = deltaY*(1-rate)+grandparent.partial_render.center.y
				_new_base_center = new Point(_new_base_center_x,_new_base_center_y)

			}
			

			var siblings_size = parent.children.length
			var angle_unit = 0
			if(siblings_size>=MAX_CHILDREN){
				angle_unit = 2*Math.PI/(MAX_CHILDREN+1)
			}
			else if(siblings_size ==1){
				angel_unit =0
			}
			else{
				angle_unit = 2*Math.PI/siblings_size
			}
			if(this.partial.index ==0)
			{	
				this.center = _new_base_center.rotate(parent.partial_render.center,angle_unit/2)
			}
			else
				this.center= _new_base_center.rotate(parent.partial_render.center,angle_unit*index+angle_unit/2) 
				//if(this.partial.index%2==0)
				//this.center = this.center.multiply(1+Math.random(1))

		}

	}
	this.render= function(context){
		if(this.visible==false)
			return
		var image= new Image()
		image.src = this.data.image
		var render_partial = this
		image.onload = function(){
					context.save()
					context.beginPath()
					context.arc(render_partial.center.x,render_partial.center.y,render_partial.radius,0,2*Math.PI,true)
					var gra = context.createRadialGradient(render_partial.center.x, render_partial.center.y,render_partial.radius-circle_style.borderWidth,render_partial.center.x,render_partial.center.y,render_partial.radius)
					gra.addColorStop(0,circle_style.gra_start)

					gra.addColorStop(1,circle_style.gra_stop)
					context.fillStyle = gra
					context.shadowBlur = circle_style.shadowBlur
					context.shadowColor= circle_style.shadowColor
					context.closePath()
					context.fill()
					context.beginPath()
					context.arc(render_partial.center.x,render_partial.center.y,render_partial.radius - circle_style.borderWidth,0,2*Math.PI,true)
					context.clip()
					context.drawImage(image,render_partial.center.x-50,render_partial.center.y-50,100,100)
					//context.fillStyle = "rgb(255,0,0)"
					//context.font ="10pt Arial"
					//context.fillText(render_partial.data.text,render_partial.center.x,render_partial.center.y)
					context.closePath()	
					context.restore() 
		}
		
	}

}