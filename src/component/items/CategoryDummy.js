import { category1, category2, category3, category4, category5, category6, category7, category8 } from '@common';
import { I18nManager } from 'react-native';
const CategoryDummy = [
    { id: '1', image: category5, name: I18nManager.isRTL ? 'الملابس' : 'Cloths' },
    { id: '2', image: category4, name: I18nManager.isRTL ? 'أحذية' : 'Shoes' },
    { id: '3', image: category3, name: I18nManager.isRTL ? 'خضروات' : 'Grocery' },
    { id: '4', image: category6, name: I18nManager.isRTL ? 'ملابس الاطفال' : 'Kids Wear' },
    { id: '5', image: category2, name: I18nManager.isRTL ? 'السفر' : 'Travel' },
    { id: '6', image: category1, name: I18nManager.isRTL ? 'موضة' : 'Fashion' },
    { id: '7', image: category7, name: I18nManager.isRTL ? 'فساتين السيدات' : 'Ladies Dress' },
    { id: '8', image: category8, name: I18nManager.isRTL ? 'صندل كعب' : 'Heels Sandal' },
];

export default CategoryDummy;
