/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This file is currently for testing but will be used in the future for session making.
 */
var  User = (function() {
    var _id = "";
    var firstName = "";

    var get_id = function() {
        return _id;
    }

    var set_id = function(_id) {
        this._id = _id;
    }

    var getFirstName = function () {
        return  firstName;
    }

    var setFirstName = function (firstName) {
        this.firstName = firstName;
    }


    return {
        get_id: get_id,
        set_id: set_id,
        getFirstName: getFirstName,
        setFirstName: setFirstName,
    }
})();

export default User;