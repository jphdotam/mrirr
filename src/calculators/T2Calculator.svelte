<script>
  const ranges = {
    myocardium: {
      '1.5T': [
        { severity: 'Normal', range: '> 20 ms' },
        { severity: 'Mild overload', range: '14–20 ms' },
        { severity: 'Moderate overload', range: '10–14 ms' },
        { severity: 'Severe overload', range: '< 10 ms' }
      ],
      '3.0T': [
        { severity: 'Normal', range: '> 25 ms', note: true },
        { severity: 'Mild overload', range: '17.5–25 ms', note: true },
        { severity: 'Moderate overload', range: '12.5–17.5 ms', note: true },
        { severity: 'Severe overload', range: '< 12.5 ms', note: true }
      ]
    },
    liver: {
      '1.5T': [
        { severity: 'Normal', range: '> 6.3 ms' },
        { severity: 'Mild overload', range: '2.7–6.3 ms' },
        { severity: 'Moderate overload', range: '1.4–2.7 ms' },
        { severity: 'Severe overload', range: '< 1.4 ms' }
      ],
      '3.0T': [
        { severity: 'Normal', range: '> 7.9 ms', note: true },
        { severity: 'Mild overload', range: '3.4–7.9 ms', note: true },
        { severity: 'Moderate overload', range: '1.8–3.4 ms', note: true },
        { severity: 'Severe overload', range: '< 1.8 ms', note: true }
      ]
    }
  };
</script>

<div class="p-6 max-w-5xl mx-auto">
  <div class="space-y-8">
    <!-- Myocardium Section -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Myocardial T2* Values</h3>
      <div class="grid grid-cols-2 gap-8">
        <div>
          <h4 class="font-medium mb-2">1.5T</h4>
          <div class="space-y-2">
            {#each ranges.myocardium['1.5T'] as { severity, range }}
              <div class="flex justify-between">
                <span class="text-gray-700">{severity}:</span>
                <span class="font-mono">{range}</span>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <h4 class="font-medium mb-2">3.0T</h4>
          <div class="space-y-2">
            {#each ranges.myocardium['3.0T'] as { severity, range }}
              <div class="flex justify-between">
                <span class="text-gray-700">{severity}:</span>
                <span class="font-mono italic">{range}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Liver Section -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Liver T2* Values</h3>
      <div class="grid grid-cols-2 gap-8">
        <div>
          <h4 class="font-medium mb-2">1.5T</h4>
          <div class="space-y-2">
            {#each ranges.liver['1.5T'] as { severity, range }}
              <div class="flex justify-between">
                <span class="text-gray-700">{severity}:</span>
                <span class="font-mono">{range}</span>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <h4 class="font-medium mb-2">3.0T</h4>
          <div class="space-y-2">
            {#each ranges.liver['3.0T'] as { severity, range }}
              <div class="flex justify-between">
                <span class="text-gray-700">{severity}:</span>
                <span class="font-mono italic">{range}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div class="text-sm text-gray-500 italic">
      Note: 3.0T values are approximated using a 25% reduction factor from 1.5T values
    </div>
  </div>
</div> 