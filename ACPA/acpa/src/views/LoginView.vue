<template>
  <div class="container">
    <div class="left-side"></div>
    <div class="right-side">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="login">
          <label for="email">correo</label>
          <input type="email" id="email" v-model="email" placeholder="example@mail.com" required />

          <label for="password">contraseña</label>
          <div class="password-wrapper">
            <input
              :type="mostrarPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
            />
            <span class="toggle-btn" @click="mostrarPassword = !mostrarPassword">
              {{ mostrarPassword ? '🙈' : '👁️' }}
            </span>
          </div>

          <button type="submit">Ingresar</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginToThingsBoard } from '@/services/thingsboardService'

const email = ref('')
const password = ref('')
const error = ref(null)
const mostrarPassword = ref(false)

const router = useRouter()

const login = async () => {
  try {
    await loginToThingsBoard(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Credenciales incorrectas o error de conexión'
    console.error('Login fallido:', err)
  }
}
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #010D26;
}
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
}
.left-side {
  flex: 1;
  background-image: url('../assets/fondo.png');
  background-size: cover;
  background-position: center;
}
.right-side {
  flex: 1;
  background-color: #206A73;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo {
  height: 200px;
  margin-bottom: 20px;
}
.login-card {
  background-color: transparent;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  color: white;
}
.login-card h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}
label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: none;
  box-sizing: border-box;
}

.password-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.password-wrapper input {
  width: 100%;
  padding: 10px;
  padding-right: 40px;
  border-radius: 4px;
  border: none;
}

.toggle-btn {
  position: absolute;
  top: 35%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #132F40;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
button:hover {
  background-color: #99BBBF;
}
.error {
  margin-top: 10px;
  color: #f66;
  text-align: center;
}
</style>
