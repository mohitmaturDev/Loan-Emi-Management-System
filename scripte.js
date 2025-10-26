// Helper: format currency
function fmt(n) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(Number(n));
}

const $ = (id) => document.getElementById(id);
const calcBtn = $('calcBtn');
const saveBtn = $('saveBtn');
const downloadBtn = $('downloadBtn');
const copyBtn = $('copyBtn');
const printBtn = $('printBtn');

function calculateEMI(principal, annualRate, months) {
    const r = (annualRate / 12) / 100;
    if (r === 0) {
        const emi = principal / months;
        return { emi, totalPayment: emi * months, totalInterest: emi * months - principal };
    }
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    return { emi, totalPayment, totalInterest };
}

function updateSummary(data) {
    $('emiVal').textContent = data.emi ? ('₹ ' + fmt(data.emi)) : '—';
    $('totalPayVal').textContent = data.totalPayment ? ('₹ ' + fmt(data.totalPayment)) : '—';
    $('totalInterestVal').textContent = data.totalInterest ? ('₹ ' + fmt(data.totalInterest)) : '—';
    $('sLoanType').textContent = data.loanType || '—';
    $('sTenure').textContent = data.tenureMonths || '—';
    const pct = data.totalPayment && data.principal ? Math.min(100, Math.round((data.principal / data.totalPayment) * 100)) : 0;
    $('progressBar').style.width = pct + '%';

    // enable save & utility buttons when EMI exists
    const enabled = !!data.emi;
    saveBtn.disabled = !enabled;
    downloadBtn.disabled = !enabled && (getSavedRecords().length === 0);
    copyBtn.disabled = !enabled;
    printBtn.disabled = !enabled;
}

calcBtn.addEventListener('click', () => {
    const principal = Number($('principal').value);
    const annualRate = Number($('annualRate').value);
    const tenureMonths = Number($('tenureMonths').value);

    if (!principal || principal <= 0 || tenureMonths <= 0) {
        alert('Principal aur tenure sahi bharna zaroori hai.');
        return;
    }

    const res = calculateEMI(principal, annualRate, tenureMonths);
    const payload = {
        emi: Number(res.emi.toFixed(2)),
        totalPayment: Number(res.totalPayment.toFixed(2)),
        totalInterest: Number(res.totalInterest.toFixed(2)),
        loanType: $('loanType').value,
        tenureMonths,
        principal
    }
    updateSummary(payload);

    // flash animation for progress
    setTimeout(() => { $('progressBar').style.transition = 'width 900ms cubic-bezier(.2,.9,.25,1)'; }, 30);
});

// Storage helpers
function getSavedRecords() {
    try {
        return JSON.parse(localStorage.getItem('loanRecords') || '[]');
    } catch (e) { return [] }
}
function setSavedRecords(arr) { localStorage.setItem('loanRecords', JSON.stringify(arr)); renderRecords(); }

function renderRecords() {
    const records = getSavedRecords();
    const body = $('recordsBody');
    if (records.length === 0) { $('noRecords').style.display = 'block'; $('recordsTable').style.display = 'none'; downloadBtn.disabled = true; return; }
    $('noRecords').style.display = 'none'; $('recordsTable').style.display = 'block';
    body.innerHTML = '';
    records.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.customerID}</td><td>${r.name}</td><td>${r.loanType}</td><td>₹ ${fmt(r.emi)}</td><td><button class='btn secondary' data-idx='${idx}'>Delete</button></td>`;
        body.appendChild(tr);
    });
    // wire delete
    body.querySelectorAll('button').forEach(b => b.addEventListener('click', (e) => {
        const i = Number(e.currentTarget.dataset.idx);
        const arr = getSavedRecords(); arr.splice(i, 1); setSavedRecords(arr);
    }));
    downloadBtn.disabled = false;
}

// Save record in same textual format as C++ file
saveBtn.addEventListener('click', () => {
    const data = {
        customerID: $('customerID').value || 'NA',
        name: $('name').value || 'NA',
        age: $('age').value || 'NA',
        contact: $('contact').value || 'NA',
        loanType: $('loanType').value,
        principal: Number($('principal').value) || 0,
        annualRate: Number($('annualRate').value) || 0,
        tenureMonths: Number($('tenureMonths').value) || 0,
    };
    const calc = calculateEMI(data.principal, data.annualRate, data.tenureMonths);
    data.emi = Number(calc.emi.toFixed(2));
    data.totalPayment = Number(calc.totalPayment.toFixed(2));
    data.totalInterest = Number(calc.totalInterest.toFixed(2));

    const arr = getSavedRecords(); arr.push(data); setSavedRecords(arr);
    alert('Record saved locally. Use "Download" to get LoanRecords.txt');
    downloadBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
    const arr = getSavedRecords();
    if (arr.length === 0) { alert('Koi record nahi hai.'); return; }
    let content = '';
    arr.forEach(r => {
        content += `Customer ID:${r.customerID} | Name:${r.name} | Age:${r.age} | Contact:${r.contact} | LoanType:${r.loanType} | Principal:${r.principal} | Rate:${r.annualRate} | Months:${r.tenureMonths} | EMI:${r.emi} | TotalPay:${r.totalPayment} | TotalInterest:${r.totalInterest}\n`;
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'LoanRecords.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

copyBtn.addEventListener('click', () => {
    const emi = $('emiVal').textContent;
    const total = $('totalPayVal').textContent;
    const interest = $('totalInterestVal').textContent;
    const loanType = $('sLoanType').textContent;
    const txt = `Loan Type: ${loanType}\nEMI: ${emi}\nTotal Payment: ${total}\nTotal Interest: ${interest}`;
    navigator.clipboard.writeText(txt).then(() => alert('Summary copied to clipboard.'));
});

printBtn.addEventListener('click', () => {
    const win = window.open('', '_blank', 'width=600,height=600');
    const html = `<pre style="font-family:system-ui,Arial">` +
        `Loan Type: ${$('sLoanType').textContent}\n` +
        `Monthly EMI: ${$('emiVal').textContent}\n` +
        `Total Payment: ${$('totalPayVal').textContent}\n` +
        `Total Interest: ${$('totalInterestVal').textContent}\n` +
        `</pre>`;
    win.document.write(html); win.document.close(); win.print();
});

// init
(function () { renderRecords(); })();