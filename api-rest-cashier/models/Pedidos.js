const mongoose = require('mongoose');
mongoose.pluralize(null);

const PedidosDB = mongoose.connection.useDb('Pastel_09-12-2023');

const Pedidos = PedidosDB.model('Pedidos', mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comanda: Number,
    mesa: String,
    itens: {
        pastel: [{
            id: Number,
            qtd: Number,
            preco: Number
        }],
        pastelDoce: [{
            id: Number,
            qtd: Number,
            preco: Number
        }],
        entrada: [{
            id: Number,
            qtd: Number,
            preco: Number
        }],
        bebida: [{
            id: Number,
            qtd: Number,
            preco: Number
        }],
    },
    total: Number,
    dataInclusao: String,
    dataAlteracao: String
}))

module.exports = Pedidos;