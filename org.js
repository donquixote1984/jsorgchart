
var circle_style = {
				innerRadius : 25,
				outerRadius:30,
				gra_start : '#aeaeae',
				gra_stop : '#eaeaea',
				shadowBlur:20,
				shadowColor: '2e2e2e',
				borderWidth:5
		}

function OrgChart(settings){
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
	this.radius_regression = 0.8
	this.page_size=settings.page_size==null?10:settings.page_size
	this.init = function(){
		var _chart= this
		$.getJSON("http://localhost:8000/first/",function(data){
			this.root = new Element(data,_chart)
			this.root.render()
			this.root.open()
			//this.root.next_page()
			//alert(data)
		})
	}
	this.render = function(){
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
