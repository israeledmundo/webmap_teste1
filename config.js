// Configurações do WebGIS
const WebGISConfig = {
    // Configurações iniciais do mapa
    map: {
        center: [-19.9456, -44.0456], // Cidade Industrial, Contagem-MG
        zoom: 14,
        minZoom: 3,
        maxZoom: 20
    },

    // Configurações dos mapas de fundo
    basemaps: {
        osm: {
            name: "OpenStreetMap",
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19
        },
        satellite: {
            name: "Google Maps Satellite",
            url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            attribution: "© Google Maps",
            maxZoom: 20
        },
        topo: {
            name: "OpenTopoMap",
            url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            attribution: "© OpenTopoMap contributors",
            maxZoom: 17
        }
    },

    // Configurações dos arquivos GeoJSON
    geojsonFiles: [
        {
            path: "GEOJSON/dm_rhim_2025.geojson",
            name: "DM RHIM 2025",
            color: "#ffffff", // Branco
            visible: true
        },
        {
            path: "GEOJSON/propriedades_RHIM_mg_merge.geojson",
            name: "Propriedades RHIM MG",
            color: "#ffff00", // Amarelo
            visible: true
        },
        {
            path: "GEOJSON/reservalegal_RHIM_mg_merge.geojson",
            name: "Reserva Legal RHIM MG",
            color: "#00ff00", // Verde
            visible: true
        }
    ],

    // Estilos padrão para camadas GeoJSON
    geojsonStyle: {
        weight: 2,
        opacity: 1,
        fillOpacity: 0.3
    },

    // Configurações da interface
    ui: {
        title: "WebGIS",
        subtitle: "Sistema de Informação Geográfica Interativo",
        showCoordinates: true,
        showZoomLevel: true,
        showLayerControls: true
    },

    // Configurações de popup
    popup: {
        maxWidth: 300,
        className: "custom-popup"
    },

    // Configurações de exemplo
    examples: {
        markers: [
            {
                lat: -15.7801,
                lng: -47.9292,
                title: "Brasília - Capital Federal"
            }
        ],
        circles: [
            {
                lat: -23.5505,
                lng: -46.6333,
                radius: 5000,
                color: "green",
                title: "São Paulo"
            }
        ],
        polygons: [
            {
                coordinates: [
                    [-22.9068, -43.1729],
                    [-22.9168, -43.1629],
                    [-22.8968, -43.1629]
                ],
                color: "orange",
                title: "Rio de Janeiro"
            }
        ]
    }
};

// Exportar configurações para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebGISConfig;
} else {
    window.WebGISConfig = WebGISConfig;
} 