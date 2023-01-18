import { useNavigate } from "react-router-dom"
import CONSTANTS from "../bootstrap"

export const HomePage = ({ isLoggedIn }) => {
    const navigate = useNavigate()

    return(
        <div className="d-flex h-100 align-items-between text-center bg-white" style={{ minHeight: '500px' }}>
            <div className="container mb-5 pt-4 d-flex w-100 mx-auto flex-column" >
                <header className="mb-auto">
                    <div>
                        <img className="mb-4" src={CONSTANTS.source_url + "logo.png"} />
                    </div>
                </header>

                <div className="px-3 mt-auto">
                    <p className="mb-5 text-center fs-1" style={{color: '#1A7BD3', fontWeight: '900'}}>Сайт в процессе разработки, но поездки уже доступны</p>
                    <button onClick={() => navigate(isLoggedIn ? 'tours': 'auth')} style={{ border: '1px solid #1A7BD3'}} className="btn btn-lg fw-bold">
                        <p style={{ fontWeight: '600', color: '#1A7BD3' }}>Выбрать направление</p></button>
                </div>
            </div>
        </div>
    )
}