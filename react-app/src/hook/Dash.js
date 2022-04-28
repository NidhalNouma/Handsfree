import { useState, useEffect } from "react";
import axios from "axios";

export const Dash = (user) => {
  const [allusers, setAllUsers] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    findAll(user.admin);
  }, []);

  const findAll = async (admin) => {
    if (!admin) return null;
    const { data } = await axios.post("/user/all", { admin: admin });

    // console.log(data);
    setAllUsers(data.res);
  };

  const addUser = async (email, password) => {
    try {
      const { data } = await axios.post("/user/add", {
        email,
        password,
        shown: user.admin,
      });
      console.log(data);
      if (data.res) {
        findAll(user.admin);
      } else {
        setErr(data.err);
      }
    } catch (e) {
      console.error(e);
      setErr(e);
    }
  };

  const removeAccount = async (email, name, server) => {
    console.log("remove account ", name);
    const r = { res: null, err: null };
    try {
      const { data } = await axios.post("/account/hide", {
        email,
        name,
        server,
      });
      if (data.res) {
        r.res = data.res;

        findAll(user.admin);
      } else {
        r.err = data.err;
      }
    } catch (e) {
      r.err = e;
      console.error(e);
    }
    return r;
  };

  const setShown = async (email, shown) => {
    console.log("set shown email ", email);
    const r = { res: null, err: null };
    try {
      const { data } = await axios.post("/user/shown", {
        email,
        shown,
      });
      if (data.res) {
        r.res = data.res;

        findAll(user.admin);
      } else {
        r.err = data.err;
      }
    } catch (e) {
      r.err = e;
      console.error(e);
    }
    return r;
  };

  return { allusers, err, addUser, removeAccount, setShown };
};
