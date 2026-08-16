const API_URL = 'http://localhost:8000'


export async function createWorkSpace(work){
    try {
        const response = await fetch(`${API_URL}/`,{
        method: 'POST',
        headers: {'Content-Type' : 'application'},
        body: JSON.stringify(work),
        credentials:'include'
       })
        const result = await response.json()
        console.log(result)
        if(!response.ok){
            let workMsg = "The workspace failed"
            if(Array.isArray(result.detail)){
                workMsg = result.detail[0].msg
            }
            else if(typeof result.detail === "string"){
                workMsg = result.detail
            }
            throw new Error(workMsg)
        }
        return result
        
    } catch (error) {
        console.log("The error is ", error)
    }
}

export async function getWorkSpace(){
    try{
        const response = await fetch(`${API_URL}/`,{
            method: 'GET',
            headers:{'Content-Type': 'application/json'},
            credentials: 'include'
        })
        if(response.status == 401){
            return null
        }
        const data = await response.json()
        if(!response.ok){
            throw new Error("Session expired")
        }
        return data
    }
    catch(err){
        console.log("this is another one of thee err",err)
        throw(err)
    }
}
