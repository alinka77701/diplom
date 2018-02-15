const Controller = require ('./Controller.js');
require ('../assets/css/style.css');
require('../assets/css/metro.css');
require('../assets/css/metro-colors.css');
require('../assets/css/metro-icons.css');
require('../assets/css/metro-schemes.css');
require('../assets/css/metro-responsive.css');
require('../DataTables/datatables.min.css');

document.addEventListener('DOMContentLoaded', () => {
  new Controller();
});