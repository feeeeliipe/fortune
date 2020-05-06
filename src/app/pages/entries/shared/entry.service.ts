import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { CategoryService } from './../../categories/shared/category.service'
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { flatMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) { 
    super('api/entries', injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  // PRIVATE METHODS 
  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    // FAZ O RELACIONAMENTO FORÇADO DO LANÇAMENTO COM A CATEGORIA
    // IMPLEMENTAÇÃO REALIZADA APENAS PORQUE ESTAMOS UTILIZANDO UM BACKEND MOCK
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    )  
  }
}
