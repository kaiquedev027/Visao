function uploadImage() {
    var form = document.getElementById('uploadForm');
    var formData = new FormData(form);

    fetch('/extract-info', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Extracted information from the image
        var cliente = data.cliente;
        var endereco = data.endereco;
        var fone = data.fone;

        // Register the client
        adicionarCliente({ nome: cliente, endereco: endereco, telefone: fone });

        // Display the result
        displayResult(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayResult(data) {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML += '<p>Cliente: ' + data.cliente + '</p>';
    resultDiv.innerHTML += '<p>Endereço: ' + data.endereco + '</p>';
    resultDiv.innerHTML += '<p>Fone: ' + data.fone + '</p>';
}

function adicionarCliente(clienteData) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    const clienteExistente = clientes.find(c => c.nome.toLowerCase() === clienteData.nome.toLowerCase() && c.endereco.toLowerCase() === clienteData.endereco.toLowerCase());

    if (clienteExistente) {
        // If the client already exists, display an error message and don't add the new client
        alert('Este cliente já está cadastrado');
        return;
    }

    // Add the new client to the array of clients
    clientes.push(clienteData);

    // Store the updated array of clients in the localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Optionally, you can update the UI to reflect the addition of the new client
    exibirClientes();
}

// Function to display the list of clients
function exibirClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    let listaClientes = '';
    clientes.forEach((cliente) => {
        listaClientes += `
            <li>
                <div>Nome do Cliente: ${cliente.nome}</div>
                <div>Endereço: ${cliente.endereco}</div>
                <div>Telefone: ${cliente.telefone}</div>
            </li>
        `;
    });
    document.getElementById('listaClientes').innerHTML = listaClientes;
}

// Call the function to display the list of clients when the page loads
exibirClientes();