
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
	this.radius_regression = 0.75
	this.page_size=settings.page_size==null?10:settings.page_size
	this.bezier =new KeySpline(0.19,0.64,0.35,0.76)
	this.init = function(){
		var _chart= this
		$.getJSON("http://localhost:8000/first/",function(data){
			_chart.root = new Element(data,_chart)
			_chart.root.visible=true
			_chart.root.render()
			_chart.root.open()
			_chart.init_event()
		})
		
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
		this.init_dblclick()
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
			_this.root.check_mousedown(p.x-400,p.y-300)
		})
	}
	this.init_mouseup = function(){
		var _this = this
		this.canvas.mouseup(function(e){
			var p =getMousePos(this,e)
			_this.root.check_mouseup(p.x-400,p.y-300)
		})
	}
	this.init_hover  =function(){
		var _this =this
		this.canvas.mousemove(function(e){
			var p = getMousePos(this,e)
			 writeMessage(p)
			if(!_this.root.check_hover(p.x-400,p.y-300)){
				_this.render()

			}
		})
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
		this.root.render_cascade()
	}

	this.chroot = function(element){
		this.root = element
		this.element.chroot()	
	}
	this.translate =function(deltaX,deltaY){
		this.root.translate(deltaX,deltaY)	
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Point(evt.clientX - rect.left,evt.clientY - rect.top)
}
function writeMessage(p){
	$("#thefuck").text((p.x-400)+" "+(p.y-300))
}