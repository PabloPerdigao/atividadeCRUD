const form = document.getElementById('form-integrante');
const formEdicao = document.getElementById('form-edicao');
const mensagemFeedback = document.getElementById('mensagem');
const tbody = document.querySelector('#tabela-integrantes tbody');

const modalEdicao = new bootstrap.Modal(document.getElementById('modalEdicao'));


let listaGlobal = [];


// buscar e carregar integrantes
async function carregarIntegrantes() {
    try {
        const resposta = await fetch('http://localhost:3000/integrantes');
        listaGlobal = await resposta.json();
        
        tbody.innerHTML = ''; 

        // tabela de integrantes
        listaGlobal.forEach(integrante => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${integrante.id}</strong></td>
                <td>${integrante.nome}</td>
                <td>${integrante.email}</td>
                <td><a href="${integrante.github}" target="_blank" class="text-decoration-none">Ver Perfil</a></td>
                <td><a href="${integrante.linkedin}" target="_blank" class="text-decoration-none">Ver Perfil</a></td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm me-1" onclick="editarIntegrante(${integrante.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirIntegrante(${integrante.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao carregar lista:', erro);
    }
}


// cadastrar integrante
form.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const github = document.getElementById('github').value;
    const linkedin = document.getElementById('linkedin').value;

    try {
        const resposta = await fetch('http://localhost:3000/integrantes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, github, linkedin })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagemFeedback.className = 'text-success mt-3 fw-bold';
            mensagemFeedback.innerText = dados.mensagem;
            form.reset();
            carregarIntegrantes(); // Atualiza a tabela
        } else {
            mensagemFeedback.className = 'text-danger mt-3 fw-bold';
            mensagemFeedback.innerText = 'Erro: ' + dados.erro;
        }
    } catch (erro) {
        mensagemFeedback.className = 'text-danger mt-3 fw-bold';
        mensagemFeedback.innerText = 'Erro ao conectar ao servidor.';
    }
});


// excluir integrante
async function excluirIntegrante(id) {
    const confirmacao = confirm('Tem certeza que deseja excluir este integrante da equipe? Essa ação não pode ser desfeita.');
    
    if (confirmacao) {
        try {
            const resposta = await fetch(`http://localhost:3000/integrantes/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                carregarIntegrantes(); // Recarrega a tabela após excluir
            } else {
                alert('Erro ao excluir o integrante.');
            }
        } catch (erro) {
            console.error('Erro:', erro);
            alert('Erro ao conectar ao servidor.');
        }
    }
}

// Edição de integrante
function editarIntegrante(id) {
    const integrante = listaGlobal.find(i => i.id === id);
    
    document.getElementById('edit-id').value = integrante.id;
    document.getElementById('edit-nome').value = integrante.nome;
    document.getElementById('edit-email').value = integrante.email;
    document.getElementById('edit-github').value = integrante.github;
    document.getElementById('edit-linkedin').value = integrante.linkedin;

    modalEdicao.show();
}

formEdicao.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const email = document.getElementById('edit-email').value;
    const github = document.getElementById('edit-github').value;
    const linkedin = document.getElementById('edit-linkedin').value;

    try {
        const resposta = await fetch(`http://localhost:3000/integrantes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, github, linkedin })
        });

        if (resposta.ok) {
            modalEdicao.hide(); 
            carregarIntegrantes(); 
        } else {
            alert('Erro ao atualizar os dados.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao conectar ao servidor.');
    }
});

carregarIntegrantes();