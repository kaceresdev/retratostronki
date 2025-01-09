const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const functions = require("firebase-functions");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = 8443;

app.use(bodyParser.json());
app.use(cors());

// *-* CONFIGURACIONES NECESARIAS PARA LA API DE GOOGLE DRIVE *-*
// Ruta al archivo JSON de la cuenta de servicio
const KEYFILEPATH = "retratostronkiweb-11e1b5b9d453.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

// Autenticación con la cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });
// *-* FIN CONFIGURACIONES DE API DE GOOGLE DRIVE *-*

// *** Endpoint para enviar correo de contacto ***
app.post("/send-email", (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "retratostronkiweb@gmail.com",
      pass: "zfcg wesv eyrb brvs",
    },
  });

  const mailOptions = {
    from: email,
    to: "retratostronkiweb@gmail.com",
    subject: subject,
    text: `
      Contacto: ${email}
      Mensaje: ${message}    
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

// *** Endpoint para obtener la estructura de archivos del Google Drive ***
app.get("/list-folders", async (req, res) => {
  try {
    const resp = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder'", // Solo carpetas en My Drive
      fields: "files(id, name, description, parents)", // Obtén el id, nombre, descripción y carpetas padre
      spaces: "drive", // Define el espacio como 'drive'
    });

    const folders = resp.data.files;

    // Separar carpetas en principales (sin padres) y secundarias (con padres)
    const principalFolders = folders.filter((folder) => !folder.parents);
    const secondaryFolders = folders.filter((folder) => folder.parents);

    // Calcular y asignar la profundidad a cada carpeta secundaria
    secondaryFolders.forEach((folder) => {
      folder.level = calculateLevel(folder, folders);
    });

    // Ordenar carpetas secundarias por profundidad
    secondaryFolders.sort((a, b) => a.level - b.level);

    // Agregar carpetas secundarias a sus respectivos padres (padres principales e hijos de padres)
    secondaryFolders.forEach((folder) => {
      if (!addChild(principalFolders, folder)) {
        console.log(`No se encontró padre para la carpeta: ${folder.name}`);
      }
    });

    res.status(200).json({ folders: principalFolders });
  } catch (error) {
    res.status(500).send(error);
  }
});

// *** Endpoint para obtener las imágenes de una carpeta de Google Drive ***
app.get("/:folderId/files", async (req, res) => {
  const folderId = req.params.folderId; // ID de tu carpeta en Google Drive
  const pageToken = req.query.pageToken; // Si hay mas páginas, token de la siguiente página
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: "nextPageToken, files(id, name, mimeType, webContentLink, thumbnailLink)",
      // pageSize: 10, // Comentado: Sin limite de resultados, no habrá pageToken entonces
      pageToken: pageToken, // Usar el pageToken si está presente
    });
    res.status(200).json({
      files: response.data.files,
      nextPageToken: response.data.nextPageToken,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// *** Proxy para renderizar las imágenes de Google Drive ***
// No metemos headers de cacheo porque google ya devuelve cacheo de un día
app.use(
  "/proxy-drive",
  createProxyMiddleware({
    target: "https://lh3.googleusercontent.com/drive-storage",
    changeOrigin: true,
    pathRewrite: {
      "^/proxy-drive": "",
    },
    onProxyRes: function (proxyRes, req, res) {
      // Opción para ajustar encabezados si es necesario
    },
  })
);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});

/**
 * Función para encontrar la carpeta padre y agregar el hijo
 * @param {*} folders
 * @param {*} child
 * @returns
 */
function addChild(folders, child) {
  for (let folder of folders) {
    if (folder.id === child.parents[0]) {
      if (!folder.childs) {
        folder.childs = [];
      }
      folder.childs.push({ id: child.id, name: child.name, description: child.description });
      return true;
    }
    if (folder.childs && addChild(folder.childs, child)) {
      return true;
    }
  }
  return false;
}

/**
 * Función para calcular la profundidad de una carpeta
 * @param {*} folder
 * @param {*} allFolders
 * @returns
 */
function calculateLevel(folder, allFolders) {
  let level = 0;
  let actual = folder;
  while (actual.parents && actual.parents.length > 0) {
    level++;
    actual = allFolders.find((c) => c.id === actual.parents[0]);
    if (!actual) break; // Por si acaso no encontramos el padre
  }
  return level;
}

exports.app = functions.https.onRequest(app);
