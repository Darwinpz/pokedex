const ctrl = {};


ctrl.isAuth = (req,res,next)=>{
    req.session._id != null ? next() : res.redirect("/login")
}


ctrl.notAuth = (req,res,next)=>{
    req.session._id != null ? res.redirect('/jugar'): next();
};

module.exports = ctrl;