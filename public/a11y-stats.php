<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
async function loadStats() {
  const url = new URL('/a11y-stats.php', location.origin);
  url.searchParams.set('token', '1c842e45-aaed-4777-8a7c-1d02c06b6310');
  const res = await fetch(url);
  const data = await res.json();

  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data.channels),
      datasets: [{
        label: 'Nombre d’événements',
        data: Object.values(data.channels).map(c => c.count)
      }]
    }
  });
}
loadStats();
</script>

<canvas id="chart" width="400" height="200"></canvas>
