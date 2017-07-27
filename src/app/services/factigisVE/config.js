//bUILD LOCAL DESA

/*
const env = {
  ROOT: "dist/css/",
  CSSDIRECTORY: 'dist/css/',
  ROUTEPATH: '/',
  ENVIRONMENT: 'DEVELOPMENT',
  WEBSERVERADDRESS: "",
  SAVEAPPLICATIONMODULE: "FACTIGIS_DESA",
  SAVEAPPLICATIONNAME: 'REACT_AP_WEB_DESA'
}
*/


/*
Compilate: 27.07.2017
factigisVE  : v0.6.6
Author: Evelyn Hernandez
*/

//bUILD EXTERNA PROD

const env = {
  ROOT: "css/",
  CSSDIRECTORY: 'css/',
  ROUTEPATH: '/factigisVE',
  ENVIRONMENT: 'PRODUCTION',
  WEBSERVERADDRESS: "http://gisred.chilquinta.cl:5555/factigisVE/",
  SAVEAPPLICATIONMODULE: "FACTIGIS_PROD",
  SAVEAPPLICATIONNAME: 'REACT_FACTIGISVE_PROD',
  BUILDFOR: 'EXTERNA',
  ROOT2: "http://ventaservicios.chilquinta.cl/factigisVE/",
  WPHP: "http://ventaservicios.chilquinta.cl/online/getParametros.php"
}

//bUILD INTERNA PROD
/*
const env = {
  ROOT: "css/",
  CSSDIRECTORY: 'css/',
  ROUTEPATH: 'pruebasfactigis/factigisVE',
  ENVIRONMENT: 'PRODUCTION',
  WEBSERVERADDRESS: "http://gisred.chilquinta/pruebasfactigis/factigisVE/",
  SAVEAPPLICATIONMODULE: "FACTIGIS_PROD",
  SAVEAPPLICATIONNAME: 'REACT_FACTIGISVE_PROD',
  BUILDFOR: 'INTERNA'
}
*/

export default env;
