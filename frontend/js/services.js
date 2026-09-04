const API_URL = 'http://localhost:8080/api';

export async function get(endpoint, data){
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    const json = await res.json()
    if(!res.ok) throw new Error(json.error || "Erro na requisição.")
    return json
}

export async function post(endpoint, data){
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    const json = await res.json()
    if(!res.ok) throw new Error(json.error || "Erro na requisição.")
    return res.json()
}
