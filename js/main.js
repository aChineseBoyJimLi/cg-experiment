const pixelWidth = 10;//the size of a pixel
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");

$(function(){
    InitGrid();
    
    var p1 = new Point(1,2).TransformAxis();
    var p = new Pixel(pixelWidth,p1.pX,p1.pY);
    p.FillPixel("#cccccc");
})

/**
 * 初始化网格
 */
function InitGrid(){
    var grid = new Grid(canvas.clientWidth,canvas.clientHeight);
    grid.VerticalLines();
    grid.HorizonLines();
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
        context.strokeStyle = "rgba(65,65,65,0.25)"; 
        for(var i=0;i<this.canvasWidth;i+=pixelWidth) 
        {
            context.moveTo(i,0);
            context.lineTo(i,this.canvasHeight);
        }
        context.stroke();  
    },

    //draw the horizon lines
    HorizonLines:function(){
        context.strokeStyle = "rgba(65,65,65,0.25)"; 
        for(var i=0;i<this.canvasHeight;i+=pixelWidth)
        {
            context.moveTo(0,i);
            context.lineTo(this.canvasWidth,i); 
        }
        context.stroke();  
    },

}

/**
 * Pixel 构造函数，用于绘制像素点
 * size 像素大小
 * x 像素横坐标轴
 * y 像素纵坐标轴
 * FillPixel 填充一个像素点
 */
function Pixel(size,x,y){
    this.pSize = size;
    this.pX = x;
    this.pY = y;
}
Pixel.prototype = {
    // fill a pixel on the grid 
    FillPixel:function(color){
        context.fillStyle = color;
        context.fillRect(this.pX*this.pSize, this.pY*this.pSize, this.pSize, this.pSize);
    }
}

/**
 * Point 点类
 * TransformAxis 从数学坐标轴转向canvas坐标轴
 */
function Point(x,y){
    this.pX = x;
    this.pY = y;
}

Point.prototype.TransformAxis = function(){
    var canvasPoint = new Point;
    canvasPoint.pX = this.pX + (canvas.clientWidth/2)/pixelWidth;
    canvasPoint.pY = (canvas.clientHeight/2)/pixelWidth - this.pY;
    console.log(canvasPoint);
    return canvasPoint;
}
