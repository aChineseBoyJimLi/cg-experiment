const pixelWidth = 10; //像素大小
var canvas = document.getElementById('myCanvas');
var drawPanel = document.getElementById('draw-panel');


/**
 * 初始化网格
 */
function InitGrid(){
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    var grid = new Grid(canvas.clientWidth,canvas.clientHeight);
    grid.VerticalLines();
    grid.HorizonLines();
    Axis(canvas.clientWidth,canvas.clientHeight);
}

/**
 * Grid 构造函数，构建网格平面
 * width 网格宽度
 * height 网格高度
 * VerticalLines 绘制网格垂直线
 * HorizonLines 绘制网格水平线
 */
function Grid(width,height) 
{
    this.canvasWidth = width;
    this.canvasHeight = height;
}
Grid.prototype = {
    //draw the vertical lines
    
    VerticalLines:function(){
        let context = canvas.getContext("2d");
        context.strokeStyle = "rgba(65,65,65,0.25)"; 
        for(var i=0;i<this.canvasWidth;i+=pixelWidth) 
        {
            context.beginPath();
            context.moveTo(i,0);
            context.lineTo(i,this.canvasHeight);
            context.closePath();
            context.stroke(); 
        }
    },

    //draw the horizon lines
    HorizonLines:function(){
        let context = canvas.getContext("2d");
        context.strokeStyle = "rgba(65,65,65,0.25)"; 
        for(var i=0;i<this.canvasHeight;i+=pixelWidth)
        {
            context.beginPath();
            context.moveTo(0,i);
            context.lineTo(this.canvasWidth,i); 
            context.closePath();
            context.stroke();  
        }
    }

}

/**
 * Pixel 构造函数，用于绘制像素点
 * size 像素大小
 * x 像素横坐标轴
 * y 像素纵坐标轴
 * FillPixel 填充一个像素点
 * TransformAxis 将数学坐标转换到canvas坐标
 */
function Pixel(size,x,y){
    this.pSize = size;
    this.pX = x;
    this.pY = y;
}
Pixel.prototype = {
    TransformAxis:function(){
        var canvasPoint = new Pixel(pixelWidth,this.pX + (canvas.clientWidth/2)/pixelWidth,(canvas.clientHeight/2)/pixelWidth - this.pY);
        // canvasPoint.pX = this.pX + (canvas.clientWidth/2)/pixelWidth;
        // canvasPoint.pY = (canvas.clientHeight/2)/pixelWidth - this.pY;
        // console.log(canvasPoint);
        return canvasPoint;
    },
    // fill a pixel on the grid 
    FillPixel:function(color){
        let context = canvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(this.pX*this.pSize, this.pY*this.pSize, this.pSize, this.pSize);
    }
}

/**
 * Axis 构造函数，构建坐标轴
 * width 网格一半的宽度，平分网格
 * height 网格一半的高度，平分网格
 * +5 的原因是
 */
function Axis(width,height){
    let context = canvas.getContext("2d");
    context.strokeStyle = "rgba(165,65,75,0.25)"; 
    context.lineWidth = 10;
    context.beginPath();
    //x轴
    context.moveTo(0,    height/2 + 5);
    context.lineTo(width,height/2 + 5); 
    //y轴
    context.moveTo(width/2 + 5,0);
    context.lineTo(width/2 + 5,height); 
    context.closePath();
    context.stroke();  
}

/**
 * Point 点类
 * TransformAxis 从数学坐标轴转向canvas坐标轴
 * 其中网格的坐标系，平分坐标轴
 */
function Point(x,y){
    this.pX = x;
    this.pY = y;
}



/**
 * 当画板尺寸变化时
 */
function Resize(){

    // var clickX;
	var dragging = false;
	var doc = document;
    var divideLine = $("#wrap").find('.divide-line');
    var wrapWidth = $("#wrap").width();
    
	divideLine.bind('mousedown',function(){
            dragging   = true;
            $('body').css('cursor','e-resize');
		}
	);

	doc.onmousemove = function(e){
		if (dragging) {
            var clickX = e.pageX - $('.tool-panel').width(); //鼠标到屏幕左边界的距离-tool-panel的宽度
            if(clickX >  300 && clickX < (wrapWidth - 300)){
                divideLine.css('left',clickX - 7 + 'px');
                divideLine.prev().css('width',clickX + 'px');
                divideLine.next().css('width',wrapWidth - clickX + 'px');
                //当这块部分尺寸变化时，
                InitGrid();
                Draw();
            }
        }
        else{
            return;
        }
	};

	$(doc).mouseup(function(e) {
        dragging = false;
        $('body').css('cursor','crosshair');
        var ev = ev || e;
        ev.cancelBubble = true;
    })

}

