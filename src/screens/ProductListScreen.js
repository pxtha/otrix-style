import React, { useEffect, useMemo, } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Modal,
    Image
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, FlatListProductView, OtirxBackButton, FilterTags, FilterComponent
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { addToWishList } from '@actions';
import { filter } from '@common';
import { _addToWishlist, _getWishlist, logfunction } from "@helpers/FunctionHelper";
import { ProductListSkeleton } from '@skeleton';
import { GET_PRODUCTS, GET_FILTERS } from '@apis/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { filterMapping } from "@component/items/FilterMapping";
import { ProductsMapping } from "@component/items/ProductsMapping";

function ProductListScreen(props) {
    const [state, setState] = React.useState({
        selectedFilters: {
            tags: [],
            colour: [],
            sizes: []
        }, filterModelVisible: false
    });
    const [getProducts, { data: productList, error, loading }] = useLazyQuery(GET_PRODUCTS);
    const { data } = useQuery(GET_FILTERS);

    const colourFilter = useMemo(() => {
        if (data && data.sizes.data) {
            return filterMapping(data.productVariants.data, 'color')
        }
    }, [data])
    const sizesFilter = useMemo(() => {
        if (data && data.sizes.data) {
            return filterMapping(data.sizes.data, 'name')
        }
    }, [data])
    const tagsFilter = useMemo(() => {
        if (data && data.sizes.data) {
            return filterMapping(data.categories.data, 'name')
        }
    }, [data])

    //when filter tag clicked
    const filterClick = (value, key) => {
        const { selectedFilters } = state;
        if (selectedFilters[key].includes(value)) {
            const index = selectedFilters[key].indexOf(value);
            if (index > -1) {
                selectedFilters[key].splice(index, 1);
            }
            setState({
                ...state,
                selectedFilters: {
                    ...selectedFilters,
                    [key]: selectedFilters[key]
                }
            })

        }
        else {
            setState({
                ...state,
                selectedFilters: {
                    ...selectedFilters,
                    [key]: [...selectedFilters[key], value]
                }
            });
        }
    }

    const closeFilterModel = () => {
        setState({
            ...state,
            filterModelVisible: false
        });
    }

    const clearFilterModel = () => {
        setState({
            ...state,
            selectedFilters: {
                tags: [],
                colour: [],
                sizes: []
            }
        });
    }

    const addToWishlist = async (id) => {
        let wishlistData = await _addToWishlist(id);
        props.addToWishList(wishlistData);
    }

    const { title } = props.route.params;
    const { selectedFilters, filterModelVisible, } = state;
    const { wishlistData, strings } = props;

    useEffect(() => {
        getProducts({
            variables: {
                color: selectedFilters.colour ? selectedFilters.colour : [],
                size: selectedFilters.sizes ? selectedFilters.sizes : [],
                category: selectedFilters.tags ? selectedFilters.tags[0] : undefined,
                page: 1,
                perPage: 10,
                list: true
            }
        });
    }, [selectedFilters.colour.length, selectedFilters.sizes.length, selectedFilters.tags.length])
    
    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter]}>
                    <Text style={GlobalStyles.headingTxt}>{title}</Text>
                </View>
                <TouchableOpacity style={GlobalStyles.headerRight} onPress={() => setState({ ...state, filterModelVisible: true })}>
                    <Image source={filter} style={styles.filter} />
                </TouchableOpacity>
            </OtrixHeader>

            {/* Filter */}
            <View style={{ height: hp('6%') }}>
                <ScrollView style={{ flexDirection: 'row', marginHorizontal: wp('1%') }} horizontal={true} showsHorizontalScrollIndicator={false} >
                    {
                        tagsFilter?.map((item, index) =>
                            <FilterTags strings={strings} tagName={item.name} tagID={item.id} key={item.id} selected={selectedFilters.tags} onFilterPress={filterClick} />
                        )
                    }
                </ScrollView>
            </View>

            <OtrixDivider size={'sm'} />
            {/* Content Start from here */}
            {
                loading ? <ProductListSkeleton /> :
                    <View style={styles.content}>
                        < FlatList
                            style={{ padding: wp('1%') }}
                            data={ProductsMapping(productList)}
                            scrollEnabled={true}
                            horizontal={false}
                            numColumns={2}
                            onEndReachedThreshold={0.7}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(contact, index) => String(index)}
                            renderItem={({ item, index }) =>
                                <FlatListProductView strings={strings} data={item} key={item.id.toString()} imageViewBg={Colors().white} navToDetail={() => props.navigation.navigate('ProductDetailScreen', { id: item.id })} addToWishlist={addToWishlist} wishlistArray={wishlistData} />
                            }
                        >
                        </FlatList>
                    </View>
            }
            {/* Fitler Model Start From Here */}
            <Modal visible={filterModelVisible}>
                <FilterComponent strings={strings} selectedFilter={selectedFilters} onFilterPress={filterClick} closeFilter={closeFilterModel} clearFilter={clearFilterModel} tags={tagsFilter} colour={colourFilter} sizes={sizesFilter} />
            </Modal>

        </OtrixContainer >
    )
}

function mapStateToProps(state) {
    return {
        wishlistData: state.wishlist.wishlistData,
        strings: state.mainScreenInit.strings,

    }
}

export default connect(mapStateToProps, { addToWishList })(ProductListScreen);

const styles = StyleSheet.create({
    content: { flex: 1, marginHorizontal: wp('3%') },
    menuImage: {
        width: wp('5%'),
        height: hp('4%'),
        tintColor: Colors().secondry_text_color,
    },

    filter: {
        height: _roundDimensions()._height * 0.028,
        width: _roundDimensions()._height * 0.028,
    },
    bannerStyle: {
        resizeMode: 'contain',
        width: wp('100%'),
        height: hp('16%'),
        alignSelf: 'center'
    },
    modelView: {
        height: hp('100%'),
        width: wp('100%'),
        backgroundColor: Colors().light_white,
    },
});