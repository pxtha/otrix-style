import { product1, product3, product5, product7 } from '@common';
import { I18nManager } from 'react-native';

const SimilarDummy = [
    { id: "1", image: product7, name: I18nManager.isRTL ? 'أحذية الركض من بوما' : 'Pumma Runing Shoes', price: '$350', off: '20% Off', rating: 4, new: true, isFav: true, out_of_stock: false },
    { id: "2", image: product1, name: I18nManager.isRTL ? 'صنادل كعب' : 'Heels Sandals', price: '$450', off: '', rating: 4.5, new: false, isFav: false, out_of_stock: true },
    { id: "3", image: product3, name: I18nManager.isRTL ? 'حقيبة أمتعة' : 'Luggage Bag', price: '$800', off: '10% Off', rating: 3, new: true, isFav: false, out_of_stock: false },
    { id: "4", image: product5, name: I18nManager.isRTL ? 'قبعة أساسية' : 'Essential Cap', price: '$100', off: '', rating: 4, new: true, isFav: true, out_of_stock: false },
];

export default SimilarDummy;
