
var maxWidth=Math.max(600,Math.min(window.innerWidth,window.innerHeight)-50);

var outerRadius = (maxWidth / 2),
    innerRadius = outerRadius - 100,
    weekWidth=Math.max(400,(innerRadius*2)-250);


var wText,wChords,tText,tChords;

var angleRange=320,
    baseYear=2018,
    maxWeek=1,
    maxYear=1,
    weekOffset=(weekWidth)/(maxYear*52+maxWeek),
    movies,
    w_labels=[],
    w_chords=[],
    t_labels=[],
    t_chords=[],
    topMovieCount=20,
    w_buf_indexByName={},
    w_indexByName = {},
    w_nameByIndex = {},
    t_indexByName = {},
    t_nameByIndex = {},
    t_buf_indexByName={},
    weekly_movies=[],
    toDate_movies=[],
    w_colorByName={},
    t_colorByName={},
    weeks=[],
    weeklyGross=[],
    toDateGross=[],
    moviesGrouped,
    delay=1200,
    refreshIntervalId,
    year= 0,
    week=-1,
    running=true,
    formatNumber = d3.format(",.0f"),
    formatCurrency = function(d) { return "$" + formatNumber(d)},
    wTextUpdate,
    wChordUpdate,
    TextUpdate,
    tChordUpdate;

var toolTip = d3.select(document.getElementById("toolTip"));
var header = d3.select(document.getElementById("head"));
var header1 = d3.select(document.getElementById("header1"));
var header2 = d3.select(document.getElementById("header2"));

var w_fill= d3.scale.ordinal().range(["#00AC6B","#20815D","#007046","#35D699","#60D6A9"]);
var t_fill= d3.scale.ordinal().range(["#EF002A","#B32D45","#9B001C","#F73E5F","#F76F87"]);

var weeksMap=["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", 
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", 
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", 
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"];

d3.select(document.getElementById("bpg"))
    .style("min-width",(outerRadius*2 + 150) + "px");


var playPause=d3.select(document.getElementById("playPause"));

d3.select(document.getElementById("imgDiv"))
    .style("left",((outerRadius-weekWidth/2))+"px");

var svg = d3.select(document.getElementById("svgDiv"))
    .style("width", (outerRadius*2) + "px")
    .style("height", (outerRadius*2+200) + "px")
    .append("svg")
    .attr("id","svg")
    .style("width", (outerRadius*2) + "px")
    .style("height", (outerRadius*2+200) + "px");


var weekly_chord = d3.layout.arc_chord()
    .padding(.05)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)
    .yOffsetFactor(-0.8);

var toDate_chord = d3.layout.arc_chord()
    .padding(.05)
    .yOffsetFactor(0.7)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + 5);


var dGroup = svg.append("g")
    .attr("class","mainLabel")

dGroup.append("text")
    .attr("class","mainLabel")
    .attr("transform", "translate(" + (outerRadius - 20) + ","  + (outerRadius + 30) +")")
    .style("font-size","0px");

dGroup.append("text")
    .attr("class","secondLabel")
    .attr("transform", "translate(" + (outerRadius - 90) + ","  + (outerRadius * 1.15) +")")
    .text("* Cumulative gross of top 100 movies")
    .style("font-size","0px");

var gY=(outerRadius-(innerRadius *.8/2));

gradientGroup =svg.append("g")
    .attr("class","gradient")
    .attr("transform","translate(" + (outerRadius-6) + "," + (gY+70)  + ")" );

gradientGroup.append("rect")
    .attr("height",((outerRadius + innerRadius *.7/2)-gY))
    .attr("width",0)
    .style("fill","url(#gradient1)");

var scaleGroup=svg.append("g")
    .attr("class","weeks")
    .style("cursor","pointer")
    .attr("transform", "translate(" + (outerRadius-weekWidth/2-20) + ","  + 20 + ")");

var wGroup=svg.append("g")
    .attr("class","weekly")
    .attr("transform", "translate(" + outerRadius + "," + (outerRadius+70) + ")");

var tGroup=svg.append("g")
    .attr("class","toDate")
    .attr("transform", "translate(" + outerRadius + "," + (outerRadius+70) + ")");

