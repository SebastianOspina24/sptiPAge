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
    fetch("http://localhost:3001/mineBlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: arreglo }),
    }).then((data) => {
      arreglo = [];
      agregarBloque();
    });
  }
}

function agregarBloque() {
  var destino = document.getElementById("blockChain");
  while (destino.firstChild) {
    destino.removeChild(destino.firstChild);
  }
  fetch("http://localhost:3001/blocks")
    .then((data) => data.json())
    .then((data) => {
      data.forEach(function (i) {
        destino.appendChild(crearbloque(i));
      });
    });
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

function crearbloque(data) {
  var blo = parseHtml(
    '<div class="bloque">' +
      "<h3>HASH: <p>" +
      data.hash +
      "</p></h3>" +
      " <h5>TIME: " +
      data.timestamp +
      "</h5>" +
      creartransaccion(data.data) +
      "<h3>PREVHASH:  <p>" +
      data.previousHash +
      "</p></h3>" +
      "</div>"
  );
  return blo;
}
function creartransaccion(data) {
  var strin = "";
  if (data == "my genesis block!!") {
    strin = '<div class="transa genesis"><h3>Genesis</h3></div>';
  } else {
    for (i = 0; i < data.length; i++) {
      var res = constructorTransa(i + 1, data[i]);
      strin += res;
    }
  }
  return strin;
}
function constructorTransa(i, data) {
  return (
    '<div class="transa transa' +
    i +
    '">' +
    "<div>Hash: <p>" +
    data.id +
    "</p></div>" +
    "<div>Transaccion: " +
    data.transaction.tipo +
    "</div>" +
    " <div>Origen: " +
    data.transaction.origen +
    "</div>" +
    "<div>Destino: " +
    data.transaction.destino +
    "</div></div>"
  );
}
