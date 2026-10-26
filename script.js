const form = document.getElementById('form-busca');
const campo = document.getElementById('campo-busca');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');

const imgPokemon = document.getElementById('img-pokemon');
const nomeEl = document.getElementById('nome');
const tiposEl = document.getElementById('tipos');
const alturaEl = document.getElementById('altura');
const pesoEl = document.getElementById('peso');
const statsEl = document.getElementById('stats');

const TIPOS = {
  normal:   { nome: 'Normal',   cor: 'secondary' },
  fire:     { nome: 'Fogo',     cor: 'danger' },
  water:    { nome: 'Água',     cor: 'primary' },
  electric: { nome: 'Elétrico', cor: 'warning text-dark' },
  grass:    { nome: 'Planta',   cor: 'success' },
  ice:      { nome: 'Gelo',     cor: 'info text-dark' },
  fighting: { nome: 'Lutador',  cor: 'danger' },
  poison:   { nome: 'Veneno',   cor: 'dark' },
  ground:   { nome: 'Terra',    cor: 'warning text-dark' },
  flying:   { nome: 'Voador',   cor: 'info text-dark' },
  psychic:  { nome: 'Psíquico', cor: 'danger' },
  bug:      { nome: 'Inseto',   cor: 'success' },
  rock:     { nome: 'Pedra',    cor: 'secondary' },
  ghost:    { nome: 'Fantasma', cor: 'dark' },
  dragon:   { nome: 'Dragão',   cor: 'primary' },
  dark:     { nome: 'Sombrio',  cor: 'dark' },
  steel:    { nome: 'Aço',      cor: 'secondary' },
  fairy:    { nome: 'Fada',     cor: 'danger' }
};

const STATS = [
  { api: 'hp',      rotulo: 'HP',      cor: 'bg-success' },
  { api: 'attack',  rotulo: 'Ataque',  cor: 'bg-danger' },
  { api: 'defense', rotulo: 'Defesa',  cor: 'bg-info' },
  { api: 'speed',   rotulo: 'Velocid.', cor: 'bg-warning' }
];

const MAX_STAT = 255;

function mostrarMensagem(texto, tipo = 'danger') {
  mensagem.className = `alert alert-${tipo}`;
  mensagem.textContent = texto;
}

function esconderMensagem() {
  mensagem.className = 'alert d-none';
}

function mostrarPokemon(p) {
  imgPokemon.src = p.sprites.front_default;
  imgPokemon.alt = p.name;

  nomeEl.textContent = `${p.name} #${String(p.id).padStart(3, '0')}`;

  tiposEl.innerHTML = p.types.map(t => {
    const info = TIPOS[t.type.name] || { nome: t.type.name, cor: 'secondary' };
    return `<span class="badge text-bg-${info.cor} ms-1">${info.nome}</span>`;
  }).join('');

  alturaEl.textContent = `${(p.height / 10).toFixed(1)} m`;
  pesoEl.textContent = `${(p.weight / 10).toFixed(1)} kg`;

  statsEl.innerHTML = STATS.map(s => {
    const valor = p.stats.find(x => x.stat.name === s.api).base_stat;
    const pct = Math.min(100, (valor / MAX_STAT) * 100);
    return `
      <div class="d-flex align-items-center mb-2">
        <span class="stat-label">${s.rotulo}</span>
        <div class="progress flex-grow-1" role="progressbar"
             aria-valuenow="${valor}" aria-valuemin="0" aria-valuemax="${MAX_STAT}">
          <div class="progress-bar progress-bar-striped ${s.cor}" style="width: ${pct}%"></div>
        </div>
        <span class="stat-valor">${valor}</span>
      </div>`;
  }).join('');

  resultado.classList.remove('d-none');
}

async function buscar(termo) {
  const busca = termo.trim().toLowerCase();
  if (!busca) {
    mostrarMensagem('Digite o nome ou o número de um Pokémon.', 'warning');
    return;
  }

  mostrarMensagem('Buscando...', 'info');

  try {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(busca)}`);
    if (!resp.ok) throw new Error('não encontrado');
    const dados = await resp.json();
    esconderMensagem();
    mostrarPokemon(dados);
  } catch (erro) {
    resultado.classList.add('d-none');
    mostrarMensagem('Pokémon não encontrado. Confira o nome (em inglês) ou o número.');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  buscar(campo.value);
});

buscar('pikachu');