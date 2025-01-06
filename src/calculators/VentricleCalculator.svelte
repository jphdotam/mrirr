<script>
  import { referenceRanges } from '../data/referenceRanges.js';

  export let patientData;

  let measurements = {
    lv: {
      edv: null,
      esv: null,
      mass: null
    },
    rv: {
      edv: null,
      esv: null
    }
  };

  $: ageRange = getAgeRange(patientData.age);
  $: ranges = patientData.sex && ageRange ? referenceRanges[patientData.sex][ageRange] : null;
  
  $: results = calculateResults(measurements, ranges, patientData.bsa);

  function getAgeRange(age) {
    if (!age) return null;
    if (age >= 20 && age <= 29) return "20-29";
    if (age >= 30 && age <= 39) return "30-39";
    return null;
  }

  function calculateResults(measurements, ranges, bsa) {
    if (!ranges) return null;

    const lv = {
      edv: {
        absolute: measurements.lv.edv,
        indexed: bsa ? Math.round(measurements.lv.edv / bsa) : null,
        range: ranges.lvEdvAbsolute,
        indexedRange: [66, 101]
      },
      esv: {
        absolute: measurements.lv.esv,
        indexed: bsa ? Math.round(measurements.lv.esv / bsa) : null,
        range: ranges.lvEsvAbsolute,
        indexedRange: [18, 39]
      },
      sv: {
        absolute: measurements.lv.edv - measurements.lv.esv,
        indexed: bsa ? Math.round((measurements.lv.edv - measurements.lv.esv) / bsa) : null,
        range: [79, 135],
        indexedRange: [43, 67]
      },
      ef: {
        value: measurements.lv.edv ? Math.round((measurements.lv.edv - measurements.lv.esv) / measurements.lv.edv * 100) : null,
        range: [57, 75]
      },
      mass: {
        absolute: measurements.lv.mass,
        indexed: bsa ? Math.round(measurements.lv.mass / bsa) : null,
        range: ranges.lvMassAbsolute,
        indexedRange: [59, 92]
      }
    };

    const rv = {
      edv: {
        absolute: measurements.rv.edv,
        indexed: bsa ? Math.round(measurements.rv.edv / bsa) : null,
        range: ranges.rvEdvAbsolute,
        indexedRange: [65, 111]
      },
      esv: {
        absolute: measurements.rv.esv,
        indexed: bsa ? Math.round(measurements.rv.esv / bsa) : null,
        range: ranges.rvEsvAbsolute,
        indexedRange: [18, 47]
      },
      sv: {
        absolute: measurements.rv.edv - measurements.rv.esv,
        indexed: bsa ? Math.round((measurements.rv.edv - measurements.rv.esv) / bsa) : null,
        range: [74, 142],
        indexedRange: [39, 71]
      },
      ef: {
        value: measurements.rv.edv ? Math.round((measurements.rv.edv - measurements.rv.esv) / measurements.rv.edv * 100) : null,
        range: [50, 76]
      }
    };

    return { lv, rv };
  }

  function getStatusColor(value, range) {
    if (!value || !range) return 'text-gray-400';
    return (value >= range[0] && value <= range[1]) ? 'text-green-600' : 'text-red-600';
  }

  function isAbnormal(value, range) {
    if (!value || !range) return false;
    return value < range[0] || value > range[1];
  }

  function formatValue(value, unit) {
    if (!value) return '-';
    return `${value}${unit}`;
  }

  function copyRichText() {
    const table = document.getElementById('results-table');
    if (!table) return;

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(table);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
  }

  function copyPlainText() {
    if (!results) return;

    const formatRow = (label, absolute, absRange, indexed, idxRange) => {
      const abs = absolute ? `${absolute}\t(${absRange[0]}-${absRange[1]})` : '-\t-';
      const idx = indexed ? `${indexed}\t(${idxRange[0]}-${idxRange[1]})` : '-\t-';
      return `${label}\t${abs}\t${idx}`;
    };

    const text = [
      'Left Ventricle',
      formatRow('LVEDV', results.lv.edv.absolute + ' ml', results.lv.edv.range, results.lv.edv.indexed + ' ml/m²', results.lv.edv.indexedRange),
      formatRow('LVESV', results.lv.esv.absolute + ' ml', results.lv.esv.range, results.lv.esv.indexed + ' ml/m²', results.lv.esv.indexedRange),
      formatRow('LVSV', results.lv.sv.absolute + ' ml', results.lv.sv.range, results.lv.sv.indexed + ' ml/m²', results.lv.sv.indexedRange),
      `LVEF\t${results.lv.ef.value}%\t(${results.lv.ef.range[0]}-${results.lv.ef.range[1]})`,
      formatRow('LV Mass', results.lv.mass.absolute + ' g', results.lv.mass.range, results.lv.mass.indexed + ' g/m²', results.lv.mass.indexedRange),
      '',
      'Right Ventricle',
      formatRow('RVEDV', results.rv.edv.absolute + ' ml', results.rv.edv.range, results.rv.edv.indexed + ' ml/m²', results.rv.edv.indexedRange),
      formatRow('RVESV', results.rv.esv.absolute + ' ml', results.rv.esv.range, results.rv.esv.indexed + ' ml/m²', results.rv.esv.indexedRange),
      formatRow('RVSV', results.rv.sv.absolute + ' ml', results.rv.sv.range, results.rv.sv.indexed + ' ml/m²', results.rv.sv.indexedRange),
      `RVEF\t${results.rv.ef.value}%\t(${results.rv.ef.range[0]}-${results.rv.ef.range[1]})`
    ].join('\n');

    navigator.clipboard.writeText(text);
  }
