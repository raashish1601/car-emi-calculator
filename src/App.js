import React, { useState, useEffect } from 'react';
import './App.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App = () => {
  const [formData, setFormData] = useState({
    carPrice: '0',
    downPayment: '0',
    loanAmount: '0',
    interestRate: '0',
    loanTenure: '',
    processingFee: '0',
    insurance: '0',
    registrationFee: '0',
    otherCharges: '0'
  });

  const [emiResult, setEmiResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation - only validate when user is actively entering values
    if (formData.carPrice && parseFloat(formData.carPrice) <= 0) {
      newErrors.carPrice = 'Car price must be greater than 0';
    }
    
    if (formData.interestRate && parseFloat(formData.interestRate) < 0) {
      newErrors.interestRate = 'Interest rate cannot be negative';
    }
    
    if (formData.loanTenure && !formData.loanTenure) {
      newErrors.loanTenure = 'Loan tenure is required';
    }
    
    // Additional validation for loan amount
    const carPriceNum = parseFloat(formData.carPrice) || 0;
    const downPaymentNum = parseFloat(formData.downPayment) || 0;
    const loanAmount = carPriceNum - downPaymentNum;
    
    if (loanAmount <= 0 && carPriceNum > 0) {
      newErrors.downPayment = 'Down payment cannot be greater than or equal to car price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const resetForm = () => {
    setFormData({
      carPrice: '0',
      downPayment: '0',
      loanAmount: '0',
      interestRate: '0',
      loanTenure: '',
      processingFee: '0',
      insurance: '0',
      registrationFee: '0',
      otherCharges: '0'
    });
    setEmiResult(null);
    setShowResults(false);
    setErrors({});
  };

  // Auto-calculate loan amount when car price or down payment changes
  useEffect(() => {
    const carPrice = parseFloat(formData.carPrice) || 0;
    const downPayment = parseFloat(formData.downPayment) || 0;
    const loanAmount = carPrice - downPayment;
    
    if (loanAmount > 0) {
      setFormData(prev => ({
        ...prev,
        loanAmount: loanAmount.toString()
      }));
    }
  }, [formData.carPrice, formData.downPayment]);

  // Real-time EMI calculation
  useEffect(() => {
    const { carPrice, downPayment, interestRate, loanTenure, processingFee, insurance, registrationFee, otherCharges } = formData;
    
    // Only calculate if all required fields have values
    if (carPrice && interestRate && loanTenure) {
      const carPriceNum = parseFloat(carPrice) || 0;
      const downPaymentNum = parseFloat(downPayment) || 0;
      const interestRateNum = parseFloat(interestRate) || 0;
      const loanTenureNum = parseFloat(loanTenure) || 0;
      const processingFeeNum = parseFloat(processingFee) || 0;
      const insuranceNum = parseFloat(insurance) || 0;
      const registrationFeeNum = parseFloat(registrationFee) || 0;
      const otherChargesNum = parseFloat(otherCharges) || 0;
      
      if (carPriceNum > 0 && downPaymentNum >= 0 && interestRateNum > 0 && loanTenureNum > 0) {
        const loanAmount = carPriceNum - downPaymentNum;
        
        if (loanAmount > 0) {
          setIsCalculating(true);
          
          // Calculate total additional costs
          const totalAdditionalCosts = processingFeeNum + insuranceNum + registrationFeeNum + otherChargesNum;
          
          // Calculate EMI
          const monthlyRate = interestRateNum / (12 * 100);
          const numPayments = loanTenureNum * 12;
          
          let emi;
          if (monthlyRate === 0) {
            emi = loanAmount / numPayments;
          } else {
            emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                  (Math.pow(1 + monthlyRate, numPayments) - 1);
          }

          // Calculate totals
          const totalEMI = emi * numPayments;
          const totalInterest = totalEMI - loanAmount;
          const totalCost = carPriceNum + totalAdditionalCosts + totalInterest;

          // Calculate yearly breakdown for real-time preview
          const yearlyBreakdown = [];
          let remainingPrincipal = loanAmount;
          
          for (let year = 1; year <= loanTenureNum; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;
            
            for (let month = 1; month <= 12; month++) {
              const interestPayment = remainingPrincipal * monthlyRate;
              const principalPayment = emi - interestPayment;
              
              yearlyPrincipal += principalPayment;
              yearlyInterest += interestPayment;
              remainingPrincipal -= principalPayment;
            }
            
            yearlyBreakdown.push({
              year: `Year ${year}`,
              principal: Math.round(yearlyPrincipal),
              interest: Math.round(yearlyInterest),
              total: Math.round(yearlyPrincipal + yearlyInterest)
            });
          }

          setEmiResult({
            emi: Math.round(emi),
            totalEMI: Math.round(totalEMI),
            totalInterest: Math.round(totalInterest),
            totalCost: Math.round(totalCost),
            loanAmount: Math.round(loanAmount),
            totalAdditionalCosts: Math.round(totalAdditionalCosts),
            yearlyBreakdown
          });
          setShowResults(true);
          
          setTimeout(() => setIsCalculating(false), 300);
        } else {
          // Clear results if loan amount is invalid
          setEmiResult(null);
          setShowResults(false);
        }
      } else {
        // Clear results if any required field is invalid
        setEmiResult(null);
        setShowResults(false);
      }
    } else {
      // Clear results if required fields are missing
      setEmiResult(null);
      setShowResults(false);
    }
  }, [formData.carPrice, formData.downPayment, formData.interestRate, formData.loanTenure, formData.processingFee, formData.insurance, formData.registrationFee, formData.otherCharges]);

  const pieData = emiResult && emiResult.loanAmount && emiResult.totalInterest ? [
    { name: 'Principal', value: emiResult.loanAmount, color: '#3B82F6' },
    { name: 'Interest', value: emiResult.totalInterest, color: '#EF4444' },
    { name: 'Additional Costs', value: emiResult.totalAdditionalCosts || 0, color: '#10B981' }
  ] : [];

  return (
    <div className="app">
      <div className="calculator-container">
        <div className="header">
          <h1>🚗 Car Loan EMI Calculator</h1>
          <p>Calculate your monthly EMI and total loan cost with our comprehensive calculator</p>
        </div>

        <div className="calculator-content">
          <div className="input-section">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="carPrice">Car Price (₹) <span className="required">*</span></label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={formData.carPrice || 0}
                    onChange={(e) => handleSliderChange('carPrice', e.target.value)}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>₹0</span>
                    <span>₹50L</span>
                  </div>
                </div>
                <input
                  type="number"
                  id="carPrice"
                  name="carPrice"
                  value={formData.carPrice}
                  onChange={handleInputChange}
                  placeholder="Enter car price"
                  className={`input-field ${errors.carPrice ? 'error' : ''}`}
                />
                {errors.carPrice && <span className="error-message">{errors.carPrice}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="downPayment">Down Payment (₹)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="25000"
                    value={formData.downPayment || 0}
                    onChange={(e) => handleSliderChange('downPayment', e.target.value)}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>₹0</span>
                    <span>₹20L</span>
                  </div>
                </div>
                <input
                  type="number"
                  id="downPayment"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  placeholder="Enter down payment"
                  className={`input-field ${errors.downPayment ? 'error' : ''}`}
                />
                {errors.downPayment && <span className="error-message">{errors.downPayment}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="loanAmount">Loan Amount (₹)</label>
                <input
                  type="number"
                  id="loanAmount"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  placeholder="Auto-calculated"
                  className="input-field"
                  readOnly
                />
              </div>

              <div className="input-group">
                <label htmlFor="interestRate">Interest Rate (% p.a.) <span className="required">*</span></label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={formData.interestRate || 0}
                    onChange={(e) => handleSliderChange('interestRate', e.target.value)}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  placeholder="Enter interest rate"
                  step="0.01"
                  className={`input-field ${errors.interestRate ? 'error' : ''}`}
                />
                {errors.interestRate && <span className="error-message">{errors.interestRate}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="loanTenure">Loan Tenure (Years) <span className="required">*</span></label>
                <select
                  id="loanTenure"
                  name="loanTenure"
                  value={formData.loanTenure}
                  onChange={handleInputChange}
                  className={`input-field ${errors.loanTenure ? 'error' : ''}`}
                >
                  <option value="">Select tenure</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="4">4 Years</option>
                  <option value="5">5 Years</option>
                  <option value="6">6 Years</option>
                  <option value="7">7 Years</option>
                  <option value="8">8 Years</option>
                </select>
                {errors.loanTenure && <span className="error-message">{errors.loanTenure}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="processingFee">Processing Fee (₹)</label>
                <input
                  type="number"
                  id="processingFee"
                  name="processingFee"
                  value={formData.processingFee}
                  onChange={handleInputChange}
                  placeholder="Enter processing fee"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor="insurance">Insurance (₹)</label>
                <input
                  type="number"
                  id="insurance"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  placeholder="Enter insurance cost"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor="registrationFee">Registration Fee (₹)</label>
                <input
                  type="number"
                  id="registrationFee"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  placeholder="Enter registration fee"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor="otherCharges">Other Charges (₹)</label>
                <input
                  type="number"
                  id="otherCharges"
                  name="otherCharges"
                  value={formData.otherCharges}
                  onChange={handleInputChange}
                  placeholder="Enter other charges"
                  className="input-field"
                />
              </div>
            </div>

            <div className="button-group">
              <button onClick={resetForm} className="reset-btn">
                Reset
              </button>
            </div>
          </div>

          {showResults && emiResult && emiResult.emi && (
            <div className="results-section">
              <div className="results-header">
                <h2>📊 EMI Calculation Results</h2>
              </div>

              <div className="results-grid">
                <div className="result-card primary">
                  <div className="result-label">Monthly EMI</div>
                  <div className="result-value">₹{emiResult.emi.toLocaleString()}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Total Interest</div>
                  <div className="result-value">₹{emiResult.totalInterest.toLocaleString()}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Total EMI Amount</div>
                  <div className="result-value">₹{emiResult.totalEMI.toLocaleString()}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Total Cost</div>
                  <div className="result-value">₹{(emiResult.totalCost || emiResult.totalEMI).toLocaleString()}</div>
                </div>
              </div>

              <div className="charts-section">
                <div className="chart-container">
                  <h3>Cost Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Yearly Payment Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={emiResult.yearlyBreakdown || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Bar dataKey="principal" stackId="a" fill="#3B82F6" name="Principal" />
                      <Bar dataKey="interest" stackId="a" fill="#EF4444" name="Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="summary-table">
                <h3>Yearly Breakdown</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Principal (₹)</th>
                        <th>Interest (₹)</th>
                        <th>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emiResult.yearlyBreakdown && emiResult.yearlyBreakdown.map((year, index) => (
                        <tr key={index}>
                          <td>{year.year}</td>
                          <td>{year.principal.toLocaleString()}</td>
                          <td>{year.interest.toLocaleString()}</td>
                          <td>{year.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
