// Main.js
var data = [{
    name: 'Left Bar',
    value: 11
}, {
    name: 'Right Bar',
    value: 34
}];

var fillColor;
var nodeFill;


var treeData = {
    "name": "Title Page",
    "children": [{ 
        "name": "At a Glance",
        "children": [{
            "name": "Count of Incidents",
            "children": [{
                "name": "Highest Ransom",
                "children": [{
                    "name": "Cause and Frequency of Attacks",
                    "children": [{
                        "name": "TBD"
                    }]
                }]
            }]
        }]
    }]
};

$(function() {
    // // Instantiate your chart with given settings
    // var myChart = BarChart().xVar('name')
    //     .yVar('value')
    //     .xAxisLabel('Bar')
    //     .yAxisLabel('Arbitrary Value');

    // // Build chart
    // var chart = d3.select('#vis').datum(data).call(myChart);

    var myTree = TreeMap()
    var leTree = d3.select('#nav-bar').datum(treeData).call(myTree);


    var update = function(index){
        if (index == 0) {
            fillColor = 'blue';
            resetTree();
            $("#circle1").css("fill", "lightsteelblue");
        } else if (index == 1) {
            fillColor = 'red';
            nodeFill = 'red';
            resetTree();
            $("#circle2").css("fill", "lightsteelblue");
        } else if (index == 2) {
            fillColor = 'orange';
            resetTree();
            $("#circle3").css("fill", "lightsteelblue");
        } else if (index == 3) {
            fillColor = 'green';
            resetTree();
            $("#circle4").css("fill", "lightsteelblue");
        } else if (index == 4) {
            fillColor = 'green';
            resetTree();
            $("#circle5").css("fill", "lightsteelblue");
        } else if (index == 5) {
            fillColor = 'green';
            resetTree();
            $("#circle6").css("fill", "lightsteelblue");
        } else {
            fillColor = 'black';
            nodeFill = '#fff';
            resetTree();
        }
        // myChart.fillColor(fillColor);
        // chart.datum(data).call(myChart);
    }

    var resetTree = function() {
        for (var i = 1; i <= 6; i++) {
            var circleID = "#circle"+i;
            $(circleID).css("fill", "#fff");
        }
    }

    function goToByScroll(id){
        $('html,body').animate({
            scrollTop: $("#"+id).offset().top},
            'slow');
    }

    $("#circle1").on('click', function(e) {
        e.preventDefault();
        goToByScroll("landing");
        update(0);
    });

    $("#circle2").on('click', function(e) {
        e.preventDefault();
        goToByScroll("glance");
        update(1);
    });

    $("#circle3").on('click', function(e) {
        e.preventDefault();
        goToByScroll("incidents");
        update(2);
    });

    $("#circle4").on('click', function(e) {
        e.preventDefault();
        goToByScroll("ransom")
        update(3);
    });

    $("#circle5").on('click', function(e) {
        e.preventDefault();
        goToByScroll("cause")
        update(4);
    });

    $("#circle6").on('click', function(e) {
        e.preventDefault();
        goToByScroll("claims")
        update(5);
    });

    // Define a new scroller, and use the `.container` method to specify the desired container
    var scroll = scroller()
        .container(d3.select('#graphic'));

    // Pass in a selection of all elements that you wish to fire a step event:
    scroll(d3.selectAll('.step')); // each section with class `step` is a new step

    // Specify the function you wish to activate when a section becomes active
    scroll.on('active', function(index) {
        update(index);
    })
});