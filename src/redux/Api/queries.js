import { gql } from "@apollo/client"

export const GET_PRODUCTS = gql`
query products(
  $searchTerm: String
  $color: [ID]
  $size: [ID]
  $brand: [ID]
  $minPrice: Float = 0
  $maxPrice: Float = 10000
  $category: ID
  $rating: Int
  $sortBy: [String]
  $page: Int = 1
  $perPage: Int
) {
  products(
    filters: {
      and: [
        { product_name: { contains: $searchTerm } }
        { product_variants: { id: { in: $color } } }
        { product_variants: { sizes: { id: { in: $size } } } }
        { vendor: { id: { in: $brand } } }
        { price: { gte: $minPrice } }
        { price: { lte: $maxPrice } }
        { categories: { id: { eq: $category } } }
        { rating: { eq: $rating } }
      ]
    }
    sort: $sortBy
    pagination: {page: $page, pageSize: $perPage}
  ) {
    data {
      id
      attributes {
        vendor {
          data {
            attributes {
              name
            }
          }
        }
        is_new
        is_top
        stock
        product_variants {
          data {
            id
            attributes {
              color
              color_name
              color
              price
              sizes {
                data {
                  id
                  attributes {
                    name
                    slug
                  }
                }
              }
            }
          }
        }
        product_name
        description
        price
        sale_price
        end_discount_time
        images {
          data {
            attributes {
              url
              height
              width
            }
          }
        }
        categories {
          data {
            id
            attributes {
              name
              slug
            }
          }
        }
      }
    }
    meta {
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
  }
}
`

export const GET_PRODUCT = gql`
         query productOne($slug: Int!, $onlyData: Boolean = false) {
        productOne(id: $slug, onlyData: $onlyData) {
            single {
                 data {
              id
              attributes {
                reviews {
                  data {
                    attributes {
                      name
                      rating
                      comment
                      createdAt
                    }
                  }
                }
                review
                rating
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      price
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
            }

            prev @skip(if: $onlyData) {
        data {
              id
              attributes {
                  review
                rating
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      price
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
        
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
            }

            next @skip(if: $onlyData) {
            data {
              id
              attributes {
                review
                rating
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      price
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
        
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
            }

            related @skip(if: $onlyData) {
               data {
              id
              attributes {
                review
                rating
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      price
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
        
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
            }
        }
    }
`

export const GET_HOME_DATA = gql`
query Home {
  home {
    data {
      attributes {
        trending {
          products {
            data {
              id
              attributes {
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
        
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
          }
        }
        deal {
          deal_of_the_day_1{
             data {
              id
              attributes {
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
        
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
          },
          deal_of_the_day_2{
   data {
              id
              attributes {
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
        
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
          }
        }
        new_arrival {
          products {
           data {
              id
              attributes {
                is_new
                is_top
                stock
                product_variants {
                  data {
                    id
                    attributes {
                      color
                      color_name
                      color
                      price
                      sizes {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
        
                        }
                      }
                    }
                  }
                  
                }
                product_name,
                description,
                price,
                sale_price,
                end_discount_time,
                images {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                  }
                },
                categories {
                  data {
                    id,
                    attributes {
                      name
                      slug
                    } 
                  }
                }
              } 
            }
          }
        }
        vendor {
          vendors {
            data {
              attributes {
                logo {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const GET_FILTERS = gql`
query Filter{
  vendors {
    data {
      id
      attributes {
        name
      }
    }
  }
  productVariants {
    data {
      id
      attributes {
        color
        sizes {
          data {
            id
            attributes {
              name
            }
          }
        }
      }
    }
  }
  sizes {
    data {
      id
      attributes {
        name
      }
    }
  }
  categories {
    data {
      id
      attributes {
        name
         products {
        data {
            id
          }
        }
      }
    }
  }
  
}
`

export const CREATE_REVIEW = gql`
mutation createR($name:String, $comment:String,$email:String,$rating:Int,$product:ID) {
  createReview(data:{
    comment:$comment
    email:$email
    rating: $rating
    product: $product
    name: $name
  }){
    data{
      id
      attributes {
        comment
        name
        email
        rating
        product {
          data {
            attributes {
              product_name
            }
          }
        }
      }
    }
  }
}
`
