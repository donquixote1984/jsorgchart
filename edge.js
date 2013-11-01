function Edge(element){
    this.radius = element.radius*1.2
    this.center = element.center
    this.element = element
    this.right=false
    this.left= false
    this.bak_mousedown= null

    this.render= function(center){
        var _center = center
        if(_center == null){
            _center = this.center
        }
        var context= this.element.chart.context
        context.save()
        context.beginPath()
        context.fillStyle = "#fff"
        context.arc(_center.x,_center.y,this.radius,0,2*Math.PI,true)
        context.fill()

        context.fillStyle = "#336699"
        if(this.element.is_disable){
          context.globalAlpha = 0.3
        }
        context.arc(_center.x,_center.y,this.radius,0,2*Math.PI,true)
        context.fill()
        context.closePath()
        context.restore()
    }
    this.hover_right = function(){
       var context= this.element.chart.context
       context.save()
       context.beginPath()
       context.fillStyle="#336699"
       if(this.element.is_disable){
        context.globalAlpha = 0.3
       }
       context.arc(this.center.x,this.center.y,this.radius,Math.PI/2,3*Math.PI/2,false)
       context.fill()
       context.closePath()
       context.beginPath()
       context.fillStyle = "#775588"
       context.arc(this.center.x,this.center.y,this.radius,Math.PI/2,3*Math.PI/2,true)
       context.fill()
       context.closePath()
       context.restore()
    }
    this.hover_left = function(){
       var context= this.element.chart.context
       context.save()
       context.beginPath()
       context.fillStyle="#775588"
       if(this.element.is_disable){
        context.globalAlpha = 0.3
       }
       context.arc(this.center.x,this.center.y,this.radius,Math.PI/2,3*Math.PI/2,false)
       context.fill()
       context.closePath()
       context.beginPath()
       context.fillStyle = "#336699"
       context.arc(this.center.x,this.center.y,this.radius,Math.PI/2,3*Math.PI/2,true)
       context.fill()
       context.closePath()
       context.restore()
    }
    this.mark_left = function(){
      this.right = false
      this.left = true
      this.is_hovered=true
    }
    this.mark_right = function(){
      this.right=true
      this.left =false
      this.is_hovered=true
    }
    this.unmark = function(){
      this.right=false
      this.left=false
      this.is_hovered=false
    }
   
    this.is_in_edge = function(x,y){
        var dist = (x - this.center.x)*(x-this.center.x) + (y-this.center.y)*(y-this.center.y)
        if(dist>this.element.radius*this.element.radius&&dist<this.radius*this.radius){
          return true
        }
        else{
          return false
        }
    }

    this.click =function(){
        if(this.right==true){
            this.next()
        }
        else if(this.left==true){
            this.prev()
        }
    }
    this.next =function(){
        this.element.next_page()
    }
    this.prev = function(){
        this.element.prev_page()
    }

    this.check_hover = function(x,y){
      if(this.is_in_edge(x,y)){
          if(x>=this.center.x){
              if(this.right==false){
                  this.mark_right()
              }
          }
          else{
              if(this.left==false){
                  this.mark_left()
              }
          }
          this.element.hover()
          return true
      }
      else{
        this.unmark()
        return false
      }
      
    }
    this.mousedown = function(){
        if(this.right){
            this.element.next_page()
        }
        else{
            this.element.prev_page()
        }
    }
    this.toString = function(){
      return "Edge"
    }
}