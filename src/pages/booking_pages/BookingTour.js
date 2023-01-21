import { createRef, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import CONSTANTS, { ErrorMsg, SuccessMsg } from "../../bootstrap"
import { Loader } from "../components/Loader"

const url = CONSTANTS.url

export const BookingTour = ({ access_token, user }) => {
    let props = useLocation()
    const navigate = useNavigate()
    const data = props.state
    const [state, setState] = useState({
        persons: [{
            first_name: user.first_name,
            last_name: user.last_name,
            middle_name: user.first_name,
            birth_date: user.birth_date,
            university: user.university,
            group: user.group,
            passport_series: '',
            passports_number: '',
            passportUpload: null,
            studentPassUpload: null,
            passportName: '',
            studentPassName: '',
        }],
        data: { ...data, loaded: false },
        errorMsg: '',
        successMsg: '',
        checked: false
    })


    useEffect(() => {
        fetch(CONSTANTS.url + '/api/v1/tours/'+ data.id,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(r => {
                if (r.detail !== 'Object does not exist'){
                    setState(p => ({ ...p, data: {...r, loaded: true }}))
                }
            }).catch((error) => {
                console.log(error)
            });
        
    }, [state.data.loaded])
    const addPerson = () => {
        if (state.persons.length < 3) {
            console.log('do', state.persons)
            setState(p => ({ ...p, persons: [...p.persons, {
                first_name: '',
                last_name: '',
                middle_name: '',
                birth_date: '',
                university: '',
                group: '',
                passport_series: '',
                passports_number: '',
                passportUpload: null,
                studentPassUpload: null,
                passportName: '',
                studentPassName: '',
            } ]}))
        } else setState(p => ({ ...p, errorMsg: 'Максимум 3 человека' }))
    }

    const requestHandler = () => {
        for(let i = 0; i<state.persons.length;i++){
            let person = state.persons[i]
            if (person.first_name === '' || person.last_name === '' || person.middle_name === '' || person.birth_date === '' ||
                person.university === '' || person.group === '' || person.passport_series === '' || person.passports_number === '' ||
                person.passportUpload === null || person.studentPassUpload === null) {
                    return setState(p => ({ ...p, errorMsg: 'Заполните поля всех заявок' }))
                }
            uploadFile(person.passportUpload,i, setState, 'passport')
            uploadFile(person.studentPassUpload, i, setState, 'student_pass')

        }
        let tourists = new Array;
        state.persons.forEach((person,i) => {
            tourists[i]= {
                first_name: person.first_name,
                last_name: person.last_name,
                middle_name: person.middle_name,
                university: person.university,
                university_group: person.group,
                birthday: person.birth_date,
                passport_series: person.passport_series,
                passport_number: person.passports_number,
                passport: person.passportName,
                student_card: person.studentPassName
            }
        });
        fetch(url + '/api/v1/bookings/create',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': access_token
            },
            body: JSON.stringify({
                tour_id: data.id,
                number_of_tourists: tourists.length,
                tourists: tourists
            })
        }).then(response => response.json()).then(r => {
            navigate('/tours/payment')
        }).catch((error) => {
            console.log(error)
        });
    }

    if (!state.data.loaded){
        return <div className="d-flex flex-column my-auto mx-auto justify-content-center align-items-center" style={{ height:'80vh'}}>
            <Loader />
        </div>
    }
    return (
        <div className="d-flex justify-content-around row mt-5 gx-0 column-gap-3">
            {state.errorMsg !== '' ? <ErrorMsg setState={setState} state={state} />:<></>}
            {state.successMsg !== '' ? <SuccessMsg setState={setState} state={state} />:<></>}
            {/* col-lg-6 col px-auto */}
            <div className="col-lg-5 p-0">
                <div className="container-fluid d-flex flex-column" style={{ maxWidth: '636px'}}>
                    <div className="container d-flex p-0 mb-5">
                        <h3 style={{fontSize: '28px', fontWeight: '600', color: '#272727', margin: '0'}}>Данные путешественников</h3>
                    </div>
                    {state.persons.map((person, i) => <TravellerForm user={user} person={person} len={state.persons.length} number={i+1} setState={setState} key={i}/>)}
                    <div onClick={() => addPerson()} className="card container p-3 d-flex p-auto mb-4 mx-auto align-items-center justify-content-center rounded-4" style={{ maxWidth: '636px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '20px', color: '#272727' }} className="d-flex text-center align-items-center">
                            <span className="me-3" style={{ fontSize: '32px', color: '#272727', fontWeight: '600' }}>+1</span> Добавить ещё одного путешественника
                        </div>
                    </div>
                    <div className="container d-flex flex-row p-0">
                        <input className="d-inline form-check-input m-0" style={{ minWidth:'20px', minHeight:'20px',borderRadius: '5px', boxShadow: 'none', cursor: 'pointer' }} onChange={() => setState(p => ({...p, checked: !p.checked}))} type="checkbox" checked={state.checked}/>
                        <div className="d-inline ms-2" style={{ fontSize: '17px', fontWeight: '600' }}>
                            Согласен с условиями приобретения услуг туристического консультирования и экскурсионных услуг
                        </div>
                    </div>
                    <hr className="container d-flex flex-row p-0" />
                    <div className="container d-flex flex-row mt-3 mb-5 p-0">
                        <p style={{ color: '#8C8C8C', fontSize: '14px'}}>
                            Увы, пока что мы вынуждены оказывать “услуги туристического консультирования”. 
                            Это необходимо для того, чтобы данная поездка была осуществлена на правах агента различных туристических услуг. 
                            То есть фактически мы не продаём авиабилеты, услуги проживания и трансфера, мы выступаем посредником в покупке таковых услуг. 
                            Финальный туристический продукт формирует только покупатель. Надеемся на понимание и ждём вас в поездке!
                        </p>
                    </div>
                </div>
            </div>
            <div className="col d-flex justify-content-end">
                <div className="d-flex flex-column mx-sm-5 mx-0" style={{ maxWidth: '550px'}}>
                    <div className="d-flex flex-row justify-content-between py-3 px-4 mb-4" style={{ backgroundColor: '#F8F9FF', borderRadius: '15px', cursor: 'pointer' }}>
                        <div className="d-flex justify-content-center flex-column p-0">
                            <h1 className="mb-2 p-0 m-0" style={{fontSize: '21px', fontWeight: '600', color: '#272727', margin: '0'}}>{data.name}</h1>
                            <p className="m-0 p-0 text-nowrap" style={{ margin: '0' }}><img  src={require('../../icons/calendar.svg').default} className='me-2'/>{CONSTANTS.period(data.start_date.split('-'), data.end_date.split('-'))}</p>
                        </div>
                        <img alt='' className="d-inline-block ms-2" src={data.image} style={{ width: '90px', height: '90px', borderRadius: '15px'}}></img>
                    </div>
                    <InfoBar data={state.data.segments} />
                    <div className="card rounded-4 p-4">
                        <div className="d-flex flex-row row-gap-3 flex-wrap justify-content-between">
                            <div className="d-flex flex-column align-items-between mb-3">
                                <h3 className="m-0 p-0 mb-1" style={{  minWidth: '150px', fontSize: '22px' }}>Оплата</h3>
                                <h2 className="m-0 p-0" style={{ fontWeight: '600' }}>{state.data.price} ₽</h2>
                            </div>
                            <button onClick={() => requestHandler(navigate, data)} className=" btn btn-primary btn-md py-3 my-auto base-button rounded-3" style={{minWidth: '200px', fontSize: '18px'}} disabled={!state.checked}>Создать заявку</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const TravellerForm = ({ person, number, len, setState, user }) => {
    const deletePerson = (i) => {
        if (len > 1) {
            setState(p => ({ ...p, persons: p.persons.filter((_, index) => index != i)}))
        } else setState(p => ({ ...p, errorMsg: 'Миниимум 1 человек' }))
    }

    const passportRef = createRef()
    const studentpassRef = createRef()
    return (
        <form className="card p-4 mb-4 w-100 mx-auto rounded-4" >
            <div className="container-fluid d-flex justify-content-between align-content-center mt-2  mb-4">
                <h5 className="my-auto">Путешественник {number}</h5>
                {number !== 1 ? <img alt='' onClick={() => deletePerson(number-1)} src={require('../../icons/bucket.svg').default} style={{ cursor: 'pointer' }}/> : <></>}
            </div>
            <div className="row">
                <div className="col-xs-12 col-xxl-6 mb-3">
                    <div className="form-group form-floating">
                        <input disabled={number === 1} className="form-control form-control-md base-input" 
                            value={number === 1 ? user.last_name : person.last_name} placeholder="Фамилия"
                            onChange={(e) => setState(p => {
                                let ps = p.persons;
                                console.log('do', ps[number-1].last_name , number)
                                ps[number-1].last_name = e.target.value;
                                console.log('posle', ps[number-1].last_name , number)
                                return {...p, persons: ps}
                                })
                            }/>
                        <label>Фамилия</label>
                    </div>
                </div>
                <div className="col mb-3">
                    <div className="form-group form-floating">

                        <input className= "form-control form-control-md base-input"
                            disabled={number === 1} value={number === 1 ? user.first_name : person.first_name} placeholder="Имя"
                            onChange={(e) => setState(p => {let ps = p.persons;ps[number-1].first_name = e.target.value;return {...p, persons: ps}})}/>
                        <label>Имя</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col mb-3">
                    <div className="form-group form-floating">
                        <input className="form-control form-control-md base-input" disabled={number === 1}
                            value={number === 1 ? user.middle_name : person.middle_name} placeholder="Отчество"
                            onChange={(e) => setState(p => {let ps = p.persons;ps[number-1].middle_name = e.target.value;return {...p, persons: ps}})}/>
                        <label>Отчество</label>
                    </div>
                </div>
                <div className="col-xs-3 col-md-6 col-xl-4 mb-3">
                    <div className="form-group form-floating">
                        <input type='date' className="form-control form-control-md base-input" placeholder="Дата рождения"
                            disabled={number === 1} value={number === 1 ? user.birth_date : person.birth_date} maxLength={4}
                            onChange={(e) => setState(p => {let ps = p.persons;ps[number-1].birth_date = e.target.value;return {...p, persons: ps}})}/>
                        <label>Дата рождения</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col col-xxl-7 mb-3">
                    <div className="form-group form-floating">
                        <input className="form-control form-control-md base-input" placeholder="Университет"
                            disabled={number === 1} value={number === 1 ? user.university : person.university}
                            onChange={(e) => setState(p => {let ps = p.persons;ps[number-1].university = e.target.value;return {...p, persons: ps}})}/>
                        <label>Университет</label>
                    </div>
                </div>
                <div className="col-xs-12 col-md-6 col-xxl-5 mb-3">
                    <div className="form-group form-floating">
                        <input className="form-control form-control-md base-input" disabled={number === 1}
                            value={number === 1 ? user.group  : person.group} placeholder="Группа"
                            onChange={(e) => setState(p => {let ps = p.persons;ps[number-1].group = e.target.value;return {...p, persons: ps}})}/>
                        <label>Группа</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 col-xxl-6 mb-3">
                    <div className="form-group form-floating">
                        <input  className="form-control form-control-md base-input"
                            value={person.passport_series} placeholder="Серия паспорта"
                            onChange={(e) => setState(p => {let ps = p.persons;ps[number-1].passport_series = e.target.value;return {...p, persons: ps}})}/>
                        <label>Серия паспорта</label>
                    </div>
                </div>
                <div className="col mb-3">
                    <div className="form-group form-floating">
                        <input className=
                            "form-control form-control-md base-input"
                            value={person.passports_number} placeholder="Номер паспорта"
                            onChange={(e) => setState(p => {let ps = p.persons;ps[number-1].passports_number = e.target.value;return {...p, persons: ps}})}/>
                        <label>Номер паспорта</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col col-sm-6 mb-3">
                    <input type="file" ref={passportRef} style={{display:"none"}} onChange={e => {
                        let f = e.target.files[0]
                        if (f.size < 15*10**6) {
                            setState(p => {
                            let ps = p.persons
                            ps[number-1].passportUpload = f
                            return ({ ...p, persons: ps })})
                        } else setState(p => ({ ...p, errorMsg: 'Размер файла не должен превышать 15 МБ' }))
                        e.target.value = null
                        }}/>
                    <div className="d-flex align-items-center" style={file_wrap} onClick={() => passportRef.current.click()}>
                            <div className="container text-center">
                                <p className="fs-5 m-0 p-0">Паспорт</p>
                                <p className="mb-2 p-0" style={{fontSize: '12px', color: '#9D9D9D'}}>Фото или скан</p>
                                { person.passportUpload === null ?
                                    <div className="fs-6 m-0 p-0" style={{color: '#1A7BD3'}}>Нажмите, чтобы <div style={{color: '#1A7BD3'}} className="d-inline text-nowrap">
                                        загрузить файл</div>
                                    </div> :
                                <div className="fs-6 m-0 p-0 text-truncate" style={{color: '#1A7BD3'}}>{person.passportUpload.name}</div>}
                            </div>
                    </div>
                </div>
                <div className="col col-sm-6">
                    <input type="file" ref={studentpassRef} style={{display:"none"}} onChange={e => {
                            let f = e.target.files[0]
                            if (f.size < 15*10**6) {
                                setState(p => {
                                    let ps = p.persons
                                    ps[number-1].studentPassUpload = f
                                    return ({ ...p, persons: ps })
                                })
                            } else setState(p => ({ ...p, errorMsg: 'Размер файла не должен превышать 15 МБ'}))
                            e.target.value = null
                        }}/>
                    <div className="d-flex align-items-center" style={file_wrap} onClick={() => studentpassRef.current.click()}>
                        <div className="container m-auto text-center">
                        <p className="fs-5 m-0 p-0">Студенческий билет</p>
                        <p className="mb-2 p-0" style={{fontSize: '12px', color: '#9D9D9D'}}>Фото или скан</p>
                        { person.studentPassUpload === null ?
                            <div className="fs-6 m-0 p-0" style={{color: '#1A7BD3'}}>Нажмите, чтобы 
                                <div style={{color: '#1A7BD3'}} className="d-inline text-nowrap"> загрузить файл</div>
                            </div> :<div className="fs-6 m-0 p-0 text-truncate" style={{color: '#1A7BD3'}}>{person.studentPassUpload.name}</div>}
                        </div>
                    </div>
                </div>
            </div>
         </form>
    )
}

const cаtegories = {
    flight: 'Перелёт',
    hotel: 'Проживание',
    transfer: 'Трансфер',
    insurance: 'Страховка',
}


const InfoBar = ({data}) => {
    return (
        <div className="card rounded-4 p-4 mb-4" >
            {Object.keys(data).map((key,i) => <InfoCategory key={i} data={data[key]} category={key}/>)}
        </div>
    )
}


const InfoCategory = ({data, category}) => {
    return data.length > 0 ? <div className="d-flex flex-column mb-3">
            <h5 className="m-0 p-0 mb-2" style={{ fontWeight: '600',  }}>
                {cаtegories[category]}
            </h5>
            {Object.keys(data).map((key,i) =>
                <InfoDetail key={i} data={data[key]}/>)}
        </div> : <></>
    
}



const InfoDetail = ({data}) => {
    let c = data.category
    return c === 'flight' ?  <FlightBlock data={data} /> : 
                c === 'hotel' ? <HotelBlock data={data} /> : 
                c === 'transfer' ? <TransferBlock data={data} /> : c === 'insurance' ? <InsuranceBlock data={data} /> : <></>
    
}

const FlightBlock = ({data}) => {
    return(
        <div className="d-flex flex-column justify-content-center p-3 py-2 my-2" id="collapseExample" style={{ borderLeft:'3px solid #3CAB07'}}>
            <h6 className="m-0 mb-1 p-0" >{data.company}</h6>
            <h6 className="m-0 mb-1 p-0" >{CONSTANTS.formatTime(data.data.start_time.split('T')) + ' - ' + CONSTANTS.formatTime(data.data.end_time.split('T'))}</h6>
            <h6 className="m-0 p-0" >{data.data.departure.aiport_iata + ' - ' + data.data.arrival.aiport_iata}</h6>
        </div>
    )
}

const HotelBlock = ({data}) => {
    return(
        <div className="d-flex flex-column justify-content-center p-3 py-2 my-2" style={{ borderLeft:'3px solid #1A7BD3' }}>
          <h6 className="m-0 mb-1 p-0">{data.company}</h6>
          <h6 className="m-0 p-0">{CONSTANTS.formatDate(data.data.start_date)+' - '+CONSTANTS.formatDate(data.data.end_date)}</h6> 
        </div>
    )
}

const TransferBlock = ({data}) => {
    return(
        <div className="d-flex flex-column justify-content-center p-3 py-2 my-2" style={{ borderLeft:'3px solid #FC840A' }}>
          <h6 className="m-0 mb-1 p-0">{data.data.departure + ' - ' + data.data.arrival}</h6>
          <h6 className="m-0 p-0">{CONSTANTS.formatDate(data.data.date)}</h6> 
        </div>
    )
}
const InsuranceBlock = ({data}) => {
    return(
        <div className="d-flex flex-column justify-content-center p-3 py-2 my-2" style={{ borderLeft:'3px solid #FF1DE8'}}>
          <h6 className="m-0 mb-1 p-0" >Покрытие ${data.data.cover.toString().slice(0,-3) + '.000'}</h6>
          <h6 className="m-0 p-0" >{CONSTANTS.formatDate(data.data.start_date)+' - '+CONSTANTS.formatDate(data.data.end_date)}</h6> 
        </div>
    )
}

function uploadFile(file,index,setState,type) {
    let formData = new FormData()

    formData.append('file', file,  file.name)

    fetch(url+'/api/v1/bookings/upload',
    {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(r => {
        if (!r.detail){
            setState(p => {
                let ps = p.persons
                if (type === 'passport'){
                    ps[index].passportName = r.filename
                }else ps[index].studentPassName = r.filename
                return { ...p, persons: ps }
            })
        }
    }).catch((error) => {
        console.log(error)
    });
}

const file_wrap = {
    border: '1px solid #D1D1D1',
    borderRadius: '10px',
    overflow: 'hidden',
    width: '100%',
    height:'150px',
    cursor: 'pointer'
}