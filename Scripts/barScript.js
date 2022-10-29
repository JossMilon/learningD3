fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    //Store the dataset
    const dataset = data.data;

    //Get the dataset domain for Y axis
    const minY = d3.min(dataset, (dataPoint) => dataPoint[1]);
    const maxY = d3.max(dataset, (dataPoint) => dataPoint[1]);

    //Get the dataset domain for X axis
    const minX = d3.min(dataset, (dataPoint) => {
      const minDate = new Date(dataPoint[0]);
      return minDate.getFullYear();
    });
    const maxX = d3.max(dataset, (dataPoint) => {
      const maxDate = new Date(dataPoint[0]);
      return maxDate.getFullYear();
    });

    //Define main SVG size
    const w = 1000;
    const h = 500;
    const padding = 40;

    //Set main SVG
    const svg = d3
      .select("body")
      .append("svg")
      .attr("class", "chart")
      .attr("width", w + padding)
      .attr("height", h + padding);

    //Creating the scale
    const yScale = d3.scaleLinear();
    yScale.domain([minY, maxY]);
    yScale.range([h, 0]);

    const xScale = d3.scaleLinear();
    xScale.domain([minX, maxX]);
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

    //Adding the chart
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (gdp, i) => {
        return padding + i * (w / dataset.length);
      })
      .attr("y", (gdp) => yScale(gdp[1]))
      .attr("width", (gdp) => w / dataset.length)
      .attr("height", (gdp) => h - yScale(gdp[1]))
      .attr("data-date", (gdp) => gdp[0])
      .attr("data-gdp", (gdp) => gdp[1])
      .attr("fill", "pink")
      .attr("class", "bar")
      .attr("data-index", (gdp, index) => index)
      .on("mouseover", (d) => {
        const date = d.toElement.getAttribute("data-date");
        const gdp = d.toElement.getAttribute("data-gdp");
        const left = Number(d.toElement.getAttribute("x")) + 100;
        const top = Number(d.toElement.getAttribute("y"));
        const html = `<div><div>${date}</div><div>$${gdp} billion</div></div>`;
        tooltip.style("opacity", 0.9);
        tooltip.attr("data-date", d[1]);
        tooltip.html(html).style("left", `${left}px`).style("top", `${top}px`);
      })
      .on("mouseout", (d) => {
        tooltip.style("opacity", 0);
      });
  });
