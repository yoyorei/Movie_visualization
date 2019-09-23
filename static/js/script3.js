d3.csv('./static/data/movies_df.csv', function (data) {
  var body = d3.select('body')

  var selectData = [ { "text" : "Movies" },
                     { "text" : "Metascore" },
                     { "text" : "Tomatometer" },
                     { "text" : "IMDb" },
                   ]

  // Select X-axis Variable

  // var span = body.append('span')
  //   .text('Select Option: ')
  // var yInput = body.append('select')
  //     .attr('id','xSelect')
  //     .on('change',xChange)
  //   .selectAll('option')
  //     .data(selectData)
  //     .enter()
  //   .append('option')
  //     .attr('value', function (d) { return d.text })
  //     .text(function (d) { return d.text ;})
  // body.append('br')

  // Select Y-axis Variable

  var span = body.append('span')
      .text('Select Option: ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')
  
  // Variables
  var body = d3.select('body')
    var margin = { top: 60, right: 90, bottom: 60, left: 60 };
    var h = 960 - margin.top - margin.bottom
	var w = 1600 - margin.left - margin.right

	// Scales
  var colorScale = d3.scale.category20()
  var xScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.Tomatometer })]),
    	d3.max([0,d3.max(data,function (d) { return d.Tomatometer })])
        ])
    .range([0,w])
    .nice(20)

    var xScale2 = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.Tomatometer })]),
    	d3.max([0,d3.max(data,function (d) { return d.Tomatometer })])
        ])
    .range([0,w])

  var yScale = d3.scale.linear()
    .domain([0, d3.max(data, d => d.Metascore)])  
    .range([h,0])
    .nice(10)
    var yScale2 = d3.scale.linear()
    .domain([0, d3.max(data, d => d.IMDb)])
    .range([h,0])
    .nice(10)
  
    // SVG
    
	var svg = body.append('svg')
	    .attr('height',h + margin.top + margin.bottom)
	    .attr('width',w + margin.left + margin.right)
	  .append('g')
        .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
    
    svg.append("rect")
        .attr("width", w )
        .attr("height", h )
        .attr("fill", "black")

	// X-axis
	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .ticks(20)
      .orient('bottom')
      

    var xAxis2 = d3.svg.axis()
	  .scale(xScale2)
	  .ticks(0)
      .orient('top')  
      
  // Y-axis
	var yAxis = d3.svg.axis()
	  .scale(yScale)
	  .ticks(20)
      .orient('left')
      
      
    var yAxis2 = d3.svg.axis()
	  .scale(yScale2)
      .ticks(20)
    .orient('right')
    
  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d.Tomatometer) })
      .attr('cy',function (d) { return yScale(d.Metascore) })
      .attr('cy',function (d) { return yScale2(d.IMDb) })
      .attr('r','4')
      .attr('stroke','#cdcdcd')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(i) })
      .attr("opacity", ".6")
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d.Movie_title +
                           '\nYear: ' + (d.Year) +
                           '\nRotten Tomatoes: ' + (d.Tomatometer) +
                           '\nMetascore: ' + (d.Metascore) +
                           '\nIMDb: ' + (d.IMDb) })
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .attr('fill', '#cdcdcd')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y', 60)
      .attr('x',750)
      .style('text-anchor','middle')
      .attr('fill', '#cdcdcd')
      .attr('stroke-width',3)
      .text('Rotten Tomatoes')

   svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(-180,' + h + ')')
      .call(xAxis2)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y', -875)
      .attr('x',900)
      .style('text-anchor','middle')
      .attr('fill', '#cdcdcd')
      .style("font-size", "22px") 
      .text('MetaScore vs Rotten Tomatoes vs IMDb Ratings')
  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .attr('fill', '#cdcdcd')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',-400)
      .attr('y',-35)
      .style('text-anchor','middle')
      .attr('fill', '#cdcdcd')
      .attr('stroke-width',3)
      .text('MetaScore')

  svg.append('g')
      .attr('class', 'axis')
      .attr("transform", `translate(${w}, 0)`)
      .attr('fill', '#cdcdcd')
      .call(yAxis2)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',-400)
      .attr('y',55)
      .style('text-anchor','middle')
      .attr('fill', '#cdcdcd')
      .attr('stroke-width',3)
      .text('IMDb')

      function yChange() {

        var value = this.value // get the new y value
    
        yScale // change the yScale
    
          .domain([
            d3.min([0,d3.min(data,function (d) { return d[value] })]),
            d3.max([0,d3.max(data,function (d) { return d[value] })])
            ])
    
        yAxis.scale(yScale) // change the yScale
        d3.select('#yAxis') // redraw the yAxis
          .transition().duration(0)
          .call(yAxis)
        d3.select('#yAxisLabel') // change the yAxisLabel
          .text(value)    
        d3.selectAll('circle') // move the circles
          .transition().duration(0)
          .delay(function (d,i) { return i})
            .attr('cy',function (d) { return yScale(d[value]) })
      }
      
      //We can enable this function if required to arrange the scores on the xaxis. 
      // function xChange() {
    
      //   var value = this.value // get the new x value
      //   xScale // change the xScale
      //     .domain([
      //       d3.min([0,d3.min(data,function (d) { return d[value] })]),
      //       d3.max([0,d3.max(data,function (d) { return d[value] })])
      //       ])
    
      //   xAxis.scale(xScale) // change the xScale
      //   d3.select('#xAxis') // redraw the xAxis
      //     .transition().duration(1000)
      //     .call(xAxis)
      //   d3.select('#xAxisLabel') // change the xAxisLabel
      //     .transition().duration(1000)
      //     .text(value)
      //   d3.selectAll('circle') // move the circles
      //     .transition().duration(1000)
      //     .delay(function (d,i) { return i*100})
      //       .attr('cx',function (d) { return xScale(d[value]) })
      // }
})