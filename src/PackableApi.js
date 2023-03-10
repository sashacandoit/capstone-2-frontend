import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class PackableApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //Token for interacting with the API stored in the header
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${PackableApi.token}` };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get token from login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup new user */

  static async signup(data) {
    console.log("Sending:", data)
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile changes */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  /** Get the current user. */
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get all user lists (ordered by arrival date). */
  static async getLists() {
    let res = await this.request(`lists`);
    return res.lists;
  }

  /** Add new list */
  static async addList(data) {
    console.log("Sending:", data)
    let res = await this.request(`lists`, data, "post");
    return res.list;
  }

  /** Get list details by id. */
  static async getListDetails(list_id) {
    let res = await this.request(`lists/${list_id}`);
    return res.list;
  }

  /** Delete list */
  static async deleteList(list_id) {
    let res = await axios.delete(`${BASE_URL}/lists/${list_id}`)
    // let res = await this.request(`lists/${list_id}`, "delete");
    return res;
  }

  /** Get forcast with data from list id. */
  static async getForcast(list_id) {
    let res = await this.request(`lists/${list_id}/forcast`);
    return res.forcast;
  }

  /** Get all items for a selected list. */
  static async getItems(list_id) {
    let res = await this.request(`lists/${list_id}/items`);
    return res.items;
  }

  /** Add new list item to list*/
  static async addListItem(list_id, data) {
    console.log("Sending:", data)
    let res = await this.request(`lists/${list_id}/items`, data, "post");
    return res.list;
  }
  
  /** Update list item */
  static async updateListItem(item_id, data) {
    console.log("Sending:", data)
    let res = await this.request(`items/${item_id}`, data, "patch");
    return res.item;
  }

  /** Delete list item */
  static async deleteListItem(list_id, item_id) {
    let res = await this.request(`lists/${list_id}`, item_id, "delete");
    return res;
  }

}

export default PackableApi;

