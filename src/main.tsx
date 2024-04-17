import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from './pages/Error'
import Home from './pages/Home'
import Layout from './layout/Layout'
import NotFound from './pages/NotFound'
// import { registerSW } from 'virtual:pwa-register'
// registerSW({
//     onNeedRefresh() {
//       // 사용자에게 업데이트를 알리고 새로고침을 요청할 수 있음
//     },
//     onOfflineReady() {
//       // 오프라인 준비 완료시 알림
//     },
//   });
  

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Layout/> } errorElement={ <Error/> } >
                    <Route index element={ <Home/> }/>
                </Route>
                <Route path='*' element={ <NotFound/> } />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
