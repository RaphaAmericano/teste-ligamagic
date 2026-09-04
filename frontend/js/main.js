import { checkJwtToken } from "./auth.js"

function logout(e){
    localStorage.removeItem('ligamagicJwtToken')
    window.location.replace("./index.html")
}

function guardRoutes(){
    const isAuthPage = ['/index.html', '/signin.html', '/'].some(
        path => location.pathname.endsWith(path) || location.pathname === path
    )
    const isLoggedPage = ['/dashboard.html'].some(
        path => location.pathname.endsWith(path) || location.pathname === path
    )
    if(isAuthPage && checkJwtToken()){
        window.location.replace("./dashboard.html")
    }
    if(isLoggedPage && !checkJwtToken()){
        window.location.replace("./index.html")
    }
}

(() => {
    guardRoutes()
    document.addEventListener('DOMContentLoaded', () => {
        const logoutButton = document.getElementById('logout-button')
        if(logoutButton){
            logoutButton.addEventListener('click', logout)
        }
    })
})()