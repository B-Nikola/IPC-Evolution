import * as d3 from "d3";
import { json } from "d3-fetch";

const sourceFile = './data/ipcEvolution.json';

const data = await json(sourceFile)
    .then(data => {
        
        return data;
    })
    .catch(error => {
        console.error('Error loading the CSV file:', error);
    });

let gameData =[];
let fullData =[];


data.forEach(element => {
    let index = 1;
    element = Object.values(element);

    let a = parseInt(element[index]);
    let b = parseInt(element[element.length - 1]);
    
    while (!a) {
        a = parseInt(element[++index]);
    }
    let diffValue = (a - b)*-1  ;

    gameData.push({
        name: element[0],
        diffValue: diffValue
    })
});


data.forEach(element => {

  element = Object.values(element);
  //make the first element the name of an array then the other elements are the values of the array
  let name = element[0];
  let values = [];
  //make the rest of the elements the values of the array
  for (let i = 1; i < element.length; i++) {
      values.push(parseInt(element[i]));
  }
  
  fullData.push({
      name: name,
      values: values
  })
  
});


/**
 * Creates a scrollable bar graph showing positive and negative values
 * @param {Array} data - Array of objects with name and diffValue properties
 * @param {string} selector - CSS selector for container element
 * @returns {Object} - Created visualization
 */
function createBarGraph(data, selector) {
  // Clear any existing chart
  d3.select(selector).html("");

  // Get viewport width
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  // Set dimensions and margins
  const margin = { top: 60, right: 30, bottom: 90, left: 60 };
  const barWidth = viewportWidth / 100; // Each bar takes 1/10 of viewport
  const height = 500;
  const visibleWidth = viewportWidth - 40; // Subtract some padding
  
  // Calculate total width needed for all bars
  const totalWidth = barWidth * data.length;
  
  // Create container with scrolling
  const container = d3.select(selector)
    .append("div")
    .attr("class", "chart-container")
    .style("width", `${visibleWidth}px`)
    .style("overflow-x", "auto")
    .style("margin", "0 auto")
    .style("position", "relative");
  
  // Create SVG
  const svg = container
    .append("svg")
    .attr("width", totalWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  
  // Create chart group
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Create scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, totalWidth])
    .padding(0.2);
  
  // Find min and max values for y scale
  const maxValue = Math.max(0, d3.max(data, d => d.diffValue) * 1.1);
  const minValue = Math.min(0, d3.min(data, d => d.diffValue) * 1.1);
  
  const yScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([height, 0]);
  
  // Create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Add y-axis
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);
  
  // Add zero line
  chart.append("line")
    .attr("class", "zero-line")
    .attr("x1", 0)
    .attr("x2", totalWidth)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", "#888")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4");
  
  // Add modified x-axis without text labels
  chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${yScale(0)})`) // Position at zero line
    .call(xAxis.tickFormat("")); // Don't display tick labels initially
  
  // Add x-axis tick labels (only for positive values)
  chart.selectAll(".x-label-positive")
    .data(data.filter(d => d.diffValue >= 0))
    .enter()
    .append("text")
    .attr("class", "x-label-positive")
    .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
    .attr("y", yScale(0) + 20) // Position below zero line
    .attr("text-anchor", "end")
    .attr("transform", d => `rotate(-45, ${xScale(d.name) + xScale.bandwidth() / 2}, ${yScale(0) + 20})`)
    .style("font-size", "14px")
    .text(d => d.name);
  
  // Add x-axis tick labels for negative values (positioned above the bars)
  chart.selectAll(".x-label-negative")
    .data(data.filter(d => d.diffValue < 0))
    .enter()
    .append("text")
    .attr("class", "x-label-negative")
    .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.diffValue) - 10) // Position above the negative bar
    .attr("text-anchor", "end")
    .attr("transform", d => `rotate(-45, ${xScale(d.name) + xScale.bandwidth() / 2}, ${yScale(d.diffValue) - 10})`)
    .style("font-size", "14px")
    .text(d => d.name);
  
  // Add title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", (totalWidth + margin.left + margin.right) / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("IPC Evolution");
  
  // Create visible tooltip div that follows mouse
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("border", "1px solid #ddd")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("font-size", "14px")
    .style("z-index", 1000);
  
  // Create bars
  chart.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.name))
    .attr("width", xScale.bandwidth())
    .attr("y", d => d.diffValue > 0 ? yScale(d.diffValue) : yScale(0))
    .attr("height", d => Math.abs(yScale(d.diffValue) - yScale(0)))
    .attr("fill", d => d.diffValue >= 0 ? "#4682b4" : "#d86363")
    .on("mouseover", function(event, d) {
      // Highlight bar
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", d.diffValue >= 0 ? "#2c5d8c" : "#a13c3c");
      
      // Show tooltip
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.name}</strong><br>Value: ${d.diffValue.toFixed(2)}`);
    })
    .on("mousemove", function(event) {
      // Position tooltip near cursor
      tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function(event, d) {
      // Reset bar color
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", d.diffValue >= 0 ? "#4682b4" : "#d86363");
      
      // Hide tooltip
      tooltip.style("opacity", 0);
    });
  
  // Add scroll buttons
  const buttonContainer = d3.select(selector)
    .append("div")
    .style("text-align", "center")
    .style("margin-top", "10px");
  
  return svg;
}

