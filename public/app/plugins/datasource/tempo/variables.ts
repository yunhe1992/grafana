import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataQueryRequest, DataQueryResponse, CustomVariableSupport } from '@grafana/data';

import { TempoVariableQuery, TempoVariableQueryEditor } from './VariableQueryEditor';
import { TempoDatasource } from './datasource';

export class TempoVariableSupport extends CustomVariableSupport<TempoDatasource, TempoVariableQuery> {
  editor = TempoVariableQueryEditor;

  constructor(private datasource: TempoDatasource) {
    super();
    this.query = this.query.bind(this);
  }

  async execute(query: TempoVariableQuery) {
    if (this.datasource === undefined || this.datasource.metricFindQuery === undefined) {
      throw new Error('Datasource not initialized');
    }

    return this.datasource.metricFindQuery(query);
  }

  query(request: DataQueryRequest<TempoVariableQuery>): Observable<DataQueryResponse> {
    const result = this.execute(request.targets[0]);
    return from(result).pipe(map((data) => ({ data })));
  }
}
