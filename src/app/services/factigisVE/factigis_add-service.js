import {getDetailsForPotencia} from './factigis_potenciaEmpalmes';
import token from './token-service';
import layers from './layers-service';
import cookieHandler from 'cookie-handler';
import _ from 'lodash';
import jQuery from 'jquery';
import {searchNivelesCoci} from './factigis_searchSGOCertificate';

/* Potencia disponible = kva - 0,327*N^(-0,203)*N*5

  Ejemplo Trafo 150 con 108 Clientes:
  Potencia disponible = 150 - 0,327*108^(-0,203)*108*5
  Potencia disponible = 150 - 68,25846068
  Potencia disponible = 81,74153932

*/
function getFormatedDateNow(){
  var d = new Date();

  var str = "day/month/year hour:minute:second"
    .replace('day', d.getDate() <10? '0'+ d.getDate() : d.getDate())
    .replace('month', (d.getMonth() + 1) <10? '0' + (d.getMonth()+1) : (d.getMonth()+1))
    .replace('year', d.getFullYear())
    .replace('hour', d.getHours() <10? '0'+ d.getHours() : d.getHours() )
    .replace('minute', d.getMinutes() <10? '0'+ d.getMinutes() : d.getMinutes())
    .replace('second', d.getSeconds() <10? '0'+ d.getSeconds() : d.getSeconds());
    console.log(str);
  return str;
}

function factigis_addNuevaDireccion(newAddress, newGeometry, callback){

  let geox = newGeometry.geoUbicacionCasa.x;
  let geoy=  newGeometry.geoUbicacionCasa.y;

    const data = {
      f: 'json',
      adds: JSON.stringify([{ attributes: newAddress, geometry: {"x":geox , "y": geoy}}]),
      token: token.read()
    };

    if ( (newAddress['ANEXO1']=="") || (newAddress['CALLE']=="") || (newAddress['NUMERO']=="") || (newAddress['TIPO_EDIFICACION']=="")  ){
      return callback(false);
    }

    jQuery.ajax({
      method: 'POST',
      url: layers.read_factigis_addDireccion(),
      dataType:'html',
      data: data
    })
    .done(d =>{
      console.log(d);
      let json = JSON.parse(d);
      if( (_.has(json,'error')) ){
        return callback(false);
      }else{
        let arrObject = [];
        if(json["addResults"][0].objectId>0){
          return callback(true);

        }else{
          return callback(false);
        }
      }
    })
    .fail(f=>{
      console.log(f,"no pase")
      callback(false)
    });

}

