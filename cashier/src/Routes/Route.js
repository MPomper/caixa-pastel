import Home from "../Home/Home";
import Pedidos from "../Pedidos/Pedidos";
import Navbar from "../Navbar/Navbar";
import FirstScreen from "../Telas/FirstScreen";
import Produto from "../Produto/Produto";
import HomeMobile from "../HomeMobile/HomeMobile";
import { Context } from "../Context/DadosGlobais";
import { useContext } from "react";
import Print from "../Print/Print";


const { BrowserRouter, Routes, Route } = require("react-router-dom");

function Rotas()
{
    const {UserActions} = useContext(Context)

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

    return(
        <BrowserRouter>
            <Navbar />
            <Routes>
                {detectMobile() == false ? <>
                <Route path="/" element={<FirstScreen />} />
                <Route path="/home" element={<Home />} />
                <Route path="/home/:_id" element={<Home />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/produto" element={<Produto />} />
                <Route path="/homeMobile" element={<HomeMobile />} />
                <Route path="/print" element={<Print />} />
                </>
                :
                <>
                <Route path="/" element={<FirstScreen />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/homeMobile" element={<HomeMobile />} />
                </>
                }
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;