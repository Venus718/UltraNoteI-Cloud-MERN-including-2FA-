const User = require('../../models/user');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

module.exports = {
    async change_2FA(req, res) {
        try {
            const id = req.body._id;
            const isActive = req.body.isActive;
            User.findByIdAndUpdate({_id: id}, { otp_auth: isActive }).then(user => {
                if (isActive === true) {
                    res.status(200).json({message: 'OTP enabled'});
                } else {
                    res.status(200).json({message: 'OTP disabled'});
                }
            }).catch(err => {
                res.status(400).json({message: 'ERROR WHILE CHANGING THE 2FA STATE'});
            });
        } catch (error) {
            res.status(400).json({message: 'ERROR OUCURED'})
        }
    },

    async change_currency(req, res){
        try {
            const id = req.body.id;
            const currency = req.body.currency;

            await User.findByIdAndUpdate({_id: id}, { currency: currency });
            res.status(200).json({message: 'currency changed'});

        } catch (error){
            console.log(error);
            res.status(400).json({message: 'ERROR OUCURED'})
        }
    },

    async auth_2FA_TMP(req, res){
        try {
            const {state, _id} = req.body;
            if(state == true){
                const secret = speakeasy.generateSecret({ length: 20 });
                
                var token = speakeasy.totp({
                    secret: secret.base32,
                    label: 'UltraNote Infinity', 
                    encoding: 'base32'
                });
                let dataUser = await User.findByIdAndUpdate({_id: _id}, { two_fact_auth_code: token, secret: secret, two_fact_auth_tmp: true },{
                    new: true
                });

                QRCode.toDataURL(secret.otpauth_url,{label:'UltraNote Infinity'}, (err, image_data) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).send('Internal Server Error');
                    }
// console.log(Object.fromEntries(Object.entries(dataUser._doc).filter(value => value[0] != 'two_fact_auth_code')));
                    res.send({value: { qrCode: image_data }, user: Object.fromEntries(Object.entries(dataUser._doc).filter(value => value[0] != 'two_fact_auth_code'))});
                })
            }else {
                let data = await User.findByIdAndUpdate({_id: _id}, { two_fact_auth: false,two_fact_auth_code: '', secret: {}, two_fact_auth_tmp: false },{
                    new: true
                });
// console.log(Object.fromEntries(Object.entries(data._doc).filter(value => value[0] != 'two_fact_auth_code')));
                res.send({
                    value: '',
                    user: Object.fromEntries(Object.entries(data._doc).filter(value => value[0] != 'two_fact_auth_code'))
                });
            }
        } catch (error){

        }
    },

    async auth_2FA_Confirm(req, res){
        try {
            const {token, _id} = req.body;
            const user = await User.findById(_id)
            const verified = speakeasy.totp.verify({
                secret: user.secret.base32,
                encoding: 'base32',
                token,
                window: 1
            });
            if(verified){
                const userup = await User.findByIdAndUpdate({_id: _id}, { two_fact_auth: true, two_fact_auth_tmp: false },
                    {
                        new: true
                    });
// console.log(Object.fromEntries(Object.entries(userup._doc).filter(value => value[0] != 'two_fact_auth_code')));
                return res.send(Object.fromEntries(Object.entries(userup._doc).filter(value => value[0] != 'two_fact_auth_code')))
            }
            return res.status(500).send('Token Error');
        } catch (error){

        }
    }
}