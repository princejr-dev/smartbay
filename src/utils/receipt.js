import { numberToWords, formatDateLong, padReceiptNumber } from './helpers';

// Génère et télécharge un reçu PDF en HTML
export function generateReceipt(tenant) {
  const receiptNumber = padReceiptNumber(tenant.receiptCount || 1);
  const totalAmount = tenant.rent * tenant.duration;
  const amountInWords = numberToWords(totalAmount) + ' francs CFA';
  const today = new Date().toISOString().split('T')[0];

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Georgia, serif;
      padding: 40px;
      color: #1a1a2e;
      background: #fff;
      max-width: 700px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
    }
    .app-name {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 3px;
    }
    .app-subtitle {
      font-size: 13px;
      color: #888;
      margin-top: 5px;
      letter-spacing: 1px;
    }
    .receipt-title {
      text-align: center;
      margin: 25px 0;
    }
    .receipt-title h2 {
      font-size: 22px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #1a1a2e;
    }
    .receipt-number {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 6px 20px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 8px;
    }
    .divider {
      height: 2px;
      background: linear-gradient(to right, transparent, #667eea, transparent);
      margin: 20px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed #e0e0e0;
    }
    .row:last-child { border-bottom: none; }
    .row-label {
      font-size: 13px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .row-value {
      font-size: 15px;
      font-weight: bold;
      color: #1a1a2e;
      text-align: right;
    }
    .amount-box {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 15px;
      margin: 20px 0;
      text-align: center;
    }
    .amount-number {
      font-size: 30px;
      font-weight: bold;
    }
    .amount-words {
      font-size: 13px;
      opacity: 0.9;
      margin-top: 8px;
      font-style: italic;
    }
    .advance-section {
      background: #f8f9ff;
      border: 1px solid #667eea33;
      border-radius: 12px;
      padding: 15px;
      margin: 15px 0;
    }
    .advance-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 14px;
    }
    .reste { color: #ff5252; font-weight: bold; }
    .footer {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer-left { font-size: 14px; color: #555; line-height: 2; }
    .signature-box { text-align: center; }
    .signature-label { font-size: 13px; color: #888; margin-bottom: 60px; }
    .signature-line {
      border-top: 2px solid #1a1a2e;
      padding-top: 8px;
      font-size: 13px;
      color: #555;
    }
    .stamp {
      text-align: center;
      margin-top: 30px;
      padding: 12px;
      border: 2px dashed #667eea;
      border-radius: 10px;
      color: #667eea;
      font-size: 12px;
      letter-spacing: 1px;
    }
  </style>
</head>

<body>
  <div class="header">
    <div class="app-name">SmartBay</div>
    <div class="app-subtitle">Gestion locative intelligente</div>
  </div>

  <div class="receipt-title">
    <h2>Reçu de Loyer</h2>
    <div class="receipt-number">N° ${receiptNumber}</div>
  </div>

  <div class="divider"></div>

  <div class="section">
    <div class="row">
      <span class="row-label">Locataire</span>
      <span class="row-value">${tenant.civility} ${tenant.name}</span>
    </div>
    
    ${tenant.phone ? `
    <div class="row">
      <span class="row-label">Téléphone</span>
      <span class="row-value">${tenant.phone}</span>
    </div>` : ''}

    <div class="row">
      <span class="row-label">Loyer mensuel</span>
      <span class="row-value">${tenant.rent.toLocaleString()} FCFA</span>
    </div>
    
    <div class="row">
      <span class="row-label">Durée de location</span>
      <span class="row-value">${tenant.duration} mois</span>
    </div>

    <div class="row">
      <span class="row-label">Date d'entrée</span>
      <span class="row-value">${formatDateLong(tenant.startDate)}</span>
    </div>

    <div class="row">
      <span class="row-label">Date d'expiration</span>
      <span class="row-value">${formatDateLong(tenant.endDate)}</span>
    </div>
  </div>

  <div class="amount-box">
    <div class="amount-number">${totalAmount.toLocaleString()} FCFA</div>
    <div class="amount-words">${amountInWords}</div>
  </div>

  ${tenant.advance && tenant.advance > 0 ? `
  <div class="advance-section">
    <div class="advance-row">
      <span>Loyer total</span>
      <span>${totalAmount.toLocaleString()} FCFA</span>
    </div>

    <div class="advance-row">
      <span>Avance versée</span>
      <span>${tenant.advance.toLocaleString()} FCFA</span>
    </div>

    <div class="advance-row">
      <span>Reste à payer</span>
      <span class="reste">${tenant.reste.toLocaleString()} FCFA</span>
    </div>
  </div>` : ''}

  <div class="footer">
    <div class="footer-left">
      <strong>Fait à :</strong> Douala<br>
      <strong>Le :</strong> ${formatDateLong(today)}
    </div>
    
    <div class="signature-box">
      <div class="signature-label">Signature du propriétaire</div>
      <div class="signature-line">Le bailleur</div>
    </div>
  </div>

  <div class="stamp">
    Document généré par SmartBay • Gestion locative intelligente
  </div>
</body>
</html>`;

  // Ouvre le reçu dans un nouvel onglet pour impression/téléchargement
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
}