<script lang="ts">
  let display = $state('0');
  let previousValue = $state<number | null>(null);
  let operation = $state<string | null>(null);
  let newNumber = $state(true);

  function appendNumber(num: string) {
    if (newNumber) {
      display = num;
      newNumber = false;
    } else {
      display = display === '0' ? num : display + num;
    }
  }

  function appendDecimal() {
    if (newNumber) {
      display = '0.';
      newNumber = false;
    } else if (!display.includes('.')) {
      display += '.';
    }
  }

  function setOperation(op: string) {
    if (previousValue !== null && !newNumber) {
      calculate();
    }
    previousValue = parseFloat(display);
    operation = op;
    newNumber = true;
  }

  function calculate() {
    if (previousValue === null || operation === null) return;

    const current = parseFloat(display);
    let result: number;

    switch (operation) {
      case '+':
        result = previousValue + current;
        break;
      case '-':
        result = previousValue - current;
        break;
      case '×':
        result = previousValue * current;
        break;
      case '÷':
        result = current !== 0 ? previousValue / current : 0;
        break;
      default:
        return;
    }

    display = result.toString();
    previousValue = null;
    operation = null;
    newNumber = true;
  }

  function clear() {
    display = '0';
    previousValue = null;
    operation = null;
    newNumber = true;
  }

  function backspace() {
    if (display.length > 1) {
      display = display.slice(0, -1);
    } else {
      display = '0';
      newNumber = true;
    }
  }

  function toggleSign() {
    if (display !== '0') {
      display = display.startsWith('-') ? display.slice(1) : '-' + display;
    }
  }
</script>

<div class="flex flex-col items-center justify-center h-full p-8">
  <div class="card bg-base-200 shadow-xl w-full max-w-md">
    <div class="card-body p-6">
      <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
        <span class="text-3xl">🧮</span>
        Calculator
      </h2>

      <!-- Display -->
      <div class="bg-base-300 rounded-lg p-6 mb-4">
        <div class="text-right text-4xl font-mono font-bold break-all">
          {display}
        </div>
        {#if operation && previousValue !== null}
          <div class="text-right text-sm text-base-content/50 mt-2">
            {previousValue} {operation}
          </div>
        {/if}
      </div>

      <!-- Buttons -->
      <div class="grid grid-cols-4 gap-2">
        <!-- Row 1 -->
        <button class="btn btn-error" onclick={clear}>C</button>
        <button class="btn btn-neutral" onclick={backspace}>⌫</button>
        <button class="btn btn-neutral" onclick={toggleSign}>+/-</button>
        <button class="btn btn-primary" onclick={() => setOperation('÷')}>÷</button>

        <!-- Row 2 -->
        <button class="btn btn-neutral" onclick={() => appendNumber('7')}>7</button>
        <button class="btn btn-neutral" onclick={() => appendNumber('8')}>8</button>
        <button class="btn btn-neutral" onclick={() => appendNumber('9')}>9</button>
        <button class="btn btn-primary" onclick={() => setOperation('×')}>×</button>

        <!-- Row 3 -->
        <button class="btn btn-neutral" onclick={() => appendNumber('4')}>4</button>
        <button class="btn btn-neutral" onclick={() => appendNumber('5')}>5</button>
        <button class="btn btn-neutral" onclick={() => appendNumber('6')}>6</button>
        <button class="btn btn-primary" onclick={() => setOperation('-')}>-</button>

        <!-- Row 4 -->
        <button class="btn btn-neutral" onclick={() => appendNumber('1')}>1</button>
        <button class="btn btn-neutral" onclick={() => appendNumber('2')}>2</button>
        <button class="btn btn-neutral" onclick={() => appendNumber('3')}>3</button>
        <button class="btn btn-primary" onclick={() => setOperation('+')}>+</button>

        <!-- Row 5 -->
        <button class="btn btn-neutral col-span-2" onclick={() => appendNumber('0')}>0</button>
        <button class="btn btn-neutral" onclick={appendDecimal}>.</button>
        <button class="btn btn-success" onclick={calculate}>=</button>
      </div>
    </div>
  </div>
</div>
