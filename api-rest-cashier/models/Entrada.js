const mongoose = require('mongoose');
mongoose.pluralize(null);

const ProdutosDB = mongoose.connection.useDb('Produtos');

const Entrada = ProdutosDB.model('Entrada', mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    item: String,
    qtd: Number,
    display: String,
    preco: Number
}))

module.exports = Entrada;
