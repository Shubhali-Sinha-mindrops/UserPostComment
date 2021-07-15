const db = require('../models');
const User = db.user;

module.exports = (function () {
    const canAccess = (access = ['admin']) => {
        return async (req, res, next) => {
            try {
                if(!access) {
                    return res.status(401).send({message: "Can't access...role not defined"});
                }

                const isAnyone = access.includes('anyone');
                if (isAnyone) {
                    return next()
                }

                if(typeof access === 'string') {
                    access = [access];
                }

                const email = req.loggedInUser.email;
                const user = await User.findOne({
                    where: {
                        email: email
                    }
                });

               (req, res, next) => {
                   if(access.length && access.includes(user.role)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                   }
               }
               for(let i=0; i<=access.length-1; i++) {
                if(user.role === access[i]) {
                    next();
                }
                else {
                    return res.status(401).send({message: "Permission denied"});
                }
            }
            } catch (error) {
                next(error);
            }
        }
    }
    return {
        canAccess
    }
})()