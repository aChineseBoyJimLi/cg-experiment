//pCanvas 用于填充像素的canvas
var pCanvas = document.getElementById('pCanvas');
pCanvas.width = bgCanvas.parentElement.clientWidth;
pCanvas.height = bgCanvas.parentElement.clientHeight;

//清空填充像素画板
function ClearPCanvs(){
    pCanvas.getContext("2d").clearRect(0, 0, pCanvas.width, pCanvas.height);
}

/**
 * Pixel 构造函数，用于绘制像素点
 * size 像素大小
 * x 像素横坐标轴
 * y 像素纵坐标轴
 * FillPixel 填充一个像素点
 * TransformAxis 将数学坐标转换到bgCanvas坐标
 * TransformBackAxis 将bgCanvas坐标转换到数学坐标
 */

function Pixel(size,x,y){
    this.pSize = size;
    this.pX = x;
    this.pY = y;
}
Pixel.prototype = {
    TransformAxis:function(){
        var bgCanvasPoint = new Pixel(pixelWidth,this.pX + (pCanvas.clientWidth/2)/pixelWidth,(pCanvas.clientHeight/2)/pixelWidth - this.pY);
        // bgCanvasPoint.pX = this.pX + (bgCanvas.clientWidth/2)/pixelWidth;
        // bgCanvasPoint.pY = (bgCanvas.clientHeight/2)/pixelWidth - this.pY;
        // console.log(bgCanvasPoint);
        return bgCanvasPoint;
    },
    TransformBackAxis:function(){
        var CanvasPoint = new Pixel(pixelWidth,this.pX - (pCanvas.clientWidth/2)/pixelWidth,(pCanvas.clientHeight/2)/pixelWidth - this.pY);
        return CanvasPoint;
    },
    // fill a pixel on the grid 
    FillPixel:function(color){
        let context = pCanvas.getContext("2d");
        context.fillStyle = color;
        context.beginPath();
        context.fillRect(this.pX*this.pSize, this.pY*this.pSize, this.pSize, this.pSize);
        context.closePath();
        context.fill();
    }
}


/**
 * 画点
 */
function DrawPixel(x,y,color){
    var pixel = new Pixel(pixelWidth,x,y);
    pixel = pixel.TransformAxis();
    pixel.FillPixel(color);
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
            DrawPixel(x0,y,color);
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
                // 将起点移动到原点
                x=0;
                y=0;
                for(var i=0;i<=Math.abs(dx);i++){
                    DrawPixel(x+x0,parseInt(y+0.5)+y0,color);
                    x+=1; e+=k;
                    if(e>=0){
                        y++; e-=1;
                    }
                }
            }
            //斜率小于0的情况
            else{
                // 将起点移动到原点，并且关于y轴对称
                x=0;
                y=0;
                for(var i=0;i<=Math.abs(dx);i++){
                    DrawPixel(x+x0,-parseInt(y+0.5)+y0,color);
                    x+=1; e-=k;
                    if(e>=0){
                        y++; e-=1;
                    }
                }
            }
        }
        else{
            //斜率大于0的情况
            if(k>=0){
                //将起点移动到远点
                x=0;
                y=0;
                for(var i=0;i<=Math.abs(dy);i++){
                    DrawPixel(y+x0,parseInt(x+0.5)+y0,color);
                    x+=1; e+=1.0/k;
                    if(e>=0){
                        y++; e-=1;
                    }
                }
            }
            //斜率小于0的情况
            else{
                //将起点移动到原点
                x=0;
                y=0;
                for(var i=0;i<=Math.abs(dy);i++){
                    DrawPixel(y+x0,-parseInt(x+0.5)+y0,color);
                    x+=1; e-=1.0/k;
                    if(e>=0){
                        y++; e-=1;
                    }
                }
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
            DrawPixel(x0,y,color);
        }
    }
}

/**
 * Mid-Point 画线算法
 * int x0 起点x坐标
 * int y0 起点y坐标
 * int x1 终点x坐标
 * int y1 终点y坐标
 * string color 像素的颜色
 */
