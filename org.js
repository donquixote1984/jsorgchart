function drawLine(from,to,context){
    if(from.check_bound()==false&&to.check_bound()==false){
        return
    }
    context.save()
    context.beginPath()
    //context.globalCompositeOperation="destination-over"
    if(from.is_disable){
    	context.globalAlpha=0.5
    }
    context.moveTo(to.center.x,to.center.y)
    context.lineTo(from.center.x,from.center.y)
    if(from.is_hovered){
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

var pane_style = {
	"border":"1px solid #CCC",
	"position":"absolute",
	"display":"none",
	"background":"#334455",
	"padding":"10px",
	"border-radius":"4px",
	"font-size":"8pt",
	"color":"white",
	"transition":"",
	"z-index":"9999"
}
tackle = 10
function OrgChart(settings){
	this.id = settings.id
	this.canvas = $("#"+this.id)
	this.controls = $("#jsorg_controls")
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
	this.eye_radius =30 
	this.eye = new Point(0,0)
	this.eye_hover= null

	this.eye_element=null
	this.hover_element = null
	this.mouse_down_edge = null
	this.mouse_down_element=null
	this.mousedownX=null
	this.mousedownY=null
	this.is_dragged=false
	this.framecontrol = null
	this.timer = null
	this.adapt_time = 1

	this.center_element = null
	this.hierarchy_exceed_info = "Too much hierachy, try to drag children node into center!"

	this.init = function(){
		Element.prototype = new RenderObject(this)
		Edge.prototype = new RenderObject(this)
		var _chart= this
		$.getJSON("http://localhost:8000/first/",function(data){
			_chart.root = new Element(_chart)
			_chart.root.init(data)
			_chart.eye_element=_chart.root
			_chart.center_element=_chart.root
			_chart.root.visible=true

			//_chart.root.render()
			_chart.root.open()
			_chart.init_event()
			//_chart.render()
		})
		
	}
	this.add_mousedown_element = function(e){
		this.mouse_down_element = e
		this.mousedownX= e.center.x
		this.mousedownY=e.center.y
	}
	this.remove_mousedown_element = function(e){
		this.mouse_down_element = null
		this.mousedownX = null
		this.mousedownY = null
	}
	this.init_eye = function(){
		this.context.save()
		this.context.shadowBlur = 3;

		if(this.eye_hover!=null){
			this.context.strokeStyle="#369"
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
		this.init_click()
		this.init_mousedown()
		this.init_mouseup()
		this.init_controls()
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
					_this.on_click(p.x-400,p.y-300)
				}
			},300)
			
		}).dblclick(function(e){
			var p = getMousePos(this,e)
			$(this).data('double',2)
			_this.root.check_dblclick(p.x-400,p.y-400)
		})
	}
	this.init_mousedown = function(){
		var _this = this
		this.canvas.mousedown(function(e){
			var p =getMousePos(this,e)
			e.stopPropagation()
			_this.on_mousedown(p.x-400,p.y-300)
		})
	}
	this.init_mouseup = function(){
		var _this = this
		this.canvas.mouseup(function(e){
			var p =getMousePos(this,e)
			_this.on_mouseup(p.x-400,p.y-300)
			//_this.root.check_drag_position(p.x-400,p.y-300)
		})
	}
	this.init_hover  =function(){
		var _this =this
		this.canvas.mousemove(function(e){
			var p = getMousePos(this,e)
			 writeMessage(p)
			 if(_this.mouse_down_element!=null){
			 	_this.on_drag(p.x-400,p.y-300)
			 }
			 else{

			 	_this.on_hover(p.x-400,p.y-300)
			 }
		})
	}
	this.init_controls = function(){
		var _this =this
		this.controls.find("#control-left").click(function(){

		})
		this.controls.find("#control-right").click(function(){

		})
		this.controls.find("#control-repeat").click(function(){
			_this.on_origin()
		})
	}
	this.on_mousedown = function(x,y){
		var q = []
		q.push(this.center_element.get_nearest_invisible_parent())
		while(q.length>0){
			var e =q.shift()
			if(e.edge!=null){
				if(e.edge.is_in_edge(x,y)){
					e.edge.mousedown()
					this.mouse_down_edge=e.edge
					break;
				}
			}
			if(e.is_in_area(x,y)){
				this.add_mousedown_element(e)
				this.framecontrol = new Point(e.center.x,e.center.y)
			}
			if(e.is_open){
				for(var i = 0;i<e.children.length;i++){
					if(e.children[i].visible){
						q.push(e.children[i])
					}
				}
			}
		}

	}
	this.on_mouseup = function(x,y){
		var q =[]
		if(this.mouse_down_edge!=null){
			clearInterval(this.mouse_down_edge.element.timer)
			this.mouse_down_edge = null
		}
		if(this.eye_hover!=null){
			this.adapt()
		}
		else{
			if(this.is_dragged){
				this.revert()
			}
		}
		this.remove_mousedown_element()
		this.framecontrol= null
		this.eye_hover = null
	}
	this.revert = function(){
		var deltaX = this.mousedownX -this.mouse_down_element.center.x 
		var deltaY = this.mousedownY -this.mouse_down_element.center.y
		var dist = this.mouse_down_element.center.dist(new Point(this.mousedownX,this.mousedownY))
		var t_step = 0.1/this.adapt_time
	     var t =0
	     var max_walk = this.bezier.get(this.adapt_time)
	     var walk_rate = dist/max_walk
	     var _this = this
		this.timer = setInterval(function(){
			 var k = _this.bezier.get(t)/max_walk
			 _this.translate(deltaX*k,deltaY*k)
			 t+=t_step
			 _this.render()
			 _this.translate(-deltaX*k,-deltaY*k)
			 if(t>_this.adapt_time){
			 	clearInterval(_this.timer)
			 	_this.translate(deltaX,deltaY)
			 	_this.render()
			 }
		},1000/60)
		//this.translate(deltaX,deltaY)
		
	}
	this.adapt = function(){
		if(this.center_element == null){
			return
		}

		if(this.eye_hover == this.center_element){
		}
		else if(this.eye_hover.hierarchy<this.center_element.hierarchy){
			var e = this.center_element.parent
			while(true){
				this.drillUp()
				e.enable()
				if(e==this.eye_hover||e.hierarchy<this.eye_hover.hierarchy){
					break;
				}
				else{
					e = e.parent
				}
			}
		}
		else if(this.eye_hover.hierarchy>this.center_element.hierarchy){
			var e = this.eye_hover
			do{
				this.drillDown()
				e.disable_up()
				e = e.parent
			}
			while(e!=this.center_element)
		}
		else if(this.eye_hover.hierarchy==this.center_element.hierarchy){
			this.eye_hover.enable()
			this.center_element.disable_cascade()
		}
		var deltaX =  - this.eye_hover.center.x
		var deltaY =  - this.eye_hover.center.y

		this.translate(deltaX,deltaY)
		this.center_element = this.eye_hover

		this.render()
	}
	this.on_click =function(x,y){
		if(this.is_dragged){
			this.is_dragged=false
			return
		}
		this.remove_mousedown_element()
		var q = []
		q.push(this.center_element.get_nearest_invisible_parent())
		while(q.length>0){
			var e = q.shift()
			if(e.is_in_area(x,y)){
				if(e.is_disable){
					break
				}
				if(e.hierarchy>2){
					this.dialog(x,y)
				}
				else{
					e.click()
				}
				break
			}
			if(e.is_open){
				for(var i =0;i<e.children.length;i++){
					if(e.children[i].visible){
						q.push(e.children[i])
					}
				}
			}
			
		}
	}

	this.on_hover = function(x,y){
		var q = []
		q.push(this.center_element.get_nearest_invisible_parent())
		var unchange = true
		var hover_e = null
		while(q.length>0){
			var e = q.shift()
			for(var i =0;i<e.children.length;i++){
				if(e.children[i].visible){
					q.push(e.children[i])
				}
			}
			var check_hover_element = e.check_hover(x,y)
			if(check_hover_element!=null){
				// for the multiple hover. choose the top one. and disable the previous one.
				if(hover_e!=null){
					hover_e.unhover()
				}
				hover_e = check_hover_element
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
		this.hover_element = current_node
		if(prev_node==null&&current_node==null){
			//donothing	
		}
		else if((prev_node&&current_node)==null&&(prev_node||current_node)!=null){
			this.render()
		}
		else if(prev_node.toString()!=current_node.toString()){
			this.render()			
		}
		else{
			if(!prev_node.center.equals(current_node.center)){
				this.render()
			}
		}
	}

	this.on_drag = function(x,y){
		this.is_dragged =true
		if(this.mouse_down_element==null){
			return
		}
		var deltaX =x - this.mouse_down_element.center.x
		var deltaY =y - this.mouse_down_element.center.y
		this.translate(deltaX,deltaY)
		this.check_eye()
		var dist = (x-this.framecontrol.x)*(x-this.framecontrol.x) + (y-this.framecontrol.y)*(y-this.framecontrol.y)
		if(dist>300){
			this.framecontrol = new Point(x,y)
			this.render()
		}
	}
	this.check_eye = function(){
		var q = []
		q.push(this.center_element.get_nearest_invisible_parent())
		var min_dist= 9999
		this.eye_hover=null
		while(q.length>0){
			var e = q.shift()
			var dist = e.check_eye()
			if(dist>0){
				if(min_dist>dist){
					min_dist = dist
					this.eye_hover = e
				}
			}
			if(e.is_open){
				for(var i = 0;i<e.children.length;i++){
					if(e.children[i].visible){
						q.push(e.children[i])
					}
				}
			}
		}
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
		var hover_q = []
		var disable_q = []
		var enable_q = []
		var root = this.center_element.get_nearest_invisible_parent()
		var hover_element = null
		q.push(root)
		while(q.length>0){
			var e = q.shift()
			if(e.is_open){
				for(var i = 0 ;i<e.children.length;i++){
					if(e.children[i].visible){
						q.push(e.children[i])
					}
				}
			}
			if(e.is_hovered){
				hover_element = e
			}
			else{
				if(e.is_disable){
					disable_q.push(e)
				}	
				else{
					enable_q.push(e)
				}
			}
		}

		for(var i =0 ;i<disable_q.length;i++){
			var dis_e= disable_q[i]
			if(dis_e.is_open){
				for(var j =0;j<dis_e.children.length;j++){
					if(dis_e.children[j].visible){
						drawLine(dis_e,dis_e.children[j],this.context)
					}
				}
			}
			dis_e.render()
		}

		for(var i =0;i<enable_q.length;i++){
			var en_e = enable_q[i]
			if(en_e.is_open){
				for(var j=0;j<en_e.children.length;j++){
					if(en_e.children[j].visible){
						drawLine(en_e,en_e.children[j],this.context)
					}
				}
			}
			en_e.render()
		}
		if(hover_element!=null){
                if(hover_element.is_open){
                    for(var i =0 ;i<hover_element.children.length;i++){
                        if(hover_element.children[i].visible){
                            drawLine(hover_element,hover_element.children[i],this.context)
                            hover_element.children[i].render()
                        }
                    }
                }
                hover_element.render()      
        }
	}

	this.translate =function(deltaX,deltaY){
		this.translateX+=deltaX
		this.translateY+=deltaY
		this.root.translate(deltaX,deltaY)	

	}
	this.drillDown= function(){
		/*for(var i =0;i<this.root.children.length;i++){
			this.root.children[i].drillDown()
		}*/
		this.root.drillDown()
	}
	this.drillUp = function(){
		this.root.drillUp()
	}

	this.dialog = function(x,y){
		var e = this.canvas.next()
		console.log("dialog")
		e.css(pane_style)
		e.css("left",(x+410)+"px")
		e.css("top",(y+310)+"px")
		e.css("opacity","1")
		e.show()
		e.css("transition","opacity 2.5s ease-in")
		e.css("opacity","0")
		setTimeout(function(){
			e.css("z-index","0")
		},2000)
	}


	this.on_origin = function(){
			
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Point(evt.clientX - rect.left,evt.clientY - rect.top)
}
function writeMessage(p){
	$("#thefuck").text((p.x-400)+" "+(p.y-300))
}
