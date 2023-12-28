import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row } from "react-bootstrap";
import React from 'react'
import { Link } from 'react-router-dom';
import './FirstScreen.css';

function FirstScreen() {

  function detectMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

  return (
    //  BOTÃO REMOVIDO NO MOMENTO - INACABADO  //
    //<Link target='_blank' to={"/produto"}><Button size='lg' className='buttonFirstScreen' variant="outline-danger">NOVO PRODUTO</Button>{' '}</Link>
    <div>
      <div className="d-grid gap-2">
        {detectMobile()== false ? <>
        <Link target='_blank' to={"/home"}><Button size='lg' className='buttonFirstScreen' variant="outline-danger">FAZER PEDIDO</Button>{' '}</Link>
        <Link target='_blank' to={"/pedidos"}><Button size='lg' className='buttonFirstScreen' variant="outline-danger">PEDIDOS FEITOS</Button>{' '}</Link>
        <Link target='_blank' to={"/print"}><Button size='lg' className='buttonFirstScreen' variant="outline-danger">IMPRIMIR PEDIDO</Button>{' '}</Link>
        <Link target='_blank' to={"/homeMobile"}><Button size='lg' className='buttonFirstScreen' variant="outline-danger">FAZER PEDIDO MOBILE</Button>{' '}</Link>
        <Link to={""}><Button size='lg' className='buttonFirstScreen' style={{backgroundColor: '#DC35458A'}} variant="outline-danger">NOVO PRODUTO</Button>{' '}</Link>
        </>
        :
        <>
        <Link target='_blank' to={"/homeMobile"}><Button size='lg' className='buttonFirstScreenMobile' variant="outline-danger">FAZER PEDIDO</Button>{' '}</Link>
        <Link target='_blank' to={"/pedidos"}><Button size='lg' className='buttonFirstScreenMobile' variant="outline-danger">PEDIDOS FEITOS</Button>{' '}</Link>
        </>
        }
      </div>
    </div>
  );
}

export default FirstScreen;