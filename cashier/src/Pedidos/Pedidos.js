import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import Home from '../Home/Home'
import '../Pedidos/Pedidos.css'
import { api } from "../Service/API";
import { Link } from "react-router-dom";
import { Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { $ } from "react-jquery-plugin";

function Pedidos()
{
    const [pedidos, setPedidos] = useState([])

    const [Pastel, setPastel] = useState([{}]);
    const [PastelDoce, setPastelDoce] = useState([{}]);
    const [Entrada, setEntrada] = useState([{}]);
    const [Bebida, setBebida] = useState([{}]);
    const [Produtos, setProdutos] = useState([{}]);

    const [x, setX] = useState(<FontAwesomeIcon icon={faCircleXmark} title="não" size="xl" style={{color: "#D11C1C",}} />);
    
    const [total, setTotal] = useState([{
      display: '.00',
      valor: 0,
      pedido: '',
      comanda: ''
    }]);

    const [show, setShow] = useState(false);
    const [GetProdutos, setGetProdutos] = useState(true);

    const handleClose = () => {setShow(false); handleClear();};
    const handleShow = () => setShow(true);

    useEffect(() => {
      const fetchData = async () => {
        if(GetProdutos)
        {
          await api.get('/produtos/produto').then(function ({data}) {
            if(data){
              setGetProdutos(false)
              setPastel(data.pastel)
              setPastelDoce(data.pastelDoce)
              setEntrada(data.entrada)
              setBebida(data.bebida)
              setProdutos(data)
            }
          })
        }
      }

      fetchData();
      
      setTimeout(() => {
        api.get('/pedidos').then(function ({data}) {
            if(data){
                setPedidos(data)
            } 
        })
      }, 2000)
    })

    const handleRowClick = (row, event) => 
    {   
        if(event != null){
          event.preventDefault();
          event.stopPropagation();
        }
        console.log(row)
        if(row != null){
          if(row.itens.pastel.length > 0)
            handleIncrementPastel(row.itens.pastel);
          if(row.itens.pastelDoce.length > 0)
            handleIncrementPastelDoce(row.itens.pastelDoce);
          if(row.itens.entrada.length > 0)
            handleIncrementEntrada(row.itens.entrada);
          if(row.itens.bebida.length > 0)
            handleIncrementBebida(row.itens.bebida);
          
          handleIncrementTotal(row)
          handleShowComanda(row)
        }
    }

    const handleIncrementPastel = (pastel) => 
    {
      {
        const newValuePastel = Pastel.map(item => {
          const Index = pastel.findIndex(obj => obj.id === item.id);
          if(Index != -1){
            if(pastel[Index].qtd >= 10){
              return {...item, qtd: pastel[Index].qtd, display: ''}
            }
            return {...item, qtd: pastel[Index].qtd}
          }
          else
          {
            return item
          }
        })
  
        setPastel(newValuePastel);
      }
    }

    const handleIncrementPastelDoce = (pastelDoce) => 
    {
      {
        const newValuePastelDoce = PastelDoce.map(item => {
          const Index = pastelDoce.findIndex(obj => obj.id === item.id);
          if(Index != -1){
            if(pastelDoce[Index].qtd >= 10){
              return {...item, qtd: pastelDoce[Index].qtd, display: ''}
            }
            return {...item, qtd: pastelDoce[Index].qtd}
          }
          else
          {
            return item
          }
        })
  
        setPastelDoce(newValuePastelDoce);
      }
    }   
    
    const handleIncrementEntrada = (entrada) => 
    {
      {
        const newValueEntrada = Entrada.map(item => {
          const Index = entrada.findIndex(obj => obj.id === item.id);
          if(Index != -1){
            if(entrada[Index].qtd >= 10){
              return {...item, qtd: entrada[Index].qtd, display: ''}
            }
            return {...item, qtd: entrada[Index].qtd}
          }
          else
          {
            return item
          }
        })
    
        setEntrada(newValueEntrada);
      }
    }

    const handleIncrementBebida = (bebida) => 
    {
      {
        const newValueBebida = Bebida.map(item => {
          const Index = bebida.findIndex(obj => obj.id === item.id);
          if(Index != -1){
            if(bebida[Index].qtd >= 10){
              return {...item, qtd: bebida[Index].qtd, display: ''}
            }
            return {...item, qtd: bebida[Index].qtd}
          }
          else
          {
            return item
          }
        })
    
        setBebida(newValueBebida);
      }
    }

    const handleIncrementTotal = (value) => 
    {
      {
          total[0].valor = total[0].valor + value.total;
      }
    }

    const handleShowComanda = (value) => 
    {

      total[0].pedido = value.pedido;
      total[0].comanda = value.comanda;
      
      handleShow()
    }

    function isDecimal(n) {
      var result = n - Math.floor(n) !== 0;
      if (result) return true;
      else return false;
    }

    const columns = [
        {
            name: 'COMANDA',
            selector: row => row.comanda,
            sortable: true,
            center: true,
            width: '25%'
        },
        {
            name: 'DATA',
            selector: row => row.dataInclusao == null ? row.dataPago : row.dataInclusao,
            center: true,
            width: '25%'
        },
        {
            name: 'TOTAL',
            selector: row => isDecimal(row.total) ? row.total + '0' : row.total + '.00',
            sortable: true,
            center: true,
            width: '25%'
        },
        {
            name: 'PAGO',
            selector: row => row.dataPago == null ? <FontAwesomeIcon icon={faCircleXmark} title="não" size="xl" style={{color: "#D11C1C",}} /> : <FontAwesomeIcon icon={faCircleCheck} title="sim" size="xl" style={{color: "#17B01E",}} />,
            center: true,
            width: '25%',
        },
    ];

    function handleClear()
    {

      setTotal([{
        display: '.00',
        valor: 0,
        pedido: 0,
        comanda: ''
      }]);

      setPastel(Produtos.pastel)
      setPastelDoce(Produtos.pastelDoce)
      setEntrada(Produtos.entrada)
      setBebida(Produtos.bebida)
    }

    return (
      <>
        <DataTable
        title="ABERTAS"
		    columns={columns}
		    data={pedidos.pedidos}
        onRowDoubleClicked = {handleRowClick}
        highlightOnHover
        responsive
        defaultSortFieldId={5}
		    />
        <DataTable
        title="PAGAS"
		    columns={columns}
		    data={pedidos.pedidosPago}
        onRowDoubleClicked = {handleRowClick}
        highlightOnHover
        responsive
        defaultSortFieldId={5}
		    />
        
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show} 
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <div className="modalDiv"><div className="modalPedido">Comanda - <div className="modalInfoPedido">{total[0].comanda}</div></div><div className="modalNome">{total[0].pedido != null ? <div className="modalInfoPedido">Pedido - {total[0].pedido}</div> : ''}</div></div>
          </Modal.Header>
          <Modal.Body>
            {
              Pastel.map((item) => item.qtd > 0 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
            }{
              PastelDoce.map((item) => item.qtd > 0 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
            }{
              Entrada.map((item) => item.qtd > 0 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
            }{
              Bebida.map((item) => item.qtd > 0 ? item.tipoBebida === 2 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item} (LONG NECK)</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
            } 
          </Modal.Body>
          <Modal.Footer>
            <div className="totalPedido">TOTAL: {total[0].valor}{isDecimal(total[0].valor) ? '0' : total[0].display}</div>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default Pedidos;

