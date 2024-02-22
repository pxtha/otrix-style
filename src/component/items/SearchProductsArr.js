import { product1, product3, product4, product5, product7, product6 } from '@common';
import { I18nManager } from 'react-native';

const SearchProductsArr = [
    { id: "1", image: product7, name: I18nManager.isRTL ? 'أحذية الركض من بوما' : 'Pumma Runing Shoes', price: '$350' },
    { id: "2", image: product1, name: I18nManager.isRTL ? 'صنادل كعب' : 'Heels Sandals', price: '$450' },
    { id: "3", image: product3, name: I18nManager.isRTL ? 'حقيبة أمتعة' : 'Luggage Bag', price: '$800' },
    { id: "4", image: product5, name: I18nManager.isRTL ? 'قبعة أساسية' : 'Essential Cap', price: '$100' },
    { id: "5", image: product4, name: I18nManager.isRTL ? 'قميص للرجال' : 'Men Shirt', price: '$200' },
    { id: "9", image: product6, images: [product6], name: I18nManager.isRTL ? 'حذاء رجالي أزرق' : 'Men Blue Shoes', price: '$200' },
];

export default SearchProductsArr;
