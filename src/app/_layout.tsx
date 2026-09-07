import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

function CenteredTabBar({ state, navigation }: { state: any; navigation: any }) {
  return (
    <View pointerEvents="box-none" style={styles.tabBarWrapper}>
      <View style={styles.liquidGlassCapsule}>
        {/* Layer 1: High-intensity Optical Blur */}
        <BlurView
          intensity={95}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2: Glossy specular sheen (simulating curved liquid glass reflection) */}
        <View style={styles.liquidGleam} />

        {/* Layer 3: Razor-sharp refractive glass perimeter */}
        <View style={styles.glassRefractionBorder} />

        {/* Tab Icons */}
        <View style={styles.iconsRow}>
          {state.routes.map((route: { key: string; name: string }, index: number) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Central Plan (+) Action Button
            if (route.name === 'plan') {
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  activeOpacity={0.85}
                  style={styles.plusPill}
                >
                  <Ionicons name="add" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              );
            }

            // Standard Navigation Icons
            let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
            if (route.name === 'index') {
              iconName = isFocused ? 'home' : 'home-outline';
            } else if (route.name === 'explore') {
              iconName = isFocused ? 'compass' : 'compass-outline';
            } else if (route.name === 'profile') {
              iconName = isFocused ? 'person' : 'person-outline';
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? Colors.light.text : Colors.light.textTertiary}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CenteredTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="plan" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liquidGlassCapsule: {
    width: 260,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.12)', // Water-like clear refraction
    // Multi-layer ambient drop shadow for physical elevation
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 28,
    elevation: 0,
    justifyContent: 'center',
  },
  liquidGleam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)', // Upper highlight reflection
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  glassRefractionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    borderWidth: 0.75,
    borderColor: 'rgba(255, 255, 255, 0.75)', // Crisp, polished outer edge
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
  },
  tabItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle button lift
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});