import axios from 'axios';

export default {
    // state屬於模組區域變數
    // actions , mutations, getters是屬於全域變數
    namespaced:true,// 加上這行後，actions , mutations, getters是屬於區域變數
    state: {
        products:[],
        categories:[],
      },
      //   操作行為
      // 可以放非同步行為
      actions: {
        getProducts(context) {
          // const vm = this;
          const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
          // 用dispatch去觸發action，然後再透過mutation改變資料狀態
        //   加上,{ root:true }，讓LOADING變成global的
          context.commit("LOADING", true,{ root:true });
          axios.get(url).then((response) => {
            context.commit("PRODUCTS", response.data.products);
            context.commit("CATEGORIES", response.data.products);
            console.log("取得產品列表", response);
        //   加上,{ root:true }，讓LOADING變成global的
            context.commit("LOADING", false,{ root:true });
          });
        },

      },
      // 實際操作狀態
      // mutations內不要放非同步行為
      mutations: {
        // 儲存遠端的資料
        PRODUCTS(state,payload){
          state.products = payload;
        },
        // 把遠端的資料一一分類
        CATEGORIES(state,payload){
          const categories = new Set();
          payload.forEach((item) => {
            categories.add(item.category);
          });
          state.categories = Array.from(categories);
        }
      },
      getters:{
        categories(state){
          return state.categories
        },
        products(state){
          return state.products
        }
      }
}