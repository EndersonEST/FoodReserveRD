import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage)
      },
      {
        path: 'scanner',
        loadComponent: () => import('./pages/qr-scanner/qr-scanner.page').then(m => m.QrScannerPage)
      },
      {
        path: 'bluetooth',
        loadComponent: () => import('./pages/bluetooth/bluetooth.page').then(m => m.BluetoothPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'restaurant/:id',
    loadComponent: () => import('./pages/restaurant-detail/restaurant-detail.page').then(m => m.RestaurantDetailPage)
  },
  {
    path: 'search-history',
    loadComponent: () => import('./pages/search-history/search-history.page').then(m => m.SearchHistoryPage)
  },
  {
    path: '**',
    redirectTo: 'tabs/home'
  }
];
