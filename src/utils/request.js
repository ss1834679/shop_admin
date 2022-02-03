import axios from 'axios'

// const server = axios.create({
//     baseURL: 'http://192.168.0.233:8088',
//     timeout: 6000,
//     headers: {
//         "Accept": "*/*"
//     }
// })
// const server = axios.create({
//     baseURL: 'http://api.tbzj.net',
//     // timeout: 6000,
//     headers: {
//         "Accept": "*/*"
//     }
// })
const server = axios.create({
    baseURL: 'http://api.tbzj.net',
    // timeout: 6000,
    headers: {
        "Accept": "*/*"
    }
})
export default server;