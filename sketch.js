let elementData;
let selectedElement = null;
let lockedElements = [];


// Load JSON data
d3.json("elementInfo.json").then(data => {
  elementData = data;
});

document.addEventListener("DOMContentLoaded", function() {
  
  const elements = ['Hydrogen', 'Oxygen', 'Carbon', 'Nitrogen', 'Sodium', 'Chlorine', 'Phosphorus', 'Calcium', 'Silicon', 'Iron'];
  const symbols = ['H', 'O', 'C', 'N', 'Na', 'Cl', 'P', 'Ca', 'Si', 'Fe'];
  const colors = ['#ADD8E6', '#87CEEB', '#333333', '#D8BFD8', '#FFA500', '#008000', '#FF0000', '#D3D3D3', '#8B4513', '#B7410E'];
  
  const width = 600;
  const height = 600;
  const outerRadius = 210;
  const innerRadius = 170;

  const infoFrame = d3.select("#element-title");
  const secondInfoFrame = d3.select("#second-element-title");


  const svg = d3.select("#wheel-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  
  const pie = d3.pie()
    .value(1)
    .sort(null);

  // Wheel Sections
  const path = svg.selectAll("path")
    .data(pie(symbols))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colors[i])
    .attr("stroke", "#ffffff")
    .attr("stroke-width", "1")
    

  .on("mouseover", function(event, d, i) {
    // Highlight the element if it's not locked
    if (!d3.select(this).classed("locked")) {
      d3.select(this)
        .attr("stroke", "#000000")
        .attr("stroke-width", "2"); 
    }
    // Update the appropriate tooltip
    const elementInfo = elementData.find(e => e.symbol === symbols[d.index]);
    if (elementInfo) {
      if (lockedElements.length === 0) {
        infoFrame.html(`<h1>${elementInfo.name} (${elementInfo.symbol})</h1><p>${elementInfo.description}</p>`);
      } else if (lockedElements.length === 1) {
        d3.select("#second-info-frame").html(`<h1>${elementInfo.name} (${elementInfo.symbol})</h1><p>${elementInfo.description}</p>`);
      }
    }
  })
  .on("mouseout", function(d) {
    // Reset the element if it's not locked
    if (!d3.select(this).classed("locked")) {
      d3.select(this)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "1");
    }
  })
  .on("click", function(event, d, i) {
    const isLocked = d3.select(this).classed("locked");
    const secondInfoFrame = d3.select("#second-info-frame");
  
    if (isLocked) {
      // Unlock the element
      d3.select(this)
        .classed("locked", false)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "1");
  
      // Remove the element from the lockedElements array
      lockedElements = lockedElements.filter(e => e.symbol !== symbols[d.index]);
    } else {
      // Lock the element
      d3.select(this)
        .classed("locked", true)
        .attr("stroke", "#000000")
        .attr("stroke-width", "2");
  
      // Add the element to the lockedElements array
      const elementInfo = elementData.find(e => e.symbol === symbols[d.index]);
      if (elementInfo) {
        lockedElements.push(elementInfo);
      }
    }
  
    // Update the first or second tooltip based on the lockedElements array
    if (lockedElements.length === 1) {
      const firstElement = lockedElements[0];
      infoFrame.html(`<h1>${firstElement.name} (${firstElement.symbol})</h1><p>${firstElement.description}</p>`);
      secondInfoFrame.html("Hover over another element");
    } else if (lockedElements.length > 1) {
      const secondElement = lockedElements[1];
      secondInfoFrame.html(`<h1>${secondElement.name} (${secondElement.symbol})</h1><p>${secondElement.description}</p>`);
    }
  
    // Show or hide the second tooltip based on whether any elements are locked
    if (lockedElements.length > 0) {
      secondInfoFrame.style("display", "block");
    } else {
      secondInfoFrame.style("display", "none");
    }
  })
  

  // Text Arcs and Labels
  const textArc = d3.arc()
    .innerRadius(innerRadius - 25)
    .outerRadius(outerRadius - 25);

  const textArcs = svg.selectAll(".textArc")
    .data(pie(symbols))
    .enter().append("path")
    .attr("id", (d, i) => `textArc${i}`)
    .attr("d", textArc)
    .style("fill", "none")
    .style("stroke", "none");

  const labels = svg.selectAll(".arcLabel")
    .data(pie(symbols))
    .enter().append("text")
    .attr("class", "arcLabel");

  labels.append("textPath")
    .attr("xlink:href", (d, i) => `#textArc${i}`)
    .attr("startOffset", "20%")
    .attr("dy", "-15em")
    .style("text-anchor", "middle")
    .text((d, i) => elements[i]);
});
