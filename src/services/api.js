import axios from 'axios';

// const baseURL = ; // Replace with your actual API base URL

export const addUser = async (data) => {
  try {
    const response = await axios.post(`https://wechatbackend-qlpp.onrender.com/api/users/add`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error; // Re-throw the error for the caller to handle if necessary
  }
}

export const getUsers = async () => {
  try {
    const response = await axios.get(`https://wechatbackend-qlpp.onrender.com/api/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const addChat = async (data) => {
  try {
    const response = await axios.post(`https://wechatbackend-qlpp.onrender.com/api/chat/add`, data);
    return response.data;
  } catch (error) {
    console.error('Error setting conversation:', error);
    throw error;
  }
}

export const getChat = async (data) => {
  try {
    const response = await axios.post(`https://wechatbackend-qlpp.onrender.com/api/chat/get`,data);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

export const newMessages=async(data)=>{
  try {
    const response=await axios.post(`https://wechatbackend-qlpp.onrender.com/api/message/add`,data);
    console.log(response,'response')
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

export const getMessage=async(id)=>{
  try {
    console.log('id is follows ',id);
   let response= await axios.get(`https://wechatbackend-qlpp.onrender.com/api/message/get/${id}`);
   console.log('response',response);
   return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

export const uploadFile = async (data) => {
  try {
    const response = await axios.post(`https://wechatbackend-qlpp.onrender.com/api/file/upload`, data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; 
  }
}

export const createGroup=async(data)=>{
  try {
    const response=await axios.post(`https://wechatbackend-qlpp.onrender.com/api/group/add/`,data);
    // console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error while creating group:', error);
    throw error; 
  }
}

export const getGroups=async(id)=>{
  try {
    console.log(id);
    const response=await axios.get(`https://wechatbackend-qlpp.onrender.com/api/group/add/${id}`);
    console.log(response);
    console.log(response.data);
    console.log(response.data.groups);
    return response.data;
  } catch (error) {
    console.error('Error while creating group:', error);
    throw error; 
  }
}


export const getGroupsById = async (groupId) => {
  console.log(groupId,'groupheader');
  try {
   
    const response = await axios.get(`https://wechatbackend-qlpp.onrender.com/api/group/specific/${groupId}`);
    console.log(response.data,'list aare');
    return response;
  } catch (error) {
    console.error('Error while fetching group data:', error);
    throw error;
  }
};

export const deleteGroupUsers=async(data)=>{
  console.log(data);
  try {
    const response=await axios.patch(`https://wechatbackend-qlpp.onrender.com/api/group/specific/users`,data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error while deleting group Users:', error);
    throw error;
  }
}

export const addMembers=async(data)=>{
  console.log('clicked');
  console.log(data);
  try {
    const response=await axios.patch(`https://wechatbackend-qlpp.onrender.com/api/group/specific/add`,data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error while deleting group Users:', error);
    throw error;
  }
}


export const Addpic=async(data)=>{
  console.log(data);
  try {
    const response=await axios.patch('https://wechatbackend-qlpp.onrender.com/api/users',data);
    console.log(response);
    return response.data;
    
  } catch (error) {
    console.error('Error while changing group Users:', error);
    throw error;
  }
}
