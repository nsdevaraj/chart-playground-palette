# ECharts Map Data

This directory contains GeoJSON map data files used for geographic visualizations in ECharts.

## Available Maps

| Country | File | Size | Features |
|---------|------|------|----------|
| World | `world.json` | 987 KB | Countries |
| United States | `USA.json` | 87 KB | States |
| China | `China.json` | 5.0 MB | Provinces |
| India | `India.json` | 3.0 MB | States |
| Brazil | `Brazil.json` | 3.3 MB | States |
| Canada | `Canada.json` | 7.6 MB | Provinces |
| Australia | `Australia.json` | 1.7 MB | States/Territories |
| Germany | `Germany.json` | 1.3 MB | States |
| Japan | `Japan.json` | 1.4 MB | Prefectures |

## Usage in ECharts

```javascript
// Register and use a map
fetch('/libs/echarts/data/USA.json')
  .then(response => response.json())
  .then(mapData => {
    echarts.registerMap('USA', mapData);
    
    const option = {
      series: [{
        type: 'map',
        map: 'USA',
        data: [
          { name: 'California', value: 100 },
          { name: 'Texas', value: 200 }
        ]
      }]
    };
    
    myChart.setOption(option);
  });
```

## Data Sources

- **US States**: PublicaMundi/MappingAPI
- **Other Countries**: markmarkoh/datamaps (converted from TopoJSON)

## Updating Maps

To download and convert new maps:

```bash
# Download maps
npm run download-maps

# Convert TopoJSON to GeoJSON (if needed)
npm run convert-maps
```

## File Format

All files are in GeoJSON format, which is compatible with ECharts map series. Each file contains:
- Feature collection with geographic boundaries
- Properties for region names and identifiers
- Coordinates in longitude/latitude

## Notes

- Files are served from the public directory
- Maps are loaded on-demand via fetch API
- Coordinate system: WGS84 (EPSG:4326)
- Simplified geometries for better performance
