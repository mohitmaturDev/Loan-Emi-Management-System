# 💰 Loan EMI Calculator — Frontend
**Made by Mohit Mathur**

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Project-Complete-brightgreen)

A responsive frontend web application to calculate monthly EMI (Equated Monthly Installment) for various loan types. Users can input loan details, view EMI breakdown, save records locally, and download them as a `.txt` file.

---

## 🚀 Features

- 🔢 EMI calculation using principal, interest rate, and tenure
- 📊 Summary view with:
  - Monthly EMI
  - Total payment
  - Total interest
- 💾 Save loan records to browser's LocalStorage
- 📥 Download all saved records as `LoanRecords.txt`
- 📋 Copy or print EMI summary
- 🧑‍💼 Form validation for customer details

---

## 📐 EMI Formula

\[
EMI = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}
\]

Where:
- \( P \) = Principal loan amount  
- \( r \) = Monthly interest rate = Annual Rate / 12 / 100  
- \( n \) = Loan tenure in months

---

## 🛠️ Tech Stack

| Technology | Role |
|------------|------|
| HTML5      | Structure |
| CSS3       | Styling |
| JavaScript | Logic & Interactivity |
| LocalStorage | Persistent record saving |

---

## 📂 Project Structure
Loan-EMI-Calculator/ ├── index.html       # Main HTML file ├── style.css        # Styling for layout and components ├── scripte.js       # JavaScript logic for EMI calculation and record handling └── README.md# Project documentation


---

## 📋 Usage Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Loan-EMI-Calculator.git

   - Open index.html in any modern browser.
- Fill in customer and loan details.
- Click Calculate EMI to view the summary.
- Use Save Record to store the entry locally.
- Click Download LoanRecords.txt to export all saved records.
- Use Copy Summary or Print Summary for quick sharing.

🧪 Validation Rules
- All fields are required
- Age must be between 0 and 120
- Loan amount and interest rate must be positive
- Buttons are enabled/disabled based on form state

📎 Future Enhancements
- 🔗 Backend integration for persistent storage
- 📱 Mobile-first UI improvements
- 📊 Graphical breakdown of EMI vs interest
- 🌐 Multi-language support (currently in Hindi
- 
🙌 Author
Made By MOHIT
