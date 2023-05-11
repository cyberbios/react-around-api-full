export class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(res.statusText);
  }

  async _request(url, options) {
    return await fetch(url, options).then(this._checkResponse);
  }

  /**
   * get info about user from server
   * @returns Object
   */
  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  //get all cards
  async getInitialCards() {
    return await this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  async editUserInfo(newUserInfo) {
    return await this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(newUserInfo),
    });
  }

  async addCard(newCardInfo) {
    return await this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(newCardInfo),
    });
  }

  async deleteCard(cardId) {
    return await this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  changeLikeCardStatus(cardId, like) {
    return this._request(this._baseUrl + "/cards/likes/" + cardId, {
      headers: this._headers,
      method: like ? "PUT" : "DELETE",
    });
  }

  async editUserAvatar(avatar) {
    return await this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    });
  }
}
const jwt = localStorage.getItem("jwt");
const api = new Api({
  baseUrl: "https://api.lev-meir.mooo.com",
  headers: {
    authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
  },
});
// "https://api.lev-meir.mooo.com"

export default api;
