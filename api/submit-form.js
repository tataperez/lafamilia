
// api/submit-form.js

const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'la_familia_barbershop';

let client;

async function connectToMongo() {
    if (!client || !client.topology || !client.topology.isConnected()) {
        try {
            client = new MongoClient(uri);
            await client.connect();
            console.log('Conectado a MongoDB Atlas!');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            throw error;
        }
    }
    return client.db(dbName);
}

const mailConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

const transporter = nodemailer.createTransport(mailConfig);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const { nombre, email, phone, message } = req.body;

        if (!nombre || !email || !message) {
            return res.status(400).json({ message: 'Nombre, Correo y Mensaje son campos obligatorios.' });
        }

        let db;

        try {
            db = await connectToMongo();
            const collection = db.collection('formulario_contactos');

            const result = await collection.insertOne({
                nombre: nombre,
                correo: email,
                telefono: phone || null,
                mensaje: message,
                fechaEnvio: new Date()
            });

            console.log('Documento insertado en MongoDB con ID:', result.insertedId);

        } catch (mongoError) {
            console.error('Error al insertar en MongoDB:', mongoError);
            return res.status(500).json({ message: 'Error al guardar el mensaje en la base de datos.', error: mongoError.message });
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.CLIENT_EMAIL,
            subject: `Nuevo Mensaje de Contacto - La Familia Barbershop (${nombre})`,
            html: `
                <p>Hola,</p>
                <p>Has recibido un nuevo mensaje a través del formulario de contacto de tu sitio web La Familia Barbershop:</p>
                <ul>
                    <li><strong>Nombre:</strong> ${nombre}</li>
                    <li><strong>Correo:</strong> ${email}</li>
                    <li><strong>Teléfono:</strong> ${phone || 'N/A'}</li>
                    <li><strong>Mensaje:</strong><br>${message}</li>
                </ul>
                <p>Por favor, revisa esta información y contacta al cliente a la brevedad posible.</p>
                <p>Saludos,<br>Equipo de tu sitio web La Familia Barbershop</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo de notificación enviado correctamente al dueño.');
        } catch (mailError) {
            console.error('Error al enviar el correo:', mailError);
            return res.status(500).json({ message: 'Error al enviar el correo de notificación.', error: mailError.message });
        }

        res.status(200).json({ message: 'Mensaje enviado y notificado correctamente.' });

    } catch (error) {
        console.error('Error general en la función:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};