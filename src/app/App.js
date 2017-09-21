
import React from 'react';
import {AppBar} from 'react-toolbox/lib/app_bar';
import {Navigation} from 'react-toolbox/lib/navigation';
import {Link} from 'react-toolbox/lib/link';
import {Logo} from './components/Logo.jsx';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox';
import mymap from './services/factigisVE/map-service';
import {factigisLoginVentaWeb, getUserPermission, getProfile, getFormatedDate} from './services/factigisVE/parameters';
import layers from './services/factigisVE/layers-service';
import env from './services/factigisVE/config';
import BasemapToggle from "esri/dijit/BasemapToggle";
import Search from 'esri/dijit/Search';
import cookieHandler from 'cookie-handler';
import ReactTabs from 'react-tabs';
import Tooltip from 'rc-tooltip';
import Input from 'react-toolbox/lib/input';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Select from 'react-select';
import {getPotenciaEmpalme} from './services/factigisVE/factigis_potenciaEmpalmes';
import $ from 'jquery';
import {getURLParameters} from './services/factigisVE/parameters';
import {tipoEdificacion, tipoCliente, tipoContribuyente, tipoEmpalme, tipoAereo, tipoSubterraneo, tipoMonoTri, tipoEmpalmeBTMT, tipoPotencia, tipoCantidadEmpalmes, tipoClasificacion}
        from './services/factigisVE/cbData-service';
import {factigis_findDireccion, factigis_findComuna, factigis_findRotulo, factigis_findCalle, factigis_findNewDireccion, factigis_findTramo, factigis_findSEP}
        from './services/factigisVE/factigis_find-service';
import makeSymbol from './utils/makeSymbol';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import {getZona} from './services/factigisVE/factigis_zonas';
import {factigis_validator} from './services/factigisVE/factigis_validator-service';
import {customerValidator, direccionValidator} from './services/factigisVE/factigis_customerValidator';
import {factigis_addNuevaFactibilidad, agregarEstadoHistoria, factigis_addNuevaFactibilidad_especial, factigis_addNuevaDireccion} from './services/factigisVE/factigis_add-service';


var gLayerDireccion = new GraphicsLayer();
var gLayerPoste = new GraphicsLayer();
var gLayerMedidor = new GraphicsLayer();
var gLayerUbicacionCasa = new GraphicsLayer();

