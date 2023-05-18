import {Injectable} from '@angular/core';
import {DataHandlerDataStatus} from '../modules/shared/model/data-handler-data-status.model';
import {DataStoreService} from './data-store.service';
import {TranslateService} from '@ngx-translate/core';
import {DataHandlerDataId} from '../modules/shared/model/data-handler-data-id.model';
import {SpinnerService} from './spinner.service';
import {TemplateService} from './load-data/template.service';
import {Template} from '../shared/model/template.model';
import {TemplateElement} from '../shared/model/template-element.model';
import {TemplateFieldService} from './load-data/template-field.service';
import {TemplateElementService} from './load-data/template-element.service';
import {TemplateInstance} from '../shared/model/template-instance.model';
import {TemplateInstanceService} from './load-data/template-instance.service';
import {TemplateField} from '../shared/model/template-field.model';
import {FolderContent} from '../shared/model/folder-content.model';
import {FolderContentService} from './load-data/folder-content.service';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  private dataIdMap: Map<string, DataHandlerDataStatus>;
  private dataAvailable: boolean;
  private successCallback: Function;
  private errorCallback: Function;
  private preCallback: Function;

  constructor(
    public dataStore: DataStoreService,
    public spinner: SpinnerService,
    private translateService: TranslateService,
    private templateFieldService: TemplateFieldService,
    private templateElementService: TemplateElementService,
    private templateService: TemplateService,
    private templateInstanceService: TemplateInstanceService,
    private folderContentService: FolderContentService
  ) {
    this.dataIdMap = new Map<string, DataHandlerDataStatus>();
    this.dataAvailable = false;
    this.successCallback = null;
    this.errorCallback = null;
    this.preCallback = null;
  }

  reset(): DataHandlerService {
    this.spinner.hide();
    this.dataIdMap.clear();
    this.dataAvailable = false;
    this.successCallback = null;
    this.errorCallback = null;
    return this;
  }

  require(dataId: DataHandlerDataId): DataHandlerService {
    const status: DataHandlerDataStatus = DataHandlerDataStatus.forDataId(dataId);
    this.dataIdMap.set(status.getKey(), status);
    return this;
  }

  requireId(dataId: DataHandlerDataId, id: string): DataHandlerService {
    const status: DataHandlerDataStatus = DataHandlerDataStatus.forDataIdAndId(dataId, id);
    this.dataIdMap.set(status.getKey(), status);
    return this;
  }

  load(successCallback?: Function, errorCallback?: Function) {
    this.spinner.show();
    this.dataAvailable = false;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.dataIdMap.forEach((dataStatus: DataHandlerDataStatus) => {
      this.loadData(dataStatus);
      if (dataStatus.canceled) {
        this.checkCompletion();
      }
    });
  }

  setPreCallback(preCallback: Function) {
    this.preCallback = preCallback;
  }

  private loadData(dataStatus: DataHandlerDataStatus) {
    switch (dataStatus.dataId) {
      case DataHandlerDataId.TEMPLATE_FIELD:
        this.loadTemplateField(dataStatus);
        break;
      case DataHandlerDataId.TEMPLATE_ELEMENT:
        this.loadTemplateElement(dataStatus);
        break;
      case DataHandlerDataId.TEMPLATE:
        this.loadTemplate(dataStatus);
        break;
      case DataHandlerDataId.TEMPLATE_INSTANCE:
        this.loadTemplateInstance(dataStatus);
        break;
      case DataHandlerDataId.FOLDER_CONTENTS:
        this.loadFolderContent(dataStatus);
        break;
    }
  }

  private handleLoadError(error: any, dataStatus: DataHandlerDataStatus) {
    if (this.errorCallback != null) {
      this.errorCallback(error, dataStatus);
    }
    this.spinner.hide();
  }

  private loadTemplateField(dataStatus: DataHandlerDataStatus) {
    this.templateFieldService.getTemplateField(dataStatus.id)
      .subscribe(templateField => {
          this.dataStore.setTemplateField(dataStatus.id, Object.assign(new TemplateField(), templateField));
          this.dataWasLoaded(dataStatus);
        },
        (error) => {
          this.handleLoadError(error, dataStatus);
        });
  }

  private loadTemplateElement(dataStatus: DataHandlerDataStatus) {
    this.templateElementService.getTemplateElement(dataStatus.id)
      .subscribe(templateElement => {
          this.dataStore.setTemplateElement(dataStatus.id, Object.assign(new TemplateElement(), templateElement));
          this.dataWasLoaded(dataStatus);
        },
        (error) => {
          this.handleLoadError(error, dataStatus);
        });
  }

  private loadTemplate(dataStatus: DataHandlerDataStatus) {
    this.templateService.getTemplate(dataStatus.id)
      .subscribe(template => {
          this.dataStore.setTemplate(dataStatus.id, Object.assign(new Template(), template));
          this.dataWasLoaded(dataStatus);
        },
        (error) => {
          this.handleLoadError(error, dataStatus);
        });
  }

  private loadTemplateInstance(dataStatus: DataHandlerDataStatus) {
    this.templateInstanceService.getTemplateInstance(dataStatus.id)
      .subscribe(templateInstance => {
          this.dataStore.setTemplateInstance(dataStatus.id, Object.assign(new TemplateInstance(), templateInstance));
          this.dataWasLoaded(dataStatus);
        },
        error => {
          this.handleLoadError(error, dataStatus);
        });
  }

  private loadFolderContent(dataStatus: DataHandlerDataStatus) {
    this.folderContentService.getFolderContent(dataStatus.id)
      .subscribe(folderContent => {
          this.dataStore.setFolderContent(dataStatus.id, Object.assign(new FolderContent(), folderContent));
          this.dataWasLoaded(dataStatus);
        },
        (error) => {
          this.handleLoadError(error, dataStatus);
        });
  }

  private dataWasLoaded(dataStatus: DataHandlerDataStatus) {
    dataStatus.loaded = true;
    this.checkCompletion();
  }

  private checkCompletion() {
    let allLoaded = true;
    this.dataIdMap.forEach((dataStatus: DataHandlerDataStatus) => {
      if (dataStatus.loaded === false && dataStatus.canceled === false) {
        allLoaded = false;
      }
    });
    if (allLoaded) {
      this.spinner.hide();
      if (this.preCallback != null) {
        this.preCallback();
      }
      if (this.successCallback != null) {
        this.successCallback();
      }
      this.dataAvailable = true;
    }
  }

  public dataIsAvailable() {
    return this.dataAvailable;
  }

}
