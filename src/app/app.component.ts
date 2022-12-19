import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { finalize } from 'rxjs';
import { HereWeGoDto, PositionDto } from './model/interfaces';

const API_KEY: string = 'le2yGq21GDB3xb0LOKBXN8gwGczDDSZBx_wUxHKS1Qw';
declare const H: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  herePlatform;

  results: HereWeGoDto[];
  loading: boolean;
  private map?: any;
  constructor(private _http: HttpClient) {
    this.herePlatform = new H.service.Platform({ 'apikey': API_KEY });
    this.results = [];
    this.loading = false;
  }

  ngOnInit() {
    const layers = this.herePlatform.createDefaultLayers();
    const map = new H.Map(
      document.getElementById('mapContainer'),
      layers.vector.normal.map,
      {
        zoom: 10,
        center: { lat: 52.5, lng: 13.4 },
        pixelRatio: window.devicePixelRatio || 1
      });
    this.map = map;

    // UI Design
    H.ui.UI.createDefault(this.map, layers);

    //always resizing
    this.map.getViewPort().resize();
  }

  setMarkerBySelection(position: PositionDto) {
    //remove old
    this.map.removeObjects(this.map.getObjects())
    //add new

    //customization marker icon
    // var svgMarkup = '<svg></svg>';
    // let icon = new H.map.Icon(svgMarkup)
    // let marker = new H.map.Marker(position, { icon: svgMarkup });

    let marker = new H.map.Marker(position, { icon: svgMarkup });
    this.map.addObject(marker);
    this.map.setCenter(position);
  }

  search(text: any) {
    let params = {
      at: '-13.163068,-72.545128',
      limit: 10,
      q: text.value,
      apiKey: API_KEY
    };
    let queryParams = new HttpParams({ fromObject: params });
    this.loading = true;
    this._http.get('https://browse.search.hereapi.com/v1/discover', { params: queryParams })
      .pipe(finalize(() => this.loading = false))
      .subscribe((response: any) => this.results = response.items);
  }

  ngAfterViewInit() {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 500);

    // add marker on tap
    this.map.addEventListener('tap', (evt: any) => {
      let position = this.map.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );
      this.setMarkerBySelection(position);
    });

    //interactive map
    new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
  }

  // Resizing
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    requestAnimationFrame(() => this.map.getViewPort().resize());
  }
}
