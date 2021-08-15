
import './App.css';
import {BrowserRouter, Link, Route} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";





function Session() {
    const [check,setCheck] = useState(true)
    const [login,setLogin] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState(false)
    const [user,setUser] = useState({})
    const [Auth,setAuth] = useState(false)

    const autorizationFun = async ()=>{
        let callBack = await axios.get('http://localhost:3005/checkSession',{withCredentials: true})
        if(callBack.data.check){
            setAuth(true)
            setUser(callBack.data.user)
        }
    }

    useEffect(()=>{
        autorizationFun()
    },[])

    const sendFun = async () =>{
        if((login.length > 0)&&(password.length > 0)){
            if(check){
                let  data = {login,password}
                let callBack = await axios.post('http://localhost:3005/registrationSession',data,{withCredentials: true})
                if(callBack.data.check){
                    setAuth(true)
                    setUser(callBack.data.data)
                    setLogin("")
                    setPassword("")
                }else{
                    setError(true)
                }
            }else{
                let  data = {login,password}
                let callBack = await axios.post('http://localhost:3005/loginInSession',data,{withCredentials: true})
                if(callBack.data.check){
                    setAuth(true)
                    setUser(callBack.data.data)
                    setLogin("")
                    setPassword("")
                }else{
                    setError(true)
                }
            }
        }else{
            setError(true)
        }
    }
    const outAccount = async () =>{
        let callBack = await axios.post('http://localhost:3005/outAccount',{id: user.id},{withCredentials: true})
        setAuth(false)
        setUser({})

    }


    return <div className={"session"}>
        {Auth ?
            <div className={"loginIn"}>Вы авторизовались как {user.login} <div onClick={outAccount}>Выйти</div></div>
            :
            <div className="main">
                <div>session</div>
                <div onClick={()=>setCheck(!check)} className="zag">{check ? "Registration" : "LoginIn"}</div>
                <div className="con">
                    <span>login</span>
                    <input value={login} onChange={(e) => setLogin(e.target.value)} type="text"/>
                    <span>password</span>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="text"/>
                    {error && <div onClick={()=>setError(false)} className="error">ошибка</div>}
                    <div onClick={sendFun} className="button">Send</div>
                </div>
            </div>
        }

    </div>
}
function Token() {
    const [check,setCheck] = useState(true)
    const [login,setLogin] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState(false)
    const [user,setUser] = useState({})
    const [Auth,setAuth] = useState(false)

    const autorizationFun = async ()=>{
        let token = localStorage.getItem("token")
        let callBack = await axios.post('http://localhost:3005/checkToken',{token})
        if(callBack.data.check){
            setAuth(true)
            setUser(callBack.data.data)
        }
    }

    useEffect(()=>{
        autorizationFun()
    },[])

    const sendFun = async () =>{
        if((login.length > 0)&&(password.length > 0)){
            if(check){
                let  data = {login,password}
                let callBack = await axios.post('http://localhost:3005/registrationToken',data,{withCredentials: true})
                if(callBack.data.check){
                    setUser(callBack.data.data)
                    setAuth(true)
                    localStorage.setItem("token",callBack.data.token)
                    setLogin("")
                    setPassword("")
                }else{
                    setError(true)
                }

            }else{
                let  data = {login,password}
                let callBack = await axios.post('http://localhost:3005/loginInToken',data,{withCredentials: true})
                if(callBack.data.check){
                    setUser(callBack.data.data)
                    setAuth(true)
                    localStorage.setItem("token",callBack.data.token)
                    setLogin("")
                    setPassword("")
                }
            }
        }else{
            setError(true)
        }
    }
    const outToken = () =>{
        localStorage.removeItem("token")
        setAuth(false)
        setUser({})

    }

    return <div className={"session"}>
        {Auth ?
            <div className={"loginIn"}>Вы авторизовались как {user.login} <div onClick={outToken}>Выйти</div></div>
            :
            <div className="main">
            <div>token</div>
            <div onClick={() => setCheck(!check)} className="zag">{check ? "Registration" : "LoginIn"}</div>
            <div className="con">
                <span>login</span>
                <input value={login} onChange={(e) => setLogin(e.target.value)} type="text"/>
                <span>password</span>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="text"/>
                {error && <div onClick={() => setError(false)} className="error">ошибка</div>}
                <div onClick={sendFun} className="button">Send</div>
            </div>
        </div>}
    </div>
}


function App() {
  return (
      <BrowserRouter>
          <div className="header">
              <Link to={"/"}>session</Link>
              <Link to={"/token"}>token</Link>
          </div>
          <div className="container">
              <Route exact path={"/"}>
                  <Session />
              </Route>
              <Route path={"/token"}>
                  <Token />
              </Route>
          </div>
      </BrowserRouter>

  );
}

export default App;
