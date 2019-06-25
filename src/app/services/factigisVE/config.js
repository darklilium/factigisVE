/*
Compilated(transpilated): 25.06.2019
factigisVE  : v1.9p
Author: Evelyn Hernandez
*/

/*
NOTA: Do not forget to change the parameters.js file -> getURLParameters function.
*/
//bUILD LOCAL DESA


const env = {
  ROOT: "dist/css/",
  CSSDIRECTORY: 'dist/css/',
  ROUTEPATH: '/',
  ENVIRONMENT: 'DEVELOPMENT',
  WEBSERVERADDRESS: "",
  SAVEAPPLICATIONMODULE: "FACTIGIS_DESA",
  SAVEAPPLICATIONNAME: 'REACT_AP_WEB_DESA',
  ROOT2: "https://ventasbeta.chilquinta.cl/factigisVE/",
  WPHP: "https://ventasbeta.chilquinta.cl/online/getParametros.php",
  BUILDFOR: 'INTERNA',
  SSL: 'http://'
}




//BUILD EXTERNA DESA
/*
const env = {
  ROOT: "dist/css/",
  CSSDIRECTORY: 'dist/css/',
  ROUTEPATH: '/factigisVE',
  ENVIRONMENT: 'DEVELOPMENT',
  WEBSERVERADDRESS: "http://gisred.chilquinta.cl:6443/factigisVE/",
  SAVEAPPLICATIONMODULE: "FACTIGIS_DESA",
  SAVEAPPLICATIONNAME: 'REACT_AP_WEB_DESA',
  BUILDFOR: 'EXTERNA',
  ROOT2: "http://ventasbeta.chilquinta.cl/factigisVE/",
  WPHP: "http://ventasbeta.chilquinta.cl/online/getParametros.php",
  SSL: 'http://'
}
*/

//BUILD EXTERNA DESA PARA SERVIDOR DESA GISRED
/*
const env = {
  ROOT: "css/",
  CSSDIRECTORY: 'css/',
  ROUTEPATH: '/pruebasfactigis/factigisve',
  ENVIRONMENT: 'DEVELOPMENT',
  WEBSERVERADDRESS: "http://gisred.chilquinta.cl:6443/factigisVE/",
  SAVEAPPLICATIONMODULE: "FACTIGIS_DESA",
  SAVEAPPLICATIONNAME: 'REACT_AP_WEB_DESA',
  BUILDFOR: 'EXTERNA',
  ROOT2: "http://ventasbeta.chilquinta.cl/factigisVE/",
  WPHP: "http://ventasbeta.chilquinta.cl/online/getParametros.php",
  SSL: 'http://'
}
*/

//BUILD EXTERNA PROD PARA VENTA SERVICIOS
/*
var env = {
	  ROOT: "css/",
	  CSSDIRECTORY: 'css/',
	  ROUTEPATH: '/factigisVE',
	  ENVIRONMENT: 'PRODUCTION',
	  WEBSERVERADDRESS: "https://gisred.chilquinta.cl:6443/factigisVE/",
	  SAVEAPPLICATIONMODULE: "FACTIGIS_PROD",
	  SAVEAPPLICATIONNAME: 'REACT_FACTIGISVE_PROD',
	  BUILDFOR: 'EXTERNA',
	  ROOT2: "https://ventaservicios.chilquinta.cl/factigisVE/",
	  WPHP: "https://ventaservicios.chilquinta.cl/online/getParametros.php",
    SSL: 'https://'
	};
*/



//BUILD EXTERNA PROD PARA VENTA SERVICIOS
/*
const env = {
  ROOT: "css/",
  CSSDIRECTORY: 'css/',
  ROUTEPATH: '/FactigisVE',
  ENVIRONMENT: 'PRODUCTION', //debido a la url externa que se requiere para cerrar la ventana.
  WEBSERVERADDRESS: "https://gisred.chilquinta.cl:6443/factigisVE/",
  SAVEAPPLICATIONMODULE: "FACTIGIS_DESA",
  SAVEAPPLICATIONNAME: 'REACT_FACTIGISVE_DESA',
  BUILDFOR: 'EXTERNA',
  ROOT2: "http://ventaservicios.pruebas/factigisve/",
  WPHP: "http://ventaservicios.pruebas/online/getParametros.php",
  SSL: 'https://'
}
*/

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
  BUILDFOR: 'INTERNA',
  SSL: 'http://'
}
*/

//bUILD INTERNA DESA
/*
const env = {
  ROOT: "css/",
  CSSDIRECTORY: 'css/',
  ROUTEPATH: 'pruebasfactigis/factigisVE',
  ENVIRONMENT: 'DEVELOPMENT',
  WEBSERVERADDRESS: "http://gisred.chilquinta/pruebasfactigis/factigisVE/",
  SAVEAPPLICATIONMODULE: "FACTIGIS_DESA",
  SAVEAPPLICATIONNAME: 'REACT_FACTIGISVE_DESA',
  BUILDFOR: 'INTERNA',
  SSL: 'http://'
}
*/

export default env;
