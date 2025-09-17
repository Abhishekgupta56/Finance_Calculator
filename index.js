
        // Show/hide calculator tabs
        function showCalculator(calcId) {
            // Hide all calculators
            document.querySelectorAll('.calculator-container').forEach(calc => {
                calc.classList.remove('active');
            });
            
            // Deactivate all tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected calculator
            document.getElementById(`${calcId}-calculator`).classList.add('active');
            
            // Activate selected tab button
            event.target.classList.add('active');
            
            // Trigger calculations if needed
            switch(calcId) {
                case 'sip': calculateSIP(); break;
                case 'mutual-fund': calculateMF(); break;
                case 'capital-gains': calculateCG(); break;
                case 'emi': calculateEMI(); break;
                case 'fd': calculateFD(); break;
                case 'real-estate': calculateRealEstate(); break;
            }
        }

        // SIP Calculator
        function calculateSIP() {
            const amount = parseFloat(document.getElementById('sip-amount').value);
            const returnRate = parseFloat(document.getElementById('sip-return').value) / 100;
            const years = parseInt(document.getElementById('sip-period').value);
            
            const months = years * 12;
            const monthlyRate = returnRate / 12;
            
            // Future value of SIP formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
            const fv = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
            const investedAmount = amount * months;
            const returns = fv - investedAmount;
            
            // Update UI
            document.getElementById('sip-invested').textContent = '₹' + investedAmount.toLocaleString('en-IN');
            document.getElementById('sip-est-returns').textContent = '₹' + Math.round(returns).toLocaleString('en-IN');
            document.getElementById('sip-total-value').textContent = '₹' + Math.round(fv).toLocaleString('en-IN');
            
            // Create chart
            createSIPChart(amount, monthlyRate, months, investedAmount, fv);
        }

        // Mutual Fund Returns Calculator
        function calculateMF() {
            const amount = parseFloat(document.getElementById('mf-amount').value);
            const returnRate = parseFloat(document.getElementById('mf-return').value) / 100;
            const years = parseInt(document.getElementById('mf-period').value);
            
            const fv = amount * Math.pow(1 + returnRate, years);
            const returns = fv - amount;
            const cagr = (Math.pow(fv / amount, 1 / years) - 1) * 100;
            
            // Update UI
            document.getElementById('mf-invested').textContent = '₹' + amount.toLocaleString('en-IN');
            document.getElementById('mf-est-returns').textContent = '₹' + Math.round(returns).toLocaleString('en-IN');
            document.getElementById('mf-total-value').textContent = '₹' + Math.round(fv).toLocaleString('en-IN');
            document.getElementById('mf-cagr').textContent = cagr.toFixed(2) + '%';
            
            // Create chart
            createMFChart(amount, returnRate, years);
        }

        // Capital Gains Calculator
        function calculateCG() {
            const purchasePrice = parseFloat(document.getElementById('cg-purchase').value);
            const salePrice = parseFloat(document.getElementById('cg-sale').value);
            const holdingPeriod = parseInt(document.getElementById('cg-period').value);
            const assetType = document.getElementById('cg-type').value;
            
            const gain = salePrice - purchasePrice;
            let taxRate = 0;
            let exemption = 0;
            
            switch(assetType) {
                case 'equity':
                    taxRate = holdingPeriod >= 1 ? 0.1 : 0.15;
                    exemption = holdingPeriod >= 1 ? 100000 : 0;
                    break;
                case 'debt':
                    taxRate = holdingPeriod >= 3 ? 0.2 : 0;
                    break;
                case 'property':
                    taxRate = holdingPeriod >= 2 ? 0.2 : 0;
                    exemption = holdingPeriod >= 2 ? purchasePrice * 0.3 : 0;
                    break;
            }
            
            const taxableGain = Math.max(0, gain - exemption);
            const taxAmount = taxableGain * taxRate;
            const netProceeds = salePrice - taxAmount;
            
            // Update UI
            document.getElementById('cg-amount').textContent = '₹' + Math.round(gain).toLocaleString('en-IN');
            document.getElementById('cg-tax-rate').textContent = (taxRate * 100) + '%';
            document.getElementById('cg-tax-amount').textContent = '₹' + Math.round(taxAmount).toLocaleString('en-IN');
            document.getElementById('cg-net').textContent = '₹' + Math.round(netProceeds).toLocaleString('en-IN');
        }

        // EMI Calculator
        function calculateEMI() {
            const amount = parseFloat(document.getElementById('emi-amount').value);
            const rate = parseFloat(document.getElementById('emi-rate').value) / 100;
            const tenure = parseInt(document.getElementById('emi-tenure').value);
            
            const monthlyRate = rate / 12;
            const months = tenure * 12;
            
            // EMI formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
            const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPayment = emi * months;
            const totalInterest = totalPayment - amount;
            
            // Update UI
            document.getElementById('emi-monthly').textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
            document.getElementById('emi-total-interest').textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
            document.getElementById('emi-total-payment').textContent = '₹' + Math.round(totalPayment).toLocaleString('en-IN');
            
            // Create chart
            createEMIChart(amount, totalInterest);
        }

        // FD Calculator
        function calculateFD() {
            const amount = parseFloat(document.getElementById('fd-amount').value);
            const rate = parseFloat(document.getElementById('fd-rate').value) / 100;
            const tenure = parseInt(document.getElementById('fd-tenure').value);
            const payout = document.getElementById('fd-payout').value;
            
            let maturityAmount = 0;
            let interest = 0;
            
            if (payout === 'compound') {
                // Quarterly compounding
                const quarters = tenure * 4;
                maturityAmount = amount * Math.pow(1 + rate/4, quarters);
                interest = maturityAmount - amount;
            } else if (payout === 'simple') {
                // Simple interest
                interest = amount * rate * tenure;
                maturityAmount = amount + interest;
            } else {
                // Monthly payout
                interest = amount * rate * tenure;
                maturityAmount = amount; // Principal returned at maturity
            }
            
            const ear = (Math.pow(1 + rate/4, 4) - 1) * 100;
            
            // Update UI
            document.getElementById('fd-principal').textContent = '₹' + amount.toLocaleString('en-IN');
            document.getElementById('fd-interest').textContent = '₹' + Math.round(interest).toLocaleString('en-IN');
            document.getElementById('fd-maturity').textContent = '₹' + Math.round(maturityAmount).toLocaleString('en-IN');
            document.getElementById('fd-ear').textContent = ear.toFixed(2) + '%';
            
            // Create chart
            createFDChart(amount, interest);
        }

        // Real Estate Calculator
        function calculateRealEstate() {
            const price = parseFloat(document.getElementById('re-price').value);
            const downPercent = parseFloat(document.getElementById('re-down').value) / 100;
            const rate = parseFloat(document.getElementById('re-rate').value) / 100;
            const term = parseInt(document.getElementById('re-term').value);
            const tax = parseFloat(document.getElementById('re-tax').value);
            const maintenance = parseFloat(document.getElementById('re-maintenance').value);
            const appreciation = parseFloat(document.getElementById('re-appreciation').value) / 100;
            
            const downPayment = price * downPercent;
            const loanAmount = price - downPayment;
            const monthlyRate = rate / 12;
            const months = term * 12;
            
            // EMI calculation
            const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPayment = emi * months;
            const totalInterest = totalPayment - loanAmount;
            
            // Projected property value after appreciation
            const futureValue = price * Math.pow(1 + appreciation, term);
            
            // Total costs (down payment + loan payments + tax/maintenance)
            const totalTaxMaintenance = (tax + maintenance) * term;
            const totalCost = downPayment + totalPayment + totalTaxMaintenance;
            
            // Net profit
            const profit = futureValue - totalCost;
            
            // Update UI
            document.getElementById('re-down-amount').textContent = '₹' + Math.round(downPayment).toLocaleString('en-IN');
            document.getElementById('re-loan').textContent = '₹' + Math.round(loanAmount).toLocaleString('en-IN');
            document.getElementById('re-emi').textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
            document.getElementById('re-total-interest').textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
            document.getElementById('re-total-payment').textContent = '₹' + Math.round(totalPayment).toLocaleString('en-IN');
            document.getElementById('re-future-value').textContent = '₹' + Math.round(futureValue).toLocaleString('en-IN');
            document.getElementById('re-profit').textContent = '₹' + Math.round(profit).toLocaleString('en-IN');
        }

        // Chart Creation Functions
        function createSIPChart(amount, monthlyRate, months, investedAmount, fv) {
            const ctx = document.getElementById('sipChart').getContext('2d');
            if (window.sipChart) window.sipChart.destroy();
            
            const labels = Array.from({length: months}, (_, i) => (i + 1) + 'm');
            const data = [];
            let total = 0;
            
            for (let i = 0; i < months; i++) {
                total += amount;
                data.push(total * Math.pow(1 + monthlyRate, months - i));
            }
            
            window.sipChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Start', ...labels.slice(-12), 'Final'],
                    datasets: [{
                        label: 'Investment Growth',
                        data: [0, ...data.slice(-12), fv],
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString('en-IN');
                                }
                            }
                        }
                    }
                }
            });
        }

        function createMFChart(amount, returnRate, years) {
            const ctx = document.getElementById('mfChart').getContext('2d');
            if (window.mfChart) window.mfChart.destroy();
            
            const labels = Array.from({length: years + 1}, (_, i) => i + 'y');
            const data = labels.map((_, i) => amount * Math.pow(1 + returnRate, i));
            
            window.mfChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Investment Value',
                        data: data,
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString('en-IN');
                                }
                            }
                        }
                    }
                }
            });
        }

        function createEMIChart(principal, interest) {
            const ctx = document.getElementById('emiChart').getContext('2d');
            if (window.emiChart) window.emiChart.destroy();
            
            window.emiChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Principal', 'Interest'],
                    datasets: [{
                        data: [principal, interest],
                        backgroundColor: [
                            'rgba(234, 179, 8, 0.7)',
                            'rgba(234, 179, 8, 0.3)'
                        ],
                        borderColor: [
                            'rgba(234, 179, 8, 1)',
                            'rgba(234, 179, 8, 0.6)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ₹' + Math.round(context.raw).toLocaleString('en-IN');
                                }
                            }
                        }
                    }
                }
            });
        }

        function createFDChart(principal, interest) {
            const ctx = document.getElementById('fdChart').getContext('2d');
            if (window.fdChart) window.fdChart.destroy();
            
            window.fdChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Principal', 'Interest'],
                    datasets: [{
                        label: 'FD Breakdown',
                        data: [principal, interest],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.7)',
                            'rgba(239, 68, 68, 0.3)'
                        ],
                        borderColor: [
                            'rgba(239, 68, 68, 1)',
                            'rgba(239, 68, 68, 0.6)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString('en-IN');
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ₹' + Math.round(context.raw).toLocaleString('en-IN');
                                }
                            }
                        }
                    }
                }
            });
        }

        // Initialize first calculator
        document.addEventListener('DOMContentLoaded', function() {
            calculateSIP();
        });