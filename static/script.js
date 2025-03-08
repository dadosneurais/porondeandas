document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const loadingElement = document.getElementById("loading");
    const resultElement = document.getElementById("result");

    resultElement.innerHTML = "";

    let points = 0;
    const loadingInterval = setInterval(() => {
        points = (points + 1) % 4;  
        loadingElement.textContent = "Pesquisando" + ".".repeat(points);
    }, 500);

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(loadingInterval); 

        if (data.status === "success") {
            let urls = extractUrls(data.output);

            resultElement.innerHTML = `Resultado encontrado para "${username}":<br><br>`;
            
            if (urls.length > 0) {
                urls.forEach(url => {
                    let urlElement = document.createElement('a');
                    urlElement.classList.add('url');
                    urlElement.href = url;
                    urlElement.target = "_blank";
                    urlElement.textContent = url;

                    let urlWrapper = document.createElement('div');
                    urlWrapper.appendChild(urlElement);
                    resultElement.appendChild(urlWrapper);
                });
            } else {
                resultElement.innerHTML += "Nenhum resultado encontrado.";  
            }
        } else {
            resultElement.innerHTML = `Erro: ${data.message}`; 
        }
    })
    .catch(error => {
        clearInterval(loadingInterval);
        resultElement.innerHTML = "Ocorreu um erro ao realizar a pesquisa."; 
    });
});

function extractUrls(text) {
    const urlPattern = /https?:\/\/[^\s]+/g; 
    return text.match(urlPattern) || [];
}
