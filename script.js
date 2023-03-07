var treeData = [
    {
      "name": "One Click Deploy",
      "parent": "null",
      "status": "white",
      "children": [
        {
          "name": "Platform",
          "parent": "One Click Deploy",
          "status": "white",
          "children": [
            {
              "name": "Account Wallet",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Bet Building & Placement",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Bet Overlay",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Bet Tracking Flow",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Cashout",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Global Search",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Same Game Multi Flow",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "External API",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "PP Bet Streams",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Data Transfer System",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            },
            {
              "name": "Supporting Content / Live Data",
              "status": "white",
              "parent": "Platform",
              "children": [
              ]
            }
          ]
        }
      ]
    }
  ];

  var capabilityTLAs = {
    "WLP":"Account Wallet",
    "PSA":"Account Wallet",
    "SIB":"Bet Building & Placement",
    "SPB":"Bet Building & Placement",
    "FAB":"Bet Tracking Flow",
    "FBD":"Bet Tracking Flow",
    "FBP":"Bet Tracking Flow",
    "FBR":"Bet Tracking Flow",
    "FBS":"Bet Tracking Flow",
    "SBD":"Bet Tracking Flow",
    "ABP":"Bet Tracking Flow",
    "BOA":"Bet Overlay",
    "BOLT":"Bet Overlay",
    "BOCH":"Bet Overlay",
    "FCQ":"Cashout",
    "SCO":"Cashout",
    "KHOJC":"Global Search",
    "KHOJQ":"Global Search",
    "PES":"Same Game Multi Flow",
    "PED":"Same Game Multi Flow",
    "PES Adapter":"Same Game Multi Flow",
    "RTK":"Same Game Multi Flow",
    "RTZ":"Same Game Multi Flow",
    "FOE":"External API",
    "PBS":"PP Bet Streams",
    "DTSI":"Data Transfer System",
    "DTSJ":"Data Transfer System",
    "DTSP":"Data Transfer System",
    "DTSM":"Data Transfer System",
    "IPS":"Supporting Content / Live Data",
    "Livescore Topology":"Supporting Content / Live Data"
  }

  var capabilityIndexes = new Object();
  treeData[0].children[0].children.map(a => {    
    capabilityIndexes[a.name]=treeData[0].children[0].children.indexOf(a)
  });

  Object.keys(capabilityTLAs).forEach(function(key) {
    var index = capabilityIndexes[capabilityTLAs[key]];
    var obj = new Object();
    obj.name = key;
    obj.status = "white";
    obj.parent = capabilityTLAs[key];
    obj.children = [];
    treeData[0].children[0].children[index].children.push(obj)
  });
  
  var tlasIndexes = new Object();
  treeData[0].children[0].children.map(a => a.children.map(b => {
    tlasIndexes[b.name] = a.children.indexOf(b);
  }))


  // ************** Generate the tree diagram	 *****************
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left,
      height = 1000 - margin.top - margin.bottom;
      
  var i = 0,
      duration = 750,
      root;
  
  var tree = d3.layout.tree()
      .size([height, width]);
  
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });
  
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," 
                                      + margin.top + ")");
  

  root = treeData[0];
  root.x0 = height / 2;
  root.y0 = 0;
  
  function toggleAll(d) {
      if (d.children) {
          if (d.status == "green") {
              d._children = d.children;
              d._children.forEach(toggleAll);
              d.children = null;
          }
          else
              d.children.forEach(toggleAll);
      }
  }
  
  const fileSelector = document.getElementById('html_report');
  fileSelector.addEventListener('change', (event) => {
    readFile(event.target.files[0])
  });

  root.children.forEach(toggleAll);
    
  update(root);
  
  d3.select(self.frameElement).style("height", "1000px");
  

  function update(source) {
  
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
  
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
            return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", click)
            // add tool tip for ps -eo pid,ppid,pcpu,size,comm,ruser,s
            .on("mouseover", function(d) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(
                  "PID: " + d.name + "<br/>" + 
                  "Parent: " + d.parent
                  )
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
              })
            .on("mouseout", function(d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
              });
  
    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d.status; });
  
    nodeEnter.append("text")
        .attr("x", function(d) { 
            return d.children || d._children ? -13 : 13; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { 
            return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);
  
    // add the tool tip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")"; });
  
    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) { return d.status; });
  
    nodeUpdate.select("text")
        .style("fill-opacity", 1);
  
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { 
            return "translate(" + source.y + "," + source.x + ")"; })
        .remove();
  
    nodeExit.select("circle")
        .attr("r", 1e-6);
  
    nodeExit.select("text")
        .style("fill-opacity", 1e-6);
  
    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
  
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });
  
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);
  
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();
  
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

  }
  
  // Toggle children on click.
  function click(d) {
    console.log(d);
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
  
  function tableToJson(table) { 
    var data = [];
    for (var i=1; i<table.rows.length; i++) { 
        var tableRow = table.rows[i]; 
        var rowData = []; 
        rowData.push(tableRow.cells[0].innerHTML);;
        rowData.push(tableRow.cells[1]);;
    
        data.push(rowData); 
    } 
    return data; 
  }
  
  
  function readFile(fileId){
    var reader = new FileReader();
    reader.addEventListener('load', function() {
        console.log(this.result);
        readData(this.result)
    });
    reader.readAsText(fileId);
  }

  const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`



function readData(file){
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(file, 'text/html');
    console.log(file);
    var table = tableToJson(htmlDoc.getElementsByClassName("report")[0]);

    var data = []
    for(j in table){
        var objData = table[j][0].replaceAll("<b>","").replaceAll("</b>","").split("<br>")
        var filteredObjData = objData.filter(word => word.includes(':'))
            .map(word => word.replace(' ',''))
            .map(word => word.replace(':','":"'))
            .map(word => '"'+word+'"');


        var obj = JSON.parse("{"+filteredObjData+"}");
        console.log("{"+objData+"}");
        obj.color = rgb2hex(table[j][1].style.backgroundColor);
        obj.TLA = obj.TLA.toUpperCase();
        if(obj.TLA.slice(-2)==='FD'){
            obj.TLA = obj.TLA.slice(0,-2)
        }
        data.push(obj);
    }

    data.map(a => updateTLA(a));
    update(root);
}

function updateTLA(data){
    if(capabilityTLAs[data.TLA] !== undefined ){
        var capInd = capabilityIndexes[capabilityTLAs[data.TLA]];
        var tlaInd = tlasIndexes[data.TLA];
    
        var obj = treeData[0].children[0].children[capInd].children[tlaInd];
        obj.status = data.color;
    }
    else{
        console.log("TLA not found");
        console.log(data);
    }

}

