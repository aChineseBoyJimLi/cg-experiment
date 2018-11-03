function Draw(){
    var p = new Point(0,0);
    p = p.TransformAxis();
    var pixel = new Pixel(pixelWidth,p.pX,p.pY);
    pixel.FillPixel("#cccccc");
}



