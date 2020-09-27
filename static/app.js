// creating a function to read in the json file and 
// populates bacteria sample into html 
function buildMetaData(sample) {

    // promise for data elements contained in 'samples.json'
  d3.json("samples.json").then((data) => {
        // store returned key 'metadata' under var 'metadata'
    var metadata = data.metadata;

    // metadata key elements
        // [0] = "id"
        // [1] = "ethnicity"
        // [2] = "gender"
        // [3] = "age"
        // [4] = "location"
        // [5] = "bbtype"
        // [6] = "wfreq"
        
        // filter the data so the only value returned is 
        // the bacteria sample selected
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

        // storing the first metadata element (id) as it's own var
    var bactId = metadataArray[0];

        // selecting the panel to append list objects to 
    primaryPanelBody = d3.select("#sample-metadata");

        // clearing the panel of any existing values
    primaryPanelBody.html("");

        // use object.entries to return key value pairs 
    Object.entries(bactId).forEach(([key, value]) => {
      
      //  appends <h5> element to panel and populates text property to "'key' : 'value'"
      primaryPanelBody.append("h5").text(`${key} : ${value}`);
    });
    });
}

// creating a function to create the bar and bubble charts using 'sample' var as argument
function buildCharts(sample) {

  // "promise to return data element from 'samples.json'"
  d3.json("samples.json").then((data) => {

    // stores data.samples under sample var 
    var samples = data.samples;

    // returns single array for sample number selected
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    // the id is the first element, storing it as 'bactSampleId' (Bacteria Sample ID)
    var bactSampleId = samplesArray[0];

    // isolating the otu_ids' element and storing it 
    var otu_ids = bactSampleId.otu_ids;

    // isolating the otu_label element and storing it 
    var otu_labels = bactSampleId.otu_labels;

    // isolating the sample values and storing it 
    var sample_values = bactSampleId.sample_values;

    // create array of the top 10 most common bacteria (presorted in descending order)
    var top10bact = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    
    // creating dictionary of data for the bar chart
    var barData = [{
      // 
      x: sample_values.slice(0,10).reverse(),
      y: top10bact,
      //  sets text value as first 10 otu_labels
      text: otu_labels.slice(0,10).reverse(),
      // type of chart to plot
      type: "bar",
      // specifying the orientation of chart
      orientation : "h"}];
    
      // specifying layout parameters 
    var barLayout = {
      // title of the bar chart
      title: "Top 10 Bacteria Cultures Found",
      // setting margin (top)
      margin: {t:25}
    };
    // creating new plot in div id="bar" on html page, populated with 
    // barData and formatted with bayLayout
    Plotly.newPlot("bar", barData, barLayout);

  // storing data for the bubble chart into a dictionary variable
  var bubbleData = [
    // values for bubble chart 
          {
            // x values are the bacteria id
            x: otu_ids,
            // y values are the values of the samples identified
            y: sample_values,
            // the labels for the x values
            text: otu_labels,
            // specifying color and sizes of the bubbles
            mode: "markers",
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Jet"
            }
          }
        ];
  // specifying the layout of the bubble chart
  var bubbleLayout = {
    //main title
    title: "Bacteria Cultures Per Sample",

    margin: {t: 20},
    // specifying hoover event
    hovermode: "closest",
    // labeling the x axis
    xaxis: {title: "OTU ID"},
    margin: {t:25}
  };
// ploting the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// creating initiate function to execute program
function init() {
  // setting variable to the dropdown list
  var selectSample = d3.select("#selDataset");
  // reading in the data from the json file
  d3.json("samples.json").then((data) => {
    // setting the name for the samples
    var bactName = data.names;

    // creating options for the drop down list by appending options
    // with the text element and value as 'sample'
    bactName.forEach((sample) => {
      selectSample
        .append("option")
        .text(sample)
        .property("value", sample)
    });

    // creates a default graph so the page opens with graphs
    // already populated values equal to the first sample
    var defaultSelection = bactName[0];
    buildCharts(defaultSelection)
    buildMetaData(defaultSelection);
  });
};

// executes buildChart and buildMetaData function if the drop down 
// is changed. Takes single argument which is equal to the dropdown value selected
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetaData(newSample);
}

// executes the code
init();