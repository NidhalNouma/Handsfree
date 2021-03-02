import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserC = createContext(null);

export const User = () => {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(localStorage.getItem("user") ? true : false);

  useEffect(() => {
    if (load && user === null) getUser(setUser, setLoad);
  }, [user, load]);

  const login = async (email, password, setErr) => {
    setErr("");
    if (!email || !password) {
      setErr("Email and Password required");
      return;
    }
    console.log("login ... ", email);
    const r = { res: null, err: null };
    try {
      const { data } = await axios.post("/user", { email, password });
      console.log(data);
      if (data.res) {
        setUser(data.res);
        localStorage.setItem("user", data.res._id);
        r.res = data.res;
      } else if (data.err) {
        r.err = data.err;
        setErr(data.err);
      } else setErr("Email or Password Incorrect");
    } catch (e) {
      r.err = e;
      console.error(e);
      setErr(e);
    }
    return r;
  };

  const register = async (email, password, cpassword, setErr) => {
    setErr("");
    if (!email || !password) {
      setErr("Email and Password required");
      return;
    }
    if (cpassword !== password) {
      setErr("Password not match");
      return;
    }
    console.log("register ... ", email);
    const r = { res: null, err: null };
    try {
      const { data } = await axios.post("/user/add", { email, password });
      console.log(data);
      if (data.res) {
        setUser(data.res);
        localStorage.setItem("user", data.res._id);
        r.res = data.res;
      } else {
        r.err = data.err;
        setErr(data.err);
      }
    } catch (e) {
      r.err = e;
      console.error(e);
      setErr(e);
    }
    return r;
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const removeAccount = async (name, server, index) => {
    console.log("remove account ", name);
    const r = { res: null, err: null };
    setUser({
      ...user,
      accounts: rmAccount(name, server, user.accounts),
    });
    try {
      const { data } = await axios.post("/account/hide", {
        email: user.email,
        name,
        server,
      });
      if (data.res) {
        // setUser(data.res);
        r.res = data.res;
      } else {
        r.err = data.err;
      }
    } catch (e) {
      r.err = e;
      console.error(e);
    }
    return r;
  };

  return { user, setUser, login, register, signOut, removeAccount, load };
};

function rmAccount(name, server, acc) {
  const r = acc.filter((i) => {
    return i.name !== name || i.server !== server;
  });
  return r;
}

async function getUser(set, setLoad) {
  let r = null;
  const id = localStorage.getItem("user");
  if (id) {
    const { data } = await axios.post("/user/" + id);
    r = data.res;
    set(r);
    setLoad(false);
  }
  return r;
}
