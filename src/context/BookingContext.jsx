import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { sendBookingNotification } from '../utils/emailService';

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

    const createBooking = async (bookingData) => {
        if (!currentUser) throw new Error('User must be logged in');

        try {
            const bookingPayload = {
                items: cart,
                totalAmount: bookingData.totalAmount,
                eventDate: bookingData.eventDate,
                userPhone: bookingData.userPhone,
                status: 'pending',
                createdAt: serverTimestamp(),
                userId: currentUser.uid,
                userEmail: currentUser.email,
                userName: currentUser.displayName || currentUser.email.split('@')[0]
            };

            const docRef = await addDoc(collection(db, 'bookings'), bookingPayload);

            // Send Email Notification
            await sendBookingNotification(bookingPayload);

            clearBookingCart();
            await fetchUserBookings();
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
                where('userId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const bookings = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); // Sort client-side
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
            const q = query(collection(db, 'bookings'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        } catch (error) {
            console.error("Error fetching all bookings: ", error);
            return [];
        }
    };

    const updateBookingStatus = async (bookingId, newStatus, rejectionReason = '') => {
        if (!currentUser) return; // Should verify admin here in real app, but simplified

        try {
            // 1. Get current booking data for email
            // (In a real app, we'd fetch it, but let's assume valid ID)
            // We need the booking data to email the user.
            // Let's quickly fetch it.
            const bookings = await fetchAllBookings();
            const booking = bookings.find(b => b.id === bookingId);

            if (!booking) throw new Error("Booking not found");

            // 2. Update Firestore
            const { doc, updateDoc } = await import('firebase/firestore');
            const bookingRef = doc(db, 'bookings', bookingId);

            await updateDoc(bookingRef, {
                status: newStatus,
                rejectionReason: rejectionReason || null
            });

            // 3. Send Email
            await sendBookingStatusEmail(booking, newStatus, rejectionReason);

            // 4. Refresh local state if needed (for admin view)
            // The Admin component usually has its own state, but if we call fetchAllBookings there it will update.
            return true;
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw error;
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
            fetchAllBookings,
            updateBookingStatus
        }}>
            {children}
        </BookingContext.Provider>
    );
};
