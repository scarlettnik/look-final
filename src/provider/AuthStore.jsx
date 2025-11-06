import { makeAutoObservable, runInAction } from "mobx";
import {AUTH_TOKEN, HOST_URL} from "../constants.js";

class AuthStore {
    data = null;
    loading = false;
    error = null;
    hasFetched = false;

    constructor() {
        makeAutoObservable(this);
    }

    async postData() {
        if (this.hasFetched || this.loading) return;

        this.loading = true;
        this.error = null;

        const authToken = AUTH_TOKEN;

        try {
            const response = await fetch(`${HOST_URL}/v1/auth/init-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `tma ${authToken}`
                },
            });

            const result = await response.json();

            runInAction(() => {
                this.data = result;
                this.hasFetched = true;
            });

        } catch (err) {
            runInAction(() => {
                this.error = err.message;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

}

export default AuthStore;