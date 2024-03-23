const { tokenHelper } = require("../helper");

module.exports = {
    auth: async (req, res, next) => {
        const cookies = await tokenHelper.decode(req.cookies['token'], next);
        const userId = cookies?.userId;
        if (!userId) {
            res.locals.loggedIn = false;
          
        }
        else{ res.locals.loggedIn = false;
            
        }
        next();
    }
}