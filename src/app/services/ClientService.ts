import {Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';

export interface ClientService {
  name: string;
  login(email: string, password: string): Observable<HttpResponse<boolean>>;

}
