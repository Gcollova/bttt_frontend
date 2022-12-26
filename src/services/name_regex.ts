export function nameCheck(value:string){
    if(value.match(/^[a-z ,.'-]+$/i)! !== null){
        return true;
    }
    else{
        
        return false;
    }
    
    

}