var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var visibilityStyle = {
  selectPotencia: {
    visibility: 'hidden',
    display: 'none'
  },
  txtPotencia:{
      visibility: 'hidden',
      display: 'none'
  }
};

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 0,

      visibilityStyle : visibilityStyle,


      //datos 1 desde venta empalme - no limpiar
      rut: '',
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      tipoCliente: '',
      tipoContribuyente: '',
      //validadores por datos 1:
      factigisRutValidator: true,
      factigisNombreValidator: true,
      factigisApellidoValidator: true,
      factigisTelefonoValidator: true,
      factigisEmailValidator: true,
      factigisTipoClienteValidator: true,
      factigisTipoContribuyenteValidator: true,


      //datos 2 de factigis - limpiar
      direccion: '',
      iddireccion: '',
      rotulo: '',
      idnodo: '',
      tramo: '',
      ubicacionMedidor: '',
      propiedadPoste: '',
      //validadores para datos 2
      factigisDireccionValidator: false,
      factigisRotuloValidator: false,
      factigisTramoValidator: false,

      factigis_geoDireccionValidator: false,
      factigis_geoPosteValidator: false,
      factigis_geoUbicacionValidator: false,

      //datos 3
      factigisVE_opcionesBTME: '',
      empalmeBTMT: '',
      factigisVE_opcionesEmpalme: '',
      empalme: '',
      factigisVE_opcionesFase: '',
      fase: '',
      factigisVE_opcionesPotencia: '',
      potencia: '',
      potencia2: '',
      comuna: '',
      clasificacion: 'NUEVO',
      sed: '',
      alimentador: '',
      zona: '',

      //validadores datos 3
      factigisTipoBTMTValidator: false,
      factigisTipoEmpalmeValidator:false,
      factigisTipoFaseValidator: false,
      factigisPotenciaValidator: false,
      factigistxtPotenciaValidator: false,
      zonaConcesion: false,
      zonaCampamentos: false,
      zonaRestringida: false,
      zonaVialidad: false,
      zonaTransmision: false,

      tipoFactibilidad: 'FACTIBILIDAD DIRECTA',
      radioEmpalmeDefinitivo: true,
      radioEmpalmeProvisorio: false,
      factigisVE_geoCliente: '',
      factigisVE_geoPoste: '',
      factigisVE_geoDireccion: '',


      //datos de factigis ve
      btnDireccionDisabled: false,
      btnPosteDisabled: false,
      btnClienteDisabled: false,

      activeSnackbar: false,
      snackbarIcon: '',
      snackbarMessage: '',

      cbTensionDisabled: false,
      cantidadEmpalmes: '1',
      factigisCantidadEmpalmesValidator: true,

      factigisVE_opcionesEdificacion: '',
      crearDireccion_nombreCalle: '',
      crearDireccion_numeroCasa: '',
      crearDireccion_anexo1: '',
      crearDireccion_anexo2: '',
      factigisVE_opcionesEdificacion: '',
      crearDireccion_tipoEdificacion: '',
      crearDireccion_ubicacionDireccion: '',
      crearDireccion_calle_disabled: false,

      factigisVE_geoUbicacionCasa: '',
      crearDireccion_ubicacion_disabled: false
    }
  }

  componentDidMount(){
    factigisLoginVentaWeb('vialactea\\usrgis',"N3L4y5HZ",(cb)=>{
      //show everything.
      if(cb[0]){
        var mapp = mymap.createMap("factigis_map_div","topo",-71.2905 ,-33.1009,9);


        //Add layer for old addresses
        var layerDirecciones = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_direccionesDyn(),{id:"factigis_direcciones"});
        layerDirecciones.setImageFormat("png32");
        layerDirecciones.setVisibleLayers([0]);

        mapp.addLayer(layerDirecciones);

        // add layer for new ones
        var layerDireccionesNew = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_direccionesNuevasMobile(),{id:"factigis_direccionesNew", minScale: 15000});
        layerDireccionesNew.setImageFormat("png32");
        layerDireccionesNew.setVisibleLayers([2]);
        mapp.addLayer(layerDireccionesNew);

        // add layer for pipes
        var layerRotulos = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_rotulos(),{id:"factigis_rotulos"});
        layerRotulos.setImageFormat("png32");
        layerRotulos.setVisibleLayers([0]);
        var layerDefs = [];
        layerDefs[0] = "tipo_nodo ='ele!poste' or tipo_nodo='ele!camara'";
        layerRotulos.setLayerDefinitions(layerDefs);
        mapp.addLayer(layerRotulos,2);


        //add layer for net.
        var layerTramos = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_chqTramos(),{id:"factigis_tramos",
        "opacity" : 0.5});
        layerTramos.setImageFormat("png32");
        layerTramos.setVisibleLayers([0,1]);

        mapp.addLayer(layerTramos,3);

        var toggle = new BasemapToggle({
          map: mapp,
          basemap: "hybrid"
        }, "BasemapToggle");
        toggle.startup();

        var search = new Search({
          map: mapp
          }, "search");
        search.startup();

        const page = "REACT_FACTIGISVE_PROD";
        const module = "FACTIGISVE_CREAR_FACTIBILIDAD";
        const date = getFormatedDate();
        const user = cookieHandler.get('usrprfl')
        const myToken = cookieHandler.get('tkn');

        this.setState({
        showA: true,
        showB: true})

      }else{
          this.setState({snackbarMessage: "Hubo un problema al inicializar la aplicación. Contáctese con el administrador/desarrollador del sistema.", activeSnackbar: true, snackbarIcon: 'error' });
      }


    });
  }

  componentWillMount(){
    //get url parameters from ventaEmpalme

    var up = getURLParameters();
    this.setState({
      rut: up.factigisRut,
      nombre: up.factigisNombre,
      apellido: up.factigisApellido,
      telefono: up.factigisTelefono,
      email: up.factigisEmail,
      tipoCliente: up.factigis_selectedValueCliente,
      tipoContribuyente: up.factigis_selectedValueTipoContribuyente,

      factigisRutValidator: true,
      factigisNombreValidator: true,
      factigisApellidoValidator: true,
      factigisTelefonoValidator: true,
      factigisEmailValidator: true,
      factigisTipoClienteValidator: true,
      factigisTipoContribuyenteValidator: true,

      factigisVE_opcionesBTME: tipoEmpalmeBTMT,
      factigisVE_opcionesEmpalme: tipoEmpalme,
      factigisVE_opcionesFase: tipoMonoTri,
      factigisVE_opcionesPotencia: [],
      factigisVE_opcionesEdificacion: tipoEdificacion





    })
  }

  handleSelect(index, last){
     this.setState({
       selectedTab: index
     });

     switch (index) {
      case 1:
        this.onClickLimpiar();
      break;

      case 0:
        this.onLimpiarDireccion();
      break;

      default:

     }
  }

  handleChange = (name, value) => {

    if(name=="crearDireccion_nombreCalle"){
      if(value.length){
            $('.direccionesPaso2').css('display','block');
      }else{
          $('.direccionesPaso2').css('display','none');
      }
    }
   this.setState({...this.state, [name]: value.toUpperCase()});

  };

  onClickDireccion(e){
    console.log(this.state);
    var map = mymap.getMap();
    gLayerDireccion.clear();
    $(".factigisVE_progressBar").css('display','flex');
    $(".factigisVE_btnPaso1").css('color','red');
    dojo.disconnect(this.state.btnDireccion);
    if(this.state.activeSnackbar){
      this.setState({activeSnackbar: false});
    }
    var map_click_handle = dojo.connect(map, 'onClick', (g)=>{

      this.setState({btnDireccion: map_click_handle});

      factigis_findDireccion(g.mapPoint, (featureSetFeatures)=>{
          //if theres no results for old addresses, search in new ones.
          if(!featureSetFeatures.length){

            factigis_findNewDireccion(g.mapPoint, (featureSetFeatures)=>{
              if(!featureSetFeatures.length){
                console.log("not detected any in old or new adresses");
                  this.setState({btnDireccionDisabled: false});
                  dojo.disconnect(this.state.btnDireccion);
                  $(".factigisVE_progressBar").css('display','none');
                  $(".factigisVE_btnPaso1").css('color','black');
                  this.setState({snackbarMessage: "Dirección no detectada, active el botón nuevamente para seleccionarla.", activeSnackbar: true, snackbarIcon: 'home' });

              }else {
                  console.log("detected in new addresses");
                  let direccion = featureSetFeatures[0].attributes['CALLE'] + " " + featureSetFeatures[0].attributes['NUMERO'];
                  this.setState({
                    factigisVE_geoDireccion: featureSetFeatures[0].geometry,
                    direccion: direccion,
                    iddireccion: featureSetFeatures[0].attributes['OBJECTID'],
                    factigisDireccionValidator: true,
                    factigis_geoDireccionValidator: true
                  });
                  let pointSymbol = makeSymbol.makePointAddress();
                  gLayerDireccion.add(new esri.Graphic(featureSetFeatures[0].geometry,pointSymbol));
                  map.addLayer(gLayerDireccion);
                  $(".factigisVE_progressBar").css('display','none');

                  this.setState({btnDireccionDisabled: true});
                  dojo.disconnect(this.state.btnDireccion);
                  $('.paso2').css('display','block');
                  $(".factigisVE_btnPaso1").css('color','black');
                }
            });
          //else , change the values for states and display the old address found.
          }else{
            console.log("detected in old addresses");
            let direccion = featureSetFeatures[0].attributes['nombre_calle'] + " " + featureSetFeatures[0].attributes['numero'];
            this.setState({
              factigisVE_geoDireccion: featureSetFeatures[0].geometry,
              direccion: direccion,
              iddireccion: featureSetFeatures[0].attributes['id_direccion'],
              factigisDireccionValidator: true,
              factigis_geoDireccionValidator: true
            });
            let pointSymbol = makeSymbol.makePointAddress();
            gLayerDireccion.add(new esri.Graphic(featureSetFeatures[0].geometry,pointSymbol));
            map.addLayer(gLayerDireccion);

            this.setState({btnDireccionDisabled: true});
            dojo.disconnect(this.state.btnDireccion);
            $(".factigisVE_progressBar").css('display','none');
            $('.paso2').css('display','block');
            $(".factigisVE_btnPaso1").css('color','black');
          }
      });
    });
  }

  onClickPoste(e){
    console.log(this.state);
    var map = mymap.getMap();
    gLayerPoste.clear();
    $(".factigisVE_progressBar").css('display','flex');
    $(".factigisVE_btnPaso2").css('color','red');
    dojo.disconnect(this.state.btnPoste);

    if(this.state.activeSnackbar){
      this.setState({activeSnackbar: false});
    }

     var map_click_handle = dojo.connect(map, 'onClick', (g)=>{
       this.setState({btnPoste: map_click_handle});

       factigis_findRotulo(g.mapPoint, (featureSetFeatures)=>{

         if(!featureSetFeatures.length){

           console.log("not detected any pipe");
           this.setState({btnPosteDisabled: false, factigis_geoPosteValidator: false});
           dojo.disconnect(this.state.btnPoste);
           $(".factigisVE_progressBar").css('display','none');
           $(".factigisVE_btnPaso2").css('color','black');
           this.setState({snackbarMessage: "Poste o cámara no detectado, active el botón nuevamente para seleccionar uno de ellos.", activeSnackbar: true, snackbarIcon: 'format_size' });

         }else{
           // verificar si es camara o poste
           if(featureSetFeatures[0].attributes['tipo_nodo']=="ele!camara"){
             //es camara
             this.setState({factigisVE_opcionesEmpalme: tipoSubterraneo});
           }if(featureSetFeatures[0].attributes['tipo_nodo']=="ele!poste"){
             //es poste
             this.setState({factigisVE_opcionesEmpalme: tipoEmpalme});
           }
           //30/11
            this.setState({propiedadPoste: featureSetFeatures[0].attributes['propiedad']});
            console.log("propiedad poste:", featureSetFeatures[0].attributes['propiedad']);
           //verificar si el rotulo es particular/otro u empresa: si es empresa, la factibilidad es normal, si es particular/otro, es asistida.
           if((featureSetFeatures[0].attributes['propiedad']=="Particular") || (featureSetFeatures[0].attributes['propiedad']=="Empresa que no presta Servicio Distribucion") ){
             ////console.log("poste es ",featureSetFeatures[0].attributes['propiedad'], featureSetFeatures);
             this.setState({tipoFactibilidad: 'FACTIBILIDAD ASISTIDA'});
           }else{
             ////console.log("poste es empresa" ,featureSetFeatures[0].attributes['propiedad'], featureSetFeatures);
             this.setState({tipoFactibilidad: 'FACTIBILIDAD DIRECTA'});
           }

           let pointSymbol2 = makeSymbol.makePointPipe();

           gLayerPoste.add(new esri.Graphic(g.mapPoint,pointSymbol2));
           map.addLayer(gLayerPoste);


           //extrae datos de rotulo
           let rotulo = featureSetFeatures[0].attributes['rotulo'];
           var sed = featureSetFeatures[0].attributes['sed'];
           let alimentador = featureSetFeatures[0].attributes['alimentador'];

           this.setState({
             factigisVE_geoPoste: featureSetFeatures[0].geometry,
             rotulo: rotulo,
             factigisRotuloValidator: true,
             factigis_geoPosteValidator: true,
             sed: sed,
             alimentador: alimentador,
             idnodo: featureSetFeatures[0].attributes['id_nodo'],
             btnPosteDisabled: true
           });
             dojo.disconnect(this.state.btnPoste);
             $('.paso3').css('display','block');
             $(".factigisVE_btnPaso2").css('color','black');
             $(".factigisVE_progressBar").css('display','none');
         }
     });

   });


  }

  onClickMedidor(e){


    var mapp = mymap.getMap();
    gLayerMedidor.clear();
    $(".factigisVE_progressBar").css('display','flex');
    $(".factigisVE_btnPaso3").css('color','red');
    dojo.disconnect(this.state.btnCliente);

    if(this.state.activeSnackbar){
      this.setState({activeSnackbar: false});
    }

    var map_click_handler = dojo.connect(mapp, 'onClick', (g)=>{
     this.setState({btnCliente: map_click_handler});
     //saves geometry point for customer.
     this.setState({factigisVE_geoCliente: g.mapPoint, factigis_geoUbicacionValidator:true});

     factigis_findComuna(g.mapPoint, (cb)=>{
       if(!cb.length){
         console.log("comuna no encontrada");
         this.setState({btnClienteDisabled: false, factigis_geoUbicacionValidator: false});
         dojo.disconnect(this.state.btnCliente);
         $(".factigisVE_progressBar").css('display','none');
         $(".factigisVE_btnPaso3").css('color','black');
         this.setState({snackbarMessage: "Ubicación no válida, active el botón nuevamente para seleccionar la ubicación del medidor nuevamente.", activeSnackbar: true, snackbarIcon: 'location_on' });
         return;
       }
       let comunaa = cb[0].attributes.nombre;
       //getting zone due to user click on map.
       var zona = getZona(comunaa);
       //validar factibilidad.
       factigis_validator(g.mapPoint, (callbackMain)=>{
         this.setState({
           comuna: comunaa,
           zona: zona,
           zonaConcesion: callbackMain.zonaConcesion,
           zonaCampamentos: callbackMain.zonaCampamentos,
           zonaRestringida: callbackMain.zonaRestringida,
           zonaVialidad: callbackMain.zonaVialidad,
           zonaTransmision: callbackMain.zonaTransmision,
           ubicacionMedidor: 'MEDIDOR UBICADO'
         });
         dojo.disconnect(this.state.btnCliente);


         //draw customer location on the map.

        let pointSymbol = makeSymbol.makePointCustomer();
        let pointSymbolPipe = makeSymbol.makePointPipe();
        let pointSymbolAddress = makeSymbol.makePointAddress();

        var lineMedidorRotulo = new esri.geometry.Polyline(mapp.spatialReference);
        var lineMedidorDireccion = new esri.geometry.Polyline(mapp.spatialReference);

        gLayerMedidor.add(new esri.Graphic(g.mapPoint,pointSymbol));

        lineMedidorRotulo.addPath([this.state.factigisVE_geoCliente, this.state.factigisVE_geoPoste]);

        let lineSymbol = makeSymbol.makeTrackLine();

        gLayerMedidor.add(new esri.Graphic(lineMedidorRotulo,lineSymbol));
         //map.graphics.add(new esri.Graphic(lineMedidorRotulo,lineSymbol));
        lineMedidorDireccion.addPath([this.state.factigisVE_geoCliente, this.state.factigisVE_geoDireccion]);

        gLayerMedidor.add(new esri.Graphic(lineMedidorDireccion,lineSymbol));
        // map.graphics.add(new esri.Graphic(lineMedidorDireccion,lineSymbol));
        mapp.addLayer(gLayerMedidor);
         $('.paso4').css('display','block');
         $(".factigisVE_btnPaso3").css('color','black');
         $(".factigisVE_progressBar").css('display','none');
         this.setState({btnClienteDisabled: true});
       });
     });
   });

  }

  onClickAgregarCliente(){
    $(".factigisVE_progressBar").css('display','flex');

    //$("#iframeloadingAdd").show();
    let tipoProvisorioDefinitivo = 'DEFINITIVO';
    if(this.state.radioEmpalmeProvisorio){
      tipoProvisorioDefinitivo="PROVISORIO";
    }




    let txtValidators = {
      rut: this.state.factigisRutValidator,
      nombre: this.state.factigisNombreValidator,
      apellido: this.state.factigisApellidoValidator,
      telefono: this.state.factigisTelefonoValidator,
      email: this.state.factigisEmailValidator,
      tramo: this.state.factigisTramoValidator,
      cantidadEmpalmes: this.state.factigisCantidadEmpalmesValidator,
      direccion: this.state.factigisDireccionValidator,
      poste: this.state.factigisRotuloValidator,
      potencia: this.state.factigisPotenciaValidator,
      potencia2: this.state.factigistxtPotenciaValidator,
      //comboboxes
      tipoCliente: this.state.factigisTipoClienteValidator,
      tipoContribuyente: this.state.factigisTipoContribuyenteValidator,
      tipoEmpalme: this.state.factigisTipoEmpalmeValidator,
      tipoFase: this.state.factigisTipoFaseValidator,
      tipoBTMT: this.state.factigisTipoBTMTValidator,
      tipoProvisorioDefinitivo: tipoProvisorioDefinitivo,
      //geometries
      geoCliente: this.state.factigis_geoUbicacionValidator,
      geoRotulo: this.state.factigis_geoPosteValidator,
      geoDireccion: this.state.factigis_geoDireccionValidator

    };

    customerValidator(txtValidators,(callback, callback2)=>{
      //Si todos los campos estan llenos
      if(callback){

        let factArr = [];
        //datos a mostrar en modal para indicar que existen problemas de factibilidad en ciertas zonas.
        //v0.7 - 7-8-2017: agregar restriccion para campamentos
        if(this.state.zonaCampamentos==false){
          factArr.push("campamentos");
        }

        if(this.state.zonaConcesion==false){
          factArr.push("concesion");
        }

        if(this.state.zonaTransmision==false){
          factArr.push("transmision");
        }

        //Si no hay problemas de zonas, pasa a factibilidad NORMAL (directa), transitoriamente ya que esto puede cambiar dentro de la función de guardado.
        //FACTIBILIDAD NORMAL
        console.log("arreglo", factArr);
        if(!factArr.length){
          //primeros campos a definir para agregar (se agregan más luego en la otra función addNuevaFactibilidad)
          var myFact = {
            factigisRut: this.state.rut,
            factigisNombre: this.state.nombre,
            factigisApellido: this.state.apellido,
            factigisTelefono: this.state.telefono,
            factigisEmail: this.state.email,
            factigisTipoCliente: this.state.tipoCliente,
            factigisContribuyente: this.state.tipoContribuyente,
            factigisRotulo: this.state.rotulo,
            factigisTramo: this.state.tramo,
            factigisEmpalme: this.state.empalme,
            factigisFase: this.state.fase,
            factigisPotencia: this.state.potencia,
            factigisTiempoEmpalme: tipoProvisorioDefinitivo,
            factigisTipoEmpalme: this.state.empalmeBTMT,
            factigisCantidadEmpalmes: this.state.cantidadEmpalmes,
            factigisDireccion: this.state.direccion,
            factigisIDDireccion: this.state.iddireccion,
            factigisZonaConcesion: this.state.zonaConcesion,
            factigisZonaTransmision: this.state.zonaTransmision,
            factigisZonaRestringida: this.state.zonaRestringida,
            factigisZonaVialidad: this.state.zonaVialidad,
            factigisZonaCampamentos: this.state.zonaCampamentos,
            factigisGeoCliente: this.state.factigisVE_geoCliente,
            factigisGeoPoste: this.state.factigisVE_geoPoste,
            factigisGeoDireccion: this.state.factigisVE_geoDireccion,
            factigisSed: this.state.sed,
            factigisTipoFactibilidad: this.state.tipoFactibilidad,
            factigisAlimentador: this.state.alimentador,
            factigisIDNodo: this.state.idnodo,
            factigisComuna: this.state.comuna,
            factigisZona: this.state.zona,
            factigisClasificacion: this.state.clasificacion,
            factigisPropiedadPoste: this.state.propiedadPoste
            }
            //se pasan los primeros campos para agregar
            /*  this.setState({
              open: true,
              problemsforAdding: 'Procesando factibilidad, espere un momento'
            });
            */
            this.setState({snackbarMessage: "Procesando factibilidad.... espere un momento", activeSnackbar: true, snackbarIcon: 'alarm' });

            console.log(myFact,"agregar");

            factigis_addNuevaFactibilidad(myFact, (cb)=>{

              //si fue grabado se abre modal indicando el tipo de factibilidad y el objectid con el que fue grabado.
              if(cb[0]){
                this.setState({snackbarMessage: "La factibilidad N° " + cb[1] + ' ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'], activeSnackbar: true, snackbarIcon: 'done' });
                /* this.setState({
                  open: true,
                  problemsforAdding: 'La factibilidad  ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'] ,
                  numeroFactibilidad: 'N°' + cb[1],
                  btnModalCloseStatus: false
                });
                */
                   $(".factigisVE_progressBar").css('display','none');
                //GENERAR CARTA: guardar en cookie los parametros con que fue generada la factibilidad para crear la carta.
                /*let usrprfl = cookieHandler.get('usrprfl');
                cookieHandler.set('myLetter',[this.state.factigisDireccion + ", " + this.state.factCartaComuna ,
                      this.state.factigisNombre + " " + this.state.factigisApellido,
                      usrprfl.NOMBRE_COMPLETO,
                      cb[1],
                      usrprfl.CARGO,
                      usrprfl.LUGAR_DE_TRABAJO,
                      usrprfl.DEPARTAMENTO,
                      usrprfl.COMUNA]);
                    //this.render(); //renderizar el componente
                    window.open("factigisCarta.html");
                  */

                  if(env.ENVIRONMENT=='PRODUCTION'){
                    console.log(cb, "devolviendo esto para venta empalme");
                    console.log("----------");
                    console.log("id:",cb[1], "tipo fact:", cb[2]['Tipo_factibilidad'], "rotulo:",cb[2]['Rotulo'], "y más...");
                    console.log("----------");

                    var boFactibilidad=0;

                    if(cb[2]['Tipo_factibilidad']=="FACTIBILIDAD DIRECTA"){
                      boFactibilidad = 1;
                    }else{
                      boFactibilidad = 2;
                    }

                    let web = env.WPHP;
                    window.location= web + '?id_factibilidad='+
                          cb[1] +
                          '&bo_factibilidad=' +
                          boFactibilidad +
                          '&num_poste='+
                          cb[2]['Rotulo'] +
                          '&direccion=' +
                          cb[2]['Direccion'] +
                          '&comuna=' +
                          cb[2]['Comuna'] +
                          '&empalme=' +
                          cb[2]['Empalme']+
                          '&fase=' +
                          cb[2]['Fase']+
                          '&tiempoEmpalme=' +
                          cb[2]['Tiempo_empalme']+
                          '&potencia=' +
                          cb[2]['Potencia'] +
                          '&tipoEmpalme=' +
                          cb[2]['Tipo_empalme'];

                      window.close();
                  }


              //si no fue grabado mostrar que hubo problemas en modal
              }else{
                /*this.setState({
                  open: true,
                  problemsforAdding: 'Hubo un problema al agregar la factibilidad',  numeroFactibilidad: '',
                  btnModalCloseStatus: false
                });
                */
                  this.setState({snackbarMessage: 'Hubo un problema al agregar la factibilidad', activeSnackbar: true, snackbarIcon: 'error' });
                 $(".factigisVE_progressBar").css('display','none');
              }

            });


        //FACTIBILIDAD ASISTIDA: cuando hay problemas con las zonas
        }else{
          let fArr = [];

          if(this.state.direccion.length>=75){
            console.log("problemas de dirección en largo.", this.state.direccion.length);
            this.setState({
              activeSnackbar: true,
              snackbarMessage: 'La dirección para la factibilidad excede el largo (75) permitido. No se puede agregar.',  numeroFactibilidad: '',
              snackbarIcon: 'error'
            });
            $(".factigisVE_progressBar").css('display','none');
            return;
          }

          var myFact = {
            factigisRut: this.state.rut,
            factigisNombre: this.state.nombre,
            factigisApellido: this.state.apellido,
            factigisTelefono: this.state.telefono,
            factigisEmail: this.state.email,
            factigisTipoCliente: this.state.tipoCliente,
            factigisContribuyente: this.state.tipoContribuyente,
            factigisRotulo: this.state.rotulo,
            factigisTramo: this.state.tramo,
            factigisEmpalme: this.state.empalme,
            factigisFase: this.state.fase,
            factigisPotencia: this.state.potencia,
            factigisTiempoEmpalme: tipoProvisorioDefinitivo,
            factigisTipoEmpalme: this.state.empalmeBTMT,
            factigisCantidadEmpalmes: this.state.cantidadEmpalmes,
            factigisDireccion: this.state.direccion,
            factigisIDDireccion: this.state.iddireccion,
            factigisZonaConcesion: this.state.zonaConcesion,
            factigisZonaTransmision: this.state.zonaTransmision,
            factigisZonaRestringida: this.state.zonaRestringida,
            factigisZonaVialidad: this.state.zonaVialidad,
            factigisZonaCampamentos: this.state.zonaCampamentos,
            factigisGeoCliente: this.state.factigisVE_geoCliente,
            factigisGeoPoste: this.state.factigisVE_geoPoste,
            factigisGeoDireccion: this.state.factigisVE_geoDireccion,
            factigisSed: this.state.sed,
            factigisTipoFactibilidad: 'FACTIBILIDAD ASISTIDA',
            factigisAlimentador: this.state.alimentador,
            factigisIDNodo: this.state.idnodo,
            factigisComuna: this.state.comuna,
            factigisZona: this.state.zona,
            factigisClasificacion: this.state.clasificacion,
            factigisPropiedadPoste: this.state.propiedadPoste
          }
          //Si dentro del array de zonas hay problemas
          //Si está fuera de la zona concesión
          if($.inArray("concesion",factArr)>-1){

            //Si esta dentro de la zona de transmisión
              if($.inArray("transmision",factArr)>-1){

                //no agregar
                console.log("No agregar porque está dentro de zona transmisión y fuera de concesión");
                this.setState({snackbarMessage: "Estimado cliente, su solicitud no puede ser ingresada porque se encuentra fuera de nuestra zona de concesión. Contáctese con un ejecutivo en nuestras oficinas comerciales", activeSnackbar: true, snackbarIcon: 'error' });
                 $(".factigisVE_progressBar").css('display','none');
                /*this.setState({
                  open: true,
                  problemsforAdding: 'No se puede agregar porque está dentro de zona transmisión y fuera de concesión',
                  btnModalCloseStatus: false
                });
                $("#iframeloadingAdd").hide();
                */
                return;
            //Si está fuera de la zona de transmisión
              }else{
                //agregar fact especial = asistida
                //console.log("agregar como fact asistida debido a q está fuera de zona de concesión y fuera de transmision");
                /*this.setState({
                  open: true,
                  problemsforAdding: 'agregar como fact asistida debido a q está fuera de zona de concesión y fuera de transmision',
                  btnModalCloseStatus: false
                });
                */
                this.setState({snackbarMessage: "Procesando factibilidad.... espere un momento", activeSnackbar: true, snackbarIcon: 'alarm' });

                /*this.setState({
                  open: true,
                  problemsforAdding: 'Procesando factibilidad, espere un momento'
                });
                */
                console.log(myFact,"agregar a fact especial.");

                factigis_addNuevaFactibilidad_especial(myFact, (cb)=>{
                  if(cb[0]){
                    this.setState({snackbarMessage: "La factibilidad N° " + cb[1] + " ha sido agregada. Tipo: " + cb[2]['Tipo_factibilidad'], activeSnackbar: true, snackbarIcon: 'done' });
                     $(".factigisVE_progressBar").css('display','none');

                    /*this.setState({
                    open: true,
                    problemsforAdding: 'La factibilidad  ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'] ,
                    numeroFactibilidad: 'N°' + cb[1],
                    btnModalCloseStatus: false
                    });
                    */


                    //GENERAR CARTA: guardar en cookie los parametros con que fue generada la factibilidad para crear la carta.
                    /*let usrprfl = cookieHandler.get('usrprfl');
                    cookieHandler.set('myLetter',[this.state.factigisDireccion + ", " + this.state.factCartaComuna ,
                      this.state.factigisNombre + " " + this.state.factigisApellido,
                      usrprfl.NOMBRE_COMPLETO,
                      cb[1],
                      usrprfl.CARGO,
                      usrprfl.LUGAR_DE_TRABAJO,
                      usrprfl.DEPARTAMENTO,
                      usrprfl.COMUNA]);

                      window.open("factigisCarta.html");
                      */
                       $(".factigisVE_progressBar").css('display','none');
                       console.log(cb, "devolviendo esto para venta empalme");
                       console.log("----------");
                       console.log("id:",cb[1], "tipo fact:", cb[2]['Tipo_factibilidad'], "rotulo:",cb[2]['Rotulo'], "y más...");
                       console.log("----------");

                       var boFactibilidad=0;

                       if(cb[2]['Tipo_factibilidad']=="FACTIBILIDAD DIRECTA"){
                         boFactibilidad = 1;
                       }else{
                         boFactibilidad = 2;
                       }

                       if(env.ENVIRONMENT=='PRODUCTION'){
                         let web = env.WPHP;
                         window.location= web + '?id_factibilidad='+

                         //window.location='http://ventasbeta.chilquinta.cl/online/getParametros.php?id_factibilidad='+
                               cb[1] +
                               '&bo_factibilidad=' +
                               boFactibilidad +
                               '&num_poste='+
                               cb[2]['Rotulo'] +
                               '&direccion=' +
                               cb[2]['Direccion'] +
                               '&comuna=' +
                               cb[2]['Comuna'] +
                               '&empalme=' +
                               cb[2]['Empalme']+
                               '&fase=' +
                               cb[2]['Fase']+
                               '&tiempoEmpalme=' +
                               cb[2]['Tiempo_empalme']+
                               '&potencia=' +
                               cb[2]['Potencia'] +
                               '&tipoEmpalme=' +
                               cb[2]['Tipo_empalme'];

                           window.close();
                       }


                      //si no fue grabado mostrar que hubo problemas en modal
                  }else{
                    //this.setState({snackbarMessage: cb[1], numeroFactibilidad: '', activeSnackbar: true, snackbarIcon: 'cashed' });
                    this.setState({snackbarMessage: 'Hubo un problema al agregar la factibilidad', activeSnackbar: true, snackbarIcon: 'error' });
                    /*this.setState({
                      open: true,
                      problemsforAdding: cb[1],  numeroFactibilidad: '',
                      btnModalCloseStatus: false
                    });
                    $("#iframeloadingAdd").hide();
                    */
                     $(".factigisVE_progressBar").css('display','none');
                  }
                });
                return;

              }
          }
          //Si está dentro de concesión y también dentro de transmisión
          if ($.inArray("transmision",factArr)>-1) {

              //en zona transmisión
              console.log("No se puede agregar debido a que está en zona de transmisión, pese a que está dentro de la concesión");
              this.setState({snackbarMessage: 'Estimado cliente, su factibilidad no se puede agregar debido a que está dentro de una zona de transmisión. Para una atención personalizada diríjase a nuestra oficina de atención al cliente.', numeroFactibilidad: '', activeSnackbar: true, snackbarIcon: 'cashed' });
              /*this.setState({
                open: true,
                problemsforAdding: 'No se puede agregar debido a que está en zona de transmisión, pese a que está dentro de la concesión',
                btnModalCloseStatus: false
              });
              $("#iframeloadingAdd").hide();
              */
              $(".factigisVE_progressBar").css('display','none');
              return;
          }
          //Si está dentro de concesión y también dentro de campamentos = Asistida
          if ($.inArray("campamentos",factArr)>-1) {
              fArr.push("campamentos");
                console.log("En zona campamentos");

                this.setState({snackbarMessage: "Procesando factibilidad.... espere un momento", activeSnackbar: true, snackbarIcon: 'alarm' });

                factigis_addNuevaFactibilidad_especial(myFact, (cb)=>{
                  if(cb[0]){
                    this.setState({snackbarMessage: "La factibilidad N° " + cb[1] + " ha sido agregada. Tipo: " + cb[2]['Tipo_factibilidad'], activeSnackbar: true, snackbarIcon: 'done' });
                     $(".factigisVE_progressBar").css('display','none');

                    /*this.setState({
                    open: true,
                    problemsforAdding: 'La factibilidad  ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'] ,
                    numeroFactibilidad: 'N°' + cb[1],
                    btnModalCloseStatus: false
                    });
                    */


                    //GENERAR CARTA: guardar en cookie los parametros con que fue generada la factibilidad para crear la carta.
                    /*let usrprfl = cookieHandler.get('usrprfl');
                    cookieHandler.set('myLetter',[this.state.factigisDireccion + ", " + this.state.factCartaComuna ,
                      this.state.factigisNombre + " " + this.state.factigisApellido,
                      usrprfl.NOMBRE_COMPLETO,
                      cb[1],
                      usrprfl.CARGO,
                      usrprfl.LUGAR_DE_TRABAJO,
                      usrprfl.DEPARTAMENTO,
                      usrprfl.COMUNA]);

                      window.open("factigisCarta.html");
                      */
                       $(".factigisVE_progressBar").css('display','none');
                       console.log(cb, "devolviendo esto para venta empalme");
                       console.log("----------");
                       console.log("id:",cb[1], "tipo fact:", cb[2]['Tipo_factibilidad'], "rotulo:",cb[2]['Rotulo'], "y más...");
                       console.log("----------");

                       var boFactibilidad=0;

                       if(cb[2]['Tipo_factibilidad']=="FACTIBILIDAD DIRECTA"){
                         boFactibilidad = 1;
                       }else{
                         boFactibilidad = 2;
                       }

                       if(env.ENVIRONMENT=='PRODUCTION'){
                         let web = env.WPHP;
                         window.location= web + '?id_factibilidad='+

                         //window.location='http://ventasbeta.chilquinta.cl/online/getParametros.php?id_factibilidad='+
                               cb[1] +
                               '&bo_factibilidad=' +
                               boFactibilidad +
                               '&num_poste='+
                               cb[2]['Rotulo'] +
                               '&direccion=' +
                               cb[2]['Direccion'] +
                               '&comuna=' +
                               cb[2]['Comuna'] +
                               '&empalme=' +
                               cb[2]['Empalme']+
                               '&fase=' +
                               cb[2]['Fase']+
                               '&tiempoEmpalme=' +
                               cb[2]['Tiempo_empalme']+
                               '&potencia=' +
                               cb[2]['Potencia'] +
                               '&tipoEmpalme=' +
                               cb[2]['Tipo_empalme'];

                           window.close();
                       }


                      //si no fue grabado mostrar que hubo problemas en modal
                  }else{
                    //this.setState({snackbarMessage: cb[1], numeroFactibilidad: '', activeSnackbar: true, snackbarIcon: 'cashed' });
                    this.setState({snackbarMessage: 'Hubo un problema al agregar la factibilidad', activeSnackbar: true, snackbarIcon: 'error' });
                    /*this.setState({
                      open: true,
                      problemsforAdding: cb[1],  numeroFactibilidad: '',
                      btnModalCloseStatus: false
                    });
                    $("#iframeloadingAdd").hide();
                    */
                     $(".factigisVE_progressBar").css('display','none');
                  }
                });
                return;
          }

          /*
          if ($.inArray("restringida",factArr)>-1) {
              fArr.push("restringida");
                console.log("En zona restringida");
          }
          */
          console.log("Problemas de zonas:", fArr);
        }


      //si falta algun campo que rellenar se muestra una ventana modal.
      }else{
        //this.setState({openModalValidator: true, problemsforAdding2: 'Por favor ingrese los campos que faltan (en rojo)'});
        console.log("ingrese campos que faltan", callback2);
        this.setState({snackbarMessage: "Ingrese los campos que faltan de la factibilidad que se encuentran marcados con borde rojo.", activeSnackbar: true, snackbarIcon: 'error' });
        if(this.state.visibilityStyle.selectPotencia.visibility=='hidden'){
          $(".factigisPotencia").css('border-style','initial').css('border-width','0px');
        }

      }
    });


  }

  onBlur(e){
    switch (e.currentTarget.id) {
      case 'factigis_txtPotencia':
          if(!this.state.potencia==''){
            if(this.state.potencia>0){
              this.setState({factigistxtPotenciaValidator: true});
            }else{
              this.setState({potencia: Math.abs(this.state.potencia)});
              this.setState({factigistxtPotenciaValidator: true});
            }
            ////console.log("si factigis_cantidadEmpalmes",this.state.factigisCantidadEmpalmes);

          }else{
            ////console.log("no factigis_cantidadEmpalmes",this.state.factigisCantidadEmpalmes);
            this.setState({potencia: 0});
            this.setState({factigistxtPotenciaValidator: false});
          }
        break;
        default:

    }
  }

  onChangeComboBox(type, val){
    var map = mymap.getMap();

    switch (type) {

      case 'tipoEmpalmeBTMT':
        console.log("empalme bt mt: ",val);
        $(".factigisVE_progressBar").css('display','flex');
        //Si no hay valor para lo seleccionado en BTMT
        if(!val){
          console.log("no hay value en el nivel de tension" , val);
          this.setState({empalmeBTMT: '', cbTensionDisabled: false, factigisTipoBTMTValidator: false});
          return;
        }
        //Si hay:
        //Guardar valor de empalme seleccionado, cambiar el validador de seleccion.
        this.setState({empalmeBTMT: val, factigisTipoBTMTValidator:true});

        var tramoTipo = 'Aéreo';
        console.log(this.state.factigisVE_opcionesEmpalme,"que empalme es, para filtrar por tramos de aereos o sub");
        if(this.state.factigisVE_opcionesEmpalme.length==1){
          tramoTipo = 'Subterráneo';
        }
        if(val=='BT'){
          //search around poste any tramo bt.
          factigis_findTramo(this.state.factigisVE_geoPoste, val, tramoTipo, (featureSetFeatures)=>{
            console.log(featureSetFeatures, "getting from findtramo");
            if(featureSetFeatures.tipoFactibilidad=='FACTIBILIDAD ASISTIDA'){
              this.setState({
                factigisTramoValidator: true,
                tramo: featureSetFeatures.descripcion,

                tipoFactibilidad: featureSetFeatures.tipoFactibilidad
              });
            }else{
              this.setState({
                factigisTramoValidator: true,
                tramo: featureSetFeatures.descripcion,

                tipoFactibilidad: featureSetFeatures.tipoFactibilidad
              });
            }
            // $("#iframeloadingAdd").hide();
            $(".factigisVE_progressBar").css('display','none');
          });
          ////console.log("seleccionado", val, "abriendo combo de potencia bt");
            this.setState({visibilityStyle:
              {
                selectPotencia: {
                  visibility: 'visible'
                },
                txtPotencia:{
                    visibility: 'hidden',
                    display: 'none',
                    height: 0
                }
              },
              potencia: '',
              factigisPotenciaValidator: false,
              factigistxtPotenciaValidator: true,
              cbTensionDisabled: false

            });
            $('.factigisPotencia2').css('border-color','initial').css('border-style', 'groove');
            //DISABLE QTTY WHEN VENTAWEB
            this.setState({cantidadEmpalmes: '1', cantidadEmpalmesValidator: true });



        }else{
          //when is mt, query around for mt
            factigis_findTramo(this.state.factigisVE_geoPoste, val, tramoTipo, (featureSetFeatures)=>{
            console.log(featureSetFeatures, "getting from findtramo");
              if(featureSetFeatures.tipoFactibilidad=='FACTIBILIDAD ASISTIDA'){
                this.setState({
                  factigisTramoValidator: true,
                  tramo: featureSetFeatures.descripcion,

                  factiTipoFactibilidad: featureSetFeatures.tipoFactibilidad
                });
              }else{
                this.setState({
                  factigisTramoValidator: true,
                  tramo: featureSetFeatures.descripcion,

                  factiTipoFactibilidad: featureSetFeatures.tipoFactibilidad
                });
              }
            $(".factigisVE_progressBar").css('display','none');
            });
            this.setState({visibilityStyle:
              {
                selectPotencia: {
                  visibility: 'hidden',
                  display: 'none',
                  height: 0
                },
                txtPotencia:{
                    visibility: 'visible',
                    display: 'flex'
                }
              },

              potencia: '',
              factigistxtPotenciaValidator: false,
              factigisPotenciaValidator: true,
              cbTensionDisabled: false
            });
            $('.factigisPotencia').css('border-color','initial').css('border-style', 'hidden').css('border-width', '0px');
            //DISABLE QTTY WHEN SELECT MT
            this.setState({cantidadEmpalmes: '1', cantidadEmpalmesValidator: true });

        }
      break;

      case 'tipoEmpalme':
        //  console.log("haciendo click en ", type,val);
        if(!val){
          //////console.log("no hay value" , val);
          this.setState({empalme: 'NODEFINIDO', factigisTipoEmpalmeValidator: false, factigis_tipoPotencia: []});
          return;
        }
        this.setState({empalme: val, factigisTipoEmpalmeValidator:true, factigis_tipoPotencia: []});
      break;

      case 'tipoFase':
        //////console.log("haciendo click en ", type,val);
        if(!val){
          //////console.log("no hay value" , val);
          this.setState({fase: 'NODEFINIDO', factigisTipoFaseValidator: false, factigis_tipoPotencia: []});
          return;
        }
        this.setState({fase: val, factigisTipoFaseValidator:true, factigis_tipoPotencia: []});
      break;

      case 'tipoPotencia':
        ////console.log("haciendo click en ",val);
        if(!val){
        ////console.log("no hay value" , val);
          this.setState({potencia: 'NODEFINIDO', factigisPotenciaValidator: false, factigistxtPotenciaValidator: true});
          return;
        }
        this.setState({potencia: val, factigisPotenciaValidator: true, factigistxtPotenciaValidator: true});
      break;

      case 'ddlCantidadEmpalmes':
        ////console.log("haciendo click en ",val);
        if(!val){
        ////console.log("no hay value" , val);
          this.setState({cantidadEmpalmes: 'NODEFINIDO', cantidadEmpalmesValidator: false});
          return;
        }
        this.setState({cantidadEmpalmes: val, cantidadEmpalmesValidator: true});

        break;

      case 'ddlClasificacion':
        console.log("haciendo click en ",val);
        if(!val){
        ////console.log("no hay value" , val);
          this.setState({factigisClasificacion:  'NODEFINIDO', factigisClasificacionValidator: false});
          return;
        }
        this.setState({factigisClasificacion: val, factigisClasificacionValidator: true});
        break;

      case 'crearDireccion_tipoEdificacion':
          console.log("haciendo click en ",val);
          if(!val){
          ////console.log("no hay value" , val);
            this.setState({crearDireccion_tipoEdificacion:  ''});
            return;
          }
          this.setState({crearDireccion_tipoEdificacion: val});
          break;

      default:

    }
  }

  onChange(e){
    console.log(e);
    switch (e.currentTarget.id) {

      case 'factigis_txtPotencia':
      console.log("aqui");
        this.setState({potencia: e.currentTarget.value});
      break;

      case 'factigis_checkEmpalmeDefinitivo':
        this.setState({radioEmpalmeDefinitivo: true, radioEmpalmeProvisorio:false});
      break;

      case 'factigis_checkEmpalmeProvisorio':
        this.setState({radioEmpalmeProvisorio: true, radioEmpalmeDefinitivo:false});
      break;

      default:
    }
  }

  onOpen(){

   if( (this.state.empalme=='' || this.state.fase=='NODEFINIDO' || this.state.fase=="") ){
     ////////console.log("no hay valor de tipo Empalme para calcular potencia.", this.state.factigis_selectedValueTipoFase, this.state.factigis_selectedValueTipoEmpalme);
     return
   }else{
     getPotenciaEmpalme(this.state.empalme,this.state.fase, (cb)=>{
       //////console.log(cb);
       this.setState({factigisVE_opcionesPotencia: cb})
     });

   }
  }

  onClickLimpiar(e){
    $('.paso2').css('display','none');
    $('.paso3').css('display','none');
    $('.paso4').css('display','none');

    this.setState({btnDireccionDisabled: false});
    this.setState({
      factigisVE_geoDireccion: '',
      direccion:'',
      iddireccion: '',
      factigisDireccionValidator: false,
      factigis_geoDireccionValidator: false,

      rotulo: '',
      factigisRotuloValidator: false,
      factigis_geoPosteValidator: false,


      factigisVE_geoCliente: '',

      comuna: '',
      zona: '',
      zonaConcesion: false,
      zonaCampamentos: false,
      zonaRestringida: false,
      zonaVialidad: false,
      zonaTransmision: false,
      ubicacionMedidor: '',
      btnPosteDisabled: false,

      cbTensionDisabled: false,
      empalmeBTMT: '',
      empalme: '',
      cantidadEmpalmes: 1,
      factigisCantidadEmpalmesValidator: true,
      factigisTipoBTMTValidator: false,
      factigisTipoEmpalmeValidator: false,
      factigisTipoFaseValidator: false,
      factigisTramoValidator: false,
      btnClienteDisabled: false,
      potencia: '',
      fase: ''
    });

    var map = mymap.getMap();
    map.removeLayer(gLayerDireccion);
    map.removeLayer(gLayerPoste);
    map.removeLayer(gLayerMedidor);

    $('.factigisRut').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisNombre').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisApellido').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisTelefono').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisEmail').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisTramo').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisCantidadEmpalmes').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisDireccion').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisRotulo').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_tipoCliente').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_tipoContribuyente').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisTipoEmpalme').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_tipoFase').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_tipoPotencia').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisPotencia').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisPotencia2').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisTipo').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_btnSelectCliente').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_btnSelectPoste').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_btnSelectDireccion').css('border-color','initial').css('border-style', 'hidden');

  }

  onClickAyuda(){
    var url = env.ROOT2+"ayuda/ayuda.html"
    window.open(url, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no");
  }

  handleSnackbarClick = () => {
    this.setState({activeSnackbar: false});
  };

  onClickCalle(){

    var mapp = mymap.getMap();
    $(".factigisVE_progressBar").css('display','flex');
    $(".factigisVEDir_btnPaso1").css('color','red');
    dojo.disconnect(this.state.btnSelectCalle);
    if(this.state.activeSnackbar){
      this.setState({activeSnackbar: false});

    }
    var mapabase = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_mapabase(),{id:"gis_chqbasemap"});
    mapabase.setImageFormat("png32");
    mapp.addLayer(mapabase,1);

    var map_click_handle = dojo.connect(mapp, 'onClick', (g)=>{
      this.setState({btnSelectCalle: map_click_handle});
      //saves geometry point for customer.
      factigis_findCalle(g.mapPoint, (featureSetFeatures)=>{
        this.setState({factigis_geoCalle: g.mapPoint});
        if(!featureSetFeatures.length){
          console.log("No se ha podido encontrar la calle, seleccione de nuevo");
          this.setState({snackbarMessage: "No se ha podido encontrar la calle, seleccione de nuevo", activeSnackbar: true, snackbarIcon: 'error' });
          $(".factigisVE_progressBar").css('display','none');
          $(".factigisVEDir_btnPaso1").css('color','black');
          dojo.disconnect(this.state.btnSelectCalle);
          return;
        }
        this.setState({
          crearDireccion_nombreCalle: featureSetFeatures[0].attributes['nombre'],
          crearDireccion_objectidNombreCalle: featureSetFeatures[0].attributes['OBJECTID']
        });
        dojo.disconnect(this.state.btnSelectCalle);
        $(".factigisVE_progressBar").css('display','none');
        $('.direccionesPaso2').css('display','block');
        $(".factigisVEDir_btnPaso1").css('color','black');
        this.setState({crearDireccion_calle_disabled: true});
      });
    });
  }

  onClickUbicacionCasa(){
    $(".factigisVE_progressBar").css('display','flex');
    $(".factigisVEDir_btnPaso2").css('color','red');
    var mapp = mymap.getMap();
    gLayerUbicacionCasa.clear();
    dojo.disconnect(this.state.btnUbicacionCasa);
    if(this.state.activeSnackbar){
      this.setState({activeSnackbar: false});
    }

     var map_click_handle = dojo.connect(mapp, 'onClick', (g)=>{
       //saves geometry point for customer.
       this.setState({factigisVE_geoUbicacionCasa: g.mapPoint, btnUbicacionCasa: map_click_handle});

       //draw customer location on the map.

      let pointSymbol = makeSymbol.makePointCustomer();
      gLayerUbicacionCasa.add(new esri.Graphic(g.mapPoint,pointSymbol));
      mapp.addLayer(gLayerUbicacionCasa);
      $(".factigisVE_progressBar").css('display','none');
      $('.direccionesPaso3').css('display','block');
      $(".factigisVEDir_btnPaso2").css('color','black');
      this.setState({crearDireccion_ubicacion_disabled: true, crearDireccion_ubicacionDireccion: 'CASA UBICADA'});
      dojo.disconnect(this.state.btnUbicacionCasa);

     });

  }

  onBlurText(name){
     if(this.state.crearDireccion_numeroCasa==''){
       console.log("vacio", this.state.crearDireccion_numeroCasa);
        $('.direccionesPaso4').css('display','none');
     }else{
        console.log("no vacio", this.state.crearDireccion_numeroCasa);
          $('.direccionesPaso4').css('display','block');
     }

  }

  onBlurAnexo(name){
    if(this.state.crearDireccion_anexo1==''){
      console.log("vacio", this.state.crearDireccion_anexo1);
       $('.direccionesPaso5').css('display','none');
    }else{
       console.log("no vacio", this.state.crearDireccion_anexo1);
         $('.direccionesPaso5').css('display','block');
    }
  }

  onClickAgregarDireccion(){
    $(".factigisVE_progressBar").css('display','flex');
    this.setState({snackbarMessage: "Procesando dirección.... espere un momento", activeSnackbar: true, snackbarIcon: 'alarm' });
    var mapp = mymap.getMap();

      let objNewAddress = {
        CALLE: this.state.crearDireccion_nombreCalle,
        NUMERO : this.state.crearDireccion_numeroCasa ,
        ANEXO1 : this.state.crearDireccion_anexo1,
        ANEXO2 : this.state.crearDireccion_anexo2,
        TIPO_EDIFICACION : this.state.crearDireccion_tipoEdificacion,
        X: this.state.factigisVE_geoUbicacionCasa.x,
        Y: this.state.factigisVE_geoUbicacionCasa.y
      }

      let objGeometry = {
        geoUbicacionCasa: this.state.factigisVE_geoUbicacionCasa
      }

      direccionValidator(objNewAddress, (cb, falseEncontrados)=>{
        console.log(cb,"encontrados", falseEncontrados);
        if(cb){
          console.log("sigue");

          if(mapp.getLayer("gis_chqbasemap")){
            mapp.removeLayer(mapp.getLayer("gis_chqbasemap"));
          }

          //agregar la dirección:
          factigis_addNuevaDireccion(objNewAddress, objGeometry, (callback)=>{
            if(callback){
              gLayerUbicacionCasa.clear();
              $(".factigisVE_progressBar").css('display','none');
              this.setState({snackbarMessage: "Nueva Dirección agregada", activeSnackbar: true, snackbarIcon: 'done' });
              console.log("Address Added.");
              return;
            }
              //this.setState({open: true, problemsforAdding: 'Error al agregar dirección, intente nuevamente y revise los campos.'});
              this.setState({snackbarMessage: "Error al agregar dirección, intente nuevamente y revise los campos. En caso contrario, diríjase a nuestras oficinas comerciales.", activeSnackbar: true, snackbarIcon: 'delete' });
              console.log("Address not added.");
              $(".factigisVE_progressBar").css('display','none');
          });

        }else{

          console.log("no sigue");
          //remueve de campos obligatorios el anexo 2
          let index = falseEncontrados.indexOf('ANEXO2');

          if (index > -1) {
            falseEncontrados.splice(index, 1);
          }
          console.log("ahora", falseEncontrados);
          if(!falseEncontrados.length){
            console.log("sigueeee");
            if(mapp.getLayer("gis_chqbasemap")){
              mapp.removeLayer(mapp.getLayer("gis_chqbasemap"));
            }

            //agregar la dirección:
            factigis_addNuevaDireccion(objNewAddress, objGeometry, (callback)=>{
              if(callback){
                gLayerUbicacionCasa.clear();
                $(".factigisVE_progressBar").css('display','none');
                this.setState({snackbarMessage: "Nueva Dirección agregada", activeSnackbar: true, snackbarIcon: 'done' });
                console.log("Address Added.");
                return;
              }
                //this.setState({open: true, problemsforAdding: 'Error al agregar dirección, intente nuevamente y revise los campos.'});
                this.setState({snackbarMessage: "Error al agregar dirección, intente nuevamente y revise los campos. En caso contrario, diríjase a nuestras oficinas comerciales.", activeSnackbar: true, snackbarIcon: 'delete' });
                console.log("Address not added.");
                $(".factigisVE_progressBar").css('display','none');
            });

          }else{
            this.setState({snackbarMessage: "Por favor, rellene los campos que faltan.", activeSnackbar: true, snackbarIcon: 'error' });
            $(".factigisVE_progressBar").css('display','none');
          }
        }
      });

      /*

      */
  }

  onLimpiarDireccion(){
    var mapp = mymap.getMap();

    this.setState({
      crearDireccion_calle_disabled: false,
      btnSelectCalle: '',
      crearDireccion_objectidNombreCalle: '',
      crearDireccion_nombreCalle: '',
      crearDireccion_ubicacion_disabled: false,
      crearDireccion_ubicacionDireccion: '',
      crearDireccion_numeroCasa: '',
      crearDireccion_anexo1: '',
      crearDireccion_anexo2: ''

    });
    $(".factigisVE_progressBar").css('display','none');
    $('.direccionesPaso2').css('display','none');
    $('.direccionesPaso3').css('display','none');
    $('.direccionesPaso4').css('display','none');
    $('.direccionesPaso5').css('display','none');
    gLayerUbicacionCasa.clear();
    if(mapp.getLayer("gis_chqbasemap")){
      mapp.removeLayer(mapp.getLayer("gis_chqbasemap"));
    }

    dojo.disconnect(this.state.btnSelectCalle);

    $(".factigisVEDir_btnPaso1").css('color','black');

  }

  onChangePot2(e){
    this.setState({potencia: e});
  }
  render() {
    const imgFrame = env.CSSDIRECTORY+"images/ajax-loader.gif";

    return (
      <div>
        <AppBar title="FactigisVE">
          <div className="factigisVE_Header">
            <Logo />
            <div className="factigisVE_Header_leftside">
              <div id="search"></div>
              <Button className="factigisVE_btnAyuda" icon='help' label='Ayuda' flat onClick={this.onClickAyuda.bind(this)} />
            </div>
          </div>
        </AppBar>


        <ProgressBar className="factigisVE_progressBar" id="factigisVE_progressBar" mode='indeterminate'/>
        {/* Contenido */}
        <div className="factigisVE_content">
          {/* Menu izquierda */}
          <div className="factigisVE_menuIzquierdo">
           <Tabs onSelect={this.handleSelect.bind(this)} selectedIndex={this.state.selectedTab}>
            <TabList>
              {this.state.showA && <Tab><i className="fa fa-plus"> <h8 className="factigisVE_tabText">CREAR FACTIBILIDAD</h8></i></Tab>}
              {this.state.showB && <Tab><i className="fa fa-plus"></i> <i className="fa fa-home" aria-hidden="true"> <h8 className="factigisVE_tabText">CREAR DIRECCION</h8></i></Tab>}
            </TabList>
            {/* AGREGAR FACTIBILIDAD*/}
            {this.state.showA && <TabPanel>

              {/* paso 1*/}
              <div className="factigisVE_pasoDiv">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 1/4: Haga zoom en el mapa hasta encontrar su nombre de calle y numeración. Active el botón de este formulario y seleccione la numeración en el mapa.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Debe hacer zoom utilizando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los recuadros de color gris  y rojo.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso">
                  <Input disabled className="factigisVE_textfield" type='text' label='Dirección' name='direccion' value={this.state.direccion} />
                  <Button onClick={this.onClickDireccion.bind(this)} disabled={this.state.btnDireccionDisabled} className="factigisVE_btnPaso1" raised icon="home"></Button>
                </div>
              </div>

              {/* paso 2*/}
              <div className="factigisVE_pasoDiv paso2">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 2/4: Active el botón de este formulario y seleccione el poste aéreo o cámara subterránea más cercana a su dirección.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Existen postes y cámaras en el mapa con su respectivo rótulo o número de identificación, seleccione la más cercana a su dirección.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso">
                  <Input disabled className="factigisVE_textfield" type='text' label='Rótulo Conexión' name='rotulo' value={this.state.rotulo} onChange={this.handleChange.bind(this, 'rotulo')} />
                  <Button onClick={this.onClickPoste.bind(this)} disabled={this.state.btnPosteDisabled} className="factigisVE_btnPaso2" raised icon= "format_size"></Button>
                </div>
              </div>

              {/* paso 3*/}
              <div className="factigisVE_pasoDiv paso3">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 3/4: Active el botón de este formulario e indique la ubicación del medidor en el mapa.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Indique haciendo clic sobre el mapa la ubicación del medidor. Esta aparecerá de color.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1" />
                </div>

                <div className="factigisVE_paso">
                  <Input disabled className="factigisVE_textfield" type='text' label='Ubicación Medidor' name='ubicaciónMedidor' value={this.state.ubicacionMedidor} onChange={this.handleChange.bind(this, 'ubicacionMedidor')} />
                  <Button onClick={this.onClickMedidor.bind(this)} disabled={this.state.btnClienteDisabled} className="factigisVE_btnPaso3" raised icon= "location_on"></Button>
                </div>
              </div>
              {/* paso 4*/}
              <div className="factigisVE_pasoDiv paso4">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 4/4: Agregue datos del suministro o empalme que requiere.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Indique datos sobre: nivel de tensión, empalme, fase, potencia, y si es definitivo o provisorio.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso factigisVE_paso4">
                  <Select id="dllTipoBTMT" disabled={this.state.cbTensionDisabled} className="factigisVE_select factigisTipo" name="dllTipoBTMT" options={this.state.factigisVE_opcionesBTME}
                    value={this.state.empalmeBTMT} simpleValue clearable={true} searchable={false} placeholder="Seleccione BT/MT"
                    onChange={this.onChangeComboBox.bind(this,"tipoEmpalmeBTMT")}/>

                  <Select id="ddlTipoEmpalme" className="factigisVE_select factigisTipoEmpalme" name="ddlTipoEmpalme" options={this.state.factigisVE_opcionesEmpalme}
                    value={this.state.empalme} simpleValue clearable={true} searchable={false} placeholder="Seleccione tipo empalme"
                    onChange={this.onChangeComboBox.bind(this,"tipoEmpalme")}/>

                  <Select id="ddlFase" className="factigisVE_select factigis_tipoFase" name="ddlFase" options={this.state.factigisVE_opcionesFase}
                    value={this.state.fase} simpleValue clearable={true} searchable={false} placeholder="Seleccione tipo fase"
                    onChange={this.onChangeComboBox.bind(this,"tipoFase")}/>

                  <div className="divPotencias" style={this.state.visibilityStyle.selectPotencia}>
                    <Select id="ddlPotencia" disabled={false} className="factigisVE_select factigisPotencia" name="ddlPotencia" options={this.state.factigisVE_opcionesPotencia}
                     value={this.state.potencia} simpleValue clearable={true} searchable={false} placeholder="Seleccione potencia"
                     onChange={this.onChangeComboBox.bind(this,"tipoPotencia")} onOpen={this.onOpen.bind(this)}/>
                  </div>

                  <div className="divPotencias" style={this.state.visibilityStyle.txtPotencia}>
                    <Input disabled={false}
                      className="factigisVE_textfield factigisPotencia2"
                      type='number' label='Potencia solicitada'
                      name='potencia' value={this.state.potencia}
                      onChange={this.onChangePot2.bind(this)}
                      onBlur={this.onBlur.bind(this)}
                      id="factigis_txtPotencia"/>
                  </div>

                 <div className="factigisVE_radios">
                    <input type="radio" id="factigis_checkEmpalmeDefinitivo"  onChange={this.onChange.bind(this)} className="" name="permanenciaEmpalme" value="DEFINITIVO" defaultChecked={this.state.radioEmpalmeDefinitivo}  />Definitivo<br />
                    <input type="radio" id="factigis_checkEmpalmeProvisorio"  onChange={this.onChange.bind(this)} className="" name="permanenciaEmpalme" value="PROVISORIO" defaultChecked={this.state.radioEmpalmeProvisorio} />Provisorio<br />
                  </div>
                </div>
              </div>

              <div className="factigisVE_buttonsDiv">
               <Button onClick={this.onClickLimpiar.bind(this)} className="fatigisVE_button" icon='delete_sweep' label='Limpiar' raised primary  />
               <Button onClick={this.onClickAgregarCliente.bind(this)} className="fatigisVE_button" icon='add' label='Agregar' raised primary  />
              </div>

            </TabPanel>}

            {/* AGREGAR DIRECCION*/}
            {this.state.showB && <TabPanel>
              {/* paso 1*/}
              <div className="factigisVE_pasoDiv">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 1/5 : Haga zoom en el mapa y haga clic sobre el nombre de la calle más cercana a su dirección. En caso de no encontrar calle, escríbala.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Debe hacer zoom utilizando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los nombres de las calles.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso">
                  <Input disabled={this.state.crearDireccion_calle_disabled} className="factigisVE_textfield direccionexTexfield" onChange={this.handleChange.bind(this, 'crearDireccion_nombreCalle')}  type='text' label='* Calle' name='crearDireccion_nombreCalle' value={this.state.crearDireccion_nombreCalle} maxLength={200} />
                  <Button disabled={this.state.crearDireccion_calle_disabled} onClick={this.onClickCalle.bind(this)}  className="factigisVEDir_btnPaso1" raised icon="confirmation_number"></Button>
                </div>
              </div>
              {/* paso 2*/}
              <div className="factigisVE_pasoDiv direccionesPaso2">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 2/5 : Indique el lugar donde se ubica la casa, seleccionándolo en el mapa activando el botón. .</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Debe hacer zoom utilizando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los nombres de las calles.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso">
                  <Input disabled={this.state.crearDireccion_ubicacion_disabled} label='* Ubicación' className="factigisVE_textfield direccionexTexfield" type='text' onChange={this.handleChange.bind(this, 'crearDireccion_ubicacionDireccion')}  name='crearDireccion_ubicacionDireccion' value={this.state.crearDireccion_ubicacionDireccion} maxLength={200} />
                  <Button disabled={this.state.crearDireccion_ubicacion_disabled} onClick={this.onClickUbicacionCasa.bind(this)}  className="factigisVE_btnPaso2" raised icon="location_on"></Button>
                </div>
              </div>
              {/* paso 3*/}
              <div className="factigisVE_pasoDiv direccionesPaso3">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 3/5: Escriba el número de la casa que corresponde a la dirección.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Debe ser el número municipal de la casa para identificarla en terreno.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso">
                  <Input onBlur={this.onBlurText.bind(this)} onChange={this.handleChange.bind(this, 'crearDireccion_numeroCasa')} className="factigisVE_textfield direccionexTexfield" type='text' label='* Numero de casa' name='crearDireccion_numeroCasa' value={this.state.crearDireccion_numeroCasa} maxLength={50} />
                </div>
              </div>
              {/* paso 4*/}
              <div className="factigisVE_pasoDiv direccionesPaso4">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 4/5: Escriba algunas referencias sobre el lugar.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Escriba en los anexos información relacionada al lugar, por ejemplo: ¿cómo llegar?, cerca de...<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso">
                  <Input onBlur={this.onBlurAnexo.bind(this)} onChange={this.handleChange.bind(this, 'crearDireccion_anexo1')} className="factigisVE_textfield direccionexTexfield" type='text' label='* Anexo 1' name='crearDireccion_anexo1' value={this.state.crearDireccion_anexo1} maxLength={50} />
                </div>
                <div className="factigisVE_paso">
                  <Input onBlur={this.onBlurAnexo.bind(this)} onChange={this.handleChange.bind(this, 'crearDireccion_anexo2')} className="factigisVE_textfield direccionexTexfield" type='text' label='Anexo 2' name='crearDireccion_anexo2' value={this.state.crearDireccion_anexo2} maxLength={50} />
                </div>
              </div>
              {/* paso 5*/}
              <div className="factigisVE_pasoDiv direccionesPaso5">
                <div className="factigisVE_pasoDivTitle">
                  <h5 className="factigisVE_paso_title">Paso 5/5: Seleccione el tipo de edificación de la dirección.</h5>
                  <Tooltip placement="right" trigger={['hover']} overlay={<span>Debe seleccionar la opción que más describa a su casa.<br/></span>}><IconButton icon='live_help'/></Tooltip>
                  <img className="factigisVE_imgLoader" src={imgFrame} alt="loading" id="iframePaso1"/>
                </div>

                <div className="factigisVE_paso">
                <Select id="dllTipoBTMT" className="factigisVE_select factigisTipo" name="dllTipoBTMT" options={this.state.factigisVE_opcionesEdificacion}
                  value={this.state.crearDireccion_tipoEdificacion} simpleValue clearable={true} searchable={false} placeholder="* Tipo edificación"
                  onChange={this.onChangeComboBox.bind(this,"crearDireccion_tipoEdificacion")}/>
                </div>
              </div>
              <div className="factigisVE_buttonsDiv direccionDiv">
               <Button onClick={this.onClickAgregarDireccion.bind(this)} className="fatigisVE_button " icon='add' label='Agregar Dirección' raised primary  />
               <Button onClick={this.onLimpiarDireccion.bind(this)} className="fatigisVE_button " icon='clear' label='Limpiar Pasos' raised primary  />
              </div>
            </TabPanel>}
          </Tabs>
          </div>

          {/* Menu izquierda */}
          <div className="factigisVE_menuDerecho">
            <div className="factigisVE_map_div" id="factigis_map_div">
              <div id="BasemapToggle"></div>
            </div>
          </div>

        </div>
        <Snackbar action='Aceptar' active={this.state.activeSnackbar} icon={this.state.snackbarIcon} label={this.state.snackbarMessage} onClick={this.handleSnackbarClick.bind(this)} type='cancel' />

      </div>
    );
}

}

export default App;
