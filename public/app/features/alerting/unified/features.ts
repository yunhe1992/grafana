import { FeatureDescription } from 'react-enable/dist/FeatureState';

export enum AlertingFeature {
  NotificationPoliciesV2MatchingInstances = 'notification-policies.v2.matching-instances',
  AdminNext = 'admin.next',
}

const FEATURES: FeatureDescription[] = [
  {
    name: AlertingFeature.NotificationPoliciesV2MatchingInstances,
    defaultValue: false,
  }, {
    name: AlertingFeature.AdminNext,
    defaultValue: false,
  }
];

export default FEATURES;
