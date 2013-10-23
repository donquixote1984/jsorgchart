function Edge(element){
    this.radius_append = 10 
    this.radius = element.radius+this.radius_append
    this.center = element.center
    this.element = element
    this.hover= false
    this.right=false
    this.left= false
    this.render= function(){
        var context= this.element.chart.context
        context.save()
        context.beginPath()
        context.fillStyle = "#336699"
        context.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI,true)
        context.fill()
        context.closePath()
        context.restore()
    }
    this.hover_left = function(){
       var context= this.element.chart.context
       context.save()
       context.beginPath()
       context.fillStyle="#336699"
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
    this.hover_right = function(){
       var context= this.element.chart.context
       context.save()
       context.beginPath()
       context.fillStyle="#775588"
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
    this.hover = function(p){
        var dist = (p.x - this.center.x)*(p.x-this.center.x) + (p.y-this.center.y)*(p.y-this.center.y)

        if(dist>this.element.radius*this.element.radius&&dist<this.radius*this.raidus){
            this.hover=  true
            if(p.x>this.center.x){
                this.right= true
                this.hover_right()
            }
            else{
                this.left = true
                this.hover_left()
            }
        }
    }
    this.hoveroff= function(p){
        if(this.hover==true){
            this.hover= false
            this.left=false
            this.right =false
            this.render()
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
}