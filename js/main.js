
// var canvas = document.getElementById('myCanvas');


$(function(){
    // InitGrid();
    
    // var p1 = new Point(1,2).TransformAxis();
    // var p = new Pixel(pixelWidth,p1.pX,p1.pY);
    // p.FillPixel("#cccccc");
})

function Draw(){
    var p = new Point(0,0);
    p = p.TransformAxis();
    var pixel = new Pixel(pixelWidth,p.pX,p.pY);
    pixel.FillPixel("#cccccc");
}



