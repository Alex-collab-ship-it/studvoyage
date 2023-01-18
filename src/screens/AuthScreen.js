import '../auth_pages/auth_styles.css'
import { useEffect, useState } from 'react'
import CONSTANTS,  { ErrorMsg } from '../bootstrap'
import { Routes, Route, useNavigate } from "react-router-dom"

import { InputPage } from "../auth_pages/InputPage"
import { ConfirmMail } from '../auth_pages/ConfirmMail'
import { CompleteData } from "../auth_pages/CompleteData"

const URL = CONSTANTS.url
let localRenders = 1
export const AuthScreen = ({setIsLoggedIn, renderCount}) =>  {
    const [state,setState] = useState({
        hasAccount: false,
        passed_auth: '',
        access_token: '',
        mail: '',
        pswd1: '',
        pswd2: '',
        disabled: false, 
        errorMsg: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        localRenders++

    })
    return (
        <div className='container h-100' >
            { state.errorMsg ? <ErrorMsg state={state} setState={setState} /> : <></>}
            <div className='d-flex my-sm-4 my-4 justify-content-center'>
                <img className='mx-auto' style={{ cursor: 'pointer' }} onClick={() => navigate('/')} src={CONSTANTS.source_url + (window.screen.width > 500 ? 'logoslang.png' : 'logo.png')} />
            </div> 
            <div className="mb-5" style={{ height: '100%' }}>
                <Routes>
                    <Route path='/' element={<InputPage setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path='confirm_mail' element={<ConfirmMail setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path='complete_profile' element={<CompleteData setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
            </div>
        </div>
    )
}


const Sidebar = ({hasAccount}) => {


    return (
        <div className='sidebar'>
            <div>
            </div>
        </div>
    )
}