function factigis_addNuevaFactibilidad(factibilidad, callbackadd){
  //Trae los datos preliminares de la factibilidad.
  var fact = {};
  //Si el empalme es BT, se calcula la distancia entre cliente poste y cliente dirección.
    /* Además se calcula la potencia solicitada.
    *  Se calcula la potencia disponible de la sed.
    */

  //cuando es BT
  if(factibilidad.factigisTipoEmpalme=='BT'){
    getDetailsForPotencia(factibilidad.factigisPotencia, factibilidad.factigisEmpalme, factibilidad.factigisFase,
      (potenciaDetails)=>{
        factibilidad.factigisPotencia = potenciaDetails[0].label;
        factibilidad.capacidadInterruptor = potenciaDetails[0].capacidadInterruptor;
        factibilidad.capacidadEmpalme = potenciaDetails[0].capacidadEmpalme;

        //calcular distancias dir-clie-poste:
          //variables a usar en formula
            let x2 = factibilidad.factigisGeoPoste.x;
            let x1 = factibilidad.factigisGeoCliente.x;
            let y2 = factibilidad.factigisGeoPoste.y;
            let y1 = factibilidad.factigisGeoCliente.y;
            let x3 =factibilidad.factigisGeoDireccion.x;
            let y3 = factibilidad.factigisGeoDireccion.y;

            //21.11.2018: Agregar lon lat del cliente
            factibilidad.factigisLat = factibilidad.factigisGeoCliente.getLatitude();
            factibilidad.factigisLon = factibilidad.factigisGeoCliente.getLongitude();

            //rotulo conexión y medidor (ubicación)
            let res = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
            //medidor (ubicación) y direccion
            let res2 = Math.sqrt(Math.pow((x3-x1),2) + Math.pow((y3-y1),2));
            //asignando valores para ambas distancias
            factibilidad.factigisDistRotMed = Math.round(res);
            factibilidad.factigisDistMedDir = Math.round(res2);

            //calcular potencias: solicitada x cantidad
            factibilidad.factigisPotenciaCalculada = factibilidad.factigisPotencia * factibilidad.factigisCantidadEmpalmes;
            //definir estado de trámite como nuevo
            //10.8.2018: ESTADO TRAMITE NUEVA -> EN SOLICITUD - SOLO VE
            //factibilidad.factigisEstadoTramite = 'NUEVA';
            factibilidad.factigisEstadoTramite = 'EN SOLICITUD';
            //agregar potencia disponible para SED
            buscarCantClienteSED(factibilidad.factigis_Sed, (cantidadClientes)=>{
              var kva = buscarKVASED(factibilidad.factigis_Sed, (kva)=>{
                //25.06.2019: Modificado factor 5 a 6kWh
                let potenciaDisponible = kva - (0.327 * (Math.pow(cantidadClientes,-0.203))*cantidadClientes*6);
                //asignar potencia disponible para SED
                factibilidad.factigisPotenciaDisponibleSED = potenciaDisponible;

                console.log("tengo la siguiente factibilidad",factibilidad.factigisTipoFactibilidad);
                //Si la potencia disponible es menor a 0 , pasa a ser FACTIBILIDAD ASISTIDA
                if(potenciaDisponible < 0){
                  factibilidad.factigisTipoFactibilidad = 'FACTIBILIDAD ASISTIDA';
                }

                //Req1: 04.12.2018: KVA <25 dejarla asistida.
                if(kva <= 25){
                  factibilidad.factigisTipoFactibilidad = 'FACTIBILIDAD ASISTIDA';
                }

                //agregar origen de factibilidad:
                factibilidad.factigisOrigen = 'VENTA WEB';

                //si el empalme es subterraneo -> factibilidad ASISTIDA
                //2.- empalme subterráneo -> Asistida.
                if(factibilidad.factigisEmpalme=="SUBTERRANEO"){
                  factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
                }

                //26/10/2016 REQ 5: si el tiempo empalme es provisorio y la fase es trifásico => FACTIBILIDAD ASISTIDA.
                if( (factibilidad.factigisFase=="TRIFASICO") && (factibilidad.factigisTiempoEmpalme=="PROVISORIO") ){
                  factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
                }

               //si la fase es trifásica - > factibilidad ASISTIDA
               //  1.-   trifásicos (no importa si es bt o mt) y > a 18KW  -> Asistida.

                if( (factibilidad.factigisPotencia > 4 ) && (factibilidad.factigisFase=='TRIFASICO')){
                  factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
                }

                //06.04.2017: Req: #6 •	Agregar nueva regla a los estudios dentro de la zona de concesión, es decir, a las reglas originales que finalizan en
                //factibilidad directa o asistida agregar la regla de los 50 metros para que el resultado sea asistido.
                console.log(factibilidad.factigisDistRotMed,"tengo esta distancia");
                if(factibilidad.factigisDistRotMed > 30){
                  console.log("distancia rotulo medidor > 30", factibilidad.factigisDistRotMed);
                  factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
                }

                //agregar a rest srv

                console.log("Estoy con la siguiente factibilidad en bt",factibilidad.factigisTipoFactibilidad);

                if(factibilidad.factigisTipoFactibilidad=="FACTIBILIDAD DIRECTA"){
                  factibilidad.factigisTipoMejora = "FACTIBILIDAD DIRECTA";
                  factibilidad.factigisEstadoTramite = 'CERRADA';
                }else{
                  factibilidad.factigisTipoMejora = "POR DEFINIR";
                }

                console.log("agregar lo siguiente a arcgis srv", factibilidad);

                agregarFact(factibilidad,(isDone)=>{
                console.log(isDone[0],isDone[1],isDone[2],"valor en agregarFact");
                  if(isDone[0]){
                   
                    let pasar = [];
                    pasar.push(true);
                    pasar.push(isDone[1])
                    pasar.push(isDone[2]);

                    let usrprfl = cookieHandler.get('usrprfl');
                    let empre = cookieHandler.get('empre');

                    let historial = {
                      Estado_tramite:  factibilidad.factigisEstadoTramite,
                      ID_Factibilidad: isDone[1],
                      Fecha_cambio: getFormatedDateNow(),
                      Observacion: "ESTADO INICIAL",
                      Usuario:  'REACT VENTA EMPALMES WEB USER',
                      empresa: empre
                      }
                    agregarEstadoHistoria(historial, myhistorialCb =>{
                      console.log("hecho o no el historial",myhistorialCb);

                    //agregar cookie para ventaweb.
                    factibilidad.IDFactibilidad = isDone[1];
                    cookieHandler.set('myttrbts ',factibilidad);
                      return callbackadd(pasar);
                    });
                
                  }else{
                    console.log("hubo un problema agregando");
                  }

                });
              });
            });
    });
  }
  //Si el empalme es MT, se calcula la distancia entre cliente poste y cliente dirección.
    /* Además NO se calcula la potencia solicitada.
    *  NO se calcula la potencia disponible de la sed.
    */
  else{
    //cuando es MT
    factibilidad.capacidadInterruptor = 0;
    factibilidad.capacidadEmpalme = 0;

        //calcular distancias dir-clie-poste:
        //variables a usar en formula
        let x2 = factibilidad.factigisGeoPoste.x;
        let x1 = factibilidad.factigisGeoCliente.x;
        let y2 = factibilidad.factigisGeoPoste.y;
        let y1 = factibilidad.factigisGeoCliente.y;
        let x3 =factibilidad.factigisGeoDireccion.x;
        let y3 = factibilidad.factigisGeoDireccion.y;

        //21.11.2018: Agregar lon lat del cliente
        factibilidad.factigisLat = factibilidad.factigisGeoCliente.getLatitude();
        factibilidad.factigisLon = factibilidad.factigisGeoCliente.getLongitude();

        //rotulo conexión y medidor (ubicación)
        let res = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
        //medidor (ubicación) y direccion
        let res2 = Math.sqrt(Math.pow((x3-x1),2) + Math.pow((y3-y1),2));

        console.log("distancia_rotulo_medidor", Math.round(res));
        console.log("distancia_medidor_direccion", Math.round(res2));
        factibilidad.factigisDistRotMed = Math.round(res);
        factibilidad.factigisDistMedDir = Math.round(res2);

        //calcular potencias: solicitada x cantidad
        factibilidad.factigisPotenciaCalculada = factibilidad.factigisPotencia * factibilidad.factigisCantidadEmpalmes;
        //10.8.2018 - SOLO VE
        factibilidad.factigisEstadoTramite = 'EN SOLICITUD';

        //Debido a que es MT , la potencia disponible es 0
        let potenciaDisponible = 0.0;
        //Debido a que es MT, no hay SED, por lo cual es 0
        factibilidad.factigis_Sed='0';
        factibilidad.factigisPotenciaDisponibleSED = potenciaDisponible;
        console.log("tengo fact:",factibilidad.factigisTipoFactibilidad);

        //si el empalme es subterraneo -> factibilidad ASISTIDA
        //2.- empalme subterráneo -> Asistida.
        if(factibilidad.factigisEmpalme=="SUBTERRANEO"){
          factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
        }

        //si la fase es trifásica - > factibilidad ASISTIDA
        //  1.-   trifásicos (no importa si es bt o mt) y > a 18KW  -> Asistida.

        if( (factibilidad.factigisPotencia > 4 ) && (factibilidad.factigisFase=='TRIFASICO')){
          factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
        }

        //26/10/2016 REQ 5: si el tiempo empalme es provisorio y la fase es trifásica => FACTIBILIDAD ASISTIDA.
        if( (factibilidad.factigisFase=="TRIFASICO") && (factibilidad.factigisTiempoEmpalme=="PROVISORIO") ){
          factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
        }

        //06.04.2017: Req: #6 •	Agregar nueva regla a los estudios dentro de la zona de concesión, es decir, a las reglas originales que finalizan en
        //factibilidad directa o asistida agregar la regla de los 50 metros para que el resultado sea asistido.
       
        if(factibilidad.factigisDistRotMed > 30){
          console.log("distancia rotulo medidor > 30", factibilidad.factigisDistRotMed);
          factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
        }

        //Si luego de todos los cambios, la factibilidad sigue siendo DIRECTA, el tipo de mejora también es directa.
        if(factibilidad.factigisTipoFactibilidad=="FACTIBILIDAD DIRECTA"){
          factibilidad.factigisTipoMejora = "FACTIBILIDAD DIRECTA";
          factibilidad.factigisEstadoTramite = 'CERRADA';
        //si es factibilidad asistida, la mejora se debe definir
        }else{
          factibilidad.factigisTipoMejora = "POR DEFINIR";
        }

        //Se agrega el origen de factibilidad:
        factibilidad.factigisOrigen = 'VENTA WEB';
        factibilidad.coci1 = 0;
        factibilidad.coci2 = 0;
        factibilidad.coci3 = 0;

        console.log("Estoy con la siguiente factibilidad en mt",factibilidad.factigisTipoFactibilidad);
        console.log("agregar lo siguiente a arcgis srv", factibilidad);

            agregarFact(factibilidad,(isDone)=>{
              console.log(isDone[0],isDone[1],isDone[2],"valor en agregarFact");
              if(isDone[0]){
                let pasar = [];
                pasar.push(true);
                pasar.push(isDone[1]);
                pasar.push(isDone[2]);

                let usrprfl = cookieHandler.get('usrprfl');
                let empre = cookieHandler.get('empre');
                let historial = {
                  Estado_tramite:  factibilidad.factigisEstadoTramite,
                  ID_Factibilidad: isDone[1],
                  Fecha_cambio: getFormatedDateNow(),
                  Observacion: "ESTADO INICIAL",
                  Usuario:  'VENTA WEB USER DEMO',
                  empresa: empre
                  }
                agregarEstadoHistoria(historial, myhistorialCb =>{
                  console.log("hecho o no el historial",myhistorialCb);

                  //agregar cookie para ventaweb.
                  factibilidad.IDFactibilidad = isDone[1];
                  cookieHandler.set('myttrbts ',factibilidad);

                  return callbackadd(pasar);
                });
              }else{
                console.log("hubo un problema agregando");
              }
            });


  }
}

