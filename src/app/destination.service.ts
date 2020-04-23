import { Injectable } from '@angular/core';
import { DataList } from './ehr/datalist';

/*@Injectable({ <-- Fungerar inte för att Destination konstruktor tar parametrar.
  providedIn: 'root' 
})*/
/**
* Destination determines what data should be sent to which destination.
* Contains destination's name, url and data to be sent.
*/
export class Destination {
  private name : string;
  private url : string;
  private categories : Map<string, DataList>;
  private needsAuth : boolean;

  constructor(name:string, url:string, needsAuth: boolean) 
  {
    this.name = name;
    this.url = url;
    this.categories = new Map<string, DataList>();
    this.needsAuth = needsAuth;
  };

  public getDestinationName(): string {
    return this.name;
  }

  public setDestinationName(name: string) {
    this.name = name;
  }

  public getDestinationUrl(): string {
    return this.url;
  }

  public setDestinationUrl(url: string) {
    this.url = url;
  }

  public getCategories(): Map<string, DataList> {
    return this.categories;
  }

  public setCategories(categories : Map<string, DataList> ){
    this.categories = categories;
  }

  public setDataList(categoryId: string, list: DataList) {
    this.categories.set(categoryId, list);
  }

  public getAuth() : boolean {
  return this.needsAuth;
  }
}
