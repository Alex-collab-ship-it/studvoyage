import { useState } from 'react'
import './auth_styles.css'
import CONSTANTS, { SuccessMsg, ErrorMsg, formatMobileNumber } from '../bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactInputMask from 'react-input-mask'
const url = CONSTANTS.url

export const CompleteData = ({ access_token, setIsLoggedIn}) => {

    const { state } = useLocation()

    const [data, setData] = useState({
        successMsg: '',
        errorMsg: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        university: '',
        group: '',
        birth_date: '',
        phone: ''
    })
    const navigate = useNavigate()
    return (
        <div className="d-flex container-fluid justify-content-center" >
            {data.successMsg !== '' ? <SuccessMsg setState={setData} state={data} />:<></>}
            {data.errorMsg !== '' ? <ErrorMsg setState={setData} state={data} />:<></>}
            <form className="card my-auto p-4 px-5 mx-auto my-5 rounded-4" style={{maxWidth: '544px', minHeight: '500px'}} onSubmit={e => e.preventDefault()}>
                <h2 className='text-center'>
                    Расскажите о себе ниже
                </h2>
                <p className='text-center'  style={{ color: '#8c8c8c'}}>
                    К сожалению, без этих данных воспользоваться нашей системой не выйдет :(
                </p>
                <div className="form-group form-floating mb-3 mt-2">
                    <input defaultValue={data.first_name} className="form-control form-control-md base-input" type='text' onChange={e => setData(prev => ({ ...prev, first_name: e.target.value}))}/>
                    <label>Имя</label>
                </div>
                <div className="form-group form-floating mb-3">
                    <input defaultValue={data.last_name}  className="form-control form-control-md base-input" type='text' onChange={e => setData(prev => ({ ...prev, last_name: e.target.value}))}/>
                    <label>Фамилия</label>
                </div>
                <div className="form-group form-floating mb-3">
                    <input className="form-control form-control-md base-input" type='text' value={data.middle_name} onChange={e => setData(prev => ({ ...prev, middle_name: e.target.value}))} />
                    <label>Отчество</label>
                </div>
                <div className="form-group form-floating mb-3">
                    <input className="form-control form-control-md base-input" type='text' value={data.university} onChange={e => setData(prev => ({ ...prev, university: e.target.value}))} />
                    <label>ВУЗ</label>
                </div>
                <div className="form-group form-floating mb-3">
                    <input className="form-control form-control-md base-input" type='text' value={data.group} onChange={e => setData(prev => ({ ...prev, group: e.target.value}))}/>
                    <label >Группа</label>
                </div>
                <div className="form-group form-floating mb-3">
                    <input className="form-control form-control-md base-input" type='date' value={data.birth_date} onChange={e => setData(prev => ({ ...prev, birth_date: e.target.value.split('T')[0]}))} />
                    <label>Дата рождения</label>
                </div>
                <div className="form-group form-floating mb-3">
                    <ReactInputMask mask='+7(999) 999-99-99' className="form-control form-control-md base-input" type='text' value={data.phone} onChange={e => setData(prev => ({ ...prev, phone: e.target.value}))}/>
                    <label>Номер телефона</label>
                </div>
                <button className='btn btn-primary btn-md py-2 mb-3 base-button' onClick={() => submit(data, setData, state.access_token, setIsLoggedIn, navigate)}>Сохранить</button>
                <button className='btn btn-link btn-md p-1 text-decoration-none text-nowrap'
                    onClick={() => navigate('/auth')}>Выйти</button>
            </form>
        </div>
    )
}

const submit = (data, setData, access_token,setIsLoggedIn, navigate) => {
    console.log(data)
    if (data.first_name !== '' && data.last_name !== '' && data.middle_name !== '' && data.university !== '' && data.group !== '' && data.birth_date !== '' && data.phone.indexOf('_')<0 && data.phone.length > 10) {
        fetch(url+'/api/v1/accounts/set',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': access_token
                },
                body: JSON.stringify({

                        first_name: data.first_name,
                        last_name: data.last_name,
                        middle_name: data.middle_name,
                        university: data.university,
                        university_group: data.group,
                        birthday: data.birth_date,
                        phone: data.phone
                    })
            }
        ).then(response => response.json()).then(r => {
            if (r === 'Данные успешно сохранены' || r === "Аккаунт уже настроен, для изменения данных напишите в службу поддержки - hello@studvoyage.ru"){
                CONSTANTS.cookie.set('access_token', access_token)
                navigate('/tours')
                setIsLoggedIn(true)
            } else{ setData(prev => ({ ...prev, errorMsg: r})) }
        }).catch((error) => {
            console.log(error)
        });
    } else {
        setData(prev => ({ ...prev, errorMsg: 'Необходимо заполнить все поля!'}))
    }
}