document.addEventListener("DOMContentLoaded", function() {
  const elements = ['Hydrogen', 'Oxygen', 'Carbon', 'Nitrogen', 'Sodium', 'Chlorine', 'Phosphorus', 'Calcium', 'Silicon', 'Iron'];
  const symbols = ['H', 'O', 'C', 'N', 'Na', 'Cl', 'P', 'Ca', 'Si', 'Fe'];
  const colors = ['#6F2DBD', '#2C7A7B', '#2E294E', '#AB83A1', '#D81E5B', '#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'];
  
  const width = 400;
  const height = 400;
  const outerRadius = 140;
  const innerRadius = 120;
  
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
      infoFrame.text(`${elements[d.index]} (${symbols[d.index]})`);
    })
    .on("mouseout", function(d) {
      infoFrame.text("Hover over an element");
    });
});
