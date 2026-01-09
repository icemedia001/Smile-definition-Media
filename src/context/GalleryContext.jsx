import bcrypt from 'bcryptjs';

export const GalleryProvider = ({ children }) => {
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
                const docData = querySnapshot.docs[0];
                const galleryData = docData.data();

                const isMatch = await bcrypt.compare(password, galleryData.password);

                if (isMatch) {
                    const clientData = { id: docData.id, ...galleryData };
                    setCurrentClient(clientData);
                    console.log("Login successful:", clientData.id);
                    return clientData;
                }
            }
            console.log("Login failed: No matching credentials");
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
