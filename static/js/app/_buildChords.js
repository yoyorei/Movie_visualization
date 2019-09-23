
function buildChords(y,w) {

    movies=moviesGrouped[y].values[w].values;

    movies.sort(function (a,b) {
        //Descending Sort
        if (a.WeekGross > b.WeekGross) return -1;
        else if (a.WeekGross < b.WeekGross) return 1;
        else return 0;
    });

    weekly_movies=movies.slice(0,topMovieCount);

    movies.sort(function (a,b) {
        //Descending Sort
        if (a.TotalGross > b.TotalGross) return -1;
        else if (a.TotalGross < b.TotalGross) return 1;
        else return 0;
    });

    toDate_movies=movies.slice(0,topMovieCount);

    var  toDate_matrix = [],
        weekly_matrix = [];

    w_buf_indexByName=w_indexByName;
    t_buf_indexByName=t_indexByName;

    w_indexByName=[];
    w_nameByIndex=[];
    t_indexByName=[];
    t_nameByIndex=[];
    n = 0;

    // Compute a unique index for each package name
    totalWeekly=0;
    weekly_movies.forEach(function(d) {
        totalWeekly+= Number(d.WeekGross);
        d = d.Movie;
        if (!(d in w_indexByName)) {
            w_nameByIndex[n] = d;
            w_indexByName[d] = n++;
        }
    });

    weekly_movies.forEach(function(d) {
        var source = w_indexByName[d.Movie],
            row = weekly_matrix[source];
        if (!row) {
            row = weekly_matrix[source] = [];
            for (var i = -1; ++i < n;) row[i] = 0;
        }
        row[w_indexByName[d.Movie]]= d.WeekGross;
    });

    // Compute a unique index for each movy name.
    n=0;
    totalToDate=0;
    toDate_movies.forEach(function(d) {
        totalToDate+= Number(d.TotalGross);
        d = d.Movie;
        if (!(d in t_indexByName)) {
            t_nameByIndex[n] = d;
            t_indexByName[d] = n++;
        }
    });

    toDate_movies.forEach(function(d) {
        var source = t_indexByName[d.Movie],
            row = toDate_matrix[source];
        if (!row) {
            row = toDate_matrix[source] = [];
            for (var i = -1; ++i < n;) row[i] = 0;
        }
        row[t_indexByName[d.Movie]]= d.TotalGross;
    });

    // var weeklyRange=angleRange*(totalWeekly/(totalWeekly + totalToDate));
    // var toDateRange=angleRange*(totalToDate/(totalWeekly + totalToDate));
    var weeklyRange = angleRange * .40;
    var toDateRange = angleRange * .60;
    weekly_chord.startAngle(-(weeklyRange/2))
        .endAngle((weeklyRange/2));

    toDate_chord.startAngle(180-(toDateRange/2))
        .endAngle(180+(toDateRange/2));

    toDate_chord.matrix(toDate_matrix);
    weekly_chord.matrix(weekly_matrix);

    var wc_groups = weekly_chord.groups();
    var wc_chords = weekly_chord.chords();
    wc_groups.sort(function(a,b) { return a.index - b.index; });
    wc_chords.sort(function(a,b) { return a.source.index - b.source.index; });
    for (var i=0; i < wc_groups.length; i++) {
        var d={}
        var g=wc_groups[i];
        var c=wc_chords[i];
        d.index=i;
        d.angle= (g.startAngle + g.endAngle) / 2;
        d.label = w_nameByIndex[g.index];
        d.WeekGross= c.source.value;

        // create a new object instead of overwriting
        // overwriting changes the data bound to d3 objects, which is not what
        // we want
        w_labels[i] = {};
        w_labels[i].angle = d.angle;
        w_labels[i].label = d.label;
        w_labels[i].index = i;
        w_labels[i].WeekGross = d.WeekGross;

        w_chords[i] = {};
        w_chords[i].index = i;
        w_chords[i].label = d.label;
        w_chords[i].source = c.source;
        w_chords[i].target = c.target;
        w_chords[i].WeekGross = d.WeekGross;
    }

    var tc_groups = toDate_chord.groups();
    var tc_chords = toDate_chord.chords();
    tc_groups.sort(function(a,b) { return a.index - b.index; });
    tc_chords.sort(function(a,b) { return a.source.index - b.source.index; });
    for (var i=0; i < tc_groups.length; i++) {
        var d={}
        var g=toDate_chord.groups()[i];
        var c=toDate_chord.chords()[i];
        d.index=i;
        d.angle= (g.startAngle + g.endAngle) / 2;
        d.label = t_nameByIndex[g.index];
        d.TotalGross = c.source.value;

        // create a new object instead of overwriting
        // overwriting changes the data bound to d3 objects, which is not what
        // we want
        t_labels[i] = {};
        t_labels[i].angle = d.angle;
        t_labels[i].label = d.label;
        t_labels[i].TotalGross = d.TotalGross;
        t_labels[i].index = i;

        t_chords[i] = {};
        t_chords[i].index = i;
        t_chords[i].label = d.label;
        t_chords[i].source = c.source;
        t_chords[i].target = c.target;
        t_chords[i].TotalGross = d.TotalGross;
    }

    function getFirstIndex(index,indexes) {
        for (var i=0; i < topMovieCount; i++) {
            var found=false;
            for (var y=index; y < indexes.length; y++) {
                if (i==indexes[y]) {
                    found=true;
                }
            }
            if (found==false) {
                return i;
                //  break;
            }
        }
        //      console.log("no available indexes");
    }

    function getLabelIndex(name) {
        for (var i=0; i < topMovieCount; i++) {
            if (e_buffer[i].label==name) {
                return i;
                //   break;
            }
        }
        return -1;
    }


}

