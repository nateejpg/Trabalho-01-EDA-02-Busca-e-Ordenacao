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

function renderArray(activeIndices = [], swapIndices = [], sortedIndices = [], pivotIndex = -1) {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        if (sortedIndices.includes(index)) {
            bar.classList.add('sorted');
        }
        if (index === pivotIndex) {
            bar.classList.add('pivot');
        }
        if (swapIndices.includes(index)) {
            bar.classList.add('swap');
        } else if (activeIndices.includes(index)) {
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

async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        let pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
    if (low === 0 && high === array.length - 1) {
        renderArray([], [], [...Array(array.length).keys()]);
        updateStatus('Array Ordenado!');
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
    updateStatus(`Pivô escolhido: ${pivot}`);
    renderArray([], [], [], high);
    await sleep(600);

    for (let j = low; j < high; j++) {
        updateStatus(`Comparando ${array[j]} com o pivô ${pivot}`);
        renderArray([j], [], [], high);
        await sleep(350);
        if (array[j] < pivot) {
            i++;
            updateStatus(`Trocando ${array[i]} e ${array[j]}`);
            renderArray([], [i, j], [], high);
            await sleep(600);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    updateStatus(`Trocando pivô ${array[high]} com ${array[i + 1]}`);
    renderArray([], [i + 1, high]);
    await sleep(600);
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
}

async function mergeSort(l = 0, r = array.length - 1) {
    if (l >= r) {
        return;
    }
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);

    if (l === 0 && r === array.length - 1) {
        renderArray([], [], [...Array(array.length).keys()]);
        updateStatus('Array Ordenado!');
    }
}

async function merge(l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[l + i];
    for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];

    let i = 0;
    let j = 0;
    let k = l;

    while (i < n1 && j < n2) {
        updateStatus(`Mesclando subarrays: comparando ${L[i]} e ${R[j]}`);
        renderArray([l + i, m + 1 + j]);
        await sleep(350);
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        renderArray([], [k]);
        await sleep(350);
        k++;
    }

    while (i < n1) {
        array[k] = L[i];
        renderArray([], [k]);
        await sleep(350);
        i++;
        k++;
    }

    while (j < n2) {
        array[k] = R[j];
        renderArray([], [k]);
        await sleep(350);
        j++;
        k++;
    }
}

async function heapSort() {
  let n = array.length;
  const sortedIndices = [];

  // Constrói o heap máximo (reorganiza o array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // Extrai um por um os elementos do heap
  for (let i = n - 1; i > 0; i--) {
    updateStatus(`Trocando ${array[0]} e ${array[i]}`);
    renderArray([], [0, i], sortedIndices);
    await sleep(600);

    [array[0], array[i]] = [array[i], array[0]];
    sortedIndices.push(i);

    renderArray([], [], sortedIndices);
    await sleep(350);

    await heapify(i, 0);
  }

  sortedIndices.push(0); // último elemento ordenado
  renderArray([], [], [...Array(array.length).keys()]);
  updateStatus('Array Ordenado!');
}

// Função para transformar um subárvore em heap, dado um nó raiz i e tamanho n
async function heapify(n, i) {
  let maior = i;            // Inicializa o maior como raiz
  let esquerda = 2 * i + 1; // filho esquerdo
  let direita = 2 * i + 2;  // filho direito

  if (esquerda < n) {
    updateStatus(`Comparando ${array[esquerda]} e ${array[maior]}`);
    renderArray([esquerda, maior]);
    await sleep(350);
    if (array[esquerda] > array[maior]) {
      maior = esquerda;
    }
  }

  if (direita < n) {
    updateStatus(`Comparando ${array[direita]} e ${array[maior]}`);
    renderArray([direita, maior]);
    await sleep(350);
    if (array[direita] > array[maior]) {
      maior = direita;
    }
  }

  if (maior !== i) {
    updateStatus(`Trocando ${array[i]} e ${array[maior]}`);
    renderArray([], [i, maior]);
    await sleep(600);

    [array[i], array[maior]] = [array[maior], array[i]];
    renderArray([i, maior]);
    await sleep(350);

    await heapify(n, maior);
  }
}

async function bucketSort(bucketSize = 5) {
    if (array.length === 0) return array;

    const minValue = Math.min(...array);
    const maxValue = Math.max(...array);

    const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    let buckets = Array.from({ length: bucketCount }, () => []);

    updateStatus(`Distribuindo elementos em ${bucketCount} buckets...`);
    await sleep(600);

    // Distribui elementos nos buckets
    for (let i = 0; i < array.length; i++) {
        let bucketIndex = Math.floor((array[i] - minValue) / bucketSize);
        buckets[bucketIndex].push(array[i]);
        renderArray([i]); // destaca o elemento sendo distribuído
        await sleep(300);
    }

    updateStatus(`Ordenando cada bucket individualmente...`);
    await sleep(600);

    // Ordena cada bucket
    array.length = 0;
    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i].length > 0) {
            // Usando insertion sort para manter didático
            for (let j = 1; j < buckets[i].length; j++) {
                let key = buckets[i][j];
                let k = j - 1;
                while (k >= 0 && buckets[i][k] > key) {
                    buckets[i][k + 1] = buckets[i][k];
                    k--;
                }
                buckets[i][k + 1] = key;
            }

            updateStatus(`Bucket ${i} ordenado: [${buckets[i].join(', ')}]`);
            await sleep(600);
        }

        // Concatena no array final
        for (let j = 0; j < buckets[i].length; j++) {
            array.push(buckets[i][j]);
            renderArray([], [array.length - 1]); // destaca a inserção no array final
            await sleep(300);
        }
    }

    renderArray([], [], [...Array(array.length).keys()]);
    updateStatus('Array Ordenado!');
}