</script>

<div class="p-6 max-w-5xl mx-auto">
  <div class="grid grid-cols-2 gap-8">
    <!-- Left Ventricle Inputs -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Left Ventricle</h3>
      <div>
        <label class="inline-flex items-center">
          <span class="mr-2">LVEDV (ml)</span>
          <span class={getStatusColor(measurements.lv.edv, ranges?.lvEdvAbsolute)}>●</span>
        </label>
        <input
          type="number"
          bind:value={measurements.lv.edv}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="inline-flex items-center">
          <span class="mr-2">LVESV (ml)</span>
          <span class={getStatusColor(measurements.lv.esv, ranges?.lvEsvAbsolute)}>●</span>
        </label>
        <input
          type="number"
          bind:value={measurements.lv.esv}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="inline-flex items-center">
          <span class="mr-2">LV Mass (g)</span>
          <span class={getStatusColor(measurements.lv.mass, ranges?.lvMassAbsolute)}>●</span>
        </label>
        <input
          type="number"
          bind:value={measurements.lv.mass}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Right Ventricle Inputs -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Right Ventricle</h3>
      <div>
        <label class="inline-flex items-center">
          <span class="mr-2">RVEDV (ml)</span>
          <span class={getStatusColor(measurements.rv.edv, ranges?.rvEdvAbsolute)}>●</span>
        </label>
        <input
          type="number"
          bind:value={measurements.rv.edv}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="inline-flex items-center">
          <span class="mr-2">RVESV (ml)</span>
          <span class={getStatusColor(measurements.rv.esv, ranges?.rvEsvAbsolute)}>●</span>
        </label>
        <input
          type="number"
          bind:value={measurements.rv.esv}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>

  {#if results}
    <div class="mt-8">
      <table id="results-table" class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="w-32 text-left font-medium text-gray-500 py-2">Measurement</th>
            <th class="w-28 text-right font-medium text-gray-500">Absolute</th>
            <th class="w-24 text-left pl-4 font-medium text-gray-500">Range</th>
            <th class="w-28 text-right font-medium text-gray-500">Indexed</th>
            <th class="w-24 text-left pl-4 font-medium text-gray-500">Range</th>
          </tr>
        </thead>
        <tbody class="font-mono divide-y">
          <!-- LV Results -->
          <tr>
            <td class="py-1.5 font-semibold" colspan="5">Left Ventricle</td>
          </tr>
          <tr>
            <td>LVEDV</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.edv.absolute, results.lv.edv.range)}>
              {results.lv.edv.absolute || '-'} ml
            </td>
            <td class="text-left pl-4">({results.lv.edv.range[0]}-{results.lv.edv.range[1]})</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.edv.indexed, results.lv.edv.indexedRange)}>
              {results.lv.edv.indexed || '-'} ml/m²
            </td>
            <td class="text-left pl-4">({results.lv.edv.indexedRange[0]}-{results.lv.edv.indexedRange[1]})</td>
          </tr>
          <tr>
            <td>LVESV</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.esv.absolute, results.lv.esv.range)}>
              {results.lv.esv.absolute || '-'} ml
            </td>
            <td class="text-left pl-4">({results.lv.esv.range[0]}-{results.lv.esv.range[1]})</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.esv.indexed, results.lv.esv.indexedRange)}>
              {results.lv.esv.indexed || '-'} ml/m²
            </td>
            <td class="text-left pl-4">({results.lv.esv.indexedRange[0]}-{results.lv.esv.indexedRange[1]})</td>
          </tr>
          <tr>
            <td>LVSV</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.sv.absolute, results.lv.sv.range)}>
              {results.lv.sv.absolute || '-'} ml
            </td>
            <td class="text-left pl-4">({results.lv.sv.range[0]}-{results.lv.sv.range[1]})</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.sv.indexed, results.lv.sv.indexedRange)}>
              {results.lv.sv.indexed || '-'} ml/m²
            </td>
            <td class="text-left pl-4">({results.lv.sv.indexedRange[0]}-{results.lv.sv.indexedRange[1]})</td>
          </tr>
          <tr>
            <td>LVEF</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.ef.value, results.lv.ef.range)}>
              {results.lv.ef.value || '-'}%
            </td>
            <td class="text-left pl-4">({results.lv.ef.range[0]}-{results.lv.ef.range[1]})</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td>LV Mass</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.mass.absolute, results.lv.mass.range)}>
              {results.lv.mass.absolute || '-'} g
            </td>
            <td class="text-left pl-4">({results.lv.mass.range[0]}-{results.lv.mass.range[1]})</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.lv.mass.indexed, results.lv.mass.indexedRange)}>
              {results.lv.mass.indexed || '-'} g/m²
            </td>
            <td class="text-left pl-4">({results.lv.mass.indexedRange[0]}-{results.lv.mass.indexedRange[1]})</td>
          </tr>

          <!-- Spacer row -->
          <tr class="h-4"><td colspan="5"></td></tr>

          <!-- RV Results -->
          <tr>
            <td class="py-1.5 font-semibold" colspan="5">Right Ventricle</td>
          </tr>
          <tr>
            <td>RVEDV</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.rv.edv.absolute, results.rv.edv.range)}>
              {results.rv.edv.absolute || '-'} ml
            </td>
            <td class="text-left pl-4">({results.rv.edv.range[0]}-{results.rv.edv.range[1]})</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.rv.edv.indexed, results.rv.edv.indexedRange)}>
              {results.rv.edv.indexed || '-'} ml/m²
            </td>
            <td class="text-left pl-4">({results.rv.edv.indexedRange[0]}-{results.rv.edv.indexedRange[1]})</td>
          </tr>
          <tr>
            <td>RVESV</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.rv.esv.absolute, results.rv.esv.range)}>
              {results.rv.esv.absolute || '-'} ml
            </td>
            <td class="text-left pl-4">({results.rv.esv.range[0]}-{results.rv.esv.range[1]})</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.rv.esv.indexed, results.rv.esv.indexedRange)}>
              {results.rv.esv.indexed || '-'} ml/m²
            </td>
            <td class="text-left pl-4">({results.rv.esv.indexedRange[0]}-{results.rv.esv.indexedRange[1]})</td>
          </tr>
          <tr>
            <td>RVSV</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.rv.sv.absolute, results.rv.sv.range)}>
              {results.rv.sv.absolute || '-'} ml
            </td>
            <td class="text-left pl-4">({results.rv.sv.range[0]}-{results.rv.sv.range[1]})</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.rv.sv.indexed, results.rv.sv.indexedRange)}>
              {results.rv.sv.indexed || '-'} ml/m²
            </td>
            <td class="text-left pl-4">({results.rv.sv.indexedRange[0]}-{results.rv.sv.indexedRange[1]})</td>
          </tr>
          <tr>
            <td>RVEF</td>
            <td class="text-right" class:text-red-600={isAbnormal(results.rv.ef.value, results.rv.ef.range)}>
              {results.rv.ef.value || '-'}%
            </td>
            <td class="text-left pl-4">({results.rv.ef.range[0]}-{results.rv.ef.range[1]})</td>
            <td colspan="2"></td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 flex gap-4">
        <button
          on:click={copyRichText}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Copy Rich Text
        </button>
        <button
          on:click={copyPlainText}
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Copy Plain Text
        </button>
      </div>
    </div>
  {/if}
</div> 