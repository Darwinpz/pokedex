
const ctl_index = require("../controllers/ctl_index");
const {isAuth, notAuth} = require("../helpers/auth");

module.exports = (app) => {
    
    app.get('/',ctl_index.inicio);
    app.get('/login', notAuth,ctl_index.login);
    app.post('/login', notAuth,ctl_index.ingreso);
    app.get('/jugar', isAuth, ctl_index.jugar);
    app.get('/resultados',ctl_index.resultados);
    app.get('/salir',ctl_index.salir);
    app.post('/update_puntaje',ctl_index.update_puntaje);
    app.post('/ver_puntajes',notAuth,ctl_index.ver_puntajes);
}

