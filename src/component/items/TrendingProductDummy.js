import { product1, product19, product13, product11 } from '@common';
import { I18nManager } from 'react-native';

const TrendingProductDummy = [
    { id: "2", image: product1, name: I18nManager.isRTL ? 'صنادل كعب' : 'Heels Sandals', price: '$450', off: '', rating: 4.5, new: false, isFav: false, out_of_stock: false, reviewCount: 100, sizes: [6, 7, 8.5, 32, 36], description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc." },
    { id: "7", image: product19, name: I18nManager.isRTL ? 'نظارة شمسيه' : 'Sun Glasses', price: '$50', off: '', rating: 3.5, new: false, isFav: false, out_of_stock: false },
    { id: "8", image: product11, name: I18nManager.isRTL ? 'قبعة أساسية زرقاء' : 'Essential Cap Blue', price: '$120', off: '', rating: 5, new: false, isFav: true, out_of_stock: false },
    { id: "11", image: product13, name: I18nManager.isRTL ? 'ساعة ذكية' : 'Smart Watch', price: '$50', special: true, specialPrice: '$30', off: '10% Off', rating: 3.5, new: false, isFav: false, out_of_stock: false, reviewCount: 400, sizes: [6, 7, 8.5, 32, 36], description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc." },
];

export default TrendingProductDummy;
