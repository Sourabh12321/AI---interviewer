import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // ✅ your backend URL
//   withCredentials: true,
});

export default instance;
