export const getTypeIcon = (type) => {
  switch (type) {
    case 'health-aid':
      return '/static/icons/aid-marker.png';
    case 'animal-aid':
      return '/static/icons/animal-marker.png';
    case 'law-aid':
      return '/static/icons/law-marker.png';
    case 'blood-aid':
      return '/static/icons/blood-marker.png';
    case 'medical-aid':
      return '/static/icons/medical-marker.png';
    case 'psych-aid':
      return '/static/icons/psych-marker.png';
    case 'translate-aid':
      return '/static/icons/translate-marker.png';
    case 'food-aid':
      return '/static/icons/warmfood-marker.png';
    default:
      return '/static/icons/standard-marker.png';
  }
};