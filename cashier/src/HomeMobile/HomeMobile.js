import { useEffect, useState } from "react";
import '../HomeMobile/HomeMobile.css'
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faMinus } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { api } from "../Service/API";
import { $ }  from 'react-jquery-plugin'

function HomeMobile(prop)
{
    const [Comanda, setComanda] = useState();
    const [Mesa, setMesa] = useState('');

    const [tela, setTela] = useState(1);

    const [Pesquisa, setPesquisa] = useState('');

    const [Pastel, setPastel] = useState([{}]);
    const [PastelPagar, setPastelPagar] = useState([{}]);
    const [PastelPesquisar, setPastelPesquisar] = useState([{}]);
    const [PastelDoce, setPastelDoce] = useState([{}]);
    const [PastelDocePagar, setPastelDocePagar] = useState([{}]);
    const [PastelDocePesquisar, setPastelDocePesquisar] = useState([{}]);
    const [Entrada, setEntrada] = useState([{}]);
    const [EntradaPagar, setEntradaPagar] = useState([{}]);
    const [EntradaPesquisar, setEntradaPesquisar] = useState([{}]);
    const [Bebida, setBebida] = useState([{}]);
    const [BebidaPagar, setBebidaPagar] = useState([{}]);
    const [BebidaPesquisar, setBebidaPesquisar] = useState([{}]);
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
            setPastelPesquisar(data.pastel)
            setPastelDoce(data.pastelDoce)
            setPastelDocePagar(data.pastelDoce)
            setPastelDocePesquisar(data.pastelDoce)
            setEntrada(data.entrada)
            setEntradaPagar(data.entrada)
            setEntradaPesquisar(data.entrada)
            setBebida(data.bebida)
            setBebidaPagar(data.bebida)
            setEntradaPesquisar(data.entrada)
            setProdutos(data)
          }
        })
      }, [])
    function handleClear()
    {
      $('#Comanda').css("color", '#000000');
      
      setComanda();
      setMesa();

      setPesquisa('');

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

    function handlePesquisar(evt)
    {
    /*  setPesquisa(evt.target.value)

      api.get('/produtos/produto/' + Pesquisa).then(function ({data}) {
        console.log(data)
        if(data){
          setPastelPesquisar(data.pastel)
          setPastelDocePesquisar(data.pastelDoce)
          setEntradaPesquisar(data.entrada)
          setBebidaPesquisar(data.bebida)
        }
      })*/
    }
    
    const handleIncrementPastel = (id) => 
    {
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
    }
    
    const handleDecreasePastel = (id) => 
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
    }

    const handleIncrementPastelDoce = (id) =>
    {
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
    }
  
    const handleDecreasePastelDoce = (id) =>
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
    }

    const handleIncrementEntrada = (id) =>
    {
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
    }
  
    const handleDecreaseEntrada = (id) =>
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
    }

    const handleIncrementBebida = (id) => 
    {
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
    }

    const handleDecreaseBebida = (id) => 
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
    }

    const handleIncrementTotal = (value) => 
    {
        const newValue = total.map(obj => {
          return {...obj, valor: obj.valor + value};
        });

        setTotal(newValue);
    }

    const handleDecreaseTotal = (value) => {
        const newValue = total.map(obj => {
          if(obj.valor > 0)
            return {...obj, valor: obj.valor - value};
          else
            return {...obj, valor: 0};
        });

        if(newValue[0].valor <= 0)
        {
            handleClear()
            handleChangeTela(1)
        }

        setTotal(newValue);
    }

    const handleExluirProdutoPastel = (id) => 
    {
        const newValue = Pastel.map(obj => {
            if (obj.id === id) {
              if(obj.qtd > 0){
                var valor = obj.qtd * obj.preco
                handleDecreaseTotal(valor)
                return {...obj, qtd: 0};
              }
            }

            return obj;
        });

        setPastel(newValue);
    }

    const handleExluirProdutoPastelDoce = (id) => 
    {
        const newValue = PastelDoce.map(obj => {
            if (obj.id === id) {
              if(obj.qtd > 0){
                var valor = obj.qtd * obj.preco
                handleDecreaseTotal(valor)
                return {...obj, qtd: 0};
              }
            }

            return obj;
        });

        setPastelDoce(newValue);
    }

    const handleExluirProdutoEntrada = (id) => 
    {
        const newValue = Entrada.map(obj => {
            if (obj.id === id) {
              if(obj.qtd > 0){
                var valor = obj.qtd * obj.preco
                handleDecreaseTotal(valor)
                return {...obj, qtd: 0};
              }
            }

            return obj;
        });

        setEntrada(newValue);
    }

    const handleExluirProdutoBebida = (id) => 
    {
        const newValue = Bebida.map(obj => {
            if (obj.id === id) {
              if(obj.qtd > 0){
                var valor = obj.qtd * obj.preco
                handleDecreaseTotal(valor)
                return {...obj, qtd: 0};
              }
            }

            return obj;
        });

        setBebida(newValue);
    }

    function handleOnlyNumberComanda (evt) {
        var numsStr = evt.target.value.replace(/[^0-9]/g, '');
        if(numsStr == '')
        {
            setComanda(0)
        } 
        else {
            setComanda(parseInt(numsStr))
        }
    }

    function handleOnlyNormalCharacteresMesaNome (evt) {
        var string = evt.target.value.replace(/[^\w\s]/gi, '');
        if(string == '')
        {
            setMesa('')
        } 
        else {
            setMesa(string)
        }
    }

    function temProdutoComQuantidade () {
        var temProduto = false
        
        var produto = Pastel.filter(function(element) {
              return element.qtd > 0
        })
        console.log('pastel: ' + produto)
        if (produto.length > 0)
            return true

        var produto = PastelDoce.filter(function(element) {
              return element.qtd > 0
        })
        console.log('pastelDoce: ' + produto)
        if (produto.length > 0)
            return true

        var produto = Entrada.filter(function(element) {
              return element.qtd > 0
        })
        console.log('entrada: ' + produto)
        if (produto.length > 0)
            return true

        var produto = Bebida.filter(function(element) {
              return element.qtd > 0
        })
        console.log('bebida: ' + produto)
        if (produto.length > 0)
            return true

        return temProduto
    }

    function temPastelComQuantidade () {
        var temProduto = false
        
        var produto = Pastel.filter(function(element) {
              return element.qtd > 0
        })

        if (produto.length > 0)
            return true

        return temProduto
    }

    function temPastelDoceComQuantidade () {
        var temProduto = false

        var produto = PastelDoce.filter(function(element) {
              return element.qtd > 0
        })

        if (produto.length > 0)
            return true

        return temProduto
    }

    function temEntradaComQuantidade () {
        var temProduto = false

        var produto = Entrada.filter(function(element) {
              return element.qtd > 0
        })

        if (produto.length > 0)
            return true

        return temProduto
    }

    function temBebidaComQuantidade () {
        var temProduto = false

        var produto = Bebida.filter(function(element) {
              return element.qtd > 0
        })

        if (produto.length > 0)
            return true

        return temProduto
    }

    function temMesaEComanda () {
        var temMesaEComanda = false
        
        if (Comanda > 0 && Comanda != null && Comanda != undefined)
            temMesaEComanda = true
        
        if(temMesaEComanda && Mesa != '' && Mesa != null && Mesa != undefined)
            temMesaEComanda = true
        else
            temMesaEComanda = false

        return temMesaEComanda
    }

    function handleChangeTela (tela) {
        setTela(tela)
    }

    function handleCreatePedido(evt)
    {
        var state = $(this).data('clicked') || 0;
        let pedido = {}

        if(state === 0)
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

            evt.preventDefault();
            evt.stopPropagation();
            state++; // <-- we increment the state
            $(this).data('clicked', state);// <-- and store it back in data

            if(Mesa == '0'|| Mesa === '' || Mesa == null || Mesa == undefined)
            {
              Toast.fire({
                icon: 'error',
                title: 'Pedido não foi realizado!',
                text: 'É necessário ter uma mesa ou nome!'
              })
              $('#MesaNomeInput > label').css("color", '#FA163F');
            }
            else if(Comanda === 0 || parseInt(Comanda) > 100)
            {
              Toast.fire({
                icon: 'error',
                title: 'Pedido não foi realizado!',
                text: 'É necessário ter um numero de comanda e ser menor ou igual a 100!'
              })
              $('.ComandaInput > label').css("color", '#FA163F');
            }
            else if(total[0].valor <= 0)
            {
              Toast.fire({
                icon: 'error',
                title: 'Pedido não foi realizado!',
                text: 'É necessário ter ao menos um item no carrinho!'
              })
            }
            else
            {
                pedido = 
                {
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
                            handleClear();
                            handleChangeTela(1);
                            $(this).data('clicked', 0);
                        })
                    }
                    else
                    {
                        Toast.fire({
                          icon: 'error',
                          title: response.data.error
                        }).then((result) => {
                            handleClear();
                              handleChangeTela(1);
                            $(this).data('clicked', 0);
                        })
                    }
                });
            }
        return; // <-- we stop the rest of the handler from running
        }
    }

    return (
        tela === 1 ?
            /* COM CAMPO DE PROCURAR PRODUTO
            <section className="pageMobile">
                <section className="cardMobile">
                    <section id="InicioProdutosMobile">
                        <section id="ProdutosMobile">Lu & Paulo Pastéis</section>
                    </section>
                    <section class="wrapper">
                      <section class="icon"><FontAwesomeIcon size="xl" icon={faMagnifyingGlass} /></section>
                      <input class="input searchInputMobile" type="text" value={Pesquisa} onChange={handlePesquisar}></input>
                    </section>
                    <section className="produtosMobile">
                        <section className="tableProduto">
                            <section className="titleProduto">Pastéis</section>
                            {Pastel.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreasePastel(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementPastel(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}
                                    </section>
                                </section>
                            )}
                        </section>
                        <section className="tableProduto">
                            <section className="titleProduto">Pastéis Doces</section>
                            {PastelDoce.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreasePastelDoce(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementPastelDoce(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}
                                    </section>
                                </section>
                            )}
                        </section>
                        <section className="tableProduto">
                            <section className="titleProduto">Entradas</section>
                            {Entrada.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreaseEntrada(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementEntrada(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}
                                    </section>
                                </section>
                            )}
                        </section>
                        <section className="tableProduto">
                            <section className="titleProduto">Bebidas</section>
                            {Bebida.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreaseBebida(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementBebida(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}
                                    </section>
                                </section>
                            )}
                        </section>
                    </section>
                    <section className="footerButtonsMobile">
                        <button className="btnMobile limp" onClick={handleClear}>LIMPAR</button>
                        { temProdutoComQuantidade() ? <button className="btnMobile prox" onClick={() => handleChangeTela(2)}>PRÓXIMO</button> :  <button className="btnMobile disableBtn prox" disabled>PRÓXIMO</button> }
                    </section>
                </section>
            </section>*/
            <section className="pageMobile">
                <section className="cardMobile">
                    <section id="InicioProdutosMobile">
                        <section id="ProdutosMobile">Lu & Paulo Pastéis</section>
                    </section>
                    <section className="produtosSemSearchMobile">
                        <section className="tableProduto">
                            <section className="titleProduto">Pastéis</section>
                            {Pastel.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreasePastel(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementPastel(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}
                                    </section>
                                </section>
                            )}
                        </section>
                        <section className="tableProduto">
                            <section className="titleProduto">Pastéis Doces</section>
                            {PastelDoce.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreasePastelDoce(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementPastelDoce(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}
                                    </section>
                                </section>
                            )}
                        </section>
                        <section className="tableProduto">
                            <section className="titleProduto">Entradas</section>
                            {Entrada.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreaseEntrada(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementEntrada(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}
                                    </section>
                                </section>
                            )}
                        </section>
                        <section className="tableProduto">
                            <section className="titleProduto">Bebidas</section>
                            {Bebida.map((item) => 
                                <section className="produtoContainer">
                                    <section className="contadorMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleDecreaseBebida(item.id)}><FontAwesomeIcon icon={faMinus} size="sm" /></button>
                                        <section className="quantidadeMobile">{item.qtd}</section>
                                        <button className="btnIncrementMobile" onClick={() => handleIncrementBebida(item.id)}><FontAwesomeIcon icon={faPlus} size="sm" /></button>
                                    </section>
                                    <section className="itemMobile">
                                        {item.item}{item.tipoBebida === 1 ? <div style={{fontWeight: '600'}}> (LATA)</div> : item.tipoBebida === 2 ? <div style={{fontWeight: '600'}}> (LONG NECK)</div> : item.tipoBebida === 3 ? <div style={{fontWeight: '600'}}> (COPO)</div> : item.tipoBebida === 4 ? <div style={{fontWeight: '600'}}> (JARRA)</div> : ''}
                                    </section>
                                </section>
                            )}
                        </section>
                    </section>
                    <section className="footerButtonsMobile">
                        <button className="btnMobile limp" onClick={handleClear}>LIMPAR</button>
                        { temProdutoComQuantidade() ? <button className="btnMobile prox" onClick={() => handleChangeTela(2)}>PRÓXIMO</button> :  <button className="btnMobile disableBtn prox" disabled>PRÓXIMO</button> }
                    </section>
                </section>
            </section>
        :
            <section className="pageMobile">
                <section className="cardMobile">
                    <section id="InicioComandaMobile">
                        <section id="ComandaMobile">
                            <section className="inputGroupMobile MesaNomeInput">
                                <label>MESA / NOME:</label>
                                <input class="input InputMobile" type="text" maxLength={25} value={Mesa} onChange={handleOnlyNormalCharacteresMesaNome}></input>
                            </section>
                            <section className="inputGroupMobile ComandaInput">
                                <label>COMANDA:</label>
                                <input class="input InputMobile" type="text" maxLength={3} value={Comanda} onChange={handleOnlyNumberComanda}></input>
                            </section>
                        </section>
                    </section>
                    <section className="produtosMobile">
                        <section className="tableProduto">
                        { temPastelComQuantidade() ? <section className="titleProduto">Pastéis</section> :  <></> }
                            {Pastel.map((item) => item.qtd > 0 ?
                                <section className="produtoContainer">
                                    <section className="excluirProdutoMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleExluirProdutoPastel(item.id) }><FontAwesomeIcon icon={faTrashAlt} size="sm" /></button>
                                    </section>
                                    <section className="itemListaMobile">
                                        <div>{item.qtd}x</div>
                                        <div className="nomeProdutoMobile">{item.item}</div>
                                    </section>
                                </section>
                                :
                                <></>
                            )}
                        </section>
                        <section className="tableProduto">
                        { temPastelDoceComQuantidade() ? <section className="titleProduto">Pastéis Doces</section> :  <></> }
                            {PastelDoce.map((item) => item.qtd > 0 ?
                                <section className="produtoContainer">
                                    <section className="excluirProdutoMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleExluirProdutoPastelDoce(item.id)}><FontAwesomeIcon icon={faTrashAlt} size="sm" /></button>
                                    </section>
                                    <section className="itemListaMobile">
                                        <div>{item.qtd}x</div>
                                        <div className="nomeProdutoMobile">{item.item}</div>
                                    </section>
                                </section>
                                :
                                <></>
                            )}
                        </section>
                        <section className="tableProduto">
                        { temEntradaComQuantidade() ? <section className="titleProduto">Entradas</section> :  <></> }
                            {Entrada.map((item) => item.qtd > 0 ?
                                <section className="produtoContainer">
                                    <section className="excluirProdutoMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleExluirProdutoEntrada(item.id)}><FontAwesomeIcon icon={faTrashAlt} size="sm" /></button>
                                    </section>
                                    <section className="itemListaMobile">
                                        <div>{item.qtd}x</div>
                                        <div className="nomeProdutoMobile">{item.item}</div>
                                    </section>
                                </section>
                                :
                                <></>
                            )}
                        </section>
                        <section className="tableProduto">
                        { temBebidaComQuantidade() ? <section className="titleProduto">Bebidas</section> :  <></> }
                            {Bebida.map((item) => item.qtd > 0 ?
                                <section className="produtoContainer">
                                    <section className="excluirProdutoMobile">
                                        <button className="btnDecreaseMobile" onClick={() => handleExluirProdutoBebida(item.id)}><FontAwesomeIcon icon={faTrashAlt} size="sm" /></button>
                                    </section>
                                    <section className="itemListaMobile">
                                        <div>{item.qtd}x</div>
                                        <div className="nomeProdutoMobile">{item.item}{item.tipoBebida === 1 ? <div> (LATA)</div> : item.tipoBebida === 2 ? <div> (LONG NECK)</div> : item.tipoBebida === 3 ? <div> (COPO)</div> : item.tipoBebida === 4 ? <div> (JARRA)</div> : ''}</div>
                                    </section>
                                </section>
                                :
                                <></>
                            )}
                        </section>
                    </section>
                    <section className="precoTotalMobile">
                        <span className="valorMobile">R$ {total[0].valor}</span>
                    </section>
                    <section className="footerButtonsMobile">
                        <button className="btnMobile limp" onClick={() => handleChangeTela(1)}>VOLTAR</button>
                        { temMesaEComanda() ? <button className="btnMobile prox" onClick={handleCreatePedido}>FAZER PEDIDO</button> :  <button className="btnMobile disableBtn prox" disabled>FAZER PEDIDO</button> }
                    </section>
                </section>
            </section>
  );
}

export default HomeMobile;