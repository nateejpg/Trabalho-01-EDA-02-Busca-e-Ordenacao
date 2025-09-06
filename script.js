const arrayContainer = document.getElementById('array-container');
const generateBtn = document.getElementById('generate');
const sortBtn = document.getElementById('sort');
const sizeInput = document.getElementById('size');
const algorithmSelect = document.getElementById('algorithm');
const manualInput = document.getElementById('manual-input');
const setArrayBtn = document.getElementById('set-array');
const algorithmStatus = document.getElementById('algorithm-status');

let array = [];

function updateStatus(message) {
  algorithmStatus.innerHTML = message;
}

function generateArray() {
  const size = parseInt(sizeInput.value);
  array = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 1);
  renderArray();
  manualInput.value = array.join(', ');
  updateStatus('');
}

function setArrayFromInput() {
  const values = manualInput.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
  if (values.length < 2) {
    alert('Insira pelo menos dois valores válidos separados por vírgula.');
    return;
  }
  array = values;
  sizeInput.value = values.length;
  renderArray();
  updateStatus('');
}

function renderArray(activeIndices = [], swapIndices = [], sortedIndices = []) {
  arrayContainer.innerHTML = '';
  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    if (sortedIndices.includes(index)) {
        bar.classList.add('sorted');
    }
    if (swapIndices.includes(index)) {
        bar.classList.add('swap');
    }
    else if (activeIndices.includes(index)) {
        bar.classList.add('active');
    }
    bar.style.height = `${value * 3}px`;
    bar.textContent = value;
    arrayContainer.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    const sortedIndices = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            updateStatus(`Comparando ${array[j]} e ${array[j + 1]}`);
            renderArray([j, j + 1],[], sortedIndices);
            await sleep(350);
            if (array[j] > array[j + 1]) {
                updateStatus(`Trocando ${array[j]} e ${array[j + 1]}`);
                renderArray([], [j, j + 1], sortedIndices);
                await sleep(600);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderArray([j, j+1], [], sortedIndices);
                await sleep(350);
            }
        }
        sortedIndices.push(array.length - 1 - i);
    }
    renderArray([], [], [...Array(array.length).keys()]);
    updateStatus('Array Ordenado!');
}


async function selectionSort() {
    const sortedIndices = [];
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            updateStatus(`Procurando o menor elemento... Comparando ${array[minIdx]} e ${array[j]}`);
            renderArray([minIdx, j], [], sortedIndices);
            await sleep(350);
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            updateStatus(`Trocando ${array[i]} e ${array[minIdx]}`);
            renderArray([], [i, minIdx], sortedIndices);
            await sleep(600);
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
        }
        sortedIndices.push(i);
        renderArray([], [], sortedIndices);
        await sleep(350);
    }
    renderArray([],[],[...Array(array.length).keys()]);
    updateStatus('Array Ordenado!');
}


async function insertionSort() {
  const sortedIndices = [0];
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    updateStatus(`Inserindo ${key} na parte ordenada...`);
    renderArray([i], [], [...sortedIndices]);
    await sleep(350);

    while (j >= 0 && array[j] > key) {
      updateStatus(`Movendo ${array[j]} para a direita`);
       renderArray([ j + 1], [j], sortedIndices);
      await sleep(600);
      array[j + 1] = array[j];
      j--;
       renderArray([j + 1], [], sortedIndices);
       await sleep(350);
    }
    array[j + 1] = key;
    sortedIndices.push(i);
    sortedIndices.sort((a,b) => a-b);
  }

  renderArray([],[],[...Array(array.length).keys()]);
  updateStatus('Array Ordenado!');
}


const algorithmSummaries = {
  bubble: '<b>Bubble Sort</b>: compara pares de elementos adjacentes e os troca se estiverem na ordem errada. O processo se repete até que o array esteja ordenado.<br><b>Uso:</b> Didático, para ensino e listas pequenas.<br><b>Curiosidade:</b> É um dos algoritmos mais simples, mas raramente usado na prática devido à sua baixa eficiência.',
  selection: '<b>Selection Sort</b>: percorre o array procurando o menor elemento e o coloca na primeira posição, depois repete para as próximas posições.<br><b>Uso:</b> Didático, fácil de implementar.<br><b>Curiosidade:</b> Faz o menor número possível de trocas entre os algoritmos de ordenação quadrática.',
  insertion: '<b>Insertion Sort</b>: constrói o array ordenado um elemento por vez, inserindo cada novo elemento na posição correta.<br><b>Uso:</b> Pequenas listas, arrays quase ordenados.<br><b>Curiosidade:</b> É o algoritmo usado por humanos ao ordenar cartas de baralho.'
};

function updateAlgorithmSummary() {
  const summaryDiv = document.getElementById('algorithm-summary');
  const key = algorithmSelect.value;
  summaryDiv.innerHTML = algorithmSummaries[key] || '';
}

algorithmSelect.addEventListener('change', updateAlgorithmSummary);

window.addEventListener('DOMContentLoaded', updateAlgorithmSummary);

sortBtn.addEventListener('click', async () => {
  sortBtn.disabled = true;
  generateBtn.disabled = true;
  setArrayBtn.disabled = true;

  const algorithm = algorithmSelect.value;
  if (algorithm === 'bubble') await bubbleSort();
  else if (algorithm === 'selection') await selectionSort();
  else if (algorithm === 'insertion') await insertionSort();

  sortBtn.disabled = false;
  generateBtn.disabled = false;
  setArrayBtn.disabled = false;
});

generateBtn.addEventListener('click', generateArray);
setArrayBtn.addEventListener('click', setArrayFromInput);

generateArray();