# Exemplos de Uso - Visualização de Atributos

Este arquivo demonstra como usar as funcionalidades de visualização de atributos do WebGIS.

## 🎯 Como Acessar os Atributos

### 1. Via Interface Gráfica

#### Botão de Atributos na Interface
- Cada camada GeoJSON possui um botão verde 📊 ao lado do checkbox
- Clique no botão para abrir a tabela de atributos daquela camada específica

#### Botão Geral de Atributos
- No canto inferior esquerdo há um botão "📊 Atributos"
- Clique para abrir/fechar o painel de atributos

#### Checkbox "Mostrar Atributos"
- No painel de controles, marque a caixa "Mostrar Atributos"
- O painel de atributos será exibido automaticamente

### 2. Via Console do Navegador

Abra o console do navegador (F12) e use os comandos:

```javascript
// Listar todas as camadas disponíveis
listLayers();

// Visualizar atributos de uma camada específica
showAttributes("DM RHIM 2025");
showAttributes("Propriedades RHIM MG");
showAttributes("Reserva Legal RHIM MG");

// Obter dados brutos de uma camada
const dados = getAttributes("DM RHIM 2025");
console.log(dados);
```

## 📊 Estrutura dos Atributos

### DM RHIM 2025 (Dados de Mineração)
Atributos principais:
- **Name**: Número do processo
- **NUP**: Número Único do Processo
- **Area (ha)**: Área em hectares
- **Tipo de Requerimento**: Tipo de autorização solicitada
- **Shape_Leng**: Comprimento da geometria
- **Shape_Area**: Área da geometria

### Propriedades RHIM MG
Atributos das propriedades rurais em Minas Gerais.

### Reserva Legal RHIM MG
Atributos das áreas de reserva legal.

## 🔍 Exemplos Práticos

### Exemplo 1: Análise de Processos de Mineração
```javascript
// Obter todos os dados de mineração
const mineracao = getAttributes("DM RHIM 2025");

// Filtrar processos com área maior que 100 hectares
const grandesAreas = mineracao.filter(feature => 
    feature.properties["Area (ha)"] > 100
);

// Contar tipos de requerimento
const tipos = {};
mineracao.forEach(feature => {
    const tipo = feature.properties["Tipo de Requerimento"];
    tipos[tipo] = (tipos[tipo] || 0) + 1;
});

console.log("Tipos de requerimento:", tipos);
```

### Exemplo 2: Estatísticas de Áreas
```javascript
// Calcular estatísticas de área
const areas = mineracao.map(f => f.properties["Area (ha)"]);
const media = areas.reduce((a, b) => a + b, 0) / areas.length;
const max = Math.max(...areas);
const min = Math.min(...areas);

console.log(`Área média: ${media.toFixed(2)} ha`);
console.log(`Maior área: ${max} ha`);
console.log(`Menor área: ${min} ha`);
```

### Exemplo 3: Busca por Processo Específico
```javascript
// Buscar processo específico
const processo = mineracao.find(f => 
    f.properties.Name === "100/1966"
);

if (processo) {
    console.log("Processo encontrado:", processo.properties);
} else {
    console.log("Processo não encontrado");
}
```

## 📋 Comandos Úteis

### Listar Propriedades de uma Camada
```javascript
const dados = getAttributes("DM RHIM 2025");
const propriedades = new Set();
dados.forEach(feature => {
    Object.keys(feature.properties).forEach(key => propriedades.add(key));
});
console.log("Propriedades disponíveis:", Array.from(propriedades));
```

### Contar Feições por Camada
```javascript
const camadas = listLayers();
camadas.forEach(camada => {
    const dados = getAttributes(camada);
    console.log(`${camada}: ${dados.length} feições`);
});
```

### Exportar Dados para CSV
```javascript
function exportToCSV(layerName) {
    const dados = getAttributes(layerName);
    if (!dados || dados.length === 0) return;
    
    const properties = Object.keys(dados[0].properties);
    let csv = properties.join(',') + '\n';
    
    dados.forEach(feature => {
        const row = properties.map(prop => 
            feature.properties[prop] || ''
        ).join(',');
        csv += row + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${layerName}.csv`;
    a.click();
}

// Usar: exportToCSV("DM RHIM 2025");
```

## 🎨 Personalização da Visualização

### Modificar Estilo da Tabela
Você pode personalizar o CSS da tabela de atributos editando o arquivo `index.html`:

```css
.attributes-table {
    /* Suas personalizações aqui */
    font-size: 11px;
    background: #f8f9fa;
}

.attributes-table th {
    background: #007bff;
    color: white;
}
```

### Adicionar Funcionalidades
Para adicionar novas funcionalidades, edite o arquivo `webgis.js` e adicione métodos à classe WebGIS.

## 🚀 Dicas de Uso

1. **Performance**: Para grandes datasets, considere filtrar os dados antes de visualizar
2. **Navegação**: Use Ctrl+F no painel de atributos para buscar valores específicos
3. **Exportação**: Use os comandos de console para exportar dados para análise externa
4. **Análise**: Combine os dados do mapa com as tabelas de atributos para análises completas

## 📞 Suporte

Para dúvidas sobre o uso das funcionalidades de atributos:
1. Verifique se os arquivos GeoJSON foram carregados corretamente
2. Use `listLayers()` para confirmar as camadas disponíveis
3. Verifique o console do navegador para mensagens de erro
4. Consulte a documentação principal no README.md 