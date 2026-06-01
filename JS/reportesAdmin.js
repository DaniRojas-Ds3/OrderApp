/* =========================================================
   REPORTES ADMIN
   ---------------------------------------------------------
   Responsabilidad:
   - Descargar reporte reservas
   - Descargar reporte PQRS
========================================================= */
import {
  mostrarAlerta
} from "./alerts.js";
/* =========================================================
   INICIALIZAR REPORTES
========================================================= */

export function initReportesAdmin() {

  const btnReservas =
    document.getElementById(
      "btnDescargarReservas"
    );

  const btnPQRS =
    document.getElementById(
      "btnDescargarPQRS"
    );



  /* =====================================================
     REPORTE RESERVAS
  ===================================================== */

  btnReservas?.addEventListener(
    "click",
    descargarReporteReservas
  );



  /* =====================================================
     REPORTE PQRS
  ===================================================== */

  btnPQRS?.addEventListener(
    "click",
    descargarReportePQRS
  );

}


/* =========================================================
   DESCARGAR REPORTE RESERVAS
========================================================= */
function descargarPDFReservas(
  titulo,
  reservas,
  fechaReporte
){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    unit: "pt",
    format: "letter"
  });

  let y = 40;

  function checkPageLimit() {
    if (y >= 750) {
      doc.addPage();
      y = 40;
    }
  }

  // ================= ENCABEZADO =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(titulo, 40, y);

  y += 30;

  const fecha = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  doc.setFontSize(12);

doc.text(
  `Fecha del reporte: ${fechaReporte}`,
  40,
  y
);

  y += 30;

  // ================= TOTAL GENERAL =================
  const totalGeneral = {};

  reservas.forEach(r => {
    if (!totalGeneral[r.producto]) totalGeneral[r.producto] = 0;
    totalGeneral[r.producto] += r.cantidad;
  });

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL GENERAL DE PRODUCTOS:", 40, y);
  y += 20;

  doc.setFont("helvetica", "normal");

  for (const [producto, cantidad] of Object.entries(totalGeneral)) {
    checkPageLimit();
    doc.text(`• ${cantidad} ${producto}`, 50, y);
    y += 16;
  }

  y += 20;

  // ================= AGRUPAR POR JORNADA =================
  const ordenJornadas = [
    "Jornada Externa",
    "Mañana",
    "Tarde",
    "Noche"
  ];

  const jornadas = {};

  reservas.forEach(r => {
    if (!jornadas[r.jornada]) jornadas[r.jornada] = [];
    jornadas[r.jornada].push(r);
  });

  for (const jornada of ordenJornadas) {

    if (!jornadas[jornada]) continue;

    checkPageLimit();

    doc.setFont("helvetica", "bold");
    doc.text(`Jornada: ${jornada}`, 40, y);

    y += 20;

    doc.setFont("helvetica", "normal");

    const productos = {};

    jornadas[jornada].forEach(r => {
      if (!productos[r.producto]) productos[r.producto] = 0;
      productos[r.producto] += r.cantidad;
    });

    for (const [prod, cant] of Object.entries(productos)) {
      checkPageLimit();
      doc.text(`• ${cant} ${prod}`, 50, y);
      y += 16;
    }

    y += 20;

    // usuarios
    const usuarios = {};

    jornadas[jornada].forEach(r => {
      if (!usuarios[r.usuario]) usuarios[r.usuario] = {};
      if (!usuarios[r.usuario][r.producto]) usuarios[r.usuario][r.producto] = 0;
      usuarios[r.usuario][r.producto] += r.cantidad;
    });

    for (const [usuario, pedidos] of Object.entries(usuarios)) {

      checkPageLimit();
      doc.text(`- ${usuario}:`, 40, y);
      y += 16;

      for (const [prod, cant] of Object.entries(pedidos)) {
        checkPageLimit();
        doc.text(`  • ${cant} ${prod}`, 55, y);
        y += 14;
      }

      y += 10;
    }
  }

  const nombreArchivo =
  `reporte_reservas_${fechaReporte.replaceAll("/", "-")}.pdf`;

doc.save(nombreArchivo);
}
/* =========================================================
   DESCARGAR REPORTE PQRS
========================================================= */
function descargarPDFPQRS(
  pqrsArray,
  mesBonito,
  nombreArchivo
) {

  const { jsPDF } =
    window.jspdf;

  const doc =
    new jsPDF({
      unit: "pt",
      format: "letter"
    });

  let y = 40;


  /* =====================================================
     CONTROL PÁGINAS
  ===================================================== */

  function checkPageLimit() {

    if (y >= 750) {

      doc.addPage();

      y = 40;

    }

  }


  /* =====================================================
     ENCABEZADO
  ===================================================== */

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(20);

  doc.text(
    `REPORTES PQRS: ${mesBonito}`,
    40,
    y
  );

  y += 40;


  /* =====================================================
     MENSAJES
  ===================================================== */

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(12);

  pqrsArray.forEach(pqrs => {

    checkPageLimit();

    doc.text(
      "----------------------------------------",
      40,
      y
    );

    y += 25;


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Mensaje:",
      40,
      y
    );

    y += 20;


    doc.setFont(
      "helvetica",
      "normal"
    );

    const mensaje =
      doc.splitTextToSize(
        pqrs.mensaje,
        500
      );

    doc.text(
      mensaje,
      40,
      y
    );

    y +=
      mensaje.length * 18;


    y += 25;

  });


  /* =====================================================
     DESCARGAR
  ===================================================== */
