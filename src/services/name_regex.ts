export function nameCheck(value:string){
    if(value.match(/^[a-z ,.'-]+$/i)! !== null && value.length >= 5 && value.length <= 50){
        return true;
    }
    else{
        
        return false;
    }
    
    

}