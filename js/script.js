const API_KEY = "172660a59f4f4dd9b9c214451261206";
const BASE_URL = "http://api.weatherapi.com/v1/current.json"

const botaoBusca = document.getElementById('btnPesquisar');
const campoBusca = document.getElementById('cidade');

const cidade = document.querySelector('#nomeCidade');
const temperatura = document.querySelector('#temperatura');
const sensacao = document.querySelector('#sensacao');
const umidade = document.querySelector('#umidade');
const vento = document.querySelector('#vento');
const data = document.querySelector('#dataConsulta')
const totalConsultas = document.querySelector('#totalConsultas')
const mediaTempe = document.querySelector('#mediaTemp')
const historicoElemento = document.querySelector('#historico')
const cidadeQuentee = document.querySelector('#cidadeQuente')

const historicos = JSON.parse(window.sessionStorage.getItem("historico")) ?? [];
inicializar();

function dispararBusca() {
    const cidade = campoBusca.value.trim();
    if (!cidade) {
        alert("Digite uma cidade;")
        return;
    }
    buscarClima(cidade);
}

async function buscarClima(Cidade) {
    try {
        const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(Cidade)}&lang=pt`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error('Cidade nao encontrada.');
        }

        const dados = await resposta.json();
        console.log(dados);
        preencher(dados);

        const consulta = {
            cidade: dados.location.name,
            temperatura: dados.current.temp_c,
            umidade: dados.current.humidity,
            dataConsulta: new Date()
        };
        save(consulta);
        



    } catch (erro) {
        console.error(erro);
    }



}

botaoBusca.addEventListener('click', dispararBusca);
campoBusca.addEventListener('keydown', (evento)=>{
    if(evento.key=='Enter'){dispararBusca()}
});

function preencher(dados) {
    temperatura.textContent = `${dados.current.temp_c.toFixed(1)}°C`;
    cidade.textContent = dados.location.name;
    sensacao.textContent = `${dados.current.feelslike_c}°C`;
    umidade.textContent = `${dados.current.humidity}%`;
    vento.textContent = `${dados.current.wind_kph}km/h`;
    data.textContent = new Date().toLocaleDateString("pt-BR");

    
    
}

function save(dados){
    historicos.push(dados);
    window.sessionStorage.setItem('historico', JSON.stringify(historicos));
    inicializar();
     
}


function inicializar(){
    if(!window.sessionStorage.getItem("historico")){
        window.sessionStorage.setItem("historico", '[]');
    }
    
    
    totalConsultas.textContent = historicos.length;

    const mediaTemp = (historicos.reduce((acc,atual)=> acc + atual.temperatura, 0))/(historicos.length==0?1:historicos.length);
    mediaTempe.textContent = `${mediaTemp.toFixed(1)}°C`;

    historicoElemento.innerHTML='';

    for(historico of historicos){
        historicoElemento.innerHTML += `<li>
        ${historico.temperatura}
        ${historico.cidade}
        ${historico.umidade}
        ${new Date(historico.dataConsulta).toLocaleDateString('pt-BR')}
        </li>`
    }

    cidadeQuentee.textContent=historicos.sort((a,b)=> b.temperatura-a.temperatura)[0]?.cidade;
    
}





