import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 40;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({})
    const[products,setProducts]=useState([])
    const [token,setToken]=useState('')
    const navigate=useNavigate()
    
    
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        const cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        setCartItems(cartData);
        
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }
    
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, sizes) => 
            total + Object.values(sizes).reduce((sizeTotal, quantity) => sizeTotal + quantity, 0), 
        0);
    }

    const updateQuantity = async (itemId, size, quantity) => {
        const cartData = structuredClone(cartItems);
        
        cartData[itemId][size]=quantity;
        setCartItems(cartData    )
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }
    
    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) return total;
            
            const itemTotal = Object.entries(sizes).reduce((itemSum, [size, quantity]) => 
                itemSum + (itemInfo.price * quantity), 
            0);
            
            return total + itemTotal;
        }, 0);
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
    
            console.log("Raw Response from DB:", response.data); // Debugging log
    
            if (response.data.success && response.data.cartData) {
                console.log("Fetched Cart Data from DB:", response.data.cartData); // Debugging log
    
                // Ensure the cart data is properly structured before setting state
                if (Object.keys(response.data.cartData).length > 0) {
                    setCartItems(response.data.cartData);
                    console.log("Cart Items Updated in State:", response.data.cartData);
                } else {
                    console.warn("Cart Data is empty, not updating state.");
                }
            }
        } catch (error) {
            console.log("Error Fetching Cart Data:", error);
            toast.error(error.message);
        }
    };
        
    
    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            getUserCart(storedToken); // Fetch cart from DB
        }
    }, []);
    
    

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;