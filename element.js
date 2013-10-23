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
    this.image = data.image 
    this.chart = chart
    this.center=  new Point(0,0)
    this.children =[]
    this.page_size = 10
    this.hierarchy = 0
    this.max_length = 150
    this.min_length = 50
    this.parent = null
    this.radius = 50 
    this._open = false
    this.pin = false
    this.visible = false
    this.major = false 
    this.page = 0
    this.angle = 0
    this.angle_unit = 0
    this.timer = null
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
                    _this.edge()
                }
                _this.init_children_visage()
                _this.render_children()
            })
        }
        else{ //da fuck
            _this.render_children()
        }
    }

    this.init_children_visage = function(){
        for(var i =0;i<this.children.length;i++){
            if(this.children[i].angle<this.children[i].angle_unit/2){
                this.children[i].visible = false
            }
            else if(this.children[i].angle<2*Math.PI-this.children[i].angle_unit/2&&this.children[i].angle>this.children[i].angle_unit/2){
                this.children[i].visible = true
            }
            else{
                this.children[i].visible = false
            }
        }
    }

    this.init = function(url){
        $.getJSON(url,function(data){
            this.id = data.id
            this.text=data.text
            this.image =data.image
        })
    }
    this.click = function(){
        if(this._open){
            this.close()
            this.open = false
        }
        else{
            this.open()
            this._open = true
        }
    }
    this.request_chart_render=  function(){

    }

    this.rotate_children = function(angle){
        for(var i = 0 ; i<this.children.length ; i++){
            if(this.children[i].angle<this.children[i].angle_unit/2){
                this.children[i].visible = false
            }
            else if(this.children[i].angle<2*Math.PI-this.children[i].angle_unit/2&&this.children[i].angle>this.children[i].angle_unit/2){
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
    this.edge = function(){
        //add the edge for next and prev page
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
        start_children_index = (p-1)*this.page_size
        if(start_children_index>this.children.length){
            return
        }
        var len = this.children.length-start_children_index>this.page_size?page_size:this.children.length-start_children_index
        for(var i =0;i<len;i++){
            this.children[i].render()
            if(this.children[i].visible)
                drawLine(this.center,this.children[i].center,this.chart.context)
        }
    }

    this.next_page = function(){
        _this = this
        this.timer = setInterval(function(){
            _this.rotate_children(Math.PI/60)
            _this.render_children()
        },33)
        this.page+=1
    }
    this.prev_page = function(){

    }

    this.render = function(){
        if(this.visible==false){
            return
        }
        var image= new Image()
        image.src = "static/huaban.com/"+this.image
        var e = this
        image.onload = function(){
            var context=e.chart.context
            context.save()
            context.beginPath()
            context.arc(e.center.x,e.center.y,e.radius,0,2*Math.PI,true)
            var gra = context.createRadialGradient(e.center.x, e.center.y,e.radius-circle_style.borderWidth,e.center.x,e.center.y,e.radius)
            gra.addColorStop(0,circle_style.gra_start)
            gra.addColorStop(1,circle_style.gra_stop)
            context.fillStyle = gra
            context.shadowBlur = circle_style.shadowBlur
            context.shadowColor= circle_style.shadowColor
            context.closePath()
            context.fill()
            context.beginPath()
            context.arc(e.center.x,e.center.y,e.radius - circle_style.borderWidth,0,2*Math.PI,true)
            context.clip()
            context.drawImage(image,e.center.x-50,e.center.y-50,100,100)
            context.closePath() 
            context.restore() 
        }
    }
    this.is_in_area = function(x,y){
        var r = (this.center.x-x)*(this.center.x-x)+(this.y-y)*(this.y-y)
        if(r<this.radius){
            return true
        }
        else{
            return false
        }
    }
}
