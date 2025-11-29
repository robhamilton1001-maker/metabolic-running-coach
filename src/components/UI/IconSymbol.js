import { MaterialIcons } from '@expo/vector-icons';

// Mapping our custom names to MaterialIcons names
const MAPPING = {
  // Navigation & General
  'house.fill': 'home',
  'person': 'person',
  'fitness-center': 'fitness-center',
  'calendar': 'calendar-today',
  'stopwatch': 'timer',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'chevron.down': 'keyboard-arrow-down',
  'xmark': 'close',
  'magnifyingglass': 'search',
  'bell': 'notifications',
  'gear': 'settings',
  'arrow.clockwise': 'refresh',
  'ellipsis': 'more-horiz',
  'checkmark.circle.fill': 'check-circle',
  'doc.text.fill': 'description',
  
  // Profile & Stats
  'chart.bar.fill': 'bar-chart',
  'trophy.fill': 'emoji-events',
  'figure.run': 'directions-run',
  
  // Workout Player
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'stop.fill': 'stop',
};

export function IconSymbol({ name, size = 24, color, style }) {
  // Default to 'help' icon if name not found
  const iconName = MAPPING[name] || 'help-outline';
  return <MaterialIcons name={iconName} size={size} color={color} style={style} />;
}