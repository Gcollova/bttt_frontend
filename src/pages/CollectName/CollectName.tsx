import React, { useEffect, useMemo, useState } from "react";
import { BaseResponse } from "../../interfaces";
import { User } from "../../interfaces/user_interface";
import { nameCheck } from "../../services/name_regex";
import styles from "./collect_name.module.scss";

const CollectName = () => {
  let maxAge = new Date().setFullYear(new Date().getFullYear() - 150);
  let minAge = new Date().setFullYear(new Date().getFullYear() - 1);
  const [status, setStatus] = useState<
    | "INITIAL"
    | "SEND_DATA"
    | "SENDING_DATA"
    | "DATA_SENDED"
    | "ERROR_SENDING_DATA"
  >();

  const [data, setData] = useState<BaseResponse>();
  const [user, setUser] = useState<User>({
    name: "",
    age: 1,
    dateOfBirth: new Date(minAge).toISOString().split("T")[0],
    isMarried: false,
  });

  function calculateAge(birthday: Date) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    setUser({
      ...user,
      age: Math.abs(ageDate.getUTCFullYear() - 1970),
      dateOfBirth: new Date(birthday).toISOString().split("T")[0],
    });
  }
  function calculateDate(age: number) {
    let toReturn = new Date().setFullYear(new Date().getFullYear() - age);
    setUser({
      ...user,
      age,
      dateOfBirth: new Date(toReturn).toISOString().split("T")[0],
    });
  }

  function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (user.name.trim() !== "" && nameCheck(user.name.trim())) {
      setStatus("SEND_DATA");
    } else {
      alert("Il nome inserito non è valido");
      setUser({
        age: 1,
        name: "",
        dateOfBirth: new Date(minAge).toISOString().split("T")[0],
        isMarried: false,
      });
    }
  }

  useMemo(() => {
    if (user.age < 18 && user.isMarried) {
      setUser({ ...user, isMarried: false });
    }
  }, [user]);

  useEffect(() => {
    if (status === "SEND_DATA") {
      setStatus("SENDING_DATA");
      fetch(`${window.location.origin.replace("3000", "3001")}/collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
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
  }, [status, user]);

  if (status === "ERROR_SENDING_DATA") {
    return (
      <div className={styles.badResponse}>
        <h1>ERRORE INVIO DATI</h1>
        <button onClick={() => setStatus("INITIAL")}>RIPROVA</button>
      </div>
    );
  }

  if (status === "SEND_DATA" || status === "SENDING_DATA") {
    return (
      <div className={styles.response}>
        <h1>INVIO IN CORSO</h1>
        <button onClick={() => setStatus("INITIAL")}>ANNULLA</button>
      </div>
    );
  }

  if (status === "DATA_SENDED") {
    return (
      <div className={styles.response}>
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
      <form onSubmit={(e) => handleSubmission(e)} action="">
        <div className={styles.inputWrapper}>
          <label htmlFor="searchName"> Nome utente</label>
          <input
            id="searchName"
            name="searcName"
            type="text"
            value={user.name}
            onChange={(e) => {
              setUser({ ...user, name: e.target.value });
            }}
            required
          ></input>
        </div>
        <div className={styles.inputWrapper}>
          <label htmlFor="dateOfBirth"> Data di nascita</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={user.dateOfBirth}
            onChange={(e) => {
              calculateAge(new Date(e.target.value));
            }}
            required
            min={new Date(maxAge).toISOString().split("T")[0]}
            max={new Date(minAge).toISOString().split("T")[0]}
          ></input>
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="age"> Età</label>
          <input
            id="age"
            name="age"
            type="number"
            value={user.age}
            onChange={(e) => {
              if (
                parseInt(e.target.value) >= 1 &&
                parseInt(e.target.value) <= 150
              ) {
                calculateDate(parseInt(e.target.value));
              }
            }}
            required
          ></input>
        </div>

        <div className={styles.inputWrapper}>
          <p>È sposato?</p>
          <div className={styles.radioWrapper}>
            <label htmlFor="yes"> Si</label>
            <input
              disabled={user.age < 18}
              id="yes"
              placeholder="Si"
              name="isMarried"
              type="radio"
              checked={user.isMarried}
              onChange={(e) => {
                setUser({ ...user, isMarried: true });
              }}
              required
            ></input>
          </div>
          <div className={styles.radioWrapper}>
            <label htmlFor="no"> No</label>
            <input
              disabled={user.age < 18}
              id="no"
              name="isMarried"
              type="radio"
              checked={!user.isMarried}
              onChange={(e) => {
                setUser({ ...user, isMarried: false });
              }}
              required
            ></input>
          </div>
        </div>
        <button>VALIDA</button>
      </form>
    </div>
  );
};

export default CollectName;
