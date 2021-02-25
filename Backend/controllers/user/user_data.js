

module.exports = function user_data(user){
return(

    userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.mail,
        phone: user.phone,
        image: user.image,
        createdAt: user.creationDate,
        two_fact_auth: user.two_fact_auth,
        isActive: user.isActive,
        contacts: user.contacts,
        isWalletCreated: user.isWalletCreated,
        currency: user.currency,
        id: user._id
    }
)}