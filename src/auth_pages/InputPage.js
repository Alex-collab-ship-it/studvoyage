import './auth_styles.css'
import { useState } from 'react'
import CONSTANTS,  { ErrorMsg } from '../bootstrap'
import { useNavigate } from 'react-router-dom'

const URL = CONSTANTS.url
export const InputPage = ({setIsLoggedIn}) =>  {
    const [state,setState] = useState({
        hasAccount: false,
        passed_auth: '',
        access_token: '',
        mail: '03yrruc03@gmail.com',
        pswd1: 'qwerty',
        pswd2: 'qwerty',
        disabled: false, 
        errorMsg: ''
    })


    const navigate = useNavigate()
    return (
            
        <form className="card p-sm-5 my-auto p-4 mx-auto rounded-4" style={{maxWidth: '544px'}} onSubmit={e => e.preventDefault()}>
        { state.errorMsg ? <ErrorMsg state={state} setState={setState} /> : <></>}
            <h1 className="text-center mb-sm-4 mb-3">{state.hasAccount ? 'Авторизация' : 'Регистрация'}</h1>
            <div className="form-group mb-5 mt-sm-5 mt-3">
                <input type="email" className="form-control form-control-md p-3 base-input" value={state.mail}
                onChange={e => setState(prev => ({ ...prev, mail: e.target.value}))} placeholder={ state.hasAccount ? 'Сюда логин':'Сюда почту'  } />
            </div>
            <div className="form-group mb-5">
                <input type="password" className="form-control form-control-md p-3 base-input" value={state.pswd1}
                onChange={e => setState(prev => ({ ...prev, pswd1: e.target.value, pswd2: state.hasAccount ? e.target.value : state.pswd2}))} placeholder='Сюда пароль' />
            </div>
            {!state.hasAccount ? 
                <div className="form-group mb-5">
                    <input type="password" className="form-control form-control-md p-3 base-input" value={state.pswd2}
                    onChange={e => setState(prev => ({ ...prev, pswd2: e.target.value }))} placeholder='И снова пароль...' />
                </div> : <></>}
                <div className="container mt-5">
            <div className="row justify-content-center mx-auto"
                style={{maxWidth: '70%'}}>
                    <button className="btn btn-primary btn-md py-2 base-button"
                    onClick={() => login(state, state.hasAccount ? 'token' : 'register', setState, navigate, setIsLoggedIn)}>{state.hasAccount ? 'Войти': 'Поехали'}</button>
                </div>
                <div className="row justify-contents-center mx-auto" style={{maxWidth: '70%'}}>
                    <button className="btn btn-link btn-md p-1 text-decoration-none"
                    onClick={() => setState(prev => ({ ...prev, hasAccount: !state.hasAccount }))} >{state.hasAccount ? 'Зарегистрироваться':'Уже есть аккаунт?'}</button>
                </div>
            </div>
        </form>
    )
}


function login(state, type, setState, navigate, setIsLoggedIn) {
    if (state.mail !== '' & state.pswd1 !== ''){
        if (state.pswd2 !== state.pswd1) {
            setState(p => ({ ...p, errorMsg: 'Заполните все поля!' }) )
        } else {
            fetch(URL + '/api/v1/auth/' + type,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: state.mail,
                        password: state.pswd1
                    })
                }).then(response => response.json()).then(r => {
                    if (r.access_token !== undefined){
                        checkStatus('Bearer ' + r.access_token, r.confirmation_id, type, navigate, setIsLoggedIn, state.mail)
                    } else {
                        setState(prev => ({ ...prev, errorMsg: type === 'register' ? 'Пользователь с такой почтой уже зарегистрирован': 'Неверный логин или пароль'}))
                    }
                }).catch((error) => {
                    setState(prev => ({ ...prev, errorMsg: error}))
                    console.log(error)
                });
        }
    } else setState(p => ({ ...p, errorMsg: 'Заполните все поля!' }) )
}


function checkStatus(access_token, confirmation_id, type, navigate, setIsLoggedIn, mail){
    fetch(URL + '/api/v1/accounts/me',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': access_token
            }
        }).then(response => response.json()).then(r => {
            if (r.is_active) {
                if (r.is_completed) {
                    CONSTANTS.cookie.set('access_token', access_token)
                    navigate('/tours')
                    setIsLoggedIn(true)
                } else navigate('complete_profile', { state: { access_token: access_token } })
            } else navigate('confirm_mail', { state: { confirmation_id: confirmation_id, is_completed: r.is_completed, auth_type: type, mail: mail, access_token: access_token } })
        }).catch(e => console.log(e))
}


const Sidebar = ({hasAccount}) => {


    return (
        <div className='sidebar'>
            <div>
            </div>
        </div>
    )
}