function agregarEstadoHistoria(historial,callback){

    const data = {
      f: 'json',
      adds: JSON.stringify([{ attributes: historial, geometry: {}}]),
      token: token.read()
    };

    jQuery.ajax({
      method: 'POST',
      url: layers.read_factigis_addEstadoHistoria(),
      dataType:'html',
      data: data
    })

    .done(d =>{
      let json = JSON.parse(d);
      console.log(d);
      console.log(json["addResults"][0].objectId);
      let arrObject = [];
      if(json["addResults"][0].objectId>0){
        return callback(true);

      }else{
        return callback(false);

      }

    })
    .fail(f=>{
      console.log(f,"no pase")
      callback(false)
    });

}

function agregarFact(f, callback){

  let posteFactibilizador;
  let opcionCampamento, opcionConcesion, opcionVialidad, opcionTransmision, opcionRestringida;

  console.log("llega de zonas:", "Camp:", f.factigisZonaCampamentos, "conce: ",f.factigisZonaConcesion,"vial:" ,f.factigisZonaVialidad, "trans:",f.factigisZonaTransmision, "rest",f.factigisZonaRestringida);
  //ESTA EN CAMPAMENTO?
  if(f.factigisZonaCampamentos){
    opcionCampamento = 'NO';
  }else{
    opcionCampamento = 'SI';
  }
  //ESTA EN CONCESION?
  if(f.factigisZonaConcesion){
    opcionConcesion = 'SI';
  }else{
    opcionConcesion = 'NO';
  }
  //ESTA EN VIALIDAD?
  if(f.factigisZonaVialidad){
    opcionVialidad = 'NO';
  }else{
    opcionVialidad = 'SI';
  }
  //ESTA EN TRANSMISION?
  if(f.factigisZonaTransmision){
    opcionTransmision = 'NO';
  }else{
    opcionTransmision = 'SI';
  }
  //ESTA EN RESTRINGIDA?
  if(f.factigisZonaRestringida){
    opcionRestringida = 'NO';
  }else{
    opcionRestringida = 'SI';
  }

  if(f.factigisTipoFactibilidad=='FACTIBILIDAD DIRECTA'){
    posteFactibilizador = f.factigisRotulo;
  }

  //agregar niveles de coci si empalme es BT y sed es diferente a 0
  console.log(f.factigis_Sed,"sed?");
  var sedd = f.factigis_Sed;
  f.coci1 = 0;
  f.coci2 = 0;
  f.coci3 = 0;
  var c1 = 0;
  var c2 = 0;
  var c3 = 0;

  //Hay sed 
  if(sedd>0){
    console.log("buscando nivel de coci");
    var niv = searchNivelesCoci(sedd, f.factigisEmpresa)
    .then(niveles=>{
      if(niveles.length>0){
        c1 =  niveles[0].attributes.Coci1fBT;
        c2 =  niveles[0].attributes.Coci2fBT;
        c3 =  niveles[0].attributes.Coci3fBT;
      }
      console.log(niveles,"tengo niveles de sed", sedd);
      var myAttributes = {
        Rut : f.factigisRut,
        Nombre : f.factigisNombre,
        Apellido : f.factigisApellido,
        Telefono : f.factigisTelefono,
        Email: f.factigisEmail,
        Tipo_cliente : f.factigisTipoCliente,
        Tipo_contribuyente : f.factigisContribuyente,
        Rotulo : f.factigisRotulo,
        Tramo : f.factigisTramo,
        Empalme :  f.factigisEmpalme,
        Fase : f.factigisFase,
        Potencia : f.factigisPotencia,
        Capacidad_empalme : f.capacidadEmpalme,
        Capacidad_interruptor : f.capacidadInterruptor,
        Tiempo_empalme : f.factigisTiempoEmpalme,
        Tipo_empalme: f.factigisTipoEmpalme,
        Cantidad_empalme : f.factigisCantidadEmpalmes,
        ID_Direccion : f.factigisIDDireccion,
        Direccion: f.factigisDireccion,
        Zona_campamentos: opcionCampamento,
        Zona_concesion : opcionConcesion,
        Zona_restringida : opcionRestringida,
        Zona_transmision : opcionTransmision,
        Zona_vialidad : opcionVialidad,
        Potencia_calculada : f.factigisPotenciaCalculada,
        DistRotuloMedidor: f.factigisDistRotMed,
        DistDireccionMedidor : f.factigisDistMedDir,
        Comuna : f.factigisComuna,
        Alimentador: f.factigisAlimentador,
        Idnodo : f.factigisIDNodo,
        Estado_tramite: f.factigisEstadoTramite,
        Tipo_factibilidad: f.factigisTipoFactibilidad,
        Tipo_mejora : f.factigisTipoMejora,
        Zona : f.factigisZona,
        Origen_factibilidad : f.factigisOrigen,
        Sed :f.factigis_Sed,
        PotenciaDispSed :f.factigisPotenciaDisponibleSED,
        Clasificacion: f.factigisClasificacion,
        Poste_cnx_final : posteFactibilizador,
        empresa: f.factigisEmpresa,
        Coci1f: c1,
        Coci2f: c2,
        Coci3f: c3,
        lat: f.factigisLat,
        lon: f.factigisLon
        }
        console.log("agregando...",myAttributes);

        let geox = f.factigisGeoCliente.x;
        let geoy=  f.factigisGeoCliente.y;
       
        const data = {
          f: 'json',
          adds: JSON.stringify([{ "attributes": myAttributes, geometry: {"x":geox , "y": geoy}}]),
          token: token.read()
        };

        jQuery.ajax({
          method: 'POST',
          url: layers.read_factigis_addFactibilidad(),
          dataType:'html',
          data: data
        })
        .done(d =>{
          let json = JSON.parse(d);
          console.log(d);
          let arrObject = [];

          if(json["addResults"][0].objectId>0){
            arrObject.push(true);
            arrObject.push(json["addResults"][0].objectId);
            arrObject.push(myAttributes);
            return callback(arrObject);
          }else{
            arrObject.push(false);
            arrObject.push(json["addResults"][0].objectId);
            arrObject.push([]);
            return callback(arrObject);

          }
        })
        .fail(f=>{
          console.log(f,"no pase")
          callback(false)
        });
      }).catch(error=>{
        console.log(error,"errores buscando niveles de sed");
      })

  } else{
    console.log("no se puede agregar nivel de coci por sed es 0", sedd);
    var myAttributes = {
      Rut : f.factigisRut,
      Nombre : f.factigisNombre,
      Apellido : f.factigisApellido,
      Telefono : f.factigisTelefono,
      Email: f.factigisEmail,
      Tipo_cliente : f.factigisTipoCliente,
      Tipo_contribuyente : f.factigisContribuyente,
      Rotulo : f.factigisRotulo,
      Tramo : f.factigisTramo,
      Empalme :  f.factigisEmpalme,
      Fase : f.factigisFase,
      Potencia : f.factigisPotencia,
      Capacidad_empalme : f.capacidadEmpalme,
      Capacidad_interruptor : f.capacidadInterruptor,
      Tiempo_empalme : f.factigisTiempoEmpalme,
      Tipo_empalme: f.factigisTipoEmpalme,
      Cantidad_empalme : f.factigisCantidadEmpalmes,
      ID_Direccion : f.factigisIDDireccion,
      Direccion: f.factigisDireccion,
      Zona_campamentos: opcionCampamento,
      Zona_concesion : opcionConcesion,
      Zona_restringida : opcionRestringida,
      Zona_transmision : opcionTransmision,
      Zona_vialidad : opcionVialidad,
      Potencia_calculada : f.factigisPotenciaCalculada,
      DistRotuloMedidor: f.factigisDistRotMed,
      DistDireccionMedidor : f.factigisDistMedDir,
      Comuna : f.factigisComuna,
      Alimentador: f.factigisAlimentador,
      Idnodo : f.factigisIDNodo,
      Estado_tramite: f.factigisEstadoTramite,
      Tipo_factibilidad: f.factigisTipoFactibilidad,
      Tipo_mejora : f.factigisTipoMejora,
      Zona : f.factigisZona,
      Origen_factibilidad : f.factigisOrigen,
      Sed :f.factigis_Sed,
      PotenciaDispSed :f.factigisPotenciaDisponibleSED,
      Clasificacion: f.factigisClasificacion,
      Poste_cnx_final : posteFactibilizador,
      empresa: f.factigisEmpresa,
      Coci1f: 0,
      Coci2f: 0,
      Coci3f: 0,
      lat: f.factigisLat,
      lon: f.factigisLon

    }

    console.log("agregando...",myAttributes);

    let geox = f.factigisGeoCliente.x;
    let geoy=  f.factigisGeoCliente.y;
  
    const data = {
      f: 'json',
      adds: JSON.stringify([{ "attributes": myAttributes, geometry: {"x":geox , "y": geoy}}]),
      token: token.read()
    };

    jQuery.ajax({
      method: 'POST',
      url: layers.read_factigis_addFactibilidad(),
      dataType:'html',
      data: data
    })
    .done(d =>{
      let json = JSON.parse(d);
      console.log(d);
      let arrObject = [];

      if(json["addResults"][0].objectId>0){
        arrObject.push(true);
        arrObject.push(json["addResults"][0].objectId);
        arrObject.push(myAttributes);
        return callback(arrObject);
      }else{
        arrObject.push(false);
        arrObject.push(json["addResults"][0].objectId);
        arrObject.push([]);
        return callback(arrObject);

      }
    })
    .fail(f=>{
      console.log(f,"no pase")
      callback(false)
    });
  }
}

