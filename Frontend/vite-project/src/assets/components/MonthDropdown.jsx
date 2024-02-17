import React, { useState, useEffect } from 'react';

const MonthDropdown = ({ onSelectMonth }) => {
  const [selectedYear, setSelectedYear] = useState(2022);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {



    fetchData(selectedYear);
  }, [selectedYear]);

  const fetchData = async (year) => {
    
    


    onSelectMonth(selectedMonth, year);
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
  };

  return (
    <div>
      <label htmlFor="selectedYear">Select Year:</label>
      <select id="selectedYear" value={selectedYear} onChange={handleYearChange}>
        <option value={2021}>2021</option>
        <option value={2022}>2022</option>
      </select>
      <label htmlFor="selectedMonth">Select Month:</label>
      <select id="selectedMonth" value={selectedMonth} onChange={handleMonthChange}>
       
      <option value="1">January</option>
      <option value="2">February</option>
      <option value="3">March</option>
      <option value="4">April</option>
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
      <option value="9">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
      </select>
    </div>
  );
};

export default MonthDropdown;
