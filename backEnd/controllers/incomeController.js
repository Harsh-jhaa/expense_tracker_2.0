import Income from '../models/Income.js';
import User from '../models/User.js';
import xlsx from 'xlsx';

const addIncome = async (req, res) => {
  const userId = req.user._id;
  try {
    const { icon, source, amount, date } = req.body;
    if (!source || !amount || !date) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const getAllIncome = async (req, res) => {
  const userId = req.user._id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.send(income);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
const deleteIncome = async (req, res) => {
  const { id } = req.params;
  try {
    await Income.findOneAndDelete({ _id: id });
    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
const downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new(); // 1️⃣ Naya Excel workbook banaya
    const ws = xlsx.utils.json_to_sheet(data); // 2️⃣ JSON data ko Excel worksheet me convert kiya
    xlsx.utils.book_append_sheet(wb, ws, 'Income'); // 3️⃣ "Oye workbook (wb)! Ye worksheet (ws) ko le aur isse 'Income' naam wali ek sheet bana ke jod le."
    xlsx.writeFile(wb, 'income_details.xlsx'); // 4️⃣ Excel file likh di
    res.download('income_details.xlsx'); //  5️⃣ Download karne ke liye bhej diya
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };
