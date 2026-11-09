import './style.css';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Fibonacci Calculator</h1>
    <div class="card">
      <label for="fibN">Enter n: </label>
      <input type="number" id="fibN" placeholder="e.g., 10" min="0" step="1" value="10">
    </div>
    <div class="card">
      <input type="checkbox" id="showLengthOnly" name="showLengthOnly">
      <label for="showLengthOnly">Hex mode</label>
    </div>
    <div class="card">
      <button id="calculateButton" type="button">Calculate F(n)</button>
      <button id="cancelButton" type="button" disabled>Cancel</button>
    </div>
    <div id="resultArea" class="card" aria-live="polite">
      <p><span id="resultLabel">F(n):</span> <strong id="fibValue">-</strong></p>
      <p id="previewNotice" hidden>Preview limited to 4,000 characters. Download the complete result.</p>
      <p>Calculation: <span id="fibDuration">-</span> ms</p>
      <p>Number formatting: <span id="formatDuration">-</span> ms</p>
      <a id="downloadResult" hidden>Download complete result</a>
    </div>
  </div>
`;
const calculateButton = document.getElementById('calculateButton');
const cancelButton = document.getElementById('cancelButton');
const nInput = document.getElementById('fibN');
const fibValue = document.getElementById('fibValue');
const fibDuration = document.getElementById('fibDuration');
const formatDuration = document.getElementById('formatDuration');
const hexMode = document.getElementById('showLengthOnly');
const resultLabel = document.getElementById('resultLabel');
const notice = document.getElementById('previewNotice');
const download = document.getElementById('downloadResult');
let worker;
let outputUrl;
function stop() {
    worker?.terminate();
    worker = undefined;
    calculateButton.disabled = false;
    cancelButton.disabled = true;
}
function resetOutput() {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = undefined;
    download.hidden = true;
    download.removeAttribute('href');
    notice.hidden = true;
    fibDuration.textContent = '-';
    formatDuration.textContent = '-';
}
calculateButton.addEventListener('click', () => {
    stop();
    resetOutput();
    const n = Number(nInput.value);
    if (!nInput.value.trim() || !Number.isSafeInteger(n) || n < 0) {
        fibValue.textContent = 'Enter a non-negative safe integer.';
        return;
    }
    const radix = hexMode.checked ? 16 : 10;
    resultLabel.textContent = radix === 16 ? 'F(n) in hex:' : 'F(n):';
    fibValue.textContent = 'Calculating…';
    calculateButton.disabled = true;
    cancelButton.disabled = false;
    worker = new Worker(new URL('./fibonacci.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
        stop();
        if (data.error) {
            fibValue.textContent = data.error;
            return;
        }
        fibValue.textContent = data.text.slice(0, 4000);
        notice.hidden = data.text.length <= 4000;
        fibDuration.textContent = data.duration.toFixed(3);
        formatDuration.textContent = data.serializationMs.toFixed(3);
        outputUrl = URL.createObjectURL(new Blob([data.text], { type: 'text/plain;charset=utf-8' }));
        download.href = outputUrl;
        download.download = `fibonacci-${n}${radix === 16 ? '-hex' : ''}.txt`;
        download.hidden = false;
    };
    worker.onerror = (event) => {
        stop();
        fibValue.textContent = `Calculation failed: ${event.message || 'worker error'}`;
    };
    worker.postMessage({ n, radix });
});
cancelButton.addEventListener('click', () => {
    stop();
    fibValue.textContent = 'Cancelled.';
});
