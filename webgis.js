// WebGIS - Sistema de Informação Geográfica com Leaflet
class WebGIS {
    constructor() {
        this.map = null;
        this.basemaps = {};
        this.currentBasemap = null;
        this.geojsonLayers = [];
        this.attributesData = {};
        this.init();
    }

    init() {
        this.initializeMap();
        this.setupBasemaps();
        this.setupEventListeners();
        this.loadGeoJSONFiles();
        this.updateMapInfo();
    }

    initializeMap() {
        // Inicializar o mapa centrado no bairro Cidade Industrial em Contagem-MG
        this.map = L.map('map', {
            center: [-19.9456, -44.0456], // Cidade Industrial, Contagem-MG
            zoom: 14,
            zoomControl: true,
            attributionControl: true
        });

        // Adicionar controle de escala
        L.control.scale().addTo(this.map);
    }

    setupBasemaps() {
        // 1. OpenStreetMap (padrão)
        this.basemaps.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        });

        // 2. Google Maps Satellite (usando XYZ tiles)
        this.basemaps.satellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            attribution: '© Google Maps',
            maxZoom: 20
        });

        // 3. OpenTopoMap
        this.basemaps.topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17
        });

        // Adicionar o mapa base padrão (Google Maps Satellite)
        this.currentBasemap = this.basemaps.satellite;
        this.currentBasemap.addTo(this.map);
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Listener para mudança de mapa base
        document.getElementById('basemap-select').addEventListener('change', (e) => {
            this.changeBasemap(e.target.value);
        });

        // Listener para toggle do GeoJSON
        document.getElementById('geojson-toggle').addEventListener('click', () => {
            this.toggleGlobalControl('geojson-toggle');
        });

        // Listener para toggle dos atributos
        document.getElementById('attributes-toggle').addEventListener('click', () => {
            this.toggleGlobalControl('attributes-toggle');
        });

        // Listeners do mapa
        this.map.on('moveend', () => this.updateMapInfo());
        this.map.on('zoomend', () => this.updateMapInfo());
        this.map.on('click', (e) => this.onMapClick(e));

        // Close sidebar when clicking outside (removido - menu sempre visível por padrão)
    }

    changeBasemap(basemapType) {
        // Remover mapa base atual
        if (this.currentBasemap) {
            this.map.removeLayer(this.currentBasemap);
        }

        // Adicionar novo mapa base
        this.currentBasemap = this.basemaps[basemapType];
        this.currentBasemap.addTo(this.map);
    }

    updateMapInfo() {
        const center = this.map.getCenter();
        const zoom = this.map.getZoom();
        
        document.getElementById('lat').textContent = center.lat.toFixed(6);
        document.getElementById('lng').textContent = center.lng.toFixed(6);
        document.getElementById('zoom').textContent = zoom;

        // Fuso UTM dinâmico
        const utmZoneDiv = document.getElementById('utm-zone');
        if (zoom >= 10) {
            // Cálculo do fuso UTM
            const longitude = center.lng;
            let zone = Math.floor((longitude + 180) / 6) + 1;
            // Letra da zona (aproximação hemisfério sul)
            const lat = center.lat;
            let letter = '';
            if (lat >= -80 && lat < -72) letter = 'C';
            else if (lat < -64) letter = 'D';
            else if (lat < -56) letter = 'E';
            else if (lat < -48) letter = 'F';
            else if (lat < -40) letter = 'G';
            else if (lat < -32) letter = 'H';
            else if (lat < -24) letter = 'J';
            else if (lat < -16) letter = 'K';
            else if (lat < -8) letter = 'L';
            else if (lat < 0) letter = 'M';
            else if (lat < 8) letter = 'N';
            else if (lat < 16) letter = 'P';
            else if (lat < 24) letter = 'Q';
            else if (lat < 32) letter = 'R';
            else if (lat < 40) letter = 'S';
            else if (lat < 48) letter = 'T';
            else if (lat < 56) letter = 'U';
            else if (lat < 64) letter = 'V';
            else if (lat < 72) letter = 'W';
            else if (lat < 84) letter = 'X';
            utmZoneDiv.textContent = zone + letter;
            utmZoneDiv.parentElement.style.display = '';
        } else {
            utmZoneDiv.parentElement.style.display = 'none';
        }
    }

    onMapClick(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        
        // Criar popup com coordenadas
        const popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`
                <div style="text-align: center;">
                    <strong>Coordenadas</strong><br>
                    Latitude: ${lat}<br>
                    Longitude: ${lng}
                </div>
            `)
            .openOn(this.map);
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebar-toggle');
        const toggleIcon = document.getElementById('toggle-icon');
        
        sidebar.classList.toggle('closed');
        toggle.classList.toggle('closed');
        
        if (sidebar.classList.contains('closed')) {
            toggleIcon.textContent = '☰';
        } else {
            toggleIcon.textContent = '✕';
        }
    }

    toggleGlobalControl(controlId) {
        const control = document.getElementById(controlId);
        const toggle = control.querySelector('.toggle-switch');
        const checkbox = control.querySelector('input[type="checkbox"]');
        
        toggle.classList.toggle('active');
        checkbox.checked = toggle.classList.contains('active');
        
        if (controlId === 'geojson-toggle') {
            this.toggleGeoJSON(checkbox.checked);
        } else if (controlId === 'attributes-toggle') {
            this.toggleAttributesPanel(checkbox.checked);
        }
    }

    toggleAttributesPanel(show = null) {
        const panel = document.getElementById('attributes-panel');
        const control = document.getElementById('attributes-toggle');
        const toggle = control.querySelector('.toggle-switch');
        
        if (show === null) {
            show = panel.style.display === 'none' || panel.style.display === '';
        }
        
        if (show) {
            panel.style.display = 'block';
            toggle.classList.add('active');
        } else {
            panel.style.display = 'none';
            toggle.classList.remove('active');
        }
    }

    showAttributesTable(layerName, features, customInfo = null) {
        const panel = document.getElementById('attributes-panel');
        const content = document.getElementById('attributes-content');
        
        if (!features || features.length === 0) {
            content.innerHTML = '<p>Nenhum dado encontrado para esta camada</p>';
            this.toggleAttributesPanel(true);
            return;
        }

        // Obter todas as propriedades únicas
        const allProperties = new Set();
        features.forEach(feature => {
            if (feature.properties) {
                Object.keys(feature.properties).forEach(key => allProperties.add(key));
            }
        });

        const properties = Array.from(allProperties).sort();

        // Criar conteúdo HTML
        let html = '';
        
        if (customInfo) {
            html += customInfo;
        } else {
            html += `<h4>${layerName} - ${features.length} feições</h4>`;
        }

        // Adicionar controles de tabela
        html += `
            <div style="margin: 15px 0; display: flex; gap: 10px; align-items: center;">
                <button onclick="window.webgis.exportToCSV('${layerName}')" 
                        style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                    📥 Exportar CSV
                </button>
                <span style="font-size: 12px; color: #666;">
                    Mostrando ${Math.min(features.length, 50)} de ${features.length} feições
                </span>
            </div>
        `;

        // Criar tabela HTML (limitada a 50 linhas para performance)
        const featuresToShow = features.slice(0, 50);
        
        html += `
            <table class="attributes-table">
                <thead>
                    <tr>
                        <th>#</th>
                        ${properties.map(prop => `<th>${prop}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        featuresToShow.forEach((feature, index) => {
            html += '<tr>';
            html += `<td>${index + 1}</td>`;
            
            properties.forEach(prop => {
                const value = feature.properties && feature.properties[prop];
                html += `<td>${value !== null && value !== undefined ? value : '-'}</td>`;
            });
            
            html += '</tr>';
        });

        html += '</tbody></table>';
        
        if (features.length > 50) {
            html += `<p style="margin-top: 10px; font-size: 12px; color: #666;">
                Para ver todas as ${features.length} feições, use o console: getAttributes("${layerName}")
            </p>`;
        }
        
        content.innerHTML = html;
        
        // Mostrar o painel
        this.toggleAttributesPanel(true);
    }

    exportToCSV(layerName) {
        const features = this.attributesData[layerName];
        if (!features || features.length === 0) return;
        
        const properties = Object.keys(features[0].properties || {});
        let csv = properties.join(',') + '\n';
        
        features.forEach(feature => {
            const row = properties.map(prop => {
                const value = feature.properties && feature.properties[prop];
                return value !== null && value !== undefined ? `"${value}"` : '';
            }).join(',');
            csv += row + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${layerName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async loadGeoJSONFiles() {
        const geojsonFiles = [
            'GEOJSON/dm_rhim_2025.geojson',
            'GEOJSON/propriedades_RHIM_mg_merge.geojson',
            'GEOJSON/reservalegal_RHIM_mg_merge.geojson'
        ];

        const colors = ['#ffffff', '#ffff00', '#00ff00']; // Branco, Amarelo, Verde
        const names = ['DM RHIM 2025', 'Propriedades RHIM MG', 'Reserva Legal RHIM MG'];

        for (let i = 0; i < geojsonFiles.length; i++) {
            try {
                const response = await fetch(geojsonFiles[i]);
                if (response.ok) {
                    const geojsonData = await response.json();
                    this.addGeoJSONLayer(geojsonData, names[i], colors[i]);
                    
                    // Armazenar dados para visualização de atributos
                    this.attributesData[names[i]] = geojsonData.features || [];
                } else {
                    console.warn(`Não foi possível carregar: ${geojsonFiles[i]}`);
                }
            } catch (error) {
                console.warn(`Erro ao carregar ${geojsonFiles[i]}:`, error);
            }
        }
    }

    addGeoJSONLayer(geojsonData, name, color) {
        const layer = L.geoJSON(geojsonData, {
            style: {
                fillColor: color,
                weight: 2,
                opacity: 1,
                color: color,
                fillOpacity: 0.3
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    const popupContent = this.createPopupContent(feature.properties, name);
                    layer.bindPopup(popupContent);
                }
            }
        });

        this.geojsonLayers.push({
            layer: layer,
            name: name,
            visible: true
        });

        layer.addTo(this.map);
        
        // Adicionar controle de camada
        this.addLayerControl(layer, name);
    }

    createPopupContent(properties, layerName) {
        let content = `<div style="max-width: 300px;"><h4>${layerName}</h4><table style="width: 100%;">`;
        
        for (const [key, value] of Object.entries(properties)) {
            if (value !== null && value !== undefined) {
                content += `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`;
            }
        }
        
        content += '</table></div>';
        return content;
    }

    addLayerControl(layer, name) {
        const layersContainer = document.getElementById('layers-container');
        
        // Remove loading message if exists
        const loading = layersContainer.querySelector('.loading');
        if (loading) {
            loading.remove();
        }

        const layerItem = document.createElement('div');
        layerItem.className = 'layer-item';
        layerItem.innerHTML = `
            <div class="layer-info">
                <input type="checkbox" class="layer-checkbox" checked data-layer="${name}">
                <span class="layer-name">${name}</span>
            </div>
            <div class="layer-actions">
                <button class="layer-btn attributes" title="Ver atributos de ${name}">
                    📊
                </button>
                <button class="layer-btn info" title="Informações de ${name}">
                    ℹ️
                </button>
            </div>
        `;

        const checkbox = layerItem.querySelector('.layer-checkbox');
        const attributesBtn = layerItem.querySelector('.layer-btn.attributes');
        const infoBtn = layerItem.querySelector('.layer-btn.info');

        // Layer visibility toggle
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                layer.addTo(this.map);
            } else {
                this.map.removeLayer(layer);
            }
        });

        // Attributes button
        attributesBtn.addEventListener('click', () => {
            this.showAttributesTable(name, this.attributesData[name] || []);
        });

        // Info button
        infoBtn.addEventListener('click', () => {
            this.showLayerInfo(name, this.attributesData[name] || []);
        });

        layersContainer.appendChild(layerItem);
    }

    showLayerInfo(layerName, features) {
        const featureCount = features.length;
        const properties = features.length > 0 ? Object.keys(features[0].properties || {}) : [];
        
        const info = `
            <h4>${layerName}</h4>
            <p><strong>Feições:</strong> ${featureCount}</p>
            <p><strong>Propriedades:</strong> ${properties.length}</p>
            <p><strong>Campos:</strong> ${properties.join(', ')}</p>
        `;
        
        this.showAttributesTable(layerName, features, info);
    }

    toggleGeoJSON(show) {
        this.geojsonLayers.forEach(({ layer, visible }) => {
            if (visible) {
                if (show) {
                    layer.addTo(this.map);
                } else {
                    this.map.removeLayer(layer);
                }
            }
        });
    }

    // Método para adicionar marcador
    addMarker(lat, lng, title = 'Marcador') {
        const marker = L.marker([lat, lng])
            .addTo(this.map)
            .bindPopup(title);
        return marker;
    }

    // Método para adicionar círculo
    addCircle(lat, lng, radius = 1000, color = 'red') {
        const circle = L.circle([lat, lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.3,
            radius: radius
        }).addTo(this.map);
        return circle;
    }

    // Método para adicionar polígono
    addPolygon(coordinates, color = 'blue') {
        const polygon = L.polygon(coordinates, {
            color: color,
            fillColor: color,
            fillOpacity: 0.3
        }).addTo(this.map);
        return polygon;
    }
}

