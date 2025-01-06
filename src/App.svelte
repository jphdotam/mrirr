<script>
  import LeftPanel from './components/LeftPanel.svelte';
  import Tabs from './components/Tabs.svelte';

  let patientData = {
    age: null,
    sex: 'female',
    height: null,
    weight: null,
    bsa: null
  };

  $: if (patientData.height && patientData.weight) {
    // Dubois formula
    patientData.bsa = Math.round(
      (0.007184 * Math.pow(patientData.height, 0.725) * Math.pow(patientData.weight, 0.425)) * 100
    ) / 100;
  } else {
    patientData.bsa = null;
  }
</script>

<main class="w-full h-screen bg-white flex">
  <LeftPanel bind:patientData />
  <div class="flex-1 overflow-hidden">
    <Tabs {patientData} />
  </div>
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }
</style>
