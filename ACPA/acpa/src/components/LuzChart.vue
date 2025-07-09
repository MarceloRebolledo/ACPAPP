<template>
  <div style="height: 300px">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

const props = defineProps({
  labels: Array,
  values: Array
})

// ⚠️ Aquí está el cambio importante
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Nivel de luz',
      data: props.values,
      borderColor: '#8884d8',
      backgroundColor: 'rgba(136, 132, 216, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 3
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#000'
      }
    },
    x: {
      ticks: {
        color: '#000'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#000'
      }
    }
  }
}
</script>

<style scoped>
canvas {
  max-height: 300px;
}
</style>
