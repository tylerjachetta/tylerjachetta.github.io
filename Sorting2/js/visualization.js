var w = 100;
var h = 100;
var barPadding = 0.2;

function graphObject(container, dataComp, algorithm) {
  var _this = this;   
  this.container = container;
  this.createDataSet = function() {
    var arry = [];
    for (var i = 0; i < 50; i++) {
      arry[i] = i + 1;
    }
    if (dataComp == 'random') {
      shuffle(arry);
      return arry
    } else if (dataComp == 'reverse') {
      arry.reverse();
      return arry

    }
  };
  this.dataSet = this.createDataSet();
  this.createInitalGraph = function() {
    var svg = d3.select(container)
		        .append('svg')
		        .attr('width', w + '%')
		        .attr('height', h + '%');

    svg.selectAll('rect')
      .data(this.dataSet)
      .enter()
      .append('rect')
      .attr('x', function(d, i) {
        return (i * (w / _this.dataSet.length)) + '%';
      })
      .attr('y', function(d) {
        return h - d * (100 / _this.dataSet.length) + '%';
      })
      .attr('width', (w / _this.dataSet.length - barPadding) + '%')
      .attr('height', function(d) {
        return d * (100 / _this.dataSet.length) + '%';
      })
      .attr('fill', function(d) {
        return '#ffffff';
      });
    svg.exit().remove();
  };
  this.deleteGraph = function() 
  {
    var svg = d3.select(container);
    svg.select('svg').remove();
  };
  this.animate = function() {
    var frameArray = [];     
    if (algorithm == 'bubbleSort') {
      frameArray = bubbleSort(this.dataSet);
    } else if (algorithm == 'selectionSort') {
      frameArray = selectionSort(this.dataSet);
    } else if (algorithm == 'cocktailSort') {
      frameArray = cocktailSort(this.dataSet);
    } else if (algorithm == 'gnomeSort') {
      frameArray = gnomeSort(this.dataSet);
    } else if (algorithm == 'shellSort') {
      frameArray = shellSort(this.dataSet);
    } else if (algorithm == 'insertionSort') {
      frameArray = insertionSort(this.dataSet);
    }
    for (var j = 1; j < frameArray.length; j++) {
      (function(j) {
        setTimeout(function() {
          _this.updateGraph(frameArray[j], frameArray[j - 1])
        }, j * 30);
      })(j);

    }
  };
  this.updateGraph = function(data, prevData) {
    var bars = d3.select(container)
      .select('svg')
      .selectAll('rect')
      .data(data);
    bars.enter()
      .append('rect');
    bars.attr('x', function(d, i) {
        return (i * (w / data.length)) + '%';
      })
      .attr('y', function(d) {
        return h - d * (100 / data.length) + '%';
      })
      .attr('width', (w / data.length - barPadding) + '%')
      .attr('height', function(d) {
        return d * (100 / data.length) + '%';
      })
      .attr('fill', function(d, i) {
        if (data[i] != prevData[i]) {
          return 'red';
        } else {
          return 'white';
        }
      });
    bars.exit().remove();
  };
}

function bubbleSort(items) {
  var displayArray = [],
      swapped,
      temp;
  do {
    swapped = false;
    for (var i = 0; i < items.length; i++) {
      displayArray.push(items.slice());
      if (items[i] > items[i + 1]) {
        temp = items[i];
        items[i] = items[i + 1];
        items[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  return displayArray;
}

function selectionSort(items) {
  var len = items.length,
    min,
    temp,
    displayArray = [];
  for (i = 0; i < len; i++) {
    min = i;
    for (j = i + 1; j < len; j++) {
      displayArray.push(items.slice());
      if (items[j] < items[min]) {
        min = j;
      }
    }
    if (i != min) {
      temp = items[i];
      items[i] = items[min];
      items[min] = temp;
    }
  }
  displayArray.push(items.slice());
  displayArray.push(items.slice());
  return displayArray;
}

function cocktailSort(items){
  var swapped;
  var displayArray = [];
  var temp;

  do {
      for (var i = 0; i <= items.length - 2; i++){
          displayArray.push(items.slice());
          if (items[i] > items[i + 1]){
              temp = items[i];
              items[i] = items[i + 1];
              items[i + 1] = temp;
              swapped = true;
          }
      }
      if (!swapped){
          break;
      }
      swapped = false;
      for (i = items.length - 2; i >= 0; i--){
          displayArray.push(items.slice());
          if (items[i] > items[i + 1]){
              temp= items[i];
              items[i] = items[i + 1];
              items[i + 1] = temp;
              swapped = true;
          }
      }
  } while (swapped);

  return displayArray;
}

function insertionSort(items) {
  var len = items.length,
      value,
      i,
      j,
      displayArray = [];

  for (i = 0; i < len; i++) {
      value = items[i];
      for (j = i - 1; j > -1 && items[j] > value; j--) {
          items[j + 1] = items[j];
          displayArray.push(items.slice());
      }
      items[j + 1] = value;
  }
  displayArray.push(items.slice());
  displayArray.push(items.slice());

  return displayArray;
}



function gnomeSort(items) {
  var i = 0,
      displayArray = [];
  while (i < items.length){
      if (i == 0 || items[i - 1] <= items[i]){
          i++;
          displayArray.push(items.slice());

      }
      else{
          tmp = items[i];
          items[i] = items[i - 1];
          items[--i] = tmp;
          displayArray.push(items.slice());

      }
  }
  return displayArray;
}

function shellSort (items) {
  var displayArray = []
  for (var h = items.length; h > 0; h = parseInt(h / 2)) {
      for (var i = h; i < items.length; i++) {
          var k = items[i];
          for (var j = i; j >= h && k < items[j - h]; j -= h)
          {
            displayArray.push(items.slice())
            items[j] = items[j - h];
          }
          items[j] = k;
      }
  }
  displayArray.push(items.slice())
  displayArray.push(items.slice())

  return displayArray;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex){
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
  	}
  	return array;
}


