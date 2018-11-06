const pixelWidth = 10; //像素大小
var bgCanvas = document.getElementById('bgCanvas');
bgCanvas.width = bgCanvas.parentElement.clientWidth;
bgCanvas.height = bgCanvas.parentElement.clientHeight;

/**
 * 初始化网格
 */
function InitGrid(){
    var grid = new Grid(bgCanvas.clientWidth,bgCanvas.clientHeight);
    grid.VerticalLines();
    grid.HorizonLines();
    Axis(bgCanvas.clientWidth,bgCanvas.clientHeight);
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
    this.bgCanvasWidth = width;
    this.bgCanvasHeight = height;
}
Grid.prototype = {
    //draw the vertical lines
    VerticalLines:function(){
        let context = bgCanvas.getContext("2d");
        context.strokeStyle = "rgba(65,65,65,0.25)"; 
        context.beginPath();
        for(var i=0;i<this.bgCanvasWidth;i+=pixelWidth) 
        {
            context.moveTo(i,0);
            context.lineTo(i,this.bgCanvasHeight);
        }
        context.closePath();
        context.stroke(); 
    },

    //draw the horizon lines
    HorizonLines:function(){
        let context = bgCanvas.getContext("2d");
        context.strokeStyle = "rgba(65,65,65,0.25)"; 
        context.beginPath();
        for(var i=0;i<this.bgCanvasHeight;i+=pixelWidth)
        {
            context.moveTo(0,i);
            context.lineTo(this.bgCanvasWidth,i); 
        }
        context.closePath();
        context.stroke();  
    }

}



/**
 * Axis 构造函数，构建坐标轴
 * width 网格一半的宽度，平分网格
 * height 网格一半的高度，平分网格
 * +5 的原因是
 */
function Axis(width,height){
    let context = bgCanvas.getContext("2d");
    context.strokeStyle = "rgba(0,0,0,0.5)"; 
    context.lineWidth = 10;
    context.beginPath();
    //x轴
    context.moveTo(0,    height/2 + 5);
    context.lineTo(width,height/2 + 5); 

    context.moveTo(width,height/2 + 5);
    context.lineTo(width-20,height/2 + 5-20);

    context.moveTo(width,height/2 + 5);
    context.lineTo(width-20,height/2 + 5+20);
    //y轴
    context.moveTo(width/2 + 5,0);
    context.lineTo(width/2 + 5,height); 

    context.moveTo(width/2 + 5,0);
    context.lineTo(width/2 + 5-20,20);

    context.moveTo(width/2 + 5,0);
    context.lineTo(width/2 + 5+20,20);

    context.closePath();
    context.stroke();  
}

/**
 * Point 点类
 * TransformAxis 从数学坐标轴转向bgCanvas坐标轴
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

