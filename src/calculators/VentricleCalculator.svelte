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

  let ageWarning = '';
  let showRanges = true;

  $: {
    const age = patientData.age;
    if (age !== null) {
      if (age < 16) {
        ageWarning = 'Reference ranges should not be used in children.';
        showRanges = false;
      } else if (age < 20) {
        ageWarning = 'Using reference ranges for age 20-29.';
        showRanges = true;
      } else if (age >= 70) {
        ageWarning = 'Using reference ranges for age 70-79.';
        showRanges = true;
      } else {
        ageWarning = '';
        showRanges = true;
      }
    } else {
      ageWarning = '';
      showRanges = true;
    }
  }

  function getAgeRange(age) {
    if (!age) return null;
    if (age < 16) return null;
    if (age < 20) return "20-29";  // Use youngest range for 16-19
    if (age >= 70) return "70-79"; // Use oldest range for 70+
    if (age >= 20 && age <= 29) return "20-29";
    if (age >= 30 && age <= 39) return "30-39";
    if (age >= 40 && age <= 49) return "40-49";
    if (age >= 50 && age <= 59) return "50-59";
    if (age >= 60 && age <= 69) return "60-69";
    return null;
  }

  $: ageRange = getAgeRange(patientData.age);
  $: ranges = patientData.sex && ageRange ? referenceRanges[patientData.sex][ageRange] : null;
  
  $: results = calculateResults(measurements, ranges, patientData.bsa);

  function calculateResults(measurements, ranges, bsa) {
    // Always calculate results even if ranges are null
    const lv = {
      edv: {
        absolute: measurements.lv.edv,
        indexed: bsa ? Math.round(measurements.lv.edv / bsa) : null,
        range: ranges?.lvEdvAbsolute,
        indexedRange: ranges?.lvEdvNormalized
      },
      esv: {
        absolute: measurements.lv.esv,
        indexed: bsa ? Math.round(measurements.lv.esv / bsa) : null,
        range: ranges?.lvEsvAbsolute,
        indexedRange: ranges?.lvEsvNormalized
      },
      sv: {
        absolute: measurements.lv.edv - measurements.lv.esv,
        indexed: bsa ? Math.round((measurements.lv.edv - measurements.lv.esv) / bsa) : null,
        range: ranges?.lvSvAbsolute,
        indexedRange: ranges?.lvSvNormalized
      },
      ef: {
        value: measurements.lv.edv ? Math.round((measurements.lv.edv - measurements.lv.esv) / measurements.lv.edv * 100) : null,
        range: ranges?.lvEfPercent
      },
      mass: {
        absolute: measurements.lv.mass,
        indexed: bsa ? Math.round(measurements.lv.mass / bsa) : null,
        range: ranges?.lvMassAbsolute,
        indexedRange: ranges?.lvMassNormalized
      }
    };

    const rv = {
      edv: {
        absolute: measurements.rv.edv,
        indexed: bsa ? Math.round(measurements.rv.edv / bsa) : null,
        range: ranges?.rvEdvAbsolute,
        indexedRange: ranges?.rvEdvNormalized
      },
      esv: {
        absolute: measurements.rv.esv,
        indexed: bsa ? Math.round(measurements.rv.esv / bsa) : null,
        range: ranges?.rvEsvAbsolute,
        indexedRange: ranges?.rvEsvNormalized
      },
      sv: {
        absolute: measurements.rv.edv - measurements.rv.esv,
        indexed: bsa ? Math.round((measurements.rv.edv - measurements.rv.esv) / bsa) : null,
        range: ranges?.rvSvAbsolute,
        indexedRange: ranges?.rvSvNormalized
      },
      ef: {
        value: measurements.rv.edv ? Math.round((measurements.rv.edv - measurements.rv.esv) / measurements.rv.edv * 100) : null,
        range: ranges?.rvEfPercent
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

  $: deltaSV = results && 
    measurements.lv.edv !== null && 
    measurements.lv.esv !== null && 
    measurements.rv.edv !== null && 
    measurements.rv.esv !== null ? 
      results.rv.sv.absolute - results.lv.sv.absolute : null;
  $: deltaText = deltaSV !== null ? 
    `Delta stroke volume ${deltaSV > 0 ? '+' : ''}${deltaSV}ml (${deltaSV > 0 ? 'RV > LV' : 'LV > RV'})` : '';
  $: deltaColor = deltaSV === null ? '' :
    Math.abs(deltaSV) <= 10 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800';
</script>

<div class="p-6 max-w-5xl mx-auto">
  <div class="grid grid-cols-2 gap-8">
    <!-- Left Ventricle Inputs -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Left Ventricle</h3>
      <div>
        <label for="lvedv" class="inline-flex items-center">
          <span class="mr-2">LVEDV (ml)</span>
          <span class={getStatusColor(measurements.lv.edv, ranges?.lvEdvAbsolute)}>●</span>
        </label>
        <input
          id="lvedv"
          type="number"
          bind:value={measurements.lv.edv}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="lvesv" class="inline-flex items-center">
          <span class="mr-2">LVESV (ml)</span>
          <span class={getStatusColor(measurements.lv.esv, ranges?.lvEsvAbsolute)}>●</span>
        </label>
        <input
          id="lvesv"
          type="number"
          bind:value={measurements.lv.esv}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="lvmass" class="inline-flex items-center">
          <span class="mr-2">LV Mass (g)</span>
          <span class={getStatusColor(measurements.lv.mass, ranges?.lvMassAbsolute)}>●</span>
        </label>
        <input
          id="lvmass"
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
        <label for="rvedv" class="inline-flex items-center">
          <span class="mr-2">RVEDV (ml)</span>
          <span class={getStatusColor(measurements.rv.edv, ranges?.rvEdvAbsolute)}>●</span>
        </label>
        <input
          id="rvedv"
          type="number"
          bind:value={measurements.rv.edv}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="rvesv" class="inline-flex items-center">
          <span class="mr-2">RVESV (ml)</span>
          <span class={getStatusColor(measurements.rv.esv, ranges?.rvEsvAbsolute)}>●</span>
        </label>
        <input
          id="rvesv"
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
            {#if showRanges}
              <th class="w-24 text-left pl-4 font-medium text-gray-500">Range</th>
            {/if}
            <th class="w-28 text-right font-medium text-gray-500">Indexed</th>
            {#if showRanges}
              <th class="w-24 text-left pl-4 font-medium text-gray-500">Range</th>
            {/if}
          </tr>
        </thead>
        <tbody class="font-mono divide-y">
          <!-- LV Results -->
          <tr>
            <td class="py-1.5 font-semibold" colspan={showRanges ? 5 : 3}>Left Ventricle</td>
          </tr>
          <tr>
            <td>LVEDV</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.edv.absolute, results.lv.edv.range)}>
              {results.lv.edv.absolute || '-'} ml
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.edv.range?.[0] || '-'}-{results.lv.edv.range?.[1] || '-'})</td>
            {/if}
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.edv.indexed, results.lv.edv.indexedRange)}>
              {results.lv.edv.indexed || '-'} ml/m²
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.edv.indexedRange?.[0] || '-'}-{results.lv.edv.indexedRange?.[1] || '-'})</td>
            {/if}
          </tr>
          <tr>
            <td>LVESV</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.esv.absolute, results.lv.esv.range)}>
              {results.lv.esv.absolute || '-'} ml
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.esv.range?.[0] || '-'}-{results.lv.esv.range?.[1] || '-'})</td>
            {/if}
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.esv.indexed, results.lv.esv.indexedRange)}>
              {results.lv.esv.indexed || '-'} ml/m²
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.esv.indexedRange?.[0] || '-'}-{results.lv.esv.indexedRange?.[1] || '-'})</td>
            {/if}
          </tr>
          <tr>
            <td>LVSV</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.sv.absolute, results.lv.sv.range)}>
              {results.lv.sv.absolute || '-'} ml
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.sv.range?.[0] || '-'}-{results.lv.sv.range?.[1] || '-'})</td>
            {/if}
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.sv.indexed, results.lv.sv.indexedRange)}>
              {results.lv.sv.indexed || '-'} ml/m²
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.sv.indexedRange?.[0] || '-'}-{results.lv.sv.indexedRange?.[1] || '-'})</td>
            {/if}
          </tr>
          <tr>
            <td>LVEF</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.ef.value, results.lv.ef.range)}>
              {results.lv.ef.value || '-'}%
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.ef.range?.[0] || '-'}-{results.lv.ef.range?.[1] || '-'})</td>
            {/if}
            <td colspan="2"></td>
          </tr>
          <tr>
            <td>LV Mass</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.mass.absolute, results.lv.mass.range)}>
              {results.lv.mass.absolute || '-'} g
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.mass.range?.[0] || '-'}-{results.lv.mass.range?.[1] || '-'})</td>
            {/if}
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.lv.mass.indexed, results.lv.mass.indexedRange)}>
              {results.lv.mass.indexed || '-'} g/m²
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.lv.mass.indexedRange?.[0] || '-'}-{results.lv.mass.indexedRange?.[1] || '-'})</td>
            {/if}
          </tr>

          <!-- Spacer row -->
          <tr class="h-4"><td colspan={showRanges ? 5 : 3}></td></tr>

          <!-- RV Results -->
          <tr>
            <td class="py-1.5 font-semibold" colspan={showRanges ? 5 : 3}>Right Ventricle</td>
          </tr>
          <tr>
            <td>RVEDV</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.rv.edv.absolute, results.rv.edv.range)}>
              {results.rv.edv.absolute || '-'} ml
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.rv.edv.range?.[0] || '-'}-{results.rv.edv.range?.[1] || '-'})</td>
            {/if}
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.rv.edv.indexed, results.rv.edv.indexedRange)}>
              {results.rv.edv.indexed || '-'} ml/m²
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.rv.edv.indexedRange?.[0] || '-'}-{results.rv.edv.indexedRange?.[1] || '-'})</td>
            {/if}
          </tr>
          <tr>
            <td>RVESV</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.rv.esv.absolute, results.rv.esv.range)}>
              {results.rv.esv.absolute || '-'} ml
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.rv.esv.range?.[0] || '-'}-{results.rv.esv.range?.[1] || '-'})</td>
            {/if}
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.rv.esv.indexed, results.rv.esv.indexedRange)}>
              {results.rv.esv.indexed || '-'} ml/m²
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.rv.esv.indexedRange?.[0] || '-'}-{results.rv.esv.indexedRange?.[1] || '-'})</td>
            {/if}
          </tr>
          <tr>
            <td>RVSV</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.rv.sv.absolute, results.rv.sv.range)}>
              {results.rv.sv.absolute || '-'} ml
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.rv.sv.range?.[0] || '-'}-{results.rv.sv.range?.[1] || '-'})</td>
            {/if}
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.rv.sv.indexed, results.rv.sv.indexedRange)}>
              {results.rv.sv.indexed || '-'} ml/m²
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.rv.sv.indexedRange?.[0] || '-'}-{results.rv.sv.indexedRange?.[1] || '-'})</td>
            {/if}
          </tr>
          <tr>
            <td>RVEF</td>
            <td class="text-right" class:text-red-600={showRanges && isAbnormal(results.rv.ef.value, results.rv.ef.range)}>
              {results.rv.ef.value || '-'}%
            </td>
            {#if showRanges}
              <td class="text-left pl-4">({results.rv.ef.range?.[0] || '-'}-{results.rv.ef.range?.[1] || '-'})</td>
            {/if}
            <td colspan="2"></td>
          </tr>
        </tbody>
      </table>

      {#if ageWarning}
        <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          {ageWarning}
        </div>
      {/if}

      {#if deltaSV !== null}
        <div class="mt-4 p-4 border rounded-md {deltaColor}">
          {deltaText}
        </div>
      {/if}

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

      <div class="mt-8 text-sm text-gray-600 space-y-2">
        <h4 class="font-semibold text-gray-900">References:</h4>
        <p>
          <a href="https://pubmed.ncbi.nlm.nih.gov/16755827/" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
            Maceira et al. J Cardiovasc Magn Reson. 2006;8(3):417-26.
          </a>
        </p>
        <p>
          <a href="https://pubmed.ncbi.nlm.nih.gov/17088316/" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
            Maceira et al. Eur Heart J. 2006 Dec;27(23):2879-88.
          </a>
        </p>
      </div>
    </div>
  {/if}
</div> 