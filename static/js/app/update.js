function update(y, w) {

    updateWeeks(y, w);

    buildChords(y, w);

   // mainLabel.style("font-size",innerRadius *.05);

    tText = tGroup.selectAll("text")
        .data(t_labels, function (d) {
            return d.label;
        });

    wText = wGroup.selectAll("text")
        .data(w_labels, function (d) {
            return d.label;
        });

    tChords=tGroup.selectAll("path")
        .data(t_chords, function (d) {
            return d.label;
        });

    wChords=wGroup.selectAll("path")
        .data(w_chords, function (d) {
            return d.label;
        });

    var td=toDateGross[y*52+w] //- weeklyGross[y*52+w]))*-1
    var fs=innerRadius *.1;
    td="Week "+(w+1)+":"+formatCurrency(td);

    dGroup.select("text")
        .transition()
        .delay(delay)
        .text(td)
        .attr("transform", "translate(" + (outerRadius - (td.length * fs/2)/2) + ","  + (outerRadius*1.1) +")")
        .style("font-size", fs + "px");

    tText.enter()
        .append("text")
        .attr("class","toDate")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (d.index+1)  + ". " + d.label; })
        .on("mouseover", function (d) { node_onMouseOver(d); })
        .on("mouseout", function (d) {node_onMouseOut(d); })
        .attr("fill-opacity", 1e-6)
        .transition()
        .duration(delay-10)
        .attr("fill-opacity", 1e-6);

    tText.transition()
        .duration(delay-10)
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (d.index+1)  + ". " + d.label; })
        .attr("fill-opacity", 1.0);

    tText.exit()
        .transition()
        .duration(delay / 2)
        .attr("fill-opacity", 1e-6)
        .attr("transform", "translate(0,0)scale(0.01)")
        .remove();

    tChords.enter()
        .append("path")
        .attr("class","chord")
        .style("stroke", function(d) { return d3.rgb(getToDateColor(d.source.index)).darker(); })
        .style("fill", function(d) { return getToDateColor(d.source.index); })
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
        .on("mouseover", function (d) { node_onMouseOver(d); })
        .on("mouseout", function (d) {node_onMouseOut(d); })
        .style("fill-opacity", 1e-6)
        .style("stroke-opacity", 1e-6)
        .transition()
        .duration(delay)
        .style("stroke-opacity", function (d,i) { return Math.max(.85*(topMovieCount-d.index)/topMovieCount,.2);})
        .style("fill-opacity", function (d,i) { return .85*(topMovieCount-d.index)/topMovieCount});

    tChords.transition()
        .duration(delay)
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
        .style("stroke", function(d) { return d3.rgb(getToDateColor(d.source.index)).darker(); })
        .style("fill", function(d) { return getToDateColor(d.source.index); })
        .style("stroke-opacity", function (d,i) { return Math.max(.85*(topMovieCount-d.index)/topMovieCount,.2);})
        .style("fill-opacity", function (d,i) { return .85*(topMovieCount-d.index)/topMovieCount});


    tChords.exit()
        .transition()
        .duration(delay/2)
        .attr("stroke-opacity", 1e-6)
        .attr("fill-opacity", 1e-6)
        .attr("transform", "scale(0.01)")
        .remove();

    wText.enter()
        .append("text")
        .attr("class","weekly")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (d.index+1)  + ". " + d.label; })
        .on("mouseover", function (d) { node_onMouseOver(d); })
        .on("mouseout", function (d) {node_onMouseOut(d); })
        .attr("fill-opacity", 1e-6)
        .transition()
        .duration(delay-10)
        .attr("fill-opacity", 1.0);

    wText.transition()
        .duration(delay-10)
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (d.index+1)  + ". " + d.label; })
        .attr("fill-opacity", 1.0);

    wText.exit()
        .transition()
        .duration(delay / 2)
        .attr("fill-opacity",1e-6)
        .attr("transform", "translate(0,0)scale(0.01)")
        .remove();

    wChords.enter()
        .append("path")
        .attr("class","chord")
        .style("stroke", function(d) { return d3.rgb(getWeeklyColor(d.source.index)).darker(); })
        .style("fill", function(d) { return getWeeklyColor(d.source.index); })
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
        .on("mouseover", function (d) { node_onMouseOver(d); })
        .on("mouseout", function (d) {node_onMouseOut(d); })
        .style("stroke-opacity", 1e-6)
        .style("fill-opacity", 1e-6)
        .transition()
        .duration(delay-10)
        .style("stroke-opacity", function (d,i) { return Math.max(.85*(topMovieCount-d.index)/topMovieCount,.2);})
        .style("fill-opacity", function (d,i) { return .7*(topMovieCount- d.index)/topMovieCount});

    wChords.transition()
        .duration(delay-10)
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
        .style("stroke", function(d) { return d3.rgb(getWeeklyColor(d.source.index)).darker(); })
        .style("fill", function(d) { return  getWeeklyColor(d.source.index); })
        .style("stroke-opacity", function (d,i) { return Math.max(.85*(topMovieCount-d.index)/topMovieCount,.2);})
        .style("fill-opacity", function (d,i) { return .7*(topMovieCount- d.index)/topMovieCount});

    wChords.exit()
        .transition()
        .duration(delay / 2)
        .attr("stroke-opacity", 1e-6)
        .attr("fill-opacity", 1e-6)
        .attr("transform", "scale(0.01)")
        .remove();
}

