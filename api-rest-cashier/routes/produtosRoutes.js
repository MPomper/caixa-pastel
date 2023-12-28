const router = require('express').Router();
var mongoose = require('mongodb')
const Pastel = require('../models/Pastel');
const PastelDoce = require('../models/PastelDoce');
const Entrada = require('../models/Entrada');
const Bebida = require('../models/Bebida');
const TipoBebida = require('../models/TipoBebida');
const TipoProduto = require('../models/TipoProduto');

router.get('/produto', async (req, res) => {
    try {
        var list = {};
        
        list.pastel = await Pastel.find().sort({item: 1});
        list.pastelDoce = await PastelDoce.find().sort({item: 1});
        list.entrada = await Entrada.find().sort({item: 1});
        list.bebida = await Bebida.find().sort({_id: 1});

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.get('/produto/:produto', async (req, res) => {
    try {

        const {produto} = req.params
        console.log('produto:  ' + produto)
        var list = {};
        
        list.pastel = await Pastel.find({item: {$regex: "/^" + produto + "/"}}).sort({item: 1});
        list.pastelDoce = await PastelDoce.find().sort({item: 1});
        list.entrada = await Entrada.find().sort({item: 1});
        list.bebida = await Bebida.find().sort({_id: 1});

        //console.log(list);
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.get('/tipo', async (req, res) => {
    try {
        var list = {};
        
        list.tipoProduto = await TipoProduto.find().sort({item: 1});
        list.tipoBebida = await TipoBebida.find().sort({item: 1});

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.post('/', async (req, res)=>{

    
    const {comanda, itensBody, total} = req.body;
    const _id = BSON.ObjectId();
    const pruduto = {_id, comanda, itens, dataInclusao, total}
    try {
        await Pedidos.create(pedidoCompleto)
        res.status(201).json({message: 
            "Pedido feito com sucesso."})
    } catch (error) {
        res.status(500).json({error: error})
    }

})

module.exports = router