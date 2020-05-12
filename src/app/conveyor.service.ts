import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';

import { Destination } from './destination.service';
import { DataList } from './ehr/datalist';
import { EhrService } from './ehr/ehr.service';
import { CompositionReceipt } from './ehr/ehr.service';

import { Platform } from './platform/platform.service';
import { GfitService } from './platform/gfit.service';
import { DummyPlatformService } from './platform/dummy.service';
import { BluetoothService } from './platform/bluetooth.service';

@Injectable({
  providedIn: 'root'
})
export class Conveyor {
  private readonly platforms: Map<string, Platform>;
  private categories: Map<string, DataList>;
  private destinations: Map<string, Destination>;

  constructor(
    private ehrService: EhrService,
    private gfitService: GfitService,
    private dummyPlatformService: DummyPlatformService,
    private bluetoothService: BluetoothService)
    {
      this.categories = new Map<string, DataList>();
      this.destinations  = new Map<string, Destination>();
      this.platforms = new Map<string, Platform>([
        [ 'google-fit', this.gfitService ],
        [ 'dummy', this.dummyPlatformService ],
        [ 'bluetooth', this.bluetoothService ]
      ]);
    }

  public async signIn(platformId: string) {
    const platform: Platform = this.platforms.get(platformId);
    await platform.signIn();
  }

  public signOut(platformId: string): void {
    const platform: Platform = this.platforms.get(platformId);
    platform.signOut();
  }

  public getPlatforms(): string[] {
    return Array.from(this.platforms.keys());
  }

  public getAvailableCategories(platformId: string): Observable<string[]> {
    const platform: Platform = this.platforms.get(platformId);
    return platform.getAvailable();
  }

  public getCategoryIds(): string[] {
    return Array.from(this.categories.keys());
  }

  public hasCategoryId(categoryId: string): boolean {
    return this.categories.has(categoryId);
  }

  public getAllCategories(): string[] {
    return this.ehrService.getCategories();
  }

  /**
   * Fetches data from a specified timeinterval for a given category, from a
   * given platform.
   * @param platformId identifier for the platform which data is to be fetched
   * from
   * @param categoryId identifier for the category of interest
   * @param start start of requested time interval
   * @param end end of requested time interval
   * @returns an empty observable, notifying any listeners that the fetching is
   * complete
   */
  public fetchData(platformId: string, categoryId: string,
                   start: Date, end: Date): Observable<any> {
      console.log("calling fetchData");
      if (!this.platforms.has(platformId)) {
        throw TypeError('platform ' + platformId + 'not available');
      }
      if (!this.categories.has(categoryId)) {
        const spec = this.ehrService.getCategorySpec(categoryId);
        this.categories.set(categoryId, new DataList(spec));
      }

      const platform = this.platforms.get(platformId);
      const category: DataList = this.getDataList(categoryId);
      /* Add points to category and return an empty observable for the GUI to
        subscribe to */
      return platform.getData(categoryId, start, end)
      .pipe(map(res => {
        category.addPoints(res);
        return EMPTY;
      }));
    }

  public getDataList(categoryId: string): DataList {
    //console.log("getDataList: " + categoryId);
    if (this.categories.has(categoryId)) {
      return this.categories.get(categoryId);
    } else {
      return null;
    }
  }

  public dataListIsEmpty(categoryId: string): boolean {
    if(this.categories.get(categoryId).getUnfilteredPoints().length == 0){
      return true;
    }
    return false;
  }

  public setDataList(categoryId: string, list: DataList): void {
    this.categories.set(categoryId, list);
  }

  public removeDestination(url: string): void {
    this.destinations.delete(url);
  }

  public clearData(): void {
    this.categories = new Map<string, DataList>();
  }

  public getCategorySpec(categoryId: string): any {
    return this.ehrService.getCategorySpec(categoryId);
  }

  public sendData(dest: Destination): Observable<CompositionReceipt> {
    const composition = this.ehrService.createComposition(
      Array.from(dest.getCategories().values())
    );
    return this.ehrService.sendComposition(composition, dest.getDestinationUrl());
  }

  public setDestination(dest:Destination){
    this.destinations.set(dest.getDestinationUrl(), dest);
  }

  public getDestinations(){
    return this.destinations;
  }

  public getDestinationSpec(dest:Destination){
    if(this.destinations.has(dest.getDestinationUrl())){
      return this.destinations.get(dest.getDestinationUrl());
  }
    else{
      console.log("Destination not found");
    }
  }
}
