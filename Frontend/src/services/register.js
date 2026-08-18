const API_URL = 'http://localhost:8000'


export async function createUser(formData) {
    try {
        const response = await fetch(`${API_URL}/users/`,{
        method: 'POST',
        headers:{'Content-Type' : "application/json"},
        body: JSON.stringify(formData),
        credentials: 'include'
       })
       const data = await response.json()
       console.log(data)
       if(!response.ok){
        let regMsg = 'Registration failed'
        if(Array.isArray(data.detail)){
            regMsg = data.detail[0].msg
        }else if(typeof data.detail === "string"){
            regMsg = data.detail
        }
        throw new Error(regMsg)
       }
       return data;
    } catch (error) {
        console.log("the reesgistration was not successful", error)
        throw error;
    }

}

export async function loginUser(data) {
    const formData = new URLSearchParams()
    formData.append('username', data.username || data.email)
    formData.append('password', data.password_hash)
    try {
        const response = await fetch(`${API_URL}/auth/login`,{
            method:'POST',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
            body: formData.toString(),
            credentials:'include' 
        })
        const result = await response.json()
        
        if(!response.ok){
            let logMsg = 'Login failed'
            if(Array.isArray(result.detail)){
                logMsg = result.detail[0].msg
            }else if(typeof result.detail === 'string'){
                logMsg = result.detail
            }
            throw new Error(logMsg)
        }
        return result
        
    } catch (error) {
        console.log("The login was not successful",error)
        throw error
    }
}


export async function logoutUser() {
    try {
        const response = await fetch(`${API_URL}/auth/logout`,{
            method: 'POST',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            credentials:'include'
        })
        if(!response.ok){
            throw new Error("Log out failed")
        }
        return await response.json()
        
    } catch (error) {
        console.log("Logout is not successful",error)
        throw error
    }
}


export async function getMe(){
    const response = await fetch(`${API_URL}/users/me`,{
        method: 'GET',
        credentials: 'include'
    })
    const data = await response.json()
    if(response.status === 401){
        return null;
    }
    if(!response.ok){
        throw new Error("Session expired")
    }
    return data
}