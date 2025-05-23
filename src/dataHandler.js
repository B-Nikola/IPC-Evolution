import * as d3 from "d3";
import { json } from "d3-fetch";

const fullSource = './data/ipcEvolution.json';
const lightSource = './data/ipcEvolutionLight.json';

const sourceOption = false; // Set to true for full data, false for light data
let sourceFile = null;
if (sourceOption)
{
      sourceFile = fullSource;
}else
{
    sourceFile = lightSource;
}

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


//calculate the diffValue for two elements that the method gets the name provided
function calculateDiffValue(name1) {

    const element1 = fullData.find(element => element.name === name1);

console.log(name1);

    if (!element1) {
      console.error("Element not found");
      return null;
    }
  
    // Calculate the diffValue of element 1 of the last and the first element that is not a nan
    let index = 0;
    let a = parseInt(element1.values[index]);
    let b = parseInt(element1.values[element1.values.length - 1]);
    while (!a) {
        a = parseInt(element1.values[++index]);
    } 
    let diffValue = (a - b)*-1  ;

    return diffValue;
  }


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
  
  const yScale = d3.scaleSqrt()
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
function createFullLineGraph(data, selector) {
  // Clear any existing chart
  d3.select(selector).html("");

  // Get viewport width
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  // Set dimensions and margins
  const margin = { top: 60, right: 50, bottom: 90, left: 60 };
  const height = 500;
  const visibleWidth = viewportWidth - 40; // Subtract some padding
  
  // Calculate years directly from data length (each point is a year)
  const firstYear = 2000;
  const years = Array.from({length: data[0].values.length}, (_, i) => firstYear + i);
  
  // Calculate total width with spacing for years
  const totalWidth = Math.max(800, years.length * 50); // Adjust spacing for yearly points
  
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
  
  // Create scales for yearly data
  const xScale = d3.scaleLinear()
    .domain([0, data[0].values.length - 1])
    .range([0, totalWidth]);

  // Create a scale for year labels that matches data points directly
  const yearScale = d3.scaleLinear()
    .domain([0, data[0].values.length - 1])
    .range([0, totalWidth]);
  
  // Find min and max values across all datasets
  const allValues = data.flatMap(d => d.values.filter(v => !isNaN(v)));
  const maxValue = d3.max(allValues) * 1.1;
  const minValue = Math.min(d3.min(allValues), 100); // Ensure 100 is included in the range

  // Modify yScale to include 100
  const yScale = d3.scaleLinear()
    .domain([Math.min(0, minValue * 0.9), Math.max(maxValue, 110)]) // Ensure 100 is in visible range
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

  // Add reference line at 100
  chart.append("line")
    .attr("class", "reference-line")
    .attr("x1", 0)
    .attr("x2", totalWidth)
    .attr("y1", yScale(100))
    .attr("y2", yScale(100))
    .attr("stroke", "#ff9800") // Orange color for the reference line
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "5,3");

  // Add text label for the reference line
  chart.append("text")
    .attr("class", "reference-line-label")
    .attr("x", 5)
    .attr("y", yScale(100) - 5)
    .attr("fill", "#ff9800")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("100 = Base");
  
  // Create custom X axis with years
  const xAxis = d3.axisBottom(yearScale)
    .tickFormat(i => firstYear + i)
    .ticks(Math.min(years.length, 20)); // Limit ticks if too many years
  
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
  
  // Function to get year from data index (replace getYearMonth)
  function getYear(index) {
    return firstYear + index; // Each index is now one year
  }
  
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
  
  // Create lines and points for each data series
  data.forEach((d, i) => {
    // Create the line path
    const linePath = chart.append("path")
      .datum(d.values)
      .attr("class", `line-${i}`)
      .attr("fill", "none")
      .attr("stroke", colorScale(i))
      .attr("stroke-width", 2.5)
      .attr("d", line);
    
    // Filter out invalid values before creating points
    const validValues = d.values.map((v, j) => ({
      value: v,
      index: j,
      isValid: v !== null && v !== undefined && !isNaN(v)
    })).filter(d => d.isValid);
    
    // Add dots for each valid data point with hover interaction
    chart.selectAll(`.dot-${i}`)
      .data(validValues)
      .enter()
      .append("circle")
      .attr("class", `dot-${i}`)
      .attr("cx", d => xScale(d.index))
      .attr("cy", d => yScale(d.value))
      .attr("r", 3.5)
      .attr("fill", colorScale(i))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Enlarge the dot on hover
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 7)
          .attr("stroke-width", 2);
          
        // Update tracking line position
        trackingLine
          .attr("x1", xScale(d.index))
          .attr("x2", xScale(d.index))
          .style("opacity", 1);
        
        // Get year directly (each point is a year)
        const year = getYear(d.index);
        
        // Build tooltip content
        let tooltipContent = `
          <div style="color:${colorScale(i)}; border-bottom: 2px solid ${colorScale(i)}; padding-bottom: 5px; margin-bottom: 8px;">
            <strong>${data[i].name}</strong>
          </div>
          <strong>Year:</strong> ${year}<br>
          <strong>Value:</strong> ${d.value.toFixed(2)}
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
        if (!visibleLines.has(i)) return;
        
        // Move tooltip with mouse
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
        if (!visibleLines.has(i)) return;
        
        // Reset dot size
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 3.5)
          .attr("stroke-width", 1.5);
        
        // Hide tracking line and tooltip
        trackingLine.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
  });
  
  // Add hover detection for the lines (wide transparent stroke for easier interaction)
  data.forEach((d, i) => {
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
      .attr("transform", `translate(${i * 225}, ${height + 20})`)
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
 * Creates a comparison line graph showing trends between two data series with yearly x-axis
 * @param {string} seriesName1 - Name of first data series to compare
 * @param {string} seriesName2 - Name of second data series to compare
 * @param {string} selector - CSS selector for container element
 * @returns {Object} - Created visualization
 */
function createComparisonLineGraph(seriesName1, seriesName2, selector) {

  //log the selector as selector : selector
  console.log("selector : ", selector);


  // Clear any existing chart
  d3.select(selector).html("");
  
  // Get container width directly from the selector element
  const containerWidth = d3.select(selector).node().getBoundingClientRect().width;
  const containerHeight = d3.select(selector).node().getBoundingClientRect().height;
  
  // Adjust margins for smaller container
  const margin = { top: 10, right: 5, bottom: 20, left: 10 };
  const height = 650; // Slightly reduced height
  const width = 500; // Use almost full container width
  
  // Find the series in fullData based on their names
  const series1 = fullData.find(d => d.name === seriesName1);
  const series2 = fullData.find(d => d.name === seriesName2);
  
  // Check if both series were found
  if (!series1 || !series2) {
    console.error(`Series not found: ${!series1 ? seriesName1 : ''} ${!series2 ? seriesName2 : ''}`);
    return null;
  }
  
  // Combine data series into an array for easier processing
  const data = [series1, series2].filter(d => d && d.values && d.values.length > 0);
  
  if (data.length === 0) {
    console.error("No valid data provided for comparison line graph");
    return null;
  }
  
  // Calculate years from data length (assuming data starts from 2000 and has monthly values)
  const firstYear = 2000;
  const numYears = Math.ceil(data[0].values.length);
  const years = Array.from({length: numYears}, (_, i) => firstYear + i);
  
  // Calculate total width with spacing for years
  const totalWidth = Math.max(700, years.length * 35); 
  
  // Track visible lines
  const visibleLines = new Set([0, 1]); // Both lines visible initially
  
  // Create container with scrolling
  const container = d3.select(selector)
    .append("div")
    .attr("class", "chart-container")
    .style("width", `${width}px`)
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
  
  // Create color scale for exactly two series
  const colors = ["#4285F4", "#EA4335"]; // Blue and Red
  
  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, data[0].values.length - 1])
    .range([0, totalWidth]);
  
  // Create a separate scale for year labels
  const yearScale = d3.scalePoint()
    .domain(years)
    .range([0, totalWidth]);
  
  // Find min and max values across all datasets
  const allValues = data.flatMap(d => d.values.filter(v => !isNaN(v)));
  const maxValue = d3.max(allValues) * 1.1;
  const minValue = Math.min(d3.min(allValues), 100); // Ensure 100 is included in the range

  // Modify yScale to include 100
  const yScale = d3.scaleLinear()
    .domain([Math.min(0, minValue * 0.9), Math.max(maxValue, 110)]) // Ensure 100 is in visible range
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
  
  // Add reference line at 100
  chart.append("line")
    .attr("class", "reference-line")
    .attr("x1", 0)
    .attr("x2", totalWidth)
    .attr("y1", yScale(100))
    .attr("y2", yScale(100))
    .attr("stroke", "#ff9800") // Orange color for the reference line
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "5,3");

    
  // Add text label for the reference line
  chart.append("text")
    .attr("class", "reference-line-label")
    .attr("x", 5)
    .attr("y", yScale(100) - 5)
    .attr("fill", "#ff9800")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text("100 = Base");

  
  // Create custom X axis with years
  const xAxis = d3.axisBottom(yearScale)
    .tickFormat(d => d)
    .tickSize(10);
  
  const xAxisGroup = chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  
  // Adjust styling for year labels
  xAxisGroup.selectAll(".tick text")
    .style("font-size", "14px")
    .style("font-weight", "bold");
  
  // Add vertical grid lines for years
  chart.selectAll(".year-grid")
    .data(years)
    .enter()
    .append("line")
    .attr("class", "year-grid")
    .attr("x1", d => yearScale(d))
    .attr("x2", d => yearScale(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "3,3");
  
  const yAxis = d3.axisLeft(yScale);
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);
  
    
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
  
  // Function to get year and month from data index
  function getYearMonth(index) {
    const year = firstYear + Math.floor(index);
    const month = index % 12;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { year, monthName: monthNames[0] };
  }
  
  // Function to update visibility of lines
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
      
      // Update dots visibility
      chart.selectAll(`.dot-${i}`)
        .style("opacity", visibleLines.has(i) ? 1 : 0.15);
    });
  }
  
  // Create lines and points for each data series
  data.forEach((d, i) => {
    // Create the line path
    const linePath = chart.append("path")
      .datum(d.values)
      .attr("class", `line-${i}`)
      .attr("fill", "none")
      .attr("stroke", colors[i])
      .attr("stroke-width", 2)
      .attr("d", line);
    
    // Filter out invalid values before creating points
    const validValues = d.values.map((v, j) => ({
      value: v,
      index: j,
      isValid: v !== null && v !== undefined && !isNaN(v)
    })).filter(d => d.isValid);
    
    // Add dots for each valid data point with hover and click interaction
    chart.selectAll(`.dot-${i}`)
      .data(validValues)
      .enter()
      .append("circle")
      .attr("class", `dot-${i}`)
      .attr("cx", d => xScale(d.index))
      .attr("cy", d => yScale(d.value))
      .attr("r", 3.5)
      .attr("fill", colors[i])
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Enlarge the dot on hover
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 7)
          .attr("stroke-width", 2);
          
        // Update tracking line position
        trackingLine
          .attr("x1", xScale(d.index))
          .attr("x2", xScale(d.index))
          .style("opacity", 1);
        
        // Get date info
        const { year, monthName } = getYearMonth(d.index);
        
        // Build tooltip content
        let tooltipContent = `
          <div style="color:${colors[i]}; border-bottom: 2px solid ${colors[i]}; padding-bottom: 5px; margin-bottom: 8px;">
            <strong>${data[i].name}</strong>
          </div>
          <strong>Date:</strong> ${monthName} ${year}<br>
          <strong>Value:</strong> ${d.value.toFixed(2)}
        `;
        
        // Show tooltip
        tooltip
          .style("opacity", 1)
          .style("border-left", `4px solid ${colors[i]}`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px")
          .html(tooltipContent);
      })
      .on("mousemove", function(event) {
        if (!visibleLines.has(i)) return;
        
        // Move tooltip with mouse
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
        if (!visibleLines.has(i)) return;
        
        // Reset dot size
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 3.5)
          .attr("stroke-width", 1.5);
        
        // Hide tracking line and tooltip
        trackingLine.style("opacity", 0);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        if (!visibleLines.has(i)) return; // Skip if line is not visible
        
        // Get year for search
        const { year } = getYearMonth(d.index);
        
        // Prepare search query
        const searchQuery = encodeURIComponent(` raison de l'augmentaion de ${data[i].name} ${year} Suisse`);
        const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
        
        // Open new tab with search
        window.open(searchUrl, '_blank');
      });
  });
  
  // Add legend with clickable items
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${margin.left+ 50 }, ${margin.top + 350})`);
  
  
  // Add legend items for each dataset
  data.forEach((d, i) => {
    const legendItem = legend.append("g")
      .attr("class", `legend-item-${i}`)
      .attr("transform", `translate(${i * 250}, 25)`)
      .style("cursor", "pointer")
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
      .attr("fill", colors[i]);
    
    legendItem.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(d.name)
      .style("font-size", "12px");
  });
  
  // Initialize visibility
  updateVisibility();
  
  // If chart needs to scroll, add responsive behavior
  if (totalWidth > width) {
    chart.attr("transform", `translate(${margin.left}, ${margin.top}) scale(${width/totalWidth})`);
    // Adjust other elements to match the scaling
  } else {
    chart.attr("transform", `translate(${margin.left}, ${margin.top})`);
  }
  
  // Return the SVG without adding any buttons
  return svg;
}

/**
 * Creates a comparison bar graph showing two data series side by side
 * @param {string} seriesName1 - Name of first data series to compare
 * @param {string} seriesName2 - Name of second data series to compare
 * @param {string} selector - CSS selector for container element
 * @returns {Object} - Created visualization
 */
function createComparisonBarGraph(seriesName1, seriesName2, selector) {
  // Clear any existing chart
  d3.select(selector).html("");
  
  // Get container width directly 
  const containerWidth = d3.select(selector).node().getBoundingClientRect().width;
  const containerHeight = d3.select(selector).node().getBoundingClientRect().height;
  
  // Adjust margins for smaller container
  const margin = { top: 10, right: 5, bottom: 20, left: 5 };
  const height = 350;
  const width = containerWidth - margin.left - margin.right;
  
  // Find the series in fullData based on their names
  const series1 = fullData.find(d => d.name === seriesName1);
  const series2 = fullData.find(d => d.name === seriesName2);
  
  // Check if both series were found
  if (!series1 || !series2) {
    console.error(`Series not found: ${!series1 ? seriesName1 : ''} ${!series2 ? seriesName2 : ''}`);
    return null;
  }
  
  // Combine data series into an array for processing
  const data = [series1, series2];
  
  // Calculate first-to-last difference for each series
  const diffData = data.map(series => {
    // Find first valid value
    let firstValue = null;
    for (let i = 0; i < series.values.length; i++) {
      if (series.values[i] !== null && series.values[i] !== undefined && !isNaN(series.values[i])) {
        firstValue = series.values[i];
        break;
      }
    }
    
    // Find last valid value
    let lastValue = null;
    for (let i = series.values.length - 1; i >= 0; i--) {
      if (series.values[i] !== null && series.values[i] !== undefined && !isNaN(series.values[i])) {
        lastValue = series.values[i];
        break;
      }
    }
    
    // Calculate difference
    const difference = lastValue - firstValue;
    
    return {
      name: series.name,
      firstValue: firstValue,
      lastValue: lastValue,
      difference: difference
    };
  });
  
  // Rest of the function remains the same
  // Create container
  const container = d3.select(selector)
    .append("div")
    .attr("class", "chart-container")
    .style("width", `${width}px`)
    .style("margin", "0 auto")
    .style("position", "relative");
  
  // Create SVG
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom);
  
  // Create chart group
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Set up width calculations
  const chartWidth = width - margin.left - margin.right;
  
  // Create color scale for exactly two series
  const colors = ["#4285F4", "#EA4335"]; // Blue and Red
  
  // Create scales
  const xScale = d3.scaleBand()
    .domain(diffData.map(d => d.name))
    .range([0, chartWidth])
    .padding(0.3);
  
  // Find min and max values
  const maxValue = d3.max(diffData, d => d.difference) * 1.1;
  const minValue = d3.min(diffData, d => d.difference) * 1.1;
  
  const yScale = d3.scaleLinear()
    .domain([Math.min(0, minValue), Math.max(0, maxValue)])
    .range([height, 0]);
  
  // Add zero line
  chart.append("line")
    .attr("class", "zero-line")
    .attr("x1", 0)
    .attr("x2", chartWidth)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", "#888")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "4");
  
  // Create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Add axes
  chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${yScale(0)})`)
    .call(xAxis)
    .selectAll("text")
    .style("opacity", 0); // Hide default labels
  
  // Add custom underlined labels
  chart.selectAll(".column-title")
    .data(diffData)
    .enter()
    .append("g")
    .attr("class", "column-title")
    .attr("transform", d => `translate(${xScale(d.name)}, ${height + 30})`)
    .each(function(d, i) {
      const g = d3.select(this);
      
      // Add the text label
      g.append("text")
        .attr("x", 5) // Small left margin
        .attr("y", 0)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("text-anchor", "start") // Left-aligned
        .text(d.name);
      
      // Add the underline with the same color as the bar
      g.append("line")
        .attr("x1", 5)
        .attr("x2", xScale.bandwidth() - 5)
        .attr("y1", 5) // Just below the text
        .attr("y2", 5)
        .attr("stroke", colors[i])
        .attr("stroke-width", 2.5);
      
      // Add the year range below
      g.append("text")
        .attr("x", 5)
        .attr("y", 25)
        .style("font-size", "12px")
        .style("fill", "#666")
        .style("text-anchor", "start") // Left-aligned
        .text("2000 à 2025");
    });
  
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);
  
  // Create tooltip
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
  
  // Create bars
  chart.selectAll(".bar")
    .data(diffData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.name))
    .attr("width", xScale.bandwidth())
    .attr("y", d => d.difference > 0 ? yScale(d.difference) : yScale(0))
    .attr("height", d => Math.abs(yScale(d.difference) - yScale(0)))
    .attr("fill", (d, i) => colors[i])
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      // Highlight bar
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", d3.color(colors[diffData.indexOf(d)]).darker(0.5));
      
      // Calculate percent change
      const percentChange = ((d.lastValue - d.firstValue) / Math.abs(d.firstValue) * 100).toFixed(2);
      
      // Show tooltip
      let tooltipContent = `
        <div style="color:${colors[diffData.indexOf(d)]}; border-bottom: 2px solid ${colors[diffData.indexOf(d)]}; padding-bottom: 5px; margin-bottom: 8px;">
          <strong>${d.name}</strong>
        </div>
        <strong>First Value:</strong> ${d.firstValue.toFixed(2)}<br>
        <strong>Last Value:</strong> ${d.lastValue.toFixed(2)}<br>
        <strong>Change:</strong> ${d.difference.toFixed(2)} (${percentChange}%)
      `;
      
      tooltip
        .style("opacity", 1)
        .style("border-left", `4px solid ${colors[diffData.indexOf(d)]}`)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 30) + "px")
        .html(tooltipContent);
    })
    .on("mousemove", function(event) {
      // Move tooltip with mouse
      tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function(event, d) {
      // Reset bar color
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", colors[diffData.indexOf(d)]);
      
      // Hide tooltip
      tooltip.style("opacity", 0);
    });
  
  // Add value labels on top of bars
  chart.selectAll(".value-label")
    .data(diffData)
    .enter()
    .append("text")
    .attr("class", "value-label")
    .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
    .attr("y", d => d.difference > 0 ? yScale(d.difference) - 10 : yScale(d.difference) + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", d => d.difference > 0 ? "#333" : "#333")
    .text(d => d.difference.toFixed(2)+ "%");
  
  // Add first-to-last year range label below each bar
  chart.selectAll(".year-range")
    .data(diffData)
    .enter()
    .append("text")
    .attr("class", "year-range")
    .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .text("2000 à 2025");
  
  return svg;
}

// Update exports to include the new function
export { data, gameData, fullData, createBarGraph, createFullLineGraph, createComparisonLineGraph, createComparisonBarGraph,calculateDiffValue};