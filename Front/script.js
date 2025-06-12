const API_URL = 'http://127.0.0.1:8080';

// Função para exibir uma seção
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Carregar listas iniciais e opções de select
async function loadData() {
    await Promise.all([listarClientes(), listarFilmes(), listarLocacoes()]);
    await loadSelectOptions();
}

// --- Funções de Listagem ---

// Listar Clientes
async function listarClientes() {
    try {
        const response = await fetch(`${API_URL}/cliente`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const clientes = await response.json();
        const tbody = document.getElementById('clienteTableBody');
        tbody.innerHTML = '';
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefone}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCliente(${cliente.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCliente(${cliente.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        alert('Erro ao listar clientes. Verifique o console do navegador e o log do servidor.');
    }
}

// Listar Filmes
async function listarFilmes() {
    try {
        const response = await fetch(`${API_URL}/filme`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const filmes = await response.json();
        const tbody = document.getElementById('filmeTableBody');
        tbody.innerHTML = '';
        filmes.forEach(filme => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${filme.id}</td>
                <td>${filme.titulo}</td>
                <td>${filme.genero || 'N/A'}</td>
                <td>${filme.ano || 'N/A'}</td>
                <td>${filme.disponivel ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editFilme(${filme.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFilme(${filme.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao listar filmes:', error);
        alert('Erro ao listar filmes. Verifique o console do navegador e o log do servidor.');
    }
}

// Listar Locações
async function listarLocacoes() {
    try {
        const response = await fetch(`${API_URL}/locacao`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const locacoes = await response.json();
        const tbody = document.getElementById('locacaoTableBody');
        tbody.innerHTML = '';
        locacoes.forEach(locacao => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${locacao.id}</td>
                <td>${locacao.cliente ? locacao.cliente.nome : 'N/A'}</td>
                <td>${locacao.filme ? locacao.filme.titulo : 'N/A'}</td>
                <td>${new Date(locacao.dataLocacao).toLocaleDateString()}</td>
                <td>${locacao.dataDevolucao ? new Date(locacao.dataDevolucao).toLocaleDateString() : 'Não Devolvido'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editLocacao(${locacao.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLocacao(${locacao.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao listar locações:', error);
        alert('Erro ao listar locações. Verifique o console do navegador e o log do servidor.');
    }
}

// Carregar opções para selects (usado em cadastro e edição de locação)
async function loadSelectOptions() {
    try {
        const [clientes, filmes] = await Promise.all([
            fetch(`${API_URL}/cliente`).then(res => res.json()),
            fetch(`${API_URL}/filme`).then(res => res.json())
        ]);

        const clienteLocacaoSelect = document.getElementById('clienteLocacao');
        const filmeLocacaoSelect = document.getElementById('filmeLocacao');
        const editClienteLocacaoSelect = document.getElementById('editClienteLocacao');
        const editFilmeLocacaoSelect = document.getElementById('editFilmeLocacao');

        // Limpa e popula selects de cadastro de locação
        clienteLocacaoSelect.innerHTML = '<option value="">Selecione um Cliente</option>';
        filmeLocacaoSelect.innerHTML = '<option value="">Selecione um Filme</option>';
        clientes.forEach(cliente => {
            clienteLocacaoSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
        });
        filmes.forEach(filme => {
            if (filme.disponivel) { // Apenas filmes disponíveis para locação
                filmeLocacaoSelect.innerHTML += `<option value="${filme.id}">${filme.titulo}</option>`;
            }
        });

        // Limpa e popula selects do modal de edição de locação
        if (editClienteLocacaoSelect) {
            editClienteLocacaoSelect.innerHTML = '<option value="">Selecione um Cliente</option>';
            clientes.forEach(cliente => {
                editClienteLocacaoSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
            });
        }
        if (editFilmeLocacaoSelect) {
            editFilmeLocacaoSelect.innerHTML = '<option value="">Selecione um Filme</option>';
            filmes.forEach(filme => {
                editFilmeLocacaoSelect.innerHTML += `<option value="${filme.id}">${filme.titulo}</option>`;
            });
        }

    } catch (error) {
        console.error('Erro ao carregar opções de seleção:', error);
        alert('Erro ao carregar opções para selects. Verifique o console do navegador e o log do servidor.');
    }
}

// --- Funções de Cadastro ---

// Cadastrar Cliente
document.getElementById('clienteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const cliente = {
        nome: document.getElementById('nomeCliente').value,
        email: document.getElementById('emailCliente').value,
        telefone: document.getElementById('telefoneCliente').value
    };
    try {
        const response = await fetch(`${API_URL}/cliente`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        document.getElementById('clienteForm').reset();
        listarClientes();
        loadSelectOptions();
        alert('Cliente cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Erro ao cadastrar cliente. Verifique o console.');
    }
});

// Cadastrar Filme
document.getElementById('filmeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const filme = {
        titulo: document.getElementById('tituloFilme').value,
        genero: document.getElementById('generoFilme').value,
        ano: parseInt(document.getElementById('anoFilme').value),
        disponivel: document.getElementById('disponivelFilme').value === 'true'
    };
    try {
        const response = await fetch(`${API_URL}/filme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filme)
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        document.getElementById('filmeForm').reset();
        listarFilmes();
        loadSelectOptions();
        alert('Filme cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar filme:', error);
        alert('Erro ao cadastrar filme. Verifique o console.');
    }
});

// Cadastrar Locação
document.getElementById('locacaoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const locacao = {
        cliente: { id: document.getElementById('clienteLocacao').value },
        filme: { id: document.getElementById('filmeLocacao').value },
        dataLocacao: document.getElementById('dataLocacao').value // Usar dataLocacao conforme o model
    };
    try {
        // Validação adicional: verificar se o filme está disponível antes de tentar locar
        const filmeResponse = await fetch(`${API_URL}/filme/${locacao.filme.id}`);
        const filme = await filmeResponse.json();
        if (!filme.disponivel) {
            throw new Error('Filme não disponível para locação no momento.');
        }

        const response = await fetch(`${API_URL}/locacao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locacao)
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        document.getElementById('locacaoForm').reset();
        listarLocacoes();
        loadSelectOptions(); // Recarrega para atualizar a disponibilidade do filme
        alert('Locação cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar locação:', error);
        alert(error.message); // Exibe a mensagem de erro (ex: "Filme não disponível")
    }
});

// --- Funções de Edição ---

// Edição de Cliente
async function editCliente(id) {
    try {
        const response = await fetch(`${API_URL}/cliente/${id}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const cliente = await response.json();

        document.getElementById('editClienteId').value = cliente.id;
        document.getElementById('editNomeCliente').value = cliente.nome;
        document.getElementById('editEmailCliente').value = cliente.email;
        document.getElementById('editTelefoneCliente').value = cliente.telefone;

        const editClienteModal = new bootstrap.Modal(document.getElementById('editClienteModal'));
        editClienteModal.show();
    } catch (error) {
        console.error('Erro ao carregar cliente para edição:', error);
        alert('Erro ao carregar cliente para edição. Verifique o console.');
    }
}

document.getElementById('editClienteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('editClienteId').value;
    const clienteAtualizado = {
        id: id,
        nome: document.getElementById('editNomeCliente').value,
        email: document.getElementById('editEmailCliente').value,
        telefone: document.getElementById('editTelefoneCliente').value
    };

    try {
        const response = await fetch(`${API_URL}/cliente`, {
            method: 'PUT', // Método HTTP para atualização
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteAtualizado)
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const editClienteModal = bootstrap.Modal.getInstance(document.getElementById('editClienteModal'));
        editClienteModal.hide(); // Fecha o modal
        listarClientes(); // Recarrega a lista
        loadSelectOptions(); // Recarrega opções se houver cliente em selects
        alert('Cliente atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente. Verifique o console.');
    }
});

// Edição de Filme
async function editFilme(id) {
    try {
        const response = await fetch(`${API_URL}/filme/${id}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const filme = await response.json();

        document.getElementById('editFilmeId').value = filme.id;
        document.getElementById('editTituloFilme').value = filme.titulo;
        document.getElementById('editGeneroFilme').value = filme.genero;
        document.getElementById('editAnoFilme').value = filme.ano;
        document.getElementById('editDisponivelFilme').value = filme.disponivel.toString(); // Converte boolean para string

        const editFilmeModal = new bootstrap.Modal(document.getElementById('editFilmeModal'));
        editFilmeModal.show();
    } catch (error) {
        console.error('Erro ao carregar filme para edição:', error);
        alert('Erro ao carregar filme para edição. Verifique o console.');
    }
}

document.getElementById('editFilmeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('editFilmeId').value;
    const filmeAtualizado = {
        id: id,
        titulo: document.getElementById('editTituloFilme').value,
        genero: document.getElementById('editGeneroFilme').value,
        ano: parseInt(document.getElementById('editAnoFilme').value),
        disponivel: document.getElementById('editDisponivelFilme').value === 'true'
    };

    try {
        const response = await fetch(`${API_URL}/filme`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filmeAtualizado)
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const editFilmeModal = bootstrap.Modal.getInstance(document.getElementById('editFilmeModal'));
        editFilmeModal.hide();
        listarFilmes();
        loadSelectOptions(); // Recarrega opções para refletir mudanças de disponibilidade
        alert('Filme atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        alert('Erro ao atualizar filme. Verifique o console.');
    }
});

// Edição de Locação
async function editLocacao(id) {
    try {
        const response = await fetch(`${API_URL}/locacao/${id}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const locacao = await response.json();

        document.getElementById('editLocacaoId').value = locacao.id;
        // Popula selects de Cliente e Filme. Garante que o valor seja o ID da entidade.
        document.getElementById('editClienteLocacao').value = locacao.cliente ? locacao.cliente.id : '';
        document.getElementById('editFilmeLocacao').value = locacao.filme ? locacao.filme.id : '';
        // Converte a data para o formato YYYY-MM-DD para o input type="date"
        document.getElementById('editDataLocacao').value = locacao.dataLocacao;
        document.getElementById('editDataDevolucao').value = locacao.dataDevolucao || ''; // Pode ser nulo/vazio

        const editLocacaoModal = new bootstrap.Modal(document.getElementById('editLocacaoModal'));
        editLocacaoModal.show();
    } catch (error) {
        console.error('Erro ao carregar locação para edição:', error);
        alert('Erro ao carregar locação para edição. Verifique o console.');
    }
}

document.getElementById('editLocacaoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('editLocacaoId').value;
    const dataDevolucaoValue = document.getElementById('editDataDevolucao').value;

    const locacaoAtualizada = {
        id: id,
        cliente: { id: document.getElementById('editClienteLocacao').value },
        filme: { id: document.getElementById('editFilmeLocacao').value },
        dataLocacao: document.getElementById('editDataLocacao').value,
        dataDevolucao: dataDevolucaoValue === '' ? null : dataDevolucaoValue // Envia null se o campo estiver vazio
    };

    try {
        const response = await fetch(`${API_URL}/locacao`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locacaoAtualizada)
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const editLocacaoModal = bootstrap.Modal.getInstance(document.getElementById('editLocacaoModal'));
        editLocacaoModal.hide();
        listarLocacoes();
        loadSelectOptions(); // Recarrega opções caso a disponibilidade do filme mude
        alert('Locação atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar locação:', error);
        alert('Erro ao atualizar locação. Verifique o console.');
    }
});

// --- Funções de Exclusão ---

// Exclusão de Cliente
async function deleteCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente? Isso removerá todas as locações associadas a ele no sistema.')) {
        return; // Cancela se o usuário não confirmar
    }
    try {
        const response = await fetch(`${API_URL}/cliente/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            // Se o servidor retornar 409 (Conflict), é porque existem locações
            if (response.status === 409) {
                alert('Não é possível excluir o cliente. Existem locações ativas ou históricas associadas a ele.');
            } else {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
        } else {
            listarClientes(); // Recarrega a lista após a exclusão
            loadSelectOptions(); // Recarrega para atualizar opções de seleção
            alert('Cliente excluído com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        if (!error.message.includes('Filme não disponível')) { // Evita alertar duas vezes pela validação customizada
            alert('Erro ao excluir cliente. Verifique o console.');
        }
    }
}


// Exclusão de Filme
async function deleteFilme(id) {
    if (!confirm('Tem certeza que deseja excluir este filme?')) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/filme/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            // Se o servidor retornar 409 (Conflict), é porque existem locações
            if (response.status === 409) {
                alert('Não é possível excluir o filme. Existem locações ativas ou históricas associadas a ele.');
            } else {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
        } else {
            listarFilmes();
            loadSelectOptions(); // Recarrega para atualizar opções de locação
            alert('Filme excluído com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao excluir filme:', error);
        if (!error.message.includes('Filme não disponível')) {
            alert('Erro ao excluir filme. Verifique o console.');
        }
    }
}

// Exclusão de Locação
async function deleteLocacao(id) {
    if (!confirm('Tem certeza que deseja excluir esta locação?')) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/locacao/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        listarLocacoes();
        loadSelectOptions(); // Recarrega opções para atualizar disponibilidade do filme
        alert('Locação excluída com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir locação:', error);
        alert('Erro ao excluir locação. Verifique o console.');
    }
}

// Inicialização da aplicação ao carregar a página
window.onload = loadData;