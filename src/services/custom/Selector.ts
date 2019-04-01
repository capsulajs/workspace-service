import { BehaviorSubject, Observable } from 'rxjs';
import { isKeyValid } from '../../../tests/__mocks__/helpers/validators';
import { errorMessage, validationMessages } from '../../../tests/__mocks__/helpers/messages';
import { map, take } from 'rxjs/operators';

interface SelectorInterface<T extends K, K> {
  input(inputRequest: InputRequest<T>): Promise<void>;
  output$(outputRequest: OutputRequest): Observable<T[]>;
  select(selectRequest: SelectRequest<K>): Promise<T>;
  selected$(selectedRequest: SelectedRequest): Observable<T>;
}

interface InputRequest<T> {
  data: Observable<T[]>;
}

interface OutputRequest {}

interface SelectRequest<K> {
  key: K;
}

interface SelectedRequest {}

export class Selector<T extends K, K> implements SelectorInterface<T, K> {
  private readonly data$: BehaviorSubject<T[]>;
  private readonly selectedSubject$: BehaviorSubject<T>;

  constructor() {
    this.selectedSubject$ = new BehaviorSubject<T>({} as T);
    this.data$ = new BehaviorSubject<T[]>([]);
  }

  public async input(inputRequest: InputRequest<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      inputRequest.data.subscribe({
        next: (item) => {
          this.data$.next(item);
          resolve();
        },
        error: error => reject(new Error(error))
      });
    });
  }

  public output$(outputRequest: OutputRequest): Observable<T[]> {
    return this.data$;
  }

  public select(selectRequest: SelectRequest<K>): Promise<T> {
    if (this.data$.getValue() === []) {
      return Promise.reject(new Error(errorMessage.noData))
    }

    if (!isKeyValid(selectRequest)) {
      return Promise.reject(new Error(validationMessages.keyIsNotCorrect));
    }

    const requestKeys = Object.keys(selectRequest.key);
    if (requestKeys.every(requestKey => {
      return Object.keys(this.selectedSubject$.getValue()).includes(requestKey) &&
        this.selectedSubject$.getValue()[requestKey] === selectRequest.key[requestKey]
    })) {
      return Promise.reject(new Error(errorMessage.alreadySelected));
    }

    return new Promise((resolve, reject) => {
      this.data$.pipe(
          take(1),
          map((items) => items.find((item, index) => {
              const itemKeys = Object.keys(item);
              return requestKeys.every(requestKey =>
                itemKeys.some(itemKey =>
                  itemKey.includes(requestKey) && items[index][itemKey] === selectRequest.key[requestKey]
                ));
            })))
        .subscribe((item) => {
          if (!item) {
            return reject(new Error(errorMessage.notFound));
          }
          this.selectedSubject$.next(item as T);
          resolve();
        });
    });
  }

  public selected$(selectedRequest: SelectedRequest): Observable<T> {
    return this.selectedSubject$;
  }
}
