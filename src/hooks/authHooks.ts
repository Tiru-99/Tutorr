
import { useMutation , useQuery} from '@tanstack/react-query';
import axios from 'axios';

const signupUser = async (userData: { email: string; password: string; type: string ; name : string }) => {
  const response = await axios.post('/api/auth/signup', userData); // Replace with your actual API endpoint
  return response.data;
};

const loginUser = async (userData: { email: string; password: string ; type:string }) => {
  const response = await axios.post('/api/auth/login', userData, {
    withCredentials: true, // important to send cookies!
  });
  localStorage.setItem("userId" , response.data.userId );
  localStorage.setItem("type" , response.data.type); 
  return response.data; 
}

const isLoggedIn = async() => {
  const response = await axios.get('/api/auth/isAuthenticated', {
    withCredentials : true
  });
  console.log("the response is from " , response.data)
  return response.data.authenticated; 
}

const logoutUser = async() => {
  const response = await axios.post('/api/auth/logout' , {}, {
    withCredentials : true 
  })
  return response ; 
}

const isAuthorizedAndAuthenticated = async(userType : string) => {
  const response = await axios.post('/api/auth/isAuthenticated' , { userType } ,{
    withCredentials : true 
  });
  console.log("Autho" , response);
  return response.data.authenticated; 
}



export const useSignup = () => {
  return useMutation({
    mutationFn : signupUser
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn : loginUser
  })
};

export const useAuthorized = () => {
  return useMutation({
    mutationFn : isAuthorizedAndAuthenticated
  })
}

export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ['isAuthenticated'], 
    queryFn: isLoggedIn,
    retry: false
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn : logoutUser 
  })
}