function agregarFactEspecial(f, callback){

  let posteFactibilizador;
  let opcionCampamento, opcionConcesion, opcionVialidad, opcionTransmision, opcionRestringida;

  console.log("llega de zonas especial:", "Camp:", f.factigisZonaCampamentos, "conce: ",f.factigisZonaConcesion,"vial:" ,f.factigisZonaVialidad, "trans:",f.factigisZonaTransmision, "rest",f.factigisZonaRestringida);
  //ESTA EN CAMPAMENTO?
  if(f.factigisZonaCampamentos){
    opcionCampamento = 'NO';
  }else{
    opcionCampamento = 'SI';
  }
  //ESTA EN CONCESION?
  if(f.factigisZonaConcesion){
    opcionConcesion = 'SI';
  }else{
    opcionConcesion = 'NO';
  }
  //ESTA EN VIALIDAD?
  if(f.factigisZonaVialidad){
    opcionVialidad = 'NO';
  }else{
    opcionVialidad = 'SI';
  }

  if(f.factigisZonaTransmision){
    opcionTransmision = 'NO';
  }else{
    opcionTransmision = 'SI';
  }
  //CAMBIO NO - SI POR SI - NO (NO DEFINIDO AUN) 02/12/2016
  if(f.factigisZonaRestringida){
    opcionRestringida = 'SI';
  }else{
    opcionRestringida = 'NO';
  }

  if(f.factigisTipoFactibilidad=='FACTIBILIDAD DIRECTA'){
    posteFactibilizador = f.factigisRotulo;
  }

  console.log(f.factigis_Sed,"sed?", f.factigisTipoEmpalme);
  //agregar niveles de coci si empalme es BT y sed es diferente a 0
  var sedd = f.factigis_Sed;
  f.coci1 = 0;
  f.coci2 = 0;
  f.coci3 = 0;

  var c1 = 0;
  var c2 = 0;
  var c3 = 0;

  if(sedd>0){
    console.log("buscando nivel de coci");
    var niv = searchNivelesCoci(sedd, f.factigisEmpresa)
      .then(niveles=>{

        if(niveles.length>0){
          c1 = niveles[0].attributes.Coci1fBT;
          c2 = niveles[0].attributes.Coci2fBT;
          c3 = niveles[0].attributes.Coci3fBT;
        }
        console.log(niveles,"tengo niveles de sed", sedd);
        var myAttributes = {
          Rut : f.factigisRut,
          Nombre : f.factigisNombre,
          Apellido : f.factigisApellido,
          Telefono : f.factigisTelefono,
          Email: f.factigisEmail,
          Tipo_cliente : f.factigisTipoCliente,
          Tipo_contribuyente : f.factigisContribuyente,
          Rotulo : f.factigisRotulo,
          Tramo : f.factigisTramo,
          Empalme :  f.factigisEmpalme,
          Fase : f.factigisFase,
          Potencia : f.factigisPotencia,
          Capacidad_empalme : f.capacidadEmpalme,
          Capacidad_interruptor : f.capacidadInterruptor,
          Tiempo_empalme : f.factigisTiempoEmpalme,
          Tipo_empalme: f.factigisTipoEmpalme,
          Cantidad_empalme : f.factigisCantidadEmpalmes,
          ID_Direccion : f.factigisIDDireccion,
          Direccion: f.factigisDireccion,
          Zona_campamentos: opcionCampamento,
          Zona_concesion : opcionConcesion,
          Zona_restringida : opcionRestringida,
          Zona_transmision : opcionTransmision,
          Zona_vialidad : opcionVialidad,
          Potencia_calculada : f.factigisPotenciaCalculada,
          DistRotuloMedidor: f.factigisDistRotMed,
          DistDireccionMedidor : f.factigisDistMedDir,
          Comuna : f.factigisComuna,
          Alimentador: f.factigisAlimentador,
          Idnodo : f.factigisIDNodo,
          Estado_tramite: f.factigisEstadoTramite,
          Tipo_factibilidad: f.factigisTipoFactibilidad,
          Tipo_mejora : f.factigisTipoMejora,
          Zona : f.factigisZona,
          Origen_factibilidad : f.factigisOrigen,
          Sed :f.factigis_Sed,
          PotenciaDispSed :f.factigisPotenciaDisponibleSED,
          Clasificacion: f.factigisClasificacion,
          Poste_cnx_final : posteFactibilizador,
          empresa: f.factigisEmpresa,
          Coci1f: c1,
          Coci2f: c2,
          Coci3f: c3,
          lat: f.factigisLat,
          lon: f.factigisLon

        }

        console.log("agregando especial...",myAttributes);
      
        let geox = f.factigisGeoCliente.x;
        let geoy=  f.factigisGeoCliente.y;

        const data = {
          f: 'json',
          adds: JSON.stringify([{ "attributes": myAttributes, geometry: {"x":geox , "y": geoy}}]),
          token: token.read()
        };

        jQuery.ajax({
          method: 'POST',
          url: layers.read_factigis_addFactibilidad(),
          dataType:'html',
          data: data
        })
        .done(d =>{
          let json = JSON.parse(d);
          console.log(d);
          let arrObject = [];

          if(json["addResults"][0].objectId>0){
            arrObject.push(true);
            arrObject.push(json["addResults"][0].objectId);
            arrObject.push(myAttributes);
            return callback(arrObject);
          }else{
            arrObject.push(false);
            arrObject.push(json["addResults"][0].objectId);
            arrObject.push([]);
            return callback(arrObject);

          }
        })
        .fail(f=>{
          console.log(f,"no pase")
          callback(false)
        });

      }).catch(error=>{
        console.log(error,"erorres buscando nivel de sed");
      })

  }else{
    console.log("no se puede encontrar nivel ce coci en fact especial");
    var myAttributes = {
      Rut : f.factigisRut,
      Nombre : f.factigisNombre,
      Apellido : f.factigisApellido,
      Telefono : f.factigisTelefono,
      Email: f.factigisEmail,
      Tipo_cliente : f.factigisTipoCliente,
      Tipo_contribuyente : f.factigisContribuyente,
      Rotulo : f.factigisRotulo,
      Tramo : f.factigisTramo,
      Empalme :  f.factigisEmpalme,
      Fase : f.factigisFase,
      Potencia : f.factigisPotencia,
      Capacidad_empalme : f.capacidadEmpalme,
      Capacidad_interruptor : f.capacidadInterruptor,
      Tiempo_empalme : f.factigisTiempoEmpalme,
      Tipo_empalme: f.factigisTipoEmpalme,
      Cantidad_empalme : f.factigisCantidadEmpalmes,
      ID_Direccion : f.factigisIDDireccion,
      Direccion: f.factigisDireccion,
      Zona_campamentos: opcionCampamento,
      Zona_concesion : opcionConcesion,
      Zona_restringida : opcionRestringida,
      Zona_transmision : opcionTransmision,
      Zona_vialidad : opcionVialidad,
      Potencia_calculada : f.factigisPotenciaCalculada,
      DistRotuloMedidor: f.factigisDistRotMed,
      DistDireccionMedidor : f.factigisDistMedDir,
      Comuna : f.factigisComuna,
      Alimentador: f.factigisAlimentador,
      Idnodo : f.factigisIDNodo,
      Estado_tramite: f.factigisEstadoTramite,
      Tipo_factibilidad: f.factigisTipoFactibilidad,
      Tipo_mejora : f.factigisTipoMejora,
      Zona : f.factigisZona,
      Origen_factibilidad : f.factigisOrigen,
      Sed :f.factigis_Sed,
      PotenciaDispSed :f.factigisPotenciaDisponibleSED,
      Clasificacion: f.factigisClasificacion,
      Poste_cnx_final : posteFactibilizador,
      empresa: f.factigisEmpresa,
      Coci1f: 0,
      Coci2f: 0,
      Coci3f: 0,
      lat: f.factigisLat,
      lon: f.factigisLon

    }

    console.log("agregando especial...",myAttributes);
  
    let geox = f.factigisGeoCliente.x;
    let geoy=  f.factigisGeoCliente.y;

    const data = {
      f: 'json',
      adds: JSON.stringify([{ "attributes": myAttributes, geometry: {"x":geox , "y": geoy}}]),
      token: token.read()
    };

    jQuery.ajax({
      method: 'POST',
      url: layers.read_factigis_addFactibilidad(),
      dataType:'html',
      data: data
    })
    .done(d =>{
      let json = JSON.parse(d);
      console.log(d);
      let arrObject = [];

      if(json["addResults"][0].objectId>0){
        arrObject.push(true);
        arrObject.push(json["addResults"][0].objectId);
        arrObject.push(myAttributes);
        return callback(arrObject);
      }else{
        arrObject.push(false);
        arrObject.push(json["addResults"][0].objectId);
        arrObject.push([]);
        return callback(arrObject);

      }
    })
    .fail(f=>{
      console.log(f,"no pase")
      callback(false)
    });

  }


}


