import {  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule], // imports built-in pipes like number, date, currency
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: any;
  private platformId = inject(PLATFORM_ID);

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    // Dynamically import Mapbox GL JS with default export.
    const mapboxgl = (await import('mapbox-gl')).default
  
      this.map = new mapboxgl.Map({
        accessToken: process.env['MAPBOX_ACCESS_TOKEN'],
        container: this.mapContainer.nativeElement,
        center:  [-71.05953, 42.36290],
        zoom: 13
      });
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
