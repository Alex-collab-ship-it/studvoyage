import { useState, useEffect } from "react"
import { AvailibleScreen } from "../pages/booking_pages/AvailibleScreen"
import { Route, Routes } from 'react-router-dom';
import { Profile } from "../pages/Profile"
import { Header } from "../pages/components/Header";
import '../auth_pages/auth_styles.css'
import CONSTANTS from "../bootstrap";
import { Loader } from "../pages/components/Loader";
import { BookingTour } from "../pages/booking_pages/BookingTour";
import { PaymentScreen } from "../pages/booking_pages/PaymentScreen";

export const MainScreen = ({access_token, setIsLoggedIn}) => {
    const [state, setState] = useState({
        user: {
            loaded: false,
            confirmed: 0,
            first_name: '',
            last_name: '',
            middle_name: '',
            university: '',
            group: '',
            birth_date: '',
            phone: '',
        },
        errorMsg: '',
        successMsg: ''
    })

    useEffect(() => {
        fetch(CONSTANTS.url+'/api/v1/accounts/me',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': access_token
                }
            }).then(response => response.json()).then(({account}) => {
                setState(p => ({ ...p,
                    user:{
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
    }, state.user)


    return state.user.loaded ? 
    <>
        <Header setIsLoggedIn={setIsLoggedIn} state={state} />
        <Routes>
            <Route path='/' element={<AvailibleScreen access_token={access_token}/>}/>
            <Route path="book_tour" element={<BookingTour access_token={access_token} user={state.user}/>} />
            <Route path="payment" element={<PaymentScreen access_token={access_token}/>} />
            <Route path='profile' element={<Profile setIsLoggedIn={setIsLoggedIn} access_token={access_token} user={state.user} setState={setState} />}/>
        </Routes>
    </> : <div className="d-flex flex-column my-auto mx-auto justify-content-center align-items-center" style={{ height:'100%'}}>
            <Loader />
        </div>
        
    
}