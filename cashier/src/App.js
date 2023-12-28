import { DadosGlobais } from './Context/DadosGlobais';
import Login from './Login/Login';
import Rotas from './Routes/Route';

function App() {
  return (
    <DadosGlobais>
      <Rotas/>
    </DadosGlobais>
    /*<DadosGlobais>
      <Login />
      <Rotas/>
    </DadosGlobais>*/
  );
}

export default App;
