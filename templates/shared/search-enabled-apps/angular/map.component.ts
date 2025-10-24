import {  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  
  private map: any;
  private readonly platformId = inject(PLATFORM_ID);

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      await this.initializeMap();
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  private async initializeMap(): Promise<void> {
    // Dynamically import Mapbox GL JS to avoid SSR issues
    const mapboxgl = (await import('mapbox-gl')).default;
  
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: this.mapContainer.nativeElement,
      center: [-71.05953, 42.36290],
      zoom: 13
    });

    // Wait for map to load before adding controls
    this.map.on('load', () => this.onMapLoad(mapboxgl));
    this.map.on('error', (e: any) => console.error('Map error:', e.error));
  }

  private async onMapLoad(mapboxgl: any): Promise<void> {
    if (!this.map) return;

    try {
      // Dynamically import search library to avoid SSR issues
      const { MapboxSearchBox } = await import('@mapbox/search-js-web');

      const searchBox = new MapboxSearchBox();
      searchBox.accessToken = environment.mapboxAccessToken;
      searchBox.options = {
        proximity: [-71.05953, 42.36290]
      };
      searchBox.marker = true;
      searchBox.mapboxgl = mapboxgl;
      searchBox.componentOptions = { 
        allowReverse: true, 
        flipCoordinates: true 
      };
      
      this.map.addControl(searchBox as any);
    } catch (error) {
      console.error('Error adding search control:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
