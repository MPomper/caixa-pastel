const router = require('express').Router();
var mongoose = require('mongodb')
const BSON = require('bson');
const Status = require('../models/Status');
const PedidosPrint = require('../models/PedidosPrint');

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

const options = { encoding: "GB18030" /* default */ };

router.get('/', async (req, res) => {
    try {
        var status = await Status.find({});

        res.status(200).json(status);

    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.put('/:status', async (req, res) => {
    try {
        const {status} = req.params
        const id = mongoose.ObjectId('6573994c77f57c2203eea2e8')

        const ret = await Status.updateOne(
                 {_id: id}, {status: status} )
         if (ret.matchedCount>0)
           res.status(200).json({message: 
             "Status alterado com sucesso!", alterado: ret.modifiedCount>0})
         else
            res.status(404).json({message:
             "Status não foi alterado!"})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.get('/fila', async (req, res) => {
    try {
        console.log(`aaaaaaa`);
        var pedidos = await PedidosPrint.find({ fila: true }).sort({pedido: 1});

        pedidos.forEach(async item => {

            var id = mongoose.ObjectId(item.id);
            console.log(id);
            let hasPastel = false;
            let hasPastelDoce = false;
            let hasEntrada = false;
            let hasBebida = false;

            if (item.itens.pastel.length > 0)
                hasPastel = true;
            if (item.itens.pastelDoce.length > 0)
                hasPastelDoce = true;
            if (item.itens.entrada.length > 0)
                hasEntrada = true;
            if (item.itens.bebida.length > 0)
                hasBebida = true;

            if(item != undefined)
            {
                const maxCharsTitulo = 32; // Assuming a total of 32 characters in a line

                const mesanomeLength = ('MESA/NOME: ').length;
                const inputMesaLength = item.mesa.length;
                const spacesCountMesa = maxCharsTitulo - mesanomeLength - inputMesaLength; // Calculate spaces neede
                const spacesMesa = ' '.repeat(spacesCountMesa > 0 ? spacesCountMesa : 0);
            
                const comandaLength = ('COMANDA: ' + item.comanda).length;
                const pedidoLength = ('PEDIDO: ' + item.pedido).length;
                const spacesCountComanda = maxCharsTitulo - comandaLength - pedidoLength; // Calculate spaces neede
                const spacesComanda = ' '.repeat(spacesCountComanda > 0 ? spacesCountComanda : 0);
            
                const printer = new escpos.Printer(device, options);
                device.open(function(error){
                    printer
                    .font('a')
                    .align('LT')
                    .style('B')
                    .size(0.5, 0.5)
                    .text(`${'COMANDA: ' + item.comanda}${spacesComanda}${'PEDIDO: ' + item.pedido}`)
                    .text(`${'MESA/NOME: '}${spacesMesa}${item.mesa}`)
                    .align('CT')
                    .style('NORMAL')
                    .size(0.5, 0.5)
                    .encode('utf8')
                
                    if (hasPastel)
                    {
                        printer.text('-'.repeat(32))
                    
                        item.itens.pastel.forEach(element => {
                            const maxChars = 32; // Assuming a total of 32 characters in a line
                            const leftLength = element.item.length;
                            const rightLength = ('x ' + element.qtd).length;
                            const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed
                        
                            const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string
                        
                            if (element.qtd > 0)
                                return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                        })
                    }
                
                    if (hasPastelDoce)
                    {
                        printer.text('-'.repeat(32))
                    
                        item.itens.pastelDoce.forEach(element => {
                            const maxChars = 32; // Assuming a total of 32 characters in a line
                            const leftLength = element.item.length;
                            const rightLength = ('x ' + element.qtd).length;
                            const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed
                        
                            const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string
                        
                            if (element.qtd > 0)
                                return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                        })
                    }
                
                    if (hasEntrada)
                    {
                        printer.text('-'.repeat(32))
                    
                        item.itens.entrada.forEach(element => {
                            const maxChars = 32; // Assuming a total of 32 characters in a line
                            const leftLength = element.item.length;
                            const rightLength = ('x ' + element.qtd).length;
                            const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed
                        
                            const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string
                        
                            if (element.qtd > 0)
                                return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                        })
                    }
                
                    if (hasBebida)
                    {
                        printer.text('-'.repeat(32))
                    
                        item.itens.bebida.forEach(element => {
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
                    }
                
                    printer
                    .cut()
                    .close()
                  });
                  console.log(`FILA: ` + item.mesa);
              
                try {
                    const ret = await PedidosPrint.updateOne(
                        {_id: id}, {print: true, fila: false} )
                    
                } catch (error) {
                    res.status(500).json({error: error})
                }
            }
        });

        console.log(`FILA FINALIZADA`);

        const idStatus = mongoose.ObjectId('6573994c77f57c2203eea2e8')

        const ret = await Status.updateOne(
                 {_id: idStatus}, {status: true} )

        if (ret.matchedCount>0)
           res.status(200).json({message: 
             "Pedidos da fila impressos com sucesso!", alterado: ret.modifiedCount>0})
         else
            res.status(404).json({message:
             "Nenhum pedido na fila encontrado!"})
        
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.put('/print/:id', async (req, res) => {
    var {id} = req.params
    id = mongoose.ObjectId(id);
    const _id = BSON.ObjectId();

    var item = await PedidosPrint.findOne({ _id : id }).exec();

    let hasPastel = false;
    let hasPastelDoce = false;
    let hasEntrada = false;
    let hasBebida = false;

    if (item.itens.pastel.length > 0)
        hasPastel = true;
    if (item.itens.pastelDoce.length > 0)
        hasPastelDoce = true;
    if (item.itens.entrada.length > 0)
        hasEntrada = true;
    if (item.itens.bebida.length > 0)
        hasBebida = true;

    if(item != undefined)
    {
        const maxCharsTitulo = 32; // Assuming a total of 32 characters in a line
        
        const mesanomeLength = ('MESA/NOME: ').length;
        const inputMesaLength = item.mesa.length;
        const spacesCountMesa = maxCharsTitulo - mesanomeLength - inputMesaLength; // Calculate spaces neede
        const spacesMesa = ' '.repeat(spacesCountMesa > 0 ? spacesCountMesa : 0);

        const comandaLength = ('COMANDA: ' + item.comanda).length;
        const pedidoLength = ('PEDIDO: ' + item.pedido).length;
        const spacesCountComanda = maxCharsTitulo - comandaLength - pedidoLength; // Calculate spaces neede
        const spacesComanda = ' '.repeat(spacesCountComanda > 0 ? spacesCountComanda : 0);

        const printer = new escpos.Printer(device, options);
        device.open(function(error){
            printer
            .font('a')
            .align('LT')
            .style('B')
            .size(0.5, 0.5)
            .text(`${'COMANDA: ' + item.comanda}${spacesComanda}${'PEDIDO: ' + item.pedido}`)
            .text(`${'MESA/NOME: '}${spacesMesa}${item.mesa}`)
            .align('CT')
            .style('NORMAL')
            .size(0.5, 0.5)
            .encode('utf8')

            if (hasPastel)
            {
                printer.text('-'.repeat(32))

                item.itens.pastel.forEach(element => {
                    const maxChars = 32; // Assuming a total of 32 characters in a line
                    const leftLength = element.item.length;
                    const rightLength = ('x ' + element.qtd).length;
                    const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed
    
                    const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string
    
                    if (element.qtd > 0)
                        return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                })
            }

            if (hasPastelDoce)
            {
                printer.text('-'.repeat(32))

                item.itens.pastelDoce.forEach(element => {
                    const maxChars = 32; // Assuming a total of 32 characters in a line
                    const leftLength = element.item.length;
                    const rightLength = ('x ' + element.qtd).length;
                    const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed
                
                    const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string
                
                    if (element.qtd > 0)
                        return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                })
            }

            if (hasEntrada)
            {
                printer.text('-'.repeat(32))

                item.itens.entrada.forEach(element => {
                    const maxChars = 32; // Assuming a total of 32 characters in a line
                    const leftLength = element.item.length;
                    const rightLength = ('x ' + element.qtd).length;
                    const spacesCount = maxChars - leftLength - rightLength; // Calculate spaces needed

                    const spaces = ' '.repeat(spacesCount > 0 ? spacesCount : 0); // Generate spaces string

                    if (element.qtd > 0)
                        return printer.text(`${element.item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${spaces}${'x ' + element.qtd}`);
                })
            }

            if (hasBebida)
            {
                printer.text('-'.repeat(32))

                item.itens.bebida.forEach(element => {
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
            }

            printer
            .cut()
            .close()
          });

        try {
            const ret = await PedidosPrint.updateOne(
                {_id: id}, {print: true} )

        } catch (error) {
            res.status(500).json({error: error})
        }
    }
})

module.exports = router