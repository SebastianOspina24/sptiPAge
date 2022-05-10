let arreglo = [];
function parseHtml(html) {
  var t = document.createElement("template");
  t.innerHTML = html;
  return t.content;
}

class Tran {
  constructor(origen, destino, valor, tipo) {
    this.origen = origen;
    this.destino = destino;
    this.valor = valor;
    this.tipo = tipo;
  }
}

function changeForm() {
  var destino = document.getElementById("destino");
  var tran = parseHtml(
    '<select id="selectedTransaction" name="Operacion" class="formtransaction">' +
      "<option hidden selected>       Destinos disponibles    </option>" +
      '<option id="Nicolas" value="Nicolas">Nicolas</option>' +
      '<option id="Juan Carlos" value="Juan Carlos">Juan Carlos</option>' +
      '<option id="Sebastian" value="Sebastian">Sebastian</option>  </select>'
  );
  while (destino.firstChild) {
    destino.removeChild(destino.firstChild);
  }
  var value = document.getElementById("selectTransaction").value;
  var origen = document.getElementById("origentran").value;
  if (value == "Transferencia") {
    destino.append(tran);
    document.getElementById(origen).remove();
  }
}

async function agregarTransaccion() {
  var transact = new Tran(
    document.getElementById("origentran").value,
    destination(),
    document.getElementById("cash").value,
    document.getElementById("selectTransaction").value
  );
  var r = await generateHash(Date.now() + JSON.stringify(transact));
  var transaWid = {
    id: r,
    transaction: transact,
  };
  arreglo.push(transaWid);
  if (arreglo.length == 3) {
    console.log(arreglo);
    $.ajax({
      type: "POST",
      url: "http://localhost:3001/mineBlock",
      data: JSON.stringify({ data: arreglo }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
    });
    arreglo = [];
  }
}

async function generateHash(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

function destination() {
  var destino = document.getElementById("destino");
  var res = "Bank";
  if (destino.firstChild) {
    res = document.getElementById("selectedTransaction").value;
  }
  return res;
}
