import Cookies from 'universal-cookie';
import service from './../service/UserService';
import UserInfoForm from './UserInfoForm';
import React, { useState, useEffect } from 'react';


//Cookies (session) - The session used to grab the user and show their information
const cookies = new Cookies();
const _id = cookies.get('Id');

/**
 * This function will use logic and react components to display the user information in a form 
 * with preloaded data
 * @param {*} props 
 * @returns 
 */
export default function Component(props) {

    const[data, setData] = useState();
    const [isLoading, setLoading] = useState(true);

    //Setup onChange constants in order to use the texboxed to edit the user information (Work In Progress)
    const onChangeUsername = (event) => {
        setData({
            ...data,
            username: event.target.value
        })
    }
    
    const onChangePassword = (event) => {
        setData({
            ...data,
            password: event.target.value
        })
    }
    
    const onChangeEmail = (event) => {
        setData({
            ...data,
            email: event.target.value
        })
    }
    
    const onChangePhoneNumber = (event) => {
        setData({
            ...data,
            phoneNumber: event.target.value
        })
    }
    
    const onChangeGame = (event) => {
        setData({
            ...data,
            game: event.target.value
        })
    }
    
    const onChangeFirstName = (event) => {
        setData({
            ...data,
            firstName: event.target.value
        })
    }
    
    const onChangeLastName = (event) => {
        setData({
            ...data,
            lastName: event.target.value
        })
    }

    /**
     * Asynchronous method to call the UserService in order to grab the information, 
     * it will use the ID grabbed from the session in order to make a POST call to the
     * business layer to recieve User Data in json format
     * @returns 
     */
    const fetchData = async () => {
        //set the ID in json format to make call
        let json = JSON.stringify({
            "_id": _id,
        });

        //Setup try catch in order to complete async promise
        try {
            //loading true in order to grab user info before rendering
            setLoading(true)
            //call the user service with await and store in user constant
            const user = await service.getUser(json)
            //set the Data from the user constant
            setData(user)
            //return user
            return user;
        } catch (e) {
            //display errors if there are any in console format
            console.log(e);
        } finally {
            //set loading to false to display the user information form
            setLoading(false);
        }

    }

    /**
     * This method will call the asynchronous call in order for the page to render after
     * the data is recieved fromt the API Call
     */
    useEffect(() => {
        fetchData();
    }, []);


    /**
     * Return the HTML code based on logic from isLoading
     */
    return (
    <div>
        {/* If is loading is true display loading message */}
        {/* If is loading is false display user information form */}
        {isLoading ? (
            <div>
                Loading Information...
            </div>
        ) : (
            <UserInfoForm
                firstName = {data?.firstName}
                onChangeFirstName = {onChangeFirstName}
                lastName = {data?.lastName}
                onChangeLastName = {onChangeLastName}
                email = {data?.email}
                onChangeEmail = {onChangeEmail}
                phoneNumber = {data?.phoneNumber}
                onChangePhoneNumber = {onChangePhoneNumber}
                game = {data?.game}
                onChangeGame = {onChangeGame}
                username = {data?.username}
                onChangeUsername = {onChangeUsername}
                password = {data?.password}
                onChangePassword = {onChangePassword}
                teamID = {data?.team_id}
            />
        )}
    </div>
    )

}
