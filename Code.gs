// ================================================
// SAFETY CRM - BACKEND GOOGLE APPS SCRIPT
// Este script recibe datos del CRM y los guarda
// en Google Sheets automaticamente
// ================================================

var HOJAS = ['clientes','extintores','recolecciones','entregas',
             'laboratorio','visitas','prestamos','alertas',
             'materiales','auditoria','usuarios','ubicaciones'];

// Ejecuta esto primero para crear las hojas
function testInicializar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var i = 0; i < HOJAS.length; i++) {
    if (!ss.getSheetByName(HOJAS[i])) {
      ss.insertSheet(HOJAS[i]);
      Logger.log('Creada: ' + HOJAS[i]);
    }
  }
  Logger.log('LISTO - todas las hojas creadas');
}

// Recibe datos del CRM via POST
function doPost(e) {
  var resultado;
  try {
    var body = JSON.parse(e.postData.contents);
    resultado = guardarDatos(body.tabla, body.data, body.accion);
  } catch(err) {
    resultado = { ok: false, error: err.toString() };
  }

  // CORS headers para permitir GitHub Pages
  var output = ContentService.createTextOutput(JSON.stringify(resultado));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// Recibe datos via GET (para pruebas y JSONP)
function doGet(e) {
  var resultado;
  try {
    // Prueba simple
    if (!e.parameter.tabla && !e.parameter.payload) {
      resultado = { ok: true, mensaje: 'Safety CRM Backend funcionando correctamente' };
    }
    // Leer tabla
    else if (e.parameter.tabla && !e.parameter.payload) {
      var datos = leerTabla(e.parameter.tabla);
      resultado = { ok: true, tabla: e.parameter.tabla, data: datos };
    }
    // Guardar via GET (metodo alternativo)
    else if (e.parameter.payload) {
      var body = JSON.parse(e.parameter.payload);
      resultado = guardarDatos(body.tabla, body.data, body.accion || 'insert');
    }
  } catch(err) {
    resultado = { ok: false, error: err.toString() };
  }

  // Soporte JSONP
  var cb = e.parameter.callback;
  var texto = cb ? cb + '(' + JSON.stringify(resultado) + ')' : JSON.stringify(resultado);
  var tipo = cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  return ContentService.createTextOutput(texto).setMimeType(tipo);
}

// Guarda o actualiza un registro en la hoja
function guardarDatos(tabla, registro, accion) {
  if (!tabla || !registro) {
    return { ok: false, error: 'Faltan parametros tabla o data' };
  }

  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(tabla);
  if (!hoja) {
    hoja = ss.insertSheet(tabla);
  }

  // Eliminar registro
  if (accion === 'delete') {
    return eliminarFila(hoja, registro.id);
  }

  var keys = Object.keys(registro);

  // Si la hoja esta vacia, crear encabezados
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(keys);
  }

  // Leer encabezados actuales
  var lastCol = hoja.getLastColumn();
  if (lastCol === 0) lastCol = 1;
  var headers = hoja.getRange(1, 1, 1, lastCol).getValues()[0];

  // Agregar columnas nuevas si el registro tiene campos nuevos
  for (var k = 0; k < keys.length; k++) {
    if (headers.indexOf(keys[k]) < 0) {
      var nuevaCol = hoja.getLastColumn() + 1;
      hoja.getRange(1, nuevaCol).setValue(keys[k]);
      headers.push(keys[k]);
    }
  }

  // Buscar si ya existe este registro por ID
  var filaExistente = buscarFila(hoja, headers, registro.id);

  // Construir la fila de datos
  var fila = [];
  for (var h = 0; h < headers.length; h++) {
    var val = registro[headers[h]];
    if (val === null || val === undefined) {
      fila.push('');
    } else if (typeof val === 'object') {
      fila.push(JSON.stringify(val));
    } else {
      fila.push(String(val));
    }
  }

  // Insertar o actualizar
  if (filaExistente > 0) {
    hoja.getRange(filaExistente, 1, 1, fila.length).setValues([fila]);
    return { ok: true, accion: 'updated', tabla: tabla, id: registro.id };
  } else {
    hoja.appendRow(fila);
    return { ok: true, accion: 'inserted', tabla: tabla, id: registro.id };
  }
}

// Busca una fila por el valor del campo "id"
function buscarFila(hoja, headers, id) {
  if (!id || hoja.getLastRow() < 2) return -1;
  var idCol = headers.indexOf('id');
  if (idCol < 0) return -1;

  var numFilas = hoja.getLastRow() - 1;
  var ids = hoja.getRange(2, idCol + 1, numFilas, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

// Elimina una fila por ID
function eliminarFila(hoja, id) {
  if (!id || hoja.getLastRow() < 2) return { ok: true, accion: 'delete' };
  var headers = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  var fila = buscarFila(hoja, headers, id);
  if (fila > 0) {
    hoja.deleteRow(fila);
    return { ok: true, accion: 'deleted', id: id };
  }
  return { ok: true, accion: 'not_found', id: id };
}

// Lee todos los datos de una tabla
function leerTabla(tabla) {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(tabla);
  if (!hoja || hoja.getLastRow() < 2) return [];

  var headers = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  var numFilas = hoja.getLastRow() - 1;
  var rows = hoja.getRange(2, 1, numFilas, hoja.getLastColumn()).getValues();
  var data = [];

  for (var i = 0; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = rows[i][j];
      if (typeof val === 'string' && val.length > 1 &&
          (val.charAt(0) === '{' || val.charAt(0) === '[')) {
        try { val = JSON.parse(val); } catch(ex) {}
      }
      obj[headers[j]] = val;
    }
    data.push(obj);
  }
  return data;
}
