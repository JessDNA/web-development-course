// Configuração da API
const API_BASE_URL = 'https://ipinfo.io';

// Elementos do DOM
const ipInput = document.getElementById('ipInput');
const searchBtn = document.getElementById('searchBtn');
const tableBody = document.getElementById('tableBody');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
ipInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

/**
 * Valida se o IP está em um formato válido
 * @param {string} ip - Endereço IP a validar
 * @returns {boolean} - True se válido, false caso contrário
 */
function validateIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
        return false;
    }

    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

/**
 * Busca informações do IP na API ipinfo.io
 * @param {string} ip - Endereço IP para consultar
 * @returns {Promise<Object>} - Dados do IP ou null se erro
 */
async function fetchIPInfo(ip) {
    try {
        const url = `${API_BASE_URL}/${ip}/json`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 429) {
                alert('Limite de requisições atingido. Tente novamente mais tarde.');
            } else if (response.status === 400) {
                alert('IP inválido ou não encontrado.');
            } else if (response.status === 403) {
                alert('Acesso negado. Verifique se o IP é válido ou se o limite de requisições foi atingido.');
            } else {
                alert(`Erro na API: ${response.status}`);
            }
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar informações do IP:', error);
        alert('Erro ao conectar à API. Verifique sua conexão e tente novamente.');
        return null;
    }
}

/**
 * Manipula o evento de pesquisa
 */
async function handleSearch() {
    const ip = ipInput.value.trim();

    // Validação
    if (!ip) {
        alert('Por favor, insira um endereço IP.');
        ipInput.focus();
        return;
    }

    if (!validateIP(ip)) {
        alert('Por favor, insira um IP válido (ex: 1.1.1.1).');
        ipInput.focus();
        return;
    }

    // Desabilita botão durante a requisição
    searchBtn.disabled = true;
    searchBtn.textContent = 'Carregando...';

    // Busca informações
    const ipData = await fetchIPInfo(ip);

    // Reabilita botão
    searchBtn.disabled = false;
    searchBtn.textContent = 'Pesquisar';

    if (!ipData) {
        return;
    }

    // Adiciona linha à tabela
    addRowToTable(ipData);

    // Limpa o input
    ipInput.value = '';
    ipInput.focus();
}

/**
 * Adiciona uma nova linha à tabela
 * @param {Object} ipData - Dados do IP retornados pela API
 */
function addRowToTable(ipData) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${ipData.ip}</td>
        <td>${ipData.org || 'N/A'}</td>
        <td>${ipData.country || 'N/A'}</td>
        <td>${ipData.city || 'N/A'}</td>
        <td>
            <button class="clear-btn" aria-label="Remover linha" title="Remover">×</button>
        </td>
    `;

    // Adiciona event listener ao botão de remover
    const clearBtn = row.querySelector('.clear-btn');
    clearBtn.addEventListener('click', () => {
        row.remove();
    });

    tableBody.appendChild(row);
}

// Foco inicial no input
ipInput.focus();