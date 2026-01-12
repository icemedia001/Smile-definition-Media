import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const GalleryContext = createContext();

export const useGallery = () => {
    return useContext(GalleryContext);
};

export const GalleryProvider = ({ children }) => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentClient, setCurrentClient] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'galleries'), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGalleries(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.secure_url;
    };

    const addImagesToGallery = async (galleryId, files) => {
        const promises = files.map(async file => {
            const url = await uploadImageToCloudinary(file);
            return { id: Date.now() + Math.random(), url, selected: false };
        });
        const newImages = await Promise.all(promises);
        await updateDoc(doc(db, 'galleries', galleryId), {
            images: arrayUnion(...newImages)
        });
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const createGallery = async (clientName, clientEmail) => {
        console.log("Creating gallery for:", clientName, clientEmail);
        const password = generatePassword();

        const hashedPassword = await bcrypt.hash(password, 10);

        const newGallery = {
            clientName,
            clientEmail,
            password: hashedPassword,
            images: [],
            createdAt: new Date().toISOString()
        };

        try {
            const docRef = await addDoc(collection(db, 'galleries'), newGallery);
            console.log("Gallery created with ID:", docRef.id);
            return { password };
        } catch (error) {
            console.error("Error creating gallery: ", error);
            throw error;
        }
    };

    const clientLogin = async (email, password) => {
        console.log("Attempting login for:", email);
        try {
            const q = query(
                collection(db, 'galleries'),
                where("clientEmail", "==", email)
            );
            const querySnapshot = await getDocs(q);
            console.log("Login query found docs:", querySnapshot.size);

            if (!querySnapshot.empty) {
                console.log("Found client, verifying password...");
                const docData = querySnapshot.docs[0];
                const galleryData = docData.data();

                let isMatch = false;
                try {
                    // Try bcrypt comparison first
                    isMatch = await bcrypt.compare(password, galleryData.password);
                } catch (err) {
                    console.log("Bcrypt comparison failed (likely legacy data), checking plain text...");
                }

                // Fallback: Check plain text if bcrypt failed or returned false
                if (!isMatch && password === galleryData.password) {
                    console.log("Plain text password match (Legacy)");
                    isMatch = true;
                }

                if (isMatch) {
                    const clientData = { id: docData.id, ...galleryData };
                    setCurrentClient(clientData);
                    console.log("Login successful:", clientData.id);
                    return clientData;
                } else {
                    console.log("Password mismatch");
                }
            } else {
                console.log("Login failed: No matching email found");
            }
            return null;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const clientLogout = () => {
        setCurrentClient(null);
    };

    const toggleImageSelection = async (galleryId, imageId, currentStatus) => {
        try {
            const galleryRef = doc(db, 'galleries', galleryId);
            const gallerySnap = await getDoc(galleryRef);

            if (gallerySnap.exists()) {
                const data = gallerySnap.data();
                const updatedImages = data.images.map(img => {
                    if (img.id === imageId) {
                        return { ...img, selected: !currentStatus };
                    }
                    return img;
                });

                await updateDoc(galleryRef, { images: updatedImages });

                if (currentClient && currentClient.id === galleryId) {
                    setCurrentClient({ ...currentClient, images: updatedImages });
                }
            }
        } catch (error) {
            console.error("Error toggling selection:", error);
            throw error;
        }
    };

    const uploadEditedImage = async (galleryId, imageId, file) => {
        try {
            console.log(`Uploading edited file to Cloudinary: ${file.name}`);
            const editedUrl = await uploadImageToCloudinary(file);
            console.log(`Got Edited URL: ${editedUrl}`);

            const galleryRef = doc(db, 'galleries', galleryId);
            const gallerySnap = await getDoc(galleryRef);

            if (gallerySnap.exists()) {
                const data = gallerySnap.data();
                const updatedImages = data.images.map(img => {
                    if (img.id === imageId) {
                        return { ...img, editedUrl: editedUrl };
                    }
                    return img;
                });

                await updateDoc(galleryRef, { images: updatedImages });
            }
        } catch (error) {
            console.error("Error uploading edited image:", error);
            throw error;
        }
    };

    const deleteGallery = async (galleryId) => {
        try {
            await deleteDoc(doc(db, 'galleries', galleryId));
        } catch (error) {
            console.error("Error deleting gallery: ", error);
            throw error;
        }
    };

    const updateGallery = async (galleryId, data) => {
        try {
            const galleryRef = doc(db, 'galleries', galleryId);
            await updateDoc(galleryRef, data);
        } catch (error) {
            console.error("Error updating gallery:", error);
            throw error;
        }
    };

    const addFavoriteList = async (galleryId, listName, limit) => {
        try {
            const galleryRef = doc(db, 'galleries', galleryId);
            const newList = {
                id: Date.now().toString(),
                name: listName,
                limit: parseInt(limit),
                selections: []
            };
            await updateDoc(galleryRef, {
                favoriteLists: arrayUnion(newList)
            });
        } catch (error) {
            console.error("Error adding favorite list:", error);
            throw error;
        }
    };

    return (
        <GalleryContext.Provider value={{
            galleries,
            loading,
            currentClient,
            createGallery,
            addImagesToGallery,
            clientLogin,
            clientLogout,
            toggleImageSelection,
            uploadEditedImage,
            deleteGallery,
            updateGallery,
            addFavoriteList
        }}>
            {children}
        </GalleryContext.Provider>
    );
};
