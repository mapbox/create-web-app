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
        accessToken: 'pk.eyJ1IjoiYW5kcmV3c2VwaWMxIiwiYSI6ImNsbzV0NzQwNTAzYjQyd3MwbHVjaXR1cWUifQ.1Puj3xOeBUWw0cITO38elg', // Replace with your Mapbox access token
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
