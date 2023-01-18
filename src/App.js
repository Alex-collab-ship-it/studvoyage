import { useState, useEffect } from 'react';
import { Stack } from 'react-bootstrap';
import CONSTANTS from './bootstrap';
import { MainScreen } from './screens/MainScreen';
import { Footer } from './pages/components/Footer';
import { AuthScreen } from './screens/AuthScreen';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/Home';

function App() {
  let access_token = CONSTANTS.cookie.get('access_token')
  const [isLoggedIn,setIsLoggedIn] = useState(access_token !== undefined)
  return (
    <Stack style={{ minHeight: '100vh', }}>
      <div className="container-fluid px-sm-5 px-2 pt-4 pb-4 align-items-center" style={{ width: '100%', height: '100%' }}>
        <Routes>
          <Route path='/' element={ <HomePage  isLoggedIn={isLoggedIn} /> }/>
          <Route path='tours/*' element={<MainScreen access_token={access_token} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='auth/*' element={<AuthScreen setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
      <Footer />
    </Stack>
  )




}


export default App;
