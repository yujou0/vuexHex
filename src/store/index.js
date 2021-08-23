import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'

import productsModules from './products'

Vue.use(Vuex);

export default new Vuex.Store({
  // 嚴謹模式
  strict: true,
  state: {
    isLoading: false,
    cart:{
      carts:[]
    }
  },
  //   操作行為
  // 可以放非同步行為
  actions: {
    //   這裡的status是 payload載荷
    updateLoading(context, status) {
      // setTimeout(() => {
        context.commit("LOADING", status);
      // }, 100);
    },
    getCart(context) {
      context.commit('LOADING',true);
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      axios.get(url).then((response) => {
        if (response.data.data.carts) {
          context.commit('CART',response.data.data);
        }
        context.commit('LOADING',false);
        console.log('取得購物車', response.data.data);
      });
    },
    removeCart(context,id) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      axios.delete(url).then((response) => {
        context.commit('LOADING',false);
        context.dispatch('getCart');
        console.log('刪除購物車項目', response);
      });
    },
    addtoCart(context,{id,qty}){
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      context.commit('LOADING',true);
      const item = {
        product_id: id,
        qty,
      };
      axios.post(url, { data: item }).then((response) => {
        context.commit('LOADING',false);
        context.dispatch('getCart');
        console.log('加入購物車:', response);
    })}
  },
  // 實際操作狀態
  // mutations內不要放非同步行為
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    },
    CART(state, payload) {
      state.cart = payload;
    }
  },
  getters:{
    isLoading:state => state.isLoading,
    cart:state => state.cart
  },
  modules:{
    productsModules
  }
});
