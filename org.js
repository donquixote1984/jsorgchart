
var circle_style = {
				innerRadius : 25,
				outerRadius:30,
				gra_start : '#aeaeae',
				gra_stop : '#eaeaea',
				shadowBlur:20,
				shadowColor: '2e2e2e',
				borderWidth:5
		}


test_data =  {
	name:"lorem1",
	text:"lorem1",
	image:"huaban.com/0091cdc19467eb349cbf163c93a0e4f88f623ba2.jpg",
	children:[
		{
			name:"lorem2",
			text:"lorem2",
			image:"huaban.com/0570ec2010d2471d62a7f3e9bc439ea47b9efd20.jpg",
			children:[
				{
					name:"lorem12",
					text:"lorem12",
					image:"huaban.com/e30a5732000184d270213032e3749a14676c0f38.jpg"
				},
				{
					name:"lorem12",
					text:"lorem12",
					image:"huaban.com/e30a5732000184d270213032e3749a14676c0f38.jpg"					
				},
				{
					name:"lorem13",
					text:"lorem13",
					image:"huaban.com/ae250c13c864ff66613b870a5f8dbb4c2933e2a2.jpg"					
				},
				{
					name:"lorem14",
					text:"lorem12",
					image:"huaban.com/d14dffef9959e8cb7bd5ab6ab21c6fea78ca51e9.jpg"					
				},
				{
					name:"lorem14",
					text:"lorem14",
					image:"huaban.com/d14dffef9959e8cb7bd5ab6ab21c6fea78ca51e9.jpg"					
				}
			]
		},
		/*{
			 name:"lorem3",
			 text:"lorem3",
			 image:"huaban.com/0884221e6f3bee813075614b1774543ec7f0c284.jpg"
		},
		{
			name:"lorem4",
			text:"lorem4",
			image:"huaban.com/0cf4b29130de0a07b129666e2494cd7058ce260f.jpg"
		},
		{
			name:"lorem5",
			text:"lorem5",
			image:"huaban.com/1fc0b376d1a0886b8d38a32d537fe78a850a6744.jpg"
		},
		{
			name:"lorem6",
			text:"lorem6",
			image:"huaban.com/49f6f5c8a4a88c0428115eaaa9693ca34c8b234b.jpg"
		},
		{
			name:"lorem7",
			text:"lorem7",
			image:"huaban.com/e34ca009b37f561249d36a61a5a35a2ea57f77cf.jpg"
		},
		{
			name:"lorem8",
			text:"lorem8",
			image:"huaban.com/ebfa385a0e5c8196b639b06f125fdabfa8a13893.jpg"
		},
		{
			name:"lorem9",
			text:"lorem9",
			image:"huaban.com/ece4459783a29bb468dc7ec7adf1ea5393c122c9.jpg"
		},
		{
			name:"lorem10",
			text:"lorem10",
			image:"huaban.com/f68b4fe8a93e51294411c93671e0add896bec918.jpg"
		},
		{
			name:"lorem11",
			text:"lorem11",
			image:"huaban.com/fdc61aaed88784f93ed6ce7ed29d38b5f4aeebe4.jpg"
		},
		{
			name:"lorem11",
			text:"lorem11",
			image:"huaban.com/fdc61aaed88784f93ed6ce7ed29d38b5f4aeebe4.jpg"
		},
		{
			name:"lorem11",
			text:"lorem11",
			image:"huaban.com/fdc61aaed88784f93ed6ce7ed29d38b5f4aeebe4.jpg"
		},*/
	]
}

DEFAULT_DIST =150 
MAX_CHILDREN = 9
DEFAULT_RADIUS = 50 
RADIUS_GRADIENT_RATE = 0.8
DIST_GRADIENT_RATE = 0.5
DIST_DIFF =2 
MAX_HERIACHY =2 
MIN_DIST= 100




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
	this.data = test_data
	this.center_radius = settings.center_radius
	this.center_line_length = settings.center_line_length
	this.root = new Partial()
	this.root.settings = this.settings
	this.page_size=settings.page_size==null?10:settings.page_size
	this.init = function(){
		this.root.parse(this.data)
	}
	this.render = function(){
		console.log("debug log")
			this.root.render(context)
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
