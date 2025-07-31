// Dados das receitas (exemplo com imagens e links)
const recipes = [
  {
   id: 1,
   title: "Torta de Frango Fit",
   ingredientes: ["frango desfiado", "molho de tomate", "creme de leite sem lactose", "ervilha", "milho", "batata", "ovos", "farinha de aveia", "amido de milho", "leite", "manteiga sem sal", "fermento em pó"],
   tempo: 25,
   facilidade: "fácil",
   tipo: "salgada",
   imagem: "https://blog.gsuplementos.com.br/wp-content/uploads/2022/10/torta-de-frango-fit.jpg",
   link: "https://www.tudogostoso.com.br/receita/191993-torta-de-frango-fit.html"
 },
  {
   id: 2,
   title: "Strogonoff com Batata Doce",
   ingredientes: ["peito de frango", "batata doce", "cebola", "molho de tomate", "pimenta do reino", "azeite", "tomate", "iogurte natural", "alecrim"],
   tempo: 30,
   facilidade: "média",
   tipo: "salgada",
   imagem: "https://imagens.imirante.com.br/imagens/noticias/2022/03/09/1646835857-37644671.jpg?w=896&h=448&crop=1516%2C884%2C142%2C196&fit=crop&fm=webp&s=0a0ab643602537088201e3f1e9ab4f93",
   link: "https://www.tudogostoso.com.br/receita/301063-strogonoff-fit-com-batata-doce.html"
 },
  {
   id: 3,
   title: "Quiche de Legumes",
   ingredientes: ["farinha de trigo", "manteiga", "queijo parmesão", "legumes", "ovos", "creme de leite", "sal", "pimenta do reino"],
   tempo: 70,
   facilidade: "trabalhosa",
   tipo: "salgada",
   imagem: "https://www.bonde.com.br/api/images/proxy?quality=100&src=https://www.bonde.com.br/img/bondenews/2017/03/img_1_33_3373.jpg",
   link: "https://www.tudogostoso.com.br/receita/24584-quiche-de-legumes.html"
 },
 {
   id: 4,
   title: "Bolo de Banana e Aveia",
   ingredientes: ["aveia fina", "ovos", "bananas", "fermento", "óleo", "açúcar mascavo", "canela", "uva passa", "castanha de caju"],
   tempo: 60,
   facilidade: "fácil",
   tipo: "doce",
   imagem: "https://i0.wp.com/porkworld.com.br/wp-content/uploads/2025/01/bolo-de-aveia-e-banana.jpg?resize=324%2C160&ssl=1",
   link: "https://www.tudogostoso.com.br/receita/100781-bolo-de-banana-e-aveia.html"
 },
  {
   id: 5,
   title: "Brigadeiro Fitness",
   ingredientes: ["leite desnatado", "cacau em pó", "chocolate granulado", "adoçante", "manteiga"],
   tempo: 40,
   facilidade: "média",
   tipo: "doce",
   imagem: "https://s2.glbimg.com/6bnUZiJufySzAsa8Z1hDyz3wHkQ=/smart/e.glbimg.com/og/ed/f/original/2017/08/18/receita-brigadeiro-termogenico.jpg",
   link: "https://www.tudogostoso.com.br/receita/301486-brigadeiro-fitness-sem-leite-condensado.html"
 }
];


// Usuário simulado (sem backend)
const usuario = {
 nome: null,
 pontos: 0,
 receitasFeitas: new Set()
};


// Referências do DOM
const salgadasContainer = document.querySelector("#salgadas .recipes-list");
const docesContainer = document.querySelector("#doces .recipes-list");
const searchInput = document.getElementById("search");
const tempoSelect = document.getElementById("tempo");
const facilidadeSelect = document.getElementById("facilidade");
const loginBtn = document.getElementById("login-btn");
const pontosSpan = document.getElementById("user-points");
const userNameSpan = document.getElementById("user-name");
const userInfo = document.getElementById("user-info");


// Atualiza interface do usuário (login e pontos)
function atualizarInterfaceUsuario() {
 if (usuario.nome) {
   loginBtn.textContent = "Logout";
   userNameSpan.textContent = usuario.nome;
   pontosSpan.textContent = usuario.pontos;
   userInfo.classList.remove("hidden");  // mostrar info do usuário
 } else {
   loginBtn.textContent = "Entrar";
   userNameSpan.textContent = "";
   pontosSpan.textContent = "0";
   usuario.receitasFeitas.clear();
   usuario.pontos = 0;
   userInfo.classList.add("hidden");  // esconder info do usuário
 }
 mostrarReceitas();
}


