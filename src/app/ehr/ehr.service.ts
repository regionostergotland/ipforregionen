import { Inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from 'src/app/config.service';
import { EHR_CONFIG, EhrConfig } from './ehr-config';
import { CategorySpec } from './datatype';
import { DataList } from './datalist';
import { AuthService } from 'src/app/auth.service';

/* Receipt for composition creation */
export interface CompositionReceipt {
  pnr: string;
  composition: {};
  partyId: string;
  ehrId: string;
  compUid: string;
}

/* Response from composition API call */
interface CompositionResponse {
  action: string;
  compositionUid: string;
  meta: {};
}

@Injectable({
  providedIn: 'root',
})
export class EhrService {
  constructor(
    @Inject(EHR_CONFIG) private ehrConfig: EhrConfig,
    private cfg: ConfigService,
    private auth: AuthService,
  ) {}

  /* Get the specification of an available category.
   * @param id of category returned by getCategories.
   */
  public getCategorySpec(categoryId: string): CategorySpec {
    return this.ehrConfig.categories.find(e => e.id === categoryId);
  }

  /* Get a list of available categories of data. */
  public getCategories(): string[] {
    const cats = [];

    for (const cat of this.ehrConfig.categories) {
      cats.push(cat.id);
    }
    return cats;
  }

  /*
   * Create a composition of the given datalists to the EHR with the given
   * ehrID.
   * @returns composition UID of the created composition
   */
  private postComposition(ehrId: any, composition: {}, baseUrl: string):
      Observable<CompositionResponse> {
    const params = new HttpParams()
    .set('ehrId', ehrId)
    // .set('ehrID', "7d44b88c-4199-4bad-97dc-d78268e01398")
    .set('templateId', this.cfg.getEhrTemplateId())
    .set('format', 'STRUCTURED');
    let call = 'composition';
    
    /**
      * Firebase url needs to end with .json
      * Other databases might not need it
      * Check if universal fix is possible
      */
    if (baseUrl.includes('firebase')) {
      call += '.json';
    } else if (baseUrl.includes('ehrbase')) {
      call = ehrId + '/composition';
      
      // PHR ehrbase doesn't take params in the same way ehrscape does so we have to return early.
      return this.auth.postAuthenticated<CompositionResponse> (
        call, composition, baseUrl
      );
    }
    
    return this.auth.postAuthenticated<CompositionResponse>(
      call, composition, baseUrl, params
    );
  }

  /** Ehrids phr 2020-05-12
   * -7d44b88c-4199-4bad-97dc-d78268e01398
   */


  /* Create a composition of given data lists */
  public createEhrscapeComposition(lists: DataList[]): {} {
    const composition: any = {
      ctx: {
        language: 'en',
        territory: 'SE',
      },
      self_monitoring: {}
    };

    for (const list of lists) {
      const spec = list.spec;

      composition.self_monitoring[spec.id] = [ {} ];
      const root = composition.self_monitoring[spec.id];

      let pIndex = 0; /* index of current point in list */
      // (fn shall be used when known how)
      // tslint:disable-next-line
      for (const [fn, points] of list.getPoints()) {
        // TODO specify math function of events
        // how to specify??
        for (const point of points) {
          for (const [id, value] of point.entries()) {
            const dataType = spec.dataTypes.get(id);
            if (value !== '' && value) {
              let container: any = root;
              for (const key of dataType.path) {
                if (!(key in container[0])) {
                  container[0][key] = [ {} ];
                }
                container = container[0][key];
              }
              let element: any;
              if (dataType.single) { // use/overwrite first and only element
                if (!container[0]) {
                  container[0] = {};
                }
                element = container[0];
              } else {
                if (!container[pIndex]) {
                  container[pIndex] = {};
                }
                element = container[pIndex];
              }
              element[id] = [dataType.toRest(value)];
            }
          }
          pIndex++;
        }
      }
    }
    return composition;
  }

  /** TODO:
   * -Make this function more general
   * -Make everything more general✅
   * -Find a way to authenticate against ehrBase
   * -Move the bulk of the predetermined ehrbase composition stuff?
   */
  public createEhrbaseComposition(list: DataList[]): {} {
    let composition: {} = {
      "_type": "COMPOSITION",
      "archetype_node_id": "openEHR-EHR-COMPOSITION.self_monitoring.v0",
      "name": {
        "value": "self-reporting-new"
      },
      "uid": {
        "_type": "HIER_OBJECT_ID",
        "value": "af179164-af8a-4bb8-8fb5-eac7cfe8924d::127.0.0.1::1"
      },
      "archetype_details": {
        "archetype_id": {
          "value": "openEHR-EHR-COMPOSITION.self_monitoring.v0"
        },
        "template_id": {
          "value": "self-reporting-new"
        },
        "rm_version": "1.0.2"
      },
      "language": {
        "terminology_id": {
          "value": "ISO_639-1"
        },
        "code_string": "en"
      },
      "territory": {
        "terminology_id": {
          "value": "ISO_3166-1"
        },
        "code_string": "SE"
      },
      "category": {
        "value": "event",
        "defining_code": {
          "terminology_id": {
            "value": "openehr"
          },
          "code_string": "433"
        }
      },
      "composer": {
        "_type": "PARTY_IDENTIFIED",
        "external_ref": {
          "id": {
            "_type": "HIER_OBJECT_ID",
            "value": "ea5738d3-83bf-42bf-b13c-4431819677cf"
          },
          "namespace": "default",
          "type": "PERSON"
        },
        "name": "A name"
      },
      "context": {
        "start_time": {
          "value": "2014-11-18T09:50:35.000+01:00"
        },
        "setting": {
          "value": "other care",
          "defining_code": {
            "terminology_id": {
              "value": "openehr"
            },
            "code_string": "238"
          }
        }
      },
      "content": []
    }
    return composition;
  }

  /*
   * Send a composition to the EHR of individual with given configured pnr.
   * @param composition Composition created using createComposition method
   */
  public sendComposition(composition: {},
                baseUrl: string): Observable<CompositionReceipt> {
    const pnr = this.auth.getUser().pnr;
    const receipt: CompositionReceipt = {
      pnr,
      composition,
      partyId: '',
      ehrId: '',
      compUid: '',
    };
    return this.postComposition(this.auth.getUser().ehrId, composition, baseUrl)
      .pipe(map((res: any) => {
        receipt.ehrId = this.auth.getUser().ehrId;
        
        if(!!res.compositionUid) {
          receipt.compUid = res.compositionUid;
        } else if (!!res.uid.value) {
          receipt.compUid = res.uid.value;
        }
        
        return receipt;
    }));
  }
}
