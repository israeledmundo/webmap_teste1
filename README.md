# WebGIS - Sistema de Informação Geográfica

Um sistema de informação geográfica web interativo desenvolvido com Leaflet, oferecendo múltiplos mapas de fundo e funcionalidades avançadas de visualização de dados geoespaciais.

## 🗺️ Características

### Mapas de Fundo Disponíveis
1. **OpenStreetMap** - Mapa base padrão com informações detalhadas
2. **Google Maps Satellite** - Imagens de satélite de alta resolução
3. **OpenTopoMap** - Mapa topográfico com curvas de nível

### Funcionalidades
- ✅ **Menu lateral moderno** com design responsivo
- ✅ Troca dinâmica entre mapas de fundo
- ✅ Carregamento automático de arquivos GeoJSON
- ✅ Controles de camadas individuais com ações
- ✅ Informações de coordenadas em tempo real
- ✅ Popups informativos nos cliques
- ✅ Visualização completa de atributos dos dados
- ✅ Tabelas de atributos interativas com exportação CSV
- ✅ Interface escalável para múltiplas camadas
- ✅ Adição de marcadores, círculos e polígonos
- ✅ Design moderno com gradientes e animações

## 🚀 Como Usar

### Instalação e Execução

1. **Clone ou baixe os arquivos do projeto**
2. **Abra o arquivo `index.html` em um servidor web**
   - Para desenvolvimento local, você pode usar:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (se tiver instalado)
     npx http-server
     
     # PHP (se tiver instalado)
     php -S localhost:8000
     ```

3. **Acesse no navegador: `http://localhost:8000`**

### Configuração do Google Maps (Opcional)

Para usar o Google Maps Satellite com funcionalidade completa:

1. Obtenha uma chave de API do Google Maps:
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto e ative a Maps JavaScript API
   - Gere uma chave de API

2. Substitua `YOUR_GOOGLE_API_KEY` no arquivo `index.html` pela sua chave:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_AQUI&libraries=geometry"></script>
   ```

**Nota:** O sistema funciona sem a chave do Google, mas com funcionalidades limitadas.

## 📁 Estrutura do Projeto

```
Cursor_IA/
├── index.html          # Interface principal do WebGIS
├── webgis.js          # Lógica JavaScript do sistema
├── README.md          # Este arquivo
└── GEOJSON/           # Arquivos de dados geoespaciais
    ├── dm_rhim_2025.geojson
    ├── propriedades_RHIM_mg_merge.geojson
    └── reservalegal_RHIM_mg_merge.geojson
```

## 🎯 Funcionalidades Avançadas

### Controles de Interface
- **Menu Lateral**: Acesse todas as funcionalidades através do botão ☰
- **Seletor de Mapa Base**: Troque entre os 3 mapas disponíveis
- **Informações do Mapa**: Visualize coordenadas e nível de zoom em tempo real
- **Controles Globais**: Toggles modernos para funcionalidades gerais
- **Lista de Camadas**: Controle individual de cada camada com ações:
  - 📊 Ver atributos completos
  - ℹ️ Informações da camada
  - ✅ Ativar/desativar visibilidade
- **Painel de Atributos**: Visualize dados em formato tabular com exportação CSV

### Interação com o Mapa
- **Clique**: Exibe popup com coordenadas do ponto clicado
- **Zoom**: Use scroll do mouse ou controles de zoom
- **Pan**: Arraste para navegar pelo mapa

### API JavaScript

O sistema expõe funções globais para uso no console do navegador:

```javascript
// Adicionar marcador
addMarker(latitude, longitude, título);

// Adicionar círculo
addCircle(latitude, longitude, raio, cor);

// Adicionar polígono
addPolygon([[lat1, lng1], [lat2, lng2], ...], cor);

// Visualizar atributos de uma camada
showAttributes("DM RHIM 2025");

// Obter dados de atributos
getAttributes("Propriedades RHIM MG");

// Listar todas as camadas disponíveis
listLayers();

// Exportar dados para CSV
exportToCSV("DM RHIM 2025");
```

### Exemplos de Uso

```javascript
// Adicionar marcador em São Paulo
addMarker(-23.5505, -46.6333, "São Paulo");

// Adicionar círculo verde de 5km em Brasília
addCircle(-15.7801, -47.9292, 5000, "green");

// Adicionar polígono triangular no Rio
addPolygon([
    [-22.9068, -43.1729],
    [-22.9168, -43.1629],
    [-22.8968, -43.1629]
], "orange");

// Visualizar atributos dos dados de mineração
showAttributes("DM RHIM 2025");

// Obter dados de propriedades rurais
const propriedades = getAttributes("Propriedades RHIM MG");

// Listar todas as camadas disponíveis
listLayers();
```

## 📊 Dados GeoJSON

O sistema carrega automaticamente os seguintes arquivos GeoJSON:

1. **DM RHIM 2025** - Dados de delimitação de microbacias (cor: branco)
2. **Propriedades RHIM MG** - Propriedades rurais em Minas Gerais (cor: amarelo)
3. **Reserva Legal RHIM MG** - Áreas de reserva legal (cor: verde)

Cada camada possui:
- Estilo visual diferenciado por cor
- Popups informativos com propriedades dos dados
- Controle individual de visibilidade
- Tabela completa de atributos acessível via botão 📊
- Visualização de todas as propriedades dos dados

**Localização Inicial:** O mapa inicia centralizado no bairro Cidade Industrial em Contagem-MG com zoom nível 14.

**Mapa Base Padrão:** Google Maps Satellite (imagens de satélite).

**Interface:** Menu lateral sempre visível, recolhe apenas quando o botão é pressionado.

## 🛠️ Tecnologias Utilizadas

- **Leaflet 1.9.4** - Biblioteca JavaScript para mapas interativos
- **OpenStreetMap** - Dados de mapa base
- **Google Maps** - Imagens de satélite
- **OpenTopoMap** - Dados topográficos
- **HTML5/CSS3** - Interface responsiva
- **JavaScript ES6+** - Lógica da aplicação

## 🔧 Personalização

### Adicionar Novos Mapas de Fundo

No arquivo `webgis.js`, adicione novos mapas na função `setupBasemaps()`:

```javascript
this.basemaps.novoMapa = L.tileLayer('URL_DO_TILE_SERVER/{z}/{x}/{y}.png', {
    attribution: '© Fonte dos dados',
    maxZoom: 18
});
```

### Modificar Estilos das Camadas

Altere as cores e estilos das camadas GeoJSON na função `addGeoJSONLayer()`:

```javascript
style: {
    fillColor: '#sua_cor',
    weight: 2,
    opacity: 1,
    color: '#sua_cor',
    fillOpacity: 0.3
}
```

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móveis

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente suas melhorias
4. Teste todas as funcionalidades
5. Envie um pull request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique se está executando em um servidor web (não apenas abrindo o arquivo HTML)
2. Confirme se os arquivos GeoJSON estão na pasta correta
3. Verifique o console do navegador para mensagens de erro
4. Certifique-se de que tem conexão com a internet para carregar os mapas base

---

**Desenvolvido com ❤️ para análise geoespacial** 