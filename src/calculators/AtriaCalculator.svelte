<script>
  export let patientData;

  let measurements = {
    la_2c: null,
    la_4c: null,
    ra_4c: null,
    la_length: null
  };

  function getSeverity(value) {
    if (!value) return null;
    if (value < 13) return 'Normal';
    if (value < 16) return 'Mild dilatation';
    if (value < 19) return 'Moderate dilatation';
    return 'Severe dilatation';
  }

  function getSeverityColor(value) {
    if (!value) return '';
    if (value < 13) return 'text-green-600';
    if (value < 16) return 'text-yellow-600';
    if (value < 19) return 'text-orange-600';
    return 'text-red-600';
  }

  $: la_volume = measurements.la_2c && measurements.la_4c && measurements.la_length ?
    Math.round((measurements.la_2c * measurements.la_4c * 0.85 / measurements.la_length) * 10) / 10 : null;

  $: la_4c_indexed = measurements.la_4c && patientData.bsa ?
    Math.round((measurements.la_4c / patientData.bsa) * 10) / 10 : null;

  $: ra_4c_indexed = measurements.ra_4c && patientData.bsa ?
    Math.round((measurements.ra_4c / patientData.bsa) * 10) / 10 : null;
</script>

<div class="p-6 max-w-5xl mx-auto">
  <div class="grid grid-cols-2 gap-8">
    <!-- 4-chamber view -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">4-chamber View</h3>
      <div>
        <label for="la_4c" class="block text-sm font-medium text-gray-700">Max LA Area (cm²)</label>
        <input
          id="la_4c"
          type="number"
          bind:value={measurements.la_4c}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          step="0.1"
        />
      </div>
      <div>
        <label for="ra_4c" class="block text-sm font-medium text-gray-700">Max RA Area (cm²)</label>
        <input
          id="ra_4c"
          type="number"
          bind:value={measurements.ra_4c}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          step="0.1"
        />
      </div>
      <div>
        <label for="la_length" class="block text-sm font-medium text-gray-700">LA Length (cm)</label>
        <input
          id="la_length"
          type="number"
          bind:value={measurements.la_length}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          step="0.1"
        />
      </div>
    </div>

    <!-- 2-chamber view -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">2-chamber View</h3>
      <div>
        <label for="la_2c" class="block text-sm font-medium text-gray-700">Max LA Area (cm²)</label>
        <input
          id="la_2c"
          type="number"
          bind:value={measurements.la_2c}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          step="0.1"
        />
      </div>
    </div>
  </div>

  {#if patientData.bsa}
    <div class="mt-8">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left font-medium text-gray-500 py-2">Measurement</th>
            <th class="text-right font-medium text-gray-500">Value</th>
            <th class="text-left pl-4 font-medium text-gray-500">Assessment</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr>
            <td>LA Area (4-chamber indexed)</td>
            <td class="text-right {getSeverityColor(la_4c_indexed)}">
              {la_4c_indexed ? `${la_4c_indexed} cm²/m²` : '-'}
            </td>
            <td class="pl-4 {getSeverityColor(la_4c_indexed)}">
              {la_4c_indexed ? getSeverity(la_4c_indexed) : '-'}
            </td>
          </tr>
          <tr>
            <td>RA Area (4-chamber indexed)</td>
            <td class="text-right {getSeverityColor(ra_4c_indexed)}">
              {ra_4c_indexed ? `${ra_4c_indexed} cm²/m²` : '-'}
            </td>
            <td class="pl-4 {getSeverityColor(ra_4c_indexed)}">
              {ra_4c_indexed ? getSeverity(ra_4c_indexed) : '-'}
            </td>
          </tr>
          <tr>
            <td>LA Volume (Biplane)</td>
            <td class="text-right">
              {la_volume ? `${la_volume} ml` : '-'}
            </td>
            <td class="pl-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  {/if}
</div> 