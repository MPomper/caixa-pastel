import { useState } from "react";
import { api } from '../../Service/API'

export default function useUser()
{

    const [user, setUser] = useState(null)

    const getUser = () => user

    const setUserAtualizado = () => {
        api.get('/users/' + user.ra + "/" + user.senha).then(function ({data}) {
            if(data){
                setUser(data);
                return user
            }
        })
    }

    return { getUser, setUser, setUserAtualizado }
    
}