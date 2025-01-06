<script>
  const measurements = [
    { name: 'Main Pulmonary Artery', value: '≤ 32 mm' },
    { name: 'Spleen', value: '≤ 13 cm' }
  ];
</script>

<div class="p-6 max-w-5xl mx-auto">
  <div class="max-w-2xl">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="text-left font-medium text-gray-500 py-2">Structure</th>
          <th class="text-right font-medium text-gray-500">Normal Range</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        {#each measurements as { name, value }}
          <tr>
            <td class="py-3">{name}</td>
            <td class="text-right font-mono">{value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div> 