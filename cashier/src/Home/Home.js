import { useEffect, useState } from "react";
import '../Home/Home.css'
import Print from "../Print/Print";
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faMinus } from '@fortawesome/free-solid-svg-icons'
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2'
import { api } from "../Service/API";
import { $ }  from 'react-jquery-plugin'
import { useParams } from "react-router-dom";
import { type } from "@testing-library/user-event/dist/type";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { Modal } from "react-bootstrap";
import { Br, Cut, Line, Printer, render, Row, Text } from 'react-thermal-printer';

function Home(prop)
{
    let {_id} = useParams();
    const [Mesa, setMesa] = useState('');
    const [Comanda, setComanda] = useState(0);
    const [Metodo, setMetodo] = useState('PEDIR');
    const [isDisabled, setIsDisabled] = useState(false);

    const [show, setShow] = useState(false);
    const handleCloseClear = () => {setShow(false); handleClear();};
    const handleCloseEditar = () => {setShow(false); handleItensPedido()};
    const handleShow = () => setShow(true);

    const [Id, setId] = useState(null);

    const [Pastel, setPastel] = useState([{}]);
    const [PastelPagar, setPastelPagar] = useState([{}]);
    const [PastelDoce, setPastelDoce] = useState([{}]);
    const [PastelDocePagar, setPastelDocePagar] = useState([{}]);
    const [Entrada, setEntrada] = useState([{}]);
    const [EntradaPagar, setEntradaPagar] = useState([{}]);
    const [Bebida, setBebida] = useState([{}]);
    const [BebidaPagar, setBebidaPagar] = useState([{}]);
    const [Produtos, setProdutos] = useState([{}]);

    const [total, setTotal] = useState([{
      display: '.00',
      valor: 0
    }]);
    const [totalPagar, setTotalPagar] = useState([{
      display: '.00',
      valor: 0
    }]);
   
    useEffect(() => {
      api.get('/produtos/produto').then(function ({data}) {
        console.log(data)
        if(data){
          setPastel(data.pastel)
          setPastelPagar(data.pastel)
          setPastelDoce(data.pastelDoce)
          setPastelDocePagar(data.pastelDoce)
          setEntrada(data.entrada)
          setEntradaPagar(data.entrada)
          setBebida(data.bebida)
          setBebidaPagar(data.bebida)
          setProdutos(data)
        }
      })
      
      api.get('/pedidos/print').then(function ({data}) {
        console.log(data)
        if(data){
          data.forEach(async element => {
            //TESTE(element)
          });
        }
      })

      if(_id == undefined){
        _id = 0;
      }console.log(_id)
      {if(_id !== 0) handlePedido(_id) }
    }, [prop])

    $(".buttonConcluir").data('clicked', 0);

    //function setCharAt(str,index,chr) {
    //  if(index > str.length-1) return str;
    //  
    //  if(str.substring(0,index) === '0')
    //  {
    //    setCharAt(str.substring(index), index, chr);
    //  }
    //  else
    //  {
    //    return str;
    //  }
    //}

    function handleMesa(evt)
    {
        setMesa(evt.target.value);
    }

    function handleComanda(evt)
    {
      
      var value = evt.target.value.replace(/\D/g, '');

      if(value == 0)
      {
        setComanda(0)
        return;
      }
      else if(value > 100)
      {
        setComanda(100)
        return;
      }

      setComanda(parseInt(value));
    }

    function selectText(e)
    {
      let input = document.getElementById('Comanda');
      input.select();
    }

    const handleIncrementPastel = (id) => {
      {console.log(_id)
        const newValue = Pastel.map(obj => {
          if (obj.id === id) {
            handleIncrementTotal(obj.preco)
            if(obj.qtd == 9)
            {
              return {...obj, qtd: obj.qtd + 1, display: ''}
            }
            return {...obj, qtd: obj.qtd + 1};
          }
          
          return obj;
        });
    
        setPastel(newValue);
        };
    }
  
    const handleDecreasePastel = (id) => {
    {
      const newValue = Pastel.map(obj => {
        if (obj.id === id) {
          if(obj.qtd > 0){
            handleDecreaseTotal(obj.preco)
            if(obj.qtd == 10)
              return {...obj, qtd: obj.qtd - 1, display: '0'}
            else
              return {...obj, qtd: obj.qtd - 1};
          }
          else
            return obj;
        }
        
        return obj;
      });
  
      setPastel(newValue);
      };
    }
    
    const handleIncrementPastelDoce = (id) => {
    {console.log(_id)
      const newValue = PastelDoce.map(obj => {
        if (obj.id === id) {
          handleIncrementTotal(obj.preco)
          if(obj.qtd == 9)
          {
            return {...obj, qtd: obj.qtd + 1, display: ''}
          }
          return {...obj, qtd: obj.qtd + 1};
        }
        
        return obj;
      });
  
      setPastelDoce(newValue);
      };
    }
  
    const handleDecreasePastelDoce = (id) => {
    {
      const newValue = PastelDoce.map(obj => {
        if (obj.id === id) {
          if(obj.qtd > 0){
            handleDecreaseTotal(obj.preco)
            if(obj.qtd == 10)
              return {...obj, qtd: obj.qtd - 1, display: '0'}
            else
              return {...obj, qtd: obj.qtd - 1};
          }
          else
            return obj;
        }
        
        return obj;
      });
  
      setPastelDoce(newValue);
      };
    }

    const handleIncrementEntrada = (id) => {
    {console.log(_id)
      const newValue = Entrada.map(obj => {
        if (obj.id === id) {
          handleIncrementTotal(obj.preco)
          if(obj.qtd == 9)
          {
            return {...obj, qtd: obj.qtd + 1, display: ''}
          }
          return {...obj, qtd: obj.qtd + 1};
        }
        
        return obj;
      });
  
      setEntrada(newValue);
      };
    }
  
    const handleDecreaseEntrada = (id) => {
    {
      const newValue = Entrada.map(obj => {
        if (obj.id === id) {
          if(obj.qtd > 0){
            handleDecreaseTotal(obj.preco)
            if(obj.qtd == 10)
              return {...obj, qtd: obj.qtd - 1, display: '0'}
            else
              return {...obj, qtd: obj.qtd - 1};
          }
          else
            return obj;
        }
        
        return obj;
      });
    
      setEntrada(newValue);
      };
    }

    const handleIncrementBebida = (id) => {
    {console.log(_id)
      const newValue = Bebida.map(obj => {
        if (obj.id === id) {
          handleIncrementTotal(obj.preco)
          if(obj.qtd == 9)
          {
            return {...obj, qtd: obj.qtd + 1, display: ''}
          }
          return {...obj, qtd: obj.qtd + 1};
        }
        
        return obj;
      });
  
      setBebida(newValue);
      };
    }

    const handleDecreaseBebida = (id) => {
    {
      const newValue = Bebida.map(obj => {
        if (obj.id === id) {
          if(obj.qtd > 0){
            handleDecreaseTotal(obj.preco)
            if(obj.qtd == 10)
              return {...obj, qtd: obj.qtd - 1, display: '0'}
            else
              return {...obj, qtd: obj.qtd - 1};
          }
          else
            return obj;
        }
        
        return obj;
      });
  
      setBebida(newValue);
      };
    }

    const handleIncrementTotal = (value) => {
    {
      const newValue = total.map(obj => {
        return {...obj, valor: obj.valor + value};
      });

      setTotal(newValue);
      };
    }

    const handleDecreaseTotal = (value) => {
      {
        const newValue = total.map(obj => {
          if(obj.valor > 0)
            return {...obj, valor: obj.valor - value};
          else
            return {...obj, valor: 0};
        });
        
        setTotal(newValue);
      };
    }

    function handlePesquisarPedido(evt)
    {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Pastel.map(item => {
        item.qtd = 0;
        item.display = "0";
      })
      PastelDoce.map(item => {
        item.qtd = 0;
        item.display = "0";
      })
      Entrada.map(item => {
        item.qtd = 0;
        item.display = "0";
      })
      Bebida.map(item => {
        item.qtd = 0;
        item.display = "0";
      })
      
      if(Comanda === 0 || parseInt(Comanda) > 100)
      {
        Toast.fire({
          icon: 'error',
          title: 'Pedido não foi encontrado!',
          text: 'É necessário ter um numero de comanda!'
        })
        $('#Comanda').css("color", '#FA163F');
      }
      else
      {
        api.get('/pedidos/comanda/' + Comanda).then(function ({data}) {
          if(data){
              setMetodo('EDITAR')
              handleItensPedidoPagar(data);
          }
          else
          {
            Toast.fire({
              icon: 'error',
              title: 'Comanda não encontrada!',
              text: 'Esta comanda está zerada.'
            })
            handleClear()
          }
        })
      }
    }

    async function handleCreatePedido(evt)
    {
      var state = $(this).data('clicked') || 0;
      let pedido = {}

      if(state === 0)
      {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        evt.preventDefault();
        evt.stopPropagation();
        state++; // <-- we increment the state
        $(this).data('clicked', state);// <-- and store it back in data

        if((Comanda === 0 || parseInt(Comanda) > 100) && (Mesa === '' || Mesa == undefined || Mesa == null))
        {
          Toast.fire({
            icon: 'error',
            title: 'Pedido não foi realizado!',
            text: 'É necessário ter um numero de comanda e um nome!'
          })
          $('#Comanda').css("color", '#FA163F');
          $('#Mesa').addClass('errorMesa');
        }
        else if(Comanda === 0 || parseInt(Comanda) > 100)
        {
          Toast.fire({
            icon: 'error',
            title: 'Pedido não foi realizado!',
            text: 'É necessário ter um numero de comanda!'
          })
          $('#Comanda').css("color", '#FA163F');
        }
        else if(Mesa === '' || Mesa == undefined || Mesa == null)
        {
          Toast.fire({
            icon: 'error',
            title: 'Pedido não foi realizado!',
            text: 'É necessário ter um nome e mesa!'
          })
          $('#Mesa').addClass('errorMesa');
        }
        else if(total[0].valor === 0)
        {
          Toast.fire({
            icon: 'error',
            title: 'Pedido não foi realizado!',
            text: 'É necessário ter ao menos um item no carrinho!'
          })
        }
        else{
          if(Id == undefined || Id == null)
          {
            console.log('CRIANDO NOVA COMANDA')

            pedido = {
              mesa: Mesa,
              comanda: Comanda,
              itens: {
                pastel: Pastel,
                pastelDoce: PastelDoce,
                entrada: Entrada,
                bebida: Bebida      
              },
              produtosImprimir: {
                pastel: Pastel,
                pastelDoce: PastelDoce,
                entrada: Entrada,
                bebida: Bebida      
              },
              total: total[0].valor
            }

            api.post('/pedidos', pedido).then((response) => {
              console.log(response)
              handleClear()
              if(response.status === 201)
              {
                Toast.fire({
                  icon: 'success',
                  title: response.data.message
                }).then((result) => {
                  $(this).data('clicked', 0);
                })
              }
              else
              {
                Toast.fire({
                  icon: 'error',
                  title: response.data.error
                }).then((result) => {
                  $(this).data('clicked', 0);
                })
              }
            });
          }
          else 
          {
            console.log('ATUALIZANDO COMANDA: ' + Comanda)

            pedido = {
              id: Id,
              Mesa: Mesa,
              comanda: Comanda,
              itens: {
                pastel: Pastel,
                pastelDoce: PastelDoce,
                entrada: Entrada,
                bebida: Bebida      
              },
              produtosImprimir: {
                pastel: Pastel,
                pastelDoce: PastelDoce,
                entrada: Entrada,
                bebida: Bebida      
              },
              total: total[0].valor
            }

            api.put('/pedidos', pedido).then((response) => {
              if(response.status === 200)
              {
                Toast.fire({
                  icon: 'success',
                  title: response.data.message
                }).then((result) => {
                  handleClear();
                  $(this).data('clicked', 0);
                })
              }
              else
              {
                Swal.fire({
                  title:'Erro!',
                  text: response.data.error,
                  icon: 'error',
                  timer: 2000
                }).then((result) => {
                  handleClear();
                  $(this).data('clicked', 0);
                })
              }
            });
            setMetodo('PEDIR')
          }
          //<Print pedido={pedido}/>
        }
        return; // <-- we stop the rest of the handler from running
      }
    }

    function handleClear()
    {
      $('#Comanda').css("color", '#000000');

      $('#Mesa').removeClass('errorMesa');
      
      setMesa('');

      setComanda(0);

      setMetodo('PEDIR')

      setIsDisabled(false)

      setId(null)

      setTotal([{
        display: '.00',
        valor: 0
      }])
      setTotalPagar([{
        display: '.00',
        valor: 0
      }])

      setPastel(Produtos.pastel)
      setPastelPagar(Produtos.pastel)
      setPastelDoce(Produtos.pastelDoce)
      setPastelDocePagar(Produtos.pastelDoce)
      setEntrada(Produtos.entrada)
      setEntradaPagar(Produtos.entrada)
      setBebida(Produtos.bebida)
      setBebidaPagar(Produtos.bebida)
    }

    function handlePedido(_id)
    {
      api.get('/pedidos/' + _id).then(function ({data}) {
        if(data){
          //handleItensPedido(data);
        } 
      })
    }

    function handleItensPedidoPagar(itens)
    {
      setComanda(itens.comanda);
      setMesa(itens.mesa);
      handleShow()
      setTotal([{
        display: '.00',
        valor: 0
      }])
      setPastel(Produtos.pastel)
      setPastelDoce(Produtos.pastelDoce)
      setEntrada(Produtos.entrada)
      setBebida(Produtos.bebida)
      setTotalPagar([{
        display: '.00',
        valor: itens.total
      }])
      setId(itens._id)

      const newValuePastelPagar = PastelPagar.map(item => {
        const Index = itens.itens.pastel.findIndex(obj => obj.id === item.id);
        if(Index != -1){
          if(itens.itens.pastel[Index].qtd >= 10){
            return {...item, qtd: itens.itens.pastel[Index].qtd, display: ''}
          }
          return {...item, qtd: itens.itens.pastel[Index].qtd}
        }
        else
        {
          return item
        }
      })

      setPastelPagar(newValuePastelPagar);

      const newValuePastelDocePagar = PastelDocePagar.map(item => {
        const Index = itens.itens.pastelDoce.findIndex(obj => obj.id === item.id);
        if(Index != -1){
          if(itens.itens.pastelDoce[Index].qtd >= 10){
            return {...item, qtd: itens.itens.pastelDoce[Index].qtd, display: ''}
          }
          return {...item, qtd: itens.itens.pastelDoce[Index].qtd}
        }
        else
        {
          return item
        }
      })

      setPastelDocePagar(newValuePastelDocePagar);

      const newValueEntradaPagar = EntradaPagar.map(item => {
        const Index = itens.itens.entrada.findIndex(obj => obj.id === item.id);
        if(Index != -1){
          if(itens.itens.entrada[Index].qtd >= 10){
            return {...item, qtd: itens.itens.entrada[Index].qtd, display: ''}
          }
          return {...item, qtd: itens.itens.entrada[Index].qtd}
        }
        else
        {
          return item
        }
      })

      setEntradaPagar(newValueEntradaPagar);

      const newValueBebidaPagar = BebidaPagar.map(item => {
        const Index = itens.itens.bebida.findIndex(obj => obj.id === item.id);
        if(Index != -1){
          if(itens.itens.bebida[Index].qtd >= 10){
            return {...item, qtd: itens.itens.bebida[Index].qtd, display: ''}
          }
          return {...item, qtd: itens.itens.bebida[Index].qtd}
        }
        else
        {
          return item
        }
      })

      setBebidaPagar(newValueBebidaPagar);
    }

    function handleItensPedido(itens)
    {
      setIsDisabled(true)
      setTotal(totalPagar)
      setPastel(PastelPagar)
      setPastelDoce(PastelDocePagar)
      setEntrada(EntradaPagar)
      setBebida(BebidaPagar)
    }

    const handlePayClick = (event) => 
    {
      event.preventDefault();
      event.stopPropagation();

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
        title: 'Confirmar pagamento.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      })

      if(Id != null){
        ToastButtons.fire({}).then((result) => {
          if (result.isConfirmed) {console.log(Id)
            api.put('/pedidos/pagar/' + Id).then((response) => {
              if(response.status === 201)
              {console.log(response)
                Toast.fire({
                  icon: 'success',
                  title: response.data.message
                })
              }
              else
              {
                Toast.fire({
                  icon: 'error',
                  title: 'Ocorreu algum erro e a comanda não foi paga.'
                })
              }
              handleCloseClear()
            });
          }
        })
      }
    }

    function isDecimal(n) {
      var result = n - Math.floor(n) !== 0;
      if (result) return true;
      else return false;
    }

    return (
        <section className="conteudo">
          <section className="itens">
            <div className="itens-split">
              <div className="tablePasteisSalgados">
                <p className="titlePasteisSalgados">Pasteis</p>
                {Pastel.map((item) => <div className="buttonItens"><div className="item"><div className="count">{item.display + item.qtd}</div><div className="bar"><p></p></div><div className="nomeItem">{item.item}</div></div><button className="marginButton" onClick={() => handleDecreasePastel(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button><button onClick={() => handleIncrementPastel(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button></div>)}
              </div>
            </div>
            <div className="itens-split">
              <div className="tablePasteisDoces">
                <p className="titlePasteisDoces">Pasteis Doces</p>
                {PastelDoce.map((item) => <div className="buttonItens"><div className="item"><div className="count">{item.display + item.qtd}</div><div className="bar"><p></p></div><div className="nomeItem">{item.item}</div></div><button className="marginButton" onClick={() => handleDecreasePastelDoce(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button><button onClick={() => handleIncrementPastelDoce(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button></div>)}
              </div>
              <div className="tableEntrada">
                <p className="titleEntrada">Entradas</p>
                {Entrada.map((item) => <div className="buttonItens"><div className="item"><div className="count">{item.display + item.qtd}</div><div className="bar"><p></p></div><div className="nomeItem">{item.item}</div></div><button className="marginButton" onClick={() => handleDecreaseEntrada(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button><button onClick={() => handleIncrementEntrada(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button></div>)}
              </div>
              <div className="tableBebidas">
                <p className="titleBebidas">Bebidas</p>
                {Bebida.map((item) => item.tipoBebida === 0 ? <div className="buttonItens"><div className="item"><div className="count">{item.display + item.qtd}</div><div className="bar"><p></p></div><div className="nomeItem">{item.item}</div></div><button className="marginButton" onClick={() => handleDecreaseBebida(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button><button onClick={() => handleIncrementBebida(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button></div>  : null)}
              </div>
            </div>
            <div className="itens-split">
              <div className="tableBebidas">
                <p className="titleBebidas">Sucos</p>
                {Bebida.map((item) => item.tipoBebida === 3 || item.tipoBebida === 4 ? <div className="buttonItens"><div className="item"><div className="count">{item.display + item.qtd}</div><div className="bar"><p></p></div><div className="nomeItem">{item.item}{item.tipoBebida === 4 ? <div> (JARRA)</div> : <div> (COPO)</div>}</div></div><button className="marginButton" onClick={() => handleDecreaseBebida(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button><button onClick={() => handleIncrementBebida(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button></div>  : null)}
              </div>
              <div className="tableBebidas">
                <p className="titleBebidas">Cervejas Latas</p>
                {Bebida.map((item) => item.tipoBebida === 1 ? <div className="buttonItens"><div className="item"><div className="count">{item.display + item.qtd}</div><div className="bar"><p></p></div><div className="nomeItem">{item.item}</div></div><button className="marginButton" onClick={() => handleDecreaseBebida(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button><button onClick={() => handleIncrementBebida(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button></div>  : null)}
              </div>
              <div className="tableBebidas">
                <p className="titleBebidas">Long Neck</p>
                {Bebida.map((item) => item.tipoBebida === 2 ? <div className="buttonItens"><div className="item"><div className="count">{item.display + item.qtd}</div><div className="bar"><p></p></div><div className="nomeItem">{item.item}</div></div><button className="marginButton" onClick={() => handleDecreaseBebida(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button><button onClick={() => handleIncrementBebida(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button></div>  : null)}
              </div>
            </div>
            <div className="tableCarrinho">
                <div className="titleCarrinho">Total</div>
                <div className="carrinho">
                  {
                    Pastel.map((item) => item.qtd > 0 ? <p>{item.qtd}x {item.item}</p> : null)
                  }{
                    PastelDoce.map((item) => item.qtd > 0 ? <p>{item.qtd}x {item.item}</p> : null)
                  }{
                    Entrada.map((item) => item.qtd > 0 ? <p>{item.qtd}x {item.item}</p> : null)
                  }{
                    Bebida.map((item) => item.qtd > 0 ? item.tipoBebida === 1 ? <p>{item.qtd}x {item.item} (LATA)</p> : item.tipoBebida === 2 ? <p>{item.qtd}x {item.item} (LONG NECK)</p> : item.tipoBebida === 4 ? <p>{item.qtd}x {item.item} (JARRA)</p> : item.tipoBebida === 3 ? <p>{item.qtd}x {item.item} (COPO)</p> : <p>{item.qtd}x {item.item}</p> : null)
                  } 
                </div>
                <div className="carrinhoValorTotal"><div className="carrinhoRS">R$:</div><div className="carrinhoValor"><div>{total[0].valor}{isDecimal(total[0].valor) ? '0' : total[0].display}</div></div></div>
                <div className="carrinhoInputs">
                  <input type="Text" className="inputMesa" id="Mesa" maxLength={25} placeholder="nome ou mesa.." value={Mesa} disabled={isDisabled} onChange={handleMesa}/>
                  <input type="Comanda" className="inputComanda" id="Comanda" maxLength={3} value={Comanda} disabled={isDisabled} onChange={handleComanda} onClick={selectText} max={100}/>
                </div>
                <div className="carrinhoConcluir">
                  <button type="button" className="buttonPesquisar" onClick={handlePesquisarPedido}><FontAwesomeIcon icon={faMagnifyingGlass} size="lg" style={{color: "#000000",}} /></button>
                  <button type="button" className="buttonLimpar" onClick={handleClear}><FontAwesomeIcon icon={faTrashCan} size="lg" style={{color: "#000000",}} /></button>     
                  <button type="button" className="buttonConcluir" onClick={handleCreatePedido}><span>{Metodo}</span></button>
                </div>
            </div>
          </section>

          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show} 
            onHide={handleCloseClear}
          >
            <Modal.Header closeButton>
              <div className="modalDivComanda"><div className="modalComanda">Comanda -<div className="modalInfoComanda">{Comanda}</div></div></div>
            </Modal.Header>
            <Modal.Body>
              {
                PastelPagar.map((item) => item.qtd > 0 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
              }{
                PastelDocePagar.map((item) => item.qtd > 0 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
              }{
                EntradaPagar.map((item) => item.qtd > 0 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
              }{
                BebidaPagar.map((item) => item.qtd > 0 ? <div className="modalItensComanda"><div className="modalItemComanda">{item.qtd}</div><div className="modalXItemComanda">x</div><div className="modalNomeItemComanda">{item.item}{item.tipoBebida === 1 ? <div> (LATA) </div> : item.tipoBebida === 2 ? <div> (LONG NECK) </div> : item.tipoBebida === 3 ? <div> (COPO) </div> : item.tipoBebida === 4 ? <div> (JARRA) </div> : null}</div><div className="modalValorItemComanda">{item.preco}{isDecimal(item.preco) ? '0' : '.00'}</div></div> : null)
              } 
            </Modal.Body>
            <Modal.Footer>
              <button type="button" id="btnEditar" onClick={handleCloseEditar} ><FontAwesomeIcon icon={faPen} size="lg" /></button><button type="button" id="btnPagar" onClick={e => handlePayClick(e)} ><FontAwesomeIcon icon={faDollarSign} size="xl" /></button><div className="totalPagar">Total: {totalPagar[0].valor}{isDecimal(totalPagar[0].valor) ? '0' : totalPagar[0].display}</div>
            </Modal.Footer>
          </Modal>

        </section>
  );
}

export default Home;