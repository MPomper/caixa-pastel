import { createContext } from "react";
import useUser from "./hooks/useUser";


const Context = createContext()

function DadosGlobais({children})
{
    const UserActions = useUser()

    return (
        <Context.Provider value={{UserActions: UserActions}}>
            {children}
        </Context.Provider>
    );
}


export {DadosGlobais, Context}