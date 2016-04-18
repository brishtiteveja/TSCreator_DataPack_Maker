function arrow(p1,p2,size){
	 
	 var ctx = document.querySelector('canvas').getContext('2d');
      var points = edges(ctx,p1,p2);
      if (points.length < 2) return 
      p1 = points[0], p2=points[points.length-1];

      // Rotate the context to point along the path
      var dx = p2.x-p1.x, dy=p2.y-p1.y, len=Math.sqrt(dx*dx+dy*dy);
      ctx.translate(p2.x,p2.y);
      ctx.rotate(Math.atan2(dy,dx));

      // line
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(-len,0);
      ctx.closePath();
      ctx.stroke();

      // arrowhead
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(-size,-size);
      ctx.lineTo(-size, size);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
}