import firebase from 'firebase'
import 'firebase/firestore';

class Backend {

    addPost = async ({ coords,
        textTitle,
        textPrice,
        textLocation,
        textMaterial,
        textCategory,
        textDescription, localUri1, localUri2, localUri3, localUri4 }) => {
        const remoteUri1 = await this.uploadPhotoAsync(localUri1);
        const remoteUri2 = await this.uploadPhotoAsync(localUri2);
        const remoteUri3 = await this.uploadPhotoAsync(localUri3);
        const remoteUri4 = await this.uploadPhotoAsync(localUri4);

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .add({
                    coords,
                    textTitle,
                    textPrice,
                    textMaterial,
                    textLocation,
                    textCategory,
                    textDescription,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image1: remoteUri1,
                    image2: remoteUri2,
                    image3: remoteUri3,
                    image4: remoteUri4
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addFavorite = async ({ favoriteTitle,
        favoritePrice,
        favoriteMaterial,
        favoriteCategory,
        favoriteDescription, favoriteImage1, favoriteImage2, favoriteImage3, favoriteImage4, userRating }) => {

        return new Promise((res, rej) => {
            this.firestore
                .collection("favorites")
                .add({
                    favoriteTitle,
                    favoritePrice,
                    favoriteMaterial,
                    favoriteCategory,
                    favoriteDescription,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    favoriteImage1,
                    favoriteImage2,
                    favoriteImage3,
                    favoriteImage4,
                    userRating
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addProfile = async ({ firstName,
        lastName,
        phoneNumber,
        location,
        status, description, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);

        return new Promise((res, rej) => {
            this.firestore
                .collection("users").doc(this.uid)
                .update({
                    firstName,
                    lastName,
                    phoneNumber,
                    location,
                    status,
                    description,
                    image: remoteUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addReview = async ({ reviewTitle,
        review,
        userRating,
        name,
        title,
        image }) => {

        return new Promise((res, rej) => {
            this.firestore
                .collection("reviews")
                .add({
                    reviewTitle,
                    review,
                    userRating,
                    name,
                    title,
                    image
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg)`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(path)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => { },
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    createUser = async user => {

        let remoteUri = null

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

            let db = this.firestore.collection("users").doc(this.uid)

            db.set({
                name: user.name,
                email: user.email,
                uid: this.uid
            })
        } catch (error) {
            alert("Error: ", error);
        }
    }

    createGoogleUser = async user => {

        try {

            let db = this.firestore.collection("users").doc(this.uid)

            db.set({
                name: user.name,
                email: user.email,
                image: user.image,
                uid: this.uid
            })
        } catch (error) {
            alert("Error: ", error);
        }
    }

    signOut = () => {
        firebase.auth().signOut();
    }

    get firestore() {
        return firebase.firestore()
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid
    }

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }

    get ref() {
        return firebase.database().ref('messages');
    }

    on = callback =>
        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;

        const timestamp = new Date(numberStamp);

        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    }


    send = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];

            const message = {
                text,
                user,
                timestamp: this.timestamp,
            };
            this.append(message);
        }
    };

    append = message => this.ref.push(message);

    off() {
        this.ref.off();
    }
}

Backend.shared = new Backend();
export default Backend;