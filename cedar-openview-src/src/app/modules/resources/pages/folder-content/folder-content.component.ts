import {Component, OnInit} from '@angular/core';
import {DataStoreService} from '../../../../services/data-store.service';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CedarPageComponent} from '../../../shared/components/base/cedar-page-component.component';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-alt-snotify';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {DataHandlerDataId} from '../../../shared/model/data-handler-data-id.model';
import {DataHandlerDataStatus} from '../../../shared/model/data-handler-data-status.model';
import {HttpClient} from '@angular/common/http';
import {UiService} from '../../../../services/ui.service';
import {AppConfigService} from '../../../../services/app-config.service';
import {FolderContent} from '../../../../shared/model/folder-content.model';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-folder-content',
  templateUrl: './folder-content.component.html',
  styleUrls: ['./folder-content.component.scss']
})
export class FolderContentComponent extends CedarPageComponent implements OnInit {

  folderId: string = null;
  folderContents: FolderContent = null;
  folderStatus: number = null;
  cedarLink: string = null;

  mode = 'view';

  constructor(
    protected localSettings: LocalSettingsService,
    public translateService: TranslateService,
    public notify: SnotifyService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dataStore: DataStoreService,
    protected dataHandler: DataHandlerService,
    private http: HttpClient,
    private uiService: UiService,
    private configService: AppConfigService
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
  }

  ngOnInit() {
    this.initDataHandler();
    this.folderId = this.route.snapshot.paramMap.get('folderId');
    this.cedarLink = environment.cedarUrl + 'dashboard?folderId=' + encodeURIComponent(this.folderId);
    console.log(this.folderId);
    console.log(this.cedarLink);
    this.dataHandler
      .requireId(DataHandlerDataId.FOLDER_CONTENTS, this.folderId)
      .load(() => this.dataLoadedCallback(), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }

  private dataLoadedCallback() {
    this.folderContents = this.dataStore.getFolderContent(this.folderId);
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.folderStatus = error.status;
  }

  public openFolder(folderId: string): void {
    const url = '/folders/' + encodeURIComponent(folderId);
    this.navigateByUrlThen(url).then(_ => {
      this.ngOnInit();
    });
  }

  public openArtifact(artifactType: string, artifactId: string): void {
    let url = '';
    switch (artifactType) {
      case 'field':
        url = '/template-fields/';
        break;
      case 'element':
        url = '/template-elements/';
        break;
      case 'template':
        url = '/templates/';
        break;
      case 'instance':
        url = '/template-instances/';
        break;
    }
    url += encodeURIComponent(artifactId);
    this.navigateByUrlThen(url).then(_ => {
      this.ngOnInit();
    });
  }

}


