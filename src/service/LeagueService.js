import axios from 'axios';

class LeagueService {
    async getAllLeagues(){

        const response = await axios.get("https://genesis-esports.herokuapp.com/leagues");
        return response.data;
    }

    async getLeague(json) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/leagues/id", json, axiosConfig);
        return response.data;
    }

    async createLeague(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/leagues/save", json, axiosConfig);
        return response.data;
    }

    async deleteLeague(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/leagues/delete", json, axiosConfig);
        return response.data;
    }
}

export default new LeagueService();
