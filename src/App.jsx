import Adminpanel from "./Adminpanel/Adminpanel"
import Mainpage from "./Mainpage/Mainpage"

import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {


  return (
    <>
<BrowserRouter>
<Routes>

<Route path="/"  element={<Mainpage/>} />
<Route path="/admin"  element={<Adminpanel/>} />

</Routes>
</BrowserRouter>
    </>
  )
}

export default App
