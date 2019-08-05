export function authHeader() {
    // Retorna cabeçalho de autorização com o JWT
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) { // Se houver um utilizador e esse utilizador tiver um token
        return { 'Authorization': 'Bearer ' + user.token }; // Devolver cabeçalho de autorização com o JWT
    } else {
        return {}; // Caso contrário, devolver cabeçalho vazio
    }
}