<template>
  <div class="dashboard">
    <h1 class="title">Dashboard ACPACW+TB</h1>

    <div class="panel-container">
      <!-- Panel LUZ -->
      <div class="panel">
        <h2>LUZ</h2>
        <div class="info">
          <p><strong>Estado luz:</strong> {{ ledPrendido ? 'Prendida' : 'Apagada' }}</p>
          <p><strong>Exterior:</strong> {{ esDia ? 'Día' : 'Noche' }}</p>
          <p><strong>Nivel actual:</strong> {{ nivelLuz }}</p>
        </div>
        <div class="chart-wrapper">
          <LuzChart :labels="graficoDatos.map(d => d.tiempo)" :values="graficoDatos.map(d => d.nivel)" />
        </div>
      </div>

      <!-- Panel VENTILACIÓN -->
      <div class="panel">
        <h2>VENTANA</h2>
        <div class="info">
          <p><strong>Movimiento:</strong> {{ movDetectado ? 'Sí' : 'No' }}</p>
          <p><strong>Estado:</strong> {{ ventanaAbierta ? 'Abierta' : 'Cerrada' }}</p>
          <p><strong>Duración estado actual:</strong> {{ duracionEstado }}</p>
        </div>

        <img
          :src="ventanaAbierta ? ventanaAbiertaImg : ventanaCerradaImg"
          alt="Estado de la ventana"
          class="ventana-img"
        />


        <h3>Eventos recientes</h3>
<div v-if="eventosVentana.length === 0">
  <p>Sin eventos recientes</p>
</div>
<ul v-else class="eventos">
  <li v-for="e in eventosVentana" :key="e.hora">
    {{ e.hora }} – {{ e.estado ? 'Abierta' : 'Cerrada' }}
  </li>
</ul>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="logout-btn" @click="cerrarSesion">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getTelemetry } from '../services/thingsboardService'
import LuzChart from '../components/LuzChart.vue'
import ventanaAbiertaImg from '../assets/open.png'
import ventanaCerradaImg from '../assets/closed.png'

const router = useRouter()

const ledPrendido = ref(false)
const ventanaAbierta = ref(false)
const nivelLuz = ref(null)
const esDia = ref(null)
const movDetectado = ref(null)
const graficoDatos = ref([])

const eventosVentana = ref([])
const ultimaHoraCambio = ref(null)
const duracionEstado = ref('00:00')

// Actualiza duración del estado cada segundo
setInterval(() => {
  if (ultimaHoraCambio.value) {
    const now = new Date()
    const diff = Math.floor((now - ultimaHoraCambio.value) / 1000)
    const mins = String(Math.floor(diff / 60)).padStart(2, '0')
    const secs = String(diff % 60).padStart(2, '0')
    duracionEstado.value = `${mins}:${secs}`
  }
}, 1000)

// Detecta cambio de estado ventana
watch(ventanaAbierta, (nuevoEstado) => {
  const ahora = new Date()
  ultimaHoraCambio.value = ahora

  eventosVentana.value.unshift({
    estado: nuevoEstado,
    hora: ahora.toLocaleTimeString()
  })

  if (eventosVentana.value.length > 5) eventosVentana.value.pop()
})

const loadData = async () => {
  try {
    const data = await getTelemetry('9ebe5340-47a3-11f0-a76f-af9873efe2ab', 'nivelLuz,ledPrendido,ventanaAbierta,esDia,movDetectado')

    const nivel = parseInt(data.nivelLuz?.[0]?.value)
    if (!isNaN(nivel)) {
      nivelLuz.value = nivel
      const now = new Date().toLocaleTimeString()
      graficoDatos.value.push({ tiempo: now, nivel })
      if (graficoDatos.value.length > 10) graficoDatos.value.shift()
    }

    ledPrendido.value = data.ledPrendido?.[0]?.value === 'true'
    ventanaAbierta.value = data.ventanaAbierta?.[0]?.value === 'true'
    esDia.value = data.esDia?.[0]?.value === 'true'
    movDetectado.value = data.movDetectado?.[0]?.value === 'true'
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
}

onMounted(() => {
  loadData()
   ultimaHoraCambio.value = new Date()
  setInterval(loadData, 10000)
})

const cerrarSesion = () => {
  router.push('/')
}
</script>

<style scoped>
.dashboard {
  background-color: #206A73;
  color: white;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 30px;
}

.panel-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
}

.panel {
  background-color: #A4C3C6;
  color: black;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.panel h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.info p {
  margin: 6px 0;
  font-size: 16px;
}

.chart-wrapper {
  width: 100%;
  margin-top: 20px;
}

.ventana-icon {
  width: 60px;
  margin: 12px 0;
}

.eventos {
  list-style: none;
  padding: 0;
  margin-top: 10px;
  font-size: 14px;
  text-align: left;
  width: 100%;
}

.bottom-bar {
  margin-top: 30px;
  background-color: #A4C3C6;
  padding: 15px 30px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.logout-btn {
  background-color: #E74C3C;
  border: none;
  color: white;
  font-weight: bold;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.ventana-img {
  width: 80px;
  height: 80px;
  margin: 15px 0;
}

</style>
