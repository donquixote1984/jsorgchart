function drawLine(from,to,context){
    if(from.check_bound()==false&&to.check_bound()==false){
        return
    }
    context.save()
    context.beginPath()
    //context.globalCompositeOperation="destination-over"
    context.moveTo(to.center.x,to.center.y)
    context.lineTo(from.center.x,from.center.y)
    if(from.is_hovered&&to.is_hovered){
        context.lineWidth=2
        context.strokeStyle = "#336699"
    }
    else{
        context.lineWidth=1
        context.strokeStyle = "#cacaca"
    }
    
    context.stroke()
    context.closePath()
    context.restore()
}
var circle_style = {
				innerRadius : 25,
				outerRadius:30,
				gra_start : '#aeaeae',
				gra_stop : '#eaeaea',
				gra_hover_stop : '#808080',
				shadowBlur:20,
				shadowColor: '2e2e2e',
				borderWidth:5
		}

function OrgChart(settings){
	this.id = settings.id
	this.canvas = $("#"+this.id)
	this.context = settings.context
	this.width = settings.width
	this.height=settings.height
	this.hierarchy = settings.hierarchy
	if(this.hierarchy > 2)
		this.hierarchy = 2
	if(this.hierarchy<=0)
		this.hierarchy=1
	this.wh = this.width/this.height
	this.settings=settings
	this.center_radius = settings.center_radius
	this.center_line_length = settings.center_line_length
	this.root = null
	this.radius_regression = 0.785
	this.line_regression = 0.61
	this.center_radius = 35
	this.center_length = 180
	this.page_size=settings.page_size==null?10:settings.page_size
	this.bezier =new KeySpline(0.19,0.64,0.35,0.76)
	this.zoom = 0
	this.translateX = 0
	this.translateY =0
	this.eye_radius = 35
	this.eye = new Point(0,0)
	this.eye_hovered= false

	this.eye_element=null
	this.hover_element = null
	this.is_mouse_down = false
	this.init = function(){
		Element.prototype = new RenderObject(this)
		Edge.prototype = new RenderObject(this)
		var _chart= this
		$.getJSON("http://localhost:8000/first/",function(data){
			_chart.root = new Element(_chart)
			_chart.root.init(data)
			_chart.eye_element=_chart.root
			_chart.root.visible=true
			_chart.root.render()
			_chart.root.open()
			_chart.init_event()
		})
		
	}
	this.init_eye = function(){
		this.context.save()
		this.context.shadowBlur = 3;

		if(this.eye_hovered){
			this.context.strokeStyle="#ccc"
			this.context.shadowColor="#333"
			this.context.lineWidth=4
		}
		else{
			this.context.strokeStyle = "#ccc"
			this.context.shadowColor = "#336699";			
			this.context.lineWidth=2
		}
		for(var i =0;i<20;i++){
			var angle_start = i*2*Math.PI/20
			var angle_end = angle_start+2*Math.PI/20
			if(i%2==0){
				this.context.beginPath()
				this.context.arc(0,0,this.eye_radius,angle_start,angle_end,false)
				this.context.stroke()
				this.context.closePath()
			}
			
		}
		
		this.context.closePath()
		this.context.restore()
	}
	this.clear = function(){
		var context=this.context
		context.save()
		context.clearRect(-400,-300,800,600)
		context.restore()
	}
	this.init_event = function(){
		this.init_hover()
		//this.init_click()
		//this.init_mousedown()
		//this.init_mouseup()
		//this.init_dblclick()
	}
	this.init_click = function(){
		var _this = this
		this.canvas.click(function(e){
			var p = getMousePos(this,e)
			var that= this
			setTimeout(function(){
				var double = parseInt($(that).data('double'),10)
				if(double>0){
					$(that).data('double',double-1)
					return false
				}
				else{
					console.log("single click")
					_this.root.check_click(p.x-400,p.y-300)
				}
			},300)
			
		}).dblclick(function(e){
			var p = getMousePos(this,e)
			$(this).data('double',2)
			console.log("double click")
			_this.root.check_dblclick(p.x-400,p.y-400)
		})
	}
	this.init_mousedown = function(){
		var _this = this
		this.canvas.mousedown(function(e){
			var p =getMousePos(this,e)
			e.stopPropagation()
			_this.is_mouse_down =true
			_this.root.check_mousedown(p.x-400,p.y-300)
		})
	}
	this.init_mouseup = function(){
		var _this = this
		this.canvas.mouseup(function(e){
			var p =getMousePos(this,e)
			_this.is_mouse_down=false
			_this.root.check_mouseup(p.x-400,p.y-300)
			//_this.root.check_drag_position(p.x-400,p.y-300)
		})
	}
	this.init_hover  =function(){
		var _this =this
		this.canvas.mousemove(function(e){
			var p = getMousePos(this,e)
			 writeMessage(p)
			 if(this.is_mouse_down){
			 	_this.on_drag(p.x-400,p.y-300)
			 }
			 else{
			 	_this.on_hover(p.x-400,p.y-300)
			 }
		})
	}

	this.on_hover = function(x,y){
		var q = []
		q.push(this.root)
		var unchange = true
		var hover_e = null
		while(q.length>0){
			var e = q.shift()
			for(var i =0;i<e.children.length;i++){
				if(e.children[i].check_bound()&&e.children[i].visible){
					q.push(e.children[i])
				}
			}
			var check_hover_element = e.check_hover(x,y)
			if(check_hover_element!=null){
				hover_e = e
			}
		}
		if(hover_e!=null){
			this.canvas.addClass("cursor")
		}
		else{
			this.canvas.removeClass("cursor")
		}
		var prev_node = this.hover_element
		var current_node = hover_e
		if(prev_node==null&&current_node==null){
			//donothing	
		}
		else if((prev_node&&current_node)==null&&(prev_node||current_node)!=null){
			this.render()
		}
		else if(prev_node.constructor!=current_node.constructor){
			this.render()			
		}
		else{
			if(!prev_node.equals(current_node)){
				this.render()
			}
		}
	}

	this.on_drag = function(){

	}
	this.init_dblclick= function(){
		var _this =this
		this.canvas.dblclick(function(e){
			e.stopPropagation()
			var p = getMousePos(this,e)
			 writeMessage(p)
			_this.root.check_dblclick(p.x-400,p.y-300)
		})
	}
	this.render= function(){
		this.clear()
		console.log("render")
		this.init_eye()
		this.render_elements()
	}
	this.render_elements = function(){
		var q = []
		q.push(this.root)
		var hover_element = null
		if(this.root.is_hovered){
			hover_element = this.root
		}
		while(q.length>0){
			var e =q.shift()
			if(e.is_open){
				for(var i =0 ;i<e.children.length;i++){
					if(e.children[i].visible&&e.children[i].check_bound()){
						drawLine(e,e.children[i],this.context)
						q.push(e.children[i])
						if(e.children[i].is_hovered){
							hover_element  =e.children[i]
						}
					}
				}
			}
			if(e.is_hovered==false){
				e.render()
			}
			if(hover_element!=null){
				hover_element.render()		
				if(hover_element.is_open){
					for(var i =0 ;i<hover_element.children.length;i++){
						if(hover_element.children[i].visible){
							drawLine(hover_element,hover_element.children[i],this.context)
							hover_element.children[i].render()
						}
					}
				}
			}
		}
	}

	this.chroot = function(element){
		this.root = element
		this.element.chroot()	
	}
	this.translate =function(deltaX,deltaY){
		this.translateX+=deltaX
		this.translateY+=deltaY
		this.root.translate(deltaX,deltaY)	
	}

	this.zoomin = function(){
		this.zoom+=1
		this.root.scaleIn()
	}
	this.zoomout =function(){
		this.zoom-=1
		this.root.scaleOut()
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Point(evt.clientX - rect.left,evt.clientY - rect.top)
}
function writeMessage(p){
	$("#thefuck").text((p.x-400)+" "+(p.y-300))
}
