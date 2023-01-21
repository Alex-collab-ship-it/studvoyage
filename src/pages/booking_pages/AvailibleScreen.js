import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../bootstrap";
import { Loader } from "../components/Loader";

const url = CONSTANTS.url

export const AvailibleScreen = ({access_token}) => {

    return (
        <>
            <MyTours access_token={access_token}/>
            <Tours access_token={access_token}/>
        </>
    )
}

const MyTours = ({ access_token }) => {
    const [localState, setLocalState] = useState({
        loaded: false,
        data: []
    })
    useEffect(() => {

        fetch(url+'/api/v1/bookings/my',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': access_token
                }
            }).then(response => response.json()).then(r => {
                setLocalState(p => ({ ...p, data: r, loaded: true}))
            }).catch((error) => {
                console.log(error)
            });
    }, localState)

    if (!localState.loaded)
        return <Loader />
    return( localState.data.length > 0  ?
        <div className="container-fluid d-flex flex-column mt-5">
            <h3 className="mb-5" style={{fontSize: '28px', fontWeight: '600', color: '#272727', margin: '0'}}>Мои поездки</h3>
            <div className="row d-flex flex-row" style={{minHeight: '150px'}}>
                { localState.data.map((tour, i) =>
                    <div className="col-xxl-4 col-lg-6 col-xs-12 mb-4 h-100" key={i} ><MyTour book={tour} /></div>
                )}
            </div>
        </div> : <></>
    )
}

const Tours = ({access_token}) => {
    const [localState, setLocalState] = useState({
        loaded: false,
        data: []
    })
    useEffect(() => {

        fetch(url+'/api/v1/tours/open',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': access_token
                }
            }).then(response => response.json()).then(r => {
                setLocalState(p => ({ ...p, data: r, loaded: true}))
            }).catch((error) => {
                console.log(error)
            });
    }, localState)


    if (!localState.loaded)
        return <Loader />

    return(
        <div className="container-fluid d-flex flex-column mt-5">
            <h3 className="mb-5" style={{fontSize: '28px', fontWeight: '600', color: '#272727', margin: '0'}}>Доступные поездки</h3>
            <div className="row d-flex flex-row" style={{minHeight: '150px'}}>
                { localState.data.map((tour, i) =>
                    <div className="col-xxl-4 col-lg-6 col-xs-12 mb-4 h-100"  key={i}><Tour data={tour} /></div>
                )}
            </div>
        </div>
    )
}

const MyTour = ({book}) => {

    const [tour, setTour] = useState({
        loaded: false,
        data: {}
    })

    useEffect(() => {
        fetch(CONSTANTS.url + '/api/v1/tours/' + book.tour_id,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(r => {
                if (r.detail !== 'Object does not exist'){
                    setTour(p => ({ loaded: true, data: r}))
                }
            }).catch((error) => {
                console.log(error)
            });
    }, tour)
    const navigate = useNavigate()
    if (!tour.loaded) return <Loader />
    return (
        <div onClick={() => navigate('/tours/booking_info', { state: { book: book, data: tour.data } })} className="d-flex flex-row justify-content-between mh-100 flex-wrap-reverse p-4" style={{ backgroundColor: '#F8F9FF', borderRadius: '15px', minHeight: '150px', cursor: 'pointer' }}>
            <div className="d-flex justify-content-center me-2 flex-column">
                <h1 className="mb-2 text-wrap" style={{fontSize: '21px', fontWeight: '600', color: '#272727', margin: '0'}}>{tour.data.name}</h1>
                <div className="d-flex flex-row flex-wrap mt-1">
                    <p className="mb-2 me-5 text-wrap" style={{ margin: '0' }}>
                        <img  src={require('../../icons/calendar.svg').default} className='me-2'/>
                        {CONSTANTS.period(tour.data.start_date.split('-'), tour.data.end_date.split('-'))}
                    </p>
                    <p className="mb-2 text-wrap" style={{ margin: '0' }}>
                        <img  src={require('../../icons/people.svg').default} className='me-2'/>
                        {book.tourists.length}
                    </p>
                </div>
                <div className="d-flex flex-row mt-1">
                    {book.is_paid ? <>
                        <img  src={require('../../icons/green_dollar.svg').default} className='me-2'/>
                        <p style={{ color: '#169C3C' }}>оплачено</p>
                    </>:<>
                        <img  src={require('../../icons/red_dollar.svg').default} className='me-2'/>
                        <p style={{ color: '#F05B5B' }}>не оплачено</p>
                    </>}
                </div>
               
            </div>
            <img alt='' className="d-inline-block mb-2" src={tour.data.image} style={{ width: '90px', height: '90px', borderRadius: '15px'}} />
        </div>
    )
}

const Tour = ({data}) => {

    const navigate = useNavigate()
    return (
        <div onClick={() => navigate('/tours/book_tour', { state: data })} className="d-flex flex-row justify-content-between mh-100 flex-wrap-reverse p-4"
        style={{ backgroundColor: '#F8F9FF', borderRadius: '15px', height: '100%', cursor: 'pointer' }}>
            <div className="d-flex justify-content-center me-2 flex-column">
                <h1 className="mb-2 text-wrap" style={{fontSize: '21px', fontWeight: '600', color: '#272727', margin: '0'}}>{data.name}</h1>
                <p className="mb-2 text-nowrap" style={{ margin: '0' }}><img  src={require('../../icons/calendar.svg').default} className='me-2'/>{CONSTANTS.period(data.start_date.split('-'), data.end_date.split('-'))}</p>
                <h6 style={{fontSize: '21px', fontWeight: '800', color: '#1A7BD3',  margin: '0'}}>{data.price} ₽</h6>
            </div>
            <img alt='' className="d-inline-block mb-2" src={data.image} style={{ width: '90px', height: '90px', borderRadius: '15px'}}></img>
        </div>
    )
}