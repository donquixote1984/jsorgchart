function Element(chart){
	this.text = "Lorem"
    this.image_loaded=false
    this.image =new Image()
    this.chart = chart
    this.children = []
    this.parent =  null
    this.page_size = 10
    this.hierarchy = 0
    this.max_length = 180
    this.is_open = false
    this.visible = false
   	this.page = 0
    this.angle = 0
    this.angle_unit = 0
    this.outer_radius = 0
    this.edge=null
    this.bloom_time = 1
    this.is_disable = false
    this.outer_radius = this.chart.center_length
    this.dragged = false
    this.mouse_down_position = new Point(0,0)
    this.zindex = 0
   	this.init = function(data){
   		this.text= data.text
   		this.image.src = "static/huaban.com/"+data.image
   		this.image.onload = function(){
   			this.image_loaded = true
   		}
   	} 

    this.open = function(){
        var _this = this

        if(this.children.length==0){
             $.getJSON("http://localhost:8000/home/",function(data){
                $.each(data,function(index,value){
                    var e = _this.add_children(value)
                    e.locate(index,data.length)
                })
                if(_this.children.length>_this.page_size){
                    _this.edge = new Edge(_this)
                }
                _this.init_children_visage()
                _this.bloom()
            })
        }
        else{ //da fuck
            if(_this.children.length>_this.page_size){
                _this.edge = new Edge(_this)
            }
            _this.bloom()
        }

    }

    this.init_children_visage = function(){
        for(var i =0;i<this.children.length;i++){
            if(this.children[i].angle<this.children[i].angle_unit/2){
                this.children[i].visible = false
            }
            else if(this.children[i].angle<=2*Math.PI-this.children[i].angle_unit/2&&this.children[i].angle>=this.children[i].angle_unit/2){
                this.children[i].visible = true
            }
            else{
                this.children[i].visible = false
            }
        }
    }

    this.init_url = function(url){
        var _this = this
        $.getJSON(url,function(data){
        	this.init(data)
        })
    }

    this.rotate_children = function(angle){

        for(var i = 0 ; i<this.children.length ; i++){
            this.children[i].rotate(angle)
            if(this.children[i].angle<2*Math.PI-this.children[i].angle_unit/4&&this.children[i].angle>this.children[i].angle_unit/4){
                this.children[i].visible = true
            }
            else{
                this.children[i].visible = false
            }
        }
    }

    this.locate =function(index,length){
        if(this.parent ==null){
            this.center=new Point(0,0)
            return
        }
        var angle_unit = 2*Math.PI/(length>this.page_size?this.page_size:length) 
        this.angle_unit = angle_unit
        this.outer_radius = this.parent.outer_radius*this.chart.line_regression
        if(this.parent.parent == null){
             var _rotation_base = new Point(0,this.chart.center_length)
             if(index == 0){
                this.angle = angle_unit/2
                this.center = _rotation_base.rotate(this.parent.center,angle_unit/2) 
             }
             else{
                this.angle = angle_unit*index+angle_unit/2
                this.center=_rotation_base.rotate(this.parent.center,angle_unit*index+angle_unit/2)
             }
        }
        else{
            var parent_dist = this.parent.center.dist(this.parent.parent.center)
            var _rotation_base = new Point(0,0)
            _rotation_base.x = this.parent.center.x-(this.parent.center.x-this.parent.parent.center.x)*this.chart.line_regression
            _rotation_base.y = this.parent.center.y-(this.parent.center.y-this.parent.parent.center.y)*this.chart.line_regression
           
            if(index ==0){
                this.angle= angle_unit/2
                this.center= _rotation_base.rotate(this.parent.center,angle_unit/2)
            }
            else{
                this.angle = angle_unit*index+angle_unit/2
                this.center= _rotation_base.rotate(this.parent.center,angle_unit*index+angle_unit/2)
            }
        }
    }

    this.close = function(){
        if(this.is_open == false){
            return
        }

        var _this = this
        this.edge = null
        var t_step = 0.1/_this.bloom_time
        var t =0
        var max_walk = _this.chart.bezier.get(_this.bloom_time)
        var walk_rate = _this.radius/max_walk
        _this.is_open=false
        this.timer =  setInterval(function(){
            _this.chart.clear()
            _this.chart.render()
            var k = _this.chart.bezier.get(t)*walk_rate/_this.radius
            for(var i =0 ;i<_this.children.length; i++){
                if(_this.children[i].visible){
                    var center = new Point(
                        _this.children[i].center.x+ (-_this.children[i].center.x+_this.center.x)*k,
                        _this.children[i].center.y+ (-_this.children[i].center.y+_this.center.y)*k
                        )
                    var dist= center.dist(_this.center)
                     if(dist>=_this.radius+_this.children[i].radius){
                        _this.children[i].render(center)
                    }
                    else if(dist<=_this.radius+_this.children[i].radius&&dist>=_this.radius-_this.children[i].radius){
                        _this.children[i].render(center)
                        _this.render()                    
                    }

                    else{
                    }

                }
            }
            t+=t_step
            if(t>=_this.bloom_time){
                clearInterval(_this.timer)
                _this.chart.render()
                return
            }
        },1000/60)
    }
    this.bloom = function(){
        var _this = this
        var t_step = 0.1/_this.bloom_time
        var t =0
        var max_walk = _this.chart.bezier.get(_this.bloom_time)
        var walk_rate = _this.radius/max_walk
        
        this.timer = setInterval(function(){
            _this.chart.render()
             var k = _this.chart.bezier.get(t)*walk_rate/_this.radius
            for(var i =0;i<_this.children.length;i++){
                if(_this.children[i].visible){
                    var center = new Point(
                        _this.center.x+(_this.children[i].center.x - _this.center.x)*k,
                        _this.center.y+(_this.children[i].center.y - _this.center.y)*k
                        )

                    if(center.dist(_this.center)>=_this.radius){
                        _this.children[i].render(center)
                    }
                }
            }
            //_this.render()
            t+=t_step
            if(t>=_this.bloom_time){
                clearInterval(_this.timer)
                _this.is_open=true
                _this.chart.render()
                return
            }
        },1000/60)
        
    }

    this.check_bound = function(){
        var width = this.chart.width/2+this.radius
        var height = this.chart.height/2+this.radius

        if(Math.abs(this.center.x)>width){
            return false
        }
        if(Math.abs(this.center.y)>height){
            return false
        }
        return true
    }

 	this.render = function(center){
        var _center = center
        if(_center == null){
            _center = this.center
        }
        if(this.visible==false){
            return
        }
        if(this.check_bound()==false){
            return
        }
        if(this.edge!=null){
            if(this.edge.right){
                this.edge.hover_right()
            }
            else if(this.edge.left){
                this.edge.hover_left()
            }
            else{
                this.edge.render(_center)
            }
        }
        var context=this.chart.context
        context.save()
        context.beginPath()
        context.fillStyle="#fff"
        context.arc(_center.x,_center.y,this.radius,0,2*Math.PI,true)
        context.fill()
        context.arc(_center.x,_center.y,this.radius,0,2*Math.PI,true)
        var gra = context.createRadialGradient(_center.x, _center.y,this.radius-circle_style.borderWidth,_center.x,_center.y,this.radius)
        gra.addColorStop(0,circle_style.gra_start)
        if(this.is_disable){
            context.globalAlpha=0.2
        }
        if(this.is_hovered){
            gra.addColorStop(1,circle_style.gra_hover_stop)
            context.globalCompositeOperation="source-over"
        }
        else{
            gra.addColorStop(1,circle_style.gra_stop)
        }
        
        context.fillStyle = gra
        context.closePath()
        context.fill()
        context.beginPath()
        context.arc(_center.x,_center.y,this.radius - circle_style.borderWidth,0,2*Math.PI,true)
        context.clip()
        context.drawImage(this.image,_center.x-50,_center.y-50,100,100)
        context.closePath() 
        context.restore() 
    }

    this.add_children = function(data){
        var e = new Element(this.chart)
        e.init(data)
        e.hierarchy = this.hierarchy+1
        e.parent = this
        e.radius = this.radius*this.chart.radius_regression
        e.chart = this.chart
        this.children.push(e)
        return e
    }
    this.hover = function(){
    	this.is_hovered=true
    }
    this.unhover = function(){
      this.is_hovered = false 
    }

    this.check_hover = function(x,y){
        if(this.is_disable){
            this.unhover()
            return null
        }
    	var hover_element = null
    	if(this.edge!=null){
    		if(this.edge.check_hover(x,y)){
    			hover_element = this.edge
    		}
    	}
    	if(this.is_in_area(x,y)){
    		this.hover()
    		hover_element = this
    	}
    	else{
    		this.unhover()
    	}
    	return hover_element
    }


    this.click = function(x,y){
        if(this.is_disable){
            return
        }
        if(this.is_open){
            this.close()
        }
        else{
            this.open()
        }
    }
    this.is_in_area = function(x,y){
        var r = Math.sqrt((this.center.x-x)*(this.center.x-x)+(this.center.y-y)*(this.center.y-y))
        if(r<=this.radius){
            return true
        }
        else{
            return false
        }
    }
    this.mousedown = function(){
        if(this.edge!=null){
            if(this.edge.is_hovered){
                this.edge.mousedown()
            }
        }
    }
    this.mouseup = function(){

    }
    this.toString = function(){
        return "Element"
    }

        this.next_page = function(){
        var _this = this
        var rotate_unit = -Math.PI/20
        var rotate_counter= 0
        clearInterval(this.timer)
        this.timer = setInterval(function(){
            var last_children = _this.last_children()
            if(last_children==null||last_children.visible){
                clearInterval(this.timer)
            }
            else{
                _this.rotate_children(rotate_unit)
                _this.chart.render()                
            }

        },33)
    }
    this.prev_page = function(){
        var _this = this
        var rotate_unit = Math.PI/20
        var rotate_counter= 0
        clearInterval(this.timer)
        this.timer = setInterval(function(){
            var first_children = _this.first_children()
            if(first_children == null||first_children.angle>=first_children.angle_unit/2){
                clearInterval(this.timer)
            }
            else{
                _this.rotate_children(rotate_unit)
                _this.chart.render()                
            }
        },33)
    }

    this.last_children =function(){
        if(this.children.length>0){
            return this.children[this.children.length-1]
        }
        else {
            return null
        }
    }
    this.first_children =function(){
        if(this.children.length>0){
            return this.children[0]
        }
        else {
            return null
        }
    }


    this.rotate = function(angle,center){
        var _center = center
        if(_center==null){
            _center=this.parent.center
        }
        this.center = this.center.rotate(_center,angle)
        for(var i =0;i<this.children.length;i++){
            this.children[i].rotate(angle,_center)
        }
        this.angle += angle
    }


    this.translate = function(deltaX,deltaY){
        this.center.x += deltaX
        this.center.y +=deltaY
        for(var i =0 ;i<this.children.length;i++){
            this.children[i].translate(deltaX,deltaY)
        }
    }
    this.check_eye = function(){
        var dist =this.center.dist(this.chart.eye)
        if(dist<this.radius+this.chart.eye_radius){
            return dist
        }
        return -1
    }
//gotcha:  the parent moves, the children all must be moved and then scaled
    this.drillDown = function(){
        this.radius  = this.radius/this.chart.radius_regression
        this.hierarchy-=1 
        if(this.edge!=null){
            this.edge = new Edge(this)
        }
        var k = this.chart.line_regression
        this.outer_radius = this.outer_radius/k
        var base_rotation = new Point(0,0)
        if(this.parent!=null){
            base_rotation =  new Point(
                        this.center.x - (this.center.x - this.parent.center.x)*this.chart.line_regression,
                        this.center.y - (this.center.y - this.parent.center.y)*this.chart.line_regression
                    )  
        }
  
        for(var i =0;i<this.children.length;i++){
            if(this.parent == null){
                this.children[i].center.x = this.center.x - this.outer_radius*Math.sin(this.children[i].angle)
                this.children[i].center.y = this.center.y + this.outer_radius*Math.cos(this.children[i].angle)
            }
            else{
                this.children[i].center = base_rotation.rotate(this.center,this.children[i].angle)
            }
            this.children[i].drillDown()
        }

    }
    this.drillUp = function(){
        this.hierarchy+=1
        if(this.hierarchy>2){
            if(this.is_open){
                this.is_open=false
            }
        }
        this.radius = this.radius*this.chart.radius_regression
        if(this.edge !=null){
            this.edge = new Edge(this)
        }
        var k = this.chart.line_regression
        this.outer_radius= this.outer_radius*k

        var base_rotation = new Point(0,0)
        if(this.parent!=null){
            base_rotation =  new Point(
                        this.center.x - (this.center.x - this.parent.center.x)*this.chart.line_regression,
                        this.center.y - (this.center.y - this.parent.center.y)*this.chart.line_regression
                    )  
        }
        for(var i = 0 ;i<this.children.length;i++){
            if(this.parent==null){
                this.children[i].center.x = this.center.x - this.outer_radius*Math.sin( this.children[i].angle)
                this.children[i].center.y = this.center.y + this.outer_radius*Math.cos( this.children[i].angle)
            }
            else{

                this.children[i].center = base_rotation.rotate(this.center,this.children[i].angle)
            } 
            this.children[i].drillUp()
        }
    }

    this.get_nearest_invisible_parent = function(){
        var e = this
        while(e.check_bound()&&e.visible){
            if(e.parent==null)
                break;
            e = e.parent
        }
        if(e.parent==null){
            return e
        }
        else{
            return e.parent
        }
    }

    this.disable = function(){
        this.is_disable = true
        if(this.edge!=null){
            this.edge.bak_mousedown = this.edge.mousedown
            this.edge.mousedown = Edge.prototype.mousedown
        }
    }
    this.enable = function(){
        this.is_disable = false
        for(var i =0;i<this.children.length;i++){
            this.children[i].enable()
        }
    }
    this.disable_cascade = function(){
        this.disable()
        if(this.is_open){
            for(var i=0;i<this.children.length;i++){
                this.children[i].disable()
            }
        }
    }
    this.disable_up = function(){
        if(this.parent!=null){
            this.parent.disable()
            if(this.parent.is_open){
                for(var i = 0 ;i<this.parent.children.length;i++){
                   if(this.parent.children[i]!=this) {
                        this.parent.children[i].disable_cascade()
                   }
                }  
            }

        }
    }
    
}