function MidPointLine(x0,y0,x1,y1,color){
    if((x1-x0)!=0){
        var k = parseFloat(y1-y0) / parseFloat(x1-x0); //float类型
        if(Math.abs(k)<=1){
            var a,b,d1,d2,d,x,y; //int类型
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
                a=y0-y1; b=x1-x0; d=2*a+b;
                d1=2*a; d2=2*(a+b);
                x=x0;y=y0;
                DrawPixel(x,y.color);
                while(x<x1){
                    if(d<0){
                        x++;y++;d+=d2;
                    }
                    else{
                        x++;d+=d1;
                    }
                    DrawPixel(x,y,color);
                }
            }
            else{ 
                x0 = -x0; x1=-x1; //关于y轴对称
                // 保证起点的横坐标一定小于终点的横坐标
                if(x0>x1){
                    var tmp = x0;
                    x0 = x1;
                    x1 = tmp;
                    tmp = y0;
                    y0 = y1;
                    y1 = tmp;
                }
                a=y0-y1; b=x1-x0; d=2*a+b;
                d1=2 * a; d2 = 2*(a+b);
                x=x0;y=y0;
                DrawPixel(-x,y,color);
                while(x<x1){
                    if(d<0){
                        x++;y++;d+=d2;
                    }
                    else{
                        x++;d+=d1;
                    }
                    DrawPixel(-x,y,color);
                }
            }
        }
        else{
            var a,b,d1,d2,d,x,y; //int类型
            if(k>0){
                var x0_tmp= y0, y0_tmp=x0, x1_tmp=y1, y1_tmp=x1; //旋转90度
                // 保证x0_tmp一定小于x1_tmp
                if(x0_tmp>x1_tmp){
                    var tmp = x0_tmp;
                    x0_tmp = x1_tmp;
                    x1_tmp = tmp;
                    tmp = y0_tmp;
                    y0_tmp = y1_tmp;
                    y1_tmp = tmp;
                }
                a = y0_tmp - y1_tmp; b=x1_tmp - x0_tmp; d=2*a+b;
                d1 = 2*a; d2 = 2*(a+b);
                x=x0_tmp; y=y0_tmp;
                DrawPixel(y,x,color);
                while(x<x1_tmp){
                    if(d<0){
                        x++; y++; d+=d2;
                    }
                    else{
                        x++; d+=d1;
                    }
                    DrawPixel(y,x,color);
                }
            }
            else{
                var x0_tmp= y0, y0_tmp=-x0, x1_tmp=y1, y1_tmp=-x1; //旋转90度,并关于x轴对称
                // 保证x0_tmp一定小于x1_tmp
                if(x0_tmp>x1_tmp){
                    var tmp = x0_tmp;
                    x0_tmp = x1_tmp;
                    x1_tmp = tmp;
                    tmp = y0_tmp;
                    y0_tmp = y1_tmp;
                    y1_tmp = tmp;
                }
                a = y0_tmp - y1_tmp; b=x1_tmp - x0_tmp; d=2*a+b;
                d1 = 2*a; d2 = 2*(a+b);
                x=x0_tmp; y=y0_tmp;
                DrawPixel(-y,x,color);
                while(x<x1_tmp){
                    if(d<0){
                        x++; y++; d+=d2;
                    }
                    else{
                        x++; d+=d1;
                    }
                    DrawPixel(-y,x,color);
                }
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
            DrawPixel(x0,y,color);
        }
    }
}

/**
 * Mid-Point 画圆算法
 * int x0 圆心坐标
 * int y0 圆心坐标
 * int r  圆半径
 */
function MidPointCircle(x0,y0,r,color){
    var x,y; //int类型
    var d;   //float类型
    x=0; y=r;
    d = 1.25-r;
    CirclePoint8(x,y,x0,y0,color);
    while(x<=y){
        if(d<0){
            d+=2*x+3;
        }
        else{
            d+=2*(x-y)+5;
            y--;
        }
        x++;
        CirclePoint8(x,y,x0,y0,color);
    }
}

