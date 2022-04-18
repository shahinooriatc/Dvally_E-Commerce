import { createContext, useReducer } from "react";

const Store = createContext();

//Cart Reducer...................
const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItems = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item) => item._id === newItems._id
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item._id === existingItem._id ? newItems : item
          )
        : [...state.cart.cartItems, newItems];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

case "CLEAR_CART":
  return { ...state,cart:{...state.cart,cartItems: [] }}  

    case "REMOVE_ITEM_FROM_CART":
      const removeItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(removeItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: removeItems,
        },
      };

    default:
      return state;
  }
};

///WishLish Reducer...................
const initialStateWish = {
  wish: {
    wishItems: localStorage.getItem("wishItems")
      ? JSON.parse(localStorage.getItem("wishItems"))
      : [],
  },
};

const reducerWish = (stateWish, action) => {
  switch (action.type) {
    case "ADD_TO_WISH":
      const newItems = action.payload;
      const existingItem = stateWish.wish.wishItems.find(
        (item) => item._id === newItems._id
      );
      const wishItems = existingItem
        ? stateWish.wish.wishItems.map((item) =>
            item._id === existingItem._id ? newItems : item
          )
        : [...stateWish.wish.wishItems, newItems];
      localStorage.setItem("wishItems", JSON.stringify(wishItems));
      return { ...stateWish, wish: { ...stateWish.wish, wishItems } };

    case "REMOVE_ITEM_FROM_WISH":
      const removeItems = stateWish.wish.wishItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("wishItems", JSON.stringify(removeItems));
      return {
        ...stateWish,
        wish: {
          ...stateWish.wish,
          wishItems: removeItems,
        },
      };
    default:
      return stateWish;
  }
};

//User SignIn Reducer...................
const initialStateUserSignIn = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};
const reducerUserSignIn = (state, action) => {
  switch (action.type) {
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    case "USER_SIGNOUT":
      return { ...state, userInfo: null };
    default:
      return state;
  }
};

//Payment Shipping address Reducer...................
const initialStateShipping = {
  shippingaddress: localStorage.getItem("shippingaddress")
    ? JSON.parse(localStorage.getItem("shippingaddress"))
    : {},
};
const reducerShipping = (state, action) => {
  switch (action.type) {
    case "SHIPPING_ADDRESS":
      return { ...state, shippingaddress: action.payload };
    default:
      return state;
  }
};


//PaymentMethod Reducer...................
const initialStatePaymentMethod = {
  paymentMethod: localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod"))
    : "",
};
const reducerPaymentMethod = (state, action) => {
  switch (action.type) {
    case "PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    default:
      return state;
  }
};

function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stateWish, dispatchWish] = useReducer(reducerWish, initialStateWish);
  const [stateUserSignIn, dispatchUserSignIn] = useReducer(
    reducerUserSignIn,
    initialStateUserSignIn
  );
  const [stateShipping, dispatchShipping] = useReducer(
    reducerShipping,
    initialStateShipping
  );
  const [statePaymentMethod, dispatchPaymentMethod] = useReducer(
    reducerPaymentMethod,
    initialStatePaymentMethod
  );

  const value = {
    state,
    dispatch,
    stateWish,
    dispatchWish,
    stateUserSignIn,
    dispatchUserSignIn,
    stateShipping,
    dispatchShipping,
    statePaymentMethod,
    dispatchPaymentMethod,
  };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export { Store, StoreProvider };
