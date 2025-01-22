window.onload = function()
{
    var canvas = document.getElementById("background");
    var ctx = canvas.getContext("2d");

    var w = window.innerWidth - 25;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    var numCircles =  100;
    var circles = [];
    
    for(var i = 0; i < numCircles; i++)
    {
        circles.push
        (
            {
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 5 + 2,
                d: Math.random() + 1
            }
        )
    }

    function drawCircles()
    {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "red";
        ctx.beginPath();

        for(var i = 0; i < numCircles; i++)
        {
            var c = circles[i];
            ctx.moveTo(c.x, c.y);
            ctx.arc(c.x, c.y, c.r, 0, Math.PI*2, true);
        }

        ctx.fill();
    }

    setInterval(drawCircles, 25);
}