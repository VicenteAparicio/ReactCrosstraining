import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import '../../assets/fontcolors.css';
import './login.css';

const Loginer = () => {

    let history = useHistory();

    // Hooks
    const [credentials, setCredentials] = useState({email:'',password:'',options:'user'});

    const [msgError, setMensajeError] = useState('');

    // Handler
    const updateCredentials = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }

    const logueame = async () => {
        //Primero  testeamos los datos
        if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/){
            setMensajeError("Introduce un email válido");
        } 

        //A continuación genearmos el body de datos
        let body = {
            email: credentials.email,
            password: credentials.password,
        }
        
        console.log('Este es el email, ', body.email);
        console.log('Este es el password, ', body.password);
        console.log(credentials.options)
        console.log('Hemos cruzado la frontera', body);
        
        // SWITCH ROLES
        switch (credentials.options){
            
            case 'user':
                let loguser = await axios.post('http://localhost:3005/user/login', body);
                console.log("Estamos en user login", loguser.data);
                
                
                if (loguser){          
                    localStorage.setItem("token", loguser.data.token);
                    localStorage.setItem("user", JSON.stringify(loguser.data.user));

                    console.log(loguser.data.token);
                    console.log(JSON.stringify(loguser.data.user));

                    setTimeout (()=>{
                        history.push("/loguser")
                    }, 500)
                }
                break;

            case 'coach':
                let logcoach = await axios.post('http://localhost:3005/coach/login', body);
                console.log(logcoach.data);

                if (logcoach){
                    localStorage.setItem("tokencoach", logcoach.data.token);
                    localStorage.setItem("coach", JSON.stringify(logcoach.data.coach));

                    setTimeout (()=>{
                        history.push("/logcoach")
                    }, 500)
                }
                break;

            case 'admin':

                let logadmin = await axios.post('http://localhost:3005/user/login', body);

                console.log(logadmin.data.user.isAdmin)
                
                if (logadmin.data.user.isAdmin === true){
                    localStorage.setItem("token", logadmin.data.token);
                    localStorage.setItem("user", JSON.stringify(logadmin.data.user));

                    setTimeout (()=>{
                        history.push("/logadmin")
                    }, 500)
                }

                // PARA VERIFICARLO HABRÍA QUE INSTALAR JSONWEBTOKEN, o eso o hacemos una tabla de administradores separada de los users

                break;

        }
    }
    

    

    return (

        <div className="containerLogin">
            {/* <pre>{JSON.stringify(credentials,null,2)}</pre> */}
            <div className="boxLogin bgGreen">
                <label className="labelsLogin" for="email">EMAIL</label>
                <input className="inputsLogin" type="email" name="email" onChange={updateCredentials}></input>
                <label className="labelsLogin" for="password">PASSWORD</label>
                <input className="inputsLogin" type="password" name="password" onChange={updateCredentials}></input>
                <select id="options" name="options" defaultValue="user" onChange={updateCredentials}>
                    <option className="selectinputs" value="user">User</option>
                    <option className="selectinputs" value="coach">Coach</option>
                    <option className="selectinputs" value="admin">Admin</option>
                </select>

                <div className="sendButton txtGreen" onClick={()=>logueame()}>Login</div>
                <div>{msgError}</div>
            </div>
        </div>
    )

}

export default Loginer;