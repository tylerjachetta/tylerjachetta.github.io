var width = 100, 
    height = 100,
    callCount1 = 0,
    callCount2 = 0,
    arry, 
    prevArry,
    clearTimeoutArray = [];


function beginSort(start) {
  var size = $(".field1").val(), 
      delay = $(".field2").val();
  
  if (callCount1){
    prevArry = arry.slice(0);
  }
  arry = createArray($('input[name=arrayComp]:checked').val(), size);
  if (callCount1 && start){
    arry = prevArry.slice(0);
  }

  var graph1 = new Graph($('*[data-graphContainer="0"]').find('svg').attr('class'), arry);
  var graph2 = new Graph($('*[data-graphContainer="1"]').find('svg').attr('class'), arry);
  var graph3 = new Graph($('*[data-graphContainer="2"]').find('svg').attr('class'), arry);
  var graph4 = new Graph($('*[data-graphContainer="3"]').find('svg').attr('class'), arry);

    graph1.createGraph(start);
    graph2.createGraph(start);
    graph3.createGraph(start);
    graph4.createGraph(start);

  
    
  
  callCount1++;
}

function Graph(sortingAlgorithm, data) {
  this.data = data.slice(0);
  this.displayArray = createDisplayArray(this.data, sortingAlgorithm);
  this.unsortedData = this.displayArray[0];
  this.createGraph = function(start) {
    createGraph(this.displayArray, "." + sortingAlgorithm, start)
  };
}

function createArray(arrayComp, size) {
  var dataset = [];
  var temp;
  console.log(arrayComp);
  if (arrayComp == "random" || arrayComp == "reversed" || arrayComp == "nearlySorted") {
    for (i = 0; i < size; i++) {
      dataset[i] = i + 1;
    }

    if (arrayComp == "random") {
      shuffle(dataset)
    } 
     else if (arrayComp == "nearlySorted") {
      temp = dataset[dataset.length - 1];
      dataset[dataset.length - 1] = dataset[dataset.length/2];
      dataset[dataset.length/2] = temp;
    }
    else if (arrayComp == "reversed"){
      dataset.reverse();
    }
  } 
  else if (arrayComp == "fewUnique") {
    var j = 0;
    for (i = 0; i < size; i++) {
      if (i % (size / 10) == 0) {
        j += size / 10;
      }
      dataset[i] = j;
    }
    shuffle(dataset);
  }
  return dataset;
}

function createDisplayArray(dataset, sortingAlgorithm) {
  var displayArray = [];
  if (sortingAlgorithm == "bubbleSort") {
    displayArray = bubbleSort(dataset)
  } 
  else if (sortingAlgorithm == "selectionSort") {
    displayArray = selectionSort(dataset)
  }
  else if (sortingAlgorithm == "cocktailSort") {
      displayArray = cocktailSort(dataset)
  }
  else if (sortingAlgorithm == "gnomeSort") {
      displayArray = gnomeSort(dataset)
  }
  else if (sortingAlgorithm == "insertionSort") {
      displayArray = insertionSort(dataset)
  }
  else if (sortingAlgorithm == "shellSort") {
      displayArray = shellSort(dataset)
  }

  return displayArray;
}

function createGraph(items, container, start) {
  
  var delay = $(".field2").val(),
  frameJumper = (items[0].length * .1) - 1;
  $(container).empty();
  for (var j = 0; j < items[0].length; j++)
  {
    d3.selectAll(container)
      .append("rect")
      .attr("id", function() {
        return "s" + j; 
      });
  }

  createInitalGraph(items[0], container);

  if (start){
    for (var i = 0; i < items.length; i+= frameJumper) {
      (function(i) {
        clearTimeoutArray.push(setTimeout(function() {
          updateGraph(items[Math.floor(i)], container);
          currentArray = Math.floor(i);
          if (i >=  items.length - frameJumper) {       
            setTimeout(function(){
              updateGraph(items[items.length - 1], container);
              showSortedGraph(items[Math.floor(i)], container);
            }, delay)
          }
        }, i * delay));
      })(i);
    }
  }
  
}

function createInitalGraph(initalGraph, container) {

  for (var j = 0; j < initalGraph.length; j++) {
    d3.selectAll(container).selectAll("#s" + (j))
      .attr("x", function() {
        return (j * (width  / initalGraph.length)) + "%";
      })
      .attr("y", function() {
        return height - initalGraph[j] * (100 / initalGraph.length) + "%";
      })
      .attr("width", (width / initalGraph.length - .1) + "%") 
      .attr("height", function() {
        return (initalGraph[j] * (100 / initalGraph.length)) + "%";
      })
      .attr("value", initalGraph[j])
      .attr("fill", function() {
        return "rgb(255,255,255)";
      });
  }
};

function updateGraph(items, container) {
  for (var j = 0; j < items.length; j++) {
    if (!($(container).find("#s" + j).attr('height') == (items[j] * (100 / items.length)) + "%")) {
      d3.selectAll(container).selectAll("#s" + (j))
        .attr("x", function() {
          return (j * (width / items.length)) + "%";
        })
        .attr("y", function() {
          return height - items[j] * (100 / items.length) + "%";
        })
        .attr("width", (width / items.length - .25) + "%") 
        .attr("height", function() {
          return (items[j] * ((100 / items.length))) + "%";
        })
        .attr("value", items[j])
        .attr("fill", function() {
          return "rgb(156,21,19)";
        });
    } else {
      d3.selectAll(container).selectAll("#s" + (j))
        .attr("fill", function() {
          return "rgb(255, 255, 255)";
        });
    }
  }


}

function showSortedGraph(items, container) {
  for (var i = 0; i < items.length; i++) {
    d3.selectAll(container).selectAll("#s" + (i))
      .attr("fill", function() {
        return "rgb(255, 255, 255)";
      });

  }


  for (var j = 0; j < items.length; j++) {
    (function(j) {
      clearTimeoutArray.push(setTimeout(function() {
      d3.selectAll(container).selectAll("#s" + (j))
        .attr("fill", function() {
          return "rgb(76,107,34)";
        });

      d3.selectAll(container).selectAll("#s" + (j + 1))
        .attr("fill", function() {
          return "rgb(156,21,19)";
        });

        if(j == items.length - 1)
        {
          isFinished();
        }
      }, j * 20));
    })(j);

  }
}

function stopSorting() {
  for (var i=0; i<clearTimeoutArray.length; i++) {
    clearTimeout(clearTimeoutArray[i]);
  }
  callCount1 = 0;
  callCount2 = 0;
}

function isFinished () {
  callCount2++;
  if(callCount2 == 4){
    $(".start").prop("disabled",false);   
    $(".start").html("Begin Sorting");
    $(".stop").css("display","none");
    callCount1 = 0;
    callCount2 = 0;
  }

  
}