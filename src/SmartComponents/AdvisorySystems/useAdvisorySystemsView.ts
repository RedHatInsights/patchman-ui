import useFeatureFlag from '../../Utilities/hooks/useFeatureFlag';

const useAdvisorySystemsViewFeatureFlag = () => {
  const hasUnleashFlag = useFeatureFlag('patch-frontend.advisory-systems-view');
  const hasLocalFlag = localStorage.getItem('patch-frontend.advisory-systems-view') === 'true';
  return hasUnleashFlag || hasLocalFlag;
};

export default useAdvisorySystemsViewFeatureFlag;
