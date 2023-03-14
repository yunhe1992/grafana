import React, { lazy } from 'react';
import { Disable, Enable } from 'react-enable';
import { AlertingPageWrapper } from './components/AlertingPageWrapper';

import { AlertingFeature } from './features';

const AdminV1 = lazy(/* webpackChunkName: "alerting.admin.v1" */() => import('./components/admin/Admin.v1'));
const AdminV2 = lazy(/* webpackChunkName: "alerting.admin.v2" */() => import('./components/admin/Admin.v2'));

export default function Admin() {
  return (
    <AlertingPageWrapper pageId="alerting-admin">
      <Enable feature={AlertingFeature.AdminNext}>
        <AdminV2 />
      </Enable>
      <Disable feature={AlertingFeature.AdminNext}>
        <AdminV1 />
      </Disable>
    </AlertingPageWrapper>
  );
}
