import axios from 'axios';

class TeamService {
    async getAllTeams(){

        const response = await axios.get("https://genesis-esports.herokuapp.com/teams");
        return response.data;
    }

    async getTeam(json) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/teams/id", json, axiosConfig);
        return response.data;
    }

    async createTeam(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/teams/save", json, axiosConfig);
        return response.data;
    }

    async deleteTeam(json) {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        const response = await axios.post("https://genesis-esports.herokuapp.com/teams/delete", json, axiosConfig);
        return response.data;
    }
}

export default new TeamService();
