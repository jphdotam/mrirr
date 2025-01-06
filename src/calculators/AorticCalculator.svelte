<script>
  export let patientData;

  const maxValues = {
    male: {
      stj: 38,
      sov: 40,
      asc: 40,
      prox_arch: 37,
      mid_arch: 34,
      prox_desc: 29,
      dist_desc: 23,
      abd: 23
    },
    female: {
      stj: 33,
      sov: 34,
      asc: 36,
      prox_arch: 34,
      mid_arch: 31,
      prox_desc: 26,
      dist_desc: 20,
      abd: 19
    }
  };

  let measurements = {
    stj: null,
    sov: null,
    asc: null,
    prox_arch: null,
    mid_arch: null,
    prox_desc: null,
    dist_desc: null,
    abd: null
  };

  function isAbnormal(value, maxValue) {
    if (!value || !maxValue) return false;
    return value > maxValue;
  }

  $: maxRanges = patientData.sex ? maxValues[patientData.sex] : null;
  $: sovIndexed = measurements.sov && patientData.bsa ? 
    Math.round((measurements.sov / patientData.bsa) * 10) / 10 : null;
  $: sovIndexedAbnormal = sovIndexed ? sovIndexed > 22 : false;
</script>

<div class="p-6 max-w-5xl mx-auto">
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label for="stj" class="block text-sm font-medium text-gray-700">
          Sinotubular junction (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.stj})</span>
          {/if}
        </label>
        <input
          id="stj"
          type="number"
          bind:value={measurements.stj}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.stj, maxRanges.stj)}
        />
      </div>

      <div>
        <label for="sov" class="block text-sm font-medium text-gray-700">
          Sinus of Valsalva (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.sov})</span>
          {/if}
        </label>
        <input
          id="sov"
          type="number"
          bind:value={measurements.sov}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.sov, maxRanges.sov)}
        />
        {#if sovIndexed}
          <div class="mt-1 text-sm {sovIndexedAbnormal ? 'text-red-600' : 'text-gray-500'}">
            Indexed: {sovIndexed} mm/m² {sovIndexedAbnormal ? '(>22 mm/m²)' : ''}
          </div>
        {/if}
      </div>

      <div>
        <label for="asc" class="block text-sm font-medium text-gray-700">
          Ascending aorta (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.asc})</span>
          {/if}
        </label>
        <input
          id="asc"
          type="number"
          bind:value={measurements.asc}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.asc, maxRanges.asc)}
        />
      </div>

      <div>
        <label for="prox_arch" class="block text-sm font-medium text-gray-700">
          Proximal aortic arch (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.prox_arch})</span>
          {/if}
        </label>
        <input
          id="prox_arch"
          type="number"
          bind:value={measurements.prox_arch}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.prox_arch, maxRanges.prox_arch)}
        />
      </div>

      <div>
        <label for="mid_arch" class="block text-sm font-medium text-gray-700">
          Mid aortic arch (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.mid_arch})</span>
          {/if}
        </label>
        <input
          id="mid_arch"
          type="number"
          bind:value={measurements.mid_arch}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.mid_arch, maxRanges.mid_arch)}
        />
      </div>

      <div>
        <label for="prox_desc" class="block text-sm font-medium text-gray-700">
          Proximal descending (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.prox_desc})</span>
          {/if}
        </label>
        <input
          id="prox_desc"
          type="number"
          bind:value={measurements.prox_desc}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.prox_desc, maxRanges.prox_desc)}
        />
      </div>

      <div>
        <label for="dist_desc" class="block text-sm font-medium text-gray-700">
          Distal descending (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.dist_desc})</span>
          {/if}
        </label>
        <input
          id="dist_desc"
          type="number"
          bind:value={measurements.dist_desc}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.dist_desc, maxRanges.dist_desc)}
        />
      </div>

      <div>
        <label for="abd" class="block text-sm font-medium text-gray-700">
          Abdominal aorta (mm)
          {#if maxRanges}
            <span class="text-gray-500">({maxRanges.abd})</span>
          {/if}
        </label>
        <input
          id="abd"
          type="number"
          bind:value={measurements.abd}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          class:text-red-600={maxRanges && isAbnormal(measurements.abd, maxRanges.abd)}
        />
      </div>
    </div>
  </div>
</div> 