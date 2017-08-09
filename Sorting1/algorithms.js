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

  return displayArray;
}

function cocktailSort(items){
  var swapped;
  var displayArray = [];
  var temp;

  do {
      for (var i = 0; i <= items.length - 2; i++){
          displayArray.push(items.slice());
          if (items[i] > items[i + 1])
          {
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

function insertionSort(items)
{
  var len = items.length,
      value,
      i,
      j,
      displayArray = [];

  for (i = 0; i < len; i++)
  {
      value = items[i];
      for (j = i - 1; j > -1 && items[j] > value; j--)
      {
          items[j + 1] = items[j];
          displayArray.push(items.slice());
      }
      items[j + 1] = value;
  }
  displayArray.push(items.slice());
  displayArray.push(items.slice());

  return displayArray;
}



function gnomeSort(items)
{
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

  return displayArray;
}

function shuffle(a) {
  var j, x, i;

  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }

  return a;
}