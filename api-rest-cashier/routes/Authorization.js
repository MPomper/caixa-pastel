const jwt = require('jsonwebtoken')
const SECRET = 'segredoSecreto'
const EXPIRE_TIME = 86400

// recebe o que será colocado no JWT, faz a geraão e o retorna
function generateJWT(payload)
{
    const token = jwt.sign(payload,SECRET,{expiresIn: EXPIRE_TIME})
    return token
}

// middleware para validar os acessos
function verifyJWT(req, res, next)
{
    // desestrutura o header de autorizção "Bearer XXXXXXXXXXx"
    const {authorization} = req.headers

    // se não tiver token, para a execução com retorno 401
    if (!authorization)
        return res.status(401).json({sucesso: false, error: "Token JWT Bearer not found."}).end()

    // pega somente o token
    const token = authorization.split('Bearer ')[1]

    // faz a validação do token
    jwt.verify(token, SECRET, (err, decoded)=>{

        // qualquer problema no token, retorna 401
        if (err)
            return res.status(401).json({sucesso: false, error: err}).end()

        // se passou por tudo, coloca o email de quem está autenticado para posterior uso
        req.authenticatedEmail = decoded.email

        // chama a função seguinte
        return next()
    })
}

// exposição das duas funções

module.exports.verifyJWT = verifyJWT;
module.exports.generateJWT = generateJWT;