import firebase from "firebase/app"
import "firebase/messaging"
import axios from "axios"
import { BASE_URL } from "../constant"

// for toast UI
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const VAPID_KEY = "BNPlGYfFRz0aBBtw732ruEw_xJuihDumdPpwX-qnR6CSi94YnSoJUZqNF-beKtfCaSNT0GfNLx2WWuIB6pmrGKw"

export const initilizeFirebase = () => {
	const firebaseConfig = {
		apiKey: "AIzaSyD52G2YCNFd_VAxTDlU5orPVfgRYFszJKQ",
		authDomain: "gitconnect-f8915.firebaseapp.com",
		projectId: "gitconnect-f8915",
		storageBucket: "gitconnect-f8915.appspot.com",
		messagingSenderId: "406559021334",
		appId: "1:406559021334:web:d86f43ac943e80d9ec1837",
		measurementId: "G-CQ4JC43BYC",
	}
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig)
}
initilizeFirebase()
toast.configure()
export const firebaseMessaging = firebase.messaging()

export const getAndRegisterFirebaseToken = () => {
	try {
		firebaseMessaging
			.getToken({
				vapidKey: VAPID_KEY,
			})
			.then((currentToken) => {
				if (currentToken) {
					axios({
						method: "POST",
						data: {
							notification_token: currentToken,
						},
						withCredentials: true,
						url: `${BASE_URL}/firebase-view`,
					})
				} else {
					console.log("No registration token available. Request permission to generate one.")
					// ...
				}
			})
			.catch((err) => {
				console.log("An error occurred while retrieving token. ", err)
			})
	} catch (error) {
		console.log(error, "firebase error")
	}
}

export const setUpNotificationFlow = () => {
	getAndRegisterFirebaseToken()

	firebaseMessaging.onMessage((payload) => {
		console.log(payload)
		toast(payload.data.title)
	})
}
