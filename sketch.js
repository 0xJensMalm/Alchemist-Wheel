let elementData;
let selectedElement = null;
let lockedElements = [];

// Function to update info boxes
function updateInfoBox(boxId, elementInfo) {
  const infoBox = d3.select(boxId);
  infoBox.html(`<h1>${elementInfo.name} (${elementInfo.symbol})</h1><p>${elementInfo.description}</p>`);
}

// Load JSON data
d3.json("elementInfo.json").then(data => {
  elementData = data;
});

let elementCombinations;
d3.json("elementCombinations.json")
  .then(data => {
    elementCombinations = data;
  })
  .catch(error => {
    console.log("Error reading JSON:", error);
  });



document.addEventListener("DOMContentLoaded", function() {
  
  const elements = ['Hydrogen', 'Oxygen', 'Carbon', 'Nitrogen', 'Sodium', 'Chlorine', 'Phosphorus', 'Calcium', 'Silicon', 'Iron'];
  const symbols = ['H', 'O', 'C', 'N', 'Na', 'Cl', 'P', 'Ca', 'Si', 'Fe'];
  const colors = ['#ADD8E6', '#87CEEB', '#333333', '#D8BFD8', '#FFA500', '#008000', '#FF0000', '#D3D3D3', '#8B4513', '#B7410E'];
  
  const width = 600;
  const height = 600;
  const outerRadius = 210;
  const innerRadius = 170;

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
      if (!d3.select(this).classed("locked")) {
        d3.select(this)
          .attr("stroke", "#000000")
          .attr("stroke-width", "2");
      }
      const elementInfo = elementData.find(e => e.symbol === symbols[d.index]);
      if (elementInfo) {
        if (lockedElements.length === 0) {
          updateInfoBox("#element-title", elementInfo);
        } else if (lockedElements.length === 1) {
          updateInfoBox("#second-element-title", elementInfo);
        }
      }
    })
    .on("mouseout", function(d) {
      if (!d3.select(this).classed("locked")) {
        d3.select(this)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", "1");
      }
      if (lockedElements.length === 0) {
        d3.select("#element-title").html("Hover over an element");
      }
      if (lockedElements.length === 1) {
        d3.select("#second-element-title").html("Hover over another element");
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
        
        // Reset both info boxes if any element is deselected
        if (lockedElements.length === 0) {
          // Reset both info boxes if no elements are locked
          d3.select("#element-title").html("Hover over an element").style("display", "block");
          d3.select("#second-element-title").html("Hover over another element").style("display", "block");
          document.getElementById("combine-button").style.display = "none"; // Hide the button
          document.getElementById("compound-info").style.display = "none"; // Hide the compound info box
        }
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
        updateInfoBox("#element-title", firstElement);
        d3.select("#second-element-title").html("Hover over another element");
        document.getElementById("combine-button").style.display = "none"; // Hide the button
      } else if (lockedElements.length > 1) {
        const firstElement = lockedElements[0].name;
        const secondElement = lockedElements[1].name;
        updateInfoBox("#second-element-title", lockedElements[1]);
        document.getElementById("combine-button").style.display = "inline-block"; // Show the button
      
        // Find the matching compound
        const compoundInfo = elementCombinations.find(compound => {
          return compound.elements.includes(firstElement) && compound.elements.includes(secondElement);
        });
      
        if (compoundInfo) {
          // Update compound info box
          d3.select("#compound-info").html(`<h1>${compoundInfo.compound}</h1><p>${compoundInfo.description}</p><button id='reset-button'>Reset</button>`);
        }
      } else {
        // Reset both info boxes if no elements are locked
        d3.select("#element-title").html("Hover over an element");
        d3.select("#second-element-title").html("Hover over another element");
      }
    })
    
  document.getElementById("combine-button").addEventListener("click", function() {
    // Hide the combine button
    document.getElementById("combine-button").style.display = "none";

    // Show the compound info box
    document.getElementById("compound-info").style.display = "block";

    // Update the compound info box
    d3.select("#compound-title").html("Compound Created");
  });

  document.getElementById("reset-button").addEventListener("click", function() {
    // Reset everything
    lockedElements = [];
    d3.selectAll("path")
      .classed("locked", false)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", "1");
  
    d3.select("#element-title").html("Hover over an element").style("display", "block");
    d3.select("#second-element-title").html("Hover over another element").style("display", "block");
    document.getElementById("combine-button").style.display = "none"; // Hide the combine button
    document.getElementById("compound-info").style.display = "none"; // Hide the compound info box
  });
  
  document.addEventListener("click", function(event) {
    if (event.target.id === "reset-button") {
      // Reset logic here
      lockedElements = [];
      d3.selectAll(".locked")
        .classed("locked", false)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "1");
      d3.select("#element-title").html("Hover over an element");
      d3.select("#second-element-title").html("Hover over another element");
      d3.select("#compound-info").html("");
      document.getElementById("combine-button").style.display = "none";
    }
  });
  

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
