import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import '../Print/Print.css'
import { api } from "../Service/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faPrint } from '@fortawesome/free-solid-svg-icons'
import { $ } from "react-jquery-plugin";
import { Button } from "react-bootstrap";

function Print()
{
    const [pedidos, setPedidos] = useState([])

    const [status, setStatus] = useState(true)

    const [Pastel, setPastel] = useState([{}]);
    const [PastelDoce, setPastelDoce] = useState([{}]);
    const [Entrada, setEntrada] = useState([{}]);
    const [Bebida, setBebida] = useState([{}]);
    const [Produtos, setProdutos] = useState([{}]);
    
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
        api.get('/pedidos/print').then(function ({data}) {
            if(data){
                setPedidos(data)
            } 
        })
        api.get('/status').then(function ({data}) {
          if(data){
              if(data[0].status != status)
              {
                setStatus(data[0].status)

                if(!status)
                {
                  $("#pausarPrint").removeClass("btnPrint").addClass("btnPausarPrint");
                  $(".iconeBloqueioDisabled").removeClass("iconeBloqueioDisabled").addClass("iconeBloqueio");
                  $(".iconePrint").removeClass("iconePrint").addClass("iconePrintFalse");
                  $("#printFila").removeClass("btnImprimirFila").addClass("btnPrint");
                } 
                else
                {
                  $("#pausarPrint").removeClass("btnPausarPrint").addClass("btnPrint");
                  $(".iconeBloqueio").removeClass("iconeBloqueio").addClass("iconeBloqueioDisabled");
                  $(".iconePrintFalse").removeClass("iconePrintFalse").addClass("iconePrint");
                  $("#printFila").removeClass("btnPrint").addClass("btnImprimirFila");
                }
                  
              }
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

    const handleImprimirClick = (id, event) => 
    {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      const ToastButtons = Swal.mixin({
        toast: true,
        position: 'top-end',
        title: 'Confirmar Impressão?.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar'
      })

      event.preventDefault();
      event.stopPropagation();
      let item;

      if(id != null){
        ToastButtons.fire({}).then((result) => {
          if (result.isConfirmed) {
            api.put('/status/print/' + id).then((response) => {
              if(response.status === 200)
              {
                Toast.fire({
                  icon: 'success',
                  title: 'PEDIDO IMPRESSO'
                })
              }
              else
              {
                Toast.fire({
                  icon: 'error',
                  title: 'PEDIDO NÃO FOI IMPRESSO'
                })
              }
            });
          }
        })
      }
    }

    const handlePausarImpressaoClick = (event) => 
    {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      const ToastButtons = Swal.mixin({
        toast: true,
        position: 'top-end',
        title: 'Deseja confirmar a pausa das impressões?.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar'
      })

      event.preventDefault();
      event.stopPropagation();

      ToastButtons.fire({}).then((result) => {
        if (result.isConfirmed) {
          api.put('/status/' + false).then((response) => {
            if(response.status === 200)
            {
              Toast.fire({
                icon: 'success',
                title: 'IMPRESSÕES PAUSADAS COM SUCESSO!'
              })        
            }
            else
            {
              Toast.fire({
                icon: 'error',
                title: 'NÃO FOI POSSÍVEL PAUSAR AS IMPRESSÕES'
              })
            }
          });
        }
      })
    }
    
    const handleImprimirFilaClick = (event) => 
    {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      const ToastButtons = Swal.mixin({
        toast: true,
        position: 'top-end',
        title: 'Deseja imprimir os pedidos na fila e retornar as impressões?.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar'
      })

      event.preventDefault();
      event.stopPropagation();

      ToastButtons.fire({}).then((result) => {
        if (result.isConfirmed) {
          api.get('/status/fila').then((response) => {
            if(response.status === 200)
            {
              Toast.fire({
                icon: 'success',
                title: 'FILA IMPRESSA COM SUCESSO!',
                text: 'A fila foi impressa e a impressao foi despausada!'
              })        
            }
            else
            {
              Toast.fire({
                icon: 'error',
                title: 'NÃO FOI POSSÍVEL IMPRIMIR A FILA',
                text: 'A fila não foi impressa e a impressão esta ' + status ? 'despausada!' : 'pausada!'
              })
            }
          });
        }
      })
    }

    function isDecimal(n) {
      var result = n - Math.floor(n) !== 0;
      if (result) return true;
      else return false;
    }

    const columns = [
        {
            name: 'PEDIDO',
            selector: row => row.pedido,
            sortable: true,
            center: true,
            width: '15%'
        },
        {
            name: 'COMANDA',
            selector: row => row.comanda,
            sortable: true,
            center: true,
            width: '15%'
        },
        {
          name: 'NOME / MESA',
          selector: row => row.mesa,
          sortable: true,
          center: true,
          width: '25%'
        },
        {
            name: 'DATA',
            selector: row => row.dataInclusao == null ? row.dataPago : row.dataInclusao,
            center: true,
            width: '22.5%'
        },
        {
          name: 'IMPRIMIR',
          center: true,
          width: '22.5%',
          button: true,
          cell: (row) => <button type="button" disabled={!status} className={row.print ? "buttonImprimir buttonDisableImprimir" : "buttonImprimir buttonColorImprimir"} onClick={e => handleImprimirClick(row._id, e)}><FontAwesomeIcon icon={faPrint} size="xl" /></button>,
        }
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
        <section className="pausarPrint">
          <div>
            <button id="pausarPrint" disabled={!status} className="btnMarginRight btnPausarPrint" type="button" onClick={handlePausarImpressaoClick}><FontAwesomeIcon disabled={!status} icon={faBan} size="lg" className="iconeBloqueio" /> PAUSAR IMPRESSÕES DOS PEDIDOS </button>
            <button id="printFila" disabled={status} className="btnPrint" type="button" onClick={handleImprimirFilaClick}><FontAwesomeIcon icon={faPrint} className="iconePrintFalse" size="lg" /> DESPAUSAR IMPRESSÕES E IMPRIMIR PEDIDOS NA FILA</button>
          </div>
        </section>
        <DataTable
        title="PEDIDOS PARA IMPRESSÃO"
		    columns={columns}
		    data={pedidos}
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
            <Button variant="btnClosePrint" onClick={handleClose} style={{backgroundColor: '#CFCFCFBA', fontSize: '10px', borderRadius: '4px', letterSpacing: '1px'}}>FECHAR</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default Print;

