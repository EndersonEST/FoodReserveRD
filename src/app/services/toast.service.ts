import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async success(message: string) {
    await this.show(message, 'success', 'checkmark-circle');
  }

  async error(message: string) {
    await this.show(message, 'danger', 'alert-circle');
  }

  async info(message: string) {
    await this.show(message, 'medium', 'information-circle');
  }

  private async show(message: string, color: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      icon,
      position: 'top',
      cssClass: 'app-toast',
      buttons: [{ icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
