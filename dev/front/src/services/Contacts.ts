import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons/'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getOne = (id: any) => {
    const request = axios.get(`${baseUrl}${id}`)
    return request.then(response => response.data)
}
const create = (newObject: any) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id: any, newObject: any) => {
    const request = axios.put(`${baseUrl}${id}`, newObject)
    return request.then(response => response.data)
}
const remove = (id: any) => {
    const request = axios.delete(`${baseUrl}${id}`)
    return request.then(response => response.data)
}
export default { getAll, getOne , create, update, remove }