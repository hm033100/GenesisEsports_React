import axios from 'axios';

class MatchService {
    async getAllMatches(){

        const response = await axios.get("http://localhost:8080/matches");
        return response.data;
    }

    async getMatch(json) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("http://localhost:8080/matches/id", json, axiosConfig);
        return response.data;
    }

    async createMatch(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("http://localhost:8080/matches/save", json, axiosConfig);
        return response.data;
    }

    async deleteMatch(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("http://localhost:8080/matches/delete", json, axiosConfig);
        return response.data;
    }
}

export default new MatchService();