import Expense from '../models/Expense.js';
// import User from '../models/User.js';
import xlsx from 'xlsx';

// Function to add income
const addExpense = async (req, res) => {
  const userId = req.user._id;
  try {
    const { icon, category, amount, date } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });
    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
// Function to get all expenses
const getAllExpense = async (req, res) => {
  const userId = req.user._id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.send(expense);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Function to delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    await Expense.findOneAndDelete({ _id: id });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Function to download expenses as an Excel file
const downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    const data = expense.map((item) => ({
      category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new(); // 1️⃣ Naya Excel workbook banaya
    const ws = xlsx.utils.json_to_sheet(data); // 2️⃣ JSON data ko Excel worksheet me convert kiya
    xlsx.utils.book_append_sheet(wb, ws, 'Expense'); // 3️⃣ "Oye workbook (wb)! Ye worksheet (ws) ko le aur isse 'Expense' naam wali ek sheet bana ke jod le."
    xlsx.writeFile(wb, 'expense_details.xlsx'); // 4️⃣ Excel file likh di
    res.download('expense_details.xlsx'); //  5️⃣ Download karne ke liye bhej diya
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel };
