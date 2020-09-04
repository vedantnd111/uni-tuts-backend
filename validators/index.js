exports.signUpValidator = (req, res, next) => {
    req.check('name', 'name is required').notEmpty();
    req.check('email', 'email is required').notEmpty();
    req.check('email', 'email must between 3 to 32 characters')
        .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .withMessage('Enter valid email')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('password must contain a number');

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}