import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FIREBASE_CONFIG} from'./firebase.credentials';
import {AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth} from 'angularfire2/auth'
import {AngularFireModule} from'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {AngularFireDatabaseModule} from'angularfire2/database'
import { Firebase } from '@ionic-native/firebase/ngx';
import { Facebook } from '@ionic-native/facebook/ngx'; 


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    Firebase,
    AngularFireAuth,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    
  ]
})
export class AppModule {}
