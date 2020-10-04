export default class GameService {
  CONFIG = "./config.json";

  async getConfig() {
    const res = await fetch(`${this.CONFIG}`);

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`);
    }

    const body = await res.json();
    return body;
  }
}
