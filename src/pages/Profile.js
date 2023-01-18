import { useState } from 'react';
import InputMask from 'react-input-mask'
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import '../pages/styles.css'
import CONSTANTS, { ErrorMsg, SuccessMsg } from '../bootstrap';
import { Loader } from './components/Loader';
import { getCode } from '../auth_pages/ConfirmMail';

const url = CONSTANTS.url

let localRenders = 1
export const Profile = ({setIsLoggedIn, access_token, user, setState }) => {


    const [alerts, setAlerts] = useState({
        errorMsg: '',
        successMsg: '',
        modalShow: false,
        mailModalShow: false,
    })

    const navigate = useNavigate()
    if (!user.loaded)
        return <Loader />

    return (

            <div className="container-fluid mt-3 p-0">
                <ConfirmModal show={alerts.modalShow} setState={setAlerts} navigate={navigate} setIsLoggedIn={setIsLoggedIn} access_token={access_token}/>
                <ConfirmMailModal show={alerts.mailModalShow} setState={setAlerts} access_token={access_token} user={user} />
                {alerts.errorMsg !== '' ? <ErrorMsg setState={setAlerts} state={alerts} />:<></>}
                {alerts.successMsg !== '' ? <SuccessMsg setState={setAlerts} state={alerts} />:<></>}
                <form className="card my-auto px-sm-5 px-3 py-4 mx-auto rounded-4" style={{maxWidth: '744px', minHeight: '500px'}} onSubmit={e => e.preventDefault()}>
                    <h2 className='text-center mb-1'>Профиль</h2>
                    <div className="form-group form-floating mb-3 mt-4">
                        <input disabled={true} defaultValue={user.first_name}  className="form-control form-control-md base-input" type='text' onChange={e => setState(prev => ({ ...prev, user: {...prev.user, first_name: e.target.value}}))}/>
                        <label>Имя</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input disabled={true} defaultValue={user.last_name}  className="form-control form-control-md base-input" type='text' onChange={e => setState(prev => ({ ...prev, user: {...prev.user, last_name: e.target.value}}))}/>
                        <label>Фамилия</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input disabled={true} defaultValue={user.middle_name} className="form-control form-control-md base-input" type='text' onChange={e => setState(prev => ({ ...prev, user: {...prev.user, middle_name: e.target.value}}))} />
                        <label>Отчество</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input className="form-control form-control-md base-input" type='text' value={user.university} onChange={e => setState(prev => ({ ...prev, user: {...prev.user, university: e.target.value}}))} />
                        <label>ВУЗ</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input className="form-control form-control-md base-input" type='text' value={user.group} onChange={e => setState(prev => ({ ...prev, user: {...prev.user, group: e.target.value}}))}/>
                        <label >Группа</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input disabled={true} className="form-control form-control-md base-input" type='date' value={user.birth_date} onChange={e => setState(prev => ({ ...prev,user: {...prev.user, birth_date: e.target.value.split('T')[0]}}))} />
                        <label>Дата рождения</label>
                    </div>
                    <div className="form-group form-floating mb-3">
                        <input className="form-control form-control-md base-input" type='text' value={user.phone} onChange={e => setState(prev => ({ ...prev,  user: {...prev.user, phone: e.target.value}}))}/>
                        <label>Номер</label>
                    </div>
                    {user.confirmed ? 
                        <div className='d-flex flex-row flex-wrap mb-3'>
                            <img className='me-3' src={require('../icons/success.svg').default} />
                            <p style={{ color: '#8C8C8C' }}>Почта {user.mail} подтверждена</p>
                        </div>
                            : <div className='d-flex flex-row mb-3 align-items-center'>
                                <img src={require('../icons/cross.svg').default} className='me-3'/>
                                <button style={{ minWidth: '150px' }} onClick={() => setAlerts(p => ({ ...p, mailModalShow: true }))}
                                    className=' btn btn-link btn-md p-1 text-decoration-none text-nowrap '>Почта не подтверждена</button>
                                {/* <p style={{ color: '#8C8C8C' }}>
                                    Перейдите по ссылке в письме, которое мы отправили на <span style={{ color: '#1A7BD3' }}>{user.mail}</span>, чтобы подтвердить адрес электронной почты
                                </p> */}
                            </div>
                        }
                    <button className='btn btn-primary btn-md py-2 mt-3 base-button mx-auto' style={{ minWidth: '150px'}} onClick={() => submit(user, setAlerts, access_token)}>Сохранить</button>
                    <div className='row flex-wrap'>
                        <button className='col btn btn-link btn-md p-1 text-decoration-none text-nowrap'
                            onClick={() => {  CONSTANTS.cookie.delete('access_token'); navigate('/'); setIsLoggedIn(false) }}>Выйти</button>
                        <button className='col btn btn-link btn-md p-1 text-decoration-none text-nowrap' style={{ color: '#E74840'}}
                            onClick={() => setAlerts(p => ({ ...p, modalShow: true}))}>Удалить аккаунт</button>
                    </div>
                </form>
            </div>
    )
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

const ConfirmMailModal = ({ show, setState, access_token, user }) => {
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
            <div className="d-flex flex-column justify-content-between px-sm-5 p-4 py-5 rounded-4" style={{maxWidth: '544px', minHeight: '350px'}} onSubmit={e => e.preventDefault()}>
                { localState.confirmation_id !== '' ? <h2 className='text-center mb-5' style={{ fontSize: '26px' }}>
                    Введите код из письма, которое мы отправили на {user.mail[0] + '***' + user.mail.substring(4,user.mail.split('@')[0].length) + user.mail.split('@')[1]}
                </h2>: <></>}
                <InputMask maskChar='x'  mask='999-999' pattern='[0-9]{3}-[0-9]{3}'
                    className="form-control form-control-md p-3 base-input text-center mb-auto" placeholder='xxx-xxx' value={localState.code} onInput={e => setLocalState(p => ({...p, code: e.target.value}))}/>
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


