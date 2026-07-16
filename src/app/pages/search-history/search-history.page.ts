import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, trashOutline, locationOutline } from 'ionicons/icons';

import { DatabaseService } from '../../services/database.service';
import { ToastService } from '../../services/toast.service';
import { SearchHistoryEntry } from '../../models/restaurant.model';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-search-history',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonIcon, IonButton, EmptyStateComponent],
  templateUrl: './search-history.page.html',
  styleUrls: ['./search-history.page.scss']
})
export class SearchHistoryPage implements OnInit {
  history: SearchHistoryEntry[] = [];

  constructor(
    private databaseService: DatabaseService,
    private toastService: ToastService
  ) {
    addIcons({ timeOutline, trashOutline, locationOutline });
  }

  async ngOnInit() {
    this.history = await this.databaseService.getSearchHistory();
  }

  async clearHistory() {
    await this.databaseService.clearSearchHistory();
    this.history = [];
    await this.toastService.info('Historial eliminado');
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('es-DO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
