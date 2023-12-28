const mongoose = require('mongoose');
mongoose.pluralize(null);

const PedidosDB = mongoose.connection.useDb('Pastel_09-12-2023');

const Pedidos = PedidosDB.model('PedidosPrint', mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comanda: Number,
    pedido: Number,
    mesa: String,
    itens: {
        pastel: [{
            id: Number,
            item: String,
            qtd: Number,
            preco: Number
        }],
        pastelDoce: [{
            id: Number,
            item: String,
            qtd: Number,
            preco: Number
        }],
        entrada: [{
            id: Number,
            item: String,
            qtd: Number,
            preco: Number
        }],
        bebida: [{
            id: Number,
            item: String,
            qtd: Number,
            preco: Number,
            tipoBebida: Number
        }],
    },
    dataInclusao: String,
    print: Boolean,
    fila: Boolean
}))

module.exports = Pedidos;