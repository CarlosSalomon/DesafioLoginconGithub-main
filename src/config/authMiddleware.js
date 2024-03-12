export const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.admin === true) {
        next(); 
    } else {
        res.status(403).send('Acceso denegado. Debes ser administrador para acceder a esta página.');
    }
};
