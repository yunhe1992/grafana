import React from "react";

import AlertmanagerConfig from '../../components/admin/AlertmanagerConfig';
import { ExternalAlertmanagers } from '../../components/admin/ExternalAlertmanagers';
import { useAlertManagerSourceName } from '../../hooks/useAlertManagerSourceName';
import { useAlertManagersByPermission } from '../../hooks/useAlertManagerSources';
import { GRAFANA_RULES_SOURCE_NAME } from '../../utils/datasource';

const AdminV1 = () => {
  const alertManagers = useAlertManagersByPermission('notification');
  const [alertManagerSourceName] = useAlertManagerSourceName(alertManagers);

  const isGrafanaAmSelected = alertManagerSourceName === GRAFANA_RULES_SOURCE_NAME;

  return (
    <>
      <AlertmanagerConfig test-id="admin-alertmanagerconfig" />
      {isGrafanaAmSelected && <ExternalAlertmanagers test-id="admin-externalalertmanagers" />}
    </>
  );
}

export default AdminV1
