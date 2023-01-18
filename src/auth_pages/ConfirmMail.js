import { useState } from 'react'
import InputMask from 'react-input-mask'
import { useLocation, useNavigate } from 'react-router-dom'
import { ErrorMsg, SuccessMsg } from '../bootstrap'
import CONSTANTS from '../bootstrap'

let url = CONSTANTS.url

export const ConfirmMail = ({ setIsLoggedIn }) => {
    const { state } = useLocation()
    const [status, setStatus] = useState({
        code: '',
        disabled: state.auth_type !== 'token', 
        errorMsg: '',
        confirmation_id: state.confirmation_id,
        successMsg: ''
    })


    const navigate = useNavigate()

    if (status.disabled) {
        setTimeout(() => setStatus(p => ({ ...p, disabled: false })), 60000)
    }



    return (
        <div className="d-flex justify-content-center align-content-center" >
            { status.errorMsg ? <ErrorMsg state={status} setState={setStatus} /> : <></>}
            { status.successMsg ? <SuccessMsg state={status} setState={setStatus} /> : <></>}
            <form className="card px-sm-5 p-4 py-5 mt-5 rounded-4" style={{maxWidth: '544px', minHeight: '550px'}} onSubmit={e => e.preventDefault()}>
                <h2 className='text-center mb-5' style={{ fontSize: '26px' }}>
                    Введите код из письма, которое мы отправили на {state.mail[0] + '***' + state.mail.substring(4,state.mail.split('@')[0].length) + state.mail.split('@')[1]}
                </h2>
                <InputMask maskChar='x'  mask='999-999' pattern='[0-9]{3}-[0-9]{3}'
                    className="form-control form-control-md p-3 base-input text-center mb-auto" placeholder='xxx-xxx' value={status.code} onInput={e => setStatus(p => ({...p, code: e.target.value}))}/>
                <div className="container mt-5">
                    <div className="row d-flex justify-content-between align-items-center mb-4  flex-wrap">
                        <button onClick={() => getCode(state.access_token, setStatus)} style={{ backgroundColor: '#EBF0FF', color: '#1A7BD3', borderWidth: 0, minWidth: '150px' }} className='col-10 col-md-5 btn btn-primary mx-auto btn-md py-2 mb-3 base-button' disabled={status.disabled}>Отправить код</button>
                        <button style={{ minWidth: '150px' }} onClick={() => submitConfirmCode(status.code,status.confirmation_id, state, setStatus, navigate,setIsLoggedIn)} className='col-10 col-md-5 btn btn-primary btn-md py-2 mb-3  mx-auto base-button' disabled={status.code.length<7 || status.code.indexOf('x')>=0}>Подтвердить</button>
                    </div>
                    <hr />
                    <div className="row justify-content-center mx-auto mb-2">
                        или
                    </div>
                    <div className="d-flex justify-content-center mb-2" >
                        <button style={{ minWidth: '200px' }} onClick={() => {
                            if (!state.is_completed){
                                navigate('/auth/complete_profile', { state: { access_token: state.access_token } })
                            } else {
                                CONSTANTS.cookie.set('access_token', state.access_token); navigate('/tours'); setIsLoggedIn(true)
                            }
                            }} className='col-5 btn btn-link btn-md p-1 text-decoration-none text-nowrap '>Подтвердить позже</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export function getCode(access_token,setStatus) {
    fetch(url + '/api/v1/auth/resend', 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': access_token
            }
        }).then(response => response.json()).then(r => {
            if (r.confirmation_id)
                setStatus(prev => ({ ...prev, disabled: true, confirmation_id: r.confirmation_id, successMsg: 'Код отправлен!' }))
        }).catch(e => console.log(e))
    
}

function submitConfirmCode(code, confirmation_id, state, setStatus, navigate, setIsLoggedIn) {
    if (code.indexOf("x") < 0)
        fetch(url + `/api/v1/auth/confirm/${confirmation_id}/${code}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(r => {
                if (r === 'Аккаунт подтверждён'){
                    if (state.is_completed) {
                        CONSTANTS.cookie.set('access_token', state.access_token)
                        navigate('/')
                        setIsLoggedIn(true)
                    }else {
                        navigate('/auth/complete_profile', { state: { access_token: state.access_token } })
                    }
                } else setStatus(prev => ({ ...prev, errorMsg: 'Неверный код'}))
            }).catch((error) => {
                console.log(error)
            });
}
