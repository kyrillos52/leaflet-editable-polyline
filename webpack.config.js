const path = require('path');

module.exports = {
  entry: './src/leaflet-editable-polyline.js',
  output: {
    filename: 'leaflet-editable-polyline.js',
    path: path.resolve(__dirname, 'dist')
  }
};