function buscarCantClienteSED(sed, callback){
  var empresa_ = cookieHandler.get('empre');
  console.log(sed,"tengo sed en buscarcantclientes")
  var e = '006';

  switch (empresa_) {
    case 'chilquinta':
      e = '006'
    break;
    case 'litoral':
      e = '009'
    break;
    case 'linares':
      e = '031'
    break;
    case 'parral':
      e = '032'
    break;
    case 'casablanca':
      e = '028'
    break;

  }

  var qTaskCC = new esri.tasks.QueryTask(layers.read_layer_nisInfo());
  var qCC = new esri.tasks.Query();

  qCC.where = `ARCGIS.dbo.CLIENTES_DATA_DATOS_${e}.resp_id_sed='${sed}'`;
  qTaskCC.executeForCount(qCC, (featureSet)=>{
    return callback(featureSet);

  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for cantidad clientes");
  });
}

function buscarKVASED(sed, callback){
  var qTaskva = new esri.tasks.QueryTask(layers.read_layer_infoSED());
  var qkva = new esri.tasks.Query();

  qkva.returnGeometry = false;
  qkva.where = "codigo='"+ sed + "'";
  qkva.outFields=["kva"];
  qTaskva.execute(qkva, (featureSet)=>{
    if(!featureSet.features.length){
      console.log("no hay kva para sed");
      return callback([]);
    }
    return callback(featureSet.features[0].attributes.kva);

  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for kva");
  });
}

