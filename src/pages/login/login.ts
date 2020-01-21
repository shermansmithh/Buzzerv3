import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook/ngx';
// import { Device } from '@ionic-native/device';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: boolean = false;
  userProfile: any = null;
  introSlides: any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public angularFireAuth: AngularFireAuth, private facebook: Facebook, public alertCtrl: AlertController) {
    this.introSlides = [
      {
        title: 'Find your match nearby',
        image: 'assets/img/intro/intro_1.jpg'
      },
      {
        title: 'Buzz someone that you like',
        image: 'assets/img/intro/intro_1.jpg'
      },
      {
        title: 'If they also Buzz you <br /> then "It\'s a Match!"',
        image: 'assets/img/intro/intro_1.jpg'
      },
      {
        title: 'Only people you\'ve matched <br /> with can message you',
        image: 'assets/img/intro/intro_1.jpg'
      }
    ]
  }



  facebookLogin() {
    var vm = this
    //Remove to prevent user colide
    localStorage.removeItem('rftoken')
    localStorage.removeItem('accestoken')
    localStorage.removeItem('fbid')
    localStorage.removeItem('userid')

    this.facebook.getLoginStatus().then((res) => {
      //check status of facebook login
      if (res.status === 'connected') {
        // Already logged in to FB so pass credentials to provider (in my case firebase)
        let provider = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.database().ref('/onlinestatus/' + res.authResponse.userID).once('value', function (snapshot) {

          // If no login entry has been saved or is the same devide go to automatic login 
          if ((snapshot.val() == undefined || null)  || snapshot.val().isOnline == false) {
            firebase.auth().signInWithCredential(provider).then((userinfo) => {
              // localStorage.setItem('rftoken', userinfo.refreshToken);
              localStorage.setItem('accestoken', res.authResponse.accessToken);
              localStorage.setItem('fbid', res.authResponse.userID);
              var ref = firebase.database().ref();
              // ref.child('profiles').child(userinfo.uid).update({
              //   isOnline: true
              // });
              // IWP Firebase set login user with uid / device id in other table status
              // ref.child('onlinestatus').child(res.authResponse.userID).update({
              //   isOnline: true,
              //   uid: userinfo.uid,
              //   // deviceid: vm.device.uuid ? vm.device.uuid : null,
              //   fbid: res.authResponse.userID,
              //   // model: vm.device.model,
              //   time: firebase.database.ServerValue.TIMESTAMP
              // })
              // localStorage.setItem("userid", userinfo.uid);
            });
          } else {
            vm.showAlert(snapshot)
          }
        });
      } else {
        // Not already logged in to FB so sign in
        var perms = new Array('email', 'user_birthday', 'user_photos', 'user_gender', 'user_friends');
        this.facebook.login(perms).then((response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
          //Check if Can Login device check and more
          firebase.database().ref('/onlinestatus/' + response.authResponse.userID).once('value', function (snapshot) {

            // If no login entry has been saved or is the same devide go to login form
            if ((snapshot.val() == undefined || null) || snapshot.val().isOnline == false) {
              firebase.auth().signInWithCredential(facebookCredential)
                .then((userinfo) => {
                  // localStorage.setItem('rftoken', userinfo.refreshToken);
                  localStorage.setItem('accestoken', response.authResponse.accessToken);
                  localStorage.setItem('fbid', response.authResponse.userID);
                  var ref = firebase.database().ref();
                  // ref.child('profiles').child(userinfo.uid).update({
                  //   isOnline: true
                  // });
                  ref.child('onlinestatus').child(response.authResponse.userID).update({
                    isOnline: true,
                    // uid: userinfo.uid,
                    // deviceid: vm.device.uuid ? vm.device.uuid : null,
                    fbid: response.authResponse.userID,
                    // model: vm.device.model,
                    time: firebase.database.ServerValue.TIMESTAMP
                  })
                  // localStorage.setItem("userid", userinfo.uid);
                })
                .catch((error) => {
                  console.log("Firebase failure: " + JSON.stringify(error));
                });
            } else {
              // vm.showAlert(snapshot)
            }
          });
        }).catch((error) => { console.log(error) });
      }
    });
  }

  showAlert(snapshot){
    let alert = this.alertCtrl.create({
      title: 'Alert',
      message: "You must first log out of the other device: " + snapshot.val().model,
      buttons: ['Ok']
      });
      alert.present();

  }
}
