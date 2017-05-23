var TreeMap = function() {
    // Set the dimensions and margins of the diagram
    var margin = {top: 70, right: 90, bottom: 30, left: 20},
        width = 500 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    var linkMargin = 0;
    var nodeFill = "#fff"

    var theTree = function(selection) {
        selection.each(function(treeData) {
            var div = d3.select(this)

            var mySvg = div.selectAll('svg').data([treeData])

            var svg = mySvg.enter().append("svg")
                .attr('height', height + margin.top + margin.bottom)
                .attr('width', width + margin.right + margin.left)
                .append('g')
                .attr("transform", "translate("+ margin.left + "," + margin.top + ")");
            
            var i = 0,
                duration = 750,
                root;
            
            // declares a tree layout and assigns the size
            var treemap = d3.tree().size([height, width]);

            // Assigns parent, children, height, depth
            root = d3.hierarchy(treeData, function(d) { return d.children; });
            root.x0 = height / 2;
            root.y0 = 0;

            var treeData = treemap(root);

            var tooltip = d3.select('body')
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .text("");

            // Compute the new tree layout.
            var nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function(d){ d.y = d.depth * 120});

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
                })
                .on("mouseover", function(d){return tooltip.text(d.data.name).style("visibility", "visible");})
                .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px")
                                                          .style("left",(d3.event.pageX+10)+"px");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')    
                .attr('r', 1e-6)
                .attr('id', (d) => { return 'circle'+d.id })
                .style("fill", nodeFill);   


            // Add labels for the nodes
            // nodeEnter.append('text')
            //     .attr("dy", ".35em")
            //     .attr("x", 13)
            //     .attr("text-anchor", "start")
            //     .text(function(d) { return d.data.name; });

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
                    var o = {x: root.x0, y: root.y0}
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
                    var o = {x: root.x, y: root.y}
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
                path = `M ${linkMargin} ${s.y}
                        C ${linkMargin} ${s.y},
                        ${linkMargin} ${d.y},
                        ${linkMargin} ${d.y}`

                return path
            }
        })
    }
    return theTree
}