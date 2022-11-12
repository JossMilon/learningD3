fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => {
    return response.json();
  })
  .then((dataset) => {
    //Get the dataset domain for Y axis
    const minY = d3.min(dataset, (dataPoint) => dataPoint.Seconds);
    const maxY = d3.max(dataset, (dataPoint) => dataPoint.Seconds);

    console.log(dataset);

    //Get the dataset domain for X axis
    const minX = d3.min(dataset, (dataPoint) => dataPoint.Year);
    const maxX = d3.max(dataset, (dataPoint) => dataPoint.Year);

    // //Define main SVG size
    const w = 1000;
    const h = 500;
    const padding = 40;

    // //Set main SVG
    const svg = d3
      .select("body")
      .append("svg")
      .attr("class", "chart")
      .attr("width", w + padding)
      .attr("height", h + padding)
      .style("position", "relative");

    // //Creating the scale
    const yScale = d3.scaleLinear();
    yScale.domain([maxY + 15, minY]);
    yScale.range([h, 0]);

    const xScale = d3.scaleLinear();
    xScale.domain([minX - 1, maxX + 1]);
    xScale.range([0, w]);

    const yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .attr("id", "hello")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("id", "hello")
      .attr("transform", `translate(${padding}, ${h})`)
      .call(xAxis);

    //Adding tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // //Adding the chart
    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("seconds", (dataPoint) => dataPoint.Time)
      .attr("year", (dataPoint) => dataPoint.Year)
      .attr("doping", (dataPoint) => dataPoint.Doping)
      .attr("nationality", (dataPoint) => dataPoint.Nationality)
      .attr("name", (dataPoint) => dataPoint.Name)
      .attr("cx", (dataPoint) => xScale(dataPoint.Year) + padding)
      .attr("cy", (dataPoint) => yScale(dataPoint.Seconds) + padding)
      .attr("r", 5)
      .attr("fill", (dataPoint) => {
        return dataPoint.Doping.length > 0 ? "navy" : "orange";
      })
      .attr("class", "stats")
      .on("mouseover", (d) => {
        const seconds = d.toElement.getAttribute("seconds");
        const year = d.toElement.getAttribute("year");
        const doping = d.toElement.getAttribute("doping");
        const name = d.toElement.getAttribute("name");
        const nationality = d.toElement.getAttribute("nationality");
        const left = Number(d.toElement.getAttribute("cx")) + 220;
        const top = Number(d.toElement.getAttribute("cy")) + 100;
        const html = `<div>
            <div>${name} - ${nationality}</div>
            <div>${year} - ${seconds}</div>
            <div>${doping}</div>
        </div>`;
        tooltip.style("opacity", 0.9);
        tooltip
          .html(html)
          .style("position", "absolute")
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mouseout", (d) => {
        tooltip.style("opacity", 0.9);
      });
  });
