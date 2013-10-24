
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
			//var edge = new Edge(this.root)
			_chart.root.open()
			//_chart.root.close()
			//edge.render_edge()
			//this.root.render_children()
			//this.root.next_page()
			//alert(data)
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
	}
	this.init_click = function(){
		var _this = this
		this.canvas.click(function(e){
			var p = getMousePos(this,e)
			_this.root.check_click(p.x-400,p.y-300)
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
	this.render= function(){
		this.clear()
		this.root.render_cascade()
	}
	/*this.parse = function(data,index,parent){
		var p = new Partial()
		p.parseData(data)
		p.context = this.context
		p.parent = parent
		p.index =index
		p.chart= this
		if(p.parent!=null){
			p.heriachy=p.parent.heriachy+1
		}	
		if(p.index<=this.page_size){
			p.generate_render()	
		}
		else {

				p.partial_render = p.parent.children[p.index-this.page_size].partial_render
				p.partial_render.data = data
				p.partial_render.partial = p
		}
		p.length =0
		if(p.heriachy>=this.init_heriachy-1)
			return p

		

		if(data.children!=null){
			p.length = data.children.length
			for(var i =0;i<data.children.length;i++){
				var child = this.parse(data.children[i],i,p)
				p.children.push(child)
			}
		}
		return p

	}*/
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Point(evt.clientX - rect.left,evt.clientY - rect.top)
}
function writeMessage(p){
	$("#thefuck").text((p.x-400)+" "+(p.y-300))
}