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
    this.open = function(){
        var _this = this
        if(this.children.length==0){
             $.getJSON("http://localhost:8000/home/",function(data){
                $.each(data,function(index,value){
                    var e = _this.add_children(value)
                    e.center = _this.locate(index,data.length)
                })
                if(_this.children.length>_this.page_size){
                    // add edge
                    _this.edge()
                }
                _this.render_children()
            })
        }
        else{ //da fuck
            _this.render_children()
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
    this.close = function(){

    }
    this.add_children = function(data){
        var e = new Element(data)
        e.hierarchy = this.hierarchy+1
        e.parent = this
        e.chart = this.chart
        this.children.push(e)
        return e
    }
    this.edge = function(){
        //add the edge for next and prev page
    }
    this.locate =function(index,length){
        var angle_unit = 2*Math.PI/(length>this.page_size?this.page_size:length) 
        if(this.parent == null){
             var _rotation_base = new Point(0,this.max_length)
             if(index == 0){
                return _rotation_base.rotate(this.center,angle_unit/2) 
             }
             else{
                return _rotation_base.rotate(this.center,angle_unit*index+angle_unit/2)
             }
            
        }
        else{
            var parent_dist = this.center.dist(this.parent.center)
            var _rotation_base = this.center.multiply(1-this.min_length/parent_dist)

            if(index ==0){
                return _rotation_base.rotate(this.center,angle_unit/2)
            }
            else{
                return _rotation_base.rotate(this.center,angle_unit*index+angle_unit/2)
            }
        }
    }
    this.render_children = function(){
        var len = this.children.length>this.page_size?page_size:this.children.length
        for(var i =0;i<len;i++){
            this.children[i].render()
        }
    }

    this.next_page = function(){

    }

    this.render = function(){
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
