import React from 'react';

import { ExternalAlertmanagers } from './ExternalAlertmanagers';

import { alertmanagerApi } from '../../api/alertmanagerApi';

const AdminV2 = (): JSX.Element => {
  const fetchExternalAlertmanagerConfig = alertmanagerApi.useGetAlertmanagerChoiceStatusQuery();

  if (fetchExternalAlertmanagerConfig.isLoading) {
    return <>Loading...</>;
  }

  if (fetchExternalAlertmanagerConfig.isError) {
    return <>{String(fetchExternalAlertmanagerConfig.error)}</>;
  }

  return <ExternalAlertmanagers test-id="admin-externalalertmanagers" />;
};

export default AdminV2;
