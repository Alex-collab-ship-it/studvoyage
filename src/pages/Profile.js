import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask'
import Modal from 'react-bootstrap/Modal';
import { Navigate, useNavigate } from 'react-router-dom';
import '../pages/styles.css'
import CONSTANTS, { ErrorMsg, SuccessMsg } from '../bootstrap';
import { getCode } from '../auth_pages/ConfirmMail';
import { Loader } from './components/Loader';
import { Header } from './components/Header';

const url = CONSTANTS.url

export const Profile = ({setIsLoggedIn, access_token }) => {
    const [state, setState] = useState({
        user: {
            loaded: false
        },
        errorMsg: '',
        successMsg: '',
        modalShow: false,
        mailModalShow: false,
    })
    const navigate = useNavigate()

    useEffect(() => {
        if (access_token !== undefined)
            fetch(CONSTANTS.url+'/api/v1/accounts/me',
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': access_token
                    }
                }).then(response => response.json()).then(({account}) => {
                    setState(p => ({...p,
                        user: {
                            loaded: true,
                            mail: account.email,
                            confirmed: account.confirmed,
                            first_name: account.first_name,
                            last_name: account.last_name,
                            middle_name: account.middle_name,
                            university: account.university,
                            group: account.university_group,
                            birth_date: account.birthday.split('T')[0],
                            phone: account.phone
                        }
                    }))
                }).catch((error) => {
                    console.log(error)
                });
        }, [state.user.loaded])
    if (access_token === undefined){
        return <Navigate to='/auth' />
    }

    return state.user.loaded ?
            <><Header setIsLoggedIn={setIsLoggedIn} user={state.user} />
            <div className="container-fluid mt-3 p-0">
                <ConfirmModal show={state.modalShow} setState={setState} navigate={navigate} setIsLoggedIn={setIsLoggedIn} access_token={access_token}/>
                <ConfirmMailModal show={state.mailModalShow} setState={setState} access_token={access_token} mail={state.user.mail} />
                {state.errorMsg !== '' ? <ErrorMsg setState={setState} state={state} />:<></>}
                {state.successMsg !== '' ? <SuccessMsg setState={setState} state={state} />:<></>}
                <form className="card my-auto px-sm-5 px-3 py-4 mx-auto rounded-4" style={{maxWidth: '744px', minHeight: '500px'}} onSubmit={e => e.preventDefault()}>
                    <h2 className='text-center mb-1'>Профиль</h2>
                    <div className="form-group form-floating mb-3 mt-4">
                        <input disabled={true} defaultValue={state.user.first_name}  className="form-control form-control-md base-input" type='text'/>
                        <label>Имя</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input disabled={true} defaultValue={state.user.last_name}  className="form-control form-control-md base-input" type='text'/>
                        <label>Фамилия</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input disabled={true} defaultValue={state.user.middle_name} className="form-control form-control-md base-input" type='text' />
                        <label>Отчество</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input className="form-control form-control-md base-input" type='text' value={state.user.university} onChange={e => setState(prev => ({ ...prev, user: {...prev.user, university: e.target.value}}))} />
                        <label>ВУЗ</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input className="form-control form-control-md base-input" type='text' value={state.user.group} onChange={e => setState(prev => ({ ...prev, user: {...prev.user, group: e.target.value}}))}/>
                        <label >Группа</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input disabled={true} className="form-control form-control-md base-input" type='date' value={state.user.birth_date} />
                        <label>Дата рождения</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input className="form-control form-control-md base-input" type='text' value={state.user.phone} onChange={e => setState(prev => ({ ...prev,  user: {...prev.user, phone: e.target.value}}))}/>
                        <label>Номер</label>
                    </div>
                    {state.user.confirmed ? 
                        <div className='d-flex flex-nowrap flex-row mb-3'>
                            <img className='me-3' src={require('../icons/success.svg').default} />
                            <p className='text-wrap' style={{ color: '#8C8C8C' }}>Почта {state.user.mail} подтверждена</p>
                        </div>
                            : <div className='d-flex flex-row flex-nowrap mb-3 align-items-center'>
                                <img src={require('../icons/cross.svg').default} className='me-3'/>
                                <button style={{ minWidth: '150px' }} onClick={() => setState(p => ({ ...p, mailModalShow: true }))}
                                    className=' btn btn-link btn-md p-1 text-wrap text-decoration-none'>Почта не подтверждена</button>
                            </div>
                        }
                    <button className='btn btn-primary btn-md py-2 mt-3 base-button mx-auto' style={{ minWidth: '150px'}} onClick={() => submit(state.user, setState, access_token)}>Сохранить</button>
                    <div className='row flex-wrap'>
                        <button className='col btn btn-link btn-md p-1 text-decoration-none text-nowrap'
                            onClick={() => {  CONSTANTS.cookie.delete('access_token'); setIsLoggedIn(false); navigate('/'); }}>Выйти</button>
                        <button className='col btn btn-link btn-md p-1 text-decoration-none text-nowrap' style={{ color: '#E74840'}}
                            onClick={() => setState(p => ({ ...p, modalShow: true}))}>Удалить аккаунт</button>
                    </div>
                </form>
            </div></> : <div className="d-flex justify-content-center align-items-center" style={{ height:'70vh'}}>
                <Loader />
            </div>
    
}


