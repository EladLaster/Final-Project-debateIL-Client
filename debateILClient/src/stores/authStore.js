import { makeAutoObservable } from "mobx";
import { login } from "../../services/serverApi.js";

class AuthStore {
    constructor() {
        makeAutoObservable(this);
        this.activeUser =
            localStorage.activeUser &&
            localStorage.activeUser !== "undefined"
                ? JSON.parse(localStorage.activeUser)
                : null;
    }

    handleLogin = async (email, password) => {
        const user = await login(email, password);
        console.log(user);
        localStorage.activeUser = JSON.stringify(user);
        this.activeUser = user;
        return user;
    }

    handleRegister = async () => {
        // ...השלם כאן את הפונקציה...
    }
}

export const authStore = new AuthStore();