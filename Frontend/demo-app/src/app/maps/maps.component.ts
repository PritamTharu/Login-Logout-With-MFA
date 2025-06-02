import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-maps',
  imports: [],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})

export class MapsComponent implements AfterViewInit {
  constructor(){}

  private map: any;

  private initMap(): void {

    const map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 4
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    const marker = L.marker([39.8282, -98.5795],{riseOnHover: true, title: 'marker'})
    const marker2 = L.marker([39, -98],{riseOnHover: true, title: 'marker2'})



    // start from here first initializa map
    this.map = map;
    // add tiles i.e openstreet map in map insert
    tiles.addTo(this.map);
    // add 2 markers in map with some options
    marker.addTo(this.map);
    marker2.addTo(this.map);
    // bind popup to those markers
    marker.bindPopup("This is the selected popup")
    marker2.bindPopup("This is the another selected popup")

  }


  ngAfterViewInit(): void {
    this.initMap();
  }

}
