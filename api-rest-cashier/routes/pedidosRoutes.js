const router = require('express').Router();
var mongoose = require('mongodb')
const BSON = require('bson');
const Pedidos = require('../models/Pedidos');
const PedidosPago = require('../models/PedidosPago');
const PedidosPrint = require('../models/PedidosPrint');
const Status = require('../models/Status');

const { Mutex } = require('async-mutex');
const mutex = new Mutex();

const escpos = require("escpos");
const log = require('node-gyp/lib/log');

// install escpos-usb adapter module manually
escpos.USB = require("escpos-usb");
// Select the adapter based on your printer type
const device = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
console.log(device);
const options = { encoding: "GB18030" /* default */ };

router.post('/', async (req, res)=>{

    const release = await mutex.acquire();

    try {
        const {mesa, comanda, itensBody, total} = req.body;
        const _id = BSON.ObjectId();
        var statusPedido = false;

        var data = new Date();
        data = data.toLocaleString('pt-BR', {
            hour12: false,
        })

        const hasPastel = req.body.produtosImprimir.pastel.find(x => { if (x.qtd > 0) return true; else return false; } );
        const hasPastelDoce = req.body.produtosImprimir.pastelDoce.find(x => { if (x.qtd > 0) return true; else return false; } );
        const hasEntrada = req.body.produtosImprimir.entrada.find(x => { if (x.qtd > 0) return true; else return false; } );
        const hasBebida = req.body.produtosImprimir.bebida.find(x => { if (x.qtd > 0) return true; else return false; } );

        var dataInclusao = data;

        var item = await Pedidos.find({ comanda : comanda }).exec();
        var status = await Status.find().exec();

        if(item.length > 0){
            req.body.itens.pastel.map(obj => {
                const found = item[0].itens.pastel.find(x => x.id == obj.id);
                if(found != undefined)
                    obj.qtd += found.qtd;
            })
            req.body.itens.pastelDoce.map(obj => {
                const found = item[0].itens.pastelDoce.find(x => x.id == obj.id);
                if(found != undefined)
                    obj.qtd += found.qtd;
            })
            req.body.itens.entrada.map(obj => {
                const found = item[0].itens.entrada.find(x => x.id == obj.id);
                if(found != undefined)
                    obj.qtd += found.qtd;
            })
            req.body.itens.bebida.map(obj => {
                const found = item[0].itens.bebida.find(x => x.id == obj.id);
                if(found != undefined)
                    obj.qtd += found.qtd;
            })
        }

        var itens = {}

        itens.pastel = req.body.itens.pastel.filter(function(value, index, arr){
            return value.qtd > 0;
        });
        itens.pastelDoce = req.body.itens.pastelDoce.filter(function(value, index, arr){ 
            return value.qtd > 0;
        });
        itens.entrada = req.body.itens.entrada.filter(function(value, index, arr){ 
            return value.qtd > 0;
        });
        itens.bebida = req.body.itens.bebida.filter(function(value, index, arr){ 
            return value.qtd > 0;
        });

        if(item.length > 0)
        {
            console.log('TOTAL ANTES: ' + total + ' + TOTAL QUERY: ' + item[0].total)
            var valorTotal = item[0].total + total;
            console.log('TOTAL DEPOIS: ' + valorTotal)
            try {
                await Pedidos.updateOne(
                    { _id: item[0]._id },
                    { $set: {total: valorTotal, dataAlteracao: data, itens: itens } }
                )
                statusPedido = true;
                res.status(201).json({message: 
                    "Pedido feito com sucesso."})
            } catch (error) {
                res.status(500).json({error: error})
            }
        }
        else
        {

            const pedidoCompleto = {_id, comanda, mesa, itens, dataInclusao, total}
            try {
                await Pedidos.create(pedidoCompleto)
                statusPedido = true;
                res.status(201).json({message: 
                    "Pedido feito com sucesso."})
            } catch (error) {
                res.status(500).json({error: error})
            }
        }

        var pedido = 1;

        try {
            var itemPrint = await PedidosPrint.find().limit(1).sort({pedido:-1})

            if(itemPrint.length > 0)
                pedido = itemPrint[0].pedido + 1;

            var itensPrint = {};

            itensPrint.pastel = req.body.produtosImprimir.pastel.filter(function(value, index, arr){
                return value.qtd > 0;
            });
            itensPrint.pastelDoce = req.body.produtosImprimir.pastelDoce.filter(function(value, index, arr){ 
                return value.qtd > 0;
            });
            itensPrint.entrada = req.body.produtosImprimir.entrada.filter(function(value, index, arr){ 
                return value.qtd > 0;
            });
            itensPrint.bebida = req.body.produtosImprimir.bebida.filter(function(value, index, arr){ 
                return value.qtd > 0;
            });

            console.log("AAAAA " + status);

            var print = false;
            var fila = !status[0].status;

            const pedidoPrint = {_id, comanda, mesa, pedido, itens: itensPrint, dataInclusao, print, fila}

            await PedidosPrint.create(pedidoPrint)
        } catch (error) {
            res.status(500).json({error: error})
        }
console.log(`AQUI ALO ` + status[0].status + ` nome: ` + mesa);
        if(status[0].status && statusPedido)
        {console.log(req.body.produtosImprimir.bebida);
            const maxCharsTitulo = 32; // Assuming a total of 32 characters in a line

            const mesanomeLength = ('MESA/NOME: ').length;
            const inputMesaLength = mesa.length;
            const spacesCountMesa = maxCharsTitulo - mesanomeLength - inputMesaLength; // Calculate spaces neede
            const spacesMesa = ' '.repeat(spacesCountMesa > 0 ? spacesCountMesa : 0);

            const comandaLength = ('COMANDA: ' + comanda).length;
            const pedidoLength = ('PEDIDO: ' + pedido).length;
            const spacesCountComanda = maxCharsTitulo - comandaLength - pedidoLength; // Calculate spaces neede
            const spacesComanda = ' '.repeat(spacesCountComanda > 0 ? spacesCountComanda : 0);

            const printer = new escpos.Printer(device, options);
            device.open(function(error){
                console.log(error);
                printer
                .font('a')
                .align('LT')
                .style('B')
                .size(0.5, 0.5)
                .text(`${'COMANDA: ' + comanda}${spacesComanda}${'PEDIDO: ' + pedido}`)
                .text(`${'MESA/NOME: '}${spacesMesa}${mesa}`)
                .align('CT')
                .style('NORMAL')
                .size(0.5, 0.5)
                .encode('utf8')

                if (hasPastel)
                    printer.text('-'.repeat(32))
                req.body.produtosImprimir.pastel.forEach(element => {
                    const maxChars = 32; // Assuming a total of 32 characters in a line
                    const leftLength = element.item.length;
                    const rightLength = ('x ' + element.qtd).length;
                    const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed

                    const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string

                    if (element.qtd > 0)
                        return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                })

                if (hasPastelDoce)
                    printer.text('-'.repeat(32))

                req.body.produtosImprimir.pastelDoce.forEach(element => {
                    const maxChars = 32; // Assuming a total of 32 characters in a line
                    const leftLength = element.item.length;
                    const rightLength = ('x ' + element.qtd).length;
                    const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed

                    const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string

                    if (element.qtd > 0)
                        return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                })

                if (hasEntrada)
                    printer.text('-'.repeat(32))

                req.body.produtosImprimir.entrada.forEach(element => {
                    const maxChars = 32; // Assuming a total of 32 characters in a line
                    const leftLength = element.item.length;
                    const rightLength = ('x ' + element.qtd).length;
                    const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed

                    const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string

                    if (element.qtd > 0)
                        return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                })

                if (hasBebida)
                    printer.text('-'.repeat(32))

                req.body.produtosImprimir.bebida.forEach(element => {
                    const maxChars = 32; // Assuming a total of 32 characters in a line

                    let Bebida = element.item;

                    switch (element.tipoBebida) {
                        case 1:
                            Bebida = Bebida + ' (LATA)';
                            break;

                        case 2:
                            Bebida = Bebida + ' (LONG NECK)';
                            break;

                        case 3:
                            Bebida = Bebida + ' (COPO)';
                            break;
                    
                        case 4:
                            Bebida = Bebida + ' (JARRA)';
                            break;

                        default:
                            break;
                    }

                    const leftLength = Bebida.length;
                    const rightLength = ('x ' + element.qtd).length;
                    const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed

                    const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string

                    if (element.qtd > 0)
                        return printer.text(`${Bebida.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                })

                printer
                .cut()
                .close()
            });

            const ret = await PedidosPrint.updateOne(
                {_id: _id}, {print: true} )
        }
    } catch (error) {
        res.status(500).json({error: error})
    } finally {
        release();
    }
})

router.get('/', async (req, res) => {
    try {
        var list = {};
        list.pedidos = await Pedidos.find().sort({comanda: 1, dataInclusao: 1});
        list.pedidosPago = await PedidosPago.find().sort({comanda: 1, dataPago: 1});

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.get('/print', async (req, res) => {
    try {
        var item = await PedidosPrint.find().sort({pedido: 1});

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

//router.get('/:pedido', async (req, res) => {
//    try {
//        const {pedido} = req.params
//
//        var item = await Pedidos.findOne({_id: mongoose.ObjectId(pedido)});
//
//        res.status(200).json(item);
//    } catch (error) {
//        res.status(500).json({error: error})
//    }
//})

router.get('/comanda/:comanda', async (req, res) => {
    try {
        const {comanda} = req.params
        
        var item = await Pedidos.findOne({ comanda : comanda });
        
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.put('/', async (req, res) => {

    const {id, comanda, itensBody, total} = req.body;
    var itens = {}

    itens.pastel = req.body.itens.pastel.filter(function(value, index, arr){ 
        return value.qtd > 0;
    });
    itens.pastelDoce = req.body.itens.pastelDoce.filter(function(value, index, arr){ 
        return value.qtd > 0;
    });
    itens.entrada = req.body.itens.entrada.filter(function(value, index, arr){ 
        return value.qtd > 0;
    });
    itens.bebida = req.body.itens.bebida.filter(function(value, index, arr){ 
        return value.qtd > 0;
    });

    const pedidoCompleto = {_id: mongoose.ObjectId(id), comanda, itens, total}
    try {
        const ret = await Pedidos.updateOne(
                 {_id: id}, pedidoCompleto )
         if (ret.matchedCount>0)
           res.status(200).json({message: 
             "Pedido alterado com sucesso!", alterado: ret.modifiedCount>0})
         else
            res.status(404).json({message:
             "Pedido não encontrado!"})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.put('/pagar/:id', async (req, res) => {
    var {id} = req.params

    id = mongoose.ObjectId(id);
    const _id = BSON.ObjectId();

    var item = await Pedidos.findOne({ _id : id }).exec();

    if(item != undefined)
    {
        var dataPago = new Date();
        dataPago = dataPago.toLocaleString('pt-BR', {
            hour12: false,
        });

        try {
            var pedido = await PedidosPago.find().limit(1).sort({pedido:-1})

            if(pedido.length <= 0)
                pedido = 1;
            else
                pedido = pedido[0].pedido + 1;

            const comandaPaga = {_id, comanda: item.comanda, mesa: item.mesa, itens: item.itens, total: item.total, dataPago, pedido}

            await PedidosPago.create(comandaPaga);

            await Pedidos.deleteOne({ _id : id });

            res.status(201).json({message: 
                "Comanda paga com sucesso."})

        } catch (error) {
            res.status(500).json({error: error})
        }
    }
})

// Pagar antigo que aceita varios IDs //
//router.put('/pagar', async (req, res) => {
//
//    const item = Object.keys(req.body).map(function (key) {
//        return {_id: mongoose.ObjectId(req.body[key]._id)};
//    });
//    
//    try {
//        const ret = await Pedidos.updateMany(
//                 {_id: item}, { $set: {pago: true} } )
//        if (ret.matchedCount>0)
//           res.status(200).json({message: 
//             "Pedido pago", alterado: ret.modifiedCount>0})
//         else
//            res.status(404).json({message:
//             "Pedido não foi pago!"})
//    } catch (error) {
//        res.status(500).json({error: error})
//    }
//})

module.exports = router