doc.save(nombreArchivo);
}

/* =========================================================
   DESCARGAR REPORTE PQRS
========================================================= */

async function descargarReportePQRS() {

  const mesInput =
    document.getElementById(
      "mesReportePQRS"
    );


  const mesSeleccionado =
    mesInput.value;


  /* ================= VALIDAR ================= */

  if (!mesSeleccionado) {

    mostrarAlerta(
      "Selecciona un mes"
    );

    return;

  }


  try {

    /* =====================================================
       CONSULTAR FIREBASE
    ===================================================== */

    const snapshot =
      await db
        .collection("pqrs")
        .get();


    /* ================= SIN DATOS ================= */

    if (snapshot.empty) {

      mostrarAlerta(
        "No hay PQRS registradas",
        "error"
      );

      return;

    }


    /* =====================================================
       FILTRAR POR MES
    ===================================================== */

    const resultados = [];


    snapshot.forEach(doc => {

      const pqrs =
        doc.data();

      if (!pqrs.fecha) {
        return;
      }


      const fechaTexto =
        pqrs.fecha;

      const partes =
        fechaTexto.split(",");

      const fecha =
        partes[0];

      const fechaSeparada =
        fecha.split("/");


      const mes =
        fechaSeparada[1]
        .padStart(2, "0");

      const anio =
        fechaSeparada[2];


      const formatoMes =
        `${anio}-${mes}`;


      if (
        formatoMes ===
        mesSeleccionado
      ) {

        resultados.push(pqrs);

      }

    });


    /* ================= VALIDAR ================= */

    if (resultados.length === 0) {

      mostrarAlerta(
        "No hay PQRS este mes",
        "error"
      );

      return;

    }


    /* =====================================================
       FECHA BONITA
    ===================================================== */

    const partesMes =
      mesSeleccionado.split("-");

    const anio =
      partesMes[0];

    const mes =
      Number(partesMes[1]);


    const fechaMes =
      new Date(
        anio,
        mes - 1
      );


    const mesBonito =
      fechaMes.toLocaleDateString(
        "es-CO",
        {
          month: "long",
          year: "numeric"
        }
      );


    /* =====================================================
       NOMBRE ARCHIVO
    ===================================================== */

    const nombreArchivo =
      `reporte_pqrs_${mesBonito.replaceAll(" ", "_")}.pdf`;


    /* =====================================================
       GENERAR PDF
    ===================================================== */

    descargarPDFPQRS(
      resultados,
      mesBonito,
      nombreArchivo
    );


    mesInput.value = "";


    mostrarAlerta(
      "Reporte descargado correctamente",
      "exito"
    );

  } catch (error) {

    console.error(
      "Error reporte PQRS:",
      error
    );

  }

}




async function descargarReporteReservas() {

  const fechaInput =
    document.getElementById(
      "fechaReporteReservas"
    );

  const fechaSeleccionada =
    fechaInput.value;

  if (!fechaSeleccionada) {

    mostrarAlerta(
      "Selecciona una fecha"
    );

    return;
  }

  try {

    const partes =
      fechaSeleccionada.split("-");

    const dia =
      Number(partes[2]);

    const mes =
      Number(partes[1]);

    const anio =
      partes[0];

    const fechaBuscada =
      `${dia}/${mes}/${anio}`;
      const fechaBonita =
  new Date(
    anio,
    mes - 1,
    dia
  ).toLocaleDateString(
    "es-CO",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

    const snapshot =
      await db
        .collection("reservas")
        .where(
          "fecha",
          "==",
          fechaBuscada
        )
        .get();

    if (snapshot.empty) {

      mostrarAlerta(
        "No hay reservas para esa fecha",
        "error"
      );

      return;
    }

    const reservas = [];

    snapshot.forEach(doc => {
      reservas.push(doc.data());
    });

    descargarPDFReservas(
  "RESUMEN DE RESERVAS",
  reservas,
  fechaBonita
);

    fechaInput.value = "";

    mostrarAlerta(
      "Reporte descargado correctamente",
      "exito"
    );

  } catch (error) {

    console.error(
      "Error reporte reservas:",
      error
    );

  }

}