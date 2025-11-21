/* =========================================
   1. VARIABLES & GLOBAL STYLES
   ========================================= */
:root {
    --primary-color: #6c5ce7; /* Biru Ungu */
    --secondary-color: #00b894; /* Hijau */
    --income-color: #2ecc71; /* Hijau Terang */
    --expense-color: #e74c3c; /* Merah */
    --balance-color: #3498db; /* Biru */
    --font-color: #2d3436;
    --background-color: #f4f6f9;
    --primary-gradient: linear-gradient(45deg, #a29bfe, #6c5ce7);
    --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.05);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
}

body {
    background-color: var(--background-color);
    color: var(--font-color);
    line-height: 1.6;
}

.app-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
}

/* =========================================
   2. HEADER & CONTROLS
   ========================================= */
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
