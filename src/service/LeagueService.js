/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 *  This class is the UserService class and it is resposible for the AXIOS calls to spring.
 */

//import axios to the service
import axios from 'axios';

class LeagueService {

    /**
     * 
     * @returns 
     */
    async getAllLeagues(){

        const response = await axios.get("http://genesis-esports.herokuapp.com/leagues");
        return response.data;
    }

    async getLeague(json) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("http://genesis-esports.herokuapp.com/leagues/id", json, axiosConfig);
        return response.data;
    }

    async createLeague(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("http://genesis-esports.herokuapp.com/leagues/save", json, axiosConfig);
        return response.data;
    }

    async deleteLeague(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("http://genesis-esports.herokuapp.com/leagues/delete", json, axiosConfig);
        return response.data;
    }
}

export default new LeagueService();
