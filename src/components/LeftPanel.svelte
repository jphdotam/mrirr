<script>
  export let patientData;
</script>

<div class="w-80 bg-gray-50 p-4 border-r min-h-screen">
  <h2 class="text-xl font-semibold mb-4">Patient Demographics</h2>
  
  <div class="space-y-4">
    <div>
      <label for="age" class="block text-sm font-medium text-gray-700">Age</label>
      <input
        id="age"
        type="number"
        bind:value={patientData.age}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        min="0"
        max="120"
      />
    </div>

    <fieldset>
      <legend class="block text-sm font-medium text-gray-700">Sex</legend>
      <div class="mt-1 space-x-4">
        <label class="inline-flex items-center">
          <input
            type="radio"
            bind:group={patientData.sex}
            value="male"
            class="form-radio text-blue-600"
            name="sex"
            id="sex-male"
          />
          <span class="ml-2">Male</span>
        </label>
        <label class="inline-flex items-center">
          <input
            type="radio"
            bind:group={patientData.sex}
            value="female"
            class="form-radio text-blue-600"
            name="sex"
            id="sex-female"
          />
          <span class="ml-2">Female</span>
        </label>
      </div>
    </fieldset>

    <div>
      <label for="height" class="block text-sm font-medium text-gray-700">Height (cm)</label>
      <input
        id="height"
        type="number"
        bind:value={patientData.height}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        min="0"
        max="300"
      />
    </div>

    <div>
      <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
      <input
        id="weight"
        type="number"
        bind:value={patientData.weight}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        min="0"
        max="500"
      />
    </div>

    {#if patientData.bsa}
      <div class="pt-2 border-t">
        <div class="block text-sm font-medium text-gray-700">Body Surface Area</div>
        <div class="mt-1 text-lg font-semibold">{patientData.bsa} m²</div>
        <div class="text-xs text-gray-500">Calculated using DuBois formula</div>
      </div>
    {/if}
  </div>
</div> 