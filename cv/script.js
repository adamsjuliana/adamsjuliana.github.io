let trilho = document.getElementById('trilho');
let body = document.querySelector('body');
let icone = document.getElementById('icone');
let button = document.getElementById('button');
let lbox = document.getElementById('m-certificados');
let exp = document.getElementById('m-experiencia');

// Troca entre tema claro e escuro
trilho.addEventListener('click', () => {
    trilho.classList.toggle('dark');
    body.classList.toggle('dark');
    button.classList.toggle('dark');
    lbox.classList.toggle('dark');
    exp.classList.toggle('dark');

    if (body.classList.contains('dark')) {
        icone.classList.remove('bi-brightness-high-fill');
        icone.classList.add('bi-moon-fill');
    } else {
        icone.classList.remove('bi-moon-fill');
        icone.classList.add('bi-brightness-high-fill');
    }
});

// Função para alternar a visibilidade das seções e mudar o estilo do botão
function toggleSections(skillId) {
    const allSections = document.querySelectorAll('.about');
    const selectedSection = document.getElementById(skillId);
    const button = document.getElementById("btn-" + skillId);

    // Esconde todas as seções
    allSections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Exibe apenas a seção selecionada
    selectedSection.style.display = 'block';

    // Remove a classe "selecionado" de todos os botões
    const allButtons = document.querySelectorAll('.b-skills');
    allButtons.forEach(function(btn) {
        btn.classList.remove('selected');
    });

    // Adiciona a classe "selecionado" ao botão do skill escolhido
    button.classList.add('selected');
}

// Função para mostrar todas as seções e destacar todos os botões
function showAllSections() {
    const allSections = document.querySelectorAll('.about');
    const allButtons = document.querySelectorAll('.b-skills');

    // Exibe todas as seções
    allSections.forEach(section => section.style.display = 'block');
    
    // Marca todos os botões como "selecionados"
    allButtons.forEach(button => button.classList.add('selected'));
}


// Ativar showAllSections ao imprimir
window.onbeforeprint = function() {
    showAllSections();
};