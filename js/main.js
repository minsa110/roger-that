// Main.js
var data = [{
    name: 'Left Bar',
    value: 11
}, {
    name: 'Right Bar',
    value: 34
}];

var treeData = [
  {
    "name": "United States of America",
    "parent": "null",
    "children": [
      {
        "name": "States",
        "parent": "United States of America",
        "children": [
          {
            "name": "Counties",
            "parent": "States"
            
          }]
      },
      {
        "name": "Zip Codes (ZCTA)",
        "parent": "United States of America"
      },
      {
        "name": "114th CD",
        "parent": "United States of America"
      }
    ]
  }
];

$(function() {
    // Instantiate your chart with given settings
    var myChart = BarChart().xVar('name')
        .yVar('value')
        .xAxisLabel('Bar')
        .yAxisLabel('Arbitrary Value');

    // Build chart
    var chart = d3.select('#vis')
        .datum(data)
        .call(myChart);

    var update = function(index) {
        switch (index) {
            case 0:
                var fillColor = 'blue';
                break;
            case 1:
                var fillColor = 'red';
                break;
            case 2:
                var fillColor = 'orange';
                break;
            case 3:
                var fillColor = 'black';
                break;
            default:
                var fillColor = 'black';
                break;
        }
        myChart.fillColor(fillColor);
        chart.datum(data).call(myChart);
    };


    // Define a new scroller, and use the `.container` method to specify the desired container
    var scroll = scroller()
        .container(d3.select('#graphic'));

    // Pass in a selection of all elements that you wish to fire a step event:
    scroll(d3.selectAll('.step')); // each section with class `step` is a new step

    // Specify the function you wish to activate when a section becomes active
    scroll.on('active', function(index) {
        console.log(index)
        update(index);
    })
});