var HOJAS = ['clientes','extintores','recolecciones','entregas','laboratorio',
             'visitas','prestamos','alertas','materiales','auditoria','usuarios','ubicaciones'];

function testInicializar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var i = 0; i < HOJAS.length; i++) {
    if (!ss.getSheetByName(HOJAS[i])) {
      ss.insertSheet(HOJAS[i]);
    }
  }
  Logger.log('Hojas creadas correctamente');
}

// Llamado desde el cliente via google.script.run
function guardarDesdeCliente(tabla, dataJson, accion) {
  var data = JSON.parse(dataJson);
  return procesarRegistro(tabla, data, accion);
}

// Sirve la página web del CRM
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Safety CRM')
    .addMetaTag('viewport','width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// También acepta POST para compatibilidad
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var resultado = procesarRegistro(body.tabla, body.data, body.accion || 'insert');
    return jsonResponse(resultado);
  } catch(err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function procesarRegistro(tabla, registro, accion) {
  if (!tabla || !registro) return { ok: false, error: 'Faltan parametros' };

  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(tabla);
  if (!hoja) { hoja = ss.insertSheet(tabla); }

  if (accion === 'delete') {
    return eliminarFila(hoja, registro.id);
  }

  var keys = Object.keys(registro);
  if (hoja.getLastRow() === 0) { hoja.appendRow(keys); }

  var lastCol = Math.max(hoja.getLastColumn(), 1);
  var headers = hoja.getRange(1, 1, 1, lastCol).getValues()[0];

  for (var k = 0; k < keys.length; k++) {
    if (headers.indexOf(keys[k]) < 0) {
      hoja.getRange(1, hoja.getLastColumn() + 1).setValue(keys[k]);
      headers.push(keys[k]);
    }
  }

  var filaExistente = buscarFila(hoja, headers, registro.id);

  var fila = [];
  for (var h = 0; h < headers.length; h++) {
    var val = registro[headers[h]];
    if (val === null || val === undefined) { fila.push(''); }
    else if (typeof val === 'object') { fila.push(JSON.stringify(val)); }
    else { fila.push(String(val)); }
  }

  if (filaExistente > 0) {
    hoja.getRange(filaExistente, 1, 1, fila.length).setValues([fila]);
    return { ok: true, accion: 'updated', id: registro.id };
  } else {
    hoja.appendRow(fila);
    return { ok: true, accion: 'inserted', id: registro.id };
  }
}

function buscarFila(hoja, headers, id) {
  if (!id || hoja.getLastRow() < 2) return -1;
  var idCol = headers.indexOf('id');
  if (idCol < 0) return -1;
  var ids = hoja.getRange(2, idCol + 1, hoja.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function eliminarFila(hoja, id) {
  if (!id || hoja.getLastRow() < 2) return { ok: true };
  var headers = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  var fila = buscarFila(hoja, headers, id);
  if (fila > 0) { hoja.deleteRow(fila); }
  return { ok: true, accion: 'deleted', id: id };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
