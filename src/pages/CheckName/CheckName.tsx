import React, { useEffect, useState } from "react";
import { BaseResponse } from "../../interfaces";
import { nameCheck } from "../../services/name_regex";
import styles from "./check_name.module.scss";

export function CheckName() {
  const [status, setStatus] = useState<
    | "INITIAL"
    | "SEND_DATA"
    | "SENDING_DATA"
    | "DATA_SENDED"
    | "ERROR_SENDING_DATA"
  >();
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState<BaseResponse>();

  function handleSubmission(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    console.log(value.trim().match(/^[a-z ,.'-]+$/i))
    if(value.trim() !== "" && nameCheck(value)){

      setStatus("SEND_DATA");
    } else{
      alert('Il nome inserito non è valido')
      setValue("");
    }

  }

  useEffect(() => {
    if (status === "SEND_DATA") {
      setStatus("SENDING_DATA");
      fetch("http://localhost:3001/info/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: value,
        }),
      })
        .then((rawResponse) => {
          if ([200, 201].includes(rawResponse.status)) {
            return rawResponse.json();
          } else {
            throw new Error();
          }
        })
        .then((response: BaseResponse) => {
          setStatus("DATA_SENDED");
          setData(response);
        })
        .catch((e) => {
          setStatus("ERROR_SENDING_DATA");
        });
    }
  }, [status, value]);

  if (status === "ERROR_SENDING_DATA") {
    return (
      <div>
        <h1>ERRORE INVIO DATI</h1>
        <button onClick={() => setStatus("INITIAL")}>RIPROVA</button>
      </div>
    );
  }

  if (status === "SEND_DATA" || status === "SENDING_DATA") {
    return (
      <div>
        <h1>INVIO IN CORSO</h1>
        <button onClick={() => setStatus("INITIAL")}>ANNULLA</button>
      </div>
    );
  }

  if (status === "DATA_SENDED") {
    return (
      <div>
        {data?.success === true && <h1>DATI INVIATI VALIDI</h1>}
        {data?.success === false && <h1>DATI INVIATI NON VALIDI</h1>}
        <button onClick={() => setStatus("INITIAL")}>
          INVIA UN ALTRO VALORE
        </button>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      
      <form onSubmit={(e)=> handleSubmission(e)} action="">
        <div className={styles.inputWrapper}>

          <label htmlFor="searchName"> Inserisci il nome</label>
          <input
            id="searchName"
            name="searcName"
            type="text"
            value={value}
            onChange={(e) => {
              if(e.target.value.match(/^[a-z ,.'-]+$/i)){
                
              }
              setValue(e.target.value);
            }}
            required
          ></input>
        </div>
        <button >VALIDA</button>
      </form>
    </div>
  );
}
