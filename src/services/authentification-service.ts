class AuthentificationService {
  static isAuthentificated: boolean = false; //au demarrage l'user n'est pas connecté

  static login(username: string, password: string): Promise<boolean> {
    const isAuthentificated = username === "pikachu" && password === "pikachu";

    return new Promise((resolve) => {
      setTimeout(() => {
        this.isAuthentificated = isAuthentificated;
        resolve(isAuthentificated);
      }, 1000);
    });
  }
}

export default AuthentificationService;