/**
 * Bresenham 画圆算法
 */
function BresenhamCircle(x0,y0,r,color){
    var x,y,delta,delta1,delta2,direction; //int类型
    x=0;y=r;
    delta = 2 * (1-r);
    var limit = 0; //int类型
    while(y >= limit){
        CirclePoint4(x,y,x0,y0,color);
        if(delta<0){
            delta1 = 2 * (delta + y) - 1;
            if(delta1 <= 0)direction = 1; //取H点
            else direction = 2;           //取D点
        }
        else if(delta>0){
            delta2 = 2 * (delta - x) - 1;
            if(delta2<0) direction = 2;   //取H点
            else direction = 3;           //取D点
        }
        else
            direction = 2;
        switch(direction){
            case 1:
                x++;
                delta += 2*x+1;
                break;
            case 2:
                x++;
                y--;
                delta += 2*(x-y+1);
                break;
            case 3:
                y--;
                delta += (-2*y+1);
                break;
        }
    }
}

/**
 * 中点画椭圆
 */
function MiddlePointOval(x0,y0,a,b,color){
    var x=a;
    var y=0;

    var taa = a*a;
    var t2aa = 2 * taa;
    var t4aa = 2 * t2aa;

    var tbb = b*b;
    var t2bb = 2*tbb;
    var t4bb = 2*t2bb;

    var t2abb = a * t2bb;
    var t2bbx = t2bb * x;
    var tx = x;

    var d1 = t2bbx * (x-1) + tbb / 2 + t2aa * (1-tbb);
    while(t2bb * tx > t2aa * y){    
        CirclePoint4(x,y,x0,y0,color);
        if(d1<0){
            y += 1;
            d1 = d1 + t4aa * y + t2aa;
            tx = x-1;
        }
        else{
            x -= 1;
            y += 1;
            d1 = d1 - t4bb * x + t4aa * y + t2aa;
            tx = x;
        }
        
    }
    
    var d2 = t2bb * (x*x + 1) - t4bb * x + t2aa * (y * y + y - tbb) + taa / 2;
    while(x>=0){
        CirclePoint4(x,y,x0,y0,color);
        if(d2<0){
            x-=1;
            y+=1;
            d2 = d2 + t4aa * y - t4bb * x + t2bb;
        }
        else{
            x-=1;
            d2 = d2 - t4bb * x + t2bb;
        }
    }
    
}

/**
 * 八对称画圆
 * x0,y0 关于远点平移的坐标
 */
function CirclePoint8(x,y,x0,y0,color){
    DrawPixel(x + x0,y + y0,color);  
    DrawPixel(-x + x0,y + y0,color);
    DrawPixel(x + x0,-y + y0,color);  
    DrawPixel(-x + x0,-y + y0,color); 
    DrawPixel(y + x0,x + y0,color);  
    DrawPixel(y + x0,-x + y0,color);
    DrawPixel(-y + x0,x + y0,color);  
    DrawPixel(-y + x0,-x + y0,color); 
}

/**
 * 四对称画圆 
 * x0,y0 关于远点平移的坐标
 */
function CirclePoint4(x,y,x0,y0,color){
    DrawPixel(x+x0,y+y0,color);
    DrawPixel(x+x0,-y+y0,color);
    DrawPixel(-x+x0,y+y0,color);
    DrawPixel(-x+x0,-y+y0,color);
}

/**
 * 边相关的扫描线转换算法
 * points 多边形的顶点集合
 */
function PolygonScanConversion(points,color){
    // points.forEach(element => {
    //     DrawPixel(element.pX,element.pY,"#cccccc");
    // });
    var net = new NETTable(points);
    net.init();

    var aet = new AETTable(net,color);
    aet.init();
    
}