function updateWeeks(y,w) {

    var weekAxis=scaleGroup.selectAll("g.week") // g.weeks?!!!
        .data(weeks);

    weekEnter= weekAxis.enter()
        .append("g")
        .attr("class","week");

    weekEnter.append("line")
        .attr("x1",function (d,i) {
            return i*weekOffset;
        })
        .attr("x2",function (d,i) { return i*weekOffset; })
        .attr("y1",function (d,i) {
            var ratio=(y*52+w)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 0;
            else if (ratio==1)
                return 4;
            else if (ratio==2)
                return 8;
            else if (ratio==3)
                return 11;
            else if (ratio==4)
                return 14;
            else if (ratio==5)
                return 15;
            else if (ratio==6)
                return 15;
            else
                return 16;

        })
        .attr("y2",22)
        .attr("shape-rendering","crispEdges")
        .style("stroke-opacity", function (d,i) {
            var ratio=(y*52+w)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 1;
            else if (ratio==1)
                return .9;
            else if (ratio==2)
                return .8;
            else if (ratio==3)
                return .7;
            else if (ratio==4)
                return .6;
            else if (ratio==5)
                return .5;
            else if (ratio==6)
                return .4;
            else
                return .3;

        })
        .style("stroke","#000");



    weekEnter.append("text")
        .attr("transform",function (d,i) { return "translate (" + String(i*weekOffset-10) + ",-2)"; })
        .text(function(d,i) { return weeksMap[i % 52]; })
        .style("fill-opacity",function (d,i) { return (i==0) ? 1:0;});

    weekEnter.append("text")
        .attr("transform",function (d,i) { return "translate (" + String(i*weekOffset-10) + ",33)"; })
        .text(function(d,i) {
            // if ((i==0) || (i==51)) {
            //     // return String(baseYear + Math.floor(i/52));
            //     var curr = i+1;
            //     curr = (curr < 10) ? "0"+curr:curr;
            //     return "W" + curr;
            // }
            // else 
            if(((i+1)%4==0)||(i==0)){
                var curr = i+1;
                curr = (curr < 10) ? "0"+curr:curr;
                return String(curr);
            } else
                return "";
        })
        .on("click",function (d) {
            year= Math.floor(d.index/52);
            week=d.index;
            if (running==true) stopStart();
            update(year,week);
            //          console.log("y=" + y + " m=" + m);
        });

    weekUpdate=weekAxis.transition();

    weekUpdate.select("text")
        .delay(delay/2)
        .style("fill-opacity",function (d) {
            if (d.index==(y*52+w)) {
                return 1;
            }
            else
                return 0;
        });

    weekUpdate.select("line")
        .delay(delay/2)
        .attr("y1",function (d,i) {
            var ratio=(y*52+w)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 0;
            else if (ratio==1)
                return 4;
            else if (ratio==2)
                return 8;
            else if (ratio==3)
                return 11;
            else if (ratio==4)
                return 14;
            else if (ratio==5)
                return 15;
            else if (ratio==6)
                return 15;
            else
                return 16;

        })
        .style("stroke-width",function (d,i) {
            var ratio=(y*52+w)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 1.5;
            else
                return 1;
        })
        .style("stroke-opacity", function (d,i) {
            var ratio=(y*52+w)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 1;
            else if (ratio==1)
                return .9;
            else if (ratio==2)
                return .8;
            else if (ratio==3)
                return .7;
            else if (ratio==4)
                return .6;
            else if (ratio==5)
                return .5;
            else if (ratio==6)
                return .4;
            else
                return .3;

        })
        .style("stroke","#000");

}


function getToDateColor(i) {
    var movie=t_nameByIndex[i];
    if (t_colorByName[movie]==undefined) {
        t_colorByName[movie]=t_fill(i);
    }

    return t_colorByName[movie];
}

function getWeeklyColor(i) {
    var movie=w_nameByIndex[i];
    if (w_colorByName[movie]==undefined) {
        w_colorByName[movie]=w_fill(i);
    }

    return w_colorByName[movie];
}
