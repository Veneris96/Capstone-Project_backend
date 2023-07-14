const validateUser = (req, res, next) => {
    const errors = []

    const { email, password } = req.body

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please provide a valid email address')
    }

    if (typeof password !== "string" || password.length < 8) {
        errors.push('Password must be a string of at least 8 characters')
    }

    if (errors.length > 0) {
        res.status(400).send({ errors })
    } else {
        next()
    }
}

export default validateUser