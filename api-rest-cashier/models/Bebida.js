const mongoose = require('mongoose');
mongoose.pluralize(null);

const ProdutosDB = mongoose.connection.useDb('Produtos');

const Bebida = ProdutosDB.model('Bebida', mongoose.Schema({
    id: Number,
    item: String,
    qtd: Number,
    display: String,
    preco: Number,
    tipoBebida: Number
}))

module.exports = Bebida;
