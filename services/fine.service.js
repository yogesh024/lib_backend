const {fineModel} = require('../model');
const { dbHelper } = require("../helper");

module.exports = {
    createFine: async (body, next) => {
        try {
            const fine = await dbHelper.create(fineModel, body, next);

            return fine;
        } catch (e) {
            console.log(e.toString());
            next(e);
        }
    },
    findFine: async (userId, bookId, next) => {
        try {
            return await dbHelper.findOne(fineModel, { userId, bookId }, {}, next);
           
        } catch (e) {
            console.log(e.toString());
            next(e);
        }
    },
    addFine:function addFineToAccount(userId, getTotalFine) {
        const user = fineModel.find(b => b.id === userId);
      
        if (user) {
          user.fines += fineAmount;
          fs.writeFileSync('database.json', JSON.stringify(db));
          return true; // indicate success
        } else {
          return false; // indicate failure
        }
    }
}