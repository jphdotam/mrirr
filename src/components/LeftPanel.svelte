<script>
  export let patientData;
</script>

<div class="w-80 bg-gray-50 p-4 border-r min-h-screen">
  <h2 class="text-xl font-semibold mb-4">Patient Demographics</h2>
  
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Age</label>
      <input
        type="number"
        bind:value={patientData.age}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        min="0"
        max="120"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Sex</label>
      <div class="mt-1 space-x-4">
        <label class="inline-flex items-center">
          <input
            type="radio"
            bind:group={patientData.sex}
            value="male"
            class="form-radio text-blue-600"
          />
          <span class="ml-2">Male</span>
        </label>
        <label class="inline-flex items-center">
          <input
            type="radio"
            bind:group={patientData.sex}
            value="female"
            class="form-radio text-blue-600"
          />
          <span class="ml-2">Female</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Height (cm)</label>
      <input
        type="number"
        bind:value={patientData.height}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        min="0"
        max="300"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Weight (kg)</label>
      <input
        type="number"
        bind:value={patientData.weight}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        min="0"
        max="500"
      />
    </div>

    {#if patientData.bsa}
      <div class="pt-2 border-t">
        <label class="block text-sm font-medium text-gray-700">Body Surface Area</label>
        <div class="mt-1 text-lg font-semibold">{patientData.bsa} m²</div>
        <div class="text-xs text-gray-500">Calculated using DuBois formula</div>
      </div>
    {/if}
  </div>
</div> 