const express = require('express')
const app = express()
const mongoose = require('mongoose')
var cors = require('cors');


const pedidosRoutes = require('./routes/pedidosRoutes')
const produtosRoutes = require('./routes/produtosRoutes')
const statusRoutes = require('./routes/statusRoutes')
const usersRoutes = require('./routes/usersRoutes')

app.use(cors())

app.use(
    express.urlencoded({limit: '16mb' ,extended: true }),
    express.json({limit: '16mb'})
)

app.use('/pedidos', pedidosRoutes)
app.use('/produtos', produtosRoutes)
app.use('/status', statusRoutes)
app.use('/users', usersRoutes)

app.get('/', (req, res) => {
    res.status(418).json({
        message: "Desculpe, não sou um bule!"})
})

// CONEXÃO COM O BANCO MONGODB // EXEMPLO: mongodb+srv://...
mongoose.connect('')
.then(()=>{
    console.log("Conectado ao MongoDB Pedidos")
})
.catch((e)=>{
    console.log("Erro ao acessar o MongoDB Pedidos")
    console.log(e)
})

app.listen(3100);