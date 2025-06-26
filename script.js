class SortingVisualizer {
  constructor() {
    this.array = [];
    this.arraySize = 50;
    this.speed = 50;
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;

    this.initializeElements();
    this.setupEventListeners();
    this.generateArray();
    this.updateAlgorithmInfo("bubble");
  }

  initializeElements() {
    this.arrayContainer = document.getElementById("array-container");
    this.algorithmSelect = document.getElementById("algorithm-select");
    this.arraySizeSlider = document.getElementById("array-size");
    this.speedSlider = document.getElementById("speed-control");
    this.generateBtn = document.getElementById("generate-btn");
    this.startBtn = document.getElementById("start-btn");
    this.stopBtn = document.getElementById("stop-btn");
    this.sizeValue = document.getElementById("size-value");
    this.speedValue = document.getElementById("speed-value");
    this.comparisonsSpan = document.getElementById("comparisons");
    this.swapsSpan = document.getElementById("swaps");
    this.timeComplexitySpan = document.getElementById("time-complexity");
    this.spaceComplexitySpan = document.getElementById("space-complexity");
    this.algorithmInfo = document.getElementById("algorithm-info");
  }

  setupEventListeners() {
    this.arraySizeSlider.addEventListener("input", (e) => {
      this.arraySize = parseInt(e.target.value);
      this.sizeValue.textContent = this.arraySize;
      if (!this.isRunning) this.generateArray();
    });

    this.speedSlider.addEventListener("input", (e) => {
      this.speed = parseInt(e.target.value);
      this.speedValue.textContent = `${101 - this.speed}ms`;
    });

    this.generateBtn.addEventListener("click", () => {
      if (!this.isRunning) this.generateArray();
    });

    this.startBtn.addEventListener("click", () => {
      if (!this.isRunning) this.startSorting();
    });

    this.stopBtn.addEventListener("click", () => {
      this.stopSorting();
    });

    this.algorithmSelect.addEventListener("change", (e) => {
      this.updateAlgorithmInfo(e.target.value);
    });

    // Tab buttons for documentation
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.updateAlgorithmInfo(e.target.dataset.algorithm);
      });
    });
  }

  generateArray() {
    this.array = [];
    this.resetStats();

    for (let i = 0; i < this.arraySize; i++) {
      this.array.push(Math.floor(Math.random() * 300) + 10);
    }

    this.renderArray();
  }

  renderArray() {
    this.arrayContainer.innerHTML = "";
    const containerWidth = this.arrayContainer.clientWidth;
    const barWidth = Math.max(
      2,
      (containerWidth - this.arraySize * 2) / this.arraySize
    );

    this.array.forEach((value, index) => {
      const bar = document.createElement("div");
      bar.className = "array-bar";
      bar.style.height = `${value}px`;
      bar.style.width = `${barWidth}px`;
      bar.id = `bar-${index}`;
      this.arrayContainer.appendChild(bar);
    });
  }

  async startSorting() {
    this.isRunning = true;
    this.resetStats();
    this.updateButtons();

    const algorithm = this.algorithmSelect.value;

    try {
      switch (algorithm) {
        case "bubble":
          await this.bubbleSort();
          break;
        case "selection":
          await this.selectionSort();
          break;
        case "insertion":
          await this.insertionSort();
          break;
        case "merge":
          await this.mergeSort(0, this.array.length - 1);
          break;
        case "quick":
          await this.quickSort(0, this.array.length - 1);
          break;
        case "heap":
          await this.heapSort();
          break;
        case "shell":
          await this.shellSort();
          break;
        case "counting":
          await this.countingSort();
          break;
        case "radix":
          await this.radixSort();
          break;
        case "bucket":
          await this.bucketSort();
          break;
      }

      await this.highlightSorted();
    } catch (error) {
      console.log("Sorting stopped");
    }

    this.isRunning = false;
    this.updateButtons();
  }

  stopSorting() {
    this.isRunning = false;
    this.updateButtons();
  }

  updateButtons() {
    this.startBtn.disabled = this.isRunning;
    this.stopBtn.disabled = !this.isRunning;
    this.generateBtn.disabled = this.isRunning;
    this.algorithmSelect.disabled = this.isRunning;
  }

  resetStats() {
    this.comparisons = 0;
    this.swaps = 0;
    this.updateStats();
  }

  updateStats() {
    this.comparisonsSpan.textContent = this.comparisons;
    this.swapsSpan.textContent = this.swaps;
  }

  async sleep() {
    return new Promise((resolve) => setTimeout(resolve, 101 - this.speed));
  }

  async compare(i, j) {
    if (!this.isRunning) throw new Error("Stopped");

    this.comparisons++;
    this.updateStats();

    const bars = this.arrayContainer.children;
    bars[i].classList.add("comparing");
    bars[j].classList.add("comparing");

    await this.sleep();

    bars[i].classList.remove("comparing");
    bars[j].classList.remove("comparing");

    return this.array[i] > this.array[j];
  }

  async swap(i, j) {
    if (!this.isRunning) throw new Error("Stopped");

    this.swaps++;
    this.updateStats();

    const bars = this.arrayContainer.children;
    bars[i].classList.add("swapping");
    bars[j].classList.add("swapping");

    // Swap array elements
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];

    // Update bar heights
    bars[i].style.height = `${this.array[i]}px`;
    bars[j].style.height = `${this.array[j]}px`;

    await this.sleep();

    bars[i].classList.remove("swapping");
    bars[j].classList.remove("swapping");
  }

  async highlightSorted() {
    const bars = this.arrayContainer.children;
    for (let i = 0; i < bars.length; i++) {
      bars[i].classList.add("sorted");
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  // Sorting Algorithms

  async bubbleSort() {
    const n = this.array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (await this.compare(j, j + 1)) {
          await this.swap(j, j + 1);
        }
      }
    }
  }

  async selectionSort() {
    const n = this.array.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        this.comparisons++;
        this.updateStats();
        if (this.array[j] < this.array[minIdx]) {
          minIdx = j;
        }
        await this.sleep();
      }
      if (minIdx !== i) {
        await this.swap(i, minIdx);
      }
    }
  }

  async insertionSort() {
    const n = this.array.length;
    for (let i = 1; i < n; i++) {
      let key = this.array[i];
      let j = i - 1;

      while (j >= 0) {
        this.comparisons++;
        this.updateStats();

        if (this.array[j] <= key) break;

        this.array[j + 1] = this.array[j];
        const bars = this.arrayContainer.children;
        bars[j + 1].style.height = `${this.array[j + 1]}px`;
        bars[j + 1].classList.add("swapping");

        await this.sleep();
        bars[j + 1].classList.remove("swapping");

        j--;
        this.swaps++;
        this.updateStats();
      }

      this.array[j + 1] = key;
      const bars = this.arrayContainer.children;
      bars[j + 1].style.height = `${key}px`;
    }
  }

  async mergeSort(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await this.mergeSort(left, mid);
    await this.mergeSort(mid + 1, right);
    await this.merge(left, mid, right);
  }

  async merge(left, mid, right) {
    const leftArr = this.array.slice(left, mid + 1);
    const rightArr = this.array.slice(mid + 1, right + 1);

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      this.comparisons++;
      this.updateStats();

      if (leftArr[i] <= rightArr[j]) {
        this.array[k] = leftArr[i];
        i++;
      } else {
        this.array[k] = rightArr[j];
        j++;
      }

      const bars = this.arrayContainer.children;
      bars[k].style.height = `${this.array[k]}px`;
      bars[k].classList.add("swapping");

      await this.sleep();
      bars[k].classList.remove("swapping");

      k++;
      this.swaps++;
      this.updateStats();
    }

    while (i < leftArr.length) {
      this.array[k] = leftArr[i];
      const bars = this.arrayContainer.children;
      bars[k].style.height = `${this.array[k]}px`;
      i++;
      k++;
    }

    while (j < rightArr.length) {
      this.array[k] = rightArr[j];
      const bars = this.arrayContainer.children;
      bars[k].style.height = `${this.array[k]}px`;
      j++;
      k++;
    }
  }

  async quickSort(low, high) {
    if (low < high) {
      const pi = await this.partition(low, high);
      await this.quickSort(low, pi - 1);
      await this.quickSort(pi + 1, high);
    }
  }

  async partition(low, high) {
    const pivot = this.array[high];
    const bars = this.arrayContainer.children;
    bars[high].classList.add("pivot");

    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.comparisons++;
      this.updateStats();

      if (this.array[j] < pivot) {
        i++;
        if (i !== j) {
          await this.swap(i, j);
        }
      }
      await this.sleep();
    }

    bars[high].classList.remove("pivot");
    if (i + 1 !== high) {
      await this.swap(i + 1, high);
    }

    return i + 1;
  }

  async heapSort() {
    const n = this.array.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await this.heapify(n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      await this.swap(0, i);
      await this.heapify(i, 0);
    }
  }

  async heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      this.comparisons++;
      this.updateStats();
      if (this.array[left] > this.array[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      this.comparisons++;
      this.updateStats();
      if (this.array[right] > this.array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      await this.swap(i, largest);
      await this.heapify(n, largest);
    }

    await this.sleep();
  }

  async shellSort() {
    const n = this.array.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = this.array[i];
        let j = i;

        while (j >= gap) {
          this.comparisons++;
          this.updateStats();

          if (this.array[j - gap] <= temp) break;

          this.array[j] = this.array[j - gap];
          const bars = this.arrayContainer.children;
          bars[j].style.height = `${this.array[j]}px`;
          bars[j].classList.add("swapping");

          await this.sleep();
          bars[j].classList.remove("swapping");

          j -= gap;
          this.swaps++;
          this.updateStats();
        }

        this.array[j] = temp;
        const bars = this.arrayContainer.children;
        bars[j].style.height = `${temp}px`;
      }
    }
  }

  async countingSort() {
    const max = Math.max(...this.array);
    const min = Math.min(...this.array);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(this.array.length);

    // Count occurrences
    for (let i = 0; i < this.array.length; i++) {
      count[this.array[i] - min]++;
      this.comparisons++;
      this.updateStats();
      await this.sleep();
    }

    // Calculate cumulative count
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = this.array.length - 1; i >= 0; i--) {
      output[count[this.array[i] - min] - 1] = this.array[i];
      count[this.array[i] - min]--;
      this.swaps++;
      this.updateStats();
      await this.sleep();
    }

    // Copy output array to original array
    for (let i = 0; i < this.array.length; i++) {
      this.array[i] = output[i];
      const bars = this.arrayContainer.children;
      bars[i].style.height = `${this.array[i]}px`;
      bars[i].classList.add("swapping");
      await this.sleep();
      bars[i].classList.remove("swapping");
    }
  }

  async radixSort() {
    const max = Math.max(...this.array);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      await this.countingSortForRadix(exp);
    }
  }

  async countingSortForRadix(exp) {
    const n = this.array.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);

    // Count occurrences of digits
    for (let i = 0; i < n; i++) {
      count[Math.floor(this.array[i] / exp) % 10]++;
      this.comparisons++;
      this.updateStats();
      await this.sleep();
    }

    // Calculate cumulative count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      output[count[Math.floor(this.array[i] / exp) % 10] - 1] = this.array[i];
      count[Math.floor(this.array[i] / exp) % 10]--;
      this.swaps++;
      this.updateStats();
      await this.sleep();
    }

    // Copy output array to original array
    for (let i = 0; i < n; i++) {
      this.array[i] = output[i];
      const bars = this.arrayContainer.children;
      bars[i].style.height = `${this.array[i]}px`;
      bars[i].classList.add("swapping");
      await this.sleep();
      bars[i].classList.remove("swapping");
    }
  }

  async bucketSort() {
    const n = this.array.length;
    const max = Math.max(...this.array);
    const min = Math.min(...this.array);
    const bucketCount = Math.floor(Math.sqrt(n));
    const buckets = Array.from({ length: bucketCount }, () => []);

    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
      const bucketIndex = Math.floor(
        ((this.array[i] - min) / (max - min + 1)) * bucketCount
      );
      buckets[Math.min(bucketIndex, bucketCount - 1)].push(this.array[i]);
      this.comparisons++;
      this.updateStats();
      await this.sleep();
    }

    // Sort individual buckets and concatenate
    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
      buckets[i].sort((a, b) => a - b);
      for (let j = 0; j < buckets[i].length; j++) {
        this.array[index] = buckets[i][j];
        const bars = this.arrayContainer.children;
        bars[index].style.height = `${this.array[index]}px`;
        bars[index].classList.add("swapping");
        await this.sleep();
        bars[index].classList.remove("swapping");
        index++;
        this.swaps++;
        this.updateStats();
      }
    }
  }

  updateAlgorithmInfo(algorithm) {
    const algorithmData = {
      bubble: {
        name: "Bubble Sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: `
                    <h3>How Bubble Sort Works</h3>
                    <p>Bubble Sort is one of the simplest sorting algorithms. It repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Compare adjacent elements in the array</li>
                        <li>If the first element is greater than the second, swap them</li>
                        <li>Continue this process for the entire array</li>
                        <li>Repeat until no more swaps are needed</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n)</td><td>O(1)</td></tr>
                        <tr><td>Average Case</td><td>O(n²)</td><td>O(1)</td></tr>
                        <tr><td>Worst Case</td><td>O(n²)</td><td>O(1)</td></tr>
                    </table>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> Yes - maintains relative order of equal elements</li>
                        <li><strong>In-place:</strong> Yes - requires only O(1) extra memory</li>
                        <li><strong>Adaptive:</strong> Yes - performs better on partially sorted arrays</li>
                    </ul>
                `,
      },
      selection: {
        name: "Selection Sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: `
                    <h3>How Selection Sort Works</h3>
                    <p>Selection Sort divides the array into two parts: sorted and unsorted. It repeatedly finds the minimum element from the unsorted part and places it at the beginning of the unsorted part.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Find the minimum element in the unsorted portion</li>
                        <li>Swap it with the first element of the unsorted portion</li>
                        <li>Move the boundary of the sorted portion one element to the right</li>
                        <li>Repeat until the entire array is sorted</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n²)</td><td>O(1)</td></tr>
                        <tr><td>Average Case</td><td>O(n²)</td><td>O(1)</td></tr>
                        <tr><td>Worst Case</td><td>O(n²)</td><td>O(1)</td></tr>
                    </table>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> No - may change relative order of equal elements</li>
                        <li><strong>In-place:</strong> Yes - requires only O(1) extra memory</li>
                        <li><strong>Adaptive:</strong> No - always performs O(n²) comparisons</li>
                    </ul>
                `,
      },
      insertion: {
        name: "Insertion Sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: `
                    <h3>How Insertion Sort Works</h3>
                    <p>Insertion Sort builds the final sorted array one element at a time. It takes each element from the unsorted portion and inserts it into its correct position in the sorted portion.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Start with the second element (assume first is sorted)</li>
                        <li>Compare the current element with elements in the sorted portion</li>
                        <li>Shift larger elements to the right</li>
                        <li>Insert the current element in its correct position</li>
                        <li>Repeat for all remaining elements</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n)</td><td>O(1)</td></tr>
                        <tr><td>Average Case</td><td>O(n²)</td><td>O(1)</td></tr>
                        <tr><td>Worst Case</td><td>O(n²)</td><td>O(1)</td></tr>
                    </table>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> Yes - maintains relative order of equal elements</li>
                        <li><strong>In-place:</strong> Yes - requires only O(1) extra memory</li>
                        <li><strong>Adaptive:</strong> Yes - efficient for small datasets and nearly sorted arrays</li>
                    </ul>
                `,
      },
      merge: {
        name: "Merge Sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        description: `
                    <h3>How Merge Sort Works</h3>
                    <p>Merge Sort follows the divide-and-conquer approach. It divides the array into two halves, recursively sorts them, and then merges the sorted halves.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Divide the array into two halves</li>
                        <li>Recursively sort both halves</li>
                        <li>Merge the two sorted halves back together</li>
                        <li>The merge process maintains the sorted order</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n log n)</td><td>O(n)</td></tr>
                        <tr><td>Average Case</td><td>O(n log n)</td><td>O(n)</td></tr>
                        <tr><td>Worst Case</td><td>O(n log n)</td><td>O(n)</td></tr>
                    </table>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> Yes - maintains relative order of equal elements</li>
                        <li><strong>In-place:</strong> No - requires O(n) extra memory</li>
                        <li><strong>Adaptive:</strong> No - always performs O(n log n) operations</li>
                    </ul>
                `,
      },
      quick: {
        name: "Quick Sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        description: `
                    <h3>How Quick Sort Works</h3>
                    <p>Quick Sort is a divide-and-conquer algorithm that picks a 'pivot' element and partitions the array around it, then recursively sorts the sub-arrays.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Choose a pivot element from the array</li>
                        <li>Partition the array so elements smaller than pivot are on the left, larger on the right</li>
                        <li>Recursively apply the same process to the left and right sub-arrays</li>
                        <li>The base case is when the sub-array has one or zero elements</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n log n)</td><td>O(log n)</td></tr>
                        <tr><td>Average Case</td><td>O(n log n)</td><td>O(log n)</td></tr>
                        <tr><td>Worst Case</td><td>O(n²)</td><td>O(n)</td></tr>
                    </table>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> No - may change relative order of equal elements</li>
                        <li><strong>In-place:</strong> Yes - requires only O(log n) extra memory for recursion</li>
                        <li><strong>Adaptive:</strong> No - performance depends on pivot selection</li>
                    </ul>
                `,
      },
      heap: {
        name: "Heap Sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        description: `
                    <h3>How Heap Sort Works</h3>
                    <p>Heap Sort uses a binary heap data structure. It first builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Build a max heap from the input array</li>
                        <li>Extract the maximum element (root) and place it at the end</li>
                        <li>Reduce the heap size and heapify the root</li>
                        <li>Repeat until the heap is empty</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n log n)</td><td>O(1)</td></tr>
                        <tr><td>Average Case</td><td>O(n log n)</td><td>O(1)</td></tr>
                        <tr><td>Worst Case</td><td>O(n log n)</td><td>O(1)</td></tr>
                    </table>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> No - may change relative order of equal elements</li>
                        <li><strong>In-place:</strong> Yes - requires only O(1) extra memory</li>
                        <li><strong>Adaptive:</strong> No - always performs O(n log n) operations</li>
                    </ul>
                `,
      },
      shell: {
        name: "Shell Sort",
        timeComplexity: "O(n^1.5)",
        spaceComplexity: "O(1)",
        description: `
                    <h3>How Shell Sort Works</h3>
                    <p>Shell Sort is an extension of insertion sort that allows the exchange of items that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reducing the gap.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Start with a large gap (usually n/2)</li>
                        <li>Perform insertion sort on elements that are gap distance apart</li>
                        <li>Reduce the gap (typically by half)</li>
                        <li>Repeat until gap becomes 1</li>
                        <li>Perform a final insertion sort with gap = 1</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n log n)</td><td>O(1)</td></tr>
                        <tr><td>Average Case</td><td>O(n^1.5)</td><td>O(1)</td></tr>
                        <tr><td>Worst Case</td><td>O(n²)</td><td>O(1)</td></tr>
                    </table>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> No - may change relative order of equal elements</li>
                        <li><strong>In-place:</strong> Yes - requires only O(1) extra memory</li>
                        <li><strong>Adaptive:</strong> Yes - performs better on partially sorted arrays</li>
                    </ul>
                `,
      },
      counting: {
        name: "Counting Sort",
        timeComplexity: "O(n + k)",
        spaceComplexity: "O(k)",
        description: `
                    <h3>How Counting Sort Works</h3>
                    <p>Counting Sort is a non-comparison based sorting algorithm. It counts the number of occurrences of each distinct element and uses this information to place elements in their correct positions.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Find the range of input values (min to max)</li>
                        <li>Create a count array to store the frequency of each element</li>
                        <li>Count the occurrences of each element</li>
                        <li>Calculate cumulative counts</li>
                        <li>Build the output array using the count information</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n + k)</td><td>O(k)</td></tr>
                        <tr><td>Average Case</td><td>O(n + k)</td><td>O(k)</td></tr>
                        <tr><td>Worst Case</td><td>O(n + k)</td><td>O(k)</td></tr>
                    </table>
                    <p><em>Where k is the range of input values</em></p>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> Yes - maintains relative order of equal elements</li>
                        <li><strong>In-place:</strong> No - requires O(k) extra memory</li>
                        <li><strong>Adaptive:</strong> No - always performs O(n + k) operations</li>
                        <li><strong>Best for:</strong> Small range of integers</li>
                    </ul>
                `,
      },
      radix: {
        name: "Radix Sort",
        timeComplexity: "O(d × n)",
        spaceComplexity: "O(n + k)",
        description: `
                    <h3>How Radix Sort Works</h3>
                    <p>Radix Sort processes individual digits of numbers. It sorts the elements by first grouping by individual digits that share the same significant position and value.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Find the maximum number to determine the number of digits</li>
                        <li>Starting from the least significant digit, sort using counting sort</li>
                        <li>Move to the next significant digit</li>
                        <li>Repeat until all digits have been processed</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(d × n)</td><td>O(n + k)</td></tr>
                        <tr><td>Average Case</td><td>O(d × n)</td><td>O(n + k)</td></tr>
                        <tr><td>Worst Case</td><td>O(d × n)</td><td>O(n + k)</td></tr>
                    </table>
                    <p><em>Where d is the number of digits and k is the range of each digit (0-9)</em></p>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> Yes - maintains relative order of equal elements</li>
                        <li><strong>In-place:</strong> No - requires O(n + k) extra memory</li>
                        <li><strong>Adaptive:</strong> No - always processes all digits</li>
                        <li><strong>Best for:</strong> Fixed-length integer keys</li>
                    </ul>
                `,
      },
      bucket: {
        name: "Bucket Sort",
        timeComplexity: "O(n + k)",
        spaceComplexity: "O(n + k)",
        description: `
                    <h3>How Bucket Sort Works</h3>
                    <p>Bucket Sort distributes elements into several buckets, sorts each bucket individually, and then concatenates the sorted buckets to get the final sorted array.</p>
                    
                    <h4>Algorithm Steps:</h4>
                    <ul>
                        <li>Create empty buckets</li>
                        <li>Distribute array elements into buckets based on their values</li>
                        <li>Sort each bucket individually (using another sorting algorithm)</li>
                        <li>Concatenate all sorted buckets to get the final result</li>
                    </ul>
                    
                    <h4>Complexity Analysis:</h4>
                    <table class="complexity-table">
                        <tr><th>Case</th><th>Time Complexity</th><th>Space Complexity</th></tr>
                        <tr><td>Best Case</td><td>O(n + k)</td><td>O(n + k)</td></tr>
                        <tr><td>Average Case</td><td>O(n + k)</td><td>O(n + k)</td></tr>
                        <tr><td>Worst Case</td><td>O(n²)</td><td>O(n + k)</td></tr>
                    </table>
                    <p><em>Where k is the number of buckets</em></p>
                    
                    <h4>Characteristics:</h4>
                    <ul>
                        <li><strong>Stable:</strong> Yes - if the underlying sort is stable</li>
                        <li><strong>In-place:</strong> No - requires O(n + k) extra memory</li>
                        <li><strong>Adaptive:</strong> Yes - performance depends on data distribution</li>
                        <li><strong>Best for:</strong> Uniformly distributed data</li>
                    </ul>
                `,
      },
    };

    const data = algorithmData[algorithm];
    if (data) {
      this.timeComplexitySpan.textContent = data.timeComplexity;
      this.spaceComplexitySpan.textContent = data.spaceComplexity;
      this.algorithmInfo.innerHTML = data.description;
    }
  }
}

// Initialize the visualizer when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new SortingVisualizer();
});
