import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { AuthService } from '../services/auth.service';
import { Geometry } from 'ol/geom';
import LineString from 'ol/geom/LineString';
import GeoJSON from 'ol/format/GeoJSON';
import { HttpClient } from '@angular/common/http';
import Stroke from 'ol/style/Stroke';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  map: Map;
  vehicleFeature: Feature<Geometry> = new Feature();
  animationInterval: any;

  constructor(private authService: AuthService,private httpClient: HttpClient) { 
    this.map = new Map();
  }

  ngOnInit() {
    this.initializeMap();
    this.sendCoordinatesToApi(3, 100000); // Poziv metode sa odgovarajućim ID-om opreme
  }
  

  initializeMap() {
    // Postavljanje sloja sa osnovnim mapnim podacima
    const osmLayer = new TileLayer({
      source: new OSM()
    });
  
    // Postavljanje početnog pogleda mape
    const view = new View({
      center: fromLonLat([19.8396, 45.2671]), // Centar mape u Novom Sadu
      zoom: 12 // Nivo zumiranja
    });
  
    // Kreiranje instance mape
    this.map = new Map({
      layers: [osmLayer], // Dodavanje osnovnog sloja
      target: 'map', // ID elementa u HTML-u gde će mapa biti prikazana
      view: view // Postavljanje pogleda mape
    });
  
    // Definisanje koordinata putanje u Novom Sadu
    const novaSadPathCoordinates: [number, number][] = [
      [19.830478031576895, 45.264074265491836], // Prva tačka
      [19.83526, 45.2554782], // Druga tačka
      [19.839525, 45.2478], // Treća tačka
      [19.84124928233478,45.24400656073659],
      [19.84491748749864,45.24480714961262],
      [19.844702891268973, 45.245284862458156] // Četvrta tačka
      // Dodajte više tačaka po potrebi
    ];
  
    // Kreiranje linije na osnovu definisanih koordinata
    // Kreiranje linije na osnovu definisanih koordinata
const lineString = new LineString(novaSadPathCoordinates.map(coord => fromLonLat(coord)));

    // Kreiranje vektor sloja za prikaz putanje na mapi
    const vectorSource = new VectorSource({
      features: [new Feature({
        geometry: lineString
      })]
    });
  
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 2
        })
      })
    });
  
    // Dodajte vektor sloj na mapu
    this.map.addLayer(vectorLayer);
  }
  

  sendCoordinatesToApi(equipmentId: number, frequency: number): void {
    // Prvo slanje koordinata nakon inicijalizacije komponente
    this.sendRequestForCoordinates(equipmentId);

    // Periodično slanje koordinata na određenom intervalu
    this.animationInterval = setInterval(() => {
      this.sendRequestForCoordinates(equipmentId);
    }, frequency);
  }

  sendRequestForCoordinates(equipmentId: number): void {
    this.authService.sendCoordinates(equipmentId).subscribe(
      response => {
        console.log('Response:', response);
        if (response.message === 'Coordinates sent successfully.') {
          this.animateVehicle([response.longitude, response.latitude], [response.longitudeB, response.latitudeB]);
        } else {
          console.error('Error sending coordinates:', response);
        }
      },
      error => {
        console.error('Error sending coordinates:', error);
      }
    );
  }

  animateVehicle(startCoordinates: [number, number], endCoordinates: [number, number]) {
    // Kreiranje nove tačke za početnu poziciju kombija
    const startPoint = new Point(fromLonLat(startCoordinates));

    // Kreiranje nove tačke za krajnju poziciju kombija
    const endPoint = new Point(fromLonLat(endCoordinates));

    // Kreiranje feature objekta koji će predstavljati kombi na mapi
    this.vehicleFeature.setGeometry(startPoint);

    // Postavljanje ikone za kombi
    this.vehicleFeature.setStyle(new Style({
      image: new Icon({
        src: 'assets/delivery.png', // Putanja do slike kombija
        scale: 0.1 // Skaliranje slike kombija
      })
    }));

    // Kreiranje vektor sloja za prikaz kombija na mapi
    const vectorSource = new VectorSource({
      features: [this.vehicleFeature]
    });

    // Postavljanje nove putanje kombija
    const line = new LineString([startCoordinates, endCoordinates]);

    // Pokretanje animacije kretanja kombija
    let counter = 0;
    const coordinates = line.getCoordinates();
    const animationDuration = 100000; // ms
    const intervalDuration = 10; // ms
    const frames = animationDuration / intervalDuration;
    const deltaLat = (endCoordinates[0] - startCoordinates[0]) / frames;
    const deltaLon = (endCoordinates[1] - startCoordinates[1]) / frames;
    
    clearInterval(this.animationInterval); // Stop existing animation

    this.animationInterval = setInterval(() => {
      counter++;
      if (counter <= frames) {
        const newCoordinates = [
          startCoordinates[0] + counter * deltaLat,
          startCoordinates[1] + counter * deltaLon
        ];
        this.vehicleFeature.setGeometry(new Point(fromLonLat(newCoordinates)));
      } else {
        clearInterval(this.animationInterval);
      }
    }, intervalDuration);

    // Kreiranje vektor sloja za prikaz kombija na mapi
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    // Dodavanje vektor sloja na mapu
    this.map.addLayer(vectorLayer);
  }
  
  

}
