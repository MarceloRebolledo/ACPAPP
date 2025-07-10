import axios from 'axios';

const API_URL = 'http://iot.ceisufro.cl:8080/api';
const DEVICE_TOKEN = 'odpuzt2u87zlfmizuzwp'; // Token del ESP32
export const DEVICE_ID_CONST = '9ebe5340-47a3-11f0-a76f-af9873efe2ab';

let jwtToken = null;

// Login
export const loginToThingsBoard = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password
  });

  jwtToken = response.data.token;
  return jwtToken;
};

export const getTelemetry = async (deviceId, keys) => {
  if (!jwtToken) throw new Error('No autenticado en ThingsBoard');

  const response = await axios.get(`${API_URL}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`, {
    headers: {
      'X-Authorization': `Bearer ${jwtToken}`
    },
    params: { keys }
  });

  return response.data;
};

export const isAuthenticated = () => !!jwtToken;

export const postAttribute = async (data) => {
  return axios.post(
    `http://iot.ceisufro.cl:8080/api/v1/${DEVICE_TOKEN}/attributes`,
    data,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

