var myCanvas = document.getElementById('myCanvas');
myCanvas.width = myCanvas.parentElement.clientWidth;
myCanvas.height = myCanvas.parentElement.clientHeight;

var drawBoard = {

    gloaObj:{
        W: myCanvas.clientWidth,
        H: myCanvas.clientHeight,
        ToolW: $('.tool-panel').width(),
        CTX:myCanvas.getContext('2d'), //上下文
        DATA: [],  //用于存储数据
        COLOR: '#f00056',
        LINE: 4,  //线条宽度
        TIMER: null,
        SETTING:false //设置面板是否划出
    },

    init:function(){
        this.DrawLine();
        this.ToolBar();
    },

    //画直线
    DrawLine:function(){
        
        myCanvas.onmousedown = function(ev){
            var ev = ev || event;
            var sx = ev.clientX - drawBoard.gloaObj.ToolW; 
            var sy = ev.clientY;
            var n = drawBoard.gloaObj.DATA.length;

            myCanvas.onmousemove = function(ev){
                var ev = ev || event;
                var ex = ev.clientX - drawBoard.gloaObj.ToolW;
                var ey = ev.clientY;

                drawBoard.gloaObj.DATA[n] = new Object();
                drawBoard.gloaObj.DATA[n].attr = 'line';
                drawBoard.gloaObj.DATA[n].sx = sx;
                drawBoard.gloaObj.DATA[n].sy = sy;
                drawBoard.gloaObj.DATA[n].ex = ex;
                drawBoard.gloaObj.DATA[n].ey = ey;
                drawBoard.gloaObj.DATA[n].w = drawBoard.gloaObj.LINE;
                drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

                //直线绘制时实时渲染
                drawBoard.Render();
            };

            myCanvas.onmouseup = function(){
                
                myCanvas.onmousemove='';
                let p0X=parseInt(drawBoard.gloaObj.DATA[n].sx/pixelWidth);
                let p0Y=parseInt(drawBoard.gloaObj.DATA[n].sy/pixelWidth);
                if(p0Y > drawBoard.gloaObj.H/2/pixelWidth)p0Y += 1; //使直线拟合得更好
                let p1X=parseInt(drawBoard.gloaObj.DATA[n].ex/pixelWidth);
                let p1Y=parseInt(drawBoard.gloaObj.DATA[n].ey/pixelWidth);
                if(p1Y > drawBoard.gloaObj.H/2/pixelWidth)p1Y += 1; //使直线拟合得更好
                var point0 = new Pixel(pixelWidth,p0X,p0Y);
                point0 = point0.TransformBackAxis();
                var point1 = new Pixel(pixelWidth,p1X,p1Y);
                point1 = point1.TransformBackAxis();
                DDALine(point0.pX,point0.pY,point1.pX,point1.pY,drawBoard.gloaObj.DATA[n].c);
            };
            return false;
        }
    },

    //画圆
    DrawCircle:function(){
        myCanvas.onmousedown = function(ev){
            var ev = ev || event;
            var sx = ev.clientX - drawBoard.gloaObj.ToolW; 
            var sy = ev.clientY;
            var n = drawBoard.gloaObj.DATA.length;

            myCanvas.onmousemove = function (ev) {
                var ev = ev || event;
                var ex = ev.clientX - drawBoard.gloaObj.ToolW;
                var ey = ev.clientY;

                var cx = ex - sx;
                var cy = ey - sy;

                var R = Math.sqrt(cx*cx + cy*cy) / 2;

                drawBoard.gloaObj.DATA[n] = new Object();
                drawBoard.gloaObj.DATA[n].attr = 'circle';
                drawBoard.gloaObj.DATA[n].x = cx / 2 + sx;
                drawBoard.gloaObj.DATA[n].y = cy / 2 + sy;
                drawBoard.gloaObj.DATA[n].r = R;
                drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

                drawBoard.Render();
            }
            myCanvas.onmouseup = function () {
                myCanvas.onmousemove = '';
                let p0X = parseInt(drawBoard.gloaObj.DATA[n].x/pixelWidth);
                let p0Y = parseInt(drawBoard.gloaObj.DATA[n].y/pixelWidth);
                let r = parseInt(drawBoard.gloaObj.DATA[n].r/pixelWidth);
                var point = new Pixel(pixelWidth,p0X,p0Y);
                point = point.TransformBackAxis();
                MidPointCircle(point.pX,point.pY,r,drawBoard.gloaObj.DATA[n].c);
            };
            return false;
        }
    },

    //画椭圆
    DrawOval:function(){
        myCanvas.onmousedown = function(ev){
            var ev = ev || event;
            var sx = ev.clientX - drawBoard.gloaObj.ToolW; 
            var sy = ev.clientY;
            var n = drawBoard.gloaObj.DATA.length;

            myCanvas.onmousemove = function(ev){
                var ev = ev || event;
                var ex = ev.clientX - drawBoard.gloaObj.ToolW;
                var ey = ev.clientY;

                var cx = ex - sx;
                var cy = ey - sy;

                drawBoard.gloaObj.DATA[n] = new Object();
                drawBoard.gloaObj.DATA[n].attr = 'oval';
                drawBoard.gloaObj.DATA[n].x = cx / 2 + sx;    //椭圆圆心x
                drawBoard.gloaObj.DATA[n].y = cy / 2 + sy;    //椭圆圆心y
                drawBoard.gloaObj.DATA[n].a = Math.abs(cx)/2; //长半轴
                drawBoard.gloaObj.DATA[n].b = Math.abs(cy)/2; //短半轴
                drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

                drawBoard.Render();
            }
            myCanvas.onmouseup = function(){
                myCanvas.onmousemove = '';
                let p0X = parseInt(drawBoard.gloaObj.DATA[n].x/pixelWidth);
                let p0Y = parseInt(drawBoard.gloaObj.DATA[n].y/pixelWidth);
                let ra = parseInt(drawBoard.gloaObj.DATA[n].a/pixelWidth);
                let rb = parseInt(drawBoard.gloaObj.DATA[n].b/pixelWidth);
                var point = new Pixel(pixelWidth,p0X,p0Y);
                point = point.TransformBackAxis();
                MiddlePointOval(point.pX,point.pY,ra,rb,drawBoard.gloaObj.DATA[n].c);
            }

            return false;
        }
    },

    //画多边形
    DrawPolygon:function(){
        
        var n = drawBoard.gloaObj.DATA.length;
        drawBoard.gloaObj.DATA[n] = new Object();
        drawBoard.gloaObj.DATA[n].attr = 'polygon';
        drawBoard.gloaObj.DATA[n].points = [];
        drawBoard.gloaObj.DATA[n].w = drawBoard.gloaObj.LINE;
        drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

        myCanvas.onmousedown = function(ev){
            ClearPCanvs(); //调用main.js中的清空函数
            var ev = ev || event; 
            var sx = ev.clientX - drawBoard.gloaObj.ToolW; 
            var sy = ev.clientY;
            var p1 = new Pixel(pixelWidth,sx,sy);
            drawBoard.gloaObj.DATA[n].points.push(p1); 
            drawBoard.Render();

            if(drawBoard.gloaObj.DATA[n].points.length > 2){
                var points = [];
                drawBoard.gloaObj.DATA[n].points.forEach(element => {
                    var point = new Pixel(pixelWidth, element.pX, element.pY);
                    point.pX = parseInt(point.pX / pixelWidth);
                    point.pY = parseInt(point.pY / pixelWidth);
                    point = point.TransformBackAxis();
                    // console.log(point);
                    points.push(point);
                    console.log(points);
                });
                PolygonScanConversion(points,"#cccccc");
            }
            myCanvas.onmouseup = function(){
                return;
            }

            return false;
        }
        
    },

    //画裁剪面
    DrawRect:function(){
        myCanvas.onmousedown = function(ev){
            var ev = ev || event;
            var sx = ev.clientX - drawBoard.gloaObj.ToolW;  
            var sy = ev.clientY;
            var n = drawBoard.gloaObj.DATA.length;

            myCanvas.onmousemove = function(ev){
                var ev = ev || event;
                var ex = ev.clientX - drawBoard.gloaObj.ToolW;
                var ey = ev.clientY;

                var cx = ex - sx;
                var cy = ey - sy;

                drawBoard.gloaObj.DATA[n] = new Object();
                drawBoard.gloaObj.DATA[n].attr = 'rect';
                drawBoard.gloaObj.DATA[n].x = sx;
                drawBoard.gloaObj.DATA[n].y = sy;
                drawBoard.gloaObj.DATA[n].w = cx;
                drawBoard.gloaObj.DATA[n].h = cy;
                drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

                drawBoard.Render();
            }

            document.onmouseup = function(){
                myCanvas.onmousemove = '';
                let xmin,xmax,ymin,ymax;
                xmin = drawBoard.gloaObj.DATA[n].x;
                xmax = drawBoard.gloaObj.DATA[n].x + drawBoard.gloaObj.DATA[n].w;
                ymin = drawBoard.gloaObj.DATA[n].y;
                ymax = drawBoard.gloaObj.DATA[n].y + drawBoard.gloaObj.DATA[n].h;
                var pmax = new Pixel(pixelWidth,xmax/pixelWidth,ymax/pixelWidth);
                var pmin = new Pixel(pixelWidth,xmin/pixelWidth,ymin/pixelWidth);
                pmax = pmax.TransformBackAxis();
                pmin = pmin.TransformBackAxis();
                if(pmax.pX < pmin.pX){
                    var tmp = pmax.pX;
                    pmax.pX = pmin.pX;
                    pmin.pX = tmp;
                }
                if(pmax.pY < pmin.pY){
                    var tmp = pmax.pY;
                    pmax.pY = pmin.pY;
                    pmin.pY = tmp;
                }
                console.log(pmin.pX);
                var clip = new Clip(pmin.pX,pmax.pX,pmin.pY,pmax.pY);
                clip.init();
            }

            return false;
        }
    },

    //重绘画板
    EraseAll:function(){
        drawBoard.gloaObj.DATA = [];
        drawBoard.gloaObj.CTX.clearRect(0, 0, this.gloaObj.W, this.gloaObj.H);
        ClearPCanvs(); //调用main.js中的清空函数
    },

    //渲染函数
    Render:function(){
        drawBoard.gloaObj.CTX.clearRect(0, 0, this.gloaObj.W, this.gloaObj.H);
        for(var i=0; i<drawBoard.gloaObj.DATA.length; i++){
            switch (drawBoard.gloaObj.DATA[i].attr) {
                
                case 'line':
                    drawBoard.gloaObj.CTX.beginPath();
                    drawBoard.gloaObj.CTX.moveTo(drawBoard.gloaObj.DATA[i].sx, drawBoard.gloaObj.DATA[i].sy);
                    drawBoard.gloaObj.CTX.lineTo(drawBoard.gloaObj.DATA[i].ex, drawBoard.gloaObj.DATA[i].ey);
                    drawBoard.gloaObj.CTX.closePath();
                    drawBoard.gloaObj.CTX.strokeStyle = drawBoard.gloaObj.DATA[i].c;
                    drawBoard.gloaObj.CTX.lineWidth = drawBoard.gloaObj.DATA[i].w;
                    drawBoard.gloaObj.CTX.stroke();
                    break;

                case 'circle':
                    drawBoard.gloaObj.CTX.beginPath();
                    drawBoard.gloaObj.CTX.arc(drawBoard.gloaObj.DATA[i].x, drawBoard.gloaObj.DATA[i].y, drawBoard.gloaObj.DATA[i].r, 0, 2 * Math.PI, false);
                    drawBoard.gloaObj.CTX.closePath();
                    drawBoard.gloaObj.CTX.strokeStyle = drawBoard.gloaObj.DATA[i].c;
                    drawBoard.gloaObj.CTX.stroke();
                    break;
                
                case 'oval':
                    // canvas 没有内置画椭圆的函数，如果没有，需要定义
                    if (CanvasRenderingContext2D.prototype.ellipse == undefined) {
                        CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
                        this.save();
                        this.translate(x, y);
                        this.rotate(rotation);
                        this.scale(radiusX, radiusY);
                        this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
                        this.restore();
                        }
                    }
                    drawBoard.gloaObj.CTX.beginPath();
                    drawBoard.gloaObj.CTX.ellipse(drawBoard.gloaObj.DATA[i].x, drawBoard.gloaObj.DATA[i].y,drawBoard.gloaObj.DATA[i].a, drawBoard.gloaObj.DATA[i].b,0,0,2*Math.PI,true);
                    drawBoard.gloaObj.CTX.closePath();
                    drawBoard.gloaObj.CTX.strokeStyle = drawBoard.gloaObj.DATA[i].c;
                    drawBoard.gloaObj.CTX.stroke();
                    break;
                
                case 'polygon':
                    
                    var points = drawBoard.gloaObj.DATA[i].points;
                    var len = points.length;
                    drawBoard.gloaObj.CTX.beginPath();
                    if(len > 1){
                        for(var n=1 ; n<len ;n++){
                            
                            drawBoard.gloaObj.CTX.moveTo(points[n-1].pX , points[n-1].pY);
                            drawBoard.gloaObj.CTX.lineTo(points[n].pX , points[n].pY);
                            
                        }
                    }
                    //封口
                    drawBoard.gloaObj.CTX.moveTo(points[len-1].pX,points[len-1].pY);
                    drawBoard.gloaObj.CTX.lineTo(points[0].pX,points[0].pY);
                    drawBoard.gloaObj.CTX.closePath();
                    drawBoard.gloaObj.CTX.strokeStyle = drawBoard.gloaObj.DATA[i].c;
                    drawBoard.gloaObj.CTX.lineWidth = drawBoard.gloaObj.DATA[i].w;
                    drawBoard.gloaObj.CTX.stroke();
                    break;

                case 'rect':
                    drawBoard.gloaObj.CTX.strokeStyle = drawBoard.gloaObj.DATA[i].c;
                    drawBoard.gloaObj.CTX.beginPath();
                    drawBoard.gloaObj.CTX.strokeRect(drawBoard.gloaObj.DATA[i].x, drawBoard.gloaObj.DATA[i].y, drawBoard.gloaObj.DATA[i].w, drawBoard.gloaObj.DATA[i].h);
                    drawBoard.gloaObj.CTX.closePath();
                    drawBoard.gloaObj.CTX.stroke();
                    break;
            }
        }
    },

    //工具栏选择
    ToolBar:function(){
        var that = this;
        var tools = document.getElementsByClassName('tool');
        tools[0].onclick = function(){
            that.ShowTips('画直线，当前算法DDA算法');
            that.DrawLine();
        };
        tools[1].onclick = function(){
            that.ShowTips('画圆，当前算法：DDA算法');
            that.DrawCircle();
        };
        tools[2].onclick = function(){
            that.ShowTips('画椭圆，当前算法：DDA算法');
            that.DrawOval();
        };
        tools[3].onclick = function(){
            that.ShowTips('画多边形，当前算法：边相关扫描线填充算法');
            that.EraseAll();
            that.DrawPolygon();
        };
        tools[4].onclick = function(){
            that.ShowTips('绘制视窗');
            that.DrawRect();
        };
        tools[5].onclick = function(){
            that.ShowSettings();
        };
        tools[6].onclick = function(){
            that.ShowTips('画板已清空');
            that.EraseAll();
        };
    },

    //显示提示框
    ShowTips:function(tip){
        $("#tip .main-tip").text(tip);
        $("#tip").css({"display":"block"});
        $("#tip").animate({opacity:"1",top:"20px"},500);
        setTimeout(function(){
            $("#tip").css({"opacity":"0","top":"10px","display":"none"});
            // $("#tip").empty();
        },1500);
    },

    //显示设置面板
    ShowSettings:function(){
        if(!drawBoard.gloaObj.SETTING){
            $('#settings-panel').css({"display":"block"});
            $('#settings-panel').animate({right:"0vw"});
            
            drawBoard.gloaObj.SETTING = true;
        }
        else{
            $('#settings-panel').animate({right:"-25vw"});
            setTimeout(function(){
                $('#settings-panel').css({"display":"none"});
            },1000)
            
            drawBoard.gloaObj.SETTING = false; 
        }
    }
}