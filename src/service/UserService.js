/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 *  This class is the UserService class and it is resposible for the AXIOS calls to spring.
 */

//Necessary imports for the project.
import axios from 'axios'

class UserService {

    /**
     * This function will make an axios call to the Spring REST API, it will send a username and password and return a User object in JSON format
     * if the user was validated. 
     * 
     * @param {*} json 
     */
    async loginUser(json) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/users/validate", json, axiosConfig);
        return response.data;
    }
    /**
     * This function will make an axios call to the Spring Rest API, it will send a JSON user object to be added to the database. 
     * @param {*} json 
     */
    async registerUser(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/users/save", json, axiosConfig);
        return response.data;
    }

    /**
     * This function will make an axios call to the Spring Rest API, it will send a JSON user object to be added to the database. 
     * @param {*} json 
     */
    async getUser(json) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/users/id", json, axiosConfig);
        return response.data;
    }

    /**
     * This function will make an axios call to the Spring Rest API, it will send a JSON user object to be added to the database. 
     * @param {*} json 
     */
     async editUser(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/users/save", json, axiosConfig);
        return response.data;
    }

    async getAllUsers(){

        const response = await axios.get("https://genesis-esports.herokuapp.com/users");
        return response.data;
    }

}

export default new UserService();