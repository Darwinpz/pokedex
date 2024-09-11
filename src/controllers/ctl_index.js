
const QRCode = require('qrcode');
const User = require('../models/user');
const moment = require('moment-timezone');

const ctrl = {};

ctrl.inicio = async (req, res) => {
    var url = "http://" + process.env.IP + ":" + process.env.PORT + "/jugar"
    const qrCodeImage = await QRCode.toDataURL(url);
    res.render("index.hbs", { qr: qrCodeImage })
};

ctrl.login = (req, res) => {
    res.render("login.hbs")
};

ctrl.ingreso = async (req, res) => {

    const { nombre } = req.body;

    const exist = await User.findOne({ nombre });
    const isAdmin = exist ? exist.rol === "ADMIN" : nombre === process.env.USERADMIN;
    const rol = isAdmin ? "ADMIN" : "JUGADOR";

    if (exist && isAdmin) {
        create_session(req, exist)
        return res.redirect('/jugar');
    }

    if (!exist) {
        const usuario = await new User({ nombre, rol }).save();
        create_session(req, usuario)
        return res.redirect('/jugar');
    }

    res.render('login.hbs', { error_msg: [{ text: 'Nombre de usuario existente' }] });

}

function create_session(req, user) {
    req.session._id = user._id;
    req.session.nombre = user.nombre;
    req.session.rol = user.rol;
}

ctrl.jugar = async (req, res) => {
    const exist = await User.findOne({ '_id': req.session._id });
    res.render("jugar.hbs", { session: req.session, puntaje: exist.puntaje })
};

ctrl.resultados = (req, res) => {
    res.render("resultados.hbs")
};

ctrl.update_puntaje = async (req, res) => {

    const { id } = req.body;
    const exist = await User.findOne({ '_id': id });

    if (exist) {
        exist.puntaje += 10;
        await exist.save()
    }
    res.json(!!exist);
}

ctrl.ver_puntajes = async (req, res) => {

    var users = await User.aggregate([{ "$sort": { "puntaje": -1 } }]);

    const updatedUsers = users.map(user => {
        user.fecha_accion = user.fecha ? moment(user.fecha).tz("America/Guayaquil").format("DD/MM/YYYY HH:mm:ss") : "-";
        return user;
    });

    res.json({ data: updatedUsers });

};

ctrl.salir = async (req, res) => {
    req.session.destroy();
    res.redirect("/resultados")
};

module.exports = ctrl;