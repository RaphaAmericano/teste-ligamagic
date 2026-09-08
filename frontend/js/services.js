const API_URL = 'http://localhost:8080/api';

function getHeaders(token){
    const headers = { 'Content-Type': 'application/json' }
    if(token) headers['Authorization'] = `Bearer ${token}`
    return headers
}

export async function get(endpoint, token = ''){
    const headers = getHeaders(token)
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers,
    })
    const json = await res.json()
    if(!res.ok) throw new Error(json.error || "Erro na requisição.")
    return json
}

export async function post(endpoint, data, token = ""){
    const headers = getHeaders(token)
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    })
    const json = await res.json()
    if(!res.ok) throw new Error(json.error || "Erro na requisição.")
    return json
}
export async function postFormData(endpoint, data, token){
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
    })
    const json = await res.json()
    if(!res.ok) throw new Error(json.error || "Erro na requisição.")
    return json
}
export async function putFormData(endpoint, data, token){
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    })
    const json = await res.json()
    if(!res.ok) throw new Error(json.error || "Erro na requisição.")
    return json
}


