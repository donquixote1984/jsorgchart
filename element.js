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
    this.max_length = 180
    this.parent = null
    this.radius = 35 
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
    this.disable = false
    this.outer_radius = false
    this.is_center = false
    this.mouse_down=false
    this.dragged = false
    this.mouse_down_position = new Point(0,0)
    this.hover_flag=false
    this.origin_center= new Point(-9999,-9999)
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
                _this.bloom()
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

    this.hide = function(){
        for(var i =0;i<this.children.length;i++){
            this.children[i].hide()
        }
        this.visible = false
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
             var _rotation_base = new Point(0,this.chart.center_length)
             this.outer_radius = this.chart.center_length
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
            var _rotation_base = this.parent.center.multiply(1-this.chart.line_regression)
            this.outer_radius = this.parent.outer_radius*this.chart.line_regression
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
    this.scaleOut = function(){
        this.radius = this.radius/this.chart.radius_regression
        for(var i =0;i<this.children.length;i++){
            this.children.center.x = this.center.x + (this.children[i].center.x-this.center.x)*(1-this.chart.line_regression)
            this.children.center.y = this.center.y + (this.children[i].center.y- this.cetner.y)*(1-this.chart.line_regression)
            this.children[i].scale(s)
        }
    }
    this.scaleIn = function(){
        this.radius = this.radius*this.chart.radius_regression
        for(var i =0;i<this.children.length;i++){
            this.children.center.x = this.center.x + (this.children[i].center.x-this.center.x)*(this.chart.line_regression)
            this.children.center.y = this.center.y + (this.children[i].center.y- this.cetner.y)*(this.chart.line_regression)
            this.children[i].scale(s)
        }
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
                    var center = new Point(
                        _this.center.x+(_this.children[i].center.x - _this.center.x)*k,
                        _this.center.y+(_this.children[i].center.y - _this.center.y)*k
                        )

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

    this.max_page = function(){
        var len = this.children.length
        return parseInt(len/this.page_size)+1
    }
    this.last_chidren =function(){
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
    this.next_page = function(){
        var _this = this
        var rotate_unit = -Math.PI/20
        var rotate_counter= 0
        clearInterval(this.timer)
        this.timer = setInterval(function(){
            var last_chidren = _this.last_chidren()
            if(last_chidren==null||last_chidren.visible){
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
        if(this.is_edged){
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
        context.arc(_center.x,_center.y,this.radius,0,2*Math.PI,true)
        var gra = context.createRadialGradient(_center.x, _center.y,this.radius-circle_style.borderWidth,_center.x,_center.y,this.radius)
        gra.addColorStop(0,circle_style.gra_start)
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
  
    this.render_cascade = function(){
        if(this.is_open&&this.children.length>0){
            var q = []
            var hovered_root = null
            q.push(this)
            if(this.is_hovered) {
                hovered_root = this
            }
            while(q.length>0){
                var e  = q.shift()
                    if(e.is_open){
                        for(var i =0;i<e.children.length;i++){
                            if(e.children[i].visible){
                                if(e.children[i].is_hovered&&e.children[i].parent.is_hovered==false){
                                        hovered_root = e.children[i]
                                }
                                    drawLine(e,e.children[i],this.chart.context)
                                q.push(e.children[i])
                                
                            }
                        } 
                    }     
                    if(e.is_hovered==false){
                        e.render()
                    }
                    
            }
            if(hovered_root!=null){
                
                if(hovered_root.is_open){
                    for(var i =0;i<hovered_root.children.length;i++){
                        if(hovered_root.children[i].visible){
                            drawLine(hovered_root,hovered_root.children[i],this.chart.context)
                            hovered_root.children[i].render()                          
                        }

                    }
                }
                hovered_root.render()
            }
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
    this.mark_hover = function(){
        //only one hierarchy
        this.is_hovered = true
        for(var i =0;i<this.children.length;i++){
            if(this.children[i].visible){
               this.children[i].is_hovered=true
            }
        }
    }
    this.hover = function(){
        this.chart.canvas.addClass("cursor")
        this.mark_hover()
    }
    this.unhover = function(){
        if(this.is_hovered==true){
            this.chart.canvas.removeClass("cursor")
            this.is_hovered= false
            for(var i =0;i<this.children.length;i++){
                if(this.children[i].visible){
                    this.children[i].unhover()
                }
            }
            if(this.edge != null)
                this.edge.unmark()
            //this.chart.render()
        }

    }
    this.check_hover = function(x,y){
        var unchange = true
        if(this.is_edged){
            if(this.edge.is_in_edge(x,y)){
                if(x>=this.edge.center.x){
                    if(this.edge.right==false){
                        this.edge.mark_right()
                        this.hover()
                        this.hover_flag = true
                        unchange=false
                    }
                }
                else{
                    if(this.edge.left==false){
                        this.edge.mark_left()
                        this.hover()  
                        this.hover_flag = true
                        unchange=false
                    }
                }
            }
            else if(this.is_in_area(x,y)){
               if(this.edge.hover==true){
                    this.edge.unmark()
                    this.hover() 
                    this.hover_flag=true
                    unchange=false
               }
               else{
                if(this.is_hovered==false){
                    this.hover()
                    this.hover_flag=true
                    unchange=false
                }
               }
            }
            else{
                if(this.edge.hover){
                    this.unhover()
                    this.hover_flag=false
                    unchange=false
                }
                if(this.is_hovered){//&&this.parent!=null&&this.parent.is_hovered==false){
                    if(this.parent!=null&&this.parent.is_hovered){
                        //done nothing
                    }
                    else{
                        this.unhover()
                        this.hover_flag=false
                        unchange=false
                    }

                }
            }
        }
        else if(this.is_in_area(x,y)){
            if(this.is_hovered==false){
                this.hover()
                this.hover_flag=true
                unchange=false
            }
        }
        else{
            if(this.is_hovered){
                if(this.parent!=null&&this.parent.is_hovered){

                }
                else{
                    this.unhover()
                    this.hover_flag=false
                   unchange=false
                }

            }
        }
        //this.check_edge(x,y)
        if(this.is_open){
            for(var i =0;i<this.children.length;i++){
               if(this.children[i].visible) {
                    unchange = unchange & this.children[i].check_hover(x,y)
               }
            }
        }
        return unchange
    }
    this.check_drag = function(x,y){
        var no_dragged = true
        if(this.mouse_down){
            if(x!= this.center.x || y!=this.center.y){
                //drag the fuck
                var deltaX = x-this.center.x 
                var deltaY = y - this.center.y 
                this.chart.translate(deltaX,deltaY)
                no_dragged = false
                this.dragged= true
            }
        }
        if(this.is_open){
            for(var i =0;i<this.children.length;i++){
                no_dragged = no_dragged && this.children[i].check_drag(x,y)
            }
        }
        return no_dragged
    }
    this.check_mousedown = function(x,y){
       if(this.is_edged) {
        if(this.edge.is_in_edge(x,y)){
            if(this.edge.right){
                this.next_page()
            }
            else{
                this.prev_page()
            }
        }
       }
       if(this.is_in_area(x,y)){
            this.mouse_down = true
            this.mouse_down_position = new Point(this.center.x,this.center.y)
       }
       if(this.is_open){
        for(var i =0;i<this.children.length;i++){
            this.children[i].check_mousedown(x,y)
        }
       }
    }
    this.check_mouseup = function(x,y){
        if(this.is_edged) {
            if(this.edge.is_in_edge(x,y)){
                clearInterval(this.timer)
            }
       }
       if(this.is_in_area(x,y)){
            this.mouse_down = false
       }
       if(this.is_open){
        for(var i =0;i<this.children.length;i++){
            this.children[i].check_mouseup(x,y)
        }
       }
       this.mouse_down_position = null
    }
    this.check_click = function(x,y){
         this.mouse_down = false
        if(this.is_in_area(x,y)){
            if(this.center.x!=this.mouse_down_position.x||this.center.y!=this.mouse_down_position.y){
                this.mouse_down_position = null
                return
            }
            this.mouse_down_position = null
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
                if(this.children[i].visible){
                    this.children[i].check_click(x,y)
                }
            }
        }
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

    this.chroot = function(){
        var deltaX = -this.center.x
        var deltaY = -this.center.y
        this.chart.root = this
        this.chart.translate(deltaX,deltaY)
    }
    this.check_eye = function(point,r){
        var p=[]
        p.push(this)
        var nearest=9999
        var eye_node = null
        while(p.length>0){
            var e = p.unshift()
            var dist=e.center.dist(point,r)
            if(dist<nearest){
                nearest=dist
                eye_node = e
            }
            if(e.is_open){
                for(var i =0;i<this.children.length;i++){
                    var chlid = this.children[i]
                    if(child.check_bound()&&child.visible){
                        p.push(child)
                    }
                }
            }

        }
        return eye_node
    }
}
