import { I18nManager } from 'react-native';

const PaymentMethodsDummy = [
    { id: "1", name: I18nManager.isRTL ? 'المحفظة' : 'Wallet/UPI' },
    { id: "2", name: I18nManager.isRTL ? 'صافي المصرفية' : 'Net Banking' },
    { id: "3", name: I18nManager.isRTL ? 'بطاقة الائتمان / الخصم / الصراف الآلي' : 'Credit / Debit / ATM Card' },
    { id: "4", name: I18nManager.isRTL ? 'الدفع عند الاستلام' : "Cash On Delivery" }
];

export default PaymentMethodsDummy;