const algorithmSummaries = {
  bubble: '<b>Bubble Sort</b>: compara pares de elementos adjacentes e os troca se estiverem na ordem errada. O processo se repete até que o array esteja ordenado.<br><b>Uso:</b> Didático, para ensino e listas pequenas.<br><b>Curiosidade:</b> É um dos algoritmos mais simples, mas raramente usado na prática devido à sua baixa eficiência.',
  selection: '<b>Selection Sort</b>: percorre o array procurando o menor elemento e o coloca na primeira posição, depois repete para as próximas posições.<br><b>Uso:</b> Didático, fácil de implementar.<br><b>Curiosidade:</b> Faz o menor número possível de trocas entre os algoritmos de ordenação quadrática.',
  insertion: '<b>Insertion Sort</b>: constrói o array ordenado um elemento por vez, inserindo cada novo elemento na posição correta.<br><b>Uso:</b> Pequenas listas, arrays quase ordenados.<br><b>Curiosidade:</b> É o algoritmo usado por humanos ao ordenar cartas de baralho.',
  quicksort: '<b>Quick Sort</b>: usa a estratégia de "dividir para conquistar". Escolhe um elemento como pivô e particiona o array, de modo que elementos menores que o pivô fiquem antes e maiores depois.<br><b>Uso:</b> Muito eficiente e amplamente utilizado na prática.<br><b>Curiosidade:</b> Seu desempenho depende muito da escolha do pivô.',
  mergesort: '<b>Merge Sort</b>: também "divide para conquistar". Divide o array ao meio, ordena cada metade recursivamente e depois mescla as duas metades ordenadas.<br><b>Uso:</b> Ótimo para grandes volumes de dados e quando a estabilidade da ordenação é importante.<br><b>Curiosidade:</b> Garante o tempo de O(n*log n), mas requer memória extra.',
  heapsort: '<b>Heap Sort</b>: constrói uma estrutura de heap (árvore binária) e extrai repetidamente o maior elemento, colocando-o no final do array.<br><b>Uso:</b> Muito eficiente em termos de complexidade O(n log n) e não requer memória extra.<br><b>Curiosidade:</b> É usado em sistemas embarcados onde a memória é limitada.',
  bucketsort: '<b>Bucket Sort</b>: distribui elementos em "baldes" (buckets), ordena cada bucket e depois os concatena.<br><b>Uso:</b> Bom para dados uniformemente distribuídos em um intervalo.<br><b>Curiosidade:</b> Em alguns cenários pode ter desempenho próximo a O(n).'
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
  else if (algorithm === 'quicksort') await quickSort();
  else if (algorithm === 'mergesort') await mergeSort();
  else if (algorithm === 'heapsort') await heapSort();
  else if (algorithm === 'bucketsort') await bucketSort();



  sortBtn.disabled = false;
  generateBtn.disabled = false;
  setArrayBtn.disabled = false;
});

generateBtn.addEventListener('click', generateArray);
setArrayBtn.addEventListener('click', setArrayFromInput);

generateArray();