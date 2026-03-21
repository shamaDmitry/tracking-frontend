import { makeAutoObservable } from "mobx";

export class AuthStore {
  userId: string | null = null;

  constructor() {
    makeAutoObservable(this);

    this.userId = localStorage.getItem("userId");
  }

  get isAuthenticated() {
    return !!this.userId;
  }

  login(userId: string) {
    this.userId = userId;

    localStorage.setItem("userId", userId);
  }

  logout() {
    this.userId = null;

    localStorage.removeItem("userId");
  }
}
