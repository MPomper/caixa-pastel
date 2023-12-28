import { useContext, useState } from 'react';
import { Context } from "../Context/DadosGlobais";
import { api } from '../Service/API';
import './Login.css';
import Swal from 'sweetalert2'

function Login() {

    const[login, setLogin] = useState("")
    const[senha, setSenha] = useState("")

    const {UserActions} = useContext(Context)

    function handleUsuario(evt)
    {
        setLogin(evt.target.value);
        console.log(evt.target.value);
    }

    function handleSenha(evt)
    {
        setSenha(evt.target.value);
    }

    function handleLogin()
    {
        if(login != '' && senha.length > 0){
            api.get('/users/' + login + "/" + senha).then((response) => {
                if(response.status === 203){
                    Swal.fire({
                      title:'Erro!',
                      text: response.data.message,
                      icon: 'error'
                    });
                }
                else
                {
                    if(response.data){
                        console.log(response);
                        UserActions.setUser(response.data);  
                    }
                }
            })
        }
    }

    return (
        <>
            {UserActions.getUser()==null && 
                <div className='loginContainer'>
                    <div className='bodyClass loginCashier'>
                        <div className='sectionClass'>
                            <header>
                                <h1>SISTEMA DO PASTEL</h1>
                            </header>
                            <form id="frmLogin">
                                <input type="text" name="login" value={login} onChange={handleUsuario} className="inputRA" placeholder="Login"/>
                                <input type="password" name="senha" value={senha} onChange={handleSenha} className="inputSenha" placeholder="Senha"/>
                            </form>
                            <div className="submit">
                                <button type="submit" className="btnSubmit" onClick={handleLogin} id="SubmitLogin">Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Login;
