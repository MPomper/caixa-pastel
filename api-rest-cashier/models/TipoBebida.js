const mongoose = require('mongoose');
mongoose.pluralize(null);

const ProdutosDB = mongoose.connection.useDb('Produtos');

const TipoBebida = ProdutosDB.model("TipoBebida", mongoose.Schema({
    id: Number,
    nome: String
}))

module.exports = TipoBebida;