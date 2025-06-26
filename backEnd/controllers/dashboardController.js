import Income from "../models/Income";
import Expense from "../models/Expense";
import User from "../models/User";
import { isValidObjectId, Types } from "mongoose";


const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetching total income and expenses
        const totalIncome = await Income.aggregate([
            {$match : {userId : userObjectId}},
            {$group : {_id : null , total:{$sum : "$amount"}}},
        ])
        console.log('totalIncome', {
          totalIncome,
          userId: isValidObjectId(userId),
        });

        const totalExpense = await Expense.aggregate([
            {$match : {userId: userObjectId}},
            {$group : {_id: null, total : {$sum : "$amount"}}},
        ])

        // get income transactions in last 60 days

        const last60DaysIncomeTransactions = await Income.find({
                userId,
                date:{
                    $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
                },
            }).sort({date:-1});

        //  get total income in last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum,transaction)=> sum + transaction.amount, 0);

        // get expense transactions in last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date:{
                $gte : newDate(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
        }).sort({date : -1});

        // get total expense in last 60 days
        const expenseLast60Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // fetch last 5 transactions
        const lastTransactions = [
            ...(await Income.find({userId}).sort({date: -1}).limit(5)).map(
                (txn)=> ({
                    ...txn.toObject(),
                    type:"income",
                })
            ),
            ...Expense(await Expense.find({userId}).sort({date: -1}).limit(5)).map(
                (txn) =>({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a,b)=> b.date - a.date);
    } catch (error) {
        
    }
}