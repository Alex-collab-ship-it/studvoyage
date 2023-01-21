import { useState, useEffect } from "react"
import { AvailibleScreen } from "../pages/booking_pages/AvailibleScreen"
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Profile } from "../pages/Profile"
import { Header } from "../pages/components/Header";
import '../auth_pages/auth_styles.css'
import CONSTANTS from "../bootstrap";
import { Loader } from "../pages/components/Loader";
import { BookingTour } from "../pages/booking_pages/BookingTour";
import { PaymentScreen } from "../pages/booking_pages/PaymentScreen";
import { BookInfoPage } from "../pages/booking_pages/BookInfoPage";

export const MainScreen = ({access_token, setIsLoggedIn}) => {
    const [user, setUser] = useState({
            loaded: false,
            confirmed: 0,
            first_name: '',
            last_name: '',
            middle_name: '',
            university: '',
            group: '',
            birth_date: '',
            phone: '',
        })

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
                    setUser(p => ({
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
                        }))
                }).catch((error) => {
                    console.log(error)
                });
    }, [user.loaded])
    if (access_token === undefined){
        return <Navigate to='/auth' />
    }

    return user.loaded ? 
    <>
        <Header setIsLoggedIn={setIsLoggedIn} user={user} />
        <Routes>
            <Route path='/' element={<AvailibleScreen access_token={access_token}/>}/>
            <Route path="book_tour" element={<BookingTour access_token={access_token} user={user}/>} />
            <Route path="payment" element={<PaymentScreen access_token={access_token}/>} />
            <Route path='booking_info' element={<BookInfoPage access_token={access_token} />} />
        </Routes>
    </> : <div className="d-flex justify-content-center align-items-center" style={{ height:'70vh'}}>
            <Loader />
        </div>
        
    
}