function factigis_addNuevaFactibilidad_especial(factibilidad, callbackadd){
  console.log(factibilidad,'esto proceso especial');
    //Trae los datos preliminares de la factibilidad.

    var fact = {};
    //Si el empalme es BT, se calcula la distancia entre cliente poste y cliente dirección.
      /* Además se calcula la potencia solicitada.
      *  Se calcula la potencia disponible de la sed.
      */

    //cuando es BT
    if(factibilidad.factigisTipoEmpalme=='BT'){
      getDetailsForPotencia(factibilidad.factigisPotencia, factibilidad.factigisEmpalme, factibilidad.factigisFase,
        (potenciaDetails)=>{
          factibilidad.factigisPotencia = potenciaDetails[0].label;
          factibilidad.capacidadInterruptor = potenciaDetails[0].capacidadInterruptor;
          factibilidad.capacidadEmpalme = potenciaDetails[0].capacidadEmpalme;

          //calcular distancias dir-clie-poste:
          //variables a usar en formula
          let x2 = factibilidad.factigisGeoPoste.x;
          let x1 = factibilidad.factigisGeoCliente.x;
          let y2 = factibilidad.factigisGeoPoste.y;
          let y1 = factibilidad.factigisGeoCliente.y;
          let x3 =factibilidad.factigisGeoDireccion.x;
          let y3 = factibilidad.factigisGeoDireccion.y;

          //21.11.2018: Agregar lon lat del cliente
          factibilidad.factigisLat = factibilidad.factigisGeoCliente.getLatitude();
          factibilidad.factigisLon = factibilidad.factigisGeoCliente.getLongitude();  
               
          //rotulo conexión y medidor (ubicación)
          let res = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
          //medidor (ubicación) y direccion
          let res2 = Math.sqrt(Math.pow((x3-x1),2) + Math.pow((y3-y1),2));
          //asignando valores para ambas distancias
          factibilidad.factigisDistRotMed = Math.round(res);
          factibilidad.factigisDistMedDir = Math.round(res2);

          //calcular potencias: solicitada x cantidad
          factibilidad.factigisPotenciaCalculada = factibilidad.factigisPotencia * factibilidad.factigisCantidadEmpalmes;
          //definir estado de trámite como nuevo
          //10.8.2018: Modificación de estado tramite: 'NUEVA -> EN SOLICITUD' SOLO VE
          factibilidad.factigisEstadoTramite = 'EN SOLICITUD';

          //agregar potencia disponible para SED
          buscarCantClienteSED(factibilidad.factigis_Sed, (cantidadClientes)=>{
            var kva = buscarKVASED(factibilidad.factigis_Sed, (kva)=>{
            //25.06.2019: Modificado factor 5 a 6kWh
            let potenciaDisponible = kva - (0.327 * (Math.pow(cantidadClientes,-0.203))*cantidadClientes*6);
            //asignar potencia disponible para SED
            factibilidad.factigisPotenciaDisponibleSED = potenciaDisponible;

            console.log("tengo la siguiente factibilidad ---- > especial",factibilidad.factigisTipoFactibilidad);
            //Si la potencia disponible es menor a 0 , pasa a ser FACTIBILIDAD ASISTIDA
            if(potenciaDisponible < 0){
              factibilidad.factigisTipoFactibilidad = 'FACTIBILIDAD ASISTIDA';
            }
            //agregar origen de factibilidad:
            factibilidad.factigisOrigen = 'VENTA WEB';

            //si el empalme es subterraneo -> factibilidad ASISTIDA
            //2.- empalme subterráneo -> Asistida.
            if(factibilidad.factigisEmpalme=="SUBTERRANEO"){
              factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
            }
            //26/10/2016 REQ 5: si el tiempo empalme es provisorio y la fase es trifásico => FACTIBILIDAD ASISTIDA.
            if( (factibilidad.factigisFase=="TRIFASICO") && (factibilidad.factigisTiempoEmpalme=="PROVISORIO") ){
              factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
            }

            //si la fase es trifásica - > factibilidad ASISTIDA
            //  1.-   trifásicos (no importa si es bt o mt) y > a 18KW  -> Asistida.
            if( (factibilidad.factigisPotencia > 4 ) && (factibilidad.factigisFase=='TRIFASICO')){
              factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
            }
            factibilidad.factigisTipoMejora = "POR DEFINIR";
            if ( (factibilidad.factigisTramo!='N/A')  && (factibilidad.factigisDistRotMed<30)  && (factibilidad.factigisPropiedadPoste=='Empresa') ){
              console.log(factibilidad.factigisTramo)
              //agregar a rest srv
              console.log("Estoy con la siguiente factibilidad en bt (especial)",factibilidad.factigisTipoFactibilidad);
              console.log("agregar lo siguiente a arcgis srv", factibilidad);

              agregarFactEspecial(factibilidad,(isDone)=>{
                console.log(isDone[0],"valor en agregarFact");
                if(isDone[0]){
                  console.log("pase ok, devolviendo a callbackadd");
                  let pasar = [];
                  pasar.push(true);
                  pasar.push(isDone[1])
                  pasar.push(isDone[2]);

                  let usrprfl = cookieHandler.get('usrprfl');
                  let empre = cookieHandler.get('empre');
                  let historial = {
                    Estado_tramite:  factibilidad.factigisEstadoTramite,
                    ID_Factibilidad: isDone[1],
                    Fecha_cambio: getFormatedDateNow(),
                    Observacion: "ESTADO INICIAL",
                    Usuario:  'REACT VENTA EMPALMES WEB USER',
                    empresa: empre
                  }
                  
                  agregarEstadoHistoria(historial, myhistorialCb =>{
                    console.log("hecho o no el historial",myhistorialCb);
                    return callbackadd(pasar);
                  });
                }else{
                  console.log("hubo un problema agregando");
                }
              });
            } else{
                //No cumple algun parámetro.
                console.log("no cumple con alguno de estos requisitos:", factibilidad.factigisTramo, factibilidad.factigisDistRotMed,factibilidad.factigisPropiedadPoste);
                let pasar = [];
                pasar.push(false);
                pasar.push(["No cumple con algún parámetro de: tramo (diferente de N/A): "+ factibilidad.factigisTramo + ", distancia rotulo medidor (<30 mts) :" + factibilidad.factigisDistRotMed + " o propiedad del poste (empresa): " + factibilidad.factigisPropiedadPoste]);
                pasar.push([]);
                return callbackadd(pasar);
            }
          });
        });
      });
    }//Si el empalme es MT, VERLO PROYECTOS Y SERVICIOS COMERCIALES
    else{
      console.log("Solicitudes en MT deben atenderse en Proyectos y Servicios Comerciales");
      let pasar = [];
      pasar.push(false);
      pasar.push(["Solicitudes en MT deben atenderse en Proyectos y Servicios Comerciales"]);
      pasar.push([]);
      return callbackadd(pasar);
      /*
      //cuando es MT
        factibilidad.capacidadInterruptor = 0;
        factibilidad.capacidadEmpalme = 0;

        //calcular distancias dir-clie-poste:
          //variables a usar en formula
            let x2 = factibilidad.factigisGeoPoste.x;
            let x1 = factibilidad.factigisGeoCliente.x;
            let y2 = factibilidad.factigisGeoPoste.y;
            let y1 = factibilidad.factigisGeoCliente.y;
            let x3 =factibilidad.factigisGeoDireccion.x;
            let y3 = factibilidad.factigisGeoDireccion.y;
          //rotulo conexión y medidor (ubicación)
            let res = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
          //medidor (ubicación) y direccion
            let res2 = Math.sqrt(Math.pow((x3-x1),2) + Math.pow((y3-y1),2));

            console.log("distancia_rotulo_medidor", Math.round(res));
            console.log("distancia_medidor_direccion", Math.round(res2));
            factibilidad.factigisDistRotMed = Math.round(res);
            factibilidad.factigisDistMedDir = Math.round(res2);

          //calcular potencias: solicitada x cantidad
            factibilidad.factigisPotenciaCalculada = factibilidad.factigisPotencia * factibilidad.factigisCantidadEmpalmes;
            factibilidad.factigisEstadoTramite = 'NUEVA';

          //Debido a que es MT , la potencia disponible es 0
            let potenciaDisponible = 0.0;
          //Debido a que es MT, no hay SED, por lo cual es 0
            factibilidad.factigis_Sed='0';
            factibilidad.factigisPotenciaDisponibleSED = potenciaDisponible;
            console.log("tengo fact:",factibilidad.factigisTipoFactibilidad);

          //si el empalme es subterraneo -> factibilidad ASISTIDA
           //2.- empalme subterráneo -> Asistida.
           if(factibilidad.factigisEmpalme=="SUBTERRANEO"){
             factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
           }

          //si la fase es trifásica - > factibilidad ASISTIDA
          //  1.-   trifásicos (no importa si es bt o mt) y > a 18KW  -> Asistida.

           if( (factibilidad.factigisPotencia > 4 ) && (factibilidad.factigisFase=='TRIFASICO')){

             factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
           }
           //26/10/2016 REQ 5: si el tiempo empalme es provisorio y la fase es trifásica => FACTIBILIDAD ASISTIDA.
           if( (factibilidad.factigisFase=="TRIFASICO") && (factibilidad.factigisTiempoEmpalme=="PROVISORIO") ){
              factibilidad.factigisTipoFactibilidad = "FACTIBILIDAD ASISTIDA";
           }

          //Si luego de todos los cambios, la factibilidad sigue siendo DIRECTA, el tipo de mejora también es directa.
            if(factibilidad.factigisTipoFactibilidad=="FACTIBILIDAD DIRECTA"){
              factibilidad.factigisTipoMejora = "FACTIBILIDAD DIRECTA";
              factibilidad.factigisEstadoTramite = 'CERRADA';
          //si es factibilidad asistida, la mejora se debe definir
            }else{
              factibilidad.factigisTipoMejora = "POR DEFINIR";
            }

          //Se agrega el origen de factibilidad:
            factibilidad.factigisOrigen = 'OFICINA COMERCIAL';


            console.log("Estoy con la siguiente factibilidad en mt",factibilidad.factigisTipoFactibilidad);

            if ( (factibilidad.factigisTramo!='N/A')  && (factibilidad.factigisDistRotMed<30)  && (factibilidad.factigisPropiedadPoste=='Empresa') ){
              console.log(factibilidad.factigisTramo);
              console.log("agregar lo siguiente a arcgis srv", factibilidad);

                agregarFact(factibilidad,(isDone)=>{
                  console.log(isDone[0],"valor en agregarFact");
                    if(isDone[0]){
                      let pasar = [];
                      pasar.push(true);
                      pasar.push(isDone[1]);
                      pasar.push(isDone[2]);
                      let usrprfl = cookieHandler.get('usrprfl');
                      let historial = {
                        Estado_tramite:  factibilidad.factigisEstadoTramite,
                        ID_Factibilidad: isDone[1],
                        Fecha_cambio: getFormatedDateNow(),
                        Observacion: "ESTADO INICIAL",
                        Usuario:  usrprfl.USUARIO
                      }
                      agregarEstadoHistoria(historial, myhistorialCb =>{
                        console.log("hecho o no el historial",myhistorialCb);
                          return callbackadd(pasar);
                      });
                    }else{
                      console.log("hubo un problema agregando");
                    }
                });

            }else{
              //No cumple algun parámetro.
              console.log("no cumple con alguno de estos:", factibilidad.factigisTramo, factibilidad.factigisDistRotMed,factibilidad.factigisPropiedadPoste);
              let pasar = [];
              pasar.push(false);
              pasar.push(["No cumple con algún parámetro de: tramo (diferente de N/A): "+ factibilidad.factigisTramo + ", distancia rotulo medidor (<30 mts) :" + factibilidad.factigisDistRotMed + " o propiedad del poste (empresa): " + factibilidad.factigisPropiedadPoste]);
              pasar.push([]);
              return callbackadd(pasar);
            }

*/
    }
}

export {factigis_addNuevaDireccion,factigis_addNuevaFactibilidad, agregarEstadoHistoria, factigis_addNuevaFactibilidad_especial};