// Função para login/logout simples
loginBtn.addEventListener("click", () => {
 if (usuario.nome) {
   // Logout
   usuario.nome = null;
 } else {
   // Login: pedir nome (simplificado)
   const nome = prompt("Digite seu nome para login:");
   if (nome && nome.trim().length > 0) {
     usuario.nome = nome.trim();
   }
 }
 atualizarInterfaceUsuario();
});


// Função para filtrar e mostrar receitas
function mostrarReceitas() {
  salgadasContainer.innerHTML = "";
  docesContainer.innerHTML = "";


  const busca = searchInput.value.trim().toLowerCase();
  const dificuldadeFiltro = facilidadeSelect.value;


  // Pega a opção selecionada do tempo e seus data-min e data-max
  const selectedOption = tempoSelect.options[tempoSelect.selectedIndex];
  const minTempo = selectedOption.getAttribute("data-min");
  const maxTempo = selectedOption.getAttribute("data-max");


  function receitaValida(r) {
    // Busca por nome ou ingredientes
    const nomeOuIngredienteInclui =
      r.title.toLowerCase().includes(busca) ||
      r.ingredientes.some(i => i.toLowerCase().includes(busca));


    if (busca && !nomeOuIngredienteInclui) return false;


    // Filtro tempo com data-min e data-max
    if (tempoSelect.selectedIndex !== 0) {
      if (minTempo && r.tempo < parseInt(minTempo)) return false;
      if (maxTempo && r.tempo > parseInt(maxTempo)) return false;
    }


    // Filtro facilidade
    if (dificuldadeFiltro && r.facilidade !== dificuldadeFiltro) return false;


    return true;
  }


  const receitasFiltradas = recipes.filter(receitaValida);


  receitasFiltradas.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card expandable";


    // Botão título expansível
    const button = document.createElement("button");
    button.className = "recipe-toggle";
    button.textContent = r.title;
    button.setAttribute("aria-expanded", "false");


    // Detalhes ocultos
    const details = document.createElement("div");
    details.className = "recipe-details";


    // Imagem com link para abrir maior em nova aba
    const img = document.createElement("img");
    img.src = r.imagem;
    img.alt = r.title;


    const imgLink = document.createElement("a");
    imgLink.href = r.imagem; // link direto da imagem
    imgLink.target = "_blank";
    imgLink.rel = "noopener noreferrer";
    imgLink.style.display = "block";
    imgLink.style.textAlign = "center";
    imgLink.appendChild(img);
    details.appendChild(imgLink);


    // Tempo e dificuldade
    const meta = document.createElement("p");
    meta.innerHTML = `<strong>Tempo:</strong> ${r.tempo} min<br><strong>Facilidade:</strong> ${r.facilidade}`;


    // Ingredientes
    const ing = document.createElement("p");
    ing.innerHTML = `<strong>Ingredientes:</strong> ${r.ingredientes.join(", ")}`;


    // Link externo para receita completa
    const link = document.createElement("a");
    link.href = r.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ver receita completa →";


    // Botão marcar como feita
    const btn = document.createElement("button");
    btn.className = "mark-made-btn";
    btn.textContent = usuario.receitasFeitas.has(r.id) ? "Feita ✓" : "Marcar como feita";
    btn.disabled = usuario.receitasFeitas.has(r.id) || !usuario.nome;
    btn.title = usuario.nome
      ? usuario.receitasFeitas.has(r.id)
        ? "Você já marcou essa receita como feita"
        : "Clique para marcar como feita e ganhar pontos"
      : "Faça login para marcar receitas";


    btn.addEventListener("click", () => {
      if (!usuario.receitasFeitas.has(r.id)) {
        usuario.receitasFeitas.add(r.id);
        usuario.pontos += 10;
        atualizarInterfaceUsuario();
        mostrarReceitas();
      }
    });


    // Toggle detalhes ao clicar no botão
    button.addEventListener("click", () => {
      const isOpen = details.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });


    details.appendChild(meta);
    details.appendChild(ing);
    details.appendChild(link);
    details.appendChild(btn);


    card.appendChild(button);
    card.appendChild(details);


    if (r.tipo === "salgada") {
      salgadasContainer.appendChild(card);
    } else {
      docesContainer.appendChild(card);
    }
  });
}


// Eventos para atualizar lista ao mudar filtros
searchInput.addEventListener("input", mostrarReceitas);
tempoSelect.addEventListener("change", mostrarReceitas);
facilidadeSelect.addEventListener("change", mostrarReceitas);


// Inicializa interface
atualizarInterfaceUsuario();
mostrarReceitas();
