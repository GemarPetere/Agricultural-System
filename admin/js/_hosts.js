let apiUrl = "";
let host = document.location.hostname

if(host == "localhost" || host == "127.0.0.1"){
    apiUrl = "http://localhost:8002/api";
}else if(host == "recommender-system.com"){
    apiUrl = ""
}

export let apiBaseUrl = apiUrl;