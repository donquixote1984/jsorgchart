function RenderObject(chart){
	this.chart = chart
	this.center=  new Point(0,0)
	this.radius = 35
	this.timer = null
	this.is_hovered= false
	this.mouse_down=false

	this.check_hover = function(){}
	this.check_mousedown = function(){}
	this.check_mouseup = function(){}
	this.check_drag = function(){}
	this.is_in_area = function(){}
	this.check_bound = function(){}
	this.mark_hover = function(){}
}