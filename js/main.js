function Draw(){
    var p1 = new Point(-5,6);
    var p2 = new Point(14,6);
    // DDALine(p1.pX,p1.pY,p2.pX,p2.pY,"#cccccc");
    Bresenhamline(p1.pX,p1.pY,p2.pX,p2.pY,"#cccccc");
}


/**
 * DDA 画线算法
 * int x0 起点x坐标
 * int y0 起点y坐标
 * int x1 终点x坐标
 * int y1 终点y坐标
 * string color 像素的颜色
 */
function DDALine(x0,y0,x1,y1,color){
    var dx = 0.0, dy=0.0, k=0.0, y=0.0;//float类型
    dx = x1 - x0;
    dy = y1 - y0;
    //斜率存在
    if(dx != 0){
        k = dy/dx;
        //斜率小于1，不用对称，直接画
        if(Math.abs(k)<=1){
            // 保证起点的横坐标一定小于终点的横坐标
            if(x0>x1){
                var tmp = x0;
                x0 = x1;
                x1 = tmp;
                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            y=y0;
            for(var x=x0;x<=x1;x++){
                var pixel = new Pixel(pixelWidth,x,parseInt(y+0.5));
                pixel = pixel.TransformAxis();
                pixel.FillPixel(color);
                y += k;
            }
        }
        //斜率大于1，将原直线关于y=x对称计算，再对称回去，画线
        else{
            // 保证起点的纵坐标小于终点的纵坐标
            if(y0>y1){
                var tmp = x0;
                x0 = x1;
                x1 = tmp;
                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            y=x0;//关于y=x对称，交换x，y的值
            for(var x=y0;x<=y1;x++){
                console.log(x);console.log(y);
                var pixel = new Pixel(pixelWidth,y,parseInt(x+0.5)); //画直线的时候交换回去
                pixel = pixel.TransformAxis();
                pixel.FillPixel(color);
                y += 1.0/k; 
            }
        }
    }
    //斜率不存在
    else{
        if(y0>y1){
            var tmp = x0;
            x0 = x1;
            x1 = tmp;
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }
        for(var y=y0;y<=y1;y++){
            var pixel = new Pixel(pixelWidth,x0,y);
            pixel.FillPixel(color);
        }
    }
}


/**
 * Bresenham 画线算法
 * int x0 起点x坐标
 * int y0 起点y坐标
 * int x1 终点x坐标
 * int y1 终点y坐标
 * string color 像素的颜色
 */
function Bresenhamline(x0,y0,x1,y1,color){
    var x=0,y=0,dx=0,dy=0; //int类型
    var k=0.0,e=0.0;       //float类型
    dx=x1-x0;
    dy=y1-y0;
    //斜率存在
    if(dx!=0){
        k=parseFloat(dy/dx);
        e=-0.5;
        //斜率小于1的时候
        if(Math.abs(k)<=1.0){
            //斜率大于0的情况
            if(k>=0){
                // 保证起点的横坐标一定小于终点的横坐标
                if(x0>x1){
                    var tmp = x0;
                    x0 = x1;
                    x1 = tmp;
                    tmp = y0;
                    y0 = y1;
                    y1 = tmp;
                }
                x=x0;
                y=y0;
                for(var i=0;i<=Math.abs(dx);i++){
                    var pixel = new Pixel(pixelWidth,x,parseInt(y+0.5));
                    pixel = pixel.TransformAxis();
                    pixel.FillPixel(color);
                    x+=1; e+=k;
                    if(e>=0){
                        y++; e-=1;
                    }
                }
            }
            //斜率小于0的情况
            else{

            }
        }
        else{
            
            //斜率大于0的情况
            if(k>=0){
                // 保证起点的纵坐标一定小于终点的横坐标
                if(y0>y1){
                    var tmp = x0;
                    x0 = x1;
                    x1 = tmp;
                    tmp = y0;
                    y0 = y1;
                    y1 = tmp;
                }
                x=y0;
                y=x0;
                for(var i=0;i<=Math.abs(dy);i++){
                    console.log(x);console.log(y);
                    var pixel = new Pixel(pixelWidth,y,parseInt(x+0.5));
                    pixel = pixel.TransformAxis();
                    pixel.FillPixel(color);
                    x+=1; e+=1.0/k;
                    if(e>=0){
                        y++; e-=1;
                    }
                }
            }
            //斜率小于0的情况
            else{

            }
        }
    }
    //斜率不存在
    else{
        if(y0>y1){
            var tmp = x0;
            x0 = x1;
            x1 = tmp;
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }
        for(var y=y0;y<=y1;y++){
            var pixel = new Pixel(pixelWidth,x0,y);
            pixel.FillPixel(color);
        }
    }
}

/**
 * Mid-Point 画线算法
 */
function MidPointLine(x0,y0,x1,y1,color){

}

/**
 * Mid-Point 画圆算法
 */
function MidPointCircle(x0,y0,r,color){

}

/**
 * Bresenham 画圆算法
 */
function MidPointCircle(x0,y0,r,color){

}

