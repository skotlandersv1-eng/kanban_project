document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const balanceEl = document.getElementById('balance');
    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');
    const listEl = document.getElementById('transaction-list');
    const form = document.getElementById('transaction-form');
    const textInput = document.getElementById('text');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const categoryInput = document.getElementById('category');
    const typeInput = document.getElementById('type-select');
    const monthFilter = document.getElementById('month-filter');
    
    // Edit & Buttons
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-edit');
    const editIdInput = document.getElementById('edit-id');
    const exportBtn = document.getElementById('export-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Kalkulator Elements
    const calculatorBtn = document.getElementById('calculator-btn');
    const calculatorPopup = document.getElementById('calculator-popup');
    const calcButtons = document.querySelectorAll('.btn-calc');
    const calcApplyBtn = document.getElementById('calc-apply-btn');
    const calcDisplay = document.getElementById('calc-display');
    let currentInput = '';
    let calculationError = false;

    // Chart Contexts
    const ctxExpense = document.getElementById('expenseChart') ? document.getElementById('expenseChart').getContext('2d') : null;
    const ctxTrend = document.getElementById('trendChart') ? document.getElementById('trendChart').getContext('2d') : null;

    // === SAVING GOAL ELEMENTS ===
    const savingGoalInput = document.getElementById('saving-goal-input');
    const setGoalBtn = document.getElementById('set-goal-btn'); 
    const goalTargetEl = document.getElementById('goal-target');
    const goalAchievedEl = document.getElementById('goal-achieved');
    const goalRemainingEl = document.getElementById('goal-remaining');
    const progressBar = document.getElementById('saving-progress-bar');
    const progressPercentEl = document.getElementById('progress-percent');
    const progressMessageEl = document.getElementById('progress-message');
    
    // --- STATE & VARIABLES ---
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let savingGoals = JSON.parse(localStorage.getItem('savingGoals')) || {}; 
    let expenseChartInstance = null;
    let trendChartInstance = null;

    // Daftar Kategori
    const categories = {
        expense: ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Belanja', 'Kesehatan', 'Pendidikan', 'Sedekah', 'Lainnya'],
        income: ['Gaji', 'Bonus', 'Freelance', 'Investasi', 'Hadiah', 'Lainnya'],
        saving: ['Tabungan Darurat', 'Dana Pensiun', 'Beli Rumah', 'Beli Kendaraan', 'Lainnya'] 
    };

    // --- INIT ---
    function init() {
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        dateInput.valueAsDate = now;
        monthFilter.value = currentMonthStr;

        // Listener Tombol Atur Target
        if(setGoalBtn) setGoalBtn.addEventListener('click', setSavingGoal); 
        
        // Listener Formatting Input Angka (untuk input target tabungan dan amount transaksi)
        savingGoalInput.addEventListener('input', formatInputNumber);
        amountInput.addEventListener('input', formatInputNumber);

        updateCategories(); 
        updateUI();
    }
    
    // --- SAVING GOAL LOGIC ---
    function setSavingGoal() {
        const selectedMonth = monthFilter.value;
        const rawAmount = savingGoalInput.value.replace(/\./g, '');
        const target = parseInt(rawAmount);

        if (isNaN(target) || target < 0) {
            alert('Target tabungan harus berupa angka positif.');
            return;
        }

        savingGoals[selectedMonth] = target;
        localStorage.setItem('savingGoals', JSON.stringify(savingGoals));
        updateSavingGoalUI(selectedMonth);
        alert(`Target tabungan bulan ${selectedMonth} berhasil diatur sebesar ${formatRupiah(target)}.`);
    }
    
    function updateSavingGoalUI(selectedMonth) {
        const target = savingGoals[selectedMonth] || 0;
        
        const filteredData = getFilteredTransactions();
        const achieved = filteredData
            .filter(t => t.type === 'saving')
            .map(t => t.amount)
            .reduce((acc, item) => (acc += item), 0);
        
        savingGoalInput.value = formatNumberForInput(target);
        goalTargetEl.innerText = formatRupiah(target);
        goalAchievedEl.innerText = formatRupiah(achieved);

        let remaining = target - achieved;
        goalRemainingEl.innerText = formatRupiah(Math.max(0, remaining));

        let progressPercent = 0;
        let message = '';

        if (target > 0) {
            progressPercent = Math.min(100, Math.round((achieved / target) * 100));
            progressBar.style.width = `${progressPercent}%`;
            progressPercentEl.innerText = `${progressPercent}%`;

            if (achieved >= target) {
                message = `🎉 Selamat! Target tabungan (${formatRupiah(target)}) telah tercapai. Surplus: ${formatRupiah(achieved - target)}.`;
                progressBar.style.backgroundColor = 'var(--income-color)'; 
                progressPercentEl.style.color = 'white';
            } else {
                message = `Ayo semangat! Kamu perlu menabung ${formatRupiah(remaining)} lagi untuk mencapai target.`;
                progressBar.style.background = 'var(--primary-gradient)';
                progressPercentEl.style.color = '#444'; 
            }
        } else {
            progressBar.style.width = '0%';
            progressPercentEl.innerText = '0%';
            goalRemainingEl.innerText = 'Rp 0';
            message = 'Atur Target Tabunganmu untuk bulan ini di kolom atas!';
            progressBar.style.background = 'var(--primary-gradient)';
            progressPercentEl.style.color = '#444';
        }
        
        progressMessageEl.innerText = message;
    }


    // --- KALKULATOR LOGIC (REVISI FINAL) --- 
    function handleCalcClick(e) {
        e.stopPropagation(); 
        const value = e.target.getAttribute('data-value');
        if (!value) return; 

        if (value === 'C') {
            currentInput = '';
            calculationError = false;
        } else if (value === '=') {
            try {
                const expression = currentInput.replace(/x/g, '*');
                let result = eval(expression); 
                let finalResult = Math.round(parseFloat(result)); 

                if (isNaN(finalResult) || !isFinite(finalResult)) {
                    currentInput = 'Error';
                    calculationError = true;
                } else {
                    currentInput = finalResult.toString();
                }

            } catch (error) {
                currentInput = 'Error';
                calculationError = true;
            }
        } else {
            if (calculationError) {
                currentInput = '';
                calculationError = false;
            }
            const lastChar = currentInput.slice(-1);
            const isOperator = (char) => ['+', '-', '*', '/'].includes(char);
            const isNewOperator = isOperator(value);

            if (isNewOperator && isOperator(lastChar)) {
                 currentInput = currentInput.slice(0, -1) + value; 
            } else if (value === '.' && currentInput.includes('.')) {
                // Mencegah titik ganda
                return;
            } else {
                 currentInput += value;
            }
        }
        
        calcDisplay.value = currentInput;
    }

    calcButtons.forEach(button => {
        button.addEventListener('click', handleCalcClick);
    });

    calculatorBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        
        const isVisible = calculatorPopup.style.display === 'block';
        calculatorPopup.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            currentInput = amountInput.value.replace(/\./g, ''); 
            calcDisplay.value = currentInput;
        }
    });

    calculatorPopup.addEventListener('click', (e) => {
        e.stopPropagation(); 
    });

    calcApplyBtn.addEventListener('click', () => {
        if (currentInput && currentInput !== 'Error') {
            const cleanAmount = currentInput.replace(/[^0-9.]/g, ''); 
            let finalAmount = Math.round(parseFloat(cleanAmount));
            if (isNaN(finalAmount) || finalAmount < 0) finalAmount = 0;

            amountInput.value = formatNumberForInput(finalAmount);
            
            calculatorPopup.style.display = 'none';
            
            currentInput = '';
            calcDisplay.value = '';
        } else {
            alert('Tidak ada hasil valid untuk digunakan.');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (calculatorPopup.style.display === 'block') {
             if (!calculatorPopup.contains(e.target) && e.target !== calculatorBtn && !calculatorBtn.contains(e.target) && !calculatorBtn.querySelector('i').contains(e.target)) {
                 calculatorPopup.style.display = 'none';
             }
        }
    });

    // --- HELPER FUNCTIONS ---
    function updateCategories() {
        const type = typeInput.value;
        categoryInput.innerHTML = '';
        const categoryList = categories[type] || [];

        categoryList.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.innerText = cat;
            categoryInput.appendChild(option);
        });

        if (type === 'saving') {
             textInput.placeholder = 'Cth: Sisihkan untuk dana darurat';
        } else if (type === 'income') {
             textInput.placeholder = 'Cth: Gaji Bulan Ini';
        } else {
             textInput.placeholder = 'Cth: Makan Siang...';
        }
    }
    
    function formatInputNumber(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    typeInput.addEventListener('change', updateCategories);

    // --- CORE LOGIC: FILTERING ---
    function getFilteredTransactions() {
        const selectedMonth = monthFilter.value;
        if (!selectedMonth) return transactions;
        return transactions.filter(t => t.date.startsWith(selectedMonth));
    }

    // --- CRUD OPERATIONS ---
    function saveTransaction(e) {
        e.preventDefault();
        const text = textInput.value.trim();
        const rawAmount = amountInput.value.replace(/\./g, ''); 
        const date = dateInput.value;
        const type = typeInput.value;
        const category = categoryInput.value;
        const editId = editIdInput.value;


        if (text === '' || rawAmount === '' || date === '') {
            alert('Mohon lengkapi semua data');
            return;
        }
        
        const amount = parseInt(rawAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Jumlah transaksi harus berupa angka positif.');
            return;
        }

        if (editId) {
            const index = transactions.findIndex(t => t.id == editId);
            if (index !== -1) {
                transactions[index] = { id: parseInt(editId), text, amount, type, category, date }; 
            }
            exitEditMode();
        } else {
            const transaction = {
                id: Date.now(),
                text, amount, type, category, date
            };
            transactions.push(transaction);
        }

        updateLocalStorage();
        updateUI();
        
        textInput.value = '';
        amountInput.value = '';
    }
    
    window.removeTransaction = function(id) {
        if(confirm('Hapus transaksi ini?')) {
            transactions = transactions.filter(t => t.id !== id);
            updateLocalStorage();
            updateUI();
        }
    }
    
    window.editTransaction = function(id) {
        const t = transactions.find(t => t.id === id);
        if (!t) return;
        
        textInput.value = t.text;
        amountInput.value = formatNumberForInput(t.amount); 
        typeInput.value = t.type;
        dateInput.value = t.date;
        updateCategories(); 
        categoryInput.value = t.category;
        editIdInput.value = t.id;

        submitBtn.innerText = 'Update';
        submitBtn.style.background = '#e67e22';
        cancelBtn.style.display = 'block';
        
        if(window.innerWidth < 768) {
            document.querySelector('.form-section').scrollIntoView({behavior: 'smooth'});
        }
    }

    function exitEditMode() {
        editIdInput.value = '';
        submitBtn.innerText = 'Simpan';
        submitBtn.style.background = '';
        cancelBtn.style.display = 'none';
        textInput.value = '';
        amountInput.value = '';
        dateInput.valueAsDate = new Date();
        updateCategories(); 
    }

    cancelBtn.addEventListener('click', exitEditMode);
    monthFilter.addEventListener('change', updateUI);

    // --- UI UPDATE MANAGER (REVISI TANDA MINUS) ---
    function updateUI() {
        const selectedMonth = monthFilter.value;
        const filteredData = getFilteredTransactions();
        
        const operationalData = filteredData.filter(t => t.type !== 'saving'); 
        
        const amounts = operationalData.map(t => t.type === 'income' ? t.amount : -t.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0); 
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
        const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

        // --- Perubahan untuk menampilkan tanda minus (-) jika defisit ---
        let isDeficit = total < 0;
        
        // formatRupiah(Math.abs(total)) menghasilkan "Rp XXX.XXX"
        // kita ambil sub stringnya (XXX.XXX) dan tambahkan "-" di depannya
        let formattedAbsTotal = formatRupiah(Math.abs(total)).substring(3).trim(); 

        let displayTotal = isDeficit ? `- Rp ${formattedAbsTotal}` : formatRupiah(total);
        
        balanceEl.innerText = displayTotal; 
        balanceEl.classList.toggle('negative', isDeficit);
        // ---------------------------------------------------------------------

        incomeEl.innerText = formatRupiah(income);
        expenseEl.innerText = formatRupiah(expense);

        listEl.innerHTML = '';
        const sortedData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date)); 
        
        if (sortedData.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Tidak ada data di bulan ini.</p>';
        }

        sortedData.forEach(t => {
            const item = document.createElement('li');
            item.classList.add(t.type); 
            
            let sign = t.type === 'income' ? '+' : '-';
            if (t.type === 'saving') {
                sign = '💰'; 
            }
            
            let formattedAmount = formatRupiah(t.amount);
            const dateFormatted = new Date(t.date + 'T00:00:00').toLocaleDateString('id-ID', {day:'numeric', month:'short'}); 
            
            item.innerHTML = `
                <div>
                    <h4>${t.text} <span class="history-date">${dateFormatted}</span></h4>
                    <small>${t.category}</small>
                </div>
                <div style="text-align:right;">
                    <span style="font-weight:bold; display:block;">${sign} ${formattedAmount}</span>
                    <div style="margin-top:5px;">
                        <button class="action-btn edit-btn" onclick="editTransaction(${t.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn delete-btn" style="color:#ff7675; margin-left:5px;" onclick="removeTransaction(${t.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
            listEl.appendChild(item);
        });

        updateSavingGoalUI(selectedMonth); 
        generateAIInsight(income, expense, filteredData, sortedData); 
        renderCharts(operationalData); 
    }

    // --- LOGIKA AI CERDAS (Tidak Berubah dari Revisi Sebelumnya) ---
    function generateAIInsight(inc, exp, transactions, sortedTransactions) {
        const selectedMonth = monthFilter.value;
        const target = savingGoals[selectedMonth] || 0;
        
        const achieved = transactions
            .filter(t => t.type === 'saving')
            .map(t => t.amount)
            .reduce((acc, item) => (acc += item), 0);
        
        const netFlow = inc - exp; 
        
        let categoryTotals = {};
        transactions.forEach(t => {
            if(t.type === 'expense') {
                categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
            }
        });
        
        let highestExpense = { category: 'N/A', amount: 0 };
        for (const cat in categoryTotals) {
            if (categoryTotals[cat] > highestExpense.amount) {
                highestExpense = { category: cat, amount: categoryTotals[cat] };
            }
        }
        
        const latestTransaction = sortedTransactions.length > 0 ? sortedTransactions[0] : null;
        
        let insights = [];

        if (inc === 0 && exp === 0 && achieved === 0) {
            setAI('😴', 'Data masih kosong nih. Yuk catat transaksi pertamamu!'); return;
        }
        
        // 1. Insight Tabungan
        if (target > 0) {
            if (achieved >= target) {
                insights.push({ icon: '🏆', text: `Selamat! Target tabungan (${formatRupiah(target)}) telah tercapai. Surplus: ${formatRupiah(achieved - target)}. Target selanjutnya?`, priority: 10 });
            } else if (achieved > 0) {
                const percent = Math.round((achieved / target) * 100);
                insights.push({ icon: '🚀', text: `Progres tabunganmu **${percent}%**. Tinggal **${formatRupiah(target - achieved)}** lagi untuk mencapai target!`, priority: 8 });
            } else {
                insights.push({ icon: '🛑', text: `Target tabungan (${formatRupiah(target)}) belum ada kontribusi. **Prioritaskan** sisihkan dana awal bulan!`, priority: 9 });
            }
        }
        
        // 2. Insight Net Flow (Defisit/Surplus)
        if (netFlow < 0) {
            const deficit = formatRupiah(Math.abs(netFlow));
            insights.push({ icon: '🚨', 'text': `**Defisit Rp ${deficit}** bulan ini. Pengeluaran > Pemasukan! Cek kembali **${highestExpense.category}** untuk penghematan.`, priority: 11 });
        } else if (netFlow > 0) {
            insights.push({ icon: '💡', 'text': `Saldo operasional **surplus ${formatRupiah(netFlow)}**. Jangan lupa **alokasikan** surplus ini ke tabungan atau investasi!`, priority: 7 });
        }

        // 3. Insight Kategori Tertinggi
        if (highestExpense.amount > 0) {
            const percentage = Math.round((highestExpense.amount / exp) * 100);
            
            let catInsight = { priority: 5 };
            if (highestExpense.category === 'Makanan') {
                catInsight.icon = '🍔';
                catInsight.text = (percentage > 40) ? `Waduh, **${percentage}%** uangmu habis di perut! Coba **masak sendiri** 🍳 atau batasi jajan di luar.` : `Pengeluaran makanan (${percentage}%) cukup terkelola. Lanjutkan!`;
            } else if (highestExpense.category === 'Hiburan') {
                catInsight.icon = '🎬';
                ca   ========================================= */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
}

header h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-color);
}

.header-controls {
    display: flex;
    gap: 10px;
    align-items: center;
}

.glass-input, input[type="month"] {
    padding: 10px 15px;
    border: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-soft);
    font-size: 14px;
    color: var(--font-color);
    outline: none;
}

.btn-icon {
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 16px;
    color: var(--primary-color);
    box-shadow: var(--shadow-soft);
    transition: all 0.2s;
}

.btn-icon:hover {
    background: var(--primary-color);
    color: white;
}

.btn-icon.danger {
    color: var(--expense-color);
}
.btn-icon.danger:hover {
    background: var(--expense-color);
    color: white;
}

/* =========================================
   3. SUMMARY CARDS
   ========================================= */
.summary-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.summary-card {
    background: white;
    padding: 25px;
    border-radius: 20px;
    box-shadow: var(--shadow-soft);
    position: relative;
    overflow: hidden;
    transition: transform 0.2s;
}

.summary-card:hover {
    transform: translateY(-5px);
}

.summary-card h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #555;
}

.summary-card .amount {
    font-size: 32px;
    font-weight: 700;
    transition: color 0.3s ease; 
}

.summary-card .icon-bg {
    position: absolute;
    right: 15px;
    bottom: 10px;
    font-size: 60px;
    opacity: 0.1;
}

.income .amount { color: var(--income-color); }
.expense .amount { color: var(--expense-color); }
.balance .amount { color: var(--balance-color); }

.balance .negative {
    color: var(--expense-color) !important; 
}


/* =========================================
   4. LAYOUT & GLASS PANEL
   ========================================= */
.content-layout {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.form-section, .history-section {
    flex: 1;
    min-width: 350px;
}

.glass-panel {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 24px;
    padding: 30px;
    box-shadow: var(--shadow-soft);
    border-top: 1px solid rgba(255, 255, 255, 0.5);
}

/* Glass Panel DARK (untuk pop-up kalkulator) */
.glass-panel-dark {
    background: rgba(240, 240, 240, 0.95);
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.5);
}


.glass-panel h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--primary-color);
}

/* Form Styles */
.form-control {
    margin-bottom: 15px;
}

.form-control label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 14px;
}

.form-control input[type="text"], 
.form-control input[type="date"],
.form-control select,
.form-control input[type="month"] {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;
}

.form-control input:focus, .form-control select:focus {
    border-color: var(--primary-color);
}

.row-group {
    display: flex;
    gap: 10px;
}
.row-group select {
    flex: 1;
}

.btn {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border: none;
    border-radius: 10px;
    background: var(--primary-color);
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn:hover {
    background: #5a4acf;
}

.btn-cancel {
    background: #95a5a6;
}

.btn-cancel:hover {
    background: #7f8c8d;
}

/* History List Styles */
.history-list-container {
    max-height: 450px;
    overflow-y: auto;
    padding-right: 10px; 
}

#transaction-list {
    list-style: none;
}

#transaction-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px dashed #eee;
}

#transaction-list li:last-child {
    border-bottom: none;
}

#transaction-list li h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 2px;
}

#transaction-list li small {
    font-size: 12px;
    color: #888;
}

#transaction-list li.income { border-left: 5px solid var(--income-color); padding-left: 10px; }
#transaction-list li.expense { border-left: 5px solid var(--expense-color); padding-left: 10px; }
#transaction-list li.saving { border-left: 5px solid #f39c12; padding-left: 10px; }

.action-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
    transition: color 0.2s;
}
.action-btn:hover {
    color: #a29bfe;
}
.action-btn.delete-btn {
    color: var(--expense-color) !important;
}
.action-btn.delete-btn:hover {
    color: #ff7675 !important;
}

.history-date {
    font-size: 12px;
    font-weight: 400;
    color: #999;
    margin-left: 5px;
}


/* Kalkulator Styles */
.input-with-icon-group {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 10; 
}

.input-icon-btn {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    width: 35px;
    height: 35px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 11; 
    transition: background 0.2s;
}
.input-icon-btn:hover {
    background: #5a4acf;
}


.calculator-popup {
    position: absolute;
    top: 100%;
    right: 0;
    width: 250px;
    z-index: 100; 
    padding: 15px;
    margin-top: 5px;
}

.calc-display {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    text-align: right;
    font-size: 20px;
    font-weight: 700;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: white; 
}

.calc-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

.btn-calc {
    padding: 12px 0;
    border: none;
    border-radius: 8px;
    background: #f1f2f6;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.1s;
}

.btn-calc:hover {
    background: #dfe6e9;
}

.btn-calc.btn-op {
    background: #6c5ce7;
    color: white;
}

.btn-calc.btn-result {
    background: #00b894;
    color: white;
}

.btn-calc.btn-action {
    background: #e74c3c;
    color: white;
}

/* =========================================
   5. SAVING GOAL (TABUNGAN)
   ========================================= */
.saving-goal-section {
    /* Mengadopsi style glass-panel */
    background: rgba(255, 255, 255, 0.9);
    border-radius: 24px;
    padding: 30px;
    box-shadow: var(--shadow-soft);
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    margin-bottom: 30px;
}

.saving-goal-section h2 {
    /* Style untuk judul Target Tabungan Bulan Ini */
    color: var(--font-color);
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 25px;
}
.saving-goal-section h2::after {
    content: '';
    flex-grow: 1;
    height: 3px;
    background: #eee;
    max-width: 50px;
}

.saving-content {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    flex-wrap: wrap; 
}

.saving-info {
    /* Kolom kiri (Input & Target) */
    flex: 1.5;
    min-width: 280px;
}

.saving-progress-box {
    /* Kotak Progres (Kolom Kanan) */
    flex: 2;
    min-width: 300px;
    background: rgba(240, 240, 240, 0.9); /* Latar lebih abu-abu terang */
    padding: 20px;
    border-radius: 15px;
    border: none;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 150px; /* Tinggi kotak agar sejajar dengan input */
}

.form-control-inline {
    margin-bottom: 20px;
}
.form-control-inline label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    display: block;
}

.input-with-button {
    display: flex;
    gap: 10px;
    width: 100%; 
    align-items: center;
}

.saving-input {
    flex: 1; 
    padding: 12px 15px !important;
    border-radius: 10px !important;
    font-weight: 600;
    font-size: 16px !important;
    border: 1px solid #ddd;
    background: white;
}

/* Tombol Atur Target - PENTING: Dibuat lebih besar dan ungu */
#set-goal-btn {
    flex: 1; /* Agak lebar, menyeimbangkan input */
    padding: 15px 20px;
    font-size: 16px;
    width: auto;
    margin-top: 0;
    background: linear-gradient(90deg, #a29bfe, #8172fb);
    box-shadow: 0 4px 10px rgba(130, 115, 251, 0.5);
    border-radius: 12px;
}
#set-goal-btn:hover {
     background: linear-gradient(90deg, #b0a7ff, #9588ff);
}

.saving-stats {
    margin-top: 15px;
    padding: 0;
    background: none;
    border-radius: 0;
    box-shadow: none;
}

.saving-stats p {
    margin-bottom: 8px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.bold-stat {
    font-weight: 700;
}

.saving-text { color: #f39c12; }
.deficit-text { color: var(--expense-color); } 

.progress-bar-container {
    background: #ecf0f1;
    border-radius: 10px;
    height: 40px;
    width: 100%;
    margin-bottom: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.progress-bar {
    height: 100%;
    width: 0%;
    background: var(--primary-gradient);
    transition: width 0.5s ease-in-out;
}

.progress-percent {
    position: absolute;
    top: 50%;
    left: 15px; /* Pindah ke kiri kotak progres */
    transform: translateY(-50%);
    font-weight: 700;
    color: #444; 
    left: 50%; /* Tetap di tengah (sesuai gambar) */
    transform: translate(-50%, -50%);
}

.progress-message {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-top: 10px;
}


/* =========================================
   6. CHARTS SECTION
   ========================================= */
.charts-section {
    margin-bottom: 30px;
}

.charts-grid {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
}

.chart-box {
    flex: 1;
    min-width: 300px;
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.chart-box h4 {
    text-align: center;
    margin-bottom: 15px;
    font-size: 16px;
    color: #555;
}

#expenseChart, #trendChart {
    height: 300px !important; 
}

/* =========================================
   7. UNIQUE FEATURE (AI)
   ========================================= */
.ai-comment-section {
    /* Mengadopsi style glass-panel, namun lebih menonjol */
    background: rgba(255, 255, 255, 0.9);
    border-radius: 24px;
    padding: 30px;
    box-shadow: var(--shadow-soft);
    margin-bottom: 40px;
}

.ai-comment-section h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--font-color);
    display: flex;
    align-items: center;
    gap: 10px;
}
/* Mempertahankan style dari gambar 'Komentar' */
.ai-comment-section h2 .fa-robot {
    font-size: 24px;
    color: var(--primary-color);
}


.feature-content {
    display: flex;
    align-items: center; 
    padding: 20px;
    
    /* REVISI UTAMA: Border dashed ungu sesuai gambar */
    border: 2px dashed #a29bfe; /* Menggunakan warna ungu muda untuk dashed */
    border-radius: 15px; 
    background: rgba(255, 255, 255, 0.8);
}

.persona-icon {
    font-size: 28px;
    margin-right: 15px;
    flex-shrink: 0; /* Pastikan ikon tidak menyusut */
}

.persona-desc {
    font-size: 16px;
    color: var(--font-color);
    font-weight: 500;
    margin-bottom: 0;
}


/* =========================================
   8. MEDIA QUERIES (RESPONSIVENESS)
   ========================================= */
@media (max-width: 768px) {
    .app-container {
        margin: 20px auto;
    }

    header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .header-controls {
        margin-top: 15px;
        width: 100%;
        justify-content: space-between;
    }
    
    .summary-container {
        grid-template-columns: 1fr;
    }
    
    .content-layout {
        flex-direction: column;
    }

    .form-section, .history-section {
        min-width: 100%;
    }

    .charts-grid {
        flex-direction: column;
    }

    .calculator-popup {
        right: 0;
        left: auto; 
    }
    
    .saving-content {
        flex-direction: column;
        gap: 20px;
    }
    
    .saving-info {
        min-width: 100%;
    }
    .saving-progress-box {
        min-width: 100%;
    }
    
}

/* =========================================
   9. SCROLLBAR STYLES (for history)
   ========================================= */
.history-list-container::-webkit-scrollbar {
    width: 8px;
}

.history-list-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.history-list-container::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

.history-list-container::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}

