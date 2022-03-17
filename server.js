const express = require('express')
const nunjucks = require('nunjucks')
const fs = require('fs').promises

//1. Integrar express-fileupload a Express.

const expressFileUpload = require('express-fileupload')

const app = express()

//  carpetas  estáticas
app.use(express.static('static'))

// configuramos la subida de archivos
app.use(expressFileUpload({
    limits: { fileSize: 5242880 },  // 2. Definir que el límite para la carga de imágenes es de 5MB.
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo supera el máximo (5Mb)'  //3. Responder con un mensaje indicando que se sobrepasó el límite especificado.
}))


// configuramos el motor de templates (nunjucks)
nunjucks.configure('templates', {
    express: app,
    autoescape: true,
    watch: true
})

// 4. Crear una ruta POST /imagen que reciba y almacene una imagen en una carpeta
// pública del servidor. Considerar que el formulario envía un payload con una
// propiedad “position”, que indica la posición del collage donde se deberá mostrar la
// imagen.

app.post('/imagen', async (req, res) => {

    const posicionimagen = req.body.posicion
    const fileimagen = req.files.target_file
//    const extension = imagen.name-split('.').slice(-1).pop().toLowerCase()
//    console.log(extension);


    await fileimagen.mv(`static/imgs/imagen-${posicionimagen}.jpg`)
    res.render('collage.html');
});

app.get('/deleteImg/:nombre', async (req, res) => {
    const fileimagen = req.params.nombre;
    await fs.unlink(`static/imgs/${fileimagen}`);
    res.redirect('/')
});


app.get('/', async (req, res) => {
    res.render('formulario.html')
})

app.get('*', (req, res) => {
    res.send('Esta ruta no existe')
});

app.listen(3000, () => console.log('Servidor en puerto 3000'))


