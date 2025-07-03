import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blogs from "./components/Blogs";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import Blog from "./components/Blog";
import DetailedBlog from "./components/DetailedBlog";
import ContactUs from "./components/ContactUs";


function App() {
  return (
    <div className="">
     
      <BrowserRouter>
        <Routes>
            <Route path='/blogs' element={<Blogs/>}/>
              <Route path='/blog/:blogId' element={<DetailedBlog/>}/>
            <Route path='/' element={<Blog/>}/>
              <Route path='/contact' element={<ContactUs/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/forget-password' element={<ForgotPassword/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        </Routes>
     
      </BrowserRouter>
    </div>
  );
}

export default App;
