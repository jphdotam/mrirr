<script>
  import LeftPanel from './components/LeftPanel.svelte';
  import Tabs from './components/Tabs.svelte';

  let patientData = {
    age: null,
    sex: null,
    height: null,
    weight: null,
    bsa: null
  };

  $: if (patientData.height && patientData.weight) {
    // Mosteller formula
    patientData.bsa = Math.round(
      (0.016667 * Math.sqrt(patientData.height) * Math.sqrt(patientData.weight)) * 100
    ) / 100;
  } else {
    patientData.bsa = null;
  }
</script>

<main class="w-full h-screen bg-white flex flex-col">
  <header class="bg-gray-50 border-b px-6 py-4">
    <h1 class="text-2xl font-bold text-gray-900">CMR Reference Ranges</h1>
    <div class="text-sm text-gray-600">
      Made by <a href="https://james.dev" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">James Howard</a>
    </div>
  </header>
  
  <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
    <div class="lg:hidden">
      <LeftPanel bind:patientData />
    </div>
    <div class="hidden lg:block">
      <LeftPanel bind:patientData />
    </div>
    <div class="flex-1 overflow-auto">
      <Tabs {patientData} />
    </div>
  </div>
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }
</style>
