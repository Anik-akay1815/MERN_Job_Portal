import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Jobs from './pages/Jobs.jsx'
import CompanyRegister from './pages/CompanyRegister.jsx'
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import MyJobs from "./pages/MyJobs.jsx";
import PostJobs  from "./pages/PostJobs.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
import JobDetail from './pages/JobDetail.jsx';
import Applicants from "./pages/Applicants.jsx";

function App(){
  return(
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/company/register' element={<CompanyRegister/>}/>
        <Route path='/jobs' element={<Jobs/>}/>
        <Route path='/jobs/:id' element={<JobDetail/>}/>
        <Route path='/company/:id' element={<CompanyProfile/>}/>  {/* user access */}        
        <Route path='/userprofile' element={<ProtectedRoute allowedRole='user'><UserProfile/></ProtectedRoute>}/>
        <Route path="/myapplications" element={<ProtectedRoute allowedRole='user'><MyApplications/></ProtectedRoute>}/>
        <Route path='/dashboard' element={<ProtectedRoute allowedRole='company'><Dashboard/></ProtectedRoute>}/>
        <Route path='/companyprofile' element={<ProtectedRoute allowedRole='company'><CompanyProfile/></ProtectedRoute>}/> {/* company access */}
        <Route path='/myjobs' element={<ProtectedRoute allowedRole='company'><MyJobs/></ProtectedRoute>}/>
        <Route path='/postjob' element={<ProtectedRoute allowedRole='company'><PostJobs/></ProtectedRoute>}/>
        <Route path='/editjob/:id' element={<ProtectedRoute allowedRole='company'><PostJobs/></ProtectedRoute>}/>
        <Route path='/applications/:jobId' element={<ProtectedRoute allowedRole='company'><Applicants/></ProtectedRoute>}/>
        <Route path='/user/:id' element={<ProtectedRoute allowedRole='company'><UserProfile/></ProtectedRoute>}/>

      </Routes>
    </>
  )
}
export default App;