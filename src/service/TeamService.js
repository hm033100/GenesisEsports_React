import axios from 'axios';

class TeamService {
    async getAllTeams(){

        const response = await axios.get("http://localhost:8080/teams");
        return response.data;
    }
}

export default new TeamService();