import axios from 'axios'

/* 订单临时ip */
const server = axios.create({
  baseURL: 'http://192.168.0.89:8088',
  headers: {
    Accept: '*/*',
  },
})

export default server
