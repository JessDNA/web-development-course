// Array para armazenar os dados dos IPs
let ipData = [];

// Elementos do DOM
const ipForm = document.getElementById('ipForm');
const ipInput = document.getElementById('ipInput');
const maskInput = document.getElementById('maskInput');
const versionInput = document.getElementById('versionInput');
const tableBody = document.getElementById('tableBody');
const emptyMessage = document.getElementById('emptyMessage');

// Event listener do formulário
ipForm.addEventListener('submit', handleAddIP);

/**
 * Manipula o envio do formulário para adicionar um novo IP
 * @param {Event} event - Evento do formulário
 */
function handleAddIP(event) {
    event.preventDefault();

    const ip = ipInput.value.trim();
    const mask = maskInput.value.trim();
    const version = versionInput.value;

    // Validações básicas
    if (!ip || !mask || !version) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (!isValidIP(ip)) {
        alert('Por favor, insira um IP válido');
        return;
    }

    if (!isValidMask(mask)) {
        alert('Por favor, insira uma máscara válida');
        return;
    }

    // Adicionar novo IP ao array
    ipData.push({
        id: Date.now(), // ID único baseado no timestamp
        ip: ip,
        mask: mask,
        version: version
    });

    // Limpar formulário e atualizar tabela
    ipForm.reset();
    versionInput.value = '';
    renderTable();
}

/**
 * Valida um endereço IP
 * @param {string} ip - Endereço IP a validar
 * @returns {boolean} - True se válido, false caso contrário
 */
function isValidIP(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

    if (ipv4Regex.test(ip)) {
        const parts = ip.split('.');
        return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
    }

    if (ipv6Regex.test(ip)) {
        return true;
    }

    return false;
}

/**
 * Valida uma máscara de rede
 * @param {string} mask - Máscara a validar
 * @returns {boolean} - True se válida, false caso contrário
 */
function isValidMask(mask) {
    // Aceita formato CIDR (ex: /24) ou dotted decimal (ex: 255.255.255.0)
    const cidrRegex = /^\/\d{1,2}$/;
    const dottedRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (cidrRegex.test(mask)) {
        const num = parseInt(mask.substring(1));
        return num >= 0 && num <= 128;
    }

    if (dottedRegex.test(mask)) {
        const parts = mask.split('.');
        return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
    }

    return false;
}

/**
 * Renderiza a tabela com os dados dos IPs
 */
function renderTable() {
    // Limpar tabela
    tableBody.innerHTML = '';

    // Se não houver dados, mostrar mensagem vazia
    if (ipData.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    // Criar linhas da tabela
    ipData.forEach((item) => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
}

/**
 * Cria uma linha da tabela para um IP
 * @param {Object} item - Objeto contendo ip, mask e version
 * @returns {HTMLTableRowElement} - Elemento tr da tabela
 */
function createTableRow(item) {
    const row = document.createElement('tr');
    row.dataset.id = item.id;

    // Célula IP
    const ipCell = document.createElement('td');
    ipCell.innerHTML = `<span class="cell-content">${escapeHtml(item.ip)}</span>`;
    ipCell.dataset.field = 'ip';
    ipCell.dataset.value = item.ip;
    ipCell.addEventListener('click', () => enableEditMode(row, 'ip'));

    // Célula Mask
    const maskCell = document.createElement('td');
    maskCell.innerHTML = `<span class="cell-content">${escapeHtml(item.mask)}</span>`;
    maskCell.dataset.field = 'mask';
    maskCell.dataset.value = item.mask;
    maskCell.addEventListener('click', () => enableEditMode(row, 'mask'));

    // Célula Version
    const versionCell = document.createElement('td');
    versionCell.innerHTML = `<span class="cell-content">${escapeHtml(item.version)}</span>`;
    versionCell.dataset.field = 'version';
    versionCell.dataset.value = item.version;
    versionCell.addEventListener('click', () => enableEditMode(row, 'version'));

    // Célula Ações
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('actions');
    actionsCell.innerHTML = `
        <button class="btn-icon btn-edit" data-id="${item.id}">Editar</button>
        <button class="btn-icon btn-delete" data-id="${item.id}">Deletar</button>
    `;

    // Event listeners para os botões
    actionsCell.querySelector('.btn-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        enableEditMode(row, 'ip');
    });

    actionsCell.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteIP(item.id);
    });

    row.appendChild(ipCell);
    row.appendChild(maskCell);
    row.appendChild(versionCell);
    row.appendChild(actionsCell);

    return row;
}

