<script>
  import VentricleCalculator from '../calculators/VentricleCalculator.svelte';
  import AtriaCalculator from '../calculators/AtriaCalculator.svelte';
  import AorticCalculator from '../calculators/AorticCalculator.svelte';
  import T2Calculator from '../calculators/T2Calculator.svelte';
  import ExtracardiacCalculator from '../calculators/ExtracardiacCalculator.svelte';
  
  export let patientData;

  const tabs = [
    { id: 'ventricles', label: 'Ventricle Measurements', component: VentricleCalculator },
    { id: 'atria', label: 'Atrial Measurements', component: AtriaCalculator },
    { id: 'aorta', label: 'Aortic Measurements', component: AorticCalculator },
    { id: 't2', label: 'T2* Mapping', component: T2Calculator },
    { id: 'extracardiac', label: 'Extracardiac', component: ExtracardiacCalculator }
  ];

  let activeTab = tabs[0];
</script>

<div class="h-full flex flex-col">
  <div class="border-b">
    <nav class="flex space-x-4 px-4" aria-label="Tabs">
      {#each tabs as tab}
        <button
          class="px-3 py-2 text-sm font-medium rounded-t-lg
            {activeTab.id === tab.id
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => activeTab = tab}
          aria-current={activeTab.id === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      {/each}
    </nav>
  </div>

  <div class="flex-1 overflow-auto">
    <svelte:component this={activeTab.component} {patientData} />
  </div>
</div> 