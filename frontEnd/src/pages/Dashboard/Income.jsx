import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';

import IncomeOverview from '../../components/Income/IncomeOverview';
import { useEffect } from 'react';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { set } from 'mongoose';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import useUserAuth from '../../hooks/useUserAuth';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import { toast } from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = React.useState([]);
  const [OpenAddIncomeModal, setOpenAddIncomeModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState({
    show: false,
    data: null,
  });

  // Handle Income Data
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log('Something went wrong while fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    // validation check
    if (!source.trim()) {
      toast.error('Source is required');
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Amount should be a valid number greater than 0.');
      return;
    }
    if (!date) {
      toast.error('Date is required');
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModal(false);
      toast.success('Income added successfully');
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        'Error adding income:',
        error.response?.data?.message | error.messages
      );
    }
  };

  // Handle Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({
        show: false,
        data: null,
      });
      toast.success('Income details deleted successfully.');
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        'Error deleting income:',
        error.response?.data?.message || error.messages
      );
    }
  };

  // Handle Download Income
  const handleDownloadIncomeDetails = async () => {};

  useEffect(() => {
    fetchIncomeDetails();

    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu='Income'>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({
                show: true,
                data: id,
              });
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>
        <Modal
          isOpen={OpenAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title='Add Income'
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title='Delete Income'
        >
          <DeleteAlert
            content='Are you sure you want to delete this income detail ?'
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