/**
 * Ativa o modo de edição para uma célula
 * @param {HTMLTableRowElement} row - Linha da tabela
 * @param {string} field - Campo a editar (ip, mask ou version)
 */
function enableEditMode(row, field) {
    const cell = row.querySelector(`td[data-field="${field}"]`);
    if (!cell) return;

    const currentValue = cell.dataset.value;
    const cellContent = cell.querySelector('.cell-content');

    // Criar elemento de edição apropriado
    let editElement;

    if (field === 'version') {
        editElement = document.createElement('select');
        editElement.classList.add('form-input');
        editElement.innerHTML = `
            <option value="IPv4">IPv4</option>
            <option value="IPv6">IPv6</option>
        `;
        editElement.value = currentValue;
    } else {
        editElement = document.createElement('input');
        editElement.type = 'text';
        editElement.value = currentValue;
        editElement.classList.add('form-input');
    }

    // Substituir conteúdo da célula
    cell.classList.add('cell-edit-mode');
    cellContent.replaceWith(editElement);

    // Foco no input
    editElement.focus();
    if (editElement.type === 'text') {
        editElement.select();
    }

    // Criar div de ações de edição
    const actionsCell = row.querySelector('.actions');
    const originalHTML = actionsCell.innerHTML;

    actionsCell.innerHTML = `
        <button class="btn-icon btn-save">Salvar</button>
        <button class="btn-icon btn-cancel">Cancelar</button>
    `;

    // Event listener para salvar
    actionsCell.querySelector('.btn-save').addEventListener('click', () => {
        saveEdit(row, field, editElement.value);
    });

    // Event listener para cancelar
    actionsCell.querySelector('.btn-cancel').addEventListener('click', () => {
        cancelEdit(row, field, currentValue, originalHTML);
    });

    // Permitir salvar com Enter
    editElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit(row, field, editElement.value);
        }
    });

    // Permitir cancelar com Escape
    editElement.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cancelEdit(row, field, currentValue, originalHTML);
        }
    });
}

/**
 * Salva a edição de uma célula
 * @param {HTMLTableRowElement} row - Linha da tabela
 * @param {string} field - Campo editado
 * @param {string} newValue - Novo valor
 */
function saveEdit(row, field, newValue) {
    newValue = newValue.trim();

    // Validar novo valor
    if (!newValue) {
        alert('O campo não pode estar vazio');
        return;
    }

    if (field === 'ip' && !isValidIP(newValue)) {
        alert('Por favor, insira um IP válido');
        return;
    }

    if (field === 'mask' && !isValidMask(newValue)) {
        alert('Por favor, insira uma máscara válida');
        return;
    }

    // Encontrar e atualizar o item no array
    const id = parseInt(row.dataset.id);
    const item = ipData.find(ip => ip.id === id);

    if (item) {
        item[field] = newValue;
        renderTable();
    }
}

/**
 * Cancela a edição de uma célula
 * @param {HTMLTableRowElement} row - Linha da tabela
 * @param {string} field - Campo sendo editado
 * @param {string} originalValue - Valor original
 * @param {string} originalHTML - HTML original da célula de ações
 */
function cancelEdit(row, field, originalValue, originalHTML) {
    const cell = row.querySelector(`td[data-field="${field}"]`);
    const actionsCell = row.querySelector('.actions');

    // Restaurar conteúdo original
    cell.classList.remove('cell-edit-mode');
    cell.innerHTML = `<span class="cell-content">${escapeHtml(originalValue)}</span>`;
    actionsCell.innerHTML = originalHTML;

    // Re-adicionar event listeners
    const id = parseInt(row.dataset.id);
    actionsCell.querySelector('.btn-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        enableEditMode(row, field);
    });

    actionsCell.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteIP(id);
    });
}

/**
 * Deleta um IP da tabela
 * @param {number} id - ID do IP a deletar
 */
function deleteIP(id) {
    if (confirm('Tem certeza que deseja deletar este IP?')) {
        ipData = ipData.filter(item => item.id !== id);
        renderTable();
    }
}

/**
 * Escapa caracteres especiais HTML para evitar XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Renderizar tabela vazia ao carregar a página
renderTable();
