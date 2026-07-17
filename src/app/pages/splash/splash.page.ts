import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonContent],
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss']
})
export class SplashPage implements OnInit {
  constructor(
    private router: Router,
    private databaseService: DatabaseService
  ) {}

  async ngOnInit() {
    await this.databaseService.init();

    setTimeout(() => {
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    }, 1600);
  }
}
