import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from "react";
import { api } from "../Service/API";
import './Produto.css';
import { InputGroup } from 'react-bootstrap';
import { $ } from 'react-jquery-plugin';

function Produto() {

    /*const [TipoProduto, setTipoProduto] = useState([{}]);
    const [TipoBebida, setTipoBebida] = useState([{}]);
    const [TipoProdutoSelecionado, setTipoProdutoSelecionado] = useState(0);
    const [TipoBebidaSelecionado, setTipoBebidaSelecionado] = useState(0);
    const [Produto, setProduto] = useState('');
    const [Money, setMoney] = useState();
    const [MoneyMask, setMoneyMask] = useState();

    useEffect(() => {
        api.get('/produtos/tipo').then(function ({data}) {
          console.log(data)
          if(data){
            setTipoProduto(data.tipoProduto)
            setTipoBebida(data.tipoBebida)
          }
        })

        $('#bebida').hide();
      }, [])

    function validateMoney(evt) {
        var value = evt.target.value.replace('.', '').replace(',', '').replace(/\D/g, '')
        
        const options = { minimumFractionDigits: 2 }
        var result = new Intl.NumberFormat('pt-BR', options).format(
          parseFloat(value) / 100
        )
        var valueReal = result
        valueReal = valueReal.replace('.', '').replace(',', '.')
        if(valueReal.slice(-2) == '00')
          valueReal = valueReal.split('.')[0]

        setMoney(valueReal);
        setMoneyMask(result);
    }

    function handleProduto(evt)
    {
      setProduto(evt.target.value)
    }

    function handleTipoBebida(evt)
    {
      setTipoBebidaSelecionado(evt.target.value)
    }

    function handleTipoProduto(evt)
    {
      if(evt.target.value == 3)
        $('#bebida').show();
      else
      {
        $('#bebida').hide();
        setTipoBebidaSelecionado(0)
      }

      setTipoProdutoSelecionado(evt.target.value)
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

        if(TipoProdutoSelecionado == 0)
        {
          Toast.fire({
            icon: 'error',
            title: 'Produto não foi criado!',
            text: 'É necessário ter um tipo de produto!'
          })
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
              comanda: Comanda,
              itens: {
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
        }
        return; // <-- we stop the rest of the handler from running
      }
    }

  return (
    <Form>
      <Row className='tipo'>
        <Col xs={8}>
            <Form.Label>TIPO DO PRODUTO</Form.Label>
            <Form.Select size="lg" value={TipoProdutoSelecionado} onChange={handleTipoProduto}>
                {TipoProduto.map((item) => <option value={item.id}>{item.nome}</option>)}
            </Form.Select>
        </Col>
        <Col className=''>
          <Form.Group id="bebida">
            <Form.Label>TIPO DA BEBIDA</Form.Label>
            <Form.Select size="lg" value={TipoBebidaSelecionado} onChange={handleTipoBebida}>
                {TipoBebida.map((item) => <option value={item.id}>{item.nome}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className='tipo'>
        <Col xs={8}>
            <Form.Label>PRODUTO</Form.Label>
            <Form.Control size='lg' value={Produto} onChange={handleProduto} placeholder="Nome do Produto." />
        </Col>
        <Col>
            <Form.Label>PREÇO</Form.Label>
            <InputGroup size='lg' className="mb-3">
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control onChange={validateMoney} value={MoneyMask} aria-label="Amount (to the nearest dollar)" />
            </InputGroup>
        </Col>
      </Row>
    </Form>
  );*/
}

export default Produto;