// Inicializar o WebGIS quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.webgis = new WebGIS();
    
    // Adicionar alguns exemplos de geometrias
    setTimeout(() => {
        // Exemplo de marcador em Brasília
        window.webgis.addMarker(-15.7801, -47.9292, 'Brasília - Capital Federal');
        
        // Exemplo de círculo em São Paulo
        window.webgis.addCircle(-23.5505, -46.6333, 5000, 'green');
        
        // Exemplo de polígono (triângulo) no Rio de Janeiro
        const rioCoords = [
            [-22.9068, -43.1729],
            [-22.9168, -43.1629],
            [-22.8968, -43.1629]
        ];
        window.webgis.addPolygon(rioCoords, 'orange');
    }, 2000);

    // Controle de zoom compacto
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    
    zoomInBtn.addEventListener('click', () => {
        window.webgis.map.zoomIn();
    });
    zoomOutBtn.addEventListener('click', () => {
        window.webgis.map.zoomOut();
    });
});

// Funções globais para uso no console
window.addMarker = (lat, lng, title) => window.webgis.addMarker(lat, lng, title);
window.addCircle = (lat, lng, radius, color) => window.webgis.addCircle(lat, lng, radius, color);
window.addPolygon = (coords, color) => window.webgis.addPolygon(coords, color);

// Funções para visualização de atributos
window.showAttributes = (layerName) => {
    if (window.webgis && window.webgis.attributesData[layerName]) {
        window.webgis.showAttributesTable(layerName, window.webgis.attributesData[layerName]);
    } else {
        console.log('Camada não encontrada. Camadas disponíveis:', Object.keys(window.webgis.attributesData));
    }
};

window.getAttributes = (layerName) => {
    if (window.webgis && window.webgis.attributesData[layerName]) {
        return window.webgis.attributesData[layerName];
    } else {
        console.log('Camada não encontrada. Camadas disponíveis:', Object.keys(window.webgis.attributesData));
        return null;
    }
};

window.listLayers = () => {
    if (window.webgis) {
        console.log('Camadas disponíveis:', Object.keys(window.webgis.attributesData));
        return Object.keys(window.webgis.attributesData);
    }
    return [];
};

// Função para exportar dados
window.exportToCSV = (layerName) => {
    if (window.webgis) {
        window.webgis.exportToCSV(layerName);
    }
}; 