/**
 * Creates a line graph showing trends with interactive points and toggleable lines
 * @param {Array} data - Array of objects with name and values properties (fullData)
 * @param {string} selector - CSS selector for container element
 * @returns {Object} - Created visualization
 */
function createLineGraph(data, selector) {
  // Clear any existing chart
  d3.select(selector).html("");

  // Get viewport width
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  // Set dimensions and margins
  const margin = { top: 60, right: 50, bottom: 90, left: 60 };
  const height = 500;
  const visibleWidth = viewportWidth - 40; // Subtract some padding
  
  // Calculate total width with reduced spacing between points
  const totalWidth = Math.max(800, data[0].values.length * 15); 
  
  // Track visible lines and points
  const visibleLines = new Set(data.map((_, i) => i)); // All lines visible initially
  const visiblePoints = new Array(data.length).fill(null); // No points initially visible
  
  // Create container with scrolling
  const container = d3.select(selector)
    .append("div")
    .attr("class", "chart-container")
    .style("width", `${visibleWidth}px`)
    .style("overflow-x", "auto")
    .style("margin", "0 auto")
    .style("position", "relative");
  
  // Create SVG
  const svg = container
    .append("svg")
    .attr("width", totalWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  
  // Create chart group
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Generate monthly date labels starting from January 2000
  const months = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Calculate how many months based on data length
  for (let i = 0; i < data[0].values.length; i++) {
    const year = 2000 + Math.floor(i / 12);
    const month = i % 12;
    months.push({
      label: monthNames[month],
      isJanuary: month === 0,
      fullLabel: `${monthNames[month]} ${year}`,
      year: year
    });
  }
  
  // Create color scale for different categories
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, months.length - 1])
    .range([0, totalWidth]);
  
  // Find min and max values across all datasets
  const allValues = data.flatMap(d => d.values.filter(v => !isNaN(v)));
  const maxValue = d3.max(allValues) * 1.1;
  const minValue = d3.min(allValues) * 0.9;
  
  const yScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([height, 0]);
  
  // Create line generator
  const line = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d))
    .defined(d => !isNaN(d)); // Skip null or NaN values
  
  // Add zero line if range includes it
  if (minValue <= 0 && maxValue >= 0) {
    chart.append("line")
      .attr("class", "zero-line")
      .attr("x1", 0)
      .attr("x2", totalWidth)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", "#888")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4");
  }
  
  // Create custom X axis with different styling for January months
  const xAxis = d3.axisBottom(xScale)
    .tickFormat((i) => months[i]?.label || "")
    .ticks(months.length);
  
  const xAxisGroup = chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  
  // Adjust styling for all tick labels
  xAxisGroup.selectAll(".tick text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("font-size", (d, i) => months[i]?.isJanuary ? "14px" : "11px")
    .attr("font-weight", (d, i) => months[i]?.isJanuary ? "bold" : "normal");
  
  // Add year labels for January
  chart.selectAll(".year-label")
    .data(months.filter(m => m.isJanuary))
    .enter()
    .append("text")
    .attr("class", "year-label")
    .attr("x", (d, i) => xScale(months.findIndex(m => m.fullLabel === d.fullLabel)))
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text(d => d.year);
  
  // Add vertical grid lines for January (year boundaries)
  chart.selectAll(".year-grid")
    .data(months.filter(m => m.isJanuary))
    .enter()
    .append("line")
    .attr("class", "year-grid")
    .attr("x1", (d, i) => xScale(months.findIndex(m => m.fullLabel === d.fullLabel)))
    .attr("x2", (d, i) => xScale(months.findIndex(m => m.fullLabel === d.fullLabel)))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "3,3");
  
  const yAxis = d3.axisLeft(yScale);
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);
  
  // Add title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", (totalWidth + margin.left + margin.right) / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("IPC Evolution Over Time");
  
  // Create tooltip that follows mouse
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.95)")
    .style("border", "1px solid #ddd")
    .style("border-radius", "5px")
    .style("padding", "12px")
    .style("box-shadow", "0 0 10px rgba(0,0,0,0.2)")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("max-width", "300px")
    .style("font-size", "14px")
    .style("z-index", 1000);
  
  // Create vertical tracking line
  const trackingLine = chart.append("line")
    .attr("class", "tracking-line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .style("opacity", 0);
  
  // Function to update visibility of lines and points
  function updateVisibility() {
    // Update lines
    data.forEach((d, i) => {
      d3.select(`.line-${i}`)
        .style("opacity", visibleLines.has(i) ? 1 : 0.15);
      
      // Update legend items
      d3.select(`.legend-item-${i} rect`)
        .style("opacity", visibleLines.has(i) ? 1 : 0.4);
      d3.select(`.legend-item-${i} text`)
        .style("font-weight", visibleLines.has(i) ? "bold" : "normal")
        .style("opacity", visibleLines.has(i) ? 1 : 0.6);
      
      // Update dots - show only the selected point for each visible line
      chart.selectAll(`.dot-${i}`)
        .style("opacity", (_, j) => {
          if (!visibleLines.has(i)) return 0.1; // Line is inactive
          if (visiblePoints[i] === null) return 0; // No point selected
          return j === visiblePoints[i] ? 1 : 0; // Only show selected point
        })
        .attr("r", (_, j) => {
          return (j === visiblePoints[i] && visibleLines.has(i)) ? 7 : 3;
        });
    });
  }
  
  // Create hover areas for each line
  data.forEach((d, i) => {
    // Create the line path
    const linePath = chart.append("path")
      .datum(d.values)
      .attr("class", `line-${i}`)
      .attr("fill", "none")
      .attr("stroke", colorScale(i))
      .attr("stroke-width", 2.5)
      .attr("d", line);
    
    // Add dots for each data point with hover interaction
    const dots = chart.selectAll(`.dot-${i}`)
      .data(d.values)
      .enter()
      .append("circle")
      .attr("class", `dot-${i}`)
      .attr("cx", (v, j) => xScale(j))
      .attr("cy", v => yScale(v))
      .attr("r", 3) // Slightly smaller dots since they're closer
      .attr("fill", colorScale(i))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("opacity", v => isNaN(v) ? 0 : 0) // Start with all dots hidden
      .style("cursor", "pointer")
      .on("mouseover", function(event, value) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Only show this one enlarged
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 7)
          .attr("stroke-width", 2);
          
        // Get data point index
        const pointIndex = d.values.indexOf(value);
        
        // Update tracking line position
        trackingLine
          .attr("x1", xScale(pointIndex))
          .attr("x2", xScale(pointIndex))
          .style("opacity", 1);
        
        // Build tooltip content for just this line
        let tooltipContent = `
          <div style="color:${colorScale(i)}; border-bottom: 2px solid ${colorScale(i)}; padding-bottom: 5px; margin-bottom: 8px;">
            <strong>${d.name}</strong>
          </div>
          <strong>Date:</strong> ${months[pointIndex].fullLabel}<br>
          <strong>Value:</strong> ${value.toFixed(2)}
        `;
        
        // Show tooltip
        tooltip
          .style("opacity", 1)
          .style("border-left", `4px solid ${colorScale(i)}`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px")
          .html(tooltipContent);
      })
      .on("mousemove", function(event) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Move tooltip with mouse
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Keep size if this point is selected, otherwise reset
        const pointIndex = d.values.indexOf(d3.select(this).datum());
        if (visiblePoints[i] !== pointIndex) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 3)
            .attr("stroke-width", 1.5);
        }
        
        // Hide tracking line and tooltip
        trackingLine.style("opacity", 0);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, value) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Get the index of the clicked point
        const pointIndex = d.values.indexOf(value);
        
        // Toggle visibility - if already visible, hide it, otherwise show it
        if (visiblePoints[i] === pointIndex) {
          visiblePoints[i] = null; // Hide the point
        } else {
          visiblePoints[i] = pointIndex; // Show only this point
        }
        
        updateVisibility();
        
        // Prevent event bubbling
        event.stopPropagation();
      });
      
    // Add hover detection for the lines (wide transparent stroke for easier interaction)
    chart.append("path")
      .datum(d.values)
      .attr("class", `line-hover-${i}`)
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 15) 
      .attr("d", line)
      .style("cursor", "pointer")
      .on("mouseover", function(event) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Highlight the actual visible line
        d3.select(`.line-${i}`)
          .attr("stroke-width", 4);
          
        // Fade other lines
        data.forEach((_, j) => {
          if (j !== i) {
            d3.select(`.line-${j}`)
              .attr("stroke-opacity", 0.3);
            chart.selectAll(`.dot-${j}`)
              .style("opacity", 0.3);
          }
        });
      })
      .on("mousemove", function(event) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Get updated mouse position
        const [mouseX] = d3.pointer(event, this);
        const xIndex = Math.round(xScale.invert(mouseX));
        
        if (xIndex >= 0 && xIndex < months.length && !isNaN(d.values[xIndex])) {
          // Update tracking line
          trackingLine
            .attr("x1", xScale(xIndex))
            .attr("x2", xScale(xIndex))
            .style("opacity", 1);
          
          // Build tooltip for just this line
          let tooltipContent = `
            <div style="color:${colorScale(i)}; border-bottom: 2px solid ${colorScale(i)}; padding-bottom: 5px; margin-bottom: 8px;">
              <strong>${d.name}</strong>
            </div>
            <strong>Date:</strong> ${months[xIndex].fullLabel}<br>
            <strong>Value:</strong> ${d.values[xIndex].toFixed(2)}
          `;
          
          // Update tooltip
          tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 30) + "px")
            .html(tooltipContent);
        }
      })
      .on("mouseout", function() {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Reset line thickness
        d3.select(`.line-${i}`)
          .attr("stroke-width", 2.5);
        
        // Hide tracking line and tooltip
        trackingLine.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
  });
  
  // Add legend with clickable items
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${margin.left}, ${margin.top / 2})`);
  
  data.forEach((d, i) => {
    const legendItem = legend.append("g")
      .attr("class", `legend-item-${i}`)
      .attr("transform", `translate(${i * 150}, 0)`)
      .style("cursor", "pointer")
      .on("mouseover", function() {
        if (!visibleLines.has(i)) return; // Skip if legend is inactive
        
        // Highlight corresponding line
        d3.select(`.line-${i}`)
          .attr("stroke-width", 4);
          
        // Fade other lines
        data.forEach((_, j) => {
          if (j !== i) {
            d3.select(`.line-${j}`)
              .attr("stroke-opacity", 0.3);
            chart.selectAll(`.dot-${j}`)
              .style("opacity", 0.3);
          }
        });
      })
      .on("mouseout", function() {
        // Reset all lines
        data.forEach((_, j) => {
          d3.select(`.line-${j}`)
            .attr("stroke-width", 2.5)
            .attr("stroke-opacity", 1);
          chart.selectAll(`.dot-${j}`)
            .style("opacity", v => isNaN(v) ? 0 : 1);
        });
      })
      .on("click", function() {
        // Toggle line visibility
        if (visibleLines.has(i)) {
          visibleLines.delete(i);
        } else {
          visibleLines.add(i);
        }
        
        updateVisibility();
      });
    
    legendItem.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", colorScale(i));
    
    legendItem.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(d.name)
      .style("font-size", "12px");
  });
  
  // Add scroll buttons
  const buttonContainer = d3.select(selector)
    .append("div")
    .style("text-align", "center")
    .style("margin-top", "10px");
  
  buttonContainer.append("button")
    .text("← Scroll Left")
    .style("margin-right", "10px")
    .style("padding", "5px 15px")
    .style("font-size", "16px")
    .on("click", function() {
      container.node().scrollLeft -= 200;
    });
  
  buttonContainer.append("button")
    .text("Scroll Right →")
    .style("padding", "5px 15px")
    .style("font-size", "16px")
    .on("click", function() {
      container.node().scrollLeft += 200;
    });
  
  return svg;
}

/**
 * Creates a line graph showing trends with interactive points and toggleable lines for two datasets
 * @param {Array} data1 - First array of objects with name and values properties (subset of fullData)
 * @param {Array} data2 - Second array of objects with name and values properties (subset of fullData)
 * @param {string} selector - CSS selector for container element
 * @param {string} title1 - Title for first dataset group (optional)
 * @param {string} title2 - Title for second dataset group (optional)
 * @returns {Object} - Created visualization
 */
function createLineGraphComparison(data1, data2, selector, title1 = "Group 1", title2 = "Group 2") {
  // Clear any existing chart
  d3.select(selector).html("");

  // Get viewport width
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  // Set dimensions and margins
  const margin = { top: 60, right: 50, bottom: 90, left: 60 };
  const height = 500;
  const visibleWidth = viewportWidth - 40; // Subtract some padding
  
  // Calculate total width with reduced spacing between points
  const dataLength = Math.max(
    data1.length > 0 ? data1[0].values.length : 0,
    data2.length > 0 ? data2[0].values.length : 0
  );
  const totalWidth = Math.max(800, dataLength * 15); 
  
  // Combine datasets for internal calculations while preserving their separate identity
  const allData = [
    ...data1.values.map(d => ({ ...d, group: 0 })), 
    ...data2.values.map(d => ({ ...d, group: 1 }))
  ];
  
  // Track visible lines and points (for both groups)
  const visibleLines = new Set(allData.map((_, i) => i)); // All lines visible initially
  const visiblePoints = new Array(allData.length).fill(null); // No points initially visible
  
  // Create container with scrolling
  const container = d3.select(selector)
    .append("div")
    .attr("class", "chart-container")
    .style("width", `${visibleWidth}px`)
    .style("overflow-x", "auto")
    .style("margin", "0 auto")
    .style("position", "relative");
  
  // Create SVG
  const svg = container
    .append("svg")
    .attr("width", totalWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  
  // Create chart group
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Generate monthly date labels starting from January 2000
  const months = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Calculate how many months based on data length
  for (let i = 0; i < dataLength; i++) {
    const year = 2000 + Math.floor(i / 12);
    const month = i % 12;
    months.push({
      label: monthNames[month],
      isJanuary: month === 0,
      fullLabel: `${monthNames[month]} ${year}`,
      year: year
    });
  }
  
  // Create color scales for the two groups
  const colorScale1 = d3.scaleOrdinal(d3.schemeBlues[9].slice(3)); // Blues for first group
  const colorScale2 = d3.scaleOrdinal(d3.schemeReds[9].slice(3));  // Reds for second group
  
  // Function to get color for a line based on its group and index
  function getColor(d, i) {
    const groupIndex = allData.findIndex(item => item.name === d.name && item.group === d.group);
    if (d.group === 0) {
      return colorScale1(i % colorScale1.range().length);
    } else {
      return colorScale2(i % colorScale2.range().length);
    }
  }
  
  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, months.length - 1])
    .range([0, totalWidth]);
  
  console.log(allData);
  // Find min and max values across all datasets
  const allValues = allData.flatMap(d => d.values);
  const maxValue = d3.max(allValues) * 1.1;
  const minValue = d3.min(allValues) * 0.9;
  
  const yScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([height, 0]);
  
  // Create line generator
  const line = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d))
    .defined(d => !isNaN(d)); // Skip null or NaN values
  
  // Add zero line if range includes it
  if (minValue <= 0 && maxValue >= 0) {
    chart.append("line")
      .attr("class", "zero-line")
      .attr("x1", 0)
      .attr("x2", totalWidth)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", "#888")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4");
  }
  
  // Create custom X axis with different styling for January months
  const xAxis = d3.axisBottom(xScale)
    .tickFormat((i) => months[i]?.label || "")
    .ticks(months.length);
  
  const xAxisGroup = chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  
  // Adjust styling for all tick labels
  xAxisGroup.selectAll(".tick text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("font-size", (d, i) => months[i]?.isJanuary ? "14px" : "11px")
    .attr("font-weight", (d, i) => months[i]?.isJanuary ? "bold" : "normal");
  
  // Add year labels for January
  chart.selectAll(".year-label")
    .data(months.filter(m => m.isJanuary))
    .enter()
    .append("text")
    .attr("class", "year-label")
    .attr("x", (d, i) => xScale(months.findIndex(m => m.fullLabel === d.fullLabel)))
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text(d => d.year);
  
  // Add vertical grid lines for January (year boundaries)
  chart.selectAll(".year-grid")
    .data(months.filter(m => m.isJanuary))
    .enter()
    .append("line")
    .attr("class", "year-grid")
    .attr("x1", (d, i) => xScale(months.findIndex(m => m.fullLabel === d.fullLabel)))
    .attr("x2", (d, i) => xScale(months.findIndex(m => m.fullLabel === d.fullLabel)))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "3,3");
  
  const yAxis = d3.axisLeft(yScale);
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);
  
  // Add title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", (totalWidth + margin.left + margin.right) / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("IPC Evolution Comparison");
  
  // Create tooltip that follows mouse
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.95)")
    .style("border", "1px solid #ddd")
    .style("border-radius", "5px")
    .style("padding", "12px")
    .style("box-shadow", "0 0 10px rgba(0,0,0,0.2)")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("max-width", "300px")
    .style("font-size", "14px")
    .style("z-index", 1000);
  
  // Create vertical tracking line
  const trackingLine = chart.append("line")
    .attr("class", "tracking-line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .style("opacity", 0);
  
  // Function to update visibility of lines and points
  function updateVisibility() {
    // Update lines
    allData.forEach((d, i) => {
      const color = d.group === 0 ? 
        colorScale1(i % data1.length) : 
        colorScale2((i - data1.length) % data2.length);
      
      d3.select(`.line-${i}`)
        .style("opacity", visibleLines.has(i) ? 1 : 0.15);
      
      // Update legend items
      d3.select(`.legend-item-${i} rect`)
        .style("opacity", visibleLines.has(i) ? 1 : 0.4);
      d3.select(`.legend-item-${i} text`)
        .style("font-weight", visibleLines.has(i) ? "bold" : "normal")
        .style("opacity", visibleLines.has(i) ? 1 : 0.6);
      
      // Update dots - show only the selected point for each visible line
      chart.selectAll(`.dot-${i}`)
        .style("opacity", (_, j) => {
          if (!visibleLines.has(i)) return 0.1; // Line is inactive
          if (visiblePoints[i] === null) return 0; // No point selected
          return j === visiblePoints[i] ? 1 : 0; // Only show selected point
        })
        .attr("r", (_, j) => {
          return (j === visiblePoints[i] && visibleLines.has(i)) ? 7 : 3;
        });
    });
  }
  
  // Create hover areas for each line
  allData.forEach((d, i) => {
    const color = d.group === 0 ? 
      colorScale1(i % data1.length) : 
      colorScale2((i - data1.length) % data2.length);
      
    // Create the line path
    const linePath = chart.append("path")
      .datum(d.values)
      .attr("class", `line-${i}`)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5)
      .attr("d", line)
      .style("stroke-dasharray", d.group === 1 ? "none" : "none"); // Optional: make one group dashed
    
    // Add dots for each data point with hover interaction
    const dots = chart.selectAll(`.dot-${i}`)
      .data(d.values)
      .enter()
      .append("circle")
      .attr("class", `dot-${i}`)
      .attr("cx", (v, j) => xScale(j))
      .attr("cy", v => yScale(v))
      .attr("r", 3) // Slightly smaller dots since they're closer
      .attr("fill", color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("opacity", v => isNaN(v) ? 0 : 0) // Start with all dots hidden
      .style("cursor", "pointer")
      .on("mouseover", function(event, value) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Only show this one enlarged
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 7)
          .attr("stroke-width", 2);
          
        // Get data point index
        const pointIndex = d.values.indexOf(value);
        
        // Update tracking line position
        trackingLine
          .attr("x1", xScale(pointIndex))
          .attr("x2", xScale(pointIndex))
          .style("opacity", 1);
        
        // Build tooltip content for just this line
        let tooltipContent = `
          <div style="color:${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px; margin-bottom: 8px;">
            <strong>${d.name}</strong>
            <span style="font-size:11px;"> (${d.group === 0 ? title1 : title2})</span>
          </div>
          <strong>Date:</strong> ${months[pointIndex].fullLabel}<br>
          <strong>Value:</strong> ${value.toFixed(2)}
        `;
        
        // Show tooltip
        tooltip
          .style("opacity", 1)
          .style("border-left", `4px solid ${color}`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px")
          .html(tooltipContent);
      })
      .on("mousemove", function(event) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Move tooltip with mouse
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Keep size if this point is selected, otherwise reset
        const pointIndex = d.values.indexOf(d3.select(this).datum());
        if (visiblePoints[i] !== pointIndex) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 3)
            .attr("stroke-width", 1.5);
        }
        
        // Hide tracking line and tooltip
        trackingLine.style("opacity", 0);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, value) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Get the index of the clicked point
        const pointIndex = d.values.indexOf(value);
        
        // Toggle visibility - if already visible, hide it, otherwise show it
        if (visiblePoints[i] === pointIndex) {
          visiblePoints[i] = null; // Hide the point
        } else {
          visiblePoints[i] = pointIndex; // Show only this point
        }
        
        updateVisibility();
        
        // Prevent event bubbling
        event.stopPropagation();
      });
      
    // Add hover detection for the lines (wide transparent stroke for easier interaction)
    chart.append("path")
      .datum(d.values)
      .attr("class", `line-hover-${i}`)
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 15) 
      .attr("d", line)
      .style("cursor", "pointer")
      .on("mouseover", function(event) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Highlight the actual visible line
        d3.select(`.line-${i}`)
          .attr("stroke-width", 4);
        
        // Get mouse position and convert to data index
        const [mouseX] = d3.pointer(event, this);
        const xIndex = Math.round(xScale.invert(mouseX));
        
        if (xIndex >= 0 && xIndex < months.length && !isNaN(d.values[xIndex])) {
          // Update tracking line
          trackingLine
            .attr("x1", xScale(xIndex))
            .attr("x2", xScale(xIndex))
            .style("opacity", 1);
          
          // Build tooltip for just this line
          let tooltipContent = `
            <div style="color:${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px; margin-bottom: 8px;">
              <strong>${d.name}</strong>
              <span style="font-size:11px;"> (${d.group === 0 ? title1 : title2})</span>
            </div>
            <strong>Date:</strong> ${months[xIndex].fullLabel}<br>
            <strong>Value:</strong> ${d.values[xIndex].toFixed(2)}
          `;
          
          // Show tooltip
          tooltip
            .style("opacity", 1)
            .style("border-left", `4px solid ${color}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 30) + "px")
            .html(tooltipContent);
        }
      })
      .on("mousemove", function(event) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Get updated mouse position
        const [mouseX] = d3.pointer(event, this);
        const xIndex = Math.round(xScale.invert(mouseX));
        
        if (xIndex >= 0 && xIndex < months.length && !isNaN(d.values[xIndex])) {
          // Update tracking line
          trackingLine
            .attr("x1", xScale(xIndex))
            .attr("x2", xScale(xIndex))
            .style("opacity", 1);
          
          // Build tooltip for just this line
          let tooltipContent = `
            <div style="color:${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px; margin-bottom: 8px;">
              <strong>${d.name}</strong>
              <span style="font-size:11px;"> (${d.group === 0 ? title1 : title2})</span>
            </div>
            <strong>Date:</strong> ${months[xIndex].fullLabel}<br>
            <strong>Value:</strong> ${d.values[xIndex].toFixed(2)}
          `;
          
          // Update tooltip
          tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 30) + "px")
            .html(tooltipContent);
        }
      })
      .on("mouseout", function() {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Reset line thickness
        d3.select(`.line-${i}`)
          .attr("stroke-width", 2.5);
        
        // Hide tracking line and tooltip
        trackingLine.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
  });
  
  // Add legend with clickable items, separated by groups
  const legendGroup1 = svg.append("g")
    .attr("class", "legend-group-1")
    .attr("transform", `translate(${margin.left}, ${margin.top / 2 - 15})`);
    
  // Group 1 title
  legendGroup1.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", d3.schemeBlues[9][7])
    .text(title1);
  
  // Group 1 items  
  data1.forEach((d, i) => {
    const idx = i; // Index in the allData array
    
    const legendItem = legendGroup1.append("g")
      .attr("class", `legend-item-${idx}`)
      .attr("transform", `translate(${i * 120}, 20)`)
      .style("cursor", "pointer")
      .on("click", function() {
        // Toggle line visibility
        if (visibleLines.has(idx)) {
          visibleLines.delete(idx);
        } else {
          visibleLines.add(idx);
        }
        
        updateVisibility();
      });
    
    legendItem.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorScale1(i));
    
    legendItem.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text(d.name)
      .style("font-size", "12px");
  });
  
  // Group 2 legend
  const legendGroup2 = svg.append("g")
    .attr("class", "legend-group-2")
    .attr("transform", `translate(${margin.left + Math.max(data1.length * 120, 400)}, ${margin.top / 2 - 15})`);
    
  // Group 2 title
  legendGroup2.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", d3.schemeReds[9][7])
    .text(title2);
  
  // Group 2 items
  data2.forEach((d, i) => {
    const idx = i + data1.length; // Index in the allData array
    
    const legendItem = legendGroup2.append("g")
      .attr("class", `legend-item-${idx}`)
      .attr("transform", `translate(${i * 120}, 20)`)
      .style("cursor", "pointer")
      .on("click", function() {
        // Toggle line visibility
        if (visibleLines.has(idx)) {
          visibleLines.delete(idx);
        } else {
          visibleLines.add(idx);
        }
        
        updateVisibility();
      });
    
    legendItem.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorScale2(i));
    
    legendItem.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text(d.name)
      .style("font-size", "12px");
  });
  
  // Add click handler to SVG background to clear selections
  svg.append("rect")
    .attr("width", totalWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "transparent")
    .style("pointer-events", "all")
    .on("click", function() {
      // Clear all visible points
      visiblePoints.fill(null);
      updateVisibility();
    });
  
  // Add scroll buttons
  const buttonContainer = d3.select(selector)
    .append("div")
    .style("text-align", "center")
    .style("margin-top", "10px");
  
  buttonContainer.append("button")
    .text("← Scroll Left")
    .style("margin-right", "10px")
    .style("padding", "5px 15px")
    .style("font-size", "16px")
    .on("click", function() {
      container.node().scrollLeft -= 200;
    });
  
  buttonContainer.append("button")
    .text("Scroll Right →")
    .style("padding", "5px 15px")
    .style("font-size", "16px")
    .on("click", function() {
      container.node().scrollLeft += 200;
    });
  
  // Initialize visibility
  updateVisibility();
  
  return svg;
}

// Update exports to include the new function
export { data, gameData, fullData, createBarGraph, createLineGraph, createLineGraphComparison };