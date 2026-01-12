import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [cart, setCart] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('bookingCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('bookingCart', JSON.stringify(cart));
    }, [cart]);

    // Fetch user bookings when user logs in
    useEffect(() => {
        if (currentUser) {
            fetchUserBookings();
        } else {
            setUserBookings([]);
        }
    }, [currentUser]);

    const addToBookingCart = (item) => {
        setCart(prev => [...prev, { ...item, cartId: Date.now() }]);
    };

    const removeFromBookingCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const clearBookingCart = () => {
        setCart([]);
    };

    const createBooking = async (bookingData, guestDetails = null) => {
        // if (!currentUser && !guestDetails) throw new Error('User details required');

        try {
            const bookingPayload = {
                items: cart,
                totalAmount: bookingData.totalAmount,
                status: 'pending',
                createdAt: serverTimestamp(),
                ...bookingData
            };

            if (currentUser) {
                bookingPayload.userId = currentUser.uid;
                bookingPayload.userEmail = currentUser.email;
                bookingPayload.userName = currentUser.displayName;
            } else if (guestDetails) {
                bookingPayload.userEmail = guestDetails.email;
                bookingPayload.userName = guestDetails.name;
                bookingPayload.userPhone = guestDetails.phone;
                bookingPayload.isGuest = true;
            }

            const docRef = await addDoc(collection(db, 'bookings'), bookingPayload);

            clearBookingCart();
            if (currentUser) {
                await fetchUserBookings();
            }
            return docRef.id;
        } catch (error) {
            console.error("Error creating booking: ", error);
            throw error;
        }
    };

    const fetchUserBookings = async () => {
        if (!currentUser) return;
        setLoadingBookings(true);
        try {
            const q = query(
                collection(db, 'bookings'),
                where('userId', '==', currentUser.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const bookings = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserBookings(bookings);
        } catch (error) {
            console.error("Error fetching bookings: ", error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const fetchAllBookings = async () => {
        // For admin use
        try {
            const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching all bookings: ", error);
            return [];
        }
    };

    return (
        <BookingContext.Provider value={{
            cart,
            addToBookingCart,
            removeFromBookingCart,
            clearBookingCart,
            createBooking,
            userBookings,
            loadingBookings,
            fetchAllBookings
        }}>
            {children}
        </BookingContext.Provider>
    );
};
