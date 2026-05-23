// Formate un nombre avec des espaces (ex: 150000 → 150 000)
export function formatNumber(num) {
  if (!num && num !== 0) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Formate une date en français (ex: 2025-01-15 → 15 Jan 2025)
export function formatDate(dateString) {
  if (!dateString) return '';
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Formate une date en toutes lettres (ex: 15 janvier 2025)
export function formatDateLong(dateString) {
  if (!dateString) return '';
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Calcule le nombre de jours avant expiration
export function getDaysUntilExpiry(endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
}

// Calcule la date de fin en fonction de la date de début et de la durée
export function computeEndDate(startDate, durationMonths) {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + durationMonths);
  return date.toISOString().split('T')[0];
}

// Convertit un nombre en lettres (français)
export function numberToWords(num) {
  const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six',
    'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze',
    'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante',
    'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  if (num === 0) return 'zéro';

  let result = '';

  if (num >= 1000000) {
    result += numberToWords(Math.floor(num / 1000000)) + ' million ';
    num %= 1000000;
  }
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += (thousands === 1 ? 'mille' : numberToWords(thousands) + ' mille') + ' ';
    num %= 1000;
  }
  if (num >= 100) {
    const hundreds = Math.floor(num / 100);
    result += (hundreds === 1 ? 'cent' : ones[hundreds] + ' cent') + ' ';
    num %= 100;
  }
  if (num >= 20) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    if (ten === 7 || ten === 9) {
      result += tens[ten - 1] + '-' + ones[10 + one] + ' ';
    } else if (ten === 8) {
      result += 'quatre-vingt' + (one > 0 ? '-' + ones[one] : 's') + ' ';
    } else {
      result += tens[ten] + (one > 0 ? '-' + ones[one] : '') + ' ';
    }
  } else if (num > 0) {
    result += ones[num] + ' ';
  }

  return result.trim();
}

// Formate le numéro de reçu (ex: 1 → 001)
export function padReceiptNumber(num) {
  return String(num).padStart(3, '0');
}