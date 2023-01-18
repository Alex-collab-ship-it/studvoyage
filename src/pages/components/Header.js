import CONSTANTS from "../../bootstrap";
import { useNavigate } from "react-router-dom";
let i = Math.floor(Math.random()*CONSTANTS.colors.length)
export const Header = ({setIsLoggedIn, state}) => {
    
    const navigate = useNavigate()

    return (
        <div className="container-fluid d-flex flex-row mb-4 flex-wrap align-items-center flex-row">
                <div><img onClick={() => navigate('/')} src={CONSTANTS.source_url +  'logo.png'} style={{ cursor: 'pointer' }}/></div>
            <div className="d-flex flex-fill justify-content-end" >
                <div className="d-flex flex-column d-none d-sm-block me-3 mt-1">
                    <div className="text-nowrap">{state.user.last_name + ' ' + state.user.first_name}</div>
                    <button className='btn btn-link btn-md p-0  text-decoration-none align-self-end  text-nowrap'
                        onClick={() => { CONSTANTS.cookie.delete('access_token'); navigate('/'); setIsLoggedIn(false) }}>Выйти</button>
                </div>
                <div>
                    <button onClick={() => navigate('/tours/profile')} className="py-2 lh-lg justify-content-center align-items-center text-center"
                        style={{ fontSize: '18px', backgroundColor: CONSTANTS.colors[i], width: '50px', height: '50px', borderRadius: '15px' }} >
                            {state.user.last_name[0] + state.user.first_name[0]}</button>
                </div>
            </div>
        </div>
    )
}