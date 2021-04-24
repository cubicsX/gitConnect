importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js")

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
	apiKey: "AIzaSyD52G2YCNFd_VAxTDlU5orPVfgRYFszJKQ",
	authDomain: "gitconnect-f8915.firebaseapp.com",
	projectId: "gitconnect-f8915",
	storageBucket: "gitconnect-f8915.appspot.com",
	messagingSenderId: "406559021334",
	appId: "1:406559021334:web:d86f43ac943e80d9ec1837",
	measurementId: "G-CQ4JC43BYC",
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()
messaging.onBackgroundMessage(function (payload) {
	//if payload.notification -> no Icon bcz firebse will show notificaiton,
	self.registration.showNotification(payload.data.title, {
		icon: "./favicon.ico",
		body: payload.data.body,
		//sound: "./NotificationSounds/cancel_delivery_job.mp3",
	})
})
