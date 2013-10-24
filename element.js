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

function Element(data,chart){
    this.id = data.id
    this.text = data.text
    this.image_loaded=false
    this.image =new Image()
    this.image.src = "static/huaban.com/"+data.image
    this.image.onload = function(){
        this.image_loaded = true
    }
    this.chart = chart
    this.center=  new Point(0,0)
    this.children =[]
    this.page_size = 10
    this.hierarchy = 0
    this.max_length = 150
    this.min_length = 50
    this.parent = null
    this.radius = 50 
    this.is_open = false
    this.pin = false
    this.visible = false
    this.major = false 
    this.page = 0
    this.angle = 0
    this.angle_unit = 0
    this.timer = null
    this.is_hovered= false
    this.is_edged = false
    this.edge=null
    this.bloom_time = 1
    this.open = function(){
        var _this = this

        if(this.children.length==0){
             $.getJSON("http://localhost:8000/home/",function(data){
                $.each(data,function(index,value){
                    var e = _this.add_children(value)
                    e.locate(index,data.length)
                })
                if(_this.children.length>_this.page_size){
                    // add edge
                    //_this.edge()
                    _this.is_edged = true
                    _this.edge = new Edge(_this)
                }
                _this.init_children_visage()
                //_this.render_children()
                //_this.close()
                //_this.bloom()
            })
        }
        else{ //da fuck
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

    this.init = function(url){
        var _this = this
        $.getJSON(url,function(data){
            _this.id = data.id
            _this.text=data.text
            _this.image =new Image()
            _this.image.src = "static/huaban.com/"+data.image
            _this.image.onload = function(){
                _this.image_loaded = true
            }
        })
    }
    this.click = function(){
        if(this.is_open){
            this.close()
        }
        else{
            this.open()
        }
    }
    this.request_chart_render=  function(){

    }

    this.rotate_children = function(angle){
        for(var i = 0 ; i<this.children.length ; i++){

            if(this.children[i].angle<this.children[i].angle_unit/2-1){
                this.children[i].visible = false
            }
            else if(this.children[i].angle<2*Math.PI-this.children[i].angle_unit/4&&this.children[i].angle>this.children[i].angle_unit/2){
                this.children[i].visible = true
            }
            else{
                this.children[i].visible = false
            }
            this.children[i].rotate(angle)
        }
    }

    this.rotate = function(angle){
        this.center = this.center.rotate(this.parent.center,angle)
        this.angle += angle
    }

    this.add_children = function(data){
        var e = new Element(data)
        e.hierarchy = this.hierarchy+1
        e.parent = this
        e.radius = this.radius*this.chart.radius_regression
        e.chart = this.chart
        this.children.push(e)
        return e
    }
    this.locate =function(index,length){
        if(this.parent ==null){
            return
        }
        var angle_unit = 2*Math.PI/(length>this.page_size?this.page_size:length) 
        this.angle_unit = angle_unit
        if(this.parent.parent == null){
             var _rotation_base = new Point(0,this.max_length)
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
            var _rotation_base = this.parent.center.multiply(1-this.min_length/parent_dist)
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
    this.render_children = function(p){
        if(p==null){
            p=1
        }
        this.chart.clear()
        start_children_index = (p-1)*this.page_size
        if(start_children_index>this.children.length){
            return
        }
        //var len = this.children.length-start_children_index>this.page_size?this.page_size:this.children.length-start_children_index
        for(var i =0;i<this.children.length;i++){
           if(this.children[i].visible){
                drawLine(this.center,this.children[i].center,this.chart.context)
                this.children[i].render()
            }
        }
        this.is_edged=true
        //var edge = new Edge(this)
        //edge.render()
        this.render()
        this.is_open = true
    }
    this.close = function(){
        if(this.is_open == false){
            return
        }

        var _this = this
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
                    var center = new Point(_this.children[i].center.x-_this.children[i].center.x*k,_this.children[i].center.y-_this.children[i].center.y*k)
                    var dist= center.dist(_this.center)
                     if(dist>=_this.radius+_this.children[i].radius){
                        _this.children[i].render(center)
                    }
                    else if(dist<=_this.radius+_this.children[i].radius&&dist>=_this.radius-_this.children[i].radius){
                        _this.children[i].render(center)
                        _this.render()                    
                    }

                    else{
                        //da fuck
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
            _this.chart.clear()
            _this.chart.render()
             var k = _this.chart.bezier.get(t)*walk_rate/_this.radius
            for(var i =0;i<_this.children.length;i++){
                if(_this.children[i].visible){
                    var center = new Point(_this.children[i].center.x*k,_this.children[i].center.y*k)
                    if(center.dist(_this.center)>=_this.radius){
                        _this.children[i].render(center)
                    }
                    
                }
            }
            _this.render()
            t+=t_step
            if(t>=_this.bloom_time){
                clearInterval(_this.timer)
                _this.is_open=true
                _this.chart.render()
                return
            }
        },1000/60)
        
    }

    this.next_page = function(){
        _this = this
        var rotate_unit = -Math.PI/30
        var rotate_counter= 0
        this.timer = setInterval(function(){
            rotate_counter+=rotate_unit
            if(rotate_counter<-2*Math.PI){
                clearInterval(_this.timer)
            }
            else{
            _this.rotate_children(rotate_unit)
            rotate_counter+=rotate_unit
            _this.render_children()
        }
        },33)
        this.page+=1
    }
    this.prev_page = function(){

    }

    this.render = function(center){
        var _center = center
        if(_center == null){
            _center = this.center
        }
        if(this.visible==false){
            return
        }
        if(this.is_edged){
            if(this.edge.right){
                this.edge.hover_right()
            }
            else if(this.edge.left){
                this.edge.hover_left()
            }
            else{
                this.edge.render()
            }
        }
        var context=this.chart.context
        context.save()
        context.beginPath()
        context.arc(_center.x,_center.y,this.radius,0,2*Math.PI,true)
        var gra = context.createRadialGradient(_center.x, _center.y,this.radius-circle_style.borderWidth,_center.x,_center.y,this.radius)
        gra.addColorStop(0,circle_style.gra_start)
        if(this.is_hovered){
            gra.addColorStop(1,circle_style.gra_hover_stop)
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
    this.render_cascade_without_line = function(){
        
        if(this.is_open&&this.children.length>0){
            
            for(var i =0;i<this.children.length;i++){
                if(this.children[i].visible){
                    //drawLine(this.center,this.children[i].center,this.chart.context)
                    this.children[i].render_cascade_without_line()
                }
            }
        }
        this.render()
    }
    this.render_cascade = function(){
        if(this.is_open&&this.children.length>0){
           for(var i =0;i<this.children.length;i++){
                if(this.children[i].visible){
                    drawLine(this.center,this.children[i].center,this.chart.context)
                    this.children[i].render_cascade()
                }
            } 
        }
        this.render()
    }
    this.is_in_area = function(x,y){
        var r = Math.sqrt((this.center.x-x)*(this.center.x-x)+(this.center.y-y)*(this.center.y-y))
        //alert(r)
        if(r<=this.radius){
            return true
        }
        else{
            return false
        }
    }
    this.hover = function(){
        this.chart.canvas.addClass("cursor")
        this.is_hovered=true
        this.render_cascade_without_line()
    }
    this.unhover = function(){
        if(this.is_hovered==true){
            this.chart.canvas.removeClass("cursor")
            this.is_hovered= false
            this.render_cascade_without_line()
        }

    }
    this.check_hover = function(x,y){
        if(this.is_hover){
            return
        }
        if(this.is_edged){
            if(this.edge.is_in_edge(x,y)){
                if(x>=this.edge.center.x){
                    if(this.edge.right==false){
                        this.edge.mark_right()
                        this.hover()
                    }
                }
                else{
                    if(this.edge.left==false){
                        this.edge.mark_left()
                        this.hover()  
                    }
                }
            }
            else if(this.is_in_area(x,y)){
               if(this.edge.hover=true){
                    this.edge.unmark()
                    this.hover() 
               }
            }
            else{
                this.edge.unmark()
                this.unhover()
            }
        }
        else if(this.is_in_area(x,y)){
            this.hover()
        }
        else{
            this.unhover()
        }
        //this.check_edge(x,y)
        if(this.is_open){
            for(var i =0;i<this.children.length;i++){
               if(this.children[i].visible) {
                    this.children[i].check_hover(x,y)
               }
            }
        }
    }

    this.check_click = function(x,y){
        if(this.is_edged ){
            if(this.edge.is_in_edge(x,y)){
                //turn the page
            }
        }
        if(this.is_in_area(x,y)){
            // the fuck open
            if(this.is_open){
                this.close()
            }
            else{
                this.open()
            }
        }
        if(this.is_open){
            for(var i =0;i<this.children.length;i++){
                if(this.children.visible){
                    this.children[i].check_click(x,y)
                }
            }
        }
    }
}