const submit = (user, setAlerts, access_token) => {

    if (user.university !== '' && user.group !== '' && user.birth_date !== '' && user.phone !== '') {
        fetch(url+'/api/v1/accounts/update',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': access_token
                },
                body: JSON.stringify({
                    university: user.university,
                    university_group: user.group,
                    birthday: user.birth_date,
                    phone: user.phone
                })
            }
        ).then(response => response.json()).then(r => {
            if (r === 'Данные успешно сохранены' || r === "Аккаунт уже настроен, для изменения данных напишите в службу поддержки - hello@studvoyage.ru"){
                setAlerts(prev => ({ ...prev,successMsg: r}))
            }

        }).catch((error) => {
            console.log(error)
        });
    } else setAlerts(prev => ({ ...prev,errorMsg: 'Необходимо заполнить все поля'}))
}

function deleteAccount(access_token, setIsLoggedIn, navigate) {
    fetch(url+'/api/v1/accounts/delete_me',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': access_token
                },
            }
        ).then(response => response.json()).then(r => {
            CONSTANTS.cookie.delete('access_token')
            navigate('/')
            setIsLoggedIn(false)
        }).catch((error) => {
            console.log(error)
        });
}

const ConfirmModal = ({ show, setState, navigate, setIsLoggedIn, access_token }) => {
    return <Modal show={show} onHide={() => setState(p => ({ ...p, modalShow: false }))}>
        <Modal.Header closeButton>
        <Modal.Title>Подтверждение</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы действительно хотите удалить ваш аккаунт?</Modal.Body>
        <Modal.Footer>
        <button className='btn btn-primary' style={{ backgroundColor: '#1A7BD3' }} onClick={() => setState(p => ({ ...p, modalShow: false }))}>
            Нет, остаться!
        </button>
        <button className='btn btn-link btn-md p-1 text-decoration-none text-nowrap' style={{ color: '#E74840'}} onClick={() => deleteAccount(access_token,setIsLoggedIn, navigate) }>
            Удалить
        </button>
        </Modal.Footer>
  </Modal>
}

const ConfirmMailModal = ({ show, setState, access_token, mail }) => {
    const [localState, setLocalState] = useState({
        code: '',
        confirmation_id: '',
        disabled: false,
        successMsg: ''
    })

    if (localState.disabled) {
        setTimeout(() => setLocalState(p => ({...p, disabled: false })), 60000)
    }

    return <Modal dialogClassName="rounded-4" centered show={show} onHide={() => setState(p => ({ ...p, mailModalShow: false }))}>
        <Modal.Header closeButton>
            <Modal.Title style={{ fontWeight: '600' }}>Подтверждение почты</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {localState.successMsg !== '' ? <SuccessMsg setState={setLocalState} state={localState} />:<></>}
            <div className="d-flex flex-column justify-content-between px-sm-5 p-4 py-5 rounded-4" style={{maxWidth: '544px'}} onSubmit={e => e.preventDefault()}>
                { localState.confirmation_id !== '' ? <><h2 className='text-center mb-5' style={{ fontSize: '26px' }}>
                        Введите код из письма, которое мы отправили на {mail[0] + '***' + mail.substring(4,mail.split('@')[0].length) + mail.split('@')[1]}
                    </h2>
                    <InputMask maskChar='x'  mask='999-999' pattern='[0-9]{3}-[0-9]{3}'
                    className="form-control form-control-md p-3 base-input text-center mb-auto" placeholder='xxx-xxx' value={localState.code} onInput={e => setLocalState(p => ({...p, code: e.target.value}))}/></>
                : <></>}
                <div className="container mt-5">
                    <div className="row d-flex justify-content-between align-items-center flex-wrap">
                        <button onClick={() => getCode(access_token, setLocalState)} style={{ backgroundColor: '#EBF0FF', color: '#1A7BD3', borderWidth: 0, minWidth: '150px' }} className='col-10 col-md-5 btn btn-primary mx-auto btn-md py-2 mb-3 base-button' disabled={localState.disabled}>Отправить код</button>
                        <button style={{ minWidth: '150px' }} onClick={() => submitConfirmCode(localState, setState)} className='col-10 col-md-5 btn btn-primary btn-md py-2 mb-3  mx-auto base-button' disabled={localState.code.length<7 || localState.code.indexOf('x')>=0 || localState.confirmation_id === ''}>Подтвердить</button>
                    </div>
                </div>
            </div>
        </Modal.Body>
  </Modal>
}

function submitConfirmCode(localState, setState) {
    if (localState.code.indexOf("x") < 0)
        fetch(url + `/api/v1/auth/confirm/${localState.confirmation_id}/${localState.code}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(r => {
                if (r === 'Аккаунт подтверждён'){
                    setState(prev => ({ ...prev, successMsg: r, mailModalShow: false}))
                } else setState(prev => ({ ...prev, errorMsg: 'Неверный код'}))
            }).catch((error) => {
                console.log(error)
            });
}


