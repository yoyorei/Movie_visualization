
function fetchData(sourcefile) {
    d3.csv(sourcefile, function(csv) {

        var normalized=[];

        for (var i = 0; i < csv.length; i++)  {
            var row = csv[i];

            for (var w = 1; w < 53; w++) {
                var newRow = {};
                var numStr = (w < 10) ? "0" + String(w) : String(w)
                newRow.Year = row.Year;
                newRow.Movie = row.Movie;
                newRow.Week = numStr;
                var checkGross = Number(row["W_" + numStr]);
                newRow.WeekGross = checkGross > 0 ? checkGross : ((i/100) + (w/52));
                newRow.TotalGross = Number(row["T_" + numStr]);
                normalized.push(newRow);
                console.log("loaded week " + numStr)
            }
        }

        moviesGrouped = d3.nest()
            .key(function(d) { return d.Year; })
            .key(function(d) { return d.Week; })
            .entries(normalized);

        //Sum total deficit for each week
        var totalWeek = 0;
        var totalUpto = 0;

        for (var y = 0; y < moviesGrouped.length; y++) {
            var yearGroup = moviesGrouped[y];
            for (var w = 0; w < yearGroup.values.length; w++) {
                var weekGroup = yearGroup.values[w];
                totalWeek = 0;
                totalUpto = 0;
                for (var d = 0; d < weekGroup.values.length; d++) {
                    var movie = weekGroup.values[d];
                    totalWeek = Number(totalWeek) + Number(movie.WeekGross);
                    totalUpto = Number(totalUpto) + Number(movie.TotalGross);
                }
                console.log("total weekly gross=" + String(totalWeek));
                weeklyGross.push(totalWeek);
                toDateGross.push(totalUpto);
            }

        }

        //Start running
        run();
        refreshIntervalId = setInterval(run, delay);
        // run();

    });

}
