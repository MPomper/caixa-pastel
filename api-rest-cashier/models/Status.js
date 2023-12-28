const mongoose = require('mongoose');
mongoose.pluralize(null);

const ImpressoraDB = mongoose.connection.useDb('Impressora');

const Status = ImpressoraDB.model("Status", mongoose.Schema({
    id: Number,
    status: Boolean
}))

module.exports = Status;