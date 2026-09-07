import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'stays', label: 'Stays', icon: 'bed-outline' },
  { id: 'flights', label: 'Flights', icon: 'airplane-outline' },
  { id: 'trains', label: 'Transit', icon: 'train-outline' },
] as const;

const BOOKINGS = [
  {
    id: '1',
    category: 'stays',
    title: 'Kyoto Granbell Hotel',
    reference: 'RES-882194',
    date: 'Oct 14 – Oct 18, 2026',
    status: 'Confirmed',
    badgeColor: '#10B981',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80',
    details: 'Superior Double Room • 4 Nights',
  },
  {
    id: '2',
    category: 'trains',
    title: 'Shinkansen Nozomi (Tokyo → Kyoto)',
    reference: 'TKT-99120',
    date: 'Oct 14, 2026 • 08:30 AM',
    status: 'Ready',
    badgeColor: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&auto=format&fit=crop&q=80',
    details: 'Car 5, Seat 12A (Window)',
  },
  {
    id: '3',
    category: 'flights',
    title: 'KIX → HND (ANA NH038)',
    reference: 'FL-33019',
    date: 'Oct 22, 2026 • 06:15 PM',
    status: 'Confirmed',
    badgeColor: '#10B981',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=80',
    details: 'Terminal 1 • Gate 14',
  },
];

export default function BookingsScreen() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = BOOKINGS.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>CONFIRMATIONS & PASSES</Text>
            <Text style={styles.headerTitle}>My Bookings</Text>
          </View>
          <TouchableOpacity style={styles.addBookingBtn}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addBookingText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
              >
                <Ionicons
                  name={cat.icon}
                  size={15}
                  color={isSelected ? '#FFFFFF' : Colors.light.textSecondary}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Reservation Cards */}
        <View style={styles.listContainer}>
          {filtered.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <View style={styles.cardBody}>
                <View style={styles.statusRow}>
                  <View style={[styles.statusIndicator, { backgroundColor: item.badgeColor }]} />
                  <Text style={[styles.statusText, { color: item.badgeColor }]}>{item.status}</Text>
                  <Text style={styles.referenceText}>• {item.reference}</Text>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardDetails}>{item.details}</Text>

                {/* Practical Utility Buttons */}
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.secondaryActionBtn}>
                    <Ionicons name="document-text-outline" size={14} color={Colors.light.textSecondary} />
                    <Text style={styles.secondaryActionText}>Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.primaryActionBtn}>
                    <Ionicons name="qr-code" size={14} color="#FFFFFF" />
                    <Text style={styles.primaryActionText}>View Ticket</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  headerSub: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '700',
    color: Colors.light.textTertiary,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.4,
  },
  addBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.backgroundSelected,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.pill,
  },
  addBookingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  filterScroll: {
    paddingHorizontal: Spacing.four,
    gap: 8,
    paddingBottom: Spacing.three,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundElement,
  },
  filterPillActive: {
    backgroundColor: Colors.light.backgroundSelected,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
  },
  cardImage: {
    width: '100%',
    height: 125,
  },
  cardBody: {
    padding: Spacing.three,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  referenceText: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  cardDetails: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    marginTop: 3,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: Border.hairline,
    borderTopColor: Colors.light.border,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundElement,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundSelected,
  },
  primaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});