/**
 * 新编表类(NET)
 * points   多边形的顶点，未做任何操作顶点序列
 * vertex   多边形的顶点，按y排序后的数组
 * linklist 纵向扫描线链表，每个节点存储两条数据：每条扫描线的ymin；指向一个桶列
 * init()     初始化新编表
 * SortByY()  以多边形的y坐标由小到大排序，采用选择排序算法
 * InitLinkList() 初始化纵向扫描线链表
 * FindBucketList() 给定一个扫描线的y值，得到它的新编表桶列
 * GetYMax() 获得多边形的ymax
 * GetYMin() 获得多边形的ymin
 */
function NETTable(points){
    this.points = [];
    this.vertex = [];
    this.linklist = [];
    //数组的深拷贝
    points.forEach(elem => {
        this.points.push(elem);
        this.vertex.push(elem);
    })
}
NETTable.prototype = {
    init:function(){
        this.SortByY();
        this.Log();
        this.InitLinkList();
    },
    SortByY:function(){
        var len = this.vertex.length;
        var minIndex, temp;
        for(var i=0;i<len-1;i++){
            minIndex=i;
            for(var j=i+1;j<len;j++){
                if(this.vertex[j].pY<this.vertex[minIndex].pY){
                    minIndex = j;
                }
            }
            temp = this.vertex[i];
            this.vertex[i] = this.vertex[minIndex];
            this.vertex[minIndex] = temp;
        }
    },
    InitLinkList:function(){
        this.vertex.forEach((elem,index)=>{
            var scanliney = elem.pY;     //扫描线的y值
            var listnode = new Object(); //每个节点实例
            listnode.Y = scanliney;      //设置节点的y值
            var bucketlist = this.FindBucketList(scanliney); //桶列    
            listnode.bucketList = bucketlist; //每个节点的桶列
            this.linklist[index] = listnode;  //将节点压入链表
        });
    },
    FindBucketList:function(lineY){
        var bucketlist = [];
        var index;  //在points列中，顶点在扫描线y=lineY上的点的下标
        var len = this.points.length;
        for(var i=0;i<len;i++){
            if(this.points[i].pY == lineY){
                index = i;
            }
        }
        var pointleft,pointright; //与交点相邻的左右两个点
        if(index==len-1){
            pointleft = this.points[index-1];
            pointright =  this.points[0];
        }
        else if(index==0){
            pointleft = this.points[len-1]
            pointright =  this.points[index+1];
        }
        else{
            pointleft = this.points[index-1];
            pointright =  this.points[index+1];
        }
        //得到桶列
        if(pointleft.pY > lineY){
            var deltax = (pointleft.pX-this.points[index].pX)/(pointleft.pY-lineY);
            var bucket = new Bucket(lineY,this.points[index].pX,deltax,pointleft.pY,null);
            bucketlist.push(bucket);
        }
        if(pointright.pY > lineY){
            var deltax = (pointright.pX-this.points[index].pX)/(pointright.pY-lineY);
            var bucket = new Bucket(lineY,this.points[index].pX,deltax,pointright.pY,null);
            bucketlist.push(bucket);
        }
        //对桶列按deltax的大小进行排序
        if(bucketlist.length == 2){
            if(bucketlist[0].ymax > bucketlist[1].ymax){
                var temp = bucketlist[0];
                bucketlist[0] = bucketlist[1];
                bucketlist[1] =temp;
            }
            if(bucketlist[0].ymax == bucketlist[1].ymax){
                if(bucketlist[0].deltax > bucketlist[1].deltax){
                    temp = bucketlist[0];
                    bucketlist[0] = bucketlist[1];
                    bucketlist[1] =temp;
                }
            }
            bucketlist[0].nextBucket = bucketlist[1];
        }
        return bucketlist;
    },
    GetYMax:function(){
        var len = this.linklist.length;
        return this.linklist[len-1].Y;
    },
    GetYMin:function(){
        return this.linklist[0].Y;
    },
    Log:function(){
        console.log(this.points);
        console.log(this.vertex);
        console.log(this.linklist);
    }
}
/**
 * 桶类（Bucket），对应覆盖多边形的每一条边
 * scanLine 扫描线
 * x 扫描线与边交点的横坐标
 * deltax 扫描线递增1，该扫描线与边界交点横坐表增量
 * ymax 扫描线与边交线的最大纵坐标
 * nextBucket 下一个桶
 */
function Bucket(line,x,deltax,ymax,bucket){
    this.scanLine = line;
    this.x = x;
    this.deltax = deltax;
    this.ymax = ymax;
    this.nextBucket = bucket;
}

/**
 * 活动编表类（AET）
 * scanlineY 扫描线的y值
 * net 该多边形的NET表
 * aet 由该扫描线得到的活性编表
 * GetAET() 得到活性编表的算法
 * FillPolygon() 由活性编表扫描转换得到多边形
 */
function AETTable(net,color){
    this.net = net;
    this.aet = [];
    this.color = color;
}
AETTable.prototype = {
    init:function(){
        this.GetAET();
        this.Log();
        // this.FillPolygon();
    },
    GetAET:function(){
        var ymax = this.net.GetYMax();
        var ymin = this.net.GetYMin();
        var index = 0; //跟踪当前的数组下标
        for(var i=ymin;i<ymax;i++){

            var bucketlist = [];
            if(i == ymin){ //第一条扫描线，直接从net表中取桶
                this.net.linklist[0].bucketList.forEach(elem=>{
                    bucketlist.push(elem);
                })
            }
            else{
                this.aet[index-1].bucketList.forEach(elem=>{ //通过上一条扫描线上的交点求出这一条扫描线上的交点
                    if(elem.ymax != i){             //如果上一个交点的ymax <= 扫描线的y值，则这个点将被忽略不计
                        var x = elem.x+elem.deltax; //该扫描线交点的x值是上一个交点的x值减去x的增量
                        var deltax = elem.deltax;
                        var ymax = elem.ymax;
                        var bucket = new Bucket(i,x,deltax,ymax,null);
                        bucketlist.push(bucket);
                    } 
                });

                this.net.linklist.forEach(elem=>{ //NET 在该扫描线上是否有记录点
                    if(elem.Y == i){
                        elem.bucketList.forEach(elem=>{
                            bucketlist.push(elem);
                        })
                    }
                });
                
            }

            //排序
            //使用选择排序为list排序，ymax由小到大，相同ymax，deltax由小到大
            for(var a=0;a<bucketlist.length;a++){ 
                var minIndex, temp;
                minIndex=a;
                for(var b=a+1;b<bucketlist.length;b++){
                    if(bucketlist[b].x < bucketlist[minIndex].x){
                            minIndex = b;
                    }
                }
                temp = bucketlist[a];
                bucketlist[a] = bucketlist[minIndex];
                bucketlist[minIndex] = temp;
            }
            this.FillPolygon(bucketlist);
            var aetnode = new Object(); //AET表每个节点的实例
            aetnode.Y = i;
            aetnode.bucketList = bucketlist;
            this.aet.push(aetnode);
            index++;
        }
    },
    FillPolygon:function(list){
        for(let i=0; i<list.length; i++){
            if((i+1)%2 == 0){
                var left = list[i-1].x + 0.5;
                var right = list[i].x;
                var y = list[i].scanLine
                for(var j=left;j<=right;j++){
                    DrawPixel(j,y,this.color);
                }
            }
        }
    },
    Log:function(){
        console.log(this.aet);
    }
}

function Draw(){
    // var p1 = new Pixel(pixelWidth,2,7);
    // var p2 = new Pixel(pixelWidth,5,5);
    // var p3 = new Pixel(pixelWidth,11,8);
    // var p4 = new Pixel(pixelWidth,11,3);
    // var p5 = new Pixel(pixelWidth,5,1);
    // var p6 = new Pixel(pixelWidth,2,2);
    var p1 = new Pixel(pixelWidth,-3,8);
    var p2 = new Pixel(pixelWidth,6,-5);
    var p3 = new Pixel(pixelWidth,9,4);
    var p4 = new Pixel(pixelWidth,13,1);
    var p5 = new Pixel(pixelWidth,15,12);
    var points = [p1,p2,p3,p4,p5];
    PolygonScanConversion(points);
}