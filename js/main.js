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
    "name": "Landing",
    "children": [{ 
        "name": "At a Glance",
        "children": [{
            "name": "Count of Incidents",
            "children": [{
                "name": "Highest Ransom",
                "children": [{
                    "name": "Cause and Frequency of Attacks",
                    "children": [{
                        "name": "Common Method of Claims"
                    }]
                }]
            }]
        }]
    }]
};

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


    var color = function(index){
        switch (index) {
            case 0:
                fillColor = 'blue';
                nodeFill = 'blue';
            case 1:
                fillColor = 'red';
                nodeFill = 'red';                
            case 2:
                fillColor = 'orange';
                nodeFill = 'orange';                
            case 3:
                fillColor = 'black';
                nodeFill = 'black';                
            default:
                fillColor = 'black';
                nodeFill = '#fff';                
            return fillColor
        }

    }

    var update = function(index) {
        color(index);
        myChart.fillColor(fillColor);
        changeNodeFill(nodeFill);
        chart.datum(data).call(myChart);
    };

///////////////////

    // Set the dimensions and margins of the diagram
    var margin = {top: 20, right: 90, bottom: 30, left: 20},
        width = 500 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    var linkMargin = 0;
    var nodeFill = "#fff"
    
    var changeNodeFill = function(value) {
        if (!arguments.length) return nodeFill;
        nodeFill = value;
        updateTree(root);
    };

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#nav-bar").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

updateTree(root);

function updateTree(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 140});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('id', (d, i) => {
          return "node"+i;
      })
      .attr("transform", function(d) {   
        return "translate(" + linkMargin + "," + linkMargin + ")";        
    });
    // .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", (d)=>{
          color(d.id)
        //   console.log(d.id)
      });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", 13)
      .attr("text-anchor", "start")
      .text(function(d) { return d.data.name; });

  // Update
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + linkMargin + "," + d.y + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", nodeFill)
    .attr('cursor', 'pointer');

d3.select("#node1").style("fill", "black")


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + linkMargin + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;    
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {
    // path = `M ${s.x} ${s.y}
    //     C ${(s.x + d.x) / 2} ${s.y},
    //         ${(s.x + d.x) / 2} ${d.y},
    //         ${d.x} ${d.y}`

    path = `M ${linkMargin} ${s.y}
            C ${linkMargin} ${s.y},
            ${linkMargin} ${d.y},
            ${linkMargin} ${d.y}`

    return path
  }
}

//////////////////

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