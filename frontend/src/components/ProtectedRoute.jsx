import {Navigate} from 'react-router-dom';
 function ProtectedRoute({children, allowedRole}){
  const token=localStorage.getItem('token');
  const user=JSON.parse(localStorage.getItem('user'));
  if(!token){
    return <Navigate to='/login' replace/>
  }
  if(allowedRole){
    const rolesAllowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if(!rolesAllowed.includes(user?.role)){
      return <Navigate to='/' replace/>
    }
  }
  return children;
 }
 export default ProtectedRoute;