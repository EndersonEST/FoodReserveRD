import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;
  private ctrl: LoadingController | null = null;

  constructor(loadingCtrl: LoadingController) {
    this.ctrl = loadingCtrl;
  }

  async show(message = 'Cargando...') {
    if (this.loading) {
      return;
    }
    this.loading = await this.ctrl!.create({
      message,
      spinner: 'crescent',
      cssClass: 'app-loading'
    });
    await this.loading.present();
  }

  async hide() {
    if (!this.loading) {
      return;
    }
    await this.loading.dismiss();
    this.loading = null;
  }
}
