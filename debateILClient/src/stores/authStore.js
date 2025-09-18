import { makeAutoObservable } from "mobx";
import {login} from "../../services/server.js"

class AuthStore
{
    activeUser =
  localStorage.activeUser &&
  localStorage.activeUser !== "undefined"
    ? JSON.parse(localStorage.activeUser)
    : null;

    handleLogin = async (email, password) =>
    {
        const user  = await login(email, password);
        console.log(user);
        localStorage.activeUser = JSON.stringify(user);
        this.activeUser = user;
        return user;
    }
}

export const authStore = new AuthStore();