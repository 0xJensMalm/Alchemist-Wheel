let elementData;
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
  
  const path = svg.selectAll("path")
    .data(pie(symbols))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colors[i])
    .attr("stroke", "#ffffff")
    .attr("stroke-width", "1")
    .on("mouseover", function(event, d, i) {
      // Keep the existing highlighting effect
      d3.select(this)
        .attr("stroke", "#000000")
        .attr("stroke-width", "2");

  const textArc = d3.arc()
  .innerRadius(innerRadius - 25)  // 10 units smaller than the wheel's innerRadius
  .outerRadius(outerRadius - 25);  // 10 units smaller than the wheel's outerRadius

  const textArcs = svg.selectAll(".textArc")
  .data(pie(symbols))
  .enter().append("path")
  .attr("id", (d, i) => `textArc${i}`)
  .attr("d", arc)
  .attr("d", textArc)
  .style("fill", "none")
  .style("stroke", "none");

// Add labels that follow the text arcs
const labels = svg.selectAll(".arcLabel")
  .data(pie(symbols))
  .enter().append("text")
  .attr("class", "arcLabel");

labels.append("textPath")
  .attr("xlink:href", (d, i) => `#textArc${i}`)
  .attr("startOffset", "20%")  // Adjust this to move the text closer to the center
  .attr("dy", "-15em")  // Adjust this to move the text up or down
  .style("text-anchor", "middle")
  .text((d, i) => elements[i]);

    // Add the new tooltip behavior
    const elementInfo = elementData.find(e => e.symbol === symbols[d.index]);
    if (elementInfo) {
      infoFrame.html(`<h1>${elementInfo.name} (${elementInfo.symbol})</h1><p>${elementInfo.description}</p>`);
    }
  })
  .on("mouseout", function(d) {
    // Reset the highlighting effect
    d3.select(this)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", "1");

    // Reset the tooltip
    infoFrame.html("<h1>Hover over an element</h1>");